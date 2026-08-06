import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Pages that require customer login
const PROTECTED_ROUTES = ['/account', '/orders', '/checkout']

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const pathname = request.nextUrl.pathname

  // ── Admin protection ────────────────────────────────────────────
  // Block all /admin/* routes except /admin/login itself
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const adminCookie = request.cookies.get('admin_session')
    if (!adminCookie || adminCookie.value !== 'authenticated') {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/admin/login'
      return NextResponse.redirect(loginUrl)
    }
  }

  // ── Customer auth (Supabase) ────────────────────────────────────
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route))

  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname === '/login' && user) {
    const redirect = request.nextUrl.searchParams.get('redirect') || '/account'
    const dest = request.nextUrl.clone()
    dest.pathname = redirect
    dest.searchParams.delete('redirect')
    return NextResponse.redirect(dest)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
