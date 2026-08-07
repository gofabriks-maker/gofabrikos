'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Package, Truck, CheckCircle, Clock, XCircle,
  MapPin, Phone, MessageCircle, ArrowLeft, Loader2,
  RotateCcw, ShoppingBag
} from 'lucide-react'

interface TimelineEntry {
  id:         string
  status:     string
  note:       string | null
  created_at: string
}

interface OrderItem {
  id:              string
  product_name:    string
  product_image:   string | null
  quantity_metres: number
  unit_price:      number
  total_price:     number
}

interface Order {
  id:               string
  order_number:     string
  status:           string
  customer_name:    string
  customer_phone:   string
  customer_email:   string | null
  shipping_address: string | null
  shipping_city:    string | null
  shipping_state:   string | null
  shipping_pincode: string | null
  subtotal:         number
  discount_amount:  number
  delivery_charge:  number
  total_amount:     number
  payment_mode:     string
  payment_status:   string
  courier_name:     string | null
  tracking_number:  string | null
  created_at:       string
  gf_order_items:   OrderItem[]
  gf_order_timeline: TimelineEntry[]
}

// All possible statuses in order
const STATUS_STEPS = [
  { key: 'pending',    label: 'Order Placed',  icon: Clock,       color: 'orange' },
  { key: 'confirmed',  label: 'Confirmed',     icon: CheckCircle, color: 'cyan'   },
  { key: 'processing', label: 'Processing',    icon: Package,     color: 'amber'  },
  { key: 'dispatched', label: 'Dispatched',    icon: Truck,       color: 'indigo' },
  { key: 'shipped',    label: 'Shipped',       icon: Truck,       color: 'blue'   },
  { key: 'delivered',  label: 'Delivered',     icon: CheckCircle, color: 'green'  },
]

const STATUS_ORDER: Record<string, number> = {
  pending: 0, confirmed: 1, processing: 2,
  dispatched: 3, shipped: 4, delivered: 5,
  cancelled: -1, returned: -1,
}

const COLOR_MAP: Record<string, string> = {
  orange: 'bg-orange-500',
  cyan:   'bg-cyan-500',
  amber:  'bg-amber-500',
  indigo: 'bg-indigo-500',
  blue:   'bg-blue-500',
  green:  'bg-green-500',
}

const TEXT_COLOR: Record<string, string> = {
  orange: 'text-orange-600',
  cyan:   'text-cyan-600',
  amber:  'text-amber-600',
  indigo: 'text-indigo-600',
  blue:   'text-blue-600',
  green:  'text-green-600',
}

