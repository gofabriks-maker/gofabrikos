'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, Check, Instagram, Facebook } from 'lucide-react'

const CONTACT_ITEMS = [
  {
    icon: <MessageCircle size={22} className="text-green-500" />,
    label: 'WhatsApp',
    value: '+91 95817 34837',
    sub: 'Fastest response — usually within minutes',
    href: 'https://wa.me/919581734837?text=Hi%20GoFabrikos%2C%20I%20need%20help.',
    bg: 'bg-green-50 border-green-200',
  },
  {
    icon: <Phone size={22} className="text-blue-500" />,
    label: 'Phone',
    value: '+91 95817 34837',
    sub: 'Mon–Sat: 8 AM – 9 PM IST',
    href: 'tel:+919581734837',
    bg: 'bg-blue-50 border-blue-200',
  },
  {
    icon: <Mail size={22} className="text-rose-500" />,
    label: 'Email',
    value: 'care@gofabrikos.com',
    sub: 'We reply within 24 hours',
    href: 'mailto:care@gofabrikos.com',
    bg: 'bg-rose-50 border-rose-200',
  },
  {
    icon: <MapPin size={22} className="text-amber-500" />,
    label: 'Store Address',
    value: 'Shop No. 346, Sri Vasavi WCS',
    sub: '3rd Floor, Mangalagiri Road, Guntur – 522001, AP',
    href: 'https://maps.google.com/?q=Guntur+Andhra+Pradesh',
    bg: 'bg-amber-50 border-amber-200',
  },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', mobile: '', email: '', subject: '', message: '' })
  const [submitted, setSubmit] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSubmit(true)
      } else {
        alert('Failed to send message. Please try WhatsApp instead.')
      }
    } catch {
      alert('Network error. Please try WhatsApp instead.')
    } finally {
      setLoading(false)
    }
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
            <Link href="/faq" className="hover:text-rose-700">FAQ</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-stone-900 text-white py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
        <p className="text-stone-300 max-w-md mx-auto">
          Questions about fabrics, orders, or wholesale? We're happy to help.
        </p>
        <div className="flex items-center justify-center gap-2 mt-3 text-stone-400 text-sm">
          <Clock size={14} /> <span>Mon–Sat: 8 AM – 9 PM IST</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Left — contact cards + social */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-stone-800 mb-5">Reach Us</h2>

            {CONTACT_ITEMS.map(item => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className={`flex items-start gap-4 p-4 rounded-2xl border ${item.bg} hover:shadow-sm transition-all group`}
              >
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-0.5">{item.label}</p>
                  <p className="font-semibold text-stone-800 group-hover:text-rose-700 transition-colors">{item.value}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{item.sub}</p>
                </div>
              </a>
            ))}

            {/* Business hours */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 mt-6">
              <h3 className="font-bold text-stone-800 mb-3 flex items-center gap-2">
                <Clock size={16} className="text-rose-600" /> Business Hours
              </h3>
              <div className="space-y-2 text-sm">
                {[
                  { day: 'Monday – Saturday', time: '8:00 AM – 9:00 PM', open: true },
                  { day: 'Sunday',             time: '10:00 AM – 6:00 PM', open: true },
                  { day: 'Public Holidays',    time: 'Closed', open: false },
                ].map(row => (
                  <div key={row.day} className="flex justify-between items-center py-1.5 border-b border-stone-100 last:border-0">
                    <span className="text-stone-600">{row.day}</span>
                    <span className={`font-medium ${row.open ? 'text-emerald-600' : 'text-red-500'}`}>{row.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5">
              <h3 className="font-bold text-stone-800 mb-3">Follow Us</h3>
              <div className="flex gap-3">
                <a href="#" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
                  <Facebook size={15} /> Facebook
                </a>
                <a href="#" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl text-sm font-medium hover:opacity-90">
                  <Instagram size={15} /> Instagram
                </a>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 lg:p-8 h-fit">
            {submitted ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={28} className="text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-2">Message Sent!</h3>
                <p className="text-stone-500 text-sm mb-1">We've received your message and will reply within 24 hours.</p>
                <p className="text-stone-400 text-xs mb-6">For faster help, WhatsApp us at +91 95817 34837</p>
                <button
                  onClick={() => { setSubmit(false); setForm({ name: '', mobile: '', email: '', subject: '', message: '' }) }}
                  className="px-6 py-2.5 border border-stone-200 text-stone-600 rounded-xl text-sm hover:bg-stone-50"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-bold text-stone-800 mb-1">Send a Message</h2>
                <p className="text-sm text-stone-500 mb-6">We read every message and reply personally.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-500 mb-1">Full Name *</label>
                      <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Your name"
                        className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-500 mb-1">Mobile *</label>
                      <input required value={form.mobile} onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))}
                        placeholder="+91 ..."
                        className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 mb-1">Email</label>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="your@email.com"
                      className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 mb-1">Subject *</label>
                    <select required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 bg-white">
                      <option value="">Select topic</option>
                      <option>Order enquiry</option>
                      <option>Fabric question</option>
                      <option>Wholesale / B2B</option>
                      <option>Swatch request</option>
                      <option>Return / refund</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 mb-1">Message *</label>
                    <textarea required rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Tell us how we can help…"
                      className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 resize-none" />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-rose-800 text-white rounded-xl font-bold hover:bg-rose-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? (
                      <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending…</>
                    ) : (
                      <><Send size={16} /> Send Message</>
                    )}
                  </button>
                  <p className="text-xs text-stone-400 text-center">
                    Or WhatsApp us directly for instant help →{' '}
                    <a href="https://wa.me/919581734837" className="text-rose-600 hover:underline">+91 95817 34837</a>
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t bg-white mt-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p className="font-semibold text-gray-600 mb-1">GoFabrikos | Prop: Lakshmi Sowjanya Aaki</p>
          <p>3rd Floor, Shop No. 346, Sri Vasavi WCS, Mangalagiri Road, Guntur – 522001, AP</p>
        </div>
      </footer>
    </div>
  )
}
