import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, key)
}

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// GET — list products
export async function GET(req: NextRequest) {
  const supabase = adminClient()
  const { searchParams } = new URL(req.url)
  const page     = Number(searchParams.get('page') || 1)
  const limit    = Number(searchParams.get('limit') || 50)
  const category = searchParams.get('category')
  const search   = searchParams.get('search')

  let query = supabase
    .from('gf_products')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (category) query = query.eq('category', category)
  if (search)   query = query.ilike('name', `%${search}%`)

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data, total: count, page, limit })
}

// POST — create product
export async function POST(req: NextRequest) {
  const supabase = adminClient()

  try {
    const body = await req.json()
    const {
      name, sku, category, description,
      fabricType, color, printType, weightGsm,
      mrp, sellingPrice, costPrice,
      gstRate, hsnCode, stock, minOrderMtr, maxOrderMtr,
      occasion, washCare, cloudinaryUrl, cloudinaryUrls,
      isActive, isFeatured, tags,
    } = body

    if (!name || !sellingPrice) {
      return NextResponse.json({ error: 'name and sellingPrice are required' }, { status: 400 })
    }

    const row: Record<string, unknown> = {
      name:         name.trim(),
      sku:          sku || name.replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 12),
      slug:         toSlug(name),
      category:     category || 'Plain Fabrics',
      description:  description || '',
      fabric_type:  fabricType || '',
      color:        color || '',
      print_type:   printType || '',
      mrp:          Number(mrp) || Number(sellingPrice),
      selling_price: Number(sellingPrice),
      is_active:    isActive !== undefined ? isActive : true,
      is_featured:  isFeatured || false,
      tags:         Array.isArray(tags) ? tags : [],
    }

    // Optional columns — only set if provided
    if (weightGsm)    row.weight_gsm     = Number(weightGsm)
    if (costPrice)    row.cost_price     = Number(costPrice)
    if (gstRate)      row.gst_rate       = String(gstRate)
    if (hsnCode)      row.hsn_code       = String(hsnCode)
    if (stock)        row.stock_metres   = Number(stock)
    if (minOrderMtr)  row.min_order_mtr  = Number(minOrderMtr)
    if (maxOrderMtr)  row.max_order_mtr  = Number(maxOrderMtr)
    if (occasion)     row.occasion       = String(occasion)
    if (washCare)     row.wash_care      = String(washCare)
    if (cloudinaryUrl)  row.cloudinary_url  = String(cloudinaryUrl)
    if (cloudinaryUrls) row.cloudinary_urls = cloudinaryUrls

    const { data, error } = await supabase
      .from('gf_products')
      .insert(row)
      .select()
      .single()

    if (error) {
      console.error('Insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (err) {
    console.error('POST /api/admin/products error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// PATCH — update product
export async function PATCH(req: NextRequest) {
  const supabase = adminClient()
  const body = await req.json()
  const { id, ...updates } = body

  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const { data, error } = await supabase
    .from('gf_products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

// DELETE — delete product
export async function DELETE(req: NextRequest) {
  const supabase = adminClient()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const { error } = await supabase.from('gf_products').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
