'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80'

const STATIC_PRODUCTS = [
  { name: 'Mull Chanderi Digital Print', category: 'Chanderi', price: 125, mrp: 150, img: 'https://images.unsplash.com/photo-1553827669-9d2e67e1e3a3?w=500&q=80', badge: '17% OFF', slug: 'mull-chanderi-digital-print' },
  { name: 'Premium Georgette Floral',    category: 'Georgette', price: 185, mrp: 210, img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80', badge: 'NEW',     slug: 'premium-georgette-floral' },
  { name: 'Handblock Kalamkari Cotton',  category: 'Cotton',    price: 220, mrp: null, img: FALLBACK_IMG, badge: null, slug: 'kalamkari-cotton' },
  { name: 'Banarasi Silk Brocade',       category: 'Banarasi',  price: 480, mrp: 615, img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&q=80', badge: '22% OFF', slug: 'banarasi-silk-brocade' },
]

type Product = {
  name: string; category: string; price: number
  mrp: number | null; img: string; badge: string | null; slug: string
}

function discountBadge(price: number, mrp: number | null): string | null {
  if (!mrp || mrp <= price) return null
  const pct = Math.round((1 - price / mrp) * 100)
  return pct > 0 ? `${pct}% OFF` : null
}

export default function HomeFeaturedProducts() {
  const [products, setProducts] = useState<Product[]>(STATIC_PRODUCTS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    supabase
      .from('gf_products')
      .select('id, name, slug, category, selling_price, mrp, cloudinary_url, is_featured')
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(4)
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setProducts(data.map((p: any) => ({
            name:     p.name,
            category: p.category,
            price:    p.selling_price,
            mrp:      p.mrp || null,
            img:      p.cloudinary_url || FALLBACK_IMG,
            badge:    p.is_featured ? 'FEATURED' : discountBadge(p.selling_price, p.mrp),
            slug:     p.slug,
          })))
        }
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {[1,2,3,4].map(i => (
          <div key={i} className="rounded-xl overflow-hidden">
            <div className="aspect-[3/4] bg-gray-100 animate-pulse rounded-t-xl" />
            <div className="p-3 space-y-2">
              <div className="h-3 bg-gray-100 animate-pulse rounded w-1/2" />
              <div className="h-4 bg-gray-100 animate-pulse rounded w-3/4" />
              <div className="h-4 bg-gray-100 animate-pulse rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
      {products.map((p) => (
        <div key={p.slug} className="card group relative">
          <div className="relative aspect-[3/4] overflow-hidden rounded-t-xl bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.img || FALLBACK_IMG}
              alt={p.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {p.badge && (
              <span className="absolute top-2.5 left-2.5 bg-primary text-white text-xs font-bold px-2 py-0.5 rounded">
                {p.badge}
              </span>
            )}
            <button className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-sm hover:bg-white hover:scale-110 transition-all">
              🤍
            </button>
          </div>
          <div className="p-3">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">{p.category}</div>
            <Link href={`/fabrics/${p.slug}`} className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2 hover:text-primary transition-colors block mb-2">
              {p.name}
            </Link>
            <div className="flex items-baseline gap-1.5 mb-3">
              <span className="text-base font-bold text-primary">₹{p.price}</span>
              {p.mrp && p.mrp > p.price && (
                <span className="text-xs text-gray-400 line-through">₹{p.mrp}</span>
              )}
              <span className="text-xs text-gray-400">/m</span>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/fabrics/${p.slug}`}
                className="flex-1 bg-primary text-white text-xs font-semibold py-2 rounded-lg hover:bg-primary-dark transition-colors text-center"
              >
                View Details
              </Link>
              <a
                href={`https://wa.me/918790125438?text=Hi%2C%20I%20want%20to%20order%20${encodeURIComponent(p.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center text-sm transition-colors flex-shrink-0"
              >
                💬
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
