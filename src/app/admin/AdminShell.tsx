'use client'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import {
  LayoutDashboard, ShoppingBag, Package, Layers, Users,
  Briefcase, MessageSquare, IndianRupee, FileBarChart,
  Receipt, Settings, Shield, ChevronLeft, ChevronRight,
  Bell, Search, Sun, Moon, LogOut, X, Scissors, Tag,
  Star, BarChart3, Zap, AlertTriangle, TrendingUp,
  Archive, CreditCard, Globe, HelpCircle, Activity
} from 'lucide-react'

const NAV = [
  {
    group: 'MAIN',
    items: [
      { href: '/admin',            label: 'Dashboard',   icon: LayoutDashboard },
      { href: '/admin/orders',     label: 'Orders',      icon: ShoppingBag,    badge: 'orders' },
      { href: '/admin/products',   label: 'Products',    icon: Package },
      { href: '/admin/inventory',  label: 'Inventory',   icon: Layers },
      { href: '/admin/cutting',    label: 'Cutting',     icon: Scissors },
    ],
  },
  {
    group: 'CUSTOMERS',
    items: [
      { href: '/admin/customers',  label: 'Customers',   icon: Users },
      { href: '/admin/wholesale',  label: 'Wholesale',   icon: Briefcase,      badge: 'wholesale' },
      { href: '/admin/reviews',    label: 'Reviews',     icon: Star },
      { href: '/admin/messages',   label: 'Messages',    icon: MessageSquare,  badge: 'messages' },
    ],
  },
  {
    group: 'FINANCE',
    items: [
      { href: '/admin/finance',    label: 'Finance',     icon: IndianRupee },
      { href: '/admin/invoices',   label: 'Invoices',    icon: Receipt },
      { href: '/admin/reports',    label: 'Reports',     icon: FileBarChart },
      { href: '/admin/promotions', label: 'Promotions',  icon: Tag },
    ],
  },
  {
    group: 'SYSTEM',
    items: [
      { href: '/admin/settings',   label: 'Settings',    icon: Settings },
      { href: '/admin/team',       label: 'Admin Users', icon: Shield },
      { href: '/admin/seo',        label: 'SEO',         icon: Globe },
    ],
  },
]

type BadgeCounts = { orders: number; wholesale: number; messages: number }

