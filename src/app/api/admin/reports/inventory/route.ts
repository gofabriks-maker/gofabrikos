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
    const category = searchParams.get('category') || ''
    const sortBy   = searchParams.get('sort')     || 'stock_desc'  // stock_desc|stock_asc|value_desc|sold_desc

    // Products with inventory
    let query = supabase
      .from('gf_products')
      .select(`
        id, name, slug, category, price, mrp,
        fabric_type, gsm, width,
        is_active, is_trending, is_new_arrival,
        gf_inventory ( stock_metres, reserved_metres, sold_metres, reorder_level, last_restocked_at )
      `)
      .eq('is_active', true)

    if (category) query = query.eq('category', category)

    const { data: products, error } = await query
    if (error) throw error

    const items = (products || []).map(p => {
      const inv    = (p.gf_inventory as any)?.[0] || {}
      const stock  = inv.stock_metres    || 0
      const sold   = inv.sold_metres     || 0
      const reorder = inv.reorder_level  || 50
      const reserved = inv.reserved_metres || 0
      const available = Math.max(0, stock - reserved)
      const value  = available * p.price
      const status = stock <= 0 ? 'out_of_stock'
                   : stock <= reorder ? 'low_stock'
                   : 'in_stock'
      const velocity = sold  // metres sold total — proxy for fast/slow
      return {
        id: p.id, name: p.name, slug: p.slug,
        category: p.category, fabric_type: p.fabric_type,
        price: p.price, mrp: p.mrp,
        stock, reserved, available, sold,
        reorder_level: reorder, value,
        status,
        velocity_label: sold > 500 ? 'Fast Moving'
                      : sold > 100 ? 'Medium'
                      : 'Slow Moving',
        last_restocked: inv.last_restocked_at || null,
        is_trending: p.is_trending,
        is_new_arrival: p.is_new_arrival,
      }
    })

    // Sort
    switch (sortBy) {
      case 'stock_asc':  items.sort((a,b) => a.stock - b.stock);   break
      case 'value_desc': items.sort((a,b) => b.value - a.value);   break
      case 'sold_desc':  items.sort((a,b) => b.sold  - a.sold);    break
      default:           items.sort((a,b) => b.stock - a.stock)
    }

    // Category summary
    const catMap: Record<string, { count: number; totalStock: number; totalValue: number; lowStock: number }> = {}
    items.forEach(i => {
      const k = i.category || 'Other'
      if (!catMap[k]) catMap[k] = { count: 0, totalStock: 0, totalValue: 0, lowStock: 0 }
      catMap[k].count      += 1
      catMap[k].totalStock += i.stock
      catMap[k].totalValue += i.value
      if (i.status === 'low_stock' || i.status === 'out_of_stock') catMap[k].lowStock += 1
    })

    const summary = {
      totalProducts:   items.length,
      totalStockMetres: items.reduce((s,i) => s + i.stock, 0),
      totalValue:       items.reduce((s,i) => s + i.value, 0),
      outOfStock:       items.filter(i => i.status === 'out_of_stock').length,
      lowStock:         items.filter(i => i.status === 'low_stock').length,
      inStock:          items.filter(i => i.status === 'in_stock').length,
      fastMoving:       items.filter(i => i.velocity_label === 'Fast Moving').length,
      slowMoving:       items.filter(i => i.velocity_label === 'Slow Moving').length,
    }

    const byCategory = Object.entries(catMap).map(([cat, v]) => ({ category: cat, ...v }))
      .sort((a,b) => b.totalValue - a.totalValue)

    return NextResponse.json({ summary, byCategory, items })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
