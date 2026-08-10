'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Minus, Plus, Trash2, ShoppingBag, ArrowRight,
  Tag, Loader2, CheckCircle, MapPin, CreditCard
} from 'lucide-react'

interface CartItem {
  slug:  string
  name:  string
  price: number
  qty:   number
  image: string
}

declare global {
  interface Window {
    Cashfree?: {
      PGCheckout: (config: {
        paymentSessionId: string
        redirectTarget?: string
      }) => void
    }
  }
}

export default function CartPage() {
  const router = useRouter()
  const [cart,      setCart]      = useState<CartItem[]>([])
  const [coupon,      setCoupon]      = useState('')
  const [couponOk,    setCouponOk]    = useState(false)
  const [couponErr,   setCouponErr]   = useState('')
  const [couponLabel, setCouponLabel] = useState('')
  const [discount,    setDiscount]    = useState(0)
  const [validating,  setValidating]  = useState(false)
  const [placing,   setPlacing]   = useState(false)
  const [showForm,  setShowForm]  = useState(false)
  const [cfLoaded,  setCfLoaded]  = useState(false)
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    address: '', city: '', state: '', pincode: '',
    paymentMode: 'cod',
  })

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('gofabrikos_cart') || '[]'))
  }, [])

  // Load Cashfree JS SDK
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (document.getElementById('cashfree-sdk')) { setCfLoaded(true); return }
    const script = document.createElement('script')
    script.id  = 'cashfree-sdk'
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js'
    script.onload = () => setCfLoaded(true)
    document.head.appendChild(script)
  }, [])

  function saveCart(updated: CartItem[]) {
    setCart(updated)
    localStorage.setItem('gofabrikos_cart', JSON.stringify(updated))
  }

  function updateQty(slug: string, delta: number) {
    saveCart(cart.map(i => i.slug === slug ? { ...i, qty: Math.max(1, i.qty + delta) } : i))
  }

  function remove(slug: string) {
    saveCart(cart.filter(i => i.slug !== slug))
  }

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const delivery = subtotal >= 4999 ? 0 : 99
  const total    = subtotal - discount + delivery

  async function applyCoupon() {
    if (!coupon.trim()) return
    setValidating(true)
    setCouponErr('')
    setCouponOk(false)
    setDiscount(0)
    try {
      const res  = await fetch('/api/coupons/validate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: coupon.trim(), subtotal }),
      })
      const data = await res.json()
      if (data.valid) {
        setCouponOk(true)
        setDiscount(data.discount)
        setCouponLabel(data.message)
        setCouponErr('')
      } else {
        setCouponOk(false)
        setDiscount(0)
        setCouponErr(data.message || 'Invalid coupon code')
      }
    } catch {
      setCouponErr('Could not validate coupon. Try again.')
    }
    setValidating(false)
  }

  function upd(k: keyof typeof form, v: string) {
    setForm(p => ({ ...p, [k]: v }))
  }

  async function placeOrder() {
    if (!form.name.trim())  return alert('Please enter your name')
    if (!form.phone.trim() || form.phone.length < 10) return alert('Please enter a valid 10-digit phone number')

    setPlacing(true)
    try {
      // Step 1: Create order in Supabase
      const res = await fetch('/api/orders', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName:    form.name,
          customerPhone:   form.phone,
          customerEmail:   form.email,
          shippingAddress: form.address,
          shippingCity:    form.city,
          shippingState:   form.state,
          shippingPincode: form.pincode,
          paymentMode:     form.paymentMode,
          couponCode:      couponOk ? coupon.trim().toUpperCase() : undefined,
          source:          'website',
          items: cart.map(i => ({
            productName:    i.name,
            productSlug:    i.slug,
            productImage:   i.image,
            quantityMetres: i.qty,
            unitPrice:      i.price,
          })),
        }),
      })
      const data = await res.json()
      if (!res.ok) { alert(data.error || 'Failed to place order'); setPlacing(false); return }

      const { orderId } = data

      // Step 2: COD — go directly to confirmation
      if (form.paymentMode === 'cod') {
        localStorage.removeItem('gofabrikos_cart')
        router.push(`/order-confirmation?id=${orderId}`)
        return
      }

      // Step 3: Online payment — create Cashfree session
      const cfRes = await fetch('/api/cashfree/create-order', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          orderAmount:   total,
          customerName:  form.name,
          customerPhone: form.phone,
          customerEmail: form.email,
        }),
      })
      const cfData = await cfRes.json()
      if (!cfRes.ok) { alert(cfData.error || 'Payment failed'); setPlacing(false); return }

      // Step 4: Open Cashfree checkout popup
      localStorage.removeItem('gofabrikos_cart')

      if (window.Cashfree) {
        window.Cashfree.PGCheckout({
          paymentSessionId: cfData.paymentSessionId,
          redirectTarget:   '_modal',
        })
      } else {
        // Fallback: redirect to confirmation (payment verified via webhook)
        router.push(`/order-confirmation?id=${orderId}`)
      }

    } catch {
      alert('Something went wrong. Please try again.')
      setPlacing(false)
    }
  }

  if (cart.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-4 text-center">
      <ShoppingBag size={56} className="text-gray-200" />
      <h2 className="text-2xl font-bold text-gray-800">Your cart is empty</h2>
      <p className="text-gray-400">Discover beautiful fabrics and add them to your cart.</p>
      <Link href="/fabrics"
        className="px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors">
        Shop Fabrics
      </Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <ShoppingBag size={22} /> My Cart
          <span className="text-gray-400 font-normal text-lg">({cart.length} item{cart.length > 1 ? 's' : ''})</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item.slug} className="bg-white rounded-2xl p-4 shadow-sm flex gap-4 border border-gray-100">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-none bg-gray-100">
                  {item.image
                    ? <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                    : <div className="w-full h-full bg-gradient-to-br from-rose-100 to-rose-200" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{item.name}</h3>
                  <p className="text-rose-600 font-bold mt-0.5">₹{item.price.toLocaleString('en-IN')}/m</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQty(item.slug, -1)}
                      className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-gray-600">
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-bold w-10 text-center">{item.qty}m</span>
                    <button onClick={() => updateQty(item.slug, 1)}
                      className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-gray-600">
                      <Plus size={12} />
                    </button>
                    <span className="text-sm text-gray-500 ml-2">= <strong>₹{(item.price * item.qty).toLocaleString('en-IN')}</strong></span>
                  </div>
                </div>
                <button onClick={() => remove(item.slug)}
                  className="text-gray-300 hover:text-red-400 transition-colors self-start p-1">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Summary + Checkout */}
          <div className="space-y-4">

            {/* Coupon */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2"><Tag size={14} /> Coupon Code</h3>
              <div className="flex gap-2">
                <input value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())}
                  placeholder="NAARI10"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                <button onClick={applyCoupon} disabled={validating}
                  className="px-4 py-2 bg-gray-900 text-white text-sm rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-60 flex items-center gap-1.5">
                  {validating ? <><Loader2 size={13} className="animate-spin"/>Checking</> : 'Apply'}
                </button>
              </div>
              {couponOk  && <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><CheckCircle size={11} /> {couponLabel}</p>}
              {couponErr && <p className="text-xs text-red-500 mt-1">{couponErr}</p>}
            </div>

            {/* Price Summary */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-2.5">
              <h3 className="text-sm font-bold text-gray-700 mb-1">Price Details</h3>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal ({cart.length} items)</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {couponOk && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Coupon ({coupon.trim().toUpperCase()})</span>
                  <span>−₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery</span>
                <span className={delivery === 0 ? 'text-green-600 font-medium' : ''}>
                  {delivery === 0 ? 'FREE' : `₹${delivery}`}
                </span>
              </div>
              {delivery > 0 && <p className="text-xs text-gray-400">Free delivery above ₹4,999</p>}
              <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span className="text-rose-600 text-lg">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout Form */}
            {showForm ? (
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
                <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2"><MapPin size={14} /> Delivery Details</h3>

                {[
                  { k: 'name'    as const, label: 'Full Name *',      ph: 'Lakshmi Devi' },
                  { k: 'phone'   as const, label: 'Phone Number *',   ph: '9876543210' },
                  { k: 'email'   as const, label: 'Email (optional)', ph: 'lakshmi@gmail.com' },
                  { k: 'address' as const, label: 'Address',          ph: 'Flat 12, Rose Apartments' },
                  { k: 'city'    as const, label: 'City',             ph: 'Hyderabad' },
                  { k: 'state'   as const, label: 'State',            ph: 'Telangana' },
                  { k: 'pincode' as const, label: 'PIN Code',         ph: '500001' },
                ].map(({ k, label, ph }) => (
                  <div key={k}>
                    <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
                    <input value={form[k]} onChange={e => upd(k, e.target.value)}
                      placeholder={ph}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                  </div>
                ))}

                {/* Payment Mode */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Payment Mode</label>
                  <div className="grid grid-cols-1 gap-2">

                    {/* COD */}
                    <button onClick={() => upd('paymentMode', 'cod')}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-colors ${form.paymentMode === 'cod' ? 'bg-rose-50 border-rose-500' : 'border-gray-200 hover:border-rose-300'}`}>
                      <span className="text-xl">💵</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Cash on Delivery</p>
                        <p className="text-xs text-gray-400">Pay when your fabric arrives</p>
                      </div>
                      {form.paymentMode === 'cod' && <CheckCircle size={16} className="ml-auto text-rose-500" />}
                    </button>

                    {/* Online (Cashfree) */}
                    <button onClick={() => upd('paymentMode', 'upi')}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-colors ${form.paymentMode === 'upi' ? 'bg-rose-50 border-rose-500' : 'border-gray-200 hover:border-rose-300'}`}>
                      <CreditCard size={20} className="text-indigo-500" />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">UPI / Card / Netbanking</p>
                        <p className="text-xs text-gray-400">GPay, PhonePe, Paytm, Cards &amp; more</p>
                      </div>
                      {form.paymentMode === 'upi' && <CheckCircle size={16} className="ml-auto text-rose-500" />}
                    </button>

                  </div>
                </div>

                <button onClick={placeOrder} disabled={placing}
                  className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 transition-colors">
                  {placing
                    ? <><Loader2 size={16} className="animate-spin" /> Processing…</>
                    : form.paymentMode === 'cod'
                      ? <>Place Order — ₹{total.toLocaleString('en-IN')} <ArrowRight size={16} /></>
                      : <>Pay ₹{total.toLocaleString('en-IN')} Online <CreditCard size={16} /></>}
                </button>

                {form.paymentMode === 'upi' && (
                  <div className="flex items-center justify-center gap-3 pt-1">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/200px-Paytm_Logo_%28standalone%29.svg.png" alt="Paytm" className="h-5 object-contain opacity-60" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/200px-Google_Pay_Logo.svg.png" alt="GPay" className="h-5 object-contain opacity-60" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/PhonePe_Logo.svg/200px-PhonePe_Logo.svg.png" alt="PhonePe" className="h-5 object-contain opacity-60" />
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setShowForm(true)}
                className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm">
                Proceed to Checkout <ArrowRight size={16} />
              </button>
            )}

            <p className="text-xs text-gray-400 text-center">🔒 Payments secured by Cashfree</p>
          </div>
        </div>
      </div>
    </div>
  )
}
