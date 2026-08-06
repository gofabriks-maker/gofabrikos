'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Search, Filter, Download, RefreshCw, Eye, Package,
  Truck, CheckCircle, XCircle, RotateCcw, Clock, ChevronDown,
  ArrowUpRight, Printer, MessageSquare, Plus, IndianRupee,
  ChevronLeft, ChevronRight, AlertCircle
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────
type OrderStatus =
  | 'pending' | 'confirmed' | 'processing' | 'picking' | 'packing'
  | 'dispatched' | 'shipped' | 'delivered' | 'cancelled' | 'returned' | 'refunded'

interface Order {
  id:         string
  number:     string
  customer:   string
  phone:      string
  email:      string
  items:      number
  metres:     number
  subtotal:   number
  total:      number
  status:     OrderStatus
  payment:    string
  source:     string
  courier?:   string
  tracking?:  string
  date:       string
  city:       string
}

// ── Mock data ──────────────────────────────────────────────────────────────
const MOCK_ORDERS: Order[] = [
  { id:'1', number:'GF-2026-0024', customer:'Ananya Reddy',    phone:'9876543210', email:'ananya@gmail.com',   items:2, metres:5.5,  subtotal:3500, total:3850,  status:'delivered',   payment:'paid',    source:'website', courier:'Delhivery', tracking:'DL123456', date:'2026-08-05', city:'Hyderabad' },
  { id:'2', number:'GF-2026-0023', customer:'Priya Sharma',    phone:'9123456780', email:'priya@gmail.com',    items:1, metres:2.75, subtotal:1200, total:1299,  status:'shipped',     payment:'paid',    source:'website', courier:'DTDC',      tracking:'DT789012', date:'2026-08-05', city:'Vijayawada' },
  { id:'3', number:'GF-2026-0022', customer:'Meena Patel',     phone:'9988776655', email:'meena@yahoo.com',    items:3, metres:8.25, subtotal:5200, total:5600,  status:'processing',  payment:'paid',    source:'website', date:'2026-08-04', city:'Surat' },
  { id:'4', number:'GF-2026-0021', customer:'Lakshmi Devi',    phone:'9765432109', email:'lakshmi@gmail.com',  items:2, metres:4.5,  subtotal:2200, total:2400,  status:'confirmed',   payment:'paid',    source:'whatsapp', date:'2026-08-04', city:'Chennai' },
  { id:'5', number:'GF-2026-0020', customer:'Sunita Kumari',   phone:'9654321098', email:'sunita@gmail.com',   items:1, metres:2.75, subtotal:700,  total:780,   status:'pending',     payment:'pending', source:'website', date:'2026-08-03', city:'Bangalore' },
  { id:'6', number:'GF-2026-0019', customer:'Rekha Nair',      phone:'9543210987', email:'rekha@gmail.com',    items:4, metres:11,   subtotal:8900, total:9500,  status:'dispatched',  payment:'paid',    source:'b2b', courier:'BlueDart', tracking:'BD345678', date:'2026-08-03', city:'Kochi' },
  { id:'7', number:'GF-2026-0018', customer:'Deepa Varma',     phone:'9432109876', email:'deepa@gmail.com',    items:1, metres:3.5,  subtotal:2100, total:2250,  status:'cancelled',   payment:'refunded',source:'website', date:'2026-08-02', city:'Pune' },
  { id:'8', number:'GF-2026-0017', customer:'Kavitha Rao',     phone:'9321098765', email:'kavitha@gmail.com',  items:2, metres:5.5,  subtotal:3200, total:3500,  status:'delivered',   payment:'paid',    source:'website', courier:'Delhivery', date:'2026-08-02', city:'Guntur' },
  { id:'9', number:'GF-2026-0016', customer:'Pooja Singh',     phone:'9210987654', email:'pooja@gmail.com',    items:1, metres:2,    subtotal:900,  total:999,   status:'returned',    payment:'refunded',source:'website', date:'2026-08-01', city:'Delhi' },
  { id:'10',number:'GF-2026-0015', customer:'Usha Krishnan',   phone:'9109876543', email:'usha@gmail.com',     items:3, metres:7.5,  subtotal:4500, total:4800,  status:'delivered',   payment:'paid',    source:'website', courier:'DTDC', date:'2026-07-31', city:'Coimbatore' },
]

