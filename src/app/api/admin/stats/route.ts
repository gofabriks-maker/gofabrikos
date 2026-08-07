import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET() {
  try {
    const supabase  = db()
    const now       = new Date()
    const today     = now.toISOString().split('T')[0]
    const monthStart= new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    const [
      todayRes, monthRes, pendingOrdersRes, totalProductsRes,
      lowStockRes, recentOrdersRes, topItemsRes,
      wholesaleRes, contactRes, reviewsRes,
    ] = await Promise.all([
      // Today orders
      supabase.from('gf_orders').select('total_amount, status').gte('created_at', today),
      // This month orders
      supabase.from('gf_orders').select('total_amount, status, payment_status').gte('created_at', monthStart),
      // Pending orders (badge)
      supabase.from('gf_orders').select('id', { count: 'exact', head: true })
        .in('status', ['pending', 'confirmed', 'processing']),
      // Active products
      supabase.from('gf_products').select('id', { count: 'exact', head: true }).eq('is_active', true),
      // Low stock items
      supabase.from('gf_inventory').select('id', { count: 'exact', head: true })
        .lt('stock_metres', 50),
      // Recent 5 orders
      supabase.from('gf_orders')
        .select('order_number, customer_name, customer_phone, shipping_city, total_amount, status, payment_status, created_at')
        .order('created_at', { ascending: false }).limit(6),
      // Top order items (for product sales)
      supabase.from('gf_order_items')
        .select('product_name, quantity_metres, total_price').limit(200),
      // Wholesale badge (new enquiries)
      supabase.from('wholesale_enquiries').select('id', { count: 'exact', head: true })
        .eq('status', 'new'),
      // Contact messages badge (unread)
      supabase.from('contact_messages').select('id', { count: 'exact', head: true })
        .eq('status', 'unread'),
      // Pending reviews badge
      supabase.from('gf_reviews').select('id', { count: 'exact', head: true })
        .eq('is_approved', false),
    ])

    const todayOrders  = todayRes.data  || []
    const monthOrders  = monthRes.data  || []

    const todayRevenue  = todayOrders.reduce((s: number, o: any) => s + (o.total_amount || 0), 0)
    const todayCount    = todayOrders.length

    const paidOrders    = monthOrders.filter((o: any) => o.payment_status === 'paid')
    const monthRevenue  = paidOrders.reduce((s: number, o: any) => s + (o.total_amount || 0), 0)
    const monthCount    = paidOrders.length
    const avgOrderValue = monthCount > 0 ? Math.round(monthRevenue / monthCount) : 0
    const cancelledCount= monthOrders.filter((o: any) => o.status === 'cancelled').length
    const cancellRate   = monthOrders.length > 0 ? Math.round(cancelledCount / monthOrders.length * 100) : 0

    // Status breakdown for chart
    const statusBreakdown = monthOrders.reduce((acc: any, o: any) => {
      acc[o.status] = (acc[o.status] || 0) + 1
      return acc
    }, {})

    // Top products from order items
    const productSales: Record<string, { name: string; qty: number; revenue: number }> = {}
    for (const item of (topItemsRes.data || [])) {
      const k = item.product_name
      if (!productSales[k]) productSales[k] = { name: k, qty: 0, revenue: 0 }
      productSales[k].qty     += item.quantity_metres || 0
      productSales[k].revenue += item.total_price     || 0
    }
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    return NextResponse.json({
      // Dashboard KPIs
      today: {
        revenue: Math.round(todayRevenue),
        orders:  todayCount,
      },
      month: {
        revenue:       Math.round(monthRevenue),
        orders:        monthCount,
        avgOrderValue,
        cancellRate,
      },
      totals: {
        products:     totalProductsRes.count || 0,
        pendingOrders: pendingOrdersRes.count || 0,
        lowStockItems: lowStockRes.count      || 0,
      },
      // Sidebar badge counts
      pendingOrders:  pendingOrdersRes.count || 0,
      newWholesale:   wholesaleRes.count     || 0,
      unreadContact:  contactRes.count       || 0,
      pendingReviews: reviewsRes.count       || 0,
      unreadMessages: 0,  // messages table not yet wired
      // Lists
      recentOrders: (recentOrdersRes.data || []).map((o: any) => ({
        orderNumber:  o.order_number,
        customerName: o.customer_name,
        city:         o.shipping_city || '—',
        amount:       o.total_amount,
        status:       o.status,
        paymentStatus: o.payment_status,
        date:         o.created_at?.split('T')[0],
      })),
      topProducts,
      statusBreakdown,
    })
  } catch (err: any) {
    console.error('Admin stats error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
