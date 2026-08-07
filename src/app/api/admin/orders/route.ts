import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// GET /api/admin/orders — list orders with filters, search, pagination
export async function GET(req: NextRequest) {
  try {
    const supabase = adminClient()
    const { searchParams } = new URL(req.url)

    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page   = parseInt(searchParams.get('page')  || '1')
    const limit  = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    let query = supabase
      .from('gf_orders')
      .select(`
        id, order_number, status,
        customer_name, customer_phone, customer_email,
        shipping_address, shipping_city, shipping_state, shipping_pincode,
        subtotal, discount_amount, coupon_code, gst_amount,
        delivery_charge, total_amount,
        payment_status, payment_mode, payment_ref,
        courier_name, tracking_number,
        source, notes, created_at, updated_at,
        gf_order_items (
          id, product_name, product_slug, product_image,
          quantity_metres, unit_price, total_price
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }
    if (search) {
      query = query.or(
        `order_number.ilike.%${search}%,customer_name.ilike.%${search}%,customer_phone.ilike.%${search}%`
      )
    }

    const { data, count, error } = await query
    if (error) throw error

    return NextResponse.json({ orders: data || [], total: count || 0, page, limit })
  } catch (err: any) {
    console.error('GET /api/admin/orders error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PATCH /api/admin/orders — update order status + optional courier/tracking
export async function PATCH(req: NextRequest) {
  try {
    const supabase = adminClient()
    const body = await req.json()
    const { id, status, note, courier_name, tracking_number } = body

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 })
    }

    // Build update payload
    const updatePayload: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    }
    if (courier_name)    updatePayload.courier_name    = courier_name
    if (tracking_number) updatePayload.tracking_number = tracking_number

    // Update order
    const { error: orderErr } = await supabase
      .from('gf_orders')
      .update(updatePayload)
      .eq('id', id)

    if (orderErr) throw orderErr

    // Add timeline entry
    await supabase.from('gf_order_timeline').insert({
      order_id: id,
      status,
      note: note || `Status updated to ${status}`,
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('PATCH /api/admin/orders error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