// ── Status config ──────────────────────────────────────────────────────────
const STATUS: Record<OrderStatus, { label: string; cls: string; icon: React.ElementType }> = {
  pending:     { label: 'Pending',     cls: 'bg-orange-100 text-orange-700', icon: Clock },
  confirmed:   { label: 'Confirmed',   cls: 'bg-cyan-100 text-cyan-700',    icon: CheckCircle },
  processing:  { label: 'Processing',  cls: 'bg-amber-100 text-amber-700',  icon: Package },
  picking:     { label: 'Picking',     cls: 'bg-yellow-100 text-yellow-700',icon: Package },
  packing:     { label: 'Packing',     cls: 'bg-blue-100 text-blue-700',    icon: Package },
  dispatched:  { label: 'Dispatched',  cls: 'bg-indigo-100 text-indigo-700',icon: Truck },
  shipped:     { label: 'Shipped',     cls: 'bg-blue-100 text-blue-700',    icon: Truck },
  delivered:   { label: 'Delivered',   cls: 'bg-green-100 text-green-700',  icon: CheckCircle },
  cancelled:   { label: 'Cancelled',   cls: 'bg-red-100 text-red-700',      icon: XCircle },
  returned:    { label: 'Returned',    cls: 'bg-purple-100 text-purple-700',icon: RotateCcw },
  refunded:    { label: 'Refunded',    cls: 'bg-stone-100 text-stone-600',  icon: RotateCcw },
}

const STATUS_FILTERS: { label: string; value: string }[] = [
  { label: 'All',        value: 'all' },
  { label: 'Pending',    value: 'pending' },
  { label: 'Confirmed',  value: 'confirmed' },
  { label: 'Processing', value: 'processing' },
  { label: 'Dispatched', value: 'dispatched' },
  { label: 'Shipped',    value: 'shipped' },
  { label: 'Delivered',  value: 'delivered' },
  { label: 'Cancelled',  value: 'cancelled' },
  { label: 'Returned',   value: 'returned' },
]

