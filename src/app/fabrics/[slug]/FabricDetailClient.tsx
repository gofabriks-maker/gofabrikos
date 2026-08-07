'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Heart, ShoppingBag, Star, MessageCircle, Share2,
  BadgeCheck, Truck, RotateCcw, Minus, Plus,
  Check, Flame, Sparkles, ChevronLeft, ChevronRight, ZoomIn, X,
  Eye, Tag, Package, TrendingUp
} from 'lucide-react'

interface Product {
  id: string
  name: string
  fullName: string
  slug: string
  category: string
  price: number
  mrp: number
  fabricType: string
  printType: string
  gsm: string
  composition: string
  occasion: string
  season: string
  washCare: string
  description: string
  stockLeft: number
  isNewArrival: boolean
  isTrending: boolean
  images: string[]
  tags: string[]
}

// Seeded random so numbers stay stable per product slug
function seeded(slug: string, min: number, max: number) {
  let h = 0
  for (let i = 0; i < slug.length; i++) h = (Math.imul(31, h) + slug.charCodeAt(i)) | 0
  return min + (Math.abs(h) % (max - min + 1))
}

export default function FabricDetailClient({ product: p }: { product: Product }) {
  const [qty,         setQty]         = useState(1)
  const [activeImg,   setActiveImg]   = useState(0)
  const [wishlist,    setWishlist]    = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [lightbox,    setLightbox]    = useState(false)
  const [copied,      setCopied]      = useState(false)
  const [viewingNow,  setViewingNow]  = useState(0)

  // Stable seeded social-proof numbers
  const ratings    = seeded(p.slug, 1200, 3800)
  const reviews    = seeded(p.slug + 'r', 180, 680)
  const rating     = (3.8 + (seeded(p.slug + 'rt', 0, 12) / 10)).toFixed(1)
  const likesCount = seeded(p.slug + 'l', 400, 2200)
  const viewsToday = seeded(p.slug + 'v', 1200, 9800)
  const ordersCount= seeded(p.slug + 'o', 80, 560)

  // Live viewer count — randomise on client only to avoid hydration mismatch
  useEffect(() => {
    setViewingNow(seeded(p.slug + 'vn', 4, 72))
  }, [p.slug])

  const discount = p.mrp > p.price
    ? Math.round(((p.mrp - p.price) / p.mrp) * 100)
    : 0

  // Stock bar
  const maxStock  = Math.max(p.stockLeft, 100)
  const stockPct  = Math.min(100, Math.round((p.stockLeft / maxStock) * 100))
  const stockLow  = p.stockLeft > 0 && p.stockLeft <= 30

  function addToCart() {
    const cart = JSON.parse(localStorage.getItem('gofabrikos_cart') || '[]')
    const idx  = cart.findIndex((i: any) => i.slug === p.slug)
    if (idx >= 0) cart[idx].qty += qty
    else cart.push({ slug: p.slug, name: p.name, price: p.price, qty, image: p.images[0] })
    localStorage.setItem('gofabrikos_cart', JSON.stringify(cart))
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2500)
  }

  function copyLink() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const pageUrl     = `https://gofabrikos.com/fabrics/${p.slug}`
  const whatsappMsg = `Hi! I'm interested in *${p.name}* (${qty}m) @ ₹${p.price}/m. Total: ₹${(p.price * qty).toLocaleString()}. ${pageUrl}`
  const fbShare     = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`
  const igMsg       = `https://www.instagram.com/`   // Instagram doesn't support direct URL sharing

  return (
    <div className="min-h-screen bg-white">

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <nav className="flex items-center gap-1 text-xs text-gray-500">
          <Link href="/" className="hover:text-rose-600">Home</Link>
          <ChevronRight size={12} />
          <Link href="/fabrics" className="hover:text-rose-600">Fabrics</Link>
          <ChevronRight size={12} />
          {p.category && (
            <>
              <Link href={`/fabrics?category=${encodeURIComponent(p.category)}`} className="hover:text-rose-600">{p.category}</Link>
              <ChevronRight size={12} />
            </>
          )}
          <span className="text-gray-800 font-medium truncate max-w-48">{p.name}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ── LEFT: Image Gallery ── */}
          <div className="space-y-3">
            <div
              className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 cursor-zoom-in"
              onClick={() => setLightbox(true)}
            >
              <Image
                src={p.images[activeImg]} alt={p.name} fill
                className="object-cover" priority
                sizes="(max-width:1024px) 100vw, 50vw"
              />
              {/* Badges on image */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {p.isNewArrival && (
                  <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                    <Sparkles size={10} /> NEW ARRIVAL
                  </span>
                )}
                {p.isTrending && (
                  <span className="bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                    🔥 TRENDING
                  </span>
                )}
              </div>
              {discount > 0 && (
                <span className="absolute top-3 right-3 bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                  {discount}% OFF
                </span>
              )}
              <button className="absolute bottom-3 right-3 bg-white/80 p-1.5 rounded-full backdrop-blur-sm shadow">
                <ZoomIn size={16} />
              </button>
              {p.images.length > 1 && (
                <>
                  <button
                    onClick={e => { e.stopPropagation(); setActiveImg(i => (i - 1 + p.images.length) % p.images.length) }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 rounded-full backdrop-blur-sm shadow"
                  ><ChevronLeft size={16} /></button>
                  <button
                    onClick={e => { e.stopPropagation(); setActiveImg(i => (i + 1) % p.images.length) }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 rounded-full backdrop-blur-sm shadow"
                  ><ChevronRight size={16} /></button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {p.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {p.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`flex-none w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${activeImg === i ? 'border-rose-500' : 'border-gray-200'}`}>
                    <Image src={img} alt="" width={64} height={64} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Social Proof Row */}
            <div className="flex items-center gap-4 text-sm text-gray-500 border border-gray-100 rounded-xl px-4 py-2.5">
              <span className="flex items-center gap-1.5">
                <Heart size={14} className="text-rose-500 fill-rose-500" />
                <strong className="text-gray-700">{likesCount.toLocaleString()}</strong> Likes
              </span>
              <span className="text-gray-200">|</span>
              <span className="flex items-center gap-1.5">
                <Eye size={14} className="text-blue-500" />
                <strong className="text-gray-700">{viewsToday.toLocaleString()}</strong> Views Today
              </span>
              <span className="text-gray-200">|</span>
              <span className="flex items-center gap-1.5">
                <ShoppingBag size={14} className="text-green-600" />
                <strong className="text-gray-700">{ordersCount}</strong> Orders
              </span>
            </div>

            {/* Share Row */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 mr-1">Share:</span>
              <a href={`https://wa.me/?text=${encodeURIComponent(whatsappMsg)}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-full font-medium hover:bg-green-100 transition-colors">
                <MessageCircle size={12} /> WhatsApp
              </a>
              <a href={fbShare} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full font-medium hover:bg-blue-100 transition-colors">
                <Share2 size={12} /> Facebook
              </a>
              <a href={igMsg} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs bg-pink-50 text-pink-700 border border-pink-200 px-3 py-1.5 rounded-full font-medium hover:bg-pink-100 transition-colors">
                <TrendingUp size={12} /> Instagram
              </a>
              <button onClick={copyLink}
                className="flex items-center gap-1.5 text-xs bg-gray-100 text-gray-600 border border-gray-200 px-3 py-1.5 rounded-full font-medium hover:bg-gray-200 transition-colors">
                {copied ? <><Check size={12} /> Copied!</> : <><Share2 size={12} /> Copy Link</>}
              </button>
            </div>
          </div>

          {/* ── RIGHT: Product Info ── */}
          <div className="space-y-4">

            {/* Seller + Title */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                {p.category && <p className="text-xs font-semibold text-rose-600 uppercase tracking-widest">{p.category}</p>}
                <span className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                  <BadgeCheck size={12} /> GoFabrikos Certified
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 leading-snug">{p.fullName || p.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-0.5 bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                  <span>{rating}</span>
                  <Star size={10} className="fill-white ml-0.5" />
                </div>
                <span className="text-xs text-gray-500">{ratings.toLocaleString()} Ratings · {reviews.toLocaleString()} Reviews</span>
                {viewingNow > 0 && (
                  <span className="flex items-center gap-1 text-xs text-orange-600 font-medium ml-1">
                    🔥 {viewingNow} people viewing right now
                  </span>
                )}
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-extrabold text-gray-900">₹{p.price.toLocaleString()}</span>
                <span className="text-sm text-gray-400">/metre</span>
                {p.mrp > p.price && (
                  <>
                    <span className="text-lg text-gray-400 line-through">₹{p.mrp.toLocaleString()}/m</span>
                    <span className="text-sm font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">{discount}% OFF</span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-400">Inclusive of all taxes · <span className="text-green-600 font-medium">FREE delivery above ₹4,999</span></p>

              {/* Promo Offers */}
              <div className="space-y-2 border-t border-gray-200 pt-3">
                <div className="flex items-start gap-2 text-xs">
                  <span className="text-xl leading-none">🏦</span>
                  <span className="text-gray-700">Extra <span className="text-green-700 font-bold">5% off</span> on online payment (UPI / Net Banking)</span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <span className="text-xl leading-none">🎁</span>
                  <span className="text-gray-700">Use code <span className="font-bold text-rose-600 bg-rose-50 px-1 rounded">NAARI10</span> → Get <strong>10% off</strong> on first order</span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <span className="text-xl leading-none">📦</span>
                  <span className="text-gray-700">Buy 10m+ → Get <span className="font-bold text-blue-600">additional 8% bulk discount</span></span>
                </div>
              </div>
            </div>

            {/* Stock Bar */}
            {p.stockLeft > 0 ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-gray-600 font-medium">
                    <Package size={12} /> Stock Availability
                  </span>
                  <span className={stockLow ? 'text-red-600 font-bold' : 'text-green-600 font-semibold'}>
                    {stockLow ? `Only ${p.stockLeft} metres left!` : `${p.stockLeft}m available`}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${stockPct > 60 ? 'bg-green-500' : stockPct > 25 ? 'bg-yellow-400' : 'bg-red-500'}`}
                    style={{ width: `${stockPct}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-sm text-red-600 font-semibold">✕ Out of Stock</p>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity (metres)</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <Minus size={14} />
                </button>
                <span className="text-lg font-bold w-12 text-center">{qty}m</span>
                <button onClick={() => setQty(q => q + 1)}
                  className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <Plus size={14} />
                </button>
                <span className="text-sm text-gray-500 ml-2">
                  = <span className="font-bold text-gray-900">₹{(p.price * qty).toLocaleString()}</span>
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <button onClick={addToCart} disabled={p.stockLeft === 0}
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-colors">
                {addedToCart
                  ? <><Check size={16} /> Added to Cart!</>
                  : <><ShoppingBag size={16} /> Add to Cart — ₹{(p.price * qty).toLocaleString()}</>
                }
              </button>
              <button onClick={() => setWishlist(w => !w)}
                className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-colors ${wishlist ? 'bg-rose-50 border-rose-400 text-rose-500' : 'border-gray-200 text-gray-400 hover:border-rose-300'}`}>
                <Heart size={18} fill={wishlist ? 'currentColor' : 'none'} />
              </button>
            </div>

            <a href={`https://wa.me/918790125438?text=${encodeURIComponent(whatsappMsg)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-green-500 text-green-700 font-bold hover:bg-green-50 transition-colors">
              <MessageCircle size={16} /> Order via WhatsApp
            </a>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                <BadgeCheck size={10} /> GoFabrikos Certified
              </span>
              <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Truck size={10} /> Free Ship ₹4999+
              </span>
              <span className="text-xs bg-orange-50 text-orange-700 border border-orange-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                <RotateCcw size={10} /> 7-Day Returns
              </span>
            </div>

            {/* Fabric Specifications */}
            <div className="border border-gray-100 rounded-2xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-800">FABRIC SPECIFICATIONS</h3>
              </div>
              <div className="grid grid-cols-2 gap-0 divide-x divide-y divide-gray-100 text-sm">
                {[
                  { label: 'FABRIC TYPE',  value: p.fabricType },
                  { label: 'PRINT TYPE',   value: p.printType  },
                  { label: 'GSM',          value: p.gsm        },
                  { label: 'COMPOSITION',  value: p.composition},
                  { label: 'OCCASION',     value: p.occasion   },
                  { label: 'SEASON',       value: p.season     },
                  { label: 'WASH CARE',    value: p.washCare   },
                ].filter(s => s.value).map(spec => (
                  <div key={spec.label} className="p-3">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-0.5">{spec.label}</p>
                    <p className="font-semibold text-gray-800">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {p.description && (
              <div className="bg-blue-50 rounded-xl px-4 py-3 border border-blue-100">
                <h3 className="font-semibold text-gray-800 text-sm mb-1">About this Fabric</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{p.description}</p>
              </div>
            )}

            {/* Tags */}
            {p.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {p.tags.map(t => (
                  <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Tag size={9} /> {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(false)}>
          <button className="absolute top-4 right-4 text-white"><X size={28} /></button>
          <Image src={p.images[activeImg]} alt={p.name} width={800} height={800} className="max-h-screen object-contain rounded-xl" />
        </div>
      )}
    </div>
  )
}
