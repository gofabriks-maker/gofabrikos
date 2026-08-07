import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// GET /api/admin/wholesale — list enquiries with optional status filter + search
export async function GET(req: NextRequest) {
  try {
    const supabase = adminClient()
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    let query = supabase
      .from('wholesale_enquiries')
      .select('*')
      .order('created_at', { ascending: false })

    if (status && status !== 'all') query = query.eq('status', status)
    if (search) query = query.or(
      `business_name.ilike.%${search}%,contact_name.ilike.%${search}%,mobile.ilike.%${search}%`
    )

    const { data, error } = await query
    if (error) throw error
    return NextResponse.json({ enquiries: data || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PATCH /api/admin/wholesale — update status and/or admin notes
export async function PATCH(req: NextRequest) {
  try {
    const supabase = adminClient()
    const { id, status, admin_notes } = await req.json()

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const update: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (status)      update.status      = status
    if (admin_notes !== undefined) update.admin_notes = admin_notes

    const { error } = await supabase.from('wholesale_enquiries').update(update).eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
