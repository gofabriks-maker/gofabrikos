import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// POST /api/newsletter — subscribe an email
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    const trimmed = (email || '').trim().toLowerCase()
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
    if (!trimmed || !valid) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    const supabase = adminClient()
    const { error } = await supabase
      .from('subscribers')
      .upsert(
        { email: trimmed, is_active: true },
        { onConflict: 'email' }
      )

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('POST /api/newsletter error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// GET /api/newsletter — list subscribers (admin use)
export async function GET() {
  try {
    const supabase = adminClient()
    const { data, count, error } = await supabase
      .from('subscribers')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .order('subscribed_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ subscribers: data || [], total: count || 0 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
