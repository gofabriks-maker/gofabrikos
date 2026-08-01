'use client'
import { useState } from 'react'
import Link from 'next/link'
import { User, Package, MapPin, Heart, Bell, LogOut, Edit2, Check, ChevronRight, Star, Shield } from 'lucide-react'

type Tab = 'profile' | 'orders' | 'addresses' | 'wishlist'

const USER = {
  name: 'Lakshmi Sowjanya Aaki',
  email: 'sowjanya@gofabrikos.com',
  mobile: '+91 95817 34837',
  joined: 'March 2025',
  gstin: '37AAGTS1234A1Z5',
  totalOrders: 4,
  totalSpend: 13535,
}

const RECENT_ORDERS = [
  { id: 'NF-2026-849231', date: '24 Jul 2026', status: 'shipped',   total: 6375, items: 2 },
  { id: 'NF-2026-720115', date: '18 Jul 2026', status: 'delivered', total: 2240, items: 1 },
  { id: 'NF-2026-603448', date: '10 Jul 2026', status: 'delivered', total: 3900, items: 3 },
]

const ADDRESSES = [
  { id: 1, label: '🏠 Home', name: 'Lakshmi Sowjanya Aaki', line1: 'Shop No. 346, Sri Vasavi WCS, Mangalagiri Road', city: 'Guntur', state: 'Andhra Pradesh', pin: '522001', mobile: '9581734837', isDefault: true },
  { id: 2, label: '🏢 Office', name: 'GoFabrikos', line1: '3rd Floor, Shop No. 346, Sri Vasavi WCS', city: 'Guntur', state: 'Andhra Pradesh', pin: '522001', mobile: '9581734837', isDefault: false },
]

