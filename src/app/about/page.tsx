'use client'
import Link from 'next/link'
import { MessageCircle, MapPin, Phone, Mail, Clock, Shield, Award, Users, Heart, ChevronRight, Star, Truck, RotateCcw } from 'lucide-react'

const stats = [
  { number: '5,000+', label: 'Happy Customers' },
  { number: '200+', label: 'Fabric Varieties' },
  { number: '15+', label: 'Weaver Clusters' },
  { number: '4.8★', label: 'Average Rating' },
]

const values = [
  {
    icon: <Shield size={28} className="text-white" />,
    title: 'Authenticity First',
    desc: 'Every fabric is sourced directly from certified weaver clusters. No middlemen. No compromise on quality.',
    bg: '#C8102E',
  },
  {
    icon: <Heart size={28} className="text-white" />,
    title: 'Supporting Artisans',
    desc: 'We work directly with master weavers across India — from Chanderi to Kanjivaram — ensuring fair wages and ethical sourcing.',
    bg: '#D4AF37',
  },
  {
    icon: <Award size={28} className="text-white" />,
    title: 'Quality Assured',
    desc: 'Every meter is quality-checked before dispatch. GST invoice provided on every order for full transparency.',
    bg: '#1A1A2E',
  },
  {
    icon: <Users size={28} className="text-white" />,
    title: 'Customer First',
    desc: 'From free swatches to 7-day returns, we make your fabric shopping experience completely risk-free.',
    bg: '#2d6a4f',
  },
]

const team = [
  {
    name: 'GoFabrikos Team',
    role: 'Fabric Experts & Customer Support',
    desc: 'Our team of fabric experts handpick every variety and are available on WhatsApp to help you choose the perfect fabric.',
    img: 'https://images.unsplash.com/photo-1607748851687-ba9a10438621?w=300&q=80',
  },
  {
    name: 'Master Weavers',
    role: 'Artisan Partners Across India',
    desc: 'We partner with skilled artisans from Chanderi, Varanasi, Kanchipuram, Surat, Jaipur, and 10+ other weaving hubs.',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80',
  },
]

