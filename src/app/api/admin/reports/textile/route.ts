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
    const dateFrom = searchParams.get('from')  || ''
    const dateTo   = searchParams.get('to')    || ''

    const now = new Date()
    let from: Date, to: Date = new Date(now)
    to.setHours(23, 59, 59, 999)
    if (dateFrom && dateTo) {
      from = new Date(dateFrom); to = new Date(dateTo); to.setHours(23,59,59,999)
    } else {
      switch (range) {
        case 'daily':  from = new Date(now); from.setHours(0,0,0,0); break
        case 'weekly': from = new Date(now); from.setDate(now.getDate()-6); from.setHours(0,0,0,0); break
        case 'yearly': from = new Date(now.getFullYear(), 0, 1); break
        default:       from = new Date(now.getFullYear(), now.getMonth(), 1)
      }
    }

    // Fetch orders with items in range
    const { data: orders, error: oErr } = await supabase
      .from('gf_orders')
      .select('payment_status, total_amount, created_at, gf_order_items(product_name, quantity_metres, total_price)')
      .eq('payment_status', 'paid')
      .gte('created_at', from.toISOString())
      .lte('created_at', to.toISOString())

    if (oErr) throw oErr

    // Fetch all active products with textile attributes
    const { data: products, error: pErr } = await supabase
      .from('gf_products')
      .select('name, slug, category, fabric_type, gsm, width, price, mrp, is_trending, is_new_arrival, gf_inventory(stock_metres, sold_metres)')
      .eq('is_active', true)

    if (pErr) throw pErr

    const items = (orders || []).flatMap(o => (o.gf_order_items || []).map((i: any) => ({
      product_name: i.product_name,
      qty:          i.quantity_metres || 0,
      revenue:      i.total_price     || 0,
    })))

    // Build a product lookup map (name -> product attrs)
    const productMap: Record<string, any> = {}
    ;(products || []).forEach(p => { productMap[p.name] = p })

    // ── Fabric Type Analysis ───────────────────────────────────────
    const byFabricType: Record<string, { qty: number; revenue: number; products: Set<string> }> = {}
    items.forEach(i => {
      const p   = productMap[i.product_name]
      const key = p?.fabric_type || extractFabricType(i.product_name)
      if (!byFabricType[key]) byFabricType[key] = { qty: 0, revenue: 0, products: new Set() }
      byFabricType[key].qty     += i.qty
      byFabricType[key].revenue += i.revenue
      byFabricType[key].products.add(i.product_name)
    })

    // ── Category Analysis ─────────────────────────────────────────
    const byCategory: Record<string, { qty: number; revenue: number; count: number }> = {}
    items.forEach(i => {
      const p   = productMap[i.product_name]
      const key = p?.category || extractCategory(i.product_name)
      if (!byCategory[key]) byCategory[key] = { qty: 0, revenue: 0, count: 0 }
      byCategory[key].qty     += i.qty
      byCategory[key].revenue += i.revenue
      byCategory[key].count   += 1
    })

    // ── GSM Analysis ──────────────────────────────────────────────
    const byGSM: Record<string, { qty: number; revenue: number }> = {}
    items.forEach(i => {
      const p   = productMap[i.product_name]
      const gsm = p?.gsm || 'Unknown'
      const bucket = gsm === 'Unknown' ? 'Unknown'
                   : parseInt(gsm) < 100  ? 'Lightweight (<100 GSM)'
                   : parseInt(gsm) < 200  ? 'Medium (100–200 GSM)'
                   : parseInt(gsm) < 300  ? 'Heavy (200–300 GSM)'
                   : 'Very Heavy (300+ GSM)'
      if (!byGSM[bucket]) byGSM[bucket] = { qty: 0, revenue: 0 }
      byGSM[bucket].qty     += i.qty
      byGSM[bucket].revenue += i.revenue
    })

    // ── Width Analysis ────────────────────────────────────────────
    const byWidth: Record<string, { qty: number; revenue: number }> = {}
    items.forEach(i => {
      const p     = productMap[i.product_name]
      const width = p?.width || 'Unknown'
      if (!byWidth[width]) byWidth[width] = { qty: 0, revenue: 0 }
      byWidth[width].qty     += i.qty
      byWidth[width].revenue += i.revenue
    })

    // ── Trending vs Normal ────────────────────────────────────────
    const trendingRevenue = items.filter(i => productMap[i.product_name]?.is_trending).reduce((s, i) => s + i.revenue, 0)
    const normalRevenue   = items.filter(i => !productMap[i.product_name]?.is_trending).reduce((s, i) => s + i.revenue, 0)
    const newArrivalRev   = items.filter(i => productMap[i.product_name]?.is_new_arrival).reduce((s, i) => s + i.revenue, 0)

    // ── Price band analysis ───────────────────────────────────────
    const byPriceBand: Record<string, { qty: number; revenue: number }> = {}
    items.forEach(i => {
      const p     = productMap[i.product_name]
      const price = p?.price || 0
      const band  = price === 0     ? 'Unknown'
                  : price < 200     ? 'Economy (<₹200/m)'
                  : price < 500     ? 'Mid-Range (₹200–500/m)'
                  : price < 1000    ? 'Premium (₹500–1000/m)'
                  : 'Luxury (₹1000+/m)'
      if (!byPriceBand[band]) byPriceBand[band] = { qty: 0, revenue: 0 }
      byPriceBand[band].qty     += i.qty
      byPriceBand[band].revenue += i.revenue
    })

    // ── Inventory health by category ──────────────────────────────
    const invByCategory: Record<string, { totalStock: number; totalSold: number; products: number }> = {}
    ;(products || []).forEach(p => {
      const key = p.category || 'Other'
      if (!invByCategory[key]) invByCategory[key] = { totalStock: 0, totalSold: 0, products: 0 }
      const inv = (p.gf_inventory as any)?.[0] || {}
      invByCategory[key].totalStock += inv.stock_metres || 0
      invByCategory[key].totalSold  += inv.sold_metres  || 0
      invByCategory[key].products   += 1
    })

    // ── Dead stock prediction ─────────────────────────────────────
    const deadStockRisk = (products || [])
      .map(p => {
        const inv   = (p.gf_inventory as any)?.[0] || {}
        const stock = inv.stock_metres || 0
        const sold  = inv.sold_metres  || 0
        const velocity = sold > 0 ? sold / 180 : 0  // avg per day over 6 months
        const daysToSell = velocity > 0 ? stock / velocity : 999
        return { name: p.name, category: p.category, stock, sold, daysToSell, value: stock * p.price }
      })
      .filter(p => p.daysToSell > 180 && p.stock > 0)
      .sort((a,b) => b.daysToSell - a.daysToSell)
      .slice(0, 10)

    const totalRev = items.reduce((s, i) => s + i.revenue, 0)
    const totalQty = items.reduce((s, i) => s + i.qty, 0)

    return NextResponse.json({
      meta: { from: from.toISOString(), to: to.toISOString(), range },
      summary: {
        totalRevenue: Math.round(totalRev * 100) / 100,
        totalMetres:  Math.round(totalQty * 100) / 100,
        fabricTypes:  Object.keys(byFabricType).length,
        categories:   Object.keys(byCategory).length,
        trendingRevenue: Math.round(trendingRevenue * 100) / 100,
        newArrivalRev:   Math.round(newArrivalRev  * 100) / 100,
        trendingPct: totalRev > 0 ? Math.round(trendingRevenue / totalRev * 1000) / 10 : 0,
      },
      byFabricType: Object.entries(byFabricType)
        .map(([type, v]) => ({ type, qty: Math.round(v.qty), revenue: Math.round(v.revenue), skus: v.products.size }))
        .sort((a,b) => b.revenue - a.revenue),
      byCategory: Object.entries(byCategory)
        .map(([cat, v]) => ({ cat, ...v, revenue: Math.round(v.revenue), qty: Math.round(v.qty) }))
        .sort((a,b) => b.revenue - a.revenue),
      byGSM: Object.entries(byGSM)
        .map(([gsm, v]) => ({ gsm, qty: Math.round(v.qty), revenue: Math.round(v.revenue) }))
        .sort((a,b) => b.revenue - a.revenue),
      byWidth: Object.entries(byWidth)
        .map(([width, v]) => ({ width, qty: Math.round(v.qty), revenue: Math.round(v.revenue) }))
        .sort((a,b) => b.revenue - a.revenue),
      byPriceBand: Object.entries(byPriceBand)
        .map(([band, v]) => ({ band, qty: Math.round(v.qty), revenue: Math.round(v.revenue) }))
        .sort((a,b) => b.revenue - a.revenue),
      invByCategory: Object.entries(invByCategory)
        .map(([cat, v]) => ({ cat, totalStock: Math.round(v.totalStock), totalSold: Math.round(v.totalSold), products: v.products,
          turnover: v.totalStock > 0 ? Math.round(v.totalSold / v.totalStock * 100) / 100 : 0 }))
        .sort((a,b) => b.totalStock - a.totalStock),
      deadStockRisk,
      badges: { trendingRevenue, normalRevenue, newArrivalRev },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// Fallback extractors when DB product not found
function extractFabricType(name: string): string {
  const n = name.toLowerCase()
  if (n.includes('chanderi'))  return 'Chanderi'
  if (n.includes('banarasi'))  return 'Banarasi'
  if (n.includes('kanjivaram') || n.includes('kanjeevaram')) return 'Kanjivaram'
  if (n.includes('cotton'))    return 'Cotton'
  if (n.includes('silk'))      return 'Silk'
  if (n.includes('georgette')) return 'Georgette'
  if (n.includes('linen'))     return 'Linen'
  if (n.includes('khadi'))     return 'Khadi'
  if (n.includes('ikat'))      return 'Ikat'
  if (n.includes('patola'))    return 'Patola'
  if (n.includes('pashmina'))  return 'Pashmina'
  if (n.includes('chiffon'))   return 'Chiffon'
  if (n.includes('crepe'))     return 'Crepe'
  if (n.includes('dupatta'))   return 'Dupatta'
  return 'Other'
}

function extractCategory(name: string): string {
  const n = name.toLowerCase()
  if (n.includes('lehenga'))   return 'Lehenga Fabrics'
  if (n.includes('blouse'))    return 'Blouse Fabrics'
  if (n.includes('kurti'))     return 'Kurti Fabrics'
  if (n.includes('saree') || n.includes('sari')) return 'Designer Sarees'
  if (n.includes('dupatta'))   return 'Dupattas'
  if (n.includes('plain'))     return 'Plain Fabrics'
  return 'All Fabrics'
}
