import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const range    = searchParams.get('range')    || 'monthly'   // daily|weekly|monthly|yearly|custom
    const dateFrom = searchParams.get('from')     || ''
    const dateTo   = searchParams.get('to')       || ''
    const groupBy  = searchParams.get('group_by') || 'date'      // date|category|payment_mode|status
    const supabase = db()

    // Compute date window
    const now  = new Date()
    let from: Date, to: Date = new Date(now)
    to.setHours(23, 59, 59, 999)

    if (dateFrom && dateTo) {
      from = new Date(dateFrom)
      to   = new Date(dateTo)
      to.setHours(23, 59, 59, 999)
    } else {
      switch (range) {
        case 'daily':   from = new Date(now); from.setHours(0,0,0,0); break
        case 'weekly':  from = new Date(now); from.setDate(now.getDate() - 6); from.setHours(0,0,0,0); break
        case 'monthly': from = new Date(now.getFullYear(), now.getMonth(), 1); break
        case 'yearly':  from = new Date(now.getFullYear(), 0, 1); break
        default:        from = new Date(now.getFullYear(), now.getMonth(), 1)
      }
    }

    // Fetch orders in range
    const { data: orders, error } = await supabase
      .from('gf_orders')
      .select(`
        id, order_number, status, payment_status, payment_mode,
        customer_name, customer_phone, shipping_city, shipping_state,
        subtotal, discount_amount, gst_amount, delivery_charge, total_amount,
        coupon_code, created_at,
        gf_order_items ( product_name, quantity_metres, unit_price, total_price )
      `)
      .gte('created_at', from.toISOString())
      .lte('created_at', to.toISOString())
      .order('created_at', { ascending: true })

    if (error) throw error

    const all = orders || []

    // ── KPI Summary ──────────────────────────────────────────────
    const paid      = all.filter(o => o.payment_status === 'paid')
    const cancelled = all.filter(o => o.status === 'cancelled')

    const totalRevenue      = paid.reduce((s, o) => s + (o.total_amount || 0), 0)
    const totalOrders       = all.length
    const paidOrders        = paid.length
    const cancelledOrders   = cancelled.length
    const totalDiscount     = paid.reduce((s, o) => s + (o.discount_amount || 0), 0)
    const totalGst          = paid.reduce((s, o) => s + (o.gst_amount || 0), 0)
    const totalDelivery     = paid.reduce((s, o) => s + (o.delivery_charge || 0), 0)
    const avgOrderValue     = paidOrders > 0 ? totalRevenue / paidOrders : 0
    const totalMetres       = all.flatMap(o => o.gf_order_items || []).reduce((s, i) => s + (i.quantity_metres || 0), 0)

    // ── Group by date ─────────────────────────────────────────────
    const byDate: Record<string, { orders: number; revenue: number; metres: number }> = {}
    paid.forEach(o => {
      const d = o.created_at.slice(0, 10)
      if (!byDate[d]) byDate[d] = { orders: 0, revenue: 0, metres: 0 }
      byDate[d].orders  += 1
      byDate[d].revenue += o.total_amount || 0
      byDate[d].metres  += (o.gf_order_items || []).reduce((s: number, i: any) => s + (i.quantity_metres || 0), 0)
    })

    // ── Group by payment mode ─────────────────────────────────────
    const byPayment: Record<string, { orders: number; revenue: number }> = {}
    paid.forEach(o => {
      const k = o.payment_mode || 'unknown'
      if (!byPayment[k]) byPayment[k] = { orders: 0, revenue: 0 }
      byPayment[k].orders  += 1
      byPayment[k].revenue += o.total_amount || 0
    })

    // ── Group by state ────────────────────────────────────────────
    const byState: Record<string, { orders: number; revenue: number }> = {}
    paid.forEach(o => {
      const k = o.shipping_state || 'Unknown'
      if (!byState[k]) byState[k] = { orders: 0, revenue: 0 }
      byState[k].orders  += 1
      byState[k].revenue += o.total_amount || 0
    })

    // ── Group by product ──────────────────────────────────────────
    const byProduct: Record<string, { name: string; qty: number; revenue: number; orders: number }> = {}
    paid.forEach(o => {
      ;(o.gf_order_items || []).forEach((i: any) => {
        const k = i.product_name || 'Unknown'
        if (!byProduct[k]) byProduct[k] = { name: k, qty: 0, revenue: 0, orders: 0 }
        byProduct[k].qty     += i.quantity_metres || 0
        byProduct[k].revenue += i.total_price     || 0
        byProduct[k].orders  += 1
      })
    })

    // ── Coupon usage ──────────────────────────────────────────────
    const byCoupon: Record<string, { uses: number; discount: number }> = {}
    paid.filter(o => o.coupon_code).forEach(o => {
      const k = o.coupon_code!
      if (!byCoupon[k]) byCoupon[k] = { uses: 0, discount: 0 }
      byCoupon[k].uses     += 1
      byCoupon[k].discount += o.discount_amount || 0
    })

    return NextResponse.json({
      meta: { from: from.toISOString(), to: to.toISOString(), range },
      summary: {
        totalRevenue:    Math.round(totalRevenue * 100) / 100,
        totalOrders,
        paidOrders,
        cancelledOrders,
        totalDiscount:   Math.round(totalDiscount * 100) / 100,
        totalGst:        Math.round(totalGst * 100) / 100,
        totalDelivery:   Math.round(totalDelivery * 100) / 100,
        avgOrderValue:   Math.round(avgOrderValue * 100) / 100,
        totalMetres:     Math.round(totalMetres * 100) / 100,
        cancellationRate: totalOrders > 0 ? Math.round((cancelledOrders / totalOrders) * 1000) / 10 : 0,
      },
      charts: {
        byDate:    Object.entries(byDate).map(([date, v]) => ({ date, ...v })),
        byPayment: Object.entries(byPayment).map(([mode, v]) => ({ mode, ...v })),
        byState:   Object.entries(byState).sort((a,b) => b[1].revenue - a[1].revenue).slice(0,10).map(([state, v]) => ({ state, ...v })),
        byProduct: Object.values(byProduct).sort((a,b) => b.revenue - a.revenue).slice(0,20),
        byCoupon:  Object.entries(byCoupon).map(([code, v]) => ({ code, ...v })),
      },
      orders: all.map(o => ({
        order_number:   o.order_number,
        customer_name:  o.customer_name,
        customer_phone: o.customer_phone,
        city:           o.shipping_city,
        state:          o.shipping_state,
        status:         o.status,
        payment_status: o.payment_status,
        payment_mode:   o.payment_mode,
        subtotal:       o.subtotal,
        discount:       o.discount_amount,
        gst:            o.gst_amount,
        delivery:       o.delivery_charge,
        total:          o.total_amount,
        coupon:         o.coupon_code,
        date:           o.created_at,
        items:          (o.gf_order_items || []).map((i: any) => ({
          product: i.product_name,
          qty:     i.quantity_metres,
          price:   i.unit_price,
          total:   i.total_price,
        })),
      })),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
