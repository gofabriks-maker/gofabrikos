'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import NewsletterForm from '@/components/ui/NewsletterForm'

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80'

const CATEGORIES = [
  { label: 'All',           key: 'all',              href: '/fabrics' },
  { label: 'Saree',         key: 'Designer Sarees',  href: '/fabrics?category=Saree' },
  { label: 'Lehenga',       key: 'Lehenga Fabrics',  href: '/fabrics?category=Lehenga' },
  { label: 'Blouse',        key: 'Blouse',           href: '/fabrics?category=Blouse' },
  { label: 'Dress Material',key: 'Dress Material',   href: '/fabrics?category=Dress+Material' },
  { label: 'Cotton',        key: 'Cotton',           href: '/fabrics?category=Cotton' },
]

// Returns true if product's category matches a tab key (handles partial names)
function catMatch(productCat: string | null, tabKey: string): boolean {
  if (!productCat) return false
  const pc = productCat.toLowerCase()
  const tk = tabKey.toLowerCase()
  return pc === tk || pc.includes(tk) || tk.includes(pc)
}

const stats = [
  { num: '2,400+', label: 'Fabric Designs' },
  { num: '18,000+', label: 'Happy Customers' },
  { num: '500+', label: 'Cities Served' },
  { num: '4.8★', label: 'Google Rating' },
]

const trustItems = [
  { icon: '📦', title: 'Free Shipping', sub: 'On orders above ₹4,999' },
  { icon: '📄', title: 'GST Invoice', sub: 'Auto-generated PDF' },
  { icon: '🔄', title: 'Easy Returns', sub: '7-day return policy' },
  { icon: '🏭', title: 'B2B Wholesale', sub: 'Bulk pricing available' },
  { icon: '💬', title: 'WhatsApp Support', sub: '8 AM – 9 PM daily' },
]

type Product = {
  id: string; name: string; slug: string; category: string
  selling_price: number; mrp: number | null; cloudinary_url: string | null
}

