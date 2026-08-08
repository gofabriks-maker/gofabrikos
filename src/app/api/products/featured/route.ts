import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

// GET /api/products/featured — returns up to 4 products for homepage
export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('gf_products')
      .select('id, name, slug, category, selling_price, mrp, cloudinary_url')
      .limit(4)

    if (error) {
      console.error('Featured products error:', error)
      return NextResponse.json({ products: [] })
    }

    return NextResponse.json({ products: data || [] })
  } catch (e) {
    console.error('Featured products exception:', e)
    return NextResponse.json({ products: [] })
  }
}
