'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Package, Truck, Check, Clock, XCircle, ChevronRight, Search, Filter } from 'lucide-react'

type OrderStatus = 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

interface Order {
  id: string
  date: string
  items: { name: string; qty: number; price: number; img: string }[]
  status: OrderStatus
  total: number
  tracking?: string
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  confirmed:  { label: 'Confirmed',  color: 'text-blue-700',    bg: 'bg-blue-100',    icon: <Check size={12} /> },
  processing: { label: 'Processing', color: 'text-amber-700',   bg: 'bg-amber-100',   icon: <Clock size={12} /> },
  shipped:    { label: 'Shipped',    color: 'text-indigo-700',  bg: 'bg-indigo-100',  icon: <Truck size={12} /> },
  delivered:  { label: 'Delivered',  color: 'text-emerald-700', bg: 'bg-emerald-100', icon: <Check size={12} /> },
  cancelled:  { label: 'Cancelled',  color: 'text-red-700',     bg: 'bg-red-100',     icon: <XCircle size={12} /> },
}

const ORDERS: Order[] = [
  {
    id: 'NF-2026-849231',
    date: '24 Jul 2026',
    status: 'shipped',
    total: 6375,
    tracking: 'DTDC1234567890',
    items: [
      { name: 'Mull Chanderi Digital Print', qty: 3, price: 125, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&q=80' },
      { name: 'Pure Silk Banarasi Brocade',  qty: 6, price: 850, img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=80&q=80' },
    ],
  },
  {
    id: 'NF-2026-720115',
    date: '18 Jul 2026',
    status: 'delivered',
    total: 2240,
    items: [
      { name: 'Handloom Khadi Cotton', qty: 8, price: 280, img: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=80&q=80' },
    ],
  },
  {
    id: 'NF-2026-603448',
    date: '10 Jul 2026',
    status: 'delivered',
    total: 3900,
    items: [
      { name: 'Kanjivaram Pure Silk', qty: 2, price: 1200, img: 'https://images.unsplash.com/photo-1594938298603-c8148c4f4d47?w=80&q=80' },
      { name: 'Georgette Embroidered', qty: 5, price: 320, img: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=80&q=80' },
      { name: 'Linen Slub', qty: 1, price: 195, img: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=80&q=80' },
    ],
  },
  {
    id: 'NF-2026-511900',
    date: '2 Jul 2026',
    status: 'cancelled',
    total: 1625,
    items: [
      { name: 'Mysore Silk Plain', qty: 2, price: 650, img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=80&q=80' },
    ],
  },
]

const FILTER_TABS: { id: 'all' | OrderStatus; label: string }[] = [
  { id: 'all',       label: 'All Orders' },
  { id: 'processing',label: 'Processing' },
  { id: 'shipped',   label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
]

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
      {cfg.icon} {cfg.label}
    </span>
  )
}

export default function OrdersPage() {
  const [filter, setFilter] = useState<'all' | OrderStatus>('all')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = ORDERS.filter(o => {
    if (filter !== 'all' && o.status !== filter) return false
    if (search && !o.id.toLowerCase().includes(search.toLowerCase()) &&
        !o.items.some(i => i.name.toLowerCase().includes(search.toLowerCase()))) return false
    return true
  })

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-rose-800 tracking-wide">
            NAARI<span className="text-stone-400 font-light"> Fashions</span>
          </Link>
          <div className="flex items-center gap-4 text-sm text-stone-600">
            <Link href="/fabrics" className="hover:text-rose-700">Shop</Link>
            <Link href="/account" className="hover:text-rose-700">Account</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
            <Package size={22} className="text-rose-700" /> My Orders
          </h1>
          <Link
            href="/track-order"
            className="flex items-center gap-1.5 text-sm text-rose-700 border border-rose-300 px-4 py-2 rounded-full hover:bg-rose-50"
          >
            <Truck size={14} /> Track by ID
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by order ID or product name…"
            className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-rose-400 bg-white"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {FILTER_TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                filter === t.id
                  ? 'bg-rose-800 text-white'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-rose-300'
              }`}
            >
              {t.label}
              {t.id !== 'all' && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({ORDERS.filter(o => o.status === t.id).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Order cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-stone-400">
            <Package size={48} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No orders found</p>
            <Link href="/fabrics" className="mt-3 inline-block text-rose-600 text-sm hover:underline">
              Start shopping →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(order => (
              <div key={order.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                {/* Header */}
                <div className="p-5 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-mono text-sm font-bold text-stone-800">{order.id}</p>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-xs text-stone-500">Placed on {order.date} · {order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-stone-800">₹{order.total.toLocaleString()}</p>
                    <button
                      onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                      className="text-xs text-rose-600 hover:underline mt-0.5 flex items-center gap-0.5 ml-auto"
                    >
                      {expanded === order.id ? 'Hide' : 'Details'} <ChevronRight size={12} className={`transition-transform ${expanded === order.id ? 'rotate-90' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Item thumbnails (always visible) */}
                <div className="px-5 pb-4 flex gap-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.img} alt={item.name} className="w-12 h-12 object-cover rounded-lg border border-stone-100" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-stone-700 text-white text-[9px] rounded-full flex items-center justify-center font-bold">{item.qty}m</span>
                    </div>
                  ))}
                </div>

                {/* Expanded details */}
                {expanded === order.id && (
                  <div className="border-t border-stone-100 p-5 bg-stone-50">
                    <div className="space-y-3 mb-4">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex gap-3 items-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.img} alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-stone-800">{item.name}</p>
                            <p className="text-xs text-stone-500">{item.qty} m × ₹{item.price}/m</p>
                          </div>
                          <p className="text-sm font-semibold text-stone-800">₹{(item.qty * item.price).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>

                    {order.tracking && (
                      <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-xl border border-indigo-200 text-sm">
                        <div>
                          <p className="font-semibold text-indigo-800">Tracking: {order.tracking}</p>
                          <p className="text-xs text-indigo-600">via DTDC Courier</p>
                        </div>
                        <Link
                          href={`/track-order?id=${order.id}`}
                          className="px-3 py-1.5 bg-indigo-700 text-white text-xs rounded-lg hover:bg-indigo-800"
                        >
                          Track →
                        </Link>
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      {order.status === 'delivered' && (
                        <button className="flex-1 py-2 border border-stone-300 text-stone-700 text-sm rounded-xl hover:bg-stone-100">
                          Download Invoice
                        </button>
                      )}
                      {order.status !== 'cancelled' && order.status !== 'delivered' && (
                        <button className="flex-1 py-2 border border-red-300 text-red-700 text-sm rounded-xl hover:bg-red-50">
                          Cancel Order
                        </button>
                      )}
                      <button className="flex-1 py-2 bg-rose-800 text-white text-sm rounded-xl hover:bg-rose-900">
                        Reorder
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