const WISHLIST = [
  { id: 1, name: 'Kanjivaram Pure Silk',       price: 1200, img: 'https://images.unsplash.com/photo-1594938298603-c8148c4f4d47?w=200&q=80', rating: 4.8 },
  { id: 2, name: 'Handblock Dabu Print Cotton', price: 380,  img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80', rating: 4.6 },
  { id: 3, name: 'Pashmina Wool Blend',         price: 950,  img: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=200&q=80', rating: 4.9 },
  { id: 4, name: 'Georgette Embroidered',       price: 320,  img: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=200&q=80', rating: 4.5 },
]

const STATUS_COLORS: Record<string, string> = {
  shipped:   'bg-indigo-100 text-indigo-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
}

const NAV_ITEMS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'profile',   label: 'My Profile',    icon: <User size={16} /> },
  { id: 'orders',    label: 'My Orders',     icon: <Package size={16} /> },
  { id: 'addresses', label: 'Addresses',     icon: <MapPin size={16} /> },
  { id: 'wishlist',  label: 'Wishlist',      icon: <Heart size={16} /> },
]

export default function AccountPage() {
  const [tab, setTab]     = useState<Tab>('profile')
  const [editing, setEdit] = useState(false)
  const [form, setForm]   = useState({ name: USER.name, mobile: USER.mobile, gstin: USER.gstin })

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-rose-800 tracking-wide">
            Go<span className="text-stone-400 font-light">Fabrikos</span>
          </Link>
          <div className="flex items-center gap-4 text-sm text-stone-600">
            <Link href="/fabrics" className="hover:text-rose-700">Shop</Link>
            <Link href="/orders" className="hover:text-rose-700">Orders</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">

        {/* ── Sidebar ─────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Avatar card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 text-center">
            <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-rose-700">
                {USER.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </span>
            </div>
            <p className="font-bold text-stone-800">{USER.name}</p>
            <p className="text-xs text-stone-500 mt-0.5">{USER.email}</p>
            <div className="flex justify-center gap-4 mt-3 text-center">
              <div>
                <p className="font-bold text-stone-800">{USER.totalOrders}</p>
                <p className="text-xs text-stone-400">Orders</p>
              </div>
              <div className="border-l border-stone-100" />
              <div>
                <p className="font-bold text-rose-700">₹{USER.totalSpend.toLocaleString()}</p>
                <p className="text-xs text-stone-400">Spent</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            {NAV_ITEMS.map((item, i) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm transition-all ${
                  tab === item.id
                    ? 'bg-rose-50 text-rose-800 font-semibold border-l-2 border-rose-700'
                    : 'text-stone-600 hover:bg-stone-50'
                } ${i > 0 ? 'border-t border-stone-100' : ''}`}
              >
                {item.icon} {item.label}
                <ChevronRight size={14} className="ml-auto opacity-40" />
              </button>
            ))}
            <button className="w-full flex items-center gap-3 px-5 py-3.5 text-sm text-red-500 hover:bg-red-50 border-t border-stone-100">
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>

        {/* ── Main content ─────────────────────────────────── */}
        <div>

          {/* PROFILE TAB */}
          {tab === 'profile' && (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-stone-800">My Profile</h2>
                <button
                  onClick={() => setEdit(!editing)}
                  className="flex items-center gap-1.5 text-sm text-rose-700 border border-rose-300 px-4 py-2 rounded-full hover:bg-rose-50"
                >
                  {editing ? <><Check size={14} /> Save</> : <><Edit2 size={14} /> Edit</>}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { label: 'Full Name', key: 'name', value: form.name },
                  { label: 'Email', key: 'email', value: USER.email, readonly: true },
                  { label: 'Mobile', key: 'mobile', value: form.mobile },
                  { label: 'GSTIN', key: 'gstin', value: form.gstin },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">{field.label}</label>
                    {editing && !field.readonly ? (
                      <input
                        value={form[field.key as keyof typeof form] || field.value}
                        onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                        className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400"
                      />
                    ) : (
                      <p className="text-stone-800 font-medium py-2.5">{form[field.key as keyof typeof form] || field.value}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="mt-8 pt-6 border-t border-stone-100 grid grid-cols-3 gap-2 sm:gap-4 text-center">
                <div className="p-4 bg-stone-50 rounded-xl">
                  <p className="text-2xl font-bold text-rose-700">{USER.totalOrders}</p>
                  <p className="text-xs text-stone-500 mt-1">Total Orders</p>
                </div>
                <div className="p-4 bg-stone-50 rounded-xl">
                  <p className="text-2xl font-bold text-emerald-600">₹{USER.totalSpend.toLocaleString()}</p>
                  <p className="text-xs text-stone-500 mt-1">Total Spent</p>
                </div>
                <div className="p-4 bg-stone-50 rounded-xl">
                  <p className="text-2xl font-bold text-stone-800">{USER.joined}</p>
                  <p className="text-xs text-stone-500 mt-1">Member Since</p>
                </div>
              </div>

              {/* GST note */}
              {USER.gstin && (
                <div className="mt-5 p-3 bg-blue-50 rounded-xl border border-blue-200 flex items-center gap-2 text-sm text-blue-700">
                  <Shield size={14} />
                  GST invoices are auto-generated for GSTIN: <span className="font-mono font-semibold">{USER.gstin}</span>
                </div>
              )}
            </div>
          )}

          {/* ORDERS TAB */}
          {tab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-stone-800">My Orders</h2>
                <Link href="/orders" className="text-sm text-rose-600 hover:underline">View all →</Link>
              </div>
              {RECENT_ORDERS.map(order => (
                <div key={order.id} className="bg-white rounded-2xl border border-stone-200 p-5 flex items-center justify-between">
                  <div>
                    <p className="font-mono font-bold text-stone-800 text-sm">{order.id}</p>
                    <p className="text-xs text-stone-500 mt-0.5">{order.date} · {order.items} item{order.items > 1 ? 's' : ''}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <p className="text-sm font-bold text-stone-800 mt-1">₹{order.total.toLocaleString()}</p>
                  </div>
                </div>
              ))}
              <Link
                href="/orders"
                className="block w-full py-3 border border-stone-200 text-stone-600 text-sm font-medium rounded-xl text-center hover:bg-stone-50"
              >
                View All Orders →
              </Link>
            </div>
          )}

          {/* ADDRESSES TAB */}
          {tab === 'addresses' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-stone-800">Saved Addresses</h2>
                <button className="flex items-center gap-1.5 text-sm text-rose-700 border border-rose-300 px-4 py-2 rounded-full hover:bg-rose-50">
                  + Add New
                </button>
              </div>
              <div className="space-y-4">
                {ADDRESSES.map(addr => (
                  <div key={addr.id} className={`bg-white rounded-2xl border-2 p-5 ${addr.isDefault ? 'border-rose-300' : 'border-stone-200'}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-stone-800">{addr.label}</p>
                          {addr.isDefault && (
                            <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-xs rounded-full font-medium">Default</span>
                          )}
                        </div>
                        <p className="text-sm text-stone-700">{addr.name}</p>
                        <p className="text-sm text-stone-500 mt-0.5">{addr.line1}, {addr.city}, {addr.state} – {addr.pin}</p>
                        <p className="text-sm text-stone-500">📞 {addr.mobile}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-xs text-rose-600 hover:underline">Edit</button>
                        {!addr.isDefault && <button className="text-xs text-stone-400 hover:text-red-500">Delete</button>}
                      </div>
                    </div>
                    {!addr.isDefault && (
                      <button className="mt-3 text-xs text-stone-500 hover:text-rose-700">Set as Default</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WISHLIST TAB */}
          {tab === 'wishlist' && (
            <div>
              <h2 className="text-lg font-bold text-stone-800 mb-5">
                My Wishlist <span className="text-stone-400 font-normal text-base">({WISHLIST.length})</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {WISHLIST.map(item => (
                  <div key={item.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden group">
                    <div className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.img} alt={item.name} className="w-full aspect-square object-cover" />
                      <button className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow hover:bg-red-50">
                        <Heart size={14} className="text-red-500 fill-red-500" />
                      </button>
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-medium text-stone-800 leading-tight mb-1 line-clamp-2">{item.name}</p>
                      <div className="flex items-center gap-1 mb-2">
                        <Star size={10} className="text-amber-400 fill-amber-400" />
                        <span className="text-xs text-stone-500">{item.rating}</span>
                      </div>
                      <p className="text-sm font-bold text-rose-700 mb-2">₹{item.price}/m</p>
                      <button className="w-full py-1.5 bg-rose-800 text-white text-xs rounded-lg hover:bg-rose-900 transition-colors">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
