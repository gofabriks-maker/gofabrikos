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
    const supabase = db()
    const { searchParams } = new URL(req.url)
    const range    = searchParams.get('range') || 'monthly'

    const now = new Date()
    let from: Date
    switch (range) {
      case 'daily':  from = new Date(now); from.setHours(0,0,0,0); break
      case 'weekly': from = new Date(now); from.setDate(now.getDate()-6); from.setHours(0,0,0,0); break
      case 'yearly': from = new Date(now.getFullYear(), 0, 1); break
      default:       from = new Date(now.getFullYear(), now.getMonth(), 1)
    }
    const to = new Date(now); to.setHours(23,59,59,999)

    const [ordersRes, subsRes, wholesaleRes, reviewsRes] = await Promise.all([
      supabase.from('gf_orders')
        .select('payment_status, payment_mode, coupon_code, discount_amount, total_amount, subtotal, status, created_at, source')
        .gte('created_at', from.toISOString()).lte('created_at', to.toISOString()),
      supabase.from('subscribers').select('email, subscribed_at, is_active').order('subscribed_at', { ascending: false }),
      supabase.from('wholesale_enquiries').select('status, created_at, business_name').gte('created_at', from.toISOString()),
      supabase.from('gf_reviews').select('rating, is_approved, created_at').gte('created_at', from.toISOString()),
    ])

    const orders    = ordersRes.data    || []
    const subs      = subsRes.data      || []
    const wholesale = wholesaleRes.data || []
    const reviews   = reviewsRes.data   || []

    const paid = orders.filter(o => o.payment_status === 'paid')

    // ── Coupon Analysis ───────────────────────────────────────────
    const couponMap: Record<string, { uses: number; revenue: number; discount: number; orders: number }> = {}
    paid.filter(o => o.coupon_code).forEach(o => {
      const k = o.coupon_code!
      if (!couponMap[k]) couponMap[k] = { uses: 0, revenue: 0, discount: 0, orders: 0 }
      couponMap[k].uses     += 1
      couponMap[k].revenue  += o.total_amount  || 0
      couponMap[k].discount += o.discount_amount || 0
      couponMap[k].orders   += 1
    })
    const couponPerformance = Object.entries(couponMap)
      .map(([code, v]) => ({
        code,
        uses:     v.uses,
        revenue:  Math.round(v.revenue),
        discount: Math.round(v.discount),
        avg_order: Math.round(v.revenue / v.uses),
        roi: v.discount > 0 ? Math.round((v.revenue / v.discount) * 10) / 10 : 0,
      }))
      .sort((a,b) => b.revenue - a.revenue)

    // Orders with vs without coupon
    const withCoupon    = paid.filter(o => o.coupon_code)
    const withoutCoupon = paid.filter(o => !o.coupon_code)
    const avgWithCoupon    = withCoupon.length    > 0 ? withCoupon.reduce((s,o)    => s+(o.total_amount||0),0) / withCoupon.length    : 0
    const avgWithoutCoupon = withoutCoupon.length > 0 ? withoutCoupon.reduce((s,o) => s+(o.total_amount||0),0) / withoutCoupon.length : 0

    // ── Newsletter Subscribers ────────────────────────────────────
    const activeSubs = subs.filter(s => s.is_active)
    // Growth by month
    const subsByMonth: Record<string, number> = {}
    subs.forEach(s => {
      const m = s.subscribed_at?.slice(0,7)
      if (m) subsByMonth[m] = (subsByMonth[m] || 0) + 1
    })

    // ── Wholesale Funnel ──────────────────────────────────────────
    const wFunnel = {
      total:       wholesale.length,
      new:         wholesale.filter(w => w.status === 'new').length,
      contacted:   wholesale.filter(w => w.status === 'contacted').length,
      negotiating: wholesale.filter(w => w.status === 'negotiating').length,
      converted:   wholesale.filter(w => w.status === 'converted').length,
    }
    const conversionRate = wFunnel.total > 0 ? Math.round(wFunnel.converted / wFunnel.total * 1000) / 10 : 0

    // ── Review Funnel ─────────────────────────────────────────────
    const reviewStats = {
      total:    reviews.length,
      approved: reviews.filter(r => r.is_approved).length,
      pending:  reviews.filter(r => !r.is_approved).length,
      avgRating: reviews.length > 0
        ? Math.round(reviews.reduce((s,r) => s+(r.rating||0),0) / reviews.length * 10) / 10
        : 0,
      fiveStars: reviews.filter(r => r.rating === 5).length,
    }

    // ── Payment Mode Trend ────────────────────────────────────────
    const paymentTrend: Record<string, { count: number; revenue: number }> = {}
    paid.forEach(o => {
      const k = o.payment_mode || 'unknown'
      if (!paymentTrend[k]) paymentTrend[k] = { count: 0, revenue: 0 }
      paymentTrend[k].count   += 1
      paymentTrend[k].revenue += o.total_amount || 0
    })

    // ── Conversion funnel ─────────────────────────────────────────
    // Rough: all orders / paid orders (COD captured at placement)
    const allOrders    = orders.length
    const paidOrders   = paid.length
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length
    const convFunnel   = {
      placed:    allOrders,
      paid:      paidOrders,
      cancelled: cancelledOrders,
      pending:   allOrders - paidOrders - cancelledOrders,
      payRate:   allOrders > 0 ? Math.round(paidOrders / allOrders * 1000) / 10 : 0,
    }

    return NextResponse.json({
      meta: { from: from.toISOString(), to: to.toISOString(), range },
      summary: {
        totalCouponsUsed:  withCoupon.length,
        couponRevenue:     Math.round(withCoupon.reduce((s,o)    => s+(o.total_amount||0),0)),
        totalDiscountGiven:Math.round(paid.reduce((s,o) => s+(o.discount_amount||0),0)),
        avgOrderWithCoupon:    Math.round(avgWithCoupon),
        avgOrderWithoutCoupon: Math.round(avgWithoutCoupon),
        newsletterSubscribers: activeSubs.length,
        wholesaleEnquiries:    wFunnel.total,
        wholesaleConverted:    wFunnel.converted,
        wholesaleConvRate:     conversionRate,
        reviewsReceived:       reviewStats.total,
        avgRating:             reviewStats.avgRating,
      },
      couponPerformance,
      couponVsNoCoupon: {
        withCoupon:    { orders: withCoupon.length,    avgOrder: Math.round(avgWithCoupon)    },
        withoutCoupon: { orders: withoutCoupon.length, avgOrder: Math.round(avgWithoutCoupon) },
      },
      newsletterGrowth: Object.entries(subsByMonth).sort().map(([month, count]) => ({ month, count })),
      totalSubscribers: activeSubs.length,
      recentSubscribers: activeSubs.slice(0, 20).map(s => ({ email: s.email, date: s.subscribed_at?.slice(0,10) })),
      wholesaleFunnel: wFunnel,
      wholesaleConvRate: conversionRate,
      reviewStats,
      paymentTrend: Object.entries(paymentTrend)
        .map(([mode, v]) => ({ mode, ...v, revenue: Math.round(v.revenue) }))
        .sort((a,b) => b.revenue - a.revenue),
      convFunnel,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
