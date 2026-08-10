import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// POST /api/coupons/validate
// Body: { code: string, subtotal: number, productSlugs?: string[] }
// Returns: { valid, discount, message, coupon }

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal, productSlugs } = await req.json()

    if (!code) return NextResponse.json({ valid: false, message: 'Please enter a coupon code' })

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const today = new Date().toISOString().split('T')[0]

    const { data: coupon, error } = await supabase
      .from('gf_coupons')
      .select('*')
      .eq('code', code.trim().toUpperCase())
      .eq('is_active', true)
      .lte('start_date', today)
      .gte('end_date', today)
      .single()

    if (error || !coupon) {
      return NextResponse.json({ valid: false, message: 'Invalid or expired coupon code' })
    }

    // Check usage limit
    if (coupon.usage_limit > 0 && coupon.used_count >= coupon.usage_limit) {
      return NextResponse.json({ valid: false, message: 'This coupon has reached its usage limit' })
    }

    // Check product-level coupon restriction
    // If any cart product has a specific coupon assigned, only that coupon is allowed for that product
    if (productSlugs && productSlugs.length > 0) {
      const { data: products } = await supabase
        .from('gf_products')
        .select('slug, coupon_code, name')
        .in('slug', productSlugs)
        .not('coupon_code', 'is', null)
        .neq('coupon_code', '')

      if (products && products.length > 0) {
        const restricted = products.filter((p: any) => p.coupon_code && p.coupon_code !== code.trim().toUpperCase())
        if (restricted.length > 0) {
          const names = restricted.map((p: any) => p.name).join(', ')
          return NextResponse.json({
            valid: false,
            message: `"${names}" only accepts coupon: ${restricted[0].coupon_code}`
          })
        }
      }
    }

    // Check min order
    if (subtotal < (coupon.min_order || 0)) {
      return NextResponse.json({
        valid: false,
        message: `Minimum order of ₹${coupon.min_order} required for this coupon`
      })
    }

    // Calculate discount
    let discount = 0
    if (coupon.type === 'percent') {
      discount = Math.round(subtotal * coupon.value / 100)
      if (coupon.max_discount) discount = Math.min(discount, coupon.max_discount)
    } else {
      discount = coupon.value
    }

    return NextResponse.json({
      valid: true,
      discount,
      message: `${coupon.type === 'percent' ? coupon.value + '% off' : '₹' + coupon.value + ' off'} applied!`,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        description: coupon.description,
      }
    })
  } catch (e: any) {
    return NextResponse.json({ valid: false, message: 'Something went wrong' })
  }
}
