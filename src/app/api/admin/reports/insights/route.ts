import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Numeric format helpers
function inr(n: number) { return `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` }
function pct(n: number) { return `${Math.round(n * 10) / 10}%` }

export async function GET(req: NextRequest) {
  try {
    const supabase = db()
    const now      = new Date()

    // Current month window
    const curFrom  = new Date(now.getFullYear(), now.getMonth(), 1)
    const curTo    = new Date(now)

    // Previous month window
    const prevFrom = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const prevTo   = new Date(now.getFullYear(), now.getMonth(), 0)
    prevTo.setHours(23,59,59,999)

    // Fetch current + previous month orders
    const [curRes, prevRes, invRes] = await Promise.all([
      supabase.from('gf_orders')
        .select('customer_phone, payment_status, payment_mode, total_amount, gst_amount, status, created_at, shipping_state, gf_order_items(product_name, quantity_metres, total_price)')
        .gte('created_at', curFrom.toISOString()).lte('created_at', curTo.toISOString()),
      supabase.from('gf_orders')
        .select('customer_phone, payment_status, total_amount, status, created_at, gf_order_items(product_name, quantity_metres, total_price)')
        .gte('created_at', prevFrom.toISOString()).lte('created_at', prevTo.toISOString()),
      supabase.from('gf_products')
        .select('name, category, price, gf_inventory(stock_metres, sold_metres, reorder_level)')
        .eq('is_active', true),
    ])

    const cur  = (curRes.data  || []).filter(o => o.payment_status === 'paid')
    const prev = (prevRes.data || []).filter(o => o.payment_status === 'paid')
    const inv  = invRes.data   || []

    // ── Revenue metrics ───────────────────────────────────────────
    const curRev  = cur.reduce((s, o)  => s + (o.total_amount || 0), 0)
    const prevRev = prev.reduce((s, o) => s + (o.total_amount || 0), 0)
    const revGrowth = prevRev > 0 ? ((curRev - prevRev) / prevRev) * 100 : 0

    // ── Order count ───────────────────────────────────────────────
    const curOrders  = cur.length
    const prevOrders = prev.length
    const orderGrowth = prevOrders > 0 ? ((curOrders - prevOrders) / prevOrders) * 100 : 0

    // ── Top products this month ───────────────────────────────────
    const productMap: Record<string, { name: string; qty: number; revenue: number }> = {}
    cur.forEach(o => (o.gf_order_items || []).forEach((i: any) => {
      if (!productMap[i.product_name]) productMap[i.product_name] = { name: i.product_name, qty: 0, revenue: 0 }
      productMap[i.product_name].qty     += i.quantity_metres || 0
      productMap[i.product_name].revenue += i.total_price     || 0
    }))
    const topProducts = Object.values(productMap).sort((a,b) => b.revenue - a.revenue)

    // ── Category breakdown ────────────────────────────────────────
    const catMap: Record<string, number> = {}
    cur.forEach(o => (o.gf_order_items || []).forEach((i: any) => {
      // Extract category from product name (rough heuristic)
      const name = (i.product_name || '').toLowerCase()
      const cat  = name.includes('chanderi') ? 'Chanderi'
                 : name.includes('banarasi') ? 'Banarasi'
                 : name.includes('cotton')   ? 'Cotton'
                 : name.includes('silk')     ? 'Silk'
                 : name.includes('georgette')? 'Georgette'
                 : name.includes('linen')    ? 'Linen'
                 : name.includes('kota')     ? 'Kota'
                 : 'Others'
      catMap[cat] = (catMap[cat] || 0) + (i.total_price || 0)
    }))
    const topCategory   = Object.entries(catMap).sort((a,b) => b[1] - a[1])[0]
    const totalCatRev   = Object.values(catMap).reduce((s, v) => s + v, 0)
    const topCatPct     = totalCatRev > 0 && topCategory ? (topCategory[1] / totalCatRev) * 100 : 0

    // ── State analysis ────────────────────────────────────────────
    const stateMap: Record<string, number> = {}
    cur.forEach(o => {
      const k = o.shipping_state || 'Unknown'
      stateMap[k] = (stateMap[k] || 0) + (o.total_amount || 0)
    })
    const topState    = Object.entries(stateMap).sort((a,b) => b[1] - a[1])[0]
    const topStatePct = curRev > 0 && topState ? (topState[1] / curRev) * 100 : 0

    // ── Cancellation rate ─────────────────────────────────────────
    const allCur       = curRes.data || []
    const cancelled    = allCur.filter(o => o.status === 'cancelled')
    const cancellRate  = allCur.length > 0 ? (cancelled.length / allCur.length) * 100 : 0

    // ── Inventory alerts ──────────────────────────────────────────
    const lowStockItems = inv.filter(p => {
      const i = (p.gf_inventory as any)?.[0] || {}
      return (i.stock_metres || 0) <= (i.reorder_level || 50) && (i.stock_metres || 0) > 0
    })
    const outOfStock = inv.filter(p => {
      const i = (p.gf_inventory as any)?.[0] || {}
      return (i.stock_metres || 0) <= 0
    })

    // ── Repeat customer rate ──────────────────────────────────────
    const phones       = cur.map(o => o.customer_phone).filter(Boolean)
    const uniquePhones = new Set(phones)
    const dupePhones   = phones.filter((p, i) => phones.indexOf(p) !== i)
    const repeatRate   = uniquePhones.size > 0 ? (new Set(dupePhones).size / uniquePhones.size) * 100 : 0

    // ── Generate narrative insights ───────────────────────────────
    const monthName = now.toLocaleString('en-IN', { month: 'long' })
    const insights: { type: 'positive'|'warning'|'info'|'action'; title: string; body: string }[] = []

    // Revenue insight
    if (revGrowth > 0) {
      insights.push({
        type: 'positive',
        title: `Revenue up ${pct(revGrowth)} this month`,
        body: `${monthName} revenue is ${inr(curRev)}, a ${pct(revGrowth)} increase over last month (${inr(prevRev)}). Order volume grew by ${pct(orderGrowth)} (${curOrders} vs ${prevOrders} orders). Strong momentum — maintain marketing activity.`,
      })
    } else if (prevRev > 0) {
      insights.push({
        type: 'warning',
        title: `Revenue declined ${pct(Math.abs(revGrowth))} vs last month`,
        body: `${monthName} revenue is ${inr(curRev)}, down ${pct(Math.abs(revGrowth))} from ${inr(prevRev)} last month. Order count moved from ${prevOrders} to ${curOrders}. Consider running a promotion or WhatsApp broadcast to re-engage customers.`,
      })
    } else {
      insights.push({
        type: 'info',
        title: `${monthName} revenue: ${inr(curRev)}`,
        body: `${curOrders} paid orders recorded this month. This is the baseline month — comparison data will appear from next month.`,
      })
    }

    // Top category
    if (topCategory) {
      insights.push({
        type: 'info',
        title: `${topCategory[0]} fabrics are driving ${pct(topCatPct)} of revenue`,
        body: `${topCategory[0]} contributes ${inr(topCategory[1])} (${pct(topCatPct)} of revenue) this month. ${topCatPct > 50 ? 'High concentration — consider promoting other categories to diversify.' : 'Good category distribution across your product range.'}`,
      })
    }

    // Top state
    if (topState) {
      insights.push({
        type: 'info',
        title: `${topState[0]} is your top market (${pct(topStatePct)} of revenue)`,
        body: `${topState[0]} generated ${inr(topState[1])} this month. ${topStatePct > 50 ? 'Heavy geographic concentration — targeted marketing in other states could unlock growth.' : 'Revenue is distributed across multiple states, which is healthy.'}`,
      })
    }

    // Top product
    if (topProducts.length > 0) {
      const tp = topProducts[0]
      insights.push({
        type: 'positive',
        title: `Best seller: ${tp.name}`,
        body: `"${tp.name}" is your top revenue product this month with ${inr(tp.revenue)} from ${Math.round(tp.qty)} metres sold. Ensure sufficient inventory and consider featuring it prominently on the homepage.`,
      })
    }

    // Cancellation warning
    if (cancellRate > 15) {
      insights.push({
        type: 'warning',
        title: `High cancellation rate: ${pct(cancellRate)}`,
        body: `${cancelled.length} of ${allCur.length} orders were cancelled this month (${pct(cancellRate)}). This exceeds the healthy threshold of 15%. Investigate common reasons — payment failures, delivery delays, or product mismatches.`,
      })
    }

    // Inventory warning
    if (outOfStock.length > 0 || lowStockItems.length > 0) {
      insights.push({
        type: 'action',
        title: `Stock action needed: ${outOfStock.length} out · ${lowStockItems.length} low`,
        body: `${outOfStock.length} products are out of stock and ${lowStockItems.length} are below reorder level. ${outOfStock.length > 0 ? `Out of stock includes: ${outOfStock.slice(0,3).map(p => p.name).join(', ')}${outOfStock.length > 3 ? ` and ${outOfStock.length-3} more` : ''}.` : ''} Restock before upcoming sales to avoid losing revenue.`,
      })
    } else {
      insights.push({
        type: 'positive',
        title: 'Inventory healthy — all products in stock',
        body: 'No out-of-stock or low-stock products detected. Inventory levels are adequate for current sales velocity.',
      })
    }

    // Repeat customer
    if (repeatRate > 20) {
      insights.push({
        type: 'positive',
        title: `Strong repeat customer rate: ${pct(repeatRate)}`,
        body: `${pct(repeatRate)} of customers placed more than one order this month. High repeat purchase rate indicates strong product satisfaction and brand loyalty. Focus on retaining these customers with exclusive offers.`,
      })
    } else {
      insights.push({
        type: 'action',
        title: `Low repeat rate: ${pct(repeatRate)} — activate retention`,
        body: `Only ${pct(repeatRate)} of customers are repeat buyers. Launch a WhatsApp re-engagement campaign targeting past buyers with a loyalty coupon. Even a 5% improvement in repeat rate significantly boosts monthly revenue.`,
      })
    }

    return NextResponse.json({
      generated_at: new Date().toISOString(),
      period: {
        current_month: monthName,
        current_year:  now.getFullYear(),
      },
      kpis: {
        curRev, prevRev, revGrowth, curOrders, prevOrders, orderGrowth,
        cancellRate, repeatRate, topStatePct,
        topCategory: topCategory?.[0],
        topProduct:  topProducts[0]?.name,
        lowStockCount:  lowStockItems.length,
        outOfStockCount: outOfStock.length,
      },
      insights,
      topProducts: topProducts.slice(0, 5),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
