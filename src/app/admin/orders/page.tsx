'use client'
import { useState, useMemo, useEffect, useCallback } from 'react'
import {
  Search, Eye, Package,
  Truck, CheckCircle, XCircle, RotateCcw, Clock,
  Printer, MessageSquare, Plus, RefreshCw,
  ChevronLeft, ChevronRight, Loader2, Send, X
} from 'lucide-react'

type OrderStatus =
  | 'pending' | 'confirmed' | 'processing'
  | 'dispatched' | 'shipped' | 'delivered' | 'cancelled' | 'returned'

interface OrderItem {
  id: string
  product_name: string
  quantity_metres: number
  unit_price: number
  total_price: number
  product_slug?: string
}

interface Order {
  id:               string
  order_number:     string
  customer_name:    string
  customer_phone:   string
  customer_email?:  string
  shipping_city?:   string
  shipping_address?:string
  shipping_state?:  string
  subtotal:         number
  total_amount:     number
  delivery_charge:  number
  discount_amount:  number
  coupon_code?:     string
  status:           OrderStatus
  payment_status:   string
  payment_mode:     string
  source:           string
  courier_name?:    string
  tracking_number?: string
  notes?:           string
  created_at:       string
  gf_order_items?:  OrderItem[]
}

const STATUS: Record<string, { label: string; cls: string; icon: React.ElementType }> = {
  pending:     { label: 'Pending',     cls: 'bg-orange-100 text-orange-700', icon: Clock },
  confirmed:   { label: 'Confirmed',   cls: 'bg-cyan-100 text-cyan-700',    icon: CheckCircle },
  processing:  { label: 'Processing',  cls: 'bg-amber-100 text-amber-700',  icon: Package },
  dispatched:  { label: 'Dispatched',  cls: 'bg-indigo-100 text-indigo-700',icon: Truck },
  shipped:     { label: 'Shipped',     cls: 'bg-blue-100 text-blue-700',    icon: Truck },
  delivered:   { label: 'Delivered',   cls: 'bg-green-100 text-green-700',  icon: CheckCircle },
  cancelled:   { label: 'Cancelled',   cls: 'bg-red-100 text-red-700',      icon: XCircle },
  returned:    { label: 'Returned',    cls: 'bg-purple-100 text-purple-700',icon: RotateCcw },
}

const STATUS_FILTERS = ['all','pending','confirmed','processing','dispatched','shipped','delivered','cancelled']

const NEXT: Partial<Record<OrderStatus, OrderStatus>> = {
  pending:    'confirmed',
  confirmed:  'processing',
  processing: 'dispatched',
  dispatched: 'shipped',
  shipped:    'delivered',
}

// WhatsApp message templates per status
function waTemplate(order: Order, newStatus: OrderStatus, courier?: string, tracking?: string): string {
  const name   = order.customer_name
  const num    = order.order_number
  const amount = `₹${Number(order.total_amount).toLocaleString('en-IN')}`
  const link   = `https://www.gofabrikos.com/track-order?id=${order.id}`

  switch (newStatus) {
    case 'confirmed':
      return `Hi ${name}! 🎉 Your GoFabrikos order *${num}* has been *confirmed*.\n\n` +
             `Amount: *${amount}*\nPayment: ${order.payment_mode?.toUpperCase()}\n\n` +
             `We will start processing your fabric shortly. Thank you for choosing GoFabrikos! 🙏`

    case 'processing':
      return `Hi ${name}! 🪡 Your GoFabrikos order *${num}* is now being *processed*.\n\n` +
             `Our team is carefully preparing your fabric. We'll notify you once it's dispatched. ✂️`

    case 'dispatched':
      return `Hi ${name}! 📦 Great news! Your GoFabrikos order *${num}* has been *dispatched*.\n\n` +
             (courier ? `Courier: *${courier}*\n` : '') +
             (tracking ? `Tracking: *${tracking}*\n\n` : '\n') +
             `Track your order: ${link}\n\nExpected delivery: 3-5 business days 🚚`

    case 'shipped':
      return `Hi ${name}! 🚚 Your GoFabrikos order *${num}* is *out for delivery* today!\n\n` +
             (tracking ? `Tracking: *${tracking}*\n` : '') +
             `Track here: ${link}\n\nPlease be available to receive your package. 📦`

    case 'delivered':
      return `Hi ${name}! ✅ Your GoFabrikos order *${num}* has been *delivered* successfully!\n\n` +
             `We hope you love your fabric. 💚\n\n` +
             `Please share your feedback — it helps us serve you better!\n` +
             `Rate us: https://www.gofabrikos.com\n\nThank you for shopping with GoFabrikos! 🙏`

    case 'cancelled':
      return `Hi ${name}, your GoFabrikos order *${num}* has been *cancelled* as requested.\n\n` +
             `If you have any questions, please reply to this message or call us.\n\nSorry for the inconvenience. 🙏`

    default:
      return `Hi ${name}! Your GoFabrikos order *${num}* status has been updated to *${STATUS[newStatus]?.label}*.\n\nTrack: ${link}`
  }
}

