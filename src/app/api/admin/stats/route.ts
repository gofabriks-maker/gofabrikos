import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createAdminClient()
    const today = new Date().toISOString().split('T')[0]
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()

    // Run all queries in parallel
    const [
      todayOrdersRes,
      monthOrdersRes,
      totalCustomersRes,
      pendingOrdersRes,
      lowStockRes,
      totalProductsRes,
      recentOrdersRes,
      topProductsRes,
      revenueChartRes,
      orderStatusRes,
    ] = await Promise.all([
      // Today's orders
      supabase
        .from('gf_orders')
        .select('total_amount, status')
        .gte('created_at', today),

      // This month's orders
      supabase
        .from('gf_orders')
        .select('total_amount, status')
        .gte('created_at', monthStart),

      // Total customers
      supabase
        .from('gf_customers')
        .select('id', { count: 'exact', head: true }),

      // Pending orders count
      supabase
        .from('gf_orders')
        .select('id', { count: 'exact', head: true })
        .in('status', ['pending', 'confirmed', 'processing']),

      // Low stock rolls
      supabase
        .from('gf_inventory_rolls')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'low'),

      // Total active products
      supabase
        .from('gf_products')
        .select('id', { count: 'exact', head: true })
        .eq('is_active', true),

      // Recent 5 orders
      supabase
        .from('gf_orders')
        .select(`
          order_number, total_amount, status, created_at,
          gf_customers ( full_name, city )
        `)
        .order('created_at', { ascending: false })
        .limit(5),

      // Top 5 selling products (by order item count)
      supabase
        .from('gf_order_items')
        .select(`
          product_id, quantity_meters,
          gf_products ( name, category )
        `)
        .limit(100),

      // Revenue last 7 days
      supabase
        .from('gf_daily_sales_summary')
        .select('date, total_revenue, total_orders')
        .order('date', { ascending: false })
        .limit(7),

      // Order status breakdown
      supabase
        .from('gf_orders')
        .select('status')
        .gte('created_at', monthStart),
    ])

    // Process today's data
    const todayOrders   = todayOrdersRes.data || []
    const todayRevenue  = todayOrders.reduce((s: number, o: any) => s + (o.total_amount || 0), 0)
    const todayCount    = todayOrders.length

    // Process monthly data
    const monthOrders   = monthOrdersRes.data || []
    const monthRevenue  = monthOrders.reduce((s: number, o: any) => s + (o.total_amount || 0), 0)
    const monthCount    = monthOrders.length
    const avgOrderValue = monthCount > 0 ? Math.round(monthRevenue / monthCount) : 0

    // Process order status breakdown
    const statusBreakdown = (orderStatusRes.data || []).reduce((acc: any, o: any) => {
      acc[o.status] = (acc[o.status] || 0) + 1
      return acc
    }, {})

    // Process top products
    const productSales: Record<string, { name: string; category: string; meters: number; revenue: number }> = {}
    for (const item of (topProductsRes.data || [])) {
      const id = item.product_id
      if (!productSales[id]) {
        productSales[id] = {
          name:     (item as any).gf_products?.name || 'Unknown',
          category: (item as any).gf_products?.category || '',
          meters:   0,
          revenue:  0,
        }
      }
      productSales[id].meters += item.quantity_meters || 0
    }
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.meters - a.meters)
      .slice(0, 5)

    // Build revenue chart (last 7 days from daily summary, or fallback to empty)
    const revenueChart = (revenueChartRes.data || []).reverse().map((d: any) => ({
      date:    d.date,
      revenue: d.total_revenue || 0,
      orders:  d.total_orders  || 0,
    }))

    return NextResponse.json({
      today: {
        revenue: todayRevenue,
        orders:  todayCount,
      },
      month: {
        revenue:       monthRevenue,
        orders:        monthCount,
        avgOrderValue,
      },
      totals: {
        customers:   totalCustomersRes.count || 0,
        products:    totalProductsRes.count  || 0,
        pendingOrders: pendingOrdersRes.count || 0,
        lowStockItems: lowStockRes.count      || 0,
      },
      recentOrders: (recentOrdersRes.data || []).map((o: any) => ({
        orderNumber:  o.order_number,
        customerName: o.gf_customers?.full_name || 'Unknown',
        city:         o.gf_customers?.city || '',
        amount:       o.total_amount,
        status:       o.status,
        date:         o.created_at?.split('T')[0],
      })),
      topProducts,
      revenueChart,
      statusBreakdown,
    })
  } catch (err: any) {
    console.error('Admin stats error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
