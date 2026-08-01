'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Building2, Check, Phone, Mail, FileText, ChevronDown, ChevronUp, Star } from 'lucide-react'

const TIERS = [
  {
    name: 'Retail',
    min: '1 m',
    max: '49 m',
    discount: '0%',
    perks: ['Standard pricing', 'GST invoice', 'Free swatch on 1st order'],
    highlight: false,
    color: 'border-stone-200',
  },
  {
    name: 'Silver',
    min: '50 m',
    max: '199 m',
    discount: '8% off',
    perks: ['8% bulk discount', 'Priority dispatch', 'Dedicated WhatsApp support', 'GST invoice'],
    highlight: false,
    color: 'border-stone-300',
  },
  {
    name: 'Gold',
    min: '200 m',
    max: '499 m',
    discount: '15% off',
    perks: ['15% bulk discount', 'Same-day dispatch', 'Account manager', 'Credit terms (15 days)', 'GST invoice'],
    highlight: true,
    color: 'border-rose-500',
  },
  {
    name: 'Platinum',
    min: '500 m',
    max: 'unlimited',
    discount: '22% off',
    perks: ['22% bulk discount', 'Custom cutting', 'Exclusive new arrivals access', 'Credit terms (30 days)', 'Free delivery pan-India', 'GST invoice'],
    highlight: false,
    color: 'border-stone-700',
  },
]

const FAQS = [
  { q: 'What is the minimum order for B2B?', a: 'Minimum 50 metres per fabric for B2B pricing. Mix-and-match across fabrics is allowed.' },
  { q: 'Do you provide GST invoices?', a: 'Yes, GST invoice is mandatory on all orders — B2B and retail both. GSTIN can be updated in your account.' },
  { q: 'What are the payment terms?', a: 'Silver tier is advance payment. Gold gets 15-day credit. Platinum gets 30-day credit after 3 successful orders.' },
  { q: 'Can we order fabric samples?', a: 'Yes, swatches of 10×10 cm are available at ₹10/swatch (adjusted against order). First swatch is free.' },
  { q: 'Do you ship pan-India?', a: 'Yes. Platinum tier gets free delivery. Others pay actuals via DTDC/Blue Dart. Export enquiries welcome.' },
]

const TESTIMONIALS = [
  { name: 'Priya Boutique, Chennai',    text: 'Gold tier for 2 years. Quality is consistent, dispatch is fast. GST invoices make accounting easy.', rating: 5 },
  { name: 'Shree Textiles, Surat',      text: 'Platinum partner. Dedicated account manager and 30-day credit — exactly what a growing business needs.', rating: 5 },
  { name: 'Meena Silk House, Coimbatore', text: 'Started at Silver, now Gold. The bulk discounts significantly improve our margin.', rating: 4 },
]

