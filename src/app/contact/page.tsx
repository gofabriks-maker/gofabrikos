'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  Mail, Phone, MapPin, MessageCircle,
  Send, CheckCircle, Loader2, Clock, Building2
} from 'lucide-react'

const SUBJECTS = [
  'Product Enquiry',
  'Order Support',
  'B2B / Wholesale',
  'Custom Fabric Request',
  'Delivery Issue',
  'Payment Issue',
  'Other',
]

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', subject: '', message: '',
  })
  const [loading,   setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error,     setError]     = useState('')

  function upd(k: keyof typeof form, v: string) {
    setForm(p => ({ ...p, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.message.trim()) return

    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        const j = await res.json()
        setError(j.error || 'Failed to send message. Please try again.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const waMsg = `Hi GoFabrikos! My name is ${form.name || 'Customer'}. I have a query: ${form.message || '(please describe your query)'}`

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-stone-900 text-white py-14 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-rose-800 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
            <MessageCircle size={13} /> CONTACT US
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">We're Here to Help</h1>
          <p className="text-stone-300 text-base max-w-md mx-auto">
            Questions about fabrics, orders, or wholesale? Reach us on WhatsApp or send a message below.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Contact Info */}
          <div className="space-y-5">

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-4">Get in Touch</h2>
              <div className="space-y-4">
                <a href="https://wa.me/918790125438" target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-3 group">
                  <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center flex-none group-hover:bg-green-200 transition-colors">
                    <MessageCircle size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400">WhatsApp (Fastest)</p>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-green-600 transition-colors">+91 87901 25438</p>
                  </div>
                </a>

                <a href="tel:+918790125438" className="flex items-start gap-3 group">
                  <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center flex-none group-hover:bg-blue-200 transition-colors">
                    <Phone size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400">Phone</p>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">+91 87901 25438</p>
                  </div>
                </a>

                <a href="mailto:care@gofabrikos.com" className="flex items-start gap-3 group">
                  <div className="w-9 h-9 bg-rose-100 rounded-xl flex items-center justify-center flex-none group-hover:bg-rose-200 transition-colors">
                    <Mail size={16} className="text-rose-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400">Email</p>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-rose-600 transition-colors">care@gofabrikos.com</p>
                  </div>
                </a>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center flex-none">
                    <MapPin size={16} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400">Location</p>
                    <p className="text-sm font-semibold text-gray-800">Hyderabad, Telangana</p>
                    <p className="text-xs text-gray-400">Pan-India delivery</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={14} className="text-gray-400" />
                <h3 className="text-sm font-bold text-gray-700">Business Hours</h3>
              </div>
              <div className="space-y-1.5 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Mon – Sat</span>
                  <span className="font-medium">9:00 AM – 7:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-gray-400">WhatsApp only</span>
                </div>
              </div>
            </div>

            {/* B2B CTA */}
            <div className="bg-stone-900 rounded-2xl p-5 text-white">
              <Building2 size={20} className="mb-2 text-rose-400" />
              <h3 className="font-bold mb-1">B2B / Wholesale?</h3>
              <p className="text-xs text-stone-400 mb-3">Get bulk discounts up to 15% for your boutique or business.</p>
              <Link href="/b2b"
                className="inline-block px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors">
                Submit B2B Enquiry →
              </Link>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">

              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={30} className="text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h2>
                  <p className="text-gray-500 text-sm mb-6">
                    Thank you, {form.name}. We'll get back to you within 24 hours.
                  </p>
                  <div className="space-y-3">
                    <a href={`https://wa.me/918790125438?text=${encodeURIComponent(waMsg)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full max-w-xs mx-auto py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors text-sm">
                      <MessageCircle size={16} /> Chat on WhatsApp Now
                    </a>
                    <Link href="/fabrics"
                      className="block text-center text-sm text-gray-400 hover:text-gray-600 mt-2">
                      Browse Fabrics →
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Send a Message</h2>
                  <p className="text-sm text-gray-400 mb-6">We reply within 24 hours on working days.</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name *</label>
                        <input required value={form.name} onChange={e => upd('name', e.target.value)}
                          placeholder="Lakshmi Devi"
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Phone Number</label>
                        <input type="tel" value={form.phone} onChange={e => upd('phone', e.target.value)}
                          placeholder="9876543210"
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Email Address</label>
                        <input type="email" value={form.email} onChange={e => upd('email', e.target.value)}
                          placeholder="lakshmi@gmail.com"
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Subject</label>
                        <select value={form.subject} onChange={e => upd('subject', e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white">
                          <option value="">Select a topic…</option>
                          {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Message *</label>
                        <textarea required value={form.message} onChange={e => upd('message', e.target.value)}
                          rows={5} placeholder="Tell us how we can help you…"
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none" />
                      </div>
                    </div>

                    {error && <p className="text-xs text-red-500">{error}</p>}

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button type="submit" disabled={loading}
                        className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 transition-colors">
                        {loading
                          ? <><Loader2 size={16} className="animate-spin" /> Sending…</>
                          : <><Send size={15} /> Send Message</>}
                      </button>
                      <a href={`https://wa.me/918790125438?text=${encodeURIComponent(waMsg)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-5 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors text-sm">
                        <MessageCircle size={15} /> WhatsApp
                      </a>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
