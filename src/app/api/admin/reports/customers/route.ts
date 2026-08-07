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
    const dateFrom = searchParams.get('from') || ''
    const dateTo   = searchParams.get('to')   || ''

    const now = new Date()
    let from = new Date(now.getFullYear(), 0, 1)  // default: this year
    let to   = new Date(now)
    to.setHours(23, 59, 59, 999)
    if (dateFrom) from = new Date(dateFrom)
    if (dateTo)   { to = new Date(dateTo); to.setHours(23,59,59,999) }

    const { data: orders, error } = await supabase
      .from('gf_orders')
      .select('customer_name, customer_phone, customer_email, total_amount, payment_status, status, created_at, shipping_city, shipping_state')
      .eq('payment_status', 'paid')
      .gte('created_at', from.toISOString())
      .lte('created_at', to.toISOString())

    if (error) throw error

    const all = orders || []

    // Customer map keyed by phone
    const custMap: Record<string, {
      name: string; phone: string; email: string | null
      city: string; state: string
      orders: number; revenue: number; firstOrder: string; lastOrder: string
    }> = {}

    all.forEach(o => {
      const key = o.customer_phone || o.customer_name
      if (!custMap[key]) {
        custMap[key] = {
          name: o.customer_name, phone: o.customer_phone,
          email: o.customer_email, city: o.shipping_city,
          state: o.shipping_state,
          orders: 0, revenue: 0,
          firstOrder: o.created_at, lastOrder: o.created_at,
        }
      }
      custMap[key].orders  += 1
      custMap[key].revenue += o.total_amount || 0
      if (o.created_at < custMap[key].firstOrder) custMap[key].firstOrder = o.created_at
      if (o.created_at > custMap[key].lastOrder)  custMap[key].lastOrder  = o.created_at
    })

    const customers = Object.values(custMap)
    customers.sort((a,b) => b.revenue - a.revenue)

    // Segment
    const repeatCustomers = customers.filter(c => c.orders > 1)
    const oneTime         = customers.filter(c => c.orders === 1)
    const vip             = customers.filter(c => c.revenue > 5000)

    // RFM rough segments (Recency, Frequency, Monetary)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const recentActive  = customers.filter(c => c.lastOrder > thirtyDaysAgo)

    // State distribution
    const byState: Record<string, { customers: number; revenue: number }> = {}
    customers.forEach(c => {
      const k = c.state || 'Unknown'
      if (!byState[k]) byState[k] = { customers: 0, revenue: 0 }
      byState[k].customers += 1
      byState[k].revenue   += c.revenue
    })

    const summary = {
      totalCustomers:   customers.length,
      repeatCustomers:  repeatCustomers.length,
      oneTimeCustomers: oneTime.length,
      vipCustomers:     vip.length,
      activeLastMonth:  recentActive.length,
      totalRevenue:     Math.round(customers.reduce((s,c) => s + c.revenue, 0) * 100) / 100,
      avgLTV:           customers.length > 0
        ? Math.round(customers.reduce((s,c) => s + c.revenue, 0) / customers.length * 100) / 100
        : 0,
      repeatRate: customers.length > 0
        ? Math.round(repeatCustomers.length / customers.length * 1000) / 10
        : 0,
    }

    const byStateList = Object.entries(byState)
      .sort((a,b) => b[1].revenue - a[1].revenue)
      .slice(0, 15)
      .map(([state, v]) => ({ state, ...v }))

    return NextResponse.json({
      summary,
      topCustomers: customers.slice(0, 50).map(c => ({
        ...c,
        avgOrder:  Math.round(c.revenue / c.orders * 100) / 100,
        segment:   c.revenue > 5000 ? 'VIP'
                 : c.orders > 3     ? 'Loyal'
                 : c.orders > 1     ? 'Returning'
                 : 'New',
      })),
      byState: byStateList,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
