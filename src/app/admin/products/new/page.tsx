'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import CloudinaryUpload from '@/components/admin/CloudinaryUpload'

const CATEGORIES = [
  'Designer Sarees', 'Lehenga Fabrics', 'Kurti Fabrics',
  'Plain Fabrics', 'Blouse Fabrics', 'Dupattas', 'Lining & Inner', 'Embroidery Work',
]
const FABRIC_TYPES = ['Silk', 'Cotton', 'Georgette', 'Chiffon', 'Velvet', 'Linen', 'Rayon', 'Polyester', 'Net', 'Organza', 'Chanderi', 'Tussar', 'Other']
const PRINT_TYPES  = ['Solid', 'Printed', 'Embroidered', 'Woven Jacquard', 'Digital Print', 'Block Print', 'Zari Work', 'Bandhani', 'Batik', 'None']
const WASH_CARE    = ['Hand wash cold', 'Machine wash gentle', 'Dry clean only', 'Dry clean recommended', 'Do not wash']
const SEASONS      = ['All Season', 'Summer', 'Winter', 'Festive', 'Monsoon']

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function NewProductPage() {
  const router = useRouter()
  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState('')
  const [images,  setImages]  = useState<string[]>([])

  const [form, setForm] = useState({
    name:          '',
    slug:          '',
    fullName:      '',
    category:      'Designer Sarees',
    fabricType:    '',
    composition:   '',
    printType:     'Solid',
    gsm:           '',
    season:        'All Season',
    washCare:      'Dry clean only',
    metresPerGarment: '5.5',
    description:   '',
    tags:          '',
    price:         '',
    mrp:           '',
    stock:         '',
    isActive:      true,
    isNewArrival:  false,
    isTrending:    false,
  })

  function upd(k: keyof typeof form, v: any) {
    setForm(p => ({ ...p, [k]: v }))
  }

  function handleNameChange(name: string) {
    setForm(p => ({ ...p, name, slug: toSlug(name), fullName: name }))
  }

  const discount = form.price && form.mrp && Number(form.mrp) > Number(form.price)
    ? Math.round(((Number(form.mrp) - Number(form.price)) / Number(form.mrp)) * 100)
    : null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.name.trim())   return setError('Product name is required')
    if (!form.price)         return setError('Selling price is required')
    if (!form.stock)         return setError('Stock is required')
    if (images.length === 0) return setError('At least one image is required')

    setSaving(true)

    const payload = {
      name:         form.name.trim(),
      sku:          form.slug.replace(/-/g, '').toUpperCase().slice(0, 12),
      category:     form.category,
      description:  form.description.trim(),
      fabricType:   form.fabricType,
      color:        '',
      printType:    form.printType,
      weightGsm:    form.gsm,
      mrp:          form.mrp || form.price,
      sellingPrice: form.price,
      stock:        form.stock,
      minOrderMtr:  '1',
      washCare:     form.washCare,
      occasion:     form.season,
      isActive:     form.isActive,
      isFeatured:   form.isTrending,
      cloudinaryUrl: images[0] || '',
      hsnCode:      '5007',
      gstRate:      '5%',
      tags:         form.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
    }

    try {
      const res  = await fetch('/api/admin/products', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Save failed'); setSaving(false); return }
      router.push('/admin/products')
    } catch {
      setError('Network error — please try again')
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/products" className="p-2 rounded-xl hover:bg-gray-200 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
            <p className="text-sm text-gray-500">Upload images and fill product details</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
            ✕ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-gray-800">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name <span className="text-red-500">*</span></label>
                <input type="text" value={form.name} onChange={e => handleNameChange(e.target.value)}
                  placeholder="e.g. Kalamkari Digital Print Saree"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
                <input type="text" value={form.slug} onChange={e => upd('slug', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-rose-300" />
                <p className="text-xs text-gray-400 mt-1">Auto-generated from name</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name (for display)</label>
                <input type="text" value={form.fullName} onChange={e => upd('fullName', e.target.value)}
                  placeholder="Display name shown to customers"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
                <select value={form.category} onChange={e => upd('category', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-300">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fabric Type</label>
                <select value={form.fabricType} onChange={e => upd('fabricType', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-300">
                  <option value="">Select fabric type</option>
                  {FABRIC_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Composition</label>
                <input type="text" value={form.composition} onChange={e => upd('composition', e.target.value)}
                  placeholder="e.g. 100% Silk, Cotton-Poly blend"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Print / Weave Type</label>
                <select value={form.printType} onChange={e => upd('printType', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-300">
                  {PRINT_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GSM (weight)</label>
                <input type="number" value={form.gsm} onChange={e => upd('gsm', e.target.value)}
                  placeholder="e.g. 120"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Season</label>
                <select value={form.season} onChange={e => upd('season', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-300">
                  {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Wash Care</label>
                <select value={form.washCare} onChange={e => upd('washCare', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-300">
                  {WASH_CARE.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Metres per Garment</label>
                <input type="number" step="0.5" value={form.metresPerGarment} onChange={e => upd('metresPerGarment', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                <p className="text-xs text-gray-400 mt-1">Shown as buying guide to customers</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
                <textarea rows={3} value={form.description} onChange={e => upd('description', e.target.value)}
                  placeholder="Describe the fabric, weave, occasion, care instructions…"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags <span className="text-gray-400 font-normal">(comma-separated)</span></label>
                <input type="text" value={form.tags} onChange={e => upd('tags', e.target.value)}
                  placeholder="Silk, Saree, Festive, Kalamkari"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-gray-800">Pricing &amp; Stock</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price ₹/metre <span className="text-red-500">*</span></label>
                <input type="number" value={form.price} onChange={e => upd('price', e.target.value)}
                  placeholder="1299"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Original / MRP ₹/metre</label>
                <input type="number" value={form.mrp} onChange={e => upd('mrp', e.target.value)}
                  placeholder="1599"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
                <div className="w-full px-4 py-2.5 border border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-500">
                  {discount ? `${discount}% off` : '—'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Available (metres) <span className="text-red-500">*</span></label>
                <input type="number" value={form.stock} onChange={e => upd('stock', e.target.value)}
                  placeholder="50"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
              {[
                { label: 'Active (visible on site)', key: 'isActive' as const },
                { label: 'New Arrival',              key: 'isNewArrival' as const },
                { label: 'Trending',                 key: 'isTrending' as const },
              ].map(({ label, key }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <div onClick={() => upd(key, !form[key])}
                    className={`w-11 h-6 rounded-full transition-colors ${form[key] ? 'bg-green-500' : 'bg-gray-300'} relative`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form[key] ? 'left-5' : 'left-0.5'}`} />
                  </div>
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Product Images */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              Product Images <span className="text-red-500">*</span>
              <span className="text-gray-400 font-normal text-xs ml-2">(up to 5 photos, first = main image)</span>
            </h2>
            <CloudinaryUpload value={images} onChange={setImages} maxImages={5} />
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button type="submit" disabled={saving}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-8 py-3 rounded-xl flex items-center gap-2 disabled:opacity-60 transition-colors">
              {saving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : <><Save size={16} /> Save Product</>}
            </button>
            <Link href="/admin/products"
              className="px-6 py-3 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