const fabricOrigins = [
  { city: 'Chanderi', state: 'Madhya Pradesh', fabric: 'Chanderi Silk & Cotton' },
  { city: 'Varanasi', state: 'Uttar Pradesh', fabric: 'Banarasi Silk & Brocade' },
  { city: 'Kanchipuram', state: 'Tamil Nadu', fabric: 'Kanjivaram Pure Silk' },
  { city: 'Surat', state: 'Gujarat', fabric: 'Georgette & Crepe' },
  { city: 'Jaipur', state: 'Rajasthan', fabric: 'Block Print & Bandhani' },
  { city: 'Patan', state: 'Gujarat', fabric: 'Patola Double Ikat' },
  { city: 'Sambalpur', state: 'Odisha', fabric: 'Sambalpuri Ikat' },
  { city: 'Srinagar', state: 'Kashmir', fabric: 'Pashmina & Kani Shawls' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
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
              <Link href="/about" className="text-red-700 text-sm font-medium border-b-2 border-red-700 pb-1">About</Link>
            </nav>
            <Link href="/cart" className="p-2 rounded-full hover:bg-red-50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </Link>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-red-700">Home</Link>
            <ChevronRight size={14} />
            <span className="text-gray-800 font-medium">About Us</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20" style={{ background: 'linear-gradient(145deg, #1A1A2E 0%, #2d1a3e 60%, #1A1A2E 100%)' }}>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full" style={{ background: 'radial-gradient(circle, #D4AF37, transparent)' }} />
          <div className="absolute bottom-10 right-10 w-56 h-56 rounded-full" style={{ background: 'radial-gradient(circle, #C8102E, transparent)' }} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6"
            style={{ background: 'rgba(212,175,55,0.2)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}>
            Our Story
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
            From Weaver Clusters<br />
            <span style={{ color: '#D4AF37' }}>To Your Doorstep</span>
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
            GoFabrikos is Guntur's premier fabric ecommerce store — connecting India's finest fabric artisans directly with customers who value authenticity, quality, and craftsmanship.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black mb-1" style={{ color: '#C8102E' }}>{stat.number}</div>
                <div className="text-gray-500 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white mb-4 inline-block"
                style={{ background: '#D4AF37' }}>
                Who We Are
              </span>
              <h2 className="text-3xl font-black mt-3 mb-5" style={{ color: '#1A1A2E' }}>
                GoFabrikos —<br />Bringing India's Textile Heritage Online
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded with a passion for India's rich textile traditions, GoFabrikos has been serving fabric lovers across the country. We believe that every piece of fabric tells a story — of the artisan who wove it, the tradition it carries, and the garment it will become.
                </p>
                <p>
                  GoFabrikos is our digital platform that makes it effortless for anyone — from home tailors and boutique designers to fashion enthusiasts — to access premium Indian fabrics at fair prices, with complete transparency.
                </p>
                <p>
                  We source directly from weaver clusters across 15+ states, ensuring that artisans receive fair compensation while our customers receive authentic, certified fabrics.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="text-2xl font-black" style={{ color: '#C8102E' }}>2020</div>
                  <div className="text-sm text-gray-500 font-medium">Year Founded</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="text-2xl font-black" style={{ color: '#C8102E' }}>Guntur</div>
                  <div className="text-sm text-gray-500 font-medium">Headquarters</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl aspect-square">
                <img
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80"
                  alt="Indian fabric weaving"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #C8102E, #D4AF37)' }}>
                    <Star size={16} className="text-white fill-white" />
                  </div>
                  <div>
                    <div className="font-bold text-sm" style={{ color: '#1A1A2E' }}>4.8 / 5.0</div>
                    <div className="text-xs text-gray-400">Avg customer rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white inline-block mb-3"
              style={{ background: '#C8102E' }}>Our Values</span>
            <h2 className="text-3xl font-black" style={{ color: '#1A1A2E' }}>What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(v => (
              <div key={v.title} className="rounded-2xl p-6 hover:shadow-md transition-shadow border border-gray-100">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: v.bg }}>
                  {v.icon}
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where We Source From */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white inline-block mb-3"
              style={{ background: '#D4AF37' }}>Our Sourcing</span>
            <h2 className="text-3xl font-black" style={{ color: '#1A1A2E' }}>Fabric Origins Across India</h2>
            <p className="text-gray-500 mt-2">Directly sourced from 15+ weaving clusters across the country</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {fabricOrigins.map(origin => (
              <div key={origin.city} className="bg-white rounded-xl p-4 border border-gray-100 hover:border-red-200 hover:shadow-sm transition-all">
                <div className="flex items-start space-x-3">
                  <MapPin size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-sm text-gray-800">{origin.city}</div>
                    <div className="text-xs text-gray-400">{origin.state}</div>
                    <div className="text-xs font-medium mt-1" style={{ color: '#C8102E' }}>{origin.fabric}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black" style={{ color: '#1A1A2E' }}>Why Customers Choose GoFabrikos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Truck size={24} className="text-blue-600" />, title: 'Free Shipping', desc: 'On all orders above ₹999. Fast dispatch within 24-48 hours.' },
              { icon: <Shield size={24} className="text-green-600" />, title: 'GST Invoice', desc: 'Proper GST invoice on every order. Perfect for boutiques and designers.' },
              { icon: <RotateCcw size={24} className="text-purple-600" />, title: '7-Day Returns', desc: "Not satisfied? Return within 7 days, no questions asked." },
              { icon: <Star size={24} className="text-yellow-500 fill-yellow-400" />, title: 'Free Swatch', desc: 'Order a free swatch before buying. Touch and feel the fabric first.' },
              { icon: <MessageCircle size={24} className="text-green-500" />, title: 'WhatsApp Support', desc: 'Real humans on WhatsApp, Mon–Sat 8AM to 9PM. Instant responses.' },
              { icon: <Award size={24} className="text-red-600" />, title: 'Certified Authentic', desc: 'Every fabric is verified for authenticity. No imitations, ever.' },
            ].map(item => (
              <div key={item.title} className="flex items-start space-x-4 p-5 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Legal */}
      <section className="py-16" style={{ background: 'linear-gradient(145deg, #1A1A2E, #2d1a3e)' }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact */}
            <div>
              <h2 className="text-2xl font-black text-white mb-6">Get In Touch</h2>
              <div className="space-y-4">
                {[
                  { icon: <Phone size={18} className="text-green-400" />, label: 'WhatsApp / Phone', value: '+91 95817 34837', href: 'https://wa.me/919581734837' },
                  { icon: <Mail size={18} className="text-blue-400" />, label: 'Email', value: 'care@gofabrikos.com', href: 'mailto:care@gofabrikos.com' },
                  { icon: <MapPin size={18} className="text-red-400" />, label: 'Location', value: 'Guntur, Andhra Pradesh, India', href: '#' },
                  { icon: <Clock size={18} className="text-yellow-400" />, label: 'Business Hours', value: 'Mon–Sat: 8 AM – 9 PM IST', href: '#' },
                ].map(contact => (
                  <a key={contact.label} href={contact.href} target={contact.href.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer"
                    className="flex items-start space-x-3 group">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                      {contact.icon}
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">{contact.label}</p>
                      <p className="text-white font-semibold text-sm group-hover:text-yellow-300 transition-colors">{contact.value}</p>
                    </div>
                  </a>
                ))}
              </div>

              <a
                href="https://wa.me/919581734837?text=Hi! I have a question about GoFabrikos fabrics."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-white hover:opacity-90 transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
              >
                <MessageCircle size={20} />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Legal / GST Info */}
            <div>
              <h2 className="text-2xl font-black text-white mb-6">Company Details</h2>
              <div className="bg-white/10 rounded-2xl p-6 border border-white/10 space-y-4">
                {[
                  { label: 'Business Name', value: 'GoFabrikos' },
                  { label: 'Proprietor', value: 'Lakshmi Sowjanya Aaki' },
                  { label: 'Website', value: 'gofabrikos.com' },
                  { label: 'Registered Office', value: '3rd Floor, Shop No. 346, Sri Vasavi WCS, Mangalagiri Road, Guntur – 522001, AP' },
                  { label: 'GST Status', value: 'GST Registered • GSTIN prefix 37 (Andhra Pradesh)' },
                  { label: 'Business Type', value: 'B2C & B2B Fabric Ecommerce' },
                  { label: 'Payment Modes', value: 'UPI, Cards, NetBanking, EMI, COD' },
                ].map(detail => (
                  <div key={detail.label} className="flex justify-between items-start gap-4 border-b border-white/10 pb-3 last:border-0 last:pb-0">
                    <span className="text-gray-400 text-sm flex-shrink-0">{detail.label}</span>
                    <span className="text-white text-sm font-medium text-right">{detail.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-white border-t">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-black mb-3" style={{ color: '#1A1A2E' }}>Ready to explore premium Indian fabrics?</h2>
          <p className="text-gray-500 mb-6">Browse 200+ fabric varieties — Chanderi, Banarasi, Kanjivaram, Khadi, and more.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/fabrics"
              className="px-8 py-3 rounded-xl font-bold text-white hover:opacity-90 transition-all hover:scale-105 hover:shadow-lg"
              style={{ background: 'linear-gradient(135deg, #C8102E, #D4AF37)' }}
            >
              Browse All Fabrics
            </Link>
            <a
              href="https://wa.me/919581734837"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-xl font-bold border-2 border-gray-200 text-gray-700 hover:border-green-400 hover:text-green-600 transition-all flex items-center justify-center space-x-2"
            >
              <MessageCircle size={16} />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
          <p className="font-semibold text-gray-600 mb-1">GoFabrikos | Prop: Lakshmi Sowjanya Aaki</p>
          <p>Premium Indian Fabrics • WhatsApp: +91 95817 34837 • Guntur, Andhra Pradesh</p>
        </div>
      </footer>
    </div>
  )
}
