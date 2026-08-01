'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Minus, Plus, Trash2, MessageCircle, ArrowLeft, Tag, Shield, Truck, RotateCcw, Heart, ChevronRight } from 'lucide-react'

type CartItem = {
  id: number
  name: string
  category: string
  price: number
  mrp: number
  meters: number
  img: string
  slug: string
  color: string
  inStock: boolean
}

const initialCart: CartItem[] = [
  {
    id: 1,
    name: 'Mull Chanderi Digital Print',
    category: 'Chanderi',
    price: 125,
    mrp: 150,
    meters: 2,
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80',
    slug: 'mull-chanderi-digital-print',
    color: 'Multicolor',
    inStock: true,
  },
  {
    id: 4,
    name: 'Kanjivaram Pure Silk',
    category: 'Kanjivaram',
    price: 1200,
    mrp: 1500,
    meters: 1,
    img: 'https://images.unsplash.com/photo-1594938298603-c8148c4f4d47?w=300&q=80',
    slug: 'kanjivaram-pure-silk',
    color: 'Royal Purple',
    inStock: true,
  },
  {
    id: 5,
    name: 'Georgette Embroidered Fabric',
    category: 'Georgette',
    price: 320,
    mrp: 380,
    meters: 3,
    img: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=300&q=80',
    slug: 'georgette-embroidered-fabric',
    color: 'Dusty Rose',
    inStock: true,
  },
]