export default function WholesalePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [submitted, setSubmit] = useState(false)
  const [form, setForm] = useState({ business: '', gstin: '', name: '', mobile: '', email: '', volume: '', city: '', message: '' })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmit(true)
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-rose-800 tracking-wide">
            Go<span className="text-stone-400 font-light">Fabrikos</span>
          </Link>
          <div className="flex items-center gap-4 text-sm text-stone-600">
            <Link href="/fabrics" className="hover:text-rose-700">Shop</Link>
            <a href="tel:+919581734837" className="flex items-center gap-1.5 px-4 py-1.5 bg-rose-800 text-white rounded-full hover:bg-rose-900">
              <Phone size={13} /> Call Us
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-stone-900 text-white py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-rose-800 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
            <Building2 size={13} /> B2B / WHOLESALE
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
            Scale Your Fabric Business<br />with GoFabrikos
          </h1>
          <p className="text-stone-300 text-lg mb-8 max-w-xl mx-auto">
            Boutiques, designers, and retailers trust us for consistent quality, GST invoicing, and bulk discounts up to 22%.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-stone-300">
            <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-400" /> GST Invoice on every order</span>
            <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-400" /> Credit terms available</span>
            <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-400" /> Pan-India delivery</span>
            <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-400" /> Dedicated account manager</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">

        {/* Pricing tiers */}
        <section>
          <h2 className="text-2xl font-bold text-stone-800 text-center mb-2">Wholesale Pricing Tiers</h2>
          <p className="text-stone-500 text-center mb-8">Discount applies per fabric type per order</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TIERS.map(tier => (
              <div key={tier.name} className={`bg-white rounded-2xl border-2 p-6 relative ${tier.color} ${tier.highlight ? 'shadow-lg' : ''}`}>
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rose-700 text-white text-xs font-bold px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <p className="font-bold text-stone-800 text-lg">{tier.name}</p>
                <p className="text-xs text-stone-500 mb-3">{tier.min} – {tier.max}</p>
                <p className="text-3xl font-bold text-rose-700 mb-4">{tier.discount}</p>
                <ul className="space-y-2">
                  {tier.perks.map(p => (
                    <li key={p} className="flex items-start gap-2 text-sm text-stone-600">
                      <Check size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section>
          <h2 className="text-2xl font-bold text-stone-800 text-center mb-8">Trusted by Businesses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-white rounded-2xl border border-stone-200 p-5">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-stone-600 italic mb-3">&ldquo;{t.text}&rdquo;</p>
                <p className="text-xs font-semibold text-stone-800">{t.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-stone-800 text-center mb-8">Frequently Asked Questions</h2>
          <div className="max-w-2xl mx-auto space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold text-stone-800 hover:bg-stone-50"
                >
                  {faq.q}
                  {openFaq === i ? <ChevronUp size={16} className="text-rose-600" /> : <ChevronDown size={16} className="text-stone-400" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-stone-600 border-t border-stone-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Inquiry form */}
        <section>
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-stone-200 p-8">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={28} className="text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-2">Inquiry Received!</h3>
                <p className="text-stone-500 text-sm">Our B2B team will contact you within 24 hours.</p>
                <p className="text-stone-400 text-xs mt-1">WhatsApp: +91 95817 34837</p>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-stone-800 mb-1 flex items-center gap-2">
                  <FileText size={20} className="text-rose-700" /> B2B Inquiry Form
                </h2>
                <p className="text-sm text-stone-500 mb-6">Fill in your details — our team will call you within 24 hours</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-stone-500 mb-1">Business / Shop Name *</label>
                      <input required value={form.business} onChange={e => setForm(f => ({ ...f, business: e.target.value }))}
                        className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-500 mb-1">Contact Name *</label>
                      <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-500 mb-1">Mobile *</label>
                      <input required value={form.mobile} onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))}
                        className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-500 mb-1">Email</label>
                      <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-500 mb-1">GSTIN</label>
                      <input value={form.gstin} onChange={e => setForm(f => ({ ...f, gstin: e.target.value }))}
                        className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-500 mb-1">City</label>
                      <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                        className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-500 mb-1">Monthly Volume (metres)</label>
                      <select value={form.volume} onChange={e => setForm(f => ({ ...f, volume: e.target.value }))}
                        className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400">
                        <option value="">Select range</option>
                        <option>50–200 m</option><option>200–500 m</option><option>500–1000 m</option><option>1000 m+</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-stone-500 mb-1">Message / Fabric Requirements</label>
                      <textarea rows={3} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        placeholder="Tell us about your business and what fabrics you need…"
                        className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 resize-none" />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-3.5 bg-rose-800 text-white rounded-xl font-bold hover:bg-rose-900 transition-colors">
                    Submit Inquiry
                  </button>
                </form>
                <div className="mt-5 flex items-center justify-center gap-6 text-sm text-stone-500">
                  <a href="tel:+919581734837" className="flex items-center gap-1.5 hover:text-rose-700"><Phone size={14} /> +91 95817 34837</a>
                  <a href="mailto:care@gofabrikos.com" className="flex items-center gap-1.5 hover:text-rose-700"><Mail size={14} /> care@gofabrikos.com</a>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