function TrackOrderContent() {
  const params  = useSearchParams()
  const orderId = params.get('id')

  const [order,   setOrder]   = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    if (!orderId) { setLoading(false); setError('No order ID provided'); return }
    fetch(`/api/orders?id=${orderId}`)
      .then(r => r.json())
      .then(j => {
        if (j.order) setOrder(j.order)
        else setError('Order not found')
      })
      .catch(() => setError('Failed to load order'))
      .finally(() => setLoading(false))
  }, [orderId])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 size={28} className="animate-spin text-rose-500" />
    </div>
  )

  if (error || !order) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
      <Package size={40} className="text-gray-200" />
      <p className="text-gray-600 font-medium">{error || 'Order not found'}</p>
      <Link href="/orders" className="text-rose-600 underline text-sm">Find My Orders</Link>
    </div>
  )

  const currentIdx   = STATUS_ORDER[order.status] ?? 0
  const isCancelled  = order.status === 'cancelled' || order.status === 'returned'
  const timeline     = [...(order.gf_order_timeline || [])].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )
  const waMsg = `Hi GoFabrikos! I need help with my order *${order.order_number}*. Can you please assist?`
  const hasAddress = order.shipping_address || order.shipping_city

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/orders" className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Track Order</h1>
            <p className="text-sm text-gray-400">{order.order_number}</p>
          </div>
        </div>

        {/* Status Banner */}
        {!isCancelled ? (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Current Status</p>
                <p className="text-lg font-bold text-gray-900 capitalize">
                  {order.status === 'pending'    ? 'Order Placed'
                  : order.status === 'confirmed' ? 'Confirmed'
                  : order.status === 'processing'? 'Being Prepared'
                  : order.status === 'dispatched'? 'Dispatched'
                  : order.status === 'shipped'   ? 'Out for Delivery'
                  : order.status === 'delivered' ? '🎉 Delivered!'
                  : order.status}
                </p>
              </div>
              <p className="text-xs text-gray-400">
                {new Date(order.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>
            </div>

            {/* Progress Stepper */}
            <div className="relative">
              {/* Track line */}
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-100" />
              <div
                className="absolute top-4 left-4 h-0.5 bg-rose-500 transition-all duration-700"
                style={{ width: `${(currentIdx / (STATUS_STEPS.length - 1)) * (100 - 8)}%` }}
              />

              <div className="relative flex justify-between">
                {STATUS_STEPS.map((step, idx) => {
                  const done    = idx <= currentIdx
                  const current = idx === currentIdx
                  const Icon    = step.icon
                  return (
                    <div key={step.key} className="flex flex-col items-center gap-1.5" style={{ width: '14%' }}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all
                        ${done
                          ? current
                            ? `${COLOR_MAP[step.color]} ring-4 ring-offset-2 ring-${step.color}-200`
                            : 'bg-rose-500'
                          : 'bg-gray-100'}`}>
                        <Icon size={14} className={done ? 'text-white' : 'text-gray-400'} />
                      </div>
                      <p className={`text-center leading-tight hidden sm:block
                        ${done ? (current ? `font-bold ${TEXT_COLOR[step.color]}` : 'font-medium text-rose-600') : 'text-gray-400'}
                        text-[10px]`}>
                        {step.label}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Mobile: current step label */}
            <p className="sm:hidden text-center text-sm font-semibold text-rose-600 mt-3">
              {STATUS_STEPS[currentIdx]?.label}
            </p>

            {/* Courier info */}
            {(order.courier_name || order.tracking_number) && (
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-600">
                <Truck size={14} className="text-indigo-500" />
                <span>{order.courier_name}</span>
                {order.tracking_number && (
                  <span className="ml-auto font-mono text-xs bg-gray-100 px-2 py-0.5 rounded-lg">
                    {order.tracking_number}
                  </span>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-4 flex items-center gap-3">
            <XCircle size={24} className="text-red-500 flex-none" />
            <div>
              <p className="font-bold text-red-700 capitalize">{order.status}</p>
              <p className="text-sm text-red-500">This order has been {order.status}.</p>
            </div>
          </div>
        )}

        {/* Timeline */}
        {timeline.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
            <h2 className="text-sm font-bold text-gray-700 mb-4">Order Timeline</h2>
            <div className="space-y-4">
              {[...timeline].reverse().map((entry, i) => (
                <div key={entry.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full flex-none mt-0.5 ${i === 0 ? 'bg-rose-500' : 'bg-gray-300'}`} />
                    {i < timeline.length - 1 && <div className="w-px flex-1 bg-gray-100 mt-1" />}
                  </div>
                  <div className="pb-3">
                    <p className={`text-sm font-semibold capitalize ${i === 0 ? 'text-gray-900' : 'text-gray-500'}`}>
                      {entry.status === 'pending'    ? 'Order Placed'
                      : entry.status === 'confirmed' ? 'Order Confirmed'
                      : entry.status === 'processing'? 'Processing'
                      : entry.status === 'dispatched'? 'Dispatched'
                      : entry.status === 'shipped'   ? 'Shipped'
                      : entry.status === 'delivered' ? 'Delivered'
                      : entry.status}
                    </p>
                    {entry.note && <p className="text-xs text-gray-400 mt-0.5">{entry.note}</p>}
                    <p className="text-xs text-gray-300 mt-0.5">
                      {new Date(entry.created_at).toLocaleString('en-IN', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 overflow-hidden">
          <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 flex items-center gap-2">
            <ShoppingBag size={14} className="text-gray-500" />
            <h2 className="text-sm font-bold text-gray-700">Items Ordered</h2>
          </div>
          <div className="p-5 space-y-3">
            {order.gf_order_items.map(item => (
              <div key={item.id} className="flex gap-3">
                {item.product_image && (
                  <img src={item.product_image} alt={item.product_name}
                    className="w-14 h-14 rounded-xl object-cover flex-none bg-gray-100" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">{item.product_name}</p>
                  <p className="text-xs text-gray-400">{item.quantity_metres}m × ₹{Number(item.unit_price).toLocaleString('en-IN')}/m</p>
                </div>
                <p className="font-semibold text-gray-900 text-sm self-center">
                  ₹{Number(item.total_price).toLocaleString('en-IN')}
                </p>
              </div>
            ))}

            {/* Price breakdown */}
            <div className="border-t border-gray-100 pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₹{Number(order.subtotal).toLocaleString('en-IN')}</span>
              </div>
              {Number(order.discount_amount) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>−₹{Number(order.discount_amount).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500">
                <span>Delivery</span>
                <span>{Number(order.delivery_charge) === 0 ? 'FREE' : `₹${order.delivery_charge}`}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-gray-100">
                <span>Total</span>
                <span className="text-rose-600">₹{Number(order.total_amount).toLocaleString('en-IN')}</span>
              </div>
              <p className="text-xs text-gray-400">
                Payment: {order.payment_mode?.toUpperCase()} —{' '}
                <span className={order.payment_status === 'paid' ? 'text-green-600' : 'text-orange-500'}>
                  {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        {hasAddress && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={14} className="text-rose-500" />
              <h2 className="text-sm font-bold text-gray-700">Delivery Address</h2>
            </div>
            <p className="text-sm font-semibold text-gray-800">{order.customer_name}</p>
            <p className="text-sm text-gray-500 mt-0.5">
              {[order.shipping_address, order.shipping_city, order.shipping_state, order.shipping_pincode]
                .filter(Boolean).join(', ')}
            </p>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <Phone size={11} /> {order.customer_phone}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <a href={`https://wa.me/918790125438?text=${encodeURIComponent(waMsg)}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold transition-colors">
            <MessageCircle size={18} /> WhatsApp Support
          </a>

          <Link href="/orders"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors text-sm">
            <RotateCcw size={14} /> View All Orders
          </Link>

          <Link href="/fabrics"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-gray-400 hover:text-gray-600 text-sm transition-colors">
            <ShoppingBag size={14} /> Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  )
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-rose-500" />
      </div>
    }>
      <TrackOrderContent />
    </Suspense>
  )
}