const suggestedProducts = [
  {
    id: 2,
    name: 'Pure Silk Banarasi Brocade',
    category: 'Banarasi',
    price: 850,
    mrp: 1000,
    img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&q=80',
    slug: 'pure-silk-banarasi-brocade',
    badge: '15% OFF',
  },
  {
    id: 3,
    name: 'Handloom Khadi Cotton',
    category: 'Khadi',
    price: 280,
    mrp: 320,
    img: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=300&q=80',
    slug: 'handloom-khadi-cotton',
    badge: '13% OFF',
  },
  {
    id: 6,
    name: 'Linen Slub Fabric',
    category: 'Linen',
    price: 195,
    mrp: 240,
    img: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&q=80',
    slug: 'linen-slub-fabric',
    badge: '19% OFF',
  },
  {
    id: 12,
    name: 'Pashmina Wool Blend',
    category: 'Pashmina',
    price: 950,
    mrp: 1150,
    img: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=300&q=80',
    slug: 'pashmina-wool-blend',
    badge: '17% OFF',
  },
]

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>(initialCart)
  const [coupon, setCoupon] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponError, setCouponError] = useState('')
  const [wishlist, setWishlist] = useState<number[]>([])

  const updateMeters = (id: number, delta: number) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, meters: Math.max(1, item.meters + delta) }
          : item
      )
    )
  }

  const removeItem = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const moveToWishlist = (id: number) => {
    setWishlist(prev => [...prev, id])
    removeItem(id)
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.meters, 0)
  const mrpTotal = cart.reduce((sum, item) => sum + item.mrp * item.meters, 0)
  const totalSavings = mrpTotal - subtotal
  const COUPONS: Record<string, { pct: number; label: string; desc: string }> = {
    NAARI5:  { pct: 0.05, label: 'NAARI5',  desc: '5% off on all orders' },
    NAARI10: { pct: 0.10, label: 'NAARI10', desc: '10% off on first order' },
    GOFAB15: { pct: 0.15, label: 'GOFAB15', desc: '15% off above ₹2000' },
  }
  const [appliedCoupon, setAppliedCoupon]   = useState<typeof COUPONS[string] | null>(null)
  const couponDiscount = appliedCoupon ? Math.round(subtotal * appliedCoupon.pct) : 0
  const shipping = subtotal >= 999 ? 0 : 99
  const grandTotal = subtotal - couponDiscount + shipping
  const totalMeters = cart.reduce((sum, item) => sum + item.meters, 0)

  const applyCoupon = () => {
    const key = coupon.trim().toUpperCase()
    if (!key) { setCouponError('Please enter a coupon code'); return }
    const found = COUPONS[key]
    if (!found) { setCouponError('Invalid code. Try NAARI5 or NAARI10'); return }
    if (key === 'GOFAB15' && subtotal < 2000) { setCouponError('GOFAB15 requires order above ₹2000'); return }
    setAppliedCoupon(found)
    setCouponApplied(true)
    setCouponError('')
  }

  const buildWhatsAppMessage = () => {
    const itemsList = cart
      .map(item => `• ${item.name} — ${item.meters}m × ₹${item.price} = ₹${item.price * item.meters}`)
      .join('%0A')
    const msg = `Hi GoFabrikos! I want to place an order:%0A%0A${itemsList}%0A%0ASubtotal: ₹${subtotal}%0A${appliedCoupon ? `Coupon (${appliedCoupon.label}): -₹${couponDiscount}%0A` : ''}Shipping: ${shipping === 0 ? 'FREE' : `₹${shipping}`}%0A*Total: ₹${grandTotal}*%0A%0APlease confirm availability and payment details.`
    return `https://wa.me/919581734837?text=${msg}`
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #C8102E, #D4AF37)' }}>
                  <span className="text-white font-bold text-xs">GF</span>
                </div>
                <span className="text-xl font-bold" style={{ color: '#1A1A2E' }}>
                  Go<span style={{ color: '#C8102E' }}>Fabrikos</span>
                </span>
              </Link>
            </div>
          </div>
        </header>

        {/* Empty Cart */}
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <div className="w-28 h-28 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={52} className="text-red-300" />
          </div>
          <h1 className="text-3xl font-bold mb-3" style={{ color: '#1A1A2E' }}>Your cart is empty</h1>
          <p className="text-gray-500 mb-8">Explore our premium Indian fabrics and add something beautiful!</p>
          <Link
            href="/fabrics"
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl font-bold text-white text-lg hover:shadow-lg transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #C8102E, #D4AF37)' }}
          >
            <ShoppingBag size={20} />
            <span>Browse Fabrics</span>
          </Link>

          {/* Suggested */}
          <div className="mt-16 text-left">
            <h2 className="text-xl font-bold mb-5" style={{ color: '#1A1A2E' }}>You Might Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {suggestedProducts.slice(0, 4).map(p => (
                <Link key={p.id} href={`/fabrics/${p.slug}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                  <div className="aspect-square overflow-hidden">
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-gray-400">{p.category}</p>
                    <h3 className="font-semibold text-sm text-gray-800 line-clamp-2">{p.name}</h3>
                    <p className="font-bold text-sm mt-1" style={{ color: '#C8102E' }}>₹{p.price}/m</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #C8102E, #D4AF37)' }}>
                <span className="text-white font-bold text-xs">GF</span>
              </div>
              <span className="text-xl font-bold" style={{ color: '#1A1A2E' }}>
                Go<span style={{ color: '#C8102E' }}>Fabrikos</span>
              </span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-red-700 text-sm font-medium">Home</Link>
              <Link href="/fabrics" className="text-gray-600 hover:text-red-700 text-sm font-medium">Fabrics</Link>
              <Link href="/visualizer" className="text-gray-600 hover:text-red-700 text-sm font-medium">Visualizer</Link>
            </nav>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <ShoppingBag size={22} className="text-gray-700" />
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold"
                  style={{ background: '#C8102E' }}>
                  {cart.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-red-700">Home</Link>
            <ChevronRight size={14} />
            <span className="text-gray-800 font-medium">Shopping Cart</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>Shopping Cart</h1>
            <p className="text-gray-500 text-sm mt-1">{cart.length} item{cart.length > 1 ? 's' : ''} • {totalMeters} meter{totalMeters > 1 ? 's' : ''} total</p>
          </div>
          <Link href="/fabrics" className="flex items-center space-x-2 text-sm font-semibold hover:text-red-700 transition-colors" style={{ color: '#C8102E' }}>
            <ArrowLeft size={16} />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Free shipping banner */}
        {shipping > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 flex items-center space-x-3">
            <Truck size={18} className="text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-700 font-medium">
              Add <strong>₹{999 - subtotal} more</strong> to get <strong>FREE shipping!</strong>
            </p>
          </div>
        )}
        {shipping === 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-6 flex items-center space-x-3">
            <Truck size={18} className="text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-700 font-medium">You have <strong>FREE shipping</strong> on this order!</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4">
                {/* Image */}
                <Link href={`/fabrics/${item.slug}`} className="flex-shrink-0">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover hover:opacity-90 transition-opacity"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{item.category}</p>
                      <Link href={`/fabrics/${item.slug}`}>
                        <h3 className="font-bold text-gray-800 hover:text-red-700 transition-colors leading-snug">{item.name}</h3>
                      </Link>
                      <p className="text-xs text-gray-500 mt-0.5">Color: {item.color}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-lg" style={{ color: '#C8102E' }}>₹{item.price * item.meters}</p>
                      <p className="text-xs text-gray-400 line-through">₹{item.mrp * item.meters}</p>
                      <p className="text-xs text-gray-500">₹{item.price}/m</p>
                    </div>
                  </div>

                  {/* Meter selector + actions */}
                  <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                    {/* Meter control */}
                    <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => updateMeters(item.id, -0.5)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-red-50 text-gray-600 hover:text-red-700 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 font-bold text-sm" style={{ color: '#1A1A2E' }}>{item.meters}m</span>
                      <button
                        onClick={() => updateMeters(item.id, 0.5)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-red-50 text-gray-600 hover:text-red-700 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Action links */}
                    <div className="flex items-center space-x-3 text-xs">
                      <button
                        onClick={() => moveToWishlist(item.id)}
                        className="flex items-center space-x-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Heart size={13} />
                        <span>Wishlist</span>
                      </button>
                      <span className="text-gray-200">|</span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex items-center space-x-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={13} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>

                  {/* Savings badge */}
                  {item.mrp > item.price && (
                    <div className="mt-2">
                      <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
                        You save ₹{(item.mrp - item.price) * item.meters} on this item
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Coupon Code */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-2 mb-3">
                <Tag size={16} className="text-gray-400" />
                <span className="font-semibold text-gray-700 text-sm">Apply Coupon Code</span>
              </div>
              {couponApplied ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-green-700 font-bold text-sm">{appliedCoupon?.label} applied! 🎉</p>
                    <p className="text-green-600 text-xs">{appliedCoupon?.desc} — You saved ₹{couponDiscount}</p>
                  </div>
                  <button
                    onClick={() => { setCouponApplied(false); setCoupon('') }}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coupon}
                    onChange={e => { setCoupon(e.target.value); setCouponError('') }}
                    placeholder="Try NAARI5, NAARI10, GOFAB15"
                    className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 transition-colors"
                    onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                  />
                  <button
                    onClick={applyCoupon}
                    className="px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #C8102E, #D4AF37)' }}
                  >
                    Apply
                  </button>
                </div>
              )}
              {couponError && <p className="text-red-500 text-xs mt-2">{couponError}</p>}
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Truck size={20} className="text-blue-600" />, title: 'Free Shipping', sub: 'Above ₹999' },
                { icon: <Shield size={20} className="text-green-600" />, title: '100% Genuine', sub: 'Certified Fabric' },
                { icon: <RotateCcw size={20} className="text-purple-600" />, title: 'Easy Returns', sub: '7 Day Policy' },
              ].map(badge => (
                <div key={badge.title} className="flex flex-col items-center text-center p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                  {badge.icon}
                  <span className="text-xs font-semibold text-gray-700 mt-1">{badge.title}</span>
                  <span className="text-xs text-gray-400">{badge.sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sticky top-20">
              <h2 className="font-bold text-lg mb-4" style={{ color: '#1A1A2E' }}>Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.length} item{cart.length > 1 ? 's' : ''})</span>
                  <span className="font-medium">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Fabric Discount</span>
                  <span className="font-medium">-₹{totalSavings}</span>
                </div>
                {couponApplied && appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon ({appliedCoupon.label})</span>
                    <span className="font-medium">-₹{couponDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={`font-medium ${shipping === 0 ? 'text-green-600' : ''}`}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-base" style={{ color: '#1A1A2E' }}>
                  <span>Total</span>
                  <span>₹{grandTotal}</span>
                </div>
                {(totalSavings + couponDiscount) > 0 && (
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <p className="text-green-600 font-bold text-sm">
                      You save ₹{totalSavings + couponDiscount} on this order!
                    </p>
                  </div>
                )}
              </div>

              {/* WhatsApp Checkout */}
              <a
                href={buildWhatsAppMessage()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 w-full py-4 rounded-xl font-bold text-white flex items-center justify-center space-x-2 hover:opacity-90 transition-all hover:scale-105 active:scale-95 hover:shadow-lg"
                style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', display: 'flex' }}
              >
                <MessageCircle size={22} />
                <span>Checkout via WhatsApp</span>
              </a>

              <p className="text-xs text-gray-400 text-center mt-3">
                Our team will confirm your order & share payment details on WhatsApp
              </p>

              {/* Payment icons */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center mb-2">We accept</p>
                <div className="flex justify-center space-x-2 text-xs text-gray-500">
                  {['UPI', 'Razorpay', 'EMI', 'COD', 'Cards'].map(method => (
                    <span key={method} className="px-2 py-1 bg-gray-100 rounded-md font-medium">{method}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* You May Also Like */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#1A1A2E' }}>You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {suggestedProducts.map(p => (
              <Link
                key={p.id}
                href={`/fabrics/${p.slug}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group hover:-translate-y-1"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-white text-xs font-bold" style={{ background: '#C8102E' }}>
                    {p.badge}
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-400 mb-1">{p.category}</p>
                  <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">{p.name}</h3>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="font-bold text-sm" style={{ color: '#C8102E' }}>₹{p.price}/m</span>
                    <span className="text-xs text-gray-400 line-through">₹{p.mrp}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 py-10 border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
          <p className="font-semibold text-gray-600 mb-1">GoFabrikos | Prop: Lakshmi Sowjanya Aaki</p>
          <p>Premium Indian Fabrics • WhatsApp: +91 95817 34837 • Guntur, Andhra Pradesh</p>
        </div>
      </footer>
    </div>
  )
}
