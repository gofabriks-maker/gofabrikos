import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

// GET /api/admin/orders — list orders with filters
export async function GET(req: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(req.url)

    const status  = searchParams.get('status')
    const search  = searchParams.get('search')
    const page    = parseInt(searchParams.get('page') || '1')
    const limit   = parseInt(searchParams.get('limit') || '20')
    const offset  = (page - 1) * limit

    let query = supabase
      .from('gf_orders')
      .select(`
        id, order_number, status, total_amount, subtotal, gst_amount,
        payment_status, payment_mode, shipping_name, shipping_phone,
        shipping_address, shipping_city, shipping_state, shipping_pincode,
        notes, created_at, updated_at,
        gf_customers ( id, full_name, email, phone, city, customer_type ),
        gf_order_items (
          id, quantity_meters, unit_price, total_price, notes,
          gf_products ( id, name, sku, category, color )
        ),
        gf_order_timeline ( status, note, created_at )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }
    if (search) {
      query = query.or(`order_number.ilike.%${search}%,shipping_name.ilike.%${search}%`)
    }

    const { data, count, error } = await query
    if (error) throw error

    return NextResponse.json({ orders: data, total: count, page, limit })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PATCH /api/admin/orders — update order status
export async function PATCH(req: NextRequest) {
  try {
    const supabase = createAdminClient()
    const body = await req.json()
    const { id, status, note } = body

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 })
    }

    // Update order status
    const { error: orderErr } = await supabase
      .from('gf_orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (orderErr) throw orderErr

    // Add timeline entry
    await supabase
      .from('gf_order_timeline')
      .insert({ order_id: id, status, note: note || `Status updated to ${status}` })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
