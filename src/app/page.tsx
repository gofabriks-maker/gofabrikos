import Link from 'next/link'
import RecentlyViewed from '@/components/RecentlyViewed'
import NewsletterForm from '@/components/NewsletterForm'

const categories = [
  { name: 'Lehenga Fabrics',   count: '220+', href: '/fabrics?category=lehenga',  img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80' },
  { name: 'Blouse Fabrics',    count: '180+', href: '/fabrics?category=blouse',   img: 'https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=600&q=80' },
  { name: 'Kurti Fabrics',     count: '160+', href: '/fabrics?category=kurti',    img: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4571?w=600&q=80' },
  { name: 'Plain Fabrics',     count: '290+', href: '/fabrics?category=plain',    img: 'https://images.unsplash.com/photo-1553827669-9d2e67e1e3a3?w=600&q=80' },
  { name: 'Dupattas',          count: '130+', href: '/fabrics?category=dupatta',  img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80' },
  { name: 'Designer Sarees',   count: '340+', href: '/fabrics?category=saree',    img: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80' },
]

const featured = [
  { name: 'Mull Chanderi Digital Print',  category: 'Chanderi',  price: 125, mrp: 150,  rating: 4.9, reviews: 342, views: '8.3K', img: 'https://images.unsplash.com/photo-1553827669-9d2e67e1e3a3?w=500&q=80',  badge: '17% OFF',    slug: 'mull-chanderi-digital-print' },
  { name: 'Premium Georgette Floral',     category: 'Georgette', price: 185, mrp: 210,  rating: 4.7, reviews: 127, views: '5.1K', img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80', badge: 'NEW',        slug: 'premium-georgette-floral' },
  { name: 'Handblock Kalamkari Cotton',   category: 'Cotton',    price: 220, mrp: null, rating: 4.9, reviews: 89,  views: '3.7K', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80',  badge: 'BESTSELLER', slug: 'kalamkari-cotton' },
  { name: 'Banarasi Silk Brocade',        category: 'Banarasi',  price: 480, mrp: 615,  rating: 5.0, reviews: 214, views: '12K',  img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&q=80', badge: '22% OFF',    slug: 'banarasi-silk-brocade' },
]

const stats = [
  { num: '2,400+', label: 'Fabric Designs' },
  { num: '18,000+', label: 'Happy Customers' },
  { num: '500+', label: 'Cities Served' },
  { num: '4.8★', label: 'Google Rating' },
]

const trustItems = [
  { icon: '📦', title: 'Free Shipping',      sub: 'On orders above ₹999' },
  { icon: '📄', title: 'GST Invoice',        sub: 'Auto-generated PDF' },
  { icon: '👗', title: 'Fabric Visualizer',  sub: 'See before you buy' },
  { icon: '🏭', title: 'B2B Wholesale',      sub: 'Bulk pricing available' },
  { icon: '💬', title: 'WhatsApp Support',   sub: '8 AM – 9 PM daily' },
]

const firstOrderOffers = [
  { name: 'Mull Chanderi', price: '₹99/m', originalPrice: '₹125/m', img: 'https://images.unsplash.com/photo-1553827669-9d2e67e1e3a3?w=300&q=80' },
  { name: 'Georgette',     price: '₹149/m', originalPrice: '₹185/m', img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&q=80' },
  { name: 'Kalamkari',     price: '₹179/m', originalPrice: '₹220/m', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80' },
  { name: 'Banarasi',      price: '₹399/m', originalPrice: '₹480/m', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=300&q=80' },
  { name: 'Pure Cotton',   price: '₹75/m',  originalPrice: '₹95/m',  img: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300&q=80' },
  { name: 'Velvet Blouse', price: '₹229/m', originalPrice: '₹280/m', img: 'https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=300&q=80' },
]

export default function HomePage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative min-h-[560px] bg-dark flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="max-w-2xl">
            <div className="inline-block bg-gold/30 border border-gold/60 text-gold text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-widest">
              ✨ India's Premier Fabric Store
            </div>
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
              Dress Her in<br/>
              <span className="text-gold">India's Finest Fabrics</span>
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-lg">
              From Chanderi silks to digital prints — shop premium fabrics priced per meter. GST invoice on every order.
            </p>
            <div className="flex flex-wrap gap-4 mb-12">
              <Link href="/fabrics" className="btn-primary text-base !px-7 !py-3.5">
                🛍️ Shop All Fabrics
              </Link>
              <Link href="/visualizer" className="btn-gold text-base !px-7 !py-3.5">
                👗 Try Fabric Visualizer
              </Link>
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
                <div className="w-9 h-9 bg-red-50 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">{item.title}</div>
                  <div className="text-xs text-gray-500">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== CATEGORIES ===== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block bg-red-50 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3">Shop by Category</div>
            <h2 className="section-title mb-3">Fabrics for Every Occasion</h2>
            <p className="text-gray-500 max-w-md mx-auto">From festive silks to everyday cotton — find the perfect fabric for every outfit.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link key={cat.name} href={cat.href} className="group relative rounded-xl overflow-hidden aspect-[3/4] shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute top-2.5 right-2.5 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">{cat.count}</span>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-8">
                  <h3 className="font-playfair text-white font-semibold text-sm">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block bg-red-50 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3">Our Collection</div>
            <h2 className="section-title mb-3">Trending This Season</h2>
            <p className="text-gray-500">Fabrics our customers love most — handpicked for quality and style.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {featured.map((p) => (
              <div key={p.slug} className="card group relative">
                <div className="relative aspect-[3/4] overflow-hidden rounded-t-xl">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute top-2.5 left-2.5 bg-primary text-white text-xs font-bold px-2 py-0.5 rounded">{p.badge}</span>
                  <button className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-sm hover:bg-white hover:scale-110 transition-all">🤍</button>
                </div>
                <div className="p-3">
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">{p.category}</div>
                  <Link href={`/fabrics/${p.slug}`} className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2 hover:text-primary transition-colors block mb-2">
                    {p.name}
                  </Link>
                  <div className="flex items-baseline gap-1.5 mb-1.5">
                    <span className="text-base font-bold text-primary">₹{p.price}</span>
                    {p.mrp && <span className="text-xs text-gray-400 line-through">₹{p.mrp}</span>}
                    <span className="text-xs text-gray-400">/m</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mb-3">
                    <span className="text-amber-500">{'★'.repeat(Math.floor(p.rating))} <span className="text-gray-400">({p.reviews})</span></span>
                    <span>👁 {p.views}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-primary text-white text-xs font-semibold py-2 rounded-lg hover:bg-primary-dark transition-colors">
                      🛒 Add to Cart
                    </button>
                    <a
                      href={`https://wa.me/918298308314?text=Hi%2C%20I%20want%20to%20order%20${encodeURIComponent(p.name)}`}
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
          <div className="text-center mt-10">
            <Link href="/fabrics" className="btn-primary !text-base !px-8 !py-3.5">
              View All 2,400+ Fabrics →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== VISUALIZER PROMO ===== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-dark rounded-2xl overflow-hidden relative min-h-[360px] flex items-center">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1594938298603-c8148c4b4571?w=1200&q=80')] bg-cover bg-center opacity-20" />
            <div className="relative z-10 p-10 md:p-14 max-w-xl">
              <div className="inline-block bg-gold/20 border border-gold/40 text-gold text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
                🆕 Exclusive — Only on GoFabrikos
              </div>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                Visualize Your Fabric<br/>Before You Buy —<br/>
                <span className="text-gold">Ladies Fabric Visualizer</span>
              </h2>
              <p className="text-gray-300 mb-7 leading-relaxed">
                India's first Ladies Fabric Frame Visualizer. Choose your fabric and see the exact look on a mannequin — before placing your order.
              </p>
              <div className="space-y-2.5 mb-8">
                {[
                  'Choose your fabric from 2,400+ designs',
                  'Select garment type — Saree, Lehenga, Kurti',
                  'See the look on a real mannequin frame',
                  'Order directly or share via WhatsApp'
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-200 text-sm">
                    <span className="w-6 h-6 bg-gold text-dark rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i+1}</span>
                    {step}
                  </div>
                ))}
              </div>
              <Link href="/visualizer" className="btn-gold !text-base !px-8 !py-3.5">
                👗 Try Fabric Visualizer Free →
              </Link>
            </div>
            <div className="hidden md:flex absolute right-10 top-1/2 -translate-y-1/2 flex-col items-center justify-center bg-white/5 border border-white/10 rounded-2xl p-6 w-56 gap-4">
              <div className="text-gold text-sm font-bold uppercase tracking-widest mb-1">Live Preview</div>
              <img src="https://images.unsplash.com/photo-1594938298603-c8148c4b4571?w=300&q=80" alt="Fabric Preview" className="w-full h-40 object-cover rounded-xl opacity-80" />
              <p className="text-gray-400 text-xs text-center">Select any fabric to see how it looks on a mannequin</p>
              <Link href="/visualizer" className="text-gold text-xs font-semibold underline">Open Visualizer →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FIRST ORDER SPECIAL OFFER ===== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 md:p-12 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-block bg-red-100 text-primary text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">🎁 First Order Special</div>
              <h2 className="section-title mb-4">Exclusive First Buy Prices</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                New to GoFabrikos? Enjoy special introductory prices on selected premium fabrics for your first order. Limited stock — order now!
              </p>
              <div className="flex gap-6 mb-8">
                {[
                  {icon:'🎯', title:'Select', sub:'Choose from offers'},
                  {icon:'💸', title:'Save', sub:'Special intro price'},
                  {icon:'🚀', title:'Delivered', sub:'Fast shipping'}
                ].map((step, i) => (
                  <div key={i} className="text-center flex-1">
                    <div className="text-2xl mb-1.5">{step.icon}</div>
                    <div className="text-sm font-semibold text-gray-800">{step.title}</div>
                    <div className="text-xs text-gray-500">{step.sub}</div>
                  </div>
                ))}
              </div>
              <Link href="/fabrics" className="btn-primary !text-base">🛍️ Shop First Order Offers</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {firstOrderOffers.map((item) => (
                <div key={item.name} className="rounded-lg overflow-hidden shadow-sm hover:scale-105 transition-transform cursor-pointer">
                  <img src={item.img} alt={item.name} className="w-full h-24 object-cover" />
                  <div className="bg-white p-2">
                    <p className="text-xs font-semibold text-gray-700 truncate">{item.name}</p>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-primary font-bold">{item.price}</span>
                      <span className="text-xs text-gray-400 line-through">{item.originalPrice}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== RECENTLY VIEWED ===== */}
      <RecentlyViewed />

      {/* ===== NEWSLETTER + WHATSAPP ===== */}
      <section className="py-14 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <div className="inline-block bg-white/10 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">Stay in the Loop</div>
              <h2 className="font-playfair text-3xl font-bold text-white mb-3">New Fabrics Every Week</h2>
              <p className="text-gray-400 mb-7">Get early access to new arrivals, exclusive discounts, and fabric tips.</p>
              <NewsletterForm />
            </div>
            <div className="flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-3">💬</div>
              <h3 className="font-playfair text-xl font-bold text-white mb-2">Join Our WhatsApp Channel</h3>
              <p className="text-gray-400 text-sm mb-5">Daily fabric updates, new arrivals, and exclusive deals — right on your WhatsApp.</p>
              <a
                href="https://wa.me/918298308314?text=Hi! I want to join the GoFabrikos WhatsApp channel for updates."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                <span>📲</span> Join on WhatsApp
              </a>
              <p className="text-gray-600 text-xs mt-4">+91 82983 08314 · 8 AM – 9 PM daily</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
