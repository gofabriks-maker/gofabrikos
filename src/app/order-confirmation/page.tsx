'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, MessageCircle, ArrowRight, Loader2, Home } from 'lucide-react'

interface Order {
  id:            string
  order_number:  string
  customer_name: string
  customer_phone:string
  total_amount:  number
  payment_mode:  string
  status:        string
  gf_order_items?: { product_name: string; quantity_metres: number; unit_price: number; total_price: number }[]
}

function OrderConfirmationContent() {
  const params  = useSearchParams()
  const orderId = params.get('id')
  const [order, setOrder]     = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) { setLoading(false); return }
    fetch(`/api/orders?id=${orderId}`)
      .then(r => r.json())
      .then(j => setOrder(j.order))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [orderId])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 size={28} className="animate-spin text-rose-500" />
    </div>
  )

  if (!order) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-gray-500 text-lg">Order not found.</p>
      <Link href="/" className="text-rose-600 underline">Go to Home</Link>
    </div>
  )

  const waMsg = `Hi GoFabrikos! I just placed an order *${order.order_number}* for ₹${Number(order.total_amount).toLocaleString('en-IN')}. Kindly confirm my order. Thank you!`

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-lg space-y-5">

        {/* Success Banner */}
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-green-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Order Placed!</h1>
          <p className="text-gray-500 text-sm">Thank you, {order.customer_name}. Your order has been received.</p>
          <div className="mt-4 bg-gray-50 rounded-xl px-4 py-3 inline-block">
            <p className="text-xs text-gray-400">Order Number</p>
            <p className="text-xl font-bold text-rose-600 tracking-wide">{order.order_number}</p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 px-5 py-3 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-700">Order Summary</h2>
          </div>
          <div className="p-5 space-y-3">
            {(order.gf_order_items || []).map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <div>
                  <p className="font-medium text-gray-800">{item.product_name}</p>
                  <p className="text-xs text-gray-400">{item.quantity_metres}m × ₹{Number(item.unit_price).toLocaleString('en-IN')}/m</p>
                </div>
                <span className="font-semibold">₹{Number(item.total_price).toLocaleString('en-IN')}</span>
              </div>
            ))}
            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900">
              <span>Total Paid</span>
              <span className="text-rose-600 text-lg">₹{Number(order.total_amount).toLocaleString('en-IN')}</span>
            </div>
            <p className="text-xs text-gray-400">Payment: {order.payment_mode?.toUpperCase() || 'COD'}</p>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
          <h2 className="text-sm font-bold text-gray-700">What happens next?</h2>
          {[
            { icon: '📞', text: 'We\'ll call/WhatsApp you within 2 hours to confirm your order' },
            { icon: '📦', text: 'Your fabric will be carefully packed and dispatched in 1-2 business days' },
            { icon: '🚚', text: 'You\'ll receive a tracking link once shipped' },
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-xl">{step.icon}</span>
              <p className="text-sm text-gray-600">{step.text}</p>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <a href={`https://wa.me/918790125438?text=${encodeURIComponent(waMsg)}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold transition-colors">
            <MessageCircle size={18} /> Confirm on WhatsApp
          </a>

          <Link href={`/track-order?id=${order.id}`}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors text-sm">
            <Package size={16} /> Track My Order <ArrowRight size={14} />
          </Link>

          <Link href="/fabrics"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-gray-400 hover:text-gray-600 text-sm transition-colors">
            <Home size={14} /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-rose-500" />
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  )
}
