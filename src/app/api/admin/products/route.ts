import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

// GET /api/admin/products — list products
export async function GET(req: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(req.url)

    const category = searchParams.get('category')
    const status   = searchParams.get('status')
    const search   = searchParams.get('search')
    const page     = parseInt(searchParams.get('page') || '1')
    const limit    = parseInt(searchParams.get('limit') || '20')
    const offset   = (page - 1) * limit

    let query = supabase
      .from('gf_products')
      .select(`
        id, name, sku, slug, category, fabric_type, color, print_type,
        width_inches, weight_gsm, mrp, selling_price, cost_price,
        gst_rate, hsn_code, stock_meters, min_order_meters, max_order_meters,
        is_active, is_featured, approval_status, cloudinary_url,
        wash_care, occasion, description, created_at, updated_at
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (category && category !== 'all') query = query.eq('category', category)
    if (status === 'active')   query = query.eq('is_active', true).eq('approval_status', 'approved')
    if (status === 'draft')    query = query.eq('approval_status', 'draft')
    if (status === 'inactive') query = query.eq('is_active', false)
    if (search) query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%,category.ilike.%${search}%`)

    const { data, count, error } = await query
    if (error) throw error

    return NextResponse.json({ products: data, total: count, page, limit })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/admin/products — create new product
export async function POST(req: NextRequest) {
  try {
    const supabase = createAdminClient()
    const body = await req.json()

    // Generate slug from name
    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()

    const { data, error } = await supabase
      .from('gf_products')
      .insert({
        name:             body.name,
        sku:              body.sku,
        slug:             `${slug}-${Date.now()}`,
        category:         body.category,
        description:      body.description,
        fabric_type:      body.fabricType,
        color:            body.color,
        print_type:       body.printType,
        width_inches:     parseFloat(body.width) || 44,
        weight_gsm:       parseInt(body.weightGsm) || null,
        mrp:              parseFloat(body.mrp) || 0,
        selling_price:    parseFloat(body.sellingPrice) || 0,
        cost_price:       parseFloat(body.costPrice) || 0,
        gst_rate:         body.gstRate === '12%' ? 12 : 5,
        hsn_code:         body.hsnCode || '5007',
        stock_meters:     parseFloat(body.stock) || 0,
        min_order_meters: parseFloat(body.minOrderMtr) || 1,
        max_order_meters: body.maxOrderMtr ? parseFloat(body.maxOrderMtr) : null,
        occasion:         body.occasion,
        wash_care:        body.washCare,
        cloudinary_url:   body.cloudinaryUrl,
        is_active:        body.isActive !== false,
        is_featured:      body.isFeatured === true,
        approval_status:  body.isActive !== false ? 'approved' : 'draft',
        tags:             body.tags || [],
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ product: data }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PATCH /api/admin/products — update product
export async function PATCH(req: NextRequest) {
  try {
    const supabase = createAdminClient()
    const body = await req.json()
    const { id, ...updates } = body

    if (!id) return NextResponse.json({ error: 'Missing product id' }, { status: 400 })

    // Map frontend field names to DB column names
    const dbUpdates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    }
    if (updates.name)          dbUpdates.name           = updates.name
    if (updates.sku)           dbUpdates.sku            = updates.sku
    if (updates.category)      dbUpdates.category       = updates.category
    if (updates.description)   dbUpdates.description    = updates.description
    if (updates.fabricType)    dbUpdates.fabric_type    = updates.fabricType
    if (updates.color)         dbUpdates.color          = updates.color
    if (updates.printType)     dbUpdates.print_type     = updates.printType
    if (updates.width)         dbUpdates.width_inches   = parseFloat(updates.width)
    if (updates.weightGsm)     dbUpdates.weight_gsm     = parseInt(updates.weightGsm)
    if (updates.mrp)           dbUpdates.mrp            = parseFloat(updates.mrp)
    if (updates.sellingPrice)  dbUpdates.selling_price  = parseFloat(updates.sellingPrice)
    if (updates.costPrice)     dbUpdates.cost_price     = parseFloat(updates.costPrice)
    if (updates.gstRate)       dbUpdates.gst_rate       = updates.gstRate === '12%' ? 12 : 5
    if (updates.hsnCode)       dbUpdates.hsn_code       = updates.hsnCode
    if (updates.stock)         dbUpdates.stock_meters   = parseFloat(updates.stock)
    if (updates.minOrderMtr)   dbUpdates.min_order_meters = parseFloat(updates.minOrderMtr)
    if (updates.occasion)      dbUpdates.occasion       = updates.occasion
    if (updates.washCare)      dbUpdates.wash_care      = updates.washCare
    if (updates.cloudinaryUrl) dbUpdates.cloudinary_url = updates.cloudinaryUrl
    if (updates.tags)          dbUpdates.tags           = updates.tags
    if (typeof updates.isActive   !== 'undefined') {
      dbUpdates.is_active = updates.isActive
      dbUpdates.approval_status = updates.isActive ? 'approved' : 'draft'
    }
    if (typeof updates.isFeatured !== 'undefined') dbUpdates.is_featured = updates.isFeatured

    const { data, error } = await supabase
      .from('gf_products')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ product: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE /api/admin/products — soft delete (set is_active = false)
export async function DELETE(req: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ error: 'Missing product id' }, { status: 400 })

    const { error } = await supabase
      .from('gf_products')
      .update({ is_active: false, approval_status: 'archived', updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
