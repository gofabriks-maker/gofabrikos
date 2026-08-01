'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Scissors, Check, Star, Package, Truck } from 'lucide-react'

const FABRICS = [
  { id: 1, name: 'Mull Chanderi',    cat: 'Chanderi',  img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80' },
  { id: 2, name: 'Banarasi Brocade', cat: 'Banarasi',  img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&q=80' },
  { id: 3, name: 'Khadi Cotton',     cat: 'Khadi',     img: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=200&q=80' },
  { id: 4, name: 'Kanjivaram Silk',  cat: 'Kanjivaram',img: 'https://images.unsplash.com/photo-1594938298603-c8148c4f4d47?w=200&q=80' },
  { id: 5, name: 'Georgette',        cat: 'Georgette', img: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=200&q=80' },
  { id: 6, name: 'Linen Slub',       cat: 'Linen',     img: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&q=80' },
  { id: 7, name: 'Mysore Silk',      cat: 'Mysore Silk',img:'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&q=80' },
  { id: 8, name: 'Cotton Ikat',      cat: 'Ikat',      img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80' },
]

export default function FreeSwatchPage() {
  const [selected, setSelected]   = useState<number[]>([])
  const [submitted, setSubmit]    = useState(false)
  const [form, setForm]           = useState({ name: '', mobile: '', email: '', address: '', pin: '', city: '' })

  const MAX = 3

  function toggle(id: number) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < MAX ? [...prev, id] : prev
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (selected.length === 0) return
    setSubmit(true)
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-rose-800 tracking-wide">
            Go<span className="text-stone-400 font-light">Fabrikos</span>
          </Link>
          <Link href="/fabrics" className="text-sm text-stone-600 hover:text-rose-700">Browse Fabrics →</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-10">

        {submitted ? (
          /* Success */
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={36} className="text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-stone-800 mb-2">Swatches Requested!</h2>
            <p className="text-stone-500 mb-1">Your free fabric swatches will be dispatched in 1–2 business days.</p>
            <p className="text-stone-400 text-sm mb-8">Delivered in a small envelope to your address</p>

            <div className="bg-stone-50 rounded-2xl p-5 max-w-sm mx-auto mb-8 text-left space-y-3">
              {selected.map(id => {
                const f = FABRICS.find(x => x.id === id)!
                return (
                  <div key={id} className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={f.img} alt={f.name} className="w-10 h-10 object-cover rounded-lg" />
                    <div>
                      <p className="text-sm font-medium text-stone-800">{f.name}</p>
                      <p className="text-xs text-stone-500">10×10 cm swatch · Free</p>
                    </div>
                    <Check size={14} className="text-emerald-500 ml-auto" />
                  </div>
                )
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/fabrics" className="px-6 py-3 bg-rose-800 text-white rounded-xl font-semibold hover:bg-rose-900">
                Shop Fabrics
              </Link>
              <button onClick={() => { setSubmit(false); setSelected([]) }}
                className="px-6 py-3 border border-stone-300 text-stone-700 rounded-xl font-medium hover:bg-stone-50">
                Request More Swatches
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Hero */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-800 text-xs font-bold px-4 py-1.5 rounded-full mb-4">
                <Scissors size={13} /> FREE SWATCH PROGRAMME
              </div>
              <h1 className="text-3xl font-bold text-stone-800 mb-3">Feel the Fabric Before You Buy</h1>
              <p className="text-stone-500 max-w-lg mx-auto">
                Choose up to <strong>3 fabric swatches</strong> (10×10 cm each) and we'll deliver them to your doorstep — free on your first order.
              </p>
              <div className="flex flex-wrap justify-center gap-5 mt-5 text-sm text-stone-500">
                <span className="flex items-center gap-1.5"><Star size={14} className="text-amber-400 fill-amber-400" /> 100% free</span>
                <span className="flex items-center gap-1.5"><Package size={14} className="text-stone-400" /> Up to 3 swatches</span>
                <span className="flex items-center gap-1.5"><Truck size={14} className="text-stone-400" /> Delivered in 2–3 days</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">

              {/* Fabric selection */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-stone-800">Select Fabrics</h2>
                  <span className={`text-sm font-semibold ${selected.length === MAX ? 'text-rose-700' : 'text-stone-500'}`}>
                    {selected.length}/{MAX} selected
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {FABRICS.map(f => {
                    const isSelected  = selected.includes(f.id)
                    const isDisabled  = !isSelected && selected.length >= MAX
                    return (
                      <button
                        key={f.id}
                        onClick={() => toggle(f.id)}
                        disabled={isDisabled}
                        className={`rounded-xl border-2 overflow-hidden text-left transition-all ${
                          isSelected  ? 'border-rose-600 shadow-md scale-[1.02]' :
                          isDisabled  ? 'border-stone-100 opacity-40 cursor-not-allowed' :
                                        'border-stone-200 hover:border-rose-300'
                        }`}
                      >
                        <div className="relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={f.img} alt={f.name} className="w-full aspect-square object-cover" />
                          {isSelected && (
                            <div className="absolute inset-0 bg-rose-600/25 flex items-center justify-center">
                              <div className="w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center">
                                <Check size={16} className="text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="p-2">
                          <p className="text-xs font-semibold text-stone-800 leading-tight">{f.name}</p>
                          <p className="text-[10px] text-stone-400 mt-0.5">{f.cat}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {selected.length === MAX && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
                    Maximum 3 swatches per request. Deselect one to choose another.
                  </div>
                )}
              </div>

              {/* Delivery form */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 h-fit">
                <h2 className="font-bold text-stone-800 mb-4">Delivery Details</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                  {[
                    { key: 'name',    label: 'Full Name *',   req: true },
                    { key: 'mobile',  label: 'Mobile *',       req: true },
                    { key: 'email',   label: 'Email',          req: false },
                    { key: 'address', label: 'Address *',      req: true },
                    { key: 'city',    label: 'City *',         req: true },
                    { key: 'pin',     label: 'PIN Code *',     req: true },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-xs font-semibold text-stone-500 mb-1">{f.label}</label>
                      <input
                        required={f.req}
                        value={form[f.key as keyof typeof form]}
                        onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                        className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-rose-400"
                      />
                    </div>
                  ))}

                  {/* Selected swatches summary */}
                  {selected.length > 0 && (
                    <div className="border-t border-stone-100 pt-3 space-y-2">
                      <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Swatches Selected</p>
                      {selected.map(id => {
                        const f = FABRICS.find(x => x.id === id)!
                        return (
                          <div key={id} className="flex items-center gap-2 text-xs text-stone-600">
                            <Check size={11} className="text-emerald-500" /> {f.name} (10×10 cm)
                          </div>
                        )
                      })}
                      <p className="text-xs text-emerald-600 font-semibold">Total: FREE</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={selected.length === 0}
                    className="w-full py-3 bg-rose-800 text-white rounded-xl font-semibold hover:bg-rose-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {selected.length === 0 ? 'Select at least 1 fabric' : `Request ${selected.length} Free Swatch${selected.length > 1 ? 'es' : ''}`}
                  </button>
                  <p className="text-xs text-stone-400 text-center">One free swatch request per customer. Available on first order only.</p>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
