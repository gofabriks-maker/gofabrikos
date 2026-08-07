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
  const page   = Number(searchParams.get('page') || 1)
  const limit  = Number(searchParams.get('limit') || 50)
  const search = searchParams.get('search')
  const cat    = searchParams.get('category')

  let query = supabase
    .from('gf_products')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (search) query = query.ilike('name', `%${search}%`)
  if (cat)    query = query.eq('category', cat)

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data, total: count, page, limit })
}

// POST — create product
// Field mapping from form payload → gf_products columns:
//   name             → name
//   sku              → sku
//   category         → category          (TEXT column added via ALTER TABLE)
//   description      → description
//   fabricType       → fabric_type
//   color            → color
//   printType        → print_type
//   weightGsm        → gsm
//   mrp              → original_price
//   sellingPrice     → price
//   costPrice        → cost_price
//   gstRate          → gst_rate
//   hsnCode          → hsn_code
//   stock            → stock_metres      (NUMERIC column added via ALTER TABLE)
//   minOrderMtr      → min_order_mtr     (INT column added via ALTER TABLE)
//   occasion         → occasion          (TEXT column added via ALTER TABLE)
//   washCare         → wash_care         (TEXT[] — wrap in array)
//   cloudinaryUrl    → cloudinary_url    (TEXT column added via ALTER TABLE)
//                   AND images JSONB     (native gf_products column)
//   isActive         → is_active
//   isFeatured       → is_featured
//   tags             → tags              (TEXT[] column added via ALTER TABLE)
export async function POST(req: NextRequest) {
  const supabase = adminClient()

  try {
    const body = await req.json()
    const {
      name, sku, category, description,
      fabricType, color, printType, weightGsm,
      mrp, sellingPrice, costPrice,
      gstRate, hsnCode, stock, minOrderMtr,
      occasion, washCare, cloudinaryUrl,
      isActive, isFeatured, tags,
    } = body

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 })
    }
    if (!sellingPrice) {
      return NextResponse.json({ error: 'Selling price is required' }, { status: 400 })
    }

    const slug = toSlug(name.trim())
    // Append 4-digit timestamp suffix to ensure SKU uniqueness
    const skuBase = name.replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 8)
    const skuSuffix = Date.now().toString().slice(-4)
    const generatedSku = sku || (skuBase + skuSuffix)

    // Build images JSONB from cloudinaryUrl
    const imagesJson = cloudinaryUrl
      ? [{ url: cloudinaryUrl, public_id: '', is_main: true, sort: 0 }]
      : []

    const row: Record<string, unknown> = {
      name:            name.trim(),
      sku:             generatedSku,
      slug,
      price:           Number(sellingPrice),
      is_active:       isActive !== undefined ? isActive : true,
      is_featured:     isFeatured || false,
    }

    // Optional — set if provided
    if (category)      row.category           = String(category)
    if (description)   row.description        = String(description)
    if (fabricType)    row.fabric_type        = String(fabricType)
    if (color)         row.color              = String(color)
    if (printType)     row.print_type         = String(printType)
    if (weightGsm)     row.gsm               = Number(weightGsm)
    if (mrp)           row.original_price     = Number(mrp)
    if (costPrice)     row.cost_price         = Number(costPrice)
    if (gstRate)       row.gst_rate           = Number(String(gstRate).replace('%', ''))
    if (hsnCode)       row.hsn_code           = String(hsnCode)
    if (stock)         row.stock_metres       = Number(stock)
    if (minOrderMtr)   row.min_order_mtr      = Number(minOrderMtr)
    if (occasion)      row.occasion           = String(occasion)
    if (washCare)      row.wash_care          = [String(washCare)]   // TEXT[] column
    if (cloudinaryUrl) row.cloudinary_url     = String(cloudinaryUrl)
    if (imagesJson.length) row.images         = imagesJson
    if (tags?.length)  row.tags              = Array.isArray(tags) ? tags : [tags]

    const { data, error } = await supabase
      .from('gf_products')
      .insert(row)
      .select()
      .single()

    if (error) {
      console.error('Insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Auto-create inventory roll so the new product appears in Inventory immediately
    if (data?.id) {
      const productName = name.trim()
      const shadeCode = productName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 3) + '-001'
      const { count } = await supabase.from('gf_inventory').select('*', { count: 'exact', head: true })
      const rollNum = 'RL-' + new Date().getFullYear() + '-' + String((count || 0) + 1).padStart(4, '0')
      const stockAmt = stock ? Number(stock) : 0
      await supabase.from('gf_inventory').insert({
        product_id:       data.id,
        roll_number:      rollNum,
        shade_code:       shadeCode,
        total_metres:     stockAmt,
        available_metres: stockAmt,
        reserved_metres:  0,
        damaged_metres:   0,
        cost_price:       costPrice ? Number(costPrice) : null,
        status:           stockAmt === 0 ? 'exhausted' : stockAmt < 15 ? 'low' : 'active',
        rack_location:    null,
        received_date:    new Date().toISOString().split('T')[0],
      })
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
