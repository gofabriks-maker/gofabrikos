'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Heart, ShoppingBag, Star, MessageCircle, Share2,
  BadgeCheck, Truck, RotateCcw, Minus, Plus,
  Check, Flame, Sparkles, ChevronLeft, ChevronRight, ZoomIn, X, Eye, Users
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

export default function FabricDetailClient({ product: p }: { product: Product }) {
  const [qty,          setQty]          = useState(1)
  const [activeImg,    setActiveImg]    = useState(0)
  const [wishlist,     setWishlist]     = useState(false)
  const [addedToCart,  setAddedToCart]  = useState(false)
  const [lightbox,     setLightbox]     = useState(false)
  const [copied,       setCopied]       = useState(false)
  // Simulated live engagement (replace with real data when analytics are wired)
  const viewingNow = Math.floor(Math.random() * 18) + 3

  const discount = p.mrp > p.price
    ? Math.round(((p.mrp - p.price) / p.mrp) * 100)
    : 0

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
    setTimeout(() => setCopied(false), 2000)
  }

  const whatsappMsg = `Hi! I'm interested in *${p.name}* (${qty}m) @ ₹${p.price}/m. Total: ₹${p.price * qty}. https://gofabrikos.com/fabrics/${p.slug}`

  return (
    <div className="min-h-screen bg-white">

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <nav className="flex items-center gap-1 text-xs text-gray-500">
          <Link href="/" className="hover:text-rose-600">Home</Link>
          <ChevronRight size={12} />
          <Link href="/fabrics" className="hover:text-rose-600">Fabrics</Link>
          <ChevronRight size={12} />
          {p.category && <><Link href={`/fabrics?category=${encodeURIComponent(p.category)}`} className="hover:text-rose-600">{p.category}</Link><ChevronRight size={12} /></>}
          <span className="text-gray-800 font-medium truncate max-w-48">{p.name}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ── LEFT: Image Gallery ── */}
          <div className="space-y-3">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 cursor-zoom-in" onClick={() => setLightbox(true)}>
              <Image src={p.images[activeImg]} alt={p.name} fill className="object-cover" priority sizes="(max-width:1024px) 100vw, 50vw" />
              {p.isNewArrival && <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1"><Sparkles size={10} /> NEW</span>}
              {p.isTrending  && <span className="absolute top-3 left-3 mt-7 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1"><Flame size={10} /> TRENDING</span>}
              {discount > 0  && <span className="absolute top-3 right-3 bg-rose-600 text-white text-xs font-bold px-2 py-1 rounded-full">{discount}% OFF</span>}
              <button className="absolute bottom-3 right-3 bg-white/80 p-1.5 rounded-full backdrop-blur-sm"><ZoomIn size={16} /></button>
              {p.images.length > 1 && <>
                <button onClick={e => { e.stopPropagation(); setActiveImg(i => (i - 1 + p.images.length) % p.images.length) }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 rounded-full backdrop-blur-sm shadow"><ChevronLeft size={16} /></button>
                <button onClick={e => { e.stopPropagation(); setActiveImg(i => (i + 1) % p.images.length) }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 rounded-full backdrop-blur-sm shadow"><ChevronRight size={16} /></button>
              </>}
            </div>

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
          </div>

          {/* ── RIGHT: Product Info ── */}
          <div className="space-y-5">
            <div>
              {p.category && <p className="text-xs font-medium text-rose-600 uppercase tracking-widest mb-1">{p.category}</p>}
              <h1 className="text-2xl font-bold text-gray-900 leading-snug">{p.fullName || p.name}</h1>

              {/* Price */}
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-3xl font-extrabold text-gray-900">₹{p.price.toLocaleString()}</span>
                <span className="text-sm text-gray-400">/metre</span>
                {p.mrp > p.price && <>
                  <span className="text-lg text-gray-400 line-through">₹{p.mrp.toLocaleString()}</span>
                  <span className="text-sm font-bold text-green-600">{discount}% off</span>
                </>}
              </div>
              <p className="text-xs text-gray-400 mt-0.5">Inclusive of all taxes · Free delivery above ₹499</p>
            </div>

            {/* Live engagement bar */}
            <div className="flex items-center gap-3 text-xs text-stone-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
                <strong className="text-stone-700">{viewingNow}</strong> people viewing now
              </span>
              <span>·</span>
              <span className="flex items-center gap-1"><Star size={11} className="text-amber-400 fill-amber-400" />
                {p.mrp > 0 ? 'Popular pick' : 'New arrival'}
              </span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-full flex items-center gap-1"><BadgeCheck size={10} /> GoFabrikos Certified</span>
              <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-full flex items-center gap-1"><Truck size={10} /> Free Ship ₹499+</span>
              <span className="text-xs bg-orange-50 text-orange-700 border border-orange-200 px-2 py-1 rounded-full flex items-center gap-1"><RotateCcw size={10} /> 7-Day Returns</span>
            </div>

            {/* Stock */}
            {p.stockLeft > 0 ? (
              <div className="text-sm">
                <span className={p.stockLeft <= 20 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
                  {p.stockLeft <= 20 ? `⚠ Only ${p.stockLeft}m left!` : `✓ In Stock · ${p.stockLeft}m available`}
                </span>
              </div>
            ) : (
              <p className="text-sm text-red-600 font-semibold">✕ Out of Stock</p>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity (metres)</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                  <Minus size={14} />
                </button>
                <span className="text-lg font-bold w-12 text-center">{qty}m</span>
                <button onClick={() => setQty(q => q + 1)}
                  className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                  <Plus size={14} />
                </button>
                <span className="text-sm text-gray-500 ml-2">= <span className="font-bold text-gray-900">₹{(p.price * qty).toLocaleString()}</span></span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <button onClick={addToCart} disabled={p.stockLeft === 0}
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-colors">
                {addedToCart ? <><Check size={16} /> Added!</> : <><ShoppingBag size={16} /> Add to Cart — ₹{(p.price * qty).toLocaleString()}</>}
              </button>
              <button onClick={() => setWishlist(w => !w)}
                className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-colors ${wishlist ? 'bg-rose-50 border-rose-400 text-rose-500' : 'border-gray-200 text-gray-400 hover:border-rose-300'}`}>
                <Heart size={18} fill={wishlist ? 'currentColor' : 'none'} />
              </button>
            </div>

            <a href={`https://wa.me/918790125438?text=${encodeURIComponent(whatsappMsg)}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-green-500 text-green-700 font-bold hover:bg-green-50 transition-colors">
              <MessageCircle size={16} /> Order via WhatsApp
            </a>

            {/* Fabric Details */}
            <div className="border border-gray-100 rounded-2xl p-5 space-y-3">
              <h3 className="font-semibold text-gray-900 text-sm">Fabric Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {p.fabricType  && <><span className="text-gray-500">Fabric Type</span><span className="font-medium">{p.fabricType}</span></>}
                {p.printType   && <><span className="text-gray-500">Print/Weave</span><span className="font-medium">{p.printType}</span></>}
                {p.composition && <><span className="text-gray-500">Composition</span><span className="font-medium">{p.composition}</span></>}
                {p.gsm         && <><span className="text-gray-500">Weight</span><span className="font-medium">{p.gsm}</span></>}
                {p.occasion    && <><span className="text-gray-500">Suitable For</span><span className="font-medium">{p.occasion}</span></>}
                {p.season      && <><span className="text-gray-500">Season</span><span className="font-medium">{p.season}</span></>}
                {p.washCare    && <><span className="text-gray-500">Wash Care</span><span className="font-medium">{p.washCare}</span></>}
              </div>
            </div>

            {/* Description */}
            {p.description && (
              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2">Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{p.description}</p>
              </div>
            )}

            {/* Tags */}
            {p.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {p.tags.map(t => (
                  <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{t}</span>
                ))}
              </div>
            )}

            {/* Share */}
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
              <span className="text-sm text-gray-500">Share:</span>
              <button onClick={copyLink} className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full flex items-center gap-1">
                <Share2 size={11} /> {copied ? 'Copied!' : 'Copy link'}
              </button>
            </div>
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