// ── WhatsApp Notification Modal ───────────────────────────────────────────
function WaModal({ order, newStatus, courier, tracking, onClose }: {
  order: Order
  newStatus: OrderStatus
  courier: string
  tracking: string
  onClose: () => void
}) {
  const msg     = waTemplate(order, newStatus, courier, tracking)
  const waLink  = `https://wa.me/91${order.customer_phone}?text=${encodeURIComponent(msg)}`
  const [sent, setSent] = useState(false)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <MessageSquare size={16} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Send WhatsApp Notification</p>
              <p className="text-xs text-gray-400">Status → {STATUS[newStatus]?.label}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        {/* Customer Info */}
        <div className="px-5 pt-4 pb-2">
          <div className="bg-gray-50 rounded-xl px-4 py-2.5 flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-400">Sending to</p>
              <p className="font-semibold text-gray-800 text-sm">{order.customer_name}</p>
            </div>
            <p className="text-sm font-mono text-gray-600">+91 {order.customer_phone}</p>
          </div>

          {/* Message Preview */}
          <div className="bg-green-50 border border-green-100 rounded-xl p-3 mb-4">
            <p className="text-xs font-semibold text-green-700 mb-1.5">Message Preview</p>
            <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">{msg}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 pb-5 space-y-2">
          {sent ? (
            <div className="flex items-center justify-center gap-2 py-3 bg-green-50 rounded-xl text-green-700 text-sm font-semibold">
              <CheckCircle size={16} /> WhatsApp opened! Send the message to customer.
            </div>
          ) : (
            <a href={waLink} target="_blank" rel="noopener noreferrer"
              onClick={() => setSent(true)}
              className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors">
              <Send size={16} /> Open WhatsApp &amp; Send
            </a>
          )}
          <button onClick={onClose}
            className="w-full py-2.5 border border-gray-200 text-gray-500 text-sm font-medium rounded-xl hover:bg-gray-50">
            {sent ? 'Done' : 'Skip Notification'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Courier Input Modal ────────────────────────────────────────────────────
function CourierModal({ onConfirm, onSkip }: {
  onConfirm: (courier: string, tracking: string) => void
  onSkip: () => void
}) {
  const [courier,  setCourier]  = useState('')
  const [tracking, setTracking] = useState('')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5">
        <h3 className="font-bold text-gray-900 mb-1">Add Courier Details</h3>
        <p className="text-xs text-gray-400 mb-4">Optional — shown to customer in tracking page</p>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Courier Name</label>
            <input value={courier} onChange={e => setCourier(e.target.value)}
              placeholder="e.g. Delhivery, DTDC, Bluedart"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Tracking / AWB Number</label>
            <input value={tracking} onChange={e => setTracking(e.target.value)}
              placeholder="e.g. 123456789012"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button onClick={onSkip}
            className="flex-1 py-2.5 border border-gray-200 text-gray-500 text-sm rounded-xl hover:bg-gray-50">
            Skip
          </button>
          <button onClick={() => onConfirm(courier, tracking)}
            className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl">
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Order Detail Panel ────────────────────────────────────────────────────
function OrderPanel({ order, onClose, onUpdate }: {
  order: Order | null
  onClose: () => void
  onUpdate: (id: string, status: OrderStatus, courier?: string, tracking?: string) => Promise<void>
}) {
  const [updating,     setUpdating]     = useState(false)
  const [showCourier,  setShowCourier]  = useState(false)
  const [pendingStatus,setPending]      = useState<OrderStatus | null>(null)
  const [waData,       setWaData]       = useState<{ status: OrderStatus; courier: string; tracking: string } | null>(null)

  if (!order) return null

  const s     = STATUS[order.status] || STATUS.pending
  const SIcon = s.icon
  const items = order.gf_order_items || []
  const totalMetres = items.reduce((sum, i) => sum + Number(i.quantity_metres), 0)

  const TIMELINE = [
    { status: 'confirmed',  label: 'Order Confirmed',  done: order.status !== 'pending' },
    { status: 'processing', label: 'Processing',       done: !['pending','confirmed'].includes(order.status) },
    { status: 'dispatched', label: 'Dispatched',       done: ['dispatched','shipped','delivered'].includes(order.status) },
    { status: 'shipped',    label: 'Shipped',          done: ['shipped','delivered'].includes(order.status) },
    { status: 'delivered',  label: 'Delivered',        done: order.status === 'delivered' },
  ]

  async function handleUpdate(status: OrderStatus, courier = '', tracking = '') {
    setUpdating(true)
    await onUpdate(order.id, status, courier, tracking)
    setUpdating(false)
    setShowCourier(false)
    setPending(null)
    // Show WhatsApp modal
    setWaData({ status, courier, tracking })
  }

  function requestUpdate(status: OrderStatus) {
    if (status === 'dispatched' || status === 'shipped') {
      setPending(status)
      setShowCourier(true)
    } else {
      handleUpdate(status)
    }
  }

  return (
    <>
      {/* Courier Modal */}
      {showCourier && pendingStatus && (
        <CourierModal
          onConfirm={(courier, tracking) => handleUpdate(pendingStatus, courier, tracking)}
          onSkip={() => handleUpdate(pendingStatus)}
        />
      )}

      {/* WhatsApp Notification Modal */}
      {waData && (
        <WaModal
          order={{ ...order, status: waData.status }}
          newStatus={waData.status}
          courier={waData.courier}
          tracking={waData.tracking}
          onClose={() => setWaData(null)}
        />
      )}

      <div className="fixed inset-0 z-40 flex">
        <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />
        <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-5 py-4 flex items-center gap-3 z-10">
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-stone-100">
              <ChevronRight size={18} />
            </button>
            <div className="flex-1">
              <p className="font-bold text-stone-900">{order.order_number}</p>
              <p className="text-xs text-stone-500">{new Date(order.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</p>
            </div>
            <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${s.cls}`}>
              <SIcon size={12} />{s.label}
            </span>
          </div>

          <div className="p-5 space-y-5">
            {/* Customer */}
            <div className="bg-stone-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-stone-400 mb-2">CUSTOMER</p>
              <p className="font-bold text-stone-900">{order.customer_name}</p>
              <p className="text-sm text-stone-500">{order.customer_phone}{order.shipping_city ? ` · ${order.shipping_city}` : ''}</p>
              {order.customer_email && <p className="text-xs text-stone-400">{order.customer_email}</p>}
              {order.shipping_address && <p className="text-xs text-stone-400 mt-1">{order.shipping_address}, {order.shipping_state}</p>}
            </div>

            {/* Order Items */}
            {items.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-stone-400 mb-2">ITEMS ({items.length})</p>
                <div className="bg-stone-50 rounded-xl divide-y divide-stone-100">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between px-4 py-2.5 text-sm">
                      <div>
                        <p className="font-medium text-stone-800">{item.product_name}</p>
                        <p className="text-xs text-stone-400">{item.quantity_metres}m × ₹{Number(item.unit_price).toLocaleString('en-IN')}/m</p>
                      </div>
                      <span className="font-semibold text-stone-700">₹{Number(item.total_price).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Totals */}
            <div>
              <p className="text-xs font-semibold text-stone-400 mb-2">ORDER SUMMARY</p>
              <div className="bg-stone-50 rounded-xl divide-y divide-stone-100">
                <div className="flex justify-between px-4 py-2.5 text-sm">
                  <span className="text-stone-500">{items.length} item(s) · {totalMetres}m total</span>
                  <span>₹{Number(order.subtotal).toLocaleString('en-IN')}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between px-4 py-2.5 text-sm text-green-600">
                    <span>Discount {order.coupon_code ? `(${order.coupon_code})` : ''}</span>
                    <span>−₹{Number(order.discount_amount).toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between px-4 py-2.5 text-sm">
                  <span className="text-stone-500">Delivery</span>
                  <span className={Number(order.delivery_charge) === 0 ? 'text-green-600' : ''}>
                    {Number(order.delivery_charge) === 0 ? 'Free' : `₹${order.delivery_charge}`}
                  </span>
                </div>
                <div className="flex justify-between px-4 py-2.5 text-sm font-bold">
                  <span>Total</span>
                  <span className="text-rose-600">₹{Number(order.total_amount).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between px-4 py-2.5 text-sm">
                  <span className="text-stone-400">Payment</span>
                  <span className={`font-medium ${order.payment_status === 'paid' ? 'text-green-600' : 'text-orange-500'}`}>
                    {order.payment_mode?.toUpperCase() || 'COD'} · {order.payment_status}
                  </span>
                </div>
              </div>
            </div>

            {/* Courier info if exists */}
            {order.courier_name && (
              <div className="bg-stone-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-stone-400 mb-1">TRACKING</p>
                <p className="text-sm font-semibold">{order.courier_name}</p>
                {order.tracking_number && <p className="text-xs text-stone-500 mt-0.5">AWB: {order.tracking_number}</p>}
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
                      <div className={`absolute left-[5px] top-3 w-0.5 h-full ${t.done ? 'bg-green-400' : 'bg-stone-200'}`} />
                    )}
                    <p className={`text-sm ${t.done ? 'text-stone-800 font-medium' : 'text-stone-400'}`}>{t.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              {NEXT[order.status as OrderStatus] && (
                <button onClick={() => requestUpdate(NEXT[order.status as OrderStatus]!)} disabled={updating}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {updating ? <Loader2 size={14} className="animate-spin" /> : null}
                  Move to: {STATUS[NEXT[order.status as OrderStatus]!]?.label}
                </button>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-1.5 py-2 border border-stone-200 rounded-xl text-sm text-stone-600 hover:bg-stone-50">
                  <Printer size={14} /> Invoice
                </button>
                {/* Manual WhatsApp button */}
                <button
                  onClick={() => setWaData({ status: order.status, courier: order.courier_name || '', tracking: order.tracking_number || '' })}
                  className="flex items-center justify-center gap-1.5 py-2 border border-green-200 rounded-xl text-sm text-green-700 hover:bg-green-50">
                  <MessageSquare size={14} /> WhatsApp
                </button>
              </div>

              {['pending','confirmed','processing'].includes(order.status) && (
                <button onClick={() => requestUpdate('cancelled')} disabled={updating}
                  className="w-full py-2 border border-red-200 text-red-500 text-sm font-medium rounded-xl hover:bg-red-50">
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ── Main Orders Page ──────────────────────────────────────────────────────
export default function OrdersPage() {
  const [orders,       setOrders]  = useState<Order[]>([])
  const [loading,      setLoading] = useState(true)
  const [search,       setSearch]  = useState('')
  const [statusFilter, setStatus]  = useState('all')
  const [activeOrder,  setActive]  = useState<Order | null>(null)
  const [page,         setPage]    = useState(1)
  const [total,        setTotal]   = useState(0)
  const PER_PAGE = 20

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page:  String(page),
        limit: String(PER_PAGE),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(search && { search }),
      })
      const res  = await fetch(`/api/admin/orders?${params}`)
      const json = await res.json()
      if (json.orders) {
        setOrders(json.orders)
        setTotal(json.total || json.orders.length)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter, search])

  useEffect(() => { load() }, [load])

  async function updateStatus(id: string, status: OrderStatus, courier?: string, tracking?: string) {
    await fetch('/api/admin/orders', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        id, status,
        note:            `Status moved to ${status}`,
        courier_name:    courier   || undefined,
        tracking_number: tracking  || undefined,
      }),
    })
    setOrders(prev => prev.map(o => o.id === id ? {
      ...o, status,
      ...(courier  ? { courier_name:    courier  } : {}),
      ...(tracking ? { tracking_number: tracking } : {}),
    } : o))
    setActive(prev => prev?.id === id ? {
      ...prev, status,
      ...(courier  ? { courier_name:    courier  } : {}),
      ...(tracking ? { tracking_number: tracking } : {}),
    } : prev)
  }

  const stats = useMemo(() => ({
    total:    total,
    pending:  orders.filter(o => o.status === 'pending').length,
    active:   orders.filter(o => ['confirmed','processing','dispatched','shipped'].includes(o.status)).length,
    delivered:orders.filter(o => o.status === 'delivered').length,
    revenue:  orders.filter(o => o.payment_status === 'paid').reduce((s, o) => s + Number(o.total_amount), 0),
  }), [orders, total])

  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <>
      <OrderPanel order={activeOrder} onClose={() => setActive(null)} onUpdate={updateStatus} />

      <div className="p-6 max-w-[1400px] mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900">Orders</h2>
            <p className="text-sm text-stone-500">{total} total orders</p>
          </div>
          <div className="flex gap-2">
            <button onClick={load} className="flex items-center gap-2 border border-stone-200 bg-white text-stone-600 text-sm px-3 py-2 rounded-xl hover:bg-stone-50">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
            <button className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold px-4 py-2 rounded-xl">
              <Plus size={14} /> Manual Order
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Total Orders', value: stats.total,     color: 'text-stone-900' },
            { label: 'Pending',      value: stats.pending,   color: 'text-orange-600' },
            { label: 'Active',       value: stats.active,    color: 'text-blue-600' },
            { label: 'Delivered',    value: stats.delivered, color: 'text-green-600' },
            { label: 'Revenue',      value: stats.revenue > 0 ? `₹${(stats.revenue/1000).toFixed(1)}K` : '₹0', color: 'text-rose-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-stone-200 px-4 py-3 text-center">
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-stone-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search order number, customer name, phone…"
              className="w-full pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUS_FILTERS.map(f => (
              <button key={f} onClick={() => { setStatus(f); setPage(1) }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors capitalize whitespace-nowrap
                  ${statusFilter === f ? 'bg-rose-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-2 text-stone-400">
              <Loader2 size={20} className="animate-spin" /> Loading orders…
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 text-stone-400">
              <Package size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No orders yet</p>
              <p className="text-sm mt-1">Orders placed by customers will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50 text-left text-xs font-semibold text-stone-400">
                    <th className="px-4 py-3">ORDER</th>
                    <th className="px-4 py-3">CUSTOMER</th>
                    <th className="px-4 py-3">ITEMS</th>
                    <th className="px-4 py-3 text-right">AMOUNT</th>
                    <th className="px-4 py-3">PAYMENT</th>
                    <th className="px-4 py-3">STATUS</th>
                    <th className="px-4 py-3">DATE</th>
                    <th className="px-4 py-3 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {orders.map(order => {
                    const s = STATUS[order.status] || STATUS.pending
                    const SIcon = s.icon
                    const itemCount = order.gf_order_items?.length || 0
                    const metres = order.gf_order_items?.reduce((sum, i) => sum + Number(i.quantity_metres), 0) || 0
                    return (
                      <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-4 py-3">
                          <button onClick={() => setActive(order)}
                            className="font-bold text-sm text-rose-600 hover:underline">{order.order_number}</button>
                          <p className="text-xs text-stone-400">{order.shipping_city || '—'}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-stone-800">{order.customer_name}</p>
                          <p className="text-xs text-stone-400">{order.customer_phone}</p>
                        </td>
                        <td className="px-4 py-3 text-sm text-stone-600">
                          {itemCount > 0 ? `${itemCount} item${itemCount > 1 ? 's' : ''} · ${metres}m` : '—'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <p className="text-sm font-bold text-stone-900">₹{Number(order.total_amount).toLocaleString('en-IN')}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                            ${order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                            {order.payment_mode?.toUpperCase() || 'COD'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${s.cls}`}>
                            <SIcon size={11} />{s.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-stone-500">
                          {new Date(order.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}
                        </td>
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
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-stone-100 px-4 py-3 flex items-center justify-between">
              <p className="text-xs text-stone-400">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="p-1.5 rounded-lg border border-stone-200 disabled:opacity-40 hover:bg-stone-50">
                  <ChevronLeft size={15} />
                </button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="p-1.5 rounded-lg border border-stone-200 disabled:opacity-40 hover:bg-stone-50">
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
