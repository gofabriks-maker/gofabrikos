import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// GET /api/admin/reviews — list all reviews with filters
export async function GET(req: NextRequest) {
  try {
    const supabase = adminClient()
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') // 'pending' | 'approved' | 'all'
    const search = searchParams.get('search')

    let query = supabase
      .from('gf_reviews')
      .select('*')
      .order('created_at', { ascending: false })

    if (status === 'pending')  query = query.eq('is_approved', false)
    if (status === 'approved') query = query.eq('is_approved', true)
    if (search) query = query.or(
      `reviewer_name.ilike.%${search}%,product_slug.ilike.%${search}%,review_text.ilike.%${search}%`
    )

    const { data, error } = await query
    if (error) throw error
    return NextResponse.json({ reviews: data || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PATCH /api/admin/reviews — approve or delete a review
export async function PATCH(req: NextRequest) {
  try {
    const supabase = adminClient()
    const { id, action } = await req.json()

    if (!id || !action) return NextResponse.json({ error: 'Missing id or action' }, { status: 400 })

    if (action === 'approve') {
      const { error } = await supabase.from('gf_reviews').update({ is_approved: true }).eq('id', id)
      if (error) throw error
    } else if (action === 'reject') {
      const { error } = await supabase.from('gf_reviews').delete().eq('id', id)
      if (error) throw error
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
