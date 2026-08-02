'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Heart, Search, Menu, X, ChevronDown, User, LogOut } from 'lucide-react'
import { useWishlist } from '@/hooks/useWishlist'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

const navLinks = [
  { label: 'All Fabrics',     href: '/fabrics' },
  { label: 'Lehenga Fabrics', href: '/fabrics?category=lehenga' },
  { label: 'Blouse Fabrics',  href: '/fabrics?category=blouse' },
  { label: 'Kurti Fabrics',   href: '/fabrics?category=kurti' },
  { label: 'Dupattas',        href: '/fabrics?category=dupatta' },
  { label: 'Designer Sarees', href: '/fabrics?category=saree' },
  { label: '👗 Visualizer',   href: '/visualizer' },
  { label: 'B2B Wholesale',   href: '/b2b' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [headerSearch, setHeaderSearch] = useState('')
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const router = useRouter()
  const cartCount = 0
  const { wishlist } = useWishlist()
  const wishCount = wishlist.length

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
  }

  function handleHeaderSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = headerSearch.trim()
    if (q) router.push(`/fabrics?q=${encodeURIComponent(q)}`)
    setHeaderSearch('')
    setMobileOpen(false)
  }

  return (
    <>
      {/* Announcement Strip */}
      <div className="bg-primary text-white text-center text-xs py-2 px-4 font-medium tracking-wide">
        <span className="mx-3">✨ First Order Special Prices — Shop Now</span>
        <span className="hidden sm:inline">|</span>
        <span className="mx-3 hidden sm:inline">🚚 Free shipping above ₹999</span>
        <span className="hidden md:inline">|</span>
        <span className="mx-3 hidden md:inline">📄 GST Invoice on every order</span>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/logo.png"
                alt="GoFabrikos"
                width={220}
                height={180}
                className="h-14 w-auto"
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6 flex-1 justify-center">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-gray-700 hover:text-primary transition-colors whitespace-nowrap relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Search (desktop) */}
              <form onSubmit={handleHeaderSearch} className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 gap-2 w-48">
                <Search size={14} className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search fabrics…"
                  value={headerSearch}
                  onChange={e => setHeaderSearch(e.target.value)}
                  className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder:text-gray-400"
                />
              </form>

              {/* Wishlist */}
              <Link href="/wishlist" className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Heart size={20} className="text-gray-700" />
                {wishCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {wishCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link href="/cart" className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                <ShoppingBag size={20} className="text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Auth button */}
              {user ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/account" className="flex items-center gap-1.5 text-xs text-stone-700 hover:text-rose-600 transition-colors">
                    <div className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center">
                      <User size={13} className="text-rose-600" />
                    </div>
                    <span className="hidden md:block font-medium">{user.phone?.slice(-4) ? `••${user.phone.slice(-4)}` : 'Account'}</span>
                  </Link>
                  <button onClick={handleSignOut} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors" title="Sign out">
                    <LogOut size={14} className="text-stone-400 hover:text-rose-600" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:inline-flex btn-primary !py-2 !px-4 !text-xs"
                >
                  Login / Sign Up
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button
                className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg animate-fade-in">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-2.5 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-gray-100">
                {user ? (
                  <div className="flex gap-2">
                    <Link href="/account" className="btn-primary flex-1 justify-center !text-sm" onClick={() => setMobileOpen(false)}>
                      My Account
                    </Link>
                    <button onClick={handleSignOut} className="px-4 py-2 rounded-xl border border-stone-200 text-sm text-stone-600">
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link href="/login" className="btn-primary w-full justify-center !text-sm" onClick={() => setMobileOpen(false)}>
                    Login / Sign Up
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
