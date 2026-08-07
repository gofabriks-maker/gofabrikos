import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function genOrderNumber() {
  const yr  = new Date().getFullYear()
  const rnd = Math.floor(1000 + Math.random() * 9000)
  return `GF-${yr}-${rnd}`
}

// POST /api/orders — place a new order from cart
export async function POST(req: NextRequest) {
  try {
    const supabase = adminClient()
    const body = await req.json()

    const {
      customerName, customerPhone, customerEmail,
      shippingAddress, shippingCity, shippingState, shippingPincode,
      items,           // [{ productId, productName, productSlug, productImage, quantityMetres, unitPrice }]
      couponCode,
      paymentMode,     // 'cod' | 'upi' | 'whatsapp'
      source,          // 'website' | 'whatsapp'
      notes,
    } = body

    if (!customerName || !customerPhone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 })
    }
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Calculate totals
    const subtotal    = items.reduce((sum: number, it: any) => sum + it.unitPrice * it.quantityMetres, 0)
    let discountAmt   = 0
    if (couponCode === 'NAARI10') discountAmt = Math.round(subtotal * 0.1)
    const deliveryChrg= subtotal >= 4999 ? 0 : 99
    const gstAmt      = 0  // GST included in price
    const totalAmount = subtotal - discountAmt + deliveryChrg

    // Ensure unique order number
    let orderNumber = genOrderNumber()
    const { data: existing } = await supabase
      .from('gf_orders').select('id').eq('order_number', orderNumber).single()
    if (existing) orderNumber = genOrderNumber() + '-' + Date.now().toString().slice(-3)

    // Insert order
    const { data: order, error: orderErr } = await supabase
      .from('gf_orders')
      .insert({
        order_number:     orderNumber,
        status:           'pending',
        customer_name:    customerName.trim(),
        customer_phone:   customerPhone.trim(),
        customer_email:   customerEmail?.trim() || null,
        shipping_address: shippingAddress || null,
        shipping_city:    shippingCity    || null,
        shipping_state:   shippingState   || null,
        shipping_pincode: shippingPincode || null,
        subtotal,
        discount_amount:  discountAmt,
        coupon_code:      couponCode || null,
        gst_amount:       gstAmt,
        delivery_charge:  deliveryChrg,
        total_amount:     totalAmount,
        payment_status:   paymentMode === 'cod' ? 'pending' : 'pending',
        payment_mode:     paymentMode || 'cod',
        source:           source || 'website',
        notes:            notes || null,
      })
      .select()
      .single()

    if (orderErr) {
      console.error('Order insert error:', orderErr)
      return NextResponse.json({ error: orderErr.message }, { status: 500 })
    }

    // Insert order items
    const orderItems = items.map((it: any) => ({
      order_id:       order.id,
      product_id:     it.productId   || null,
      product_name:   it.productName,
      product_slug:   it.productSlug || null,
      product_image:  it.productImage|| null,
      quantity_metres:Number(it.quantityMetres),
      unit_price:     Number(it.unitPrice),
      total_price:    Number(it.unitPrice) * Number(it.quantityMetres),
    }))

    const { error: itemsErr } = await supabase.from('gf_order_items').insert(orderItems)
    if (itemsErr) console.error('Order items error:', itemsErr)

    // Insert first timeline entry
    await supabase.from('gf_order_timeline').insert({
      order_id: order.id,
      status:   'pending',
      note:     'Order placed successfully',
    })

    return NextResponse.json({
      success:     true,
      orderId:     order.id,
      orderNumber: order.order_number,
      totalAmount,
    }, { status: 201 })

  } catch (err: any) {
    console.error('POST /api/orders error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// GET /api/orders?phone=xxx — customer order history by phone
export async function GET(req: NextRequest) {
  try {
    const supabase = adminClient()
    const { searchParams } = new URL(req.url)
    const phone    = searchParams.get('phone')
    const orderId  = searchParams.get('id')

    if (orderId) {
      const { data, error } = await supabase
        .from('gf_orders')
        .select(`*, gf_order_items(*), gf_order_timeline(*)`)
        .eq('id', orderId)
        .single()
      if (error) return NextResponse.json({ error: error.message }, { status: 404 })
      return NextResponse.json({ order: data })
    }

    if (!phone) return NextResponse.json({ error: 'phone required' }, { status: 400 })

    const { data, error } = await supabase
      .from('gf_orders')
      .select(`*, gf_order_items(*)`)
      .eq('customer_phone', phone.trim())
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ orders: data || [] })

  } catch (err: any) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
