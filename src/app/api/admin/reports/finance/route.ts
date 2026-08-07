import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// GST rate config per category (IGST/CGST+SGST on fabric)
const GST_RATE = 5  // 5% on fabric (HSN 5007 / 5208 etc.)

export async function GET(req: NextRequest) {
  try {
    const supabase = db()
    const { searchParams } = new URL(req.url)
    const range    = searchParams.get('range') || 'monthly'
    const dateFrom = searchParams.get('from')  || ''
    const dateTo   = searchParams.get('to')    || ''

    const now = new Date()
    let from: Date, to: Date = new Date(now)
    to.setHours(23, 59, 59, 999)

    if (dateFrom && dateTo) {
      from = new Date(dateFrom); to = new Date(dateTo); to.setHours(23,59,59,999)
    } else {
      switch (range) {
        case 'daily':   from = new Date(now); from.setHours(0,0,0,0); break
        case 'weekly':  from = new Date(now); from.setDate(now.getDate()-6); from.setHours(0,0,0,0); break
        case 'yearly':  from = new Date(now.getFullYear(), 0, 1); break
        default:        from = new Date(now.getFullYear(), now.getMonth(), 1)
      }
    }

    const { data: orders, error } = await supabase
      .from('gf_orders')
      .select(`
        id, order_number, status, payment_status, payment_mode, payment_ref,
        customer_name, customer_phone, customer_email,
        shipping_address, shipping_city, shipping_state, shipping_pincode,
        subtotal, discount_amount, gst_amount, delivery_charge, total_amount,
        coupon_code, created_at,
        gf_order_items ( product_name, quantity_metres, unit_price, total_price )
      `)
      .gte('created_at', from.toISOString())
      .lte('created_at', to.toISOString())
      .order('created_at', { ascending: true })

    if (error) throw error

    const all  = orders || []
    const paid = all.filter(o => o.payment_status === 'paid')

    // ── P&L Summary ───────────────────────────────────────────────────────────
    const grossRevenue    = paid.reduce((s, o) => s + (o.subtotal || 0), 0)
    const totalDiscounts  = paid.reduce((s, o) => s + (o.discount_amount || 0), 0)
    const netRevenue      = grossRevenue - totalDiscounts
    const gstCollected    = paid.reduce((s, o) => s + (o.gst_amount || 0), 0)
    const deliveryRevenue = paid.reduce((s, o) => s + (o.delivery_charge || 0), 0)
    const totalReceived   = paid.reduce((s, o) => s + (o.total_amount || 0), 0)

    // ── GST Register (invoice-level) ──────────────────────────────────────────
    const gstRegister = paid.map(o => {
      const taxable = (o.subtotal || 0) - (o.discount_amount || 0)
      const gst     = o.gst_amount || 0
      const cgst    = Math.round(gst / 2 * 100) / 100
      const sgst    = Math.round(gst / 2 * 100) / 100
      const isIntraState = (o.shipping_state || '').toLowerCase() === 'telangana'
      return {
        invoice:      o.order_number,
        date:         o.created_at?.slice(0, 10),
        customer:     o.customer_name,
        phone:        o.customer_phone,
        state:        o.shipping_state,
        pincode:      o.shipping_pincode,
        taxable_value: Math.round(taxable * 100) / 100,
        gst_rate:     `${GST_RATE}%`,
        cgst:         isIntraState ? cgst : 0,
        sgst:         isIntraState ? sgst : 0,
        igst:         isIntraState ? 0   : gst,
        total_gst:    gst,
        total_amount: o.total_amount,
        hsn:          '5007',  // Silk fabric HSN (update per product category in future)
        supply_type:  isIntraState ? 'Intra-State' : 'Inter-State',
      }
    })

    // ── HSN Summary ───────────────────────────────────────────────────────────
    const hsnSummary = [{
      hsn:          '5007',
      description:  'Woven fabrics of silk or silk waste',
      quantity:     paid.flatMap(o => o.gf_order_items || []).reduce((s: number, i: any) => s + (i.quantity_metres || 0), 0),
      unit:         'MTR',
      taxable_value: Math.round(netRevenue * 100) / 100,
      cgst:         Math.round(gstRegister.reduce((s,r) => s + r.cgst, 0) * 100) / 100,
      sgst:         Math.round(gstRegister.reduce((s,r) => s + r.sgst, 0) * 100) / 100,
      igst:         Math.round(gstRegister.reduce((s,r) => s + r.igst, 0) * 100) / 100,
      total_tax:    Math.round(gstCollected * 100) / 100,
    }]

    // ── Payment Register ──────────────────────────────────────────────────────
    const paymentRegister = paid.map(o => ({
      order_number:  o.order_number,
      date:          o.created_at?.slice(0, 10),
      customer:      o.customer_name,
      phone:         o.customer_phone,
      payment_mode:  o.payment_mode,
      payment_ref:   o.payment_ref,
      amount:        o.total_amount,
      status:        o.payment_status,
    }))

    // ── Payment mode breakdown ────────────────────────────────────────────────
    const byMode: Record<string, { count: number; amount: number }> = {}
    paid.forEach(o => {
      const k = o.payment_mode || 'unknown'
      if (!byMode[k]) byMode[k] = { count: 0, amount: 0 }
      byMode[k].count  += 1
      byMode[k].amount += o.total_amount || 0
    })

    // ── Outstanding / Pending ─────────────────────────────────────────────────
    const pendingPayment = all.filter(o => o.payment_status !== 'paid' && o.status !== 'cancelled')
    const pendingAmount  = pendingPayment.reduce((s, o) => s + (o.total_amount || 0), 0)

    // ── Monthly P&L trend (for yearly view) ───────────────────────────────────
    const byMonth: Record<string, { revenue: number; gst: number; orders: number }> = {}
    paid.forEach(o => {
      const m = o.created_at?.slice(0, 7)  // YYYY-MM
      if (!byMonth[m]) byMonth[m] = { revenue: 0, gst: 0, orders: 0 }
      byMonth[m].revenue += o.total_amount  || 0
      byMonth[m].gst     += o.gst_amount    || 0
      byMonth[m].orders  += 1
    })

    return NextResponse.json({
      meta: { from: from.toISOString(), to: to.toISOString(), range },
      summary: {
        grossRevenue:    Math.round(grossRevenue    * 100) / 100,
        totalDiscounts:  Math.round(totalDiscounts  * 100) / 100,
        netRevenue:      Math.round(netRevenue      * 100) / 100,
        gstCollected:    Math.round(gstCollected    * 100) / 100,
        deliveryRevenue: Math.round(deliveryRevenue * 100) / 100,
        totalReceived:   Math.round(totalReceived   * 100) / 100,
        paidInvoices:    paid.length,
        pendingAmount:   Math.round(pendingAmount   * 100) / 100,
        pendingCount:    pendingPayment.length,
        cgstTotal:       Math.round(gstRegister.reduce((s,r) => s + r.cgst, 0) * 100) / 100,
        sgstTotal:       Math.round(gstRegister.reduce((s,r) => s + r.sgst, 0) * 100) / 100,
        igstTotal:       Math.round(gstRegister.reduce((s,r) => s + r.igst, 0) * 100) / 100,
      },
      gstRegister,
      hsnSummary,
      paymentRegister,
      byMode: Object.entries(byMode).map(([mode, v]) => ({ mode, ...v })),
      byMonth: Object.entries(byMonth).sort().map(([month, v]) => ({ month, ...v })),
      pendingOrders: pendingPayment.map(o => ({
        order_number:  o.order_number,
        date:          o.created_at?.slice(0,10),
        customer:      o.customer_name,
        phone:         o.customer_phone,
        amount:        o.total_amount,
        payment_mode:  o.payment_mode,
        status:        o.status,
      })),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
