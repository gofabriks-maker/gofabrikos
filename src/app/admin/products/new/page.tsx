'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import CloudinaryUpload from '@/components/admin/CloudinaryUpload'

const CATEGORIES = ['saree', 'blouse', 'lehenga', 'dress-material', 'fabric-by-meter']

interface ProductForm {
  name: string
  slug: string
  description: string
  price: number
  mrp: number
  category: string
  fabric_type: string
  colors_available: string
  stock_left: number
  is_active: boolean
  images: string[]
  meta_title: string
  meta_description: string
}

const DEFAULT_FORM: ProductForm = {
  name: '',
  slug: '',
  description: '',
  price: 0,
  mrp: 0,
  category: 'saree',
  fabric_type: '',
  colors_available: '',
  stock_left: 100,
  is_active: true,
  images: [],
  meta_title: '',
  meta_description: '',
}

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function NewProductPage() {
  const router = useRouter()
  const [form, setForm] = useState<ProductForm>(DEFAULT_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function update<K extends keyof ProductForm>(key: K, val: ProductForm[K]) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  function handleNameChange(name: string) {
    setForm(prev => ({
      ...prev,
      name,
      slug: toSlug(name),
      meta_title: name ? `${name} | GoFabrikos` : '',
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.name.trim()) return setError('Product name is required')
    if (!form.slug.trim()) return setError('Slug is required')
    if (form.images.length === 0) return setError('At least one image is required')
    if (form.price <= 0) return setError('Price must be greater than 0')

    setSaving(true)

    // Use admin API route (service role key bypasses RLS)
    const payload = {
      name:         form.name.trim(),
      sku:          form.slug.replace(/-/g, '').toUpperCase().slice(0, 12),
      category:     form.category,
      description:  form.description.trim(),
      fabricType:   form.fabric_type.trim(),
      color:        form.colors_available.split(',')[0]?.trim() || '',
      mrp:          String(form.mrp || form.price),
      sellingPrice: String(form.price),
      stock:        String(form.stock_left),
      minOrderMtr:  '1',
      isActive:     form.is_active,
      isFeatured:   false,
      cloudinaryUrl: form.images[0] || '',
      hsnCode:      '5007',
      gstRate:      '5%',
      occasion:     '',
      washCare:     '',
      tags:         [],
    }

    const res = await fetch('/api/admin/products', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Save failed')
      setSaving(false)
      return
    }

    router.push('/admin/products')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="p-2 rounded-xl hover:bg-gray-200 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
            <p className="text-sm text-gray-500">Upload images and fill product details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Images */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              Product Images <span className="text-red-500">*</span>
            </h2>
            <CloudinaryUpload
              value={form.images}
              onChange={urls => update('images', urls)}
              maxImages={5}
            />
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-gray-800">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => handleNameChange(e.target.value)}
                  placeholder="e.g. Kanjivaram Pure Silk Saree"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={e => update('slug', e.target.value)}
                  placeholder="kanjivaram-pure-silk-saree"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono"
                />
                <p className="text-xs text-gray-400 mt-1">Auto-generated from name</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={e => update('category', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={e => update('description', e.target.value)}
                placeholder="Describe the fabric, weave, occasion, care instructions…"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-gray-800">Pricing & Stock</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selling Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={form.price || ''}
                  onChange={e => update('price', Number(e.target.value))}
                  min={1}
                  placeholder="1299"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">MRP (₹)</label>
                <input
                  type="number"
                  value={form.mrp || ''}
                  onChange={e => update('mrp', Number(e.target.value))}
                  min={0}
                  placeholder="1599"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Left</label>
                <input
                  type="number"
                  value={form.stock_left}
                  onChange={e => update('stock_left', Number(e.target.value))}
                  min={0}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="flex flex-col justify-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => update('is_active', !form.is_active)}
                    className={`w-11 h-6 rounded-full transition-colors ${form.is_active ? 'bg-green-500' : 'bg-gray-300'} relative`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.is_active ? 'left-5' : 'left-0.5'}`} />
                  </div>
                  <span className="text-sm text-gray-700">{form.is_active ? 'Active' : 'Draft'}</span>
                </label>
              </div>
            </div>
          </div>

          {/* Fabric Details */}
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-gray-800">Fabric Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fabric Type</label>
                <input
                  type="text"
                  value={form.fabric_type}
                  onChange={e => update('fabric_type', e.target.value)}
                  placeholder="e.g. Pure Silk, Cotton Blend, Georgette"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Colors Available <span className="text-gray-400 font-normal">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={form.colors_available}
                  onChange={e => update('colors_available', e.target.value)}
                  placeholder="Red, Navy Blue, Bottle Green, Ivory"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-gray-800">SEO <span className="text-gray-400 font-normal text-sm">(optional)</span></h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
              <input
                type="text"
                value={form.meta_title}
                onChange={e => update('meta_title', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
              <textarea
                rows={2}
                value={form.meta_description}
                onChange={e => update('meta_description', e.target.value)}
                maxLength={160}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">{form.meta_description.length}/160 characters</p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center gap-2 px-8"
            >
              {saving ? (
                <><Loader2 size={16} className="animate-spin" /> Saving…</>
              ) : (
                <><Save size={16} /> Save Product</>
              )}
            </button>
            <Link href="/admin" className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
