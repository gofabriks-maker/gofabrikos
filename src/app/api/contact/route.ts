import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// POST /api/contact — save contact form submission to Supabase
export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await req.json()

    if (!name?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Name and message are required' }, { status: 400 })
    }

    const supabase = adminClient()
    const { error } = await supabase.from('contact_messages').insert({
      name:    name.trim(),
      email:   email?.trim()   || null,
      phone:   phone?.trim()   || null,
      subject: subject?.trim() || null,
      message: message.trim(),
      status:  'unread',
    })

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('POST /api/contact error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
