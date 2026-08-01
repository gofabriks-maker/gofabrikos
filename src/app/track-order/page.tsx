'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Search, Truck, Package, Check, MapPin, Clock, Phone } from 'lucide-react'

interface TrackStep {
  label: string
  sub: string
  time: string
  done: boolean
  active: boolean
}

function getTrackingSteps(status: string): TrackStep[] {
  const all = [
    { key: 'confirmed',  label: 'Order Confirmed',   sub: 'Payment received, order placed successfully', time: '24 Jul 2026, 10:32 AM' },
    { key: 'processing', label: 'Processing',         sub: 'Fabric quality checked and cut to order', time: '24 Jul 2026, 2:15 PM' },
    { key: 'packed',     label: 'Packed',             sub: 'Packed securely with GST invoice inside', time: '25 Jul 2026, 11:00 AM' },
    { key: 'shipped',    label: 'Shipped',            sub: 'Handed to DTDC Courier · #DTDC1234567890', time: '25 Jul 2026, 4:30 PM' },
    { key: 'transit',    label: 'In Transit',         sub: 'Package in transit via Guntur Hub', time: '26 Jul 2026, 8:00 AM' },
    { key: 'out',        label: 'Out for Delivery',   sub: 'Your delivery partner is on the way', time: '' },
    { key: 'delivered',  label: 'Delivered',          sub: 'Package delivered successfully', time: '' },
  ]

  const activeIdx = status === 'shipped' ? 4 : status === 'processing' ? 1 : 6

  return all.map((s, i) => ({
    label: s.label,
    sub: s.sub,
    time: s.time,
    done: i < activeIdx,
    active: i === activeIdx,
  }))
}

const SAMPLE_ORDERS: Record<string, { status: string; items: string; from: string; to: string; courier: string; etd: string }> = {
  'NF-2026-849231': {
    status: 'shipped',
    items: 'Mull Chanderi (3m) + Banarasi Brocade (6m)',
    from: 'Guntur Warehouse',
    to: 'Mangalagiri Road, Guntur – 522001',
    courier: 'DTDC · DTDC1234567890',
    etd: 'Expected by 29 Jul 2026',
  },
  'NF-2026-720115': {
    status: 'delivered',
    items: 'Handloom Khadi Cotton (8m)',
    from: 'Guntur Warehouse',
    to: 'Brodipet, Guntur – 522002',
    courier: 'Blue Dart · BD9876543',
    etd: 'Delivered on 22 Jul 2026',
  },
}

export default function TrackOrderPage() {
  const [input, setInput]   = useState('')
  const [orderId, setOrderId] = useState<string | null>(null)
  const [error, setError]   = useState('')

  function handleTrack() {
    const id = input.trim().toUpperCase()
    if (!id) { setError('Please enter an order ID'); return }
    if (SAMPLE_ORDERS[id]) {
      setOrderId(id)
      setError('')
    } else {
      setError('Order not found. Check your email for the correct Order ID.')
      setOrderId(null)
    }
  }

  const order = orderId ? SAMPLE_ORDERS[orderId] : null
  const steps  = order ? getTrackingSteps(order.status) : []

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-rose-800 tracking-wide">
            Go<span className="text-stone-400 font-light">Fabrikos</span>
          </Link>
          <Link href="/orders" className="text-sm text-stone-600 hover:text-rose-700">← My Orders</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-stone-800 mb-2 flex items-center gap-2">
          <Truck size={22} className="text-rose-700" /> Track Your Order
        </h1>
        <p className="text-stone-500 text-sm mb-8">Enter your Order ID to see real-time delivery status</p>

        {/* Search box */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
          <label className="block text-sm font-semibold text-stone-700 mb-2">Order ID</label>
          <div className="flex gap-3">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleTrack()}
              placeholder="e.g. NF-2026-849231"
              className="flex-1 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-200 font-mono"
            />
            <button
              onClick={handleTrack}
              className="px-6 py-3 bg-rose-800 text-white rounded-xl font-semibold hover:bg-rose-900 transition-colors flex items-center gap-2"
            >
              <Search size={16} /> Track
            </button>
          </div>
          {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
          <p className="text-stone-400 text-xs mt-3">
            Your Order ID was emailed after purchase. Try: <button onClick={() => setInput('NF-2026-849231')} className="text-rose-600 hover:underline font-mono">NF-2026-849231</button>
          </p>
        </div>

        {/* Tracking result */}
        {order && orderId && (
          <div className="space-y-4">
            {/* Order info card */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-mono font-bold text-stone-800">{orderId}</p>
                  <p className="text-sm text-stone-500 mt-0.5">{order.items}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
                }`}>
                  {order.status === 'delivered' ? '✓ Delivered' : '🚚 Shipped'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex gap-2">
                  <Package size={16} className="text-stone-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-stone-400 font-medium uppercase tracking-wider">From</p>
                    <p className="text-stone-700">{order.from}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <MapPin size={16} className="text-rose-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-stone-400 font-medium uppercase tracking-wider">Delivering to</p>
                    <p className="text-stone-700">{order.to}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Truck size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-stone-400 font-medium uppercase tracking-wider">Courier</p>
                    <p className="text-stone-700">{order.courier}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-2 text-sm text-amber-700">
                <Clock size={14} />
                <span className="font-medium">{order.etd}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6">
              <h2 className="font-bold text-stone-800 mb-5">Shipment Timeline</h2>
              <div className="relative">
                {steps.map((step, i) => (
                  <div key={i} className="flex gap-4 pb-6 last:pb-0">
                    {/* Connector line */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                        step.done   ? 'bg-emerald-500 text-white' :
                        step.active ? 'bg-rose-700 text-white ring-4 ring-rose-100' :
                                      'bg-stone-100 text-stone-300'
                      }`}>
                        {step.done ? <Check size={14} /> : step.active ? <Truck size={14} /> : <div className="w-2 h-2 rounded-full bg-stone-300" />}
                      </div>
                      {i < steps.length - 1 && (
                        <div className={`w-0.5 flex-1 mt-1 ${step.done ? 'bg-emerald-300' : 'bg-stone-100'}`} style={{ minHeight: 24 }} />
                      )}
                    </div>

                    <div className="flex-1 pt-1 pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={`font-semibold text-sm ${
                            step.active ? 'text-rose-800' : step.done ? 'text-stone-800' : 'text-stone-300'
                          }`}>
                            {step.label}
                            {step.active && <span className="ml-2 text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">Now</span>}
                          </p>
                          <p className={`text-xs mt-0.5 ${step.done || step.active ? 'text-stone-500' : 'text-stone-300'}`}>
                            {step.sub}
                          </p>
                        </div>
                        {step.time && (
                          <p className="text-xs text-stone-400 flex-shrink-0">{step.time}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Help */}
            <div className="bg-rose-50 rounded-2xl border border-rose-200 p-5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-stone-800 text-sm">Need help with your order?</p>
                <p className="text-xs text-stone-500 mt-0.5">Our team is available Mon–Sat, 8 AM – 9 PM</p>
              </div>
              <a
                href="tel:+918298308314"
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-rose-300 text-rose-700 rounded-xl text-sm font-medium hover:bg-rose-100"
              >
                <Phone size={14} /> Call Us
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