function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter()
  const [q, setQ] = useState('')

  useEffect(() => { if (open) setQ('') }, [open])

  const QUICK = [
    { label: 'Dashboard',   href: '/admin',           icon: LayoutDashboard },
    { label: 'New Order',   href: '/admin/orders',    icon: ShoppingBag },
    { label: 'Add Product', href: '/admin/products/new', icon: Package },
    { label: 'Inventory',   href: '/admin/inventory', icon: Layers },
    { label: 'Reports',     href: '/admin/reports',   icon: FileBarChart },
    { label: 'Settings',    href: '/admin/settings',  icon: Settings },
  ]

  const filtered = q.length > 1
    ? QUICK.filter(i => i.label.toLowerCase().includes(q.toLowerCase()))
    : QUICK

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
         onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden"
           onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <Search size={18} className="text-stone-400 shrink-0" />
          <input autoFocus value={q} onChange={e => setQ(e.target.value)}
            placeholder="Search pages, orders, products…"
            className="flex-1 text-sm outline-none text-stone-800 placeholder-stone-400" />
          <button onClick={onClose}><X size={16} className="text-stone-400" /></button>
        </div>
        <div className="py-2">
          <p className="text-xs font-semibold text-stone-400 px-4 py-1.5">QUICK NAV</p>
          {filtered.map(item => (
            <button key={item.href} onClick={() => { router.push(item.href); onClose() }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-stone-50 text-left">
              <item.icon size={16} className="text-stone-500" />
              <span className="text-sm text-stone-700">{item.label}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-stone-400 px-4 py-4 text-center">No results for "{q}"</p>
          )}
        </div>
        <div className="border-t px-4 py-2 flex gap-3 text-xs text-stone-400">
          <span className="flex items-center gap-1"><kbd className="bg-stone-100 px-1.5 py-0.5 rounded font-mono">↵</kbd> open</span>
          <span className="flex items-center gap-1"><kbd className="bg-stone-100 px-1.5 py-0.5 rounded font-mono">Esc</kbd> close</span>
        </div>
      </div>
    </div>
  )
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()

  const [collapsed,  setCollapsed]  = useState(false)
  const [darkMode,   setDarkMode]   = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [badges] = useState<BadgeCounts>({ orders: 4, wholesale: 1, messages: 3 })
  const [mobileOpen, setMobileOpen] = useState(false)

  // Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(v => !v)
      }
      if (e.key === 'Escape') setSearchOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  async function handleLogout() {
    await fetch('/api/admin/login', { method: 'DELETE' })
    router.push('/admin/login')
    router.refresh()
  }

  // Don't wrap the login page
  if (pathname === '/admin/login') return <>{children}</>

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  const getBadge = (key: string) =>
    badges[key as keyof BadgeCounts] > 0 ? badges[key as keyof BadgeCounts] : null

  const currentPage = NAV.flatMap(g => g.items).find(i => isActive(i.href))?.label ?? 'Admin'

  // Sidebar content (shared between desktop and mobile)
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-2.5 px-4 py-5 border-b border-stone-800 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-sm">GF</div>
        {!collapsed && (
          <div>
            <p className="text-white font-bold text-sm leading-none">GoFabrikos</p>
            <p className="text-stone-500 text-xs mt-0.5">Admin ERP</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">
        {NAV.map(group => (
          <div key={group.group} className="mb-3">
            {!collapsed && (
              <p className="text-stone-600 text-[10px] font-bold tracking-widest px-2 py-1.5">{group.group}</p>
            )}
            {group.items.map(item => {
              const active = isActive(item.href)
              const badge  = item.badge ? getBadge(item.badge) : null
              return (
                <Link key={item.href} href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all group mb-0.5
                    ${active
                      ? 'bg-rose-600 text-white'
                      : 'text-stone-400 hover:bg-stone-800 hover:text-white'
                    } ${collapsed ? 'justify-center' : ''}`}>
                  <item.icon size={17} className="shrink-0" />
                  {!collapsed && (
                    <span className="text-sm font-medium flex-1">{item.label}</span>
                  )}
                  {!collapsed && badge && (
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full
                      ${active ? 'bg-white/25 text-white' : 'bg-rose-600 text-white'}`}>
                      {badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Bottom user section */}
      <div className="border-t border-stone-800 p-3 space-y-1">
        <button onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-stone-400 hover:bg-red-900/40 hover:text-red-400 transition-all ${collapsed ? 'justify-center' : ''}`}>
          <LogOut size={16} />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
        {!collapsed && (
          <div className="px-3 py-2">
            <p className="text-white text-xs font-semibold">Lakshmi Sowjanya Aaki</p>
            <p className="text-stone-500 text-xs">Super Admin · Guntur, AP</p>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? 'dark' : ''}`}>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col bg-stone-950 border-r border-stone-800 transition-all duration-300 shrink-0
        ${collapsed ? 'w-16' : 'w-56'}`}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-56 bg-stone-950 border-r border-stone-800 z-50">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-stone-200 px-4 py-3 flex items-center gap-3 shrink-0 z-30">
          {/* Mobile menu */}
          <button className="md:hidden p-1.5 rounded-lg hover:bg-stone-100" onClick={() => setMobileOpen(true)}>
            <div className="w-5 h-0.5 bg-stone-600 mb-1" />
            <div className="w-5 h-0.5 bg-stone-600 mb-1" />
            <div className="w-5 h-0.5 bg-stone-600" />
          </button>

          {/* Desktop collapse */}
          <button className="hidden md:flex p-1.5 rounded-lg hover:bg-stone-100 text-stone-500"
            onClick={() => setCollapsed(v => !v)}>
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          {/* Page title */}
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-stone-900 truncate">{currentPage}</h1>
            <p className="text-xs text-stone-400 hidden sm:block">GoFabrikos Admin ERP</p>
          </div>

          {/* Search */}
          <button onClick={() => setSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-stone-100 hover:bg-stone-200 rounded-xl px-3 py-2 text-stone-500 text-sm transition-colors">
            <Search size={14} />
            <span className="text-xs">Search…</span>
            <kbd className="text-xs bg-white border border-stone-200 rounded px-1.5 py-0.5 font-mono ml-1">⌘K</kbd>
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-xl hover:bg-stone-100 text-stone-500">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
          </button>

          {/* Dark mode */}
          <button onClick={() => setDarkMode(v => !v)}
            className="p-2 rounded-xl hover:bg-stone-100 text-stone-500">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Avatar */}
          <div className="w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center text-white text-xs font-bold">LA</div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-stone-50">
          {children}
        </main>
      </div>
    </div>
  )
}