export default function HomePage() {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    supabase
      .from('gf_products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        console.log('Homepage products:', data?.length, error?.message)
        if (!error && data) setAllProducts(data)
        setLoading(false)
      })
  }, [])

  // Build category rows — only categories that have at least 1 product
  const categoryRows = CATEGORIES.filter(c => c.key !== 'all').map(cat => ({
    ...cat,
    products: allProducts.filter(p => catMatch(p.category, cat.key)).slice(0, 6),
  })).filter(row => row.products.length > 0)

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative min-h-[560px] bg-dark flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="max-w-2xl">
            <div className="inline-block bg-primary/20 border border-primary/40 text-primary text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-widest">
              ✨ India&apos;s Premier Fabric Store
            </div>
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
              Dress Her in<br/>
              <span className="text-gold">India&apos;s Finest Fabrics</span>
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-lg">
              From Chanderi silks to digital prints — shop premium fabrics priced per meter. GST invoice on every order. Pan-India delivery.
            </p>
            <div className="flex flex-wrap gap-4 mb-12">
              <Link href="/fabrics" className="btn-primary text-base !px-7 !py-3.5">🛍️ Shop All Fabrics</Link>
              <Link href="/visualizer" className="btn-outline text-white border-white/40 hover:border-gold hover:text-gold text-base !px-7 !py-3.5">👗 Try Visualizer</Link>
            </div>
            <div className="flex flex-wrap gap-8">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="font-playfair text-2xl font-bold text-gold">{s.num}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST BAR ===== */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-around gap-4">
            {trustItems.map((item) => (
              <div key={item.title} className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-red-50 rounded-full flex items-center justify-center text-lg flex-shrink-0">{item.icon}</div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">{item.title}</div>
                  <div className="text-xs text-gray-500">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== SHOP BY CATEGORY — One Row Per Category ===== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-block bg-red-50 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3">Shop by Category</div>
            <h2 className="section-title mb-3">Fabrics for Every Occasion</h2>
            <p className="text-gray-500 max-w-md mx-auto">Handpicked premium fabrics — updated live from our collection.</p>
          </div>

          {/* Loading skeletons */}
          {loading && (
            <div className="space-y-14">
              {[1, 2].map(s => (
                <div key={s}>
                  <div className="h-6 bg-gray-200 animate-pulse rounded w-48 mb-5" />
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {[1,2,3,4,5,6].map(i => (
                      <div key={i} className="rounded-xl overflow-hidden bg-white shadow-sm">
                        <div className="aspect-[3/4] bg-gray-100 animate-pulse" />
                        <div className="p-3 space-y-2">
                          <div className="h-3 bg-gray-100 animate-pulse rounded w-2/3" />
                          <div className="h-3 bg-gray-100 animate-pulse rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Category rows */}
          {!loading && (
            <div className="space-y-14">
              {categoryRows.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <div className="text-5xl mb-4">🧵</div>
                  <p className="text-lg font-medium">No products yet</p>
                  <p className="text-sm mt-1">Add products via the Admin Panel — they&apos;ll appear here instantly.</p>
                </div>
              ) : categoryRows.map((row) => (
                <div key={row.key}>
                  {/* Row header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-7 bg-primary rounded-full" />
                      <h3 className="font-playfair text-2xl font-bold text-gray-800">{row.label}</h3>
                      <span className="text-xs bg-red-50 text-primary font-semibold px-2 py-0.5 rounded-full">
                        {row.products.length} item{row.products.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    <Link href={row.href} className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                      View All {row.label} →
                    </Link>
                  </div>

                  {/* Product row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {row.products.map((p) => (
                      <div key={p.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.cloudinary_url || FALLBACK_IMG}
                            alt={p.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          {p.mrp && p.mrp > p.selling_price && (
                            <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                              {Math.round((1 - p.selling_price / p.mrp) * 100)}% OFF
                            </span>
                          )}
                        </div>
                        <div className="p-2.5">
                          <Link href={`/fabrics/${p.slug}`} className="text-xs font-semibold text-gray-800 line-clamp-2 hover:text-primary transition-colors block mb-1.5">
                            {p.name}
                          </Link>
                          <div className="flex items-baseline gap-1 mb-2">
                            <span className="text-sm font-bold text-primary">₹{p.selling_price}</span>
                            {p.mrp && p.mrp > p.selling_price && (
                              <span className="text-xs text-gray-400 line-through">₹{p.mrp}</span>
                            )}
                            <span className="text-xs text-gray-400">/m</span>
                          </div>
                          <Link href={`/fabrics/${p.slug}`}
                            className="block w-full bg-primary text-white text-xs font-semibold py-1.5 rounded-lg text-center hover:bg-primary-dark transition-colors">
                            View Details
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View All Fabrics CTA */}
          {!loading && categoryRows.length > 0 && (
            <div className="text-center mt-12">
              <Link href="/fabrics" className="btn-primary !text-sm !px-8 !py-3.5">
                🛍️ View All Fabrics →
              </Link>
            </div>
          )}

        </div>
      </section>

      {/* ===== VISUALIZER PROMO ===== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-dark rounded-2xl overflow-hidden relative min-h-[360px] flex items-center">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1594938298603-c8148c4b4571?w=1200&q=80')] bg-cover bg-center opacity-20" />
            <div className="relative z-10 p-10 md:p-14 max-w-xl">
              <div className="inline-block bg-gold/20 border border-gold/40 text-gold text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
                🆕 Exclusive — Only on GoFabrikos
              </div>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                See Your Saree Before You Buy —<br/><span className="text-gold">Ladies Fabric Visualizer</span>
              </h2>
              <p className="text-gray-300 mb-7 leading-relaxed">
                India&apos;s first Ladies Fabric Frame Visualizer. Choose your saree fabric + blouse fabric and see the exact combination on a mannequin frame.
              </p>
              <div className="space-y-2.5 mb-8">
                {['Choose your Saree fabric from 2,400+ designs','Choose your Blouse fabric to match','See the combination on a real mannequin frame','Add both to cart or share via WhatsApp'].map((step, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-200 text-sm">
                    <span className="w-6 h-6 bg-gold text-dark rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i+1}</span>
                    {step}
                  </div>
                ))}
              </div>
              <Link href="/visualizer" className="btn-gold !text-base !px-8 !py-3.5">👗 Try Fabric Visualizer Free →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="py-14 bg-dark text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block bg-white/10 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">Stay in the Loop</div>
          <h2 className="font-playfair text-3xl font-bold text-white mb-3">New Fabrics Every Week</h2>
          <p className="text-gray-400 mb-7">Get early access to new arrivals, exclusive discounts, and fabric tips.</p>
          <NewsletterForm />
        </div>
      </section>

      {/* ===== WHATSAPP COMMUNITY ===== */}
      <section className="py-14 bg-[#111b21]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block bg-green-900/40 text-green-400 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">💬 WhatsApp Community</div>
          <h2 className="font-playfair text-3xl font-bold text-white mb-3">Join the GoFabrikos Family</h2>
          <p className="text-gray-400 mb-10">New arrivals, exclusive deals &amp; fabric tips — directly on WhatsApp.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-7 flex flex-col items-center">
              <span className="text-3xl mb-3">📢</span>
              <h3 className="text-white font-bold text-lg mb-1">WhatsApp Channel</h3>
              <p className="text-gray-400 text-sm mb-5 text-center">Follow for new arrivals, offers &amp; fabric updates.</p>
              <div className="bg-white rounded-xl p-3 mb-4 shadow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=https://whatsapp.com/channel/0029VbDYKmD17Emu8TsBqI02" alt="WhatsApp Channel QR" width={130} height={130} />
              </div>
              <p className="text-gray-500 text-xs mb-4">Scan with camera to follow</p>
              <a href="https://whatsapp.com/channel/0029VbDYKmD17Emu8TsBqI02" target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
                📲 Follow Channel
              </a>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-7 flex flex-col items-center">
              <span className="text-3xl mb-3">👥</span>
              <h3 className="text-white font-bold text-lg mb-1">WhatsApp Group</h3>
              <p className="text-gray-400 text-sm mb-5 text-center">Join our community — ask questions, share fabric ideas.</p>
              <div className="bg-white rounded-xl p-3 mb-4 shadow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=https://chat.whatsapp.com/CxXx1iCbp1FDcQT3XhJbwY" alt="WhatsApp Group QR" width={130} height={130} />
              </div>
              <p className="text-gray-500 text-xs mb-4">Scan with camera to join</p>
              <a href="https://chat.whatsapp.com/CxXx1iCbp1FDcQT3XhJbwY" target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
                👥 Join Group
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
