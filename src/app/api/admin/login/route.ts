import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword) {
    return NextResponse.json({ error: 'Admin not configured' }, { status: 500 })
  }

  if (password !== adminPassword) {
    // Small delay to slow down brute-force attempts
    await new Promise(r => setTimeout(r, 1000))
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
  }

  const res = NextResponse.json({ success: true })
  // Secure cookie — httpOnly, sameSite strict, 8-hour session
  res.cookies.set('admin_session', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 8, // 8 hours
    path: '/',
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ success: true })
  res.cookies.set('admin_session', '', { maxAge: 0, path: '/' })
  return res
}
