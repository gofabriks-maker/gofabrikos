import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// GET /api/reviews?slug=xxx — fetch approved reviews for a product
export async function GET(req: NextRequest) {
  try {
    const slug = new URL(req.url).searchParams.get('slug')
    if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 })

    const supabase = adminClient()
    const { data, error } = await supabase
      .from('gf_reviews')
      .select('id, reviewer_name, rating, review_text, is_verified, created_at')
      .eq('product_slug', slug)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error
    return NextResponse.json({ reviews: data || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/reviews — submit a review (goes into pending queue)
export async function POST(req: NextRequest) {
  try {
    const { product_slug, reviewer_name, rating, review_text } = await req.json()

    if (!product_slug || !reviewer_name?.trim() || !review_text?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be 1–5' }, { status: 400 })
    }

    const supabase = adminClient()
    const { error } = await supabase.from('gf_reviews').insert({
      product_slug,
      reviewer_name: reviewer_name.trim(),
      rating,
      review_text:   review_text.trim(),
      is_approved:   false,   // pending admin approval
    })

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
