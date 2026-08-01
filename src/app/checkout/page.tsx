'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Check, ChevronRight, ShoppingBag, MapPin, CreditCard, Truck, Shield, Tag, Package } from 'lucide-react'

// ── Mock cart data (replace with real state/context later) ──────────────
const CART_ITEMS = [
  { id: 1, name: 'Mull Chanderi Digital Print', qty: 3, price: 125, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&q=80' },
  { id: 2, name: 'Pure Silk Banarasi Brocade',  qty: 6, price: 850, img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=120&q=80' },
]
const SUBTOTAL  = CART_ITEMS.reduce((s, i) => s + i.price * i.qty, 0)
const SHIPPING  = SUBTOTAL >= 999 ? 0 : 80
const DISCOUNT  = 0  // applied via coupon
const TOTAL     = SUBTOTAL + SHIPPING - DISCOUNT

type Step = 'address' | 'review' | 'payment' | 'success'

const STEPS: { id: Step; label: string; icon: React.ReactNode }[] = [
  { id: 'address', label: 'Delivery',  icon: <MapPin size={16} /> },
  { id: 'review',  label: 'Review',    icon: <Package size={16} /> },
  { id: 'payment', label: 'Payment',   icon: <CreditCard size={16} /> },
]

type PaymentMethod = 'upi' | 'card' | 'emi' | 'cod' | 'netbanking'

// ── Step indicator ───────────────────────────────────────────────────────
function StepBar({ current }: { current: Step }) {
  const order: Step[] = ['address', 'review', 'payment']
  const idx = order.indexOf(current)
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((s, i) => {
        const done    = i < idx
        const active  = i === idx
        return (
          <div key={s.id} className="flex items-center">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              done   ? 'bg-emerald-100 text-emerald-700' :
              active ? 'bg-rose-800 text-white shadow-md' :
                       'bg-stone-100 text-stone-400'
            }`}>
              {done ? <Check size={14} /> : s.icon}
              {s.label}
            </div>
            {i < STEPS.length - 1 && (
              <ChevronRight size={16} className={`mx-1 ${i < idx ? 'text-emerald-400' : 'text-stone-300'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Order summary sidebar ────────────────────────────────────────────────
function OrderSummary({ coupon, onCoupon }: { coupon: string; onCoupon: (c: string) => void }) {
  const [code, setCode] = useState('')
  const [msg, setMsg]   = useState('')

  function applyCode() {
    if (code.toUpperCase() === 'NAARI5') {
      onCoupon('NAARI5')
      setMsg('✅ 5% discount applied!')
    } else {
      setMsg('❌ Invalid code')
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 sticky top-20">
      <h2 className="font-bold text-stone-800 mb-4">Order Summary</h2>

      <div className="space-y-3 mb-4">
        {CART_ITEMS.map(item => (
          <div key={item.id} className="flex gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.img} alt={item.name} className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-stone-700 truncate">{item.name}</p>
              <p className="text-xs text-stone-400">{item.qty} m × ₹{item.price}/m</p>
            </div>
            <p className="text-sm font-semibold text-stone-800">₹{(item.qty * item.price).toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-stone-100 pt-3 space-y-2 text-sm">
        <div className="flex justify-between text-stone-600">
          <span>Subtotal</span><span>₹{SUBTOTAL.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-stone-600">
          <span>Shipping</span>
          <span className={SHIPPING === 0 ? 'text-emerald-600 font-medium' : ''}>
            {SHIPPING === 0 ? 'FREE' : `₹${SHIPPING}`}
          </span>
        </div>
        {coupon && (
          <div className="flex justify-between text-emerald-600">
            <span>Discount (NAARI5)</span><span>-₹{Math.round(SUBTOTAL * 0.05).toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-base text-stone-900 pt-2 border-t border-stone-100">
          <span>Total</span>
          <span>₹{(TOTAL - (coupon ? Math.round(SUBTOTAL * 0.05) : 0)).toLocaleString()}</span>
        </div>
      </div>

      {/* Coupon */}
      <div className="mt-4">
        <div className="flex gap-2">
          <input
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="Coupon code"
            className="flex-1 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-400"
          />
          <button
            onClick={applyCode}
            className="px-3 py-2 bg-stone-800 text-white text-sm rounded-lg hover:bg-stone-900"
          >
            Apply
          </button>
        </div>
        {msg && <p className="text-xs mt-1.5 text-stone-600">{msg}</p>}
        <p className="text-xs text-stone-400 mt-1">Try: NAARI5</p>
      </div>

      {/* Trust badges */}
      <div className="mt-4 pt-4 border-t border-stone-100 flex flex-col gap-1.5 text-xs text-stone-500">
        <div className="flex items-center gap-2"><Shield size={12} className="text-emerald-600" /> 100% Secure Payment</div>
        <div className="flex items-center gap-2"><Truck size={12} className="text-blue-500" /> GST Invoice on every order</div>
        <div className="flex items-center gap-2"><Tag size={12} className="text-rose-500" /> Free Swatch on 1st order</div>
      </div>
    </div>
  )
}

// ── ADDRESS STEP ─────────────────────────────────────────────────────────
function AddressStep({ onNext }: { onNext: () => void }) {
  const [saved, setSaved] = useState<'home' | 'work' | 'new'>('home')
  const [form, setForm] = useState({
    name: 'Lakshmi Sowjanya Aaki', mobile: '9581734837',
    pin: '522001', city: 'Guntur', state: 'Andhra Pradesh',
    address: 'Shop No. 346, Sri Vasavi WCS, Mangalagiri Road',
    landmark: 'Near Mangalagiri Road',
  })

  return (
    <div>
      <h2 className="text-lg font-bold text-stone-800 mb-5">Delivery Address</h2>

      {/* Saved addresses */}
      <div className="flex gap-3 mb-6">
        {[
          { id: 'home' as const, label: '🏠 Home', sub: 'Shop No. 346, Mangalagiri Road, Guntur' },
          { id: 'work' as const, label: '🏢 Work', sub: 'GoFabrikos Showroom, Guntur' },
          { id: 'new'  as const, label: '+ New Address', sub: '' },
        ].map(a => (
          <button
            key={a.id}
            onClick={() => setSaved(a.id)}
            className={`flex-1 p-3 rounded-xl border-2 text-left transition-all ${
              saved === a.id ? 'border-rose-500 bg-rose-50' : 'border-stone-200 hover:border-stone-300'
            }`}
          >
            <p className="text-sm font-medium text-stone-800">{a.label}</p>
            {a.sub && <p className="text-xs text-stone-500 mt-0.5 truncate">{a.sub}</p>}
          </button>
        ))}
      </div>

      {/* Address form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { key: 'name',     label: 'Full Name',   col: 1 },
          { key: 'mobile',   label: 'Mobile',      col: 1 },
          { key: 'address',  label: 'Address',     col: 2 },
          { key: 'landmark', label: 'Landmark',    col: 2 },
          { key: 'pin',      label: 'PIN Code',    col: 1 },
          { key: 'city',     label: 'City',        col: 1 },
          { key: 'state',    label: 'State',       col: 2 },
        ].map(f => (
          <div key={f.key} className={f.col === 2 ? 'col-span-1 sm:col-span-2' : ''}>
            <label className="block text-xs font-medium text-stone-600 mb-1">{f.label}</label>
            <input
              value={form[f.key as keyof typeof form]}
              onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-200"
            />
          </div>
        ))}
      </div>

      {/* Delivery estimate */}
      <div className="mt-5 p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-3 text-sm text-emerald-700">
        <Truck size={16} />
        <span>Estimated delivery: <strong>3–5 business days</strong> to Guntur</span>
      </div>

      <button
        onClick={onNext}
        className="mt-6 w-full py-3.5 bg-rose-800 text-white rounded-xl font-semibold hover:bg-rose-900 transition-colors flex items-center justify-center gap-2"
      >
        Continue to Review <ChevronRight size={18} />
      </button>
    </div>
  )
}

// ── REVIEW STEP ──────────────────────────────────────────────────────────
function ReviewStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-stone-800 mb-5">Review Your Order</h2>

      {/* Items */}
      <div className="space-y-4 mb-6">
        {CART_ITEMS.map(item => (
          <div key={item.id} className="flex gap-4 p-4 bg-stone-50 rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.img} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
            <div className="flex-1">
              <p className="font-medium text-stone-800">{item.name}</p>
              <p className="text-sm text-stone-500 mt-0.5">Quantity: {item.qty} metres</p>
              <p className="text-sm text-stone-500">₹{item.price}/m</p>
            </div>
            <p className="text-base font-bold text-rose-800">₹{(item.qty * item.price).toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Delivery address summary */}
      <div className="p-4 bg-white border border-stone-200 rounded-xl mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Delivering to</p>
          <button className="text-xs text-rose-600 hover:underline">Change</button>
        </div>
        <p className="text-sm font-medium text-stone-800">Lakshmi Sowjanya Aaki · 9581734837</p>
        <p className="text-sm text-stone-500">Shop No. 346, Sri Vasavi WCS, Mangalagiri Road, Guntur, Andhra Pradesh – 522001</p>
      </div>

      {/* GST note */}
      <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-700">
        <strong>GST Invoice</strong> will be generated automatically and emailed to you after dispatch.
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-stone-300 text-stone-700 rounded-xl font-medium hover:bg-stone-50"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-3 bg-rose-800 text-white rounded-xl font-semibold hover:bg-rose-900 transition-colors flex items-center justify-center gap-2"
        >
          Proceed to Payment <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}

// ── PAYMENT STEP ─────────────────────────────────────────────────────────
function PaymentStep({ onSuccess, onBack, coupon }: { onSuccess: () => void; onBack: () => void; coupon: string }) {
  const [method, setMethod]     = useState<PaymentMethod>('upi')
  const [upiId, setUpiId]       = useState('')
  const [processing, setProc]   = useState(false)
  const finalTotal = TOTAL - (coupon ? Math.round(SUBTOTAL * 0.05) : 0)

  function pay() {
    setProc(true)
    setTimeout(() => { setProc(false); onSuccess() }, 2000)
  }

  const methods: { id: PaymentMethod; label: string; sub: string }[] = [
    { id: 'upi',        label: '📱 UPI',          sub: 'GPay, PhonePe, Paytm, BHIM' },
    { id: 'card',       label: '💳 Credit / Debit Card', sub: 'Visa, Mastercard, RuPay' },
    { id: 'emi',        label: '📅 EMI',           sub: 'No-cost EMI on ₹3000+' },
    { id: 'netbanking', label: '🏦 Net Banking',    sub: 'All major banks' },
    { id: 'cod',        label: '💵 Cash on Delivery', sub: 'Pay when delivered' },
  ]

  return (
    <div>
      <h2 className="text-lg font-bold text-stone-800 mb-5">Payment Method</h2>

      <div className="space-y-3 mb-6">
        {methods.map(m => (
          <button
            key={m.id}
            onClick={() => setMethod(m.id)}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
              method === m.id ? 'border-rose-500 bg-rose-50' : 'border-stone-200 hover:border-stone-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-stone-800 text-sm">{m.label}</p>
                <p className="text-xs text-stone-500 mt-0.5">{m.sub}</p>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                method === m.id ? 'border-rose-600 bg-rose-600' : 'border-stone-300'
              }`} />
            </div>

            {/* UPI input */}
            {m.id === 'upi' && method === 'upi' && (
              <input
                value={upiId}
                onChange={e => setUpiId(e.target.value)}
                placeholder="yourname@upi"
                className="mt-3 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-400"
                onClick={e => e.stopPropagation()}
              />
            )}

            {/* Card inputs */}
            {m.id === 'card' && method === 'card' && (
              <div className="mt-3 space-y-2" onClick={e => e.stopPropagation()}>
                <input placeholder="Card number" className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-400" />
                <div className="flex gap-2">
                  <input placeholder="MM / YY" className="flex-1 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-400" />
                  <input placeholder="CVV" className="w-20 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-400" />
                </div>
                <input placeholder="Cardholder name" className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-400" />
              </div>
            )}

            {/* EMI info */}
            {m.id === 'emi' && method === 'emi' && (
              <div className="mt-3 grid grid-cols-3 gap-2" onClick={e => e.stopPropagation()}>
                {[3, 6, 12].map(mo => (
                  <div key={mo} className="p-2 bg-white border border-stone-200 rounded-lg text-center text-xs">
                    <p className="font-semibold text-stone-800">{mo} months</p>
                    <p className="text-stone-500">₹{Math.round(finalTotal / mo).toLocaleString()}/mo</p>
                    <p className="text-emerald-600 text-[10px] mt-0.5">No cost</p>
                  </div>
                ))}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Razorpay badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-stone-400 mb-6">
        <Shield size={12} className="text-emerald-500" />
        Payments secured by <span className="font-semibold text-stone-600">Razorpay</span>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-stone-300 text-stone-700 rounded-xl font-medium hover:bg-stone-50"
        >
          ← Back
        </button>
        <button
          onClick={pay}
          disabled={processing}
          className="flex-1 py-3.5 bg-rose-800 text-white rounded-xl font-bold hover:bg-rose-900 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {processing ? (
            <><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Processing…</>
          ) : (
            <>Pay ₹{finalTotal.toLocaleString()} <Shield size={16} /></>
          )}
        </button>
      </div>
    </div>
  )
}

// ── SUCCESS STEP ─────────────────────────────────────────────────────────
function SuccessStep() {
  const orderId = 'NF-2026-' + Math.floor(100000 + Math.random() * 900000)
  return (
    <div className="text-center py-8">
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
        <Check size={36} className="text-emerald-600" />
      </div>
      <h2 className="text-2xl font-bold text-stone-800 mb-2">Order Placed!</h2>
      <p className="text-stone-500 mb-1">Thank you for shopping at GoFabrikos</p>
      <p className="text-sm text-stone-400 mb-6">
        Order ID: <span className="font-mono font-semibold text-stone-700">{orderId}</span>
      </p>

      <div className="bg-stone-50 rounded-2xl p-5 text-left mb-6 max-w-sm mx-auto">
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Check size={14} className="text-emerald-600" />
            </div>
            <div>
              <p className="font-medium text-stone-800">Order Confirmed</p>
              <p className="text-xs text-stone-500">Email sent to your registered address</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Package size={14} className="text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-stone-800">Processing</p>
              <p className="text-xs text-stone-500">Fabric being cut &amp; packed</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Truck size={14} className="text-stone-400" />
            </div>
            <div>
              <p className="font-medium text-stone-400">Shipped</p>
              <p className="text-xs text-stone-400">Expected in 3–5 business days</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/orders"
          className="px-6 py-3 bg-rose-800 text-white rounded-xl font-semibold hover:bg-rose-900 transition-colors"
        >
          Track Order
        </Link>
        <Link
          href="/fabrics"
          className="px-6 py-3 border border-stone-300 text-stone-700 rounded-xl font-medium hover:bg-stone-50"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

// ── PAGE ─────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const [step, setStep]     = useState<Step>('address')
  const [coupon, setCoupon] = useState('')

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-rose-800 tracking-wide">
            NAARI<span className="text-stone-400 font-light"> Fashions</span>
          </Link>
          <div className="flex items-center gap-1 text-xs text-stone-500">
            <Shield size={12} className="text-emerald-500" /> Secure Checkout
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {step !== 'success' && (
          <>
            <h1 className="text-2xl font-bold text-stone-800 mb-2 flex items-center gap-2">
              <ShoppingBag size={22} className="text-rose-700" /> Checkout
            </h1>
            <StepBar current={step} />
          </>
        )}

        <div className={`grid gap-8 ${step === 'success' ? 'grid-cols-1 max-w-2xl mx-auto' : 'grid-cols-1 lg:grid-cols-[1fr_360px]'}`}>
          {/* Main step content */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 lg:p-8">
            {step === 'address' && <AddressStep onNext={() => setStep('review')} />}
            {step === 'review'  && <ReviewStep  onNext={() => setStep('payment')} onBack={() => setStep('address')} />}
            {step === 'payment' && <PaymentStep onSuccess={() => setStep('success')} onBack={() => setStep('review')} coupon={coupon} />}
            {step === 'success' && <SuccessStep />}
          </div>

          {/* Sidebar */}
          {step !== 'success' && (
            <OrderSummary coupon={coupon} onCoupon={setCoupon} />
          )}
        </div>
      </div>
    </div>
  )
}