// ── Order Detail Panel ────────────────────────────────────────────────────
function OrderPanel({ order, onClose, onUpdate }: {
  order: Order | null; onClose: () => void; onUpdate: (id: string, status: OrderStatus) => void
}) {
  if (!order) return null
  const s = STATUS[order.status]
  const SIcon = s.icon

  const NEXT_STATES: Partial<Record<OrderStatus, OrderStatus>> = {
    pending:    'confirmed',
    confirmed:  'processing',
    processing: 'dispatched',
    dispatched: 'shipped',
    shipped:    'delivered',
  }

  const TIMELINE: { status: string; label: string; done: boolean }[] = [
    { status: 'confirmed',  label: 'Order Confirmed',  done: !['pending'].includes(order.status) },
    { status: 'processing', label: 'Processing',       done: !['pending','confirmed'].includes(order.status) },
    { status: 'dispatched', label: 'Dispatched',       done: ['dispatched','shipped','delivered'].includes(order.status) },
    { status: 'shipped',    label: 'Shipped',          done: ['shipped','delivered'].includes(order.status) },
    { status: 'delivered',  label: 'Delivered',        done: order.status === 'delivered' },
  ]

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-5 py-4 flex items-center gap-3 z-10">
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-stone-100">
            <ChevronRight size={18} />
          </button>
          <div className="flex-1">
            <p className="font-bold text-stone-900">{order.number}</p>
            <p className="text-xs text-stone-500">{order.date}</p>
          </div>
          <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${s.cls}`}>
            <SIcon size={12} />{s.label}
          </span>
        </div>

        <div className="p-5 space-y-5">
          {/* Customer */}
          <div className="bg-stone-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-stone-400 mb-2">CUSTOMER</p>
            <p className="font-bold text-stone-900">{order.customer}</p>
            <p className="text-sm text-stone-500 mt-0.5">{order.phone} · {order.city}</p>
            <p className="text-sm text-stone-400">{order.email}</p>
          </div>

          {/* Order summary */}
          <div>
            <p className="text-xs font-semibold text-stone-400 mb-2">ORDER SUMMARY</p>
            <div className="bg-stone-50 rounded-xl divide-y divide-stone-100">
              <div className="flex justify-between px-4 py-2.5 text-sm">
                <span className="text-stone-500">{order.items} item(s) · {order.metres}m fabric</span>
                <span className="font-medium">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between px-4 py-2.5 text-sm">
                <span className="text-stone-500">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between px-4 py-2.5 text-sm font-bold">
                <span>Total</span>
                <span className="text-rose-600">₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Shipping */}
          {order.courier && (
            <div>
              <p className="text-xs font-semibold text-stone-400 mb-2">SHIPPING</p>
              <div className="bg-stone-50 rounded-xl p-4">
                <p className="text-sm font-semibold">{order.courier}</p>
                {order.tracking && (
                  <p className="text-xs text-stone-500 mt-0.5">AWB: {order.tracking}</p>
                )}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <p className="text-xs font-semibold text-stone-400 mb-3">ORDER TIMELINE</p>
            <div className="relative pl-5">
              {TIMELINE.map((t, i) => (
                <div key={i} className="flex items-start gap-3 pb-4 relative">
                  <div className={`w-3 h-3 rounded-full border-2 mt-0.5 shrink-0 z-10
                    ${t.done ? 'bg-green-500 border-green-500' : 'bg-white border-stone-300'}`} />
                  {i < TIMELINE.length - 1 && (
                    <div className={`absolute left-[5px] top-3 w-0.5 h-full
                      ${t.done ? 'bg-green-400' : 'bg-stone-200'}`} />
                  )}
                  <p className={`text-sm ${t.done ? 'text-stone-800 font-medium' : 'text-stone-400'}`}>
                    {t.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            {NEXT_STATES[order.status] && (
              <button onClick={() => onUpdate(order.id, NEXT_STATES[order.status]!)}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl transition-colors">
                Move to: {STATUS[NEXT_STATES[order.status]!].label}
              </button>
            )}
            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center gap-1.5 py-2 border border-stone-200 rounded-xl text-sm text-stone-600 hover:bg-stone-50">
                <Printer size={14} />Invoice
              </button>
              <button className="flex items-center justify-center gap-1.5 py-2 border border-stone-200 rounded-xl text-sm text-stone-600 hover:bg-stone-50">
                <MessageSquare size={14} />WhatsApp
              </button>
            </div>
            {['pending','confirmed','processing'].includes(order.status) && (
              <button onClick={() => onUpdate(order.id, 'cancelled')}
                className="w-full py-2 border border-red-200 text-red-500 text-sm font-medium rounded-xl hover:bg-red-50">
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Orders Page ───────────────────────────────────────────────────────
export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS)
  const [search, setSearch]         = useState('')
  const [statusFilter, setStatus]   = useState('all')
  const [selected, setSelected]     = useState<string[]>([])
  const [activeOrder, setActive]    = useState<Order | null>(null)
  const [page, setPage]             = useState(1)
  const PER_PAGE = 8

  const filtered = useMemo(() => orders.filter(o => {
    const matchSearch = !search || [o.number, o.customer, o.phone, o.city]
      .some(f => f.toLowerCase().includes(search.toLowerCase()))
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    return matchSearch && matchStatus
  }), [orders, search, statusFilter])

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const totalPages = Math.ceil(filtered.length / PER_PAGE)

  function updateStatus(id: string, status: OrderStatus) {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    setActive(prev => prev?.id === id ? { ...prev, status } : prev)
  }

  const stats = {
    total:    orders.length,
    pending:  orders.filter(o => o.status === 'pending').length,
    active:   orders.filter(o => ['confirmed','processing','dispatched','shipped'].includes(o.status)).length,
    delivered:orders.filter(o => o.status === 'delivered').length,
    revenue:  orders.filter(o => o.payment === 'paid').reduce((s, o) => s + o.total, 0),
  }

  const toggleSelect = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const allSelected = paginated.length > 0 && paginated.every(o => selected.includes(o.id))

  return (
    <>
      <OrderPanel order={activeOrder} onClose={() => setActive(null)} onUpdate={updateStatus} />

      <div className="p-6 max-w-[1400px] mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900">Orders</h2>
            <p className="text-sm text-stone-500">{filtered.length} orders found</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 border border-stone-200 bg-white text-stone-600 text-sm px-3 py-2 rounded-xl hover:bg-stone-50">
              <Download size={14} />Export
            </button>
            <button className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold px-4 py-2 rounded-xl">
              <Plus size={14} />Manual Order
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Total Orders',  value: stats.total,    color: 'text-stone-900' },
            { label: 'Pending',       value: stats.pending,  color: 'text-orange-600' },
            { label: 'Active',        value: stats.active,   color: 'text-blue-600' },
            { label: 'Delivered',     value: stats.delivered,color: 'text-green-600' },
            { label: 'Revenue',       value: `₹${(stats.revenue/1000).toFixed(1)}K`, color: 'text-rose-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-stone-200 px-4 py-3 text-center">
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-stone-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                placeholder="Search order, customer, phone…"
                className="w-full pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {STATUS_FILTERS.slice(0, 5).map(f => (
                <button key={f.value} onClick={() => { setStatus(f.value); setPage(1) }}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap
                    ${statusFilter === f.value ? 'bg-rose-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
                  {f.label}
                </button>
              ))}
              <select value={statusFilter} onChange={e => { setStatus(e.target.value); setPage(1) }}
                className="px-3 py-2 rounded-xl text-xs border border-stone-200 bg-white text-stone-600 focus:outline-none">
                {STATUS_FILTERS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
          </div>

          {/* Bulk actions */}
          {selected.length > 0 && (
            <div className="mt-3 flex items-center gap-3 bg-rose-50 border border-rose-200 rounded-xl px-4 py-2.5">
              <span className="text-xs font-semibold text-rose-700">{selected.length} selected</span>
              <button className="text-xs text-rose-600 font-medium hover:underline">Mark Dispatched</button>
              <button className="text-xs text-rose-600 font-medium hover:underline">Print Labels</button>
              <button className="text-xs text-rose-600 font-medium hover:underline">Export CSV</button>
              <button className="ml-auto text-xs text-stone-500" onClick={() => setSelected([])}>Clear</button>
            </div>
          )}
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50 text-left text-xs font-semibold text-stone-400">
                  <th className="px-4 py-3">
                    <input type="checkbox" checked={allSelected}
                      onChange={() => setSelected(allSelected ? [] : paginated.map(o => o.id))}
                      className="rounded" />
                  </th>
                  <th className="px-4 py-3">ORDER</th>
                  <th className="px-4 py-3">CUSTOMER</th>
                  <th className="px-4 py-3">ITEMS</th>
                  <th className="px-4 py-3 text-right">AMOUNT</th>
                  <th className="px-4 py-3">PAYMENT</th>
                  <th className="px-4 py-3">STATUS</th>
                  <th className="px-4 py-3">SOURCE</th>
                  <th className="px-4 py-3">DATE</th>
                  <th className="px-4 py-3 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {paginated.length === 0 && (
                  <tr><td colSpan={10} className="text-center py-12 text-stone-400 text-sm">No orders found</td></tr>
                )}
                {paginated.map(order => {
                  const s = STATUS[order.status]
                  const SIcon = s.icon
                  return (
                    <tr key={order.id}
                      className={`hover:bg-stone-50 transition-colors ${selected.includes(order.id) ? 'bg-rose-50' : ''}`}>
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selected.includes(order.id)}
                          onChange={() => toggleSelect(order.id)} className="rounded" />
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setActive(order)}
                          className="font-bold text-sm text-rose-600 hover:underline">{order.number}</button>
                        <p className="text-xs text-stone-400">{order.city}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-stone-800">{order.customer}</p>
                        <p className="text-xs text-stone-400">{order.phone}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-stone-600">
                        {order.items} items · {order.metres}m
                      </td>
                      <td className="px-4 py-3 text-right">
                        <p className="text-sm font-bold text-stone-900">₹{order.total.toLocaleString('en-IN')}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                          ${order.payment === 'paid' ? 'bg-green-100 text-green-700' :
                            order.payment === 'pending' ? 'bg-orange-100 text-orange-700' :
                            'bg-stone-100 text-stone-600'}`}>
                          {order.payment}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${s.cls}`}>
                          <SIcon size={11} />{s.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full capitalize">
                          {order.source}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-stone-500">{order.date}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => setActive(order)}
                          className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors">
                          <Eye size={15} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-stone-100 px-4 py-3 flex items-center justify-between">
            <p className="text-xs text-stone-500">
              Showing {Math.min((page-1)*PER_PAGE+1, filtered.length)}–{Math.min(page*PER_PAGE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p-1)}
                className="p-1.5 rounded-lg border border-stone-200 disabled:opacity-40 hover:bg-stone-50">
                <ChevronLeft size={14} />
              </button>
              <span className="text-xs text-stone-600 px-2">Page {page} of {totalPages || 1}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p+1)}
                className="p-1.5 rounded-lg border border-stone-200 disabled:opacity-40 hover:bg-stone-50">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
