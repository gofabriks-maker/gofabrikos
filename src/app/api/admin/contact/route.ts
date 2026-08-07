import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// GET /api/admin/contact?filter=all&search=xxx
export async function GET(req: NextRequest) {
  try {
    const supabase = db()
    const { searchParams } = new URL(req.url)
    const filter = searchParams.get('filter') || 'all'
    const search = searchParams.get('search') || ''

    let q = supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (filter !== 'all') q = q.eq('status', filter)
    if (search) q = q.or(
      `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,subject.ilike.%${search}%`
    )

    const { data, error } = await q
    if (error) throw error
    return NextResponse.json({ messages: data || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PATCH /api/admin/contact — update message status
export async function PATCH(req: NextRequest) {
  try {
    const supabase = db()
    const { id, status } = await req.json()
    if (!id || !status) return NextResponse.json({ error: 'Missing id or status' }, { status: 400 })

    const { error } = await supabase
      .from('contact_messages')
      .update({ status })
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
