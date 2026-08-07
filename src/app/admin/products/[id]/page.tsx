'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Save, Loader2, Trash2, Check, Upload, X, Plus } from 'lucide-react'

const CATEGORIES  = ['Designer Sarees','Lehenga Fabrics','Kurti Fabrics','Plain Fabrics','Blouse Fabrics','Dupattas','Lining & Inner','Embroidery Work']
const FABRIC_TYPES = ['Silk','Cotton','Georgette','Chiffon','Velvet','Linen','Rayon','Polyester','Net','Organza','Chanderi','Tussar','Other']
const PRINT_TYPES  = ['Solid','Printed','Embroidered','Woven Jacquard','Digital Print','Block Print','Zari Work','Bandhani','Batik','None']
const WASH_CARE    = ['Hand wash cold','Machine wash gentle','Dry clean only','Dry clean recommended','Do not wash']
const SEASONS      = ['All Season','Summer','Winter','Festive','Monsoon']
const OCCASIONS    = ['Casual','Wedding','Festive','Office','Party','Bridal','Daily Wear','Any']

const CLOUD_NAME  = 'muaprkqa'
const UPLOAD_PRESET = 'gofabrikos_products'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const fileRef = useRef<HTMLInputElement>(null)

  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [saved,    setSaved]    = useState(false)
  const [error,    setError]    = useState('')
  const [uploading,setUploading]= useState(false)
  const [images,   setImages]   = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [urlInput, setUrlInput] = useState('')

  const [form, setForm] = useState({
    name:         '',
    slug:         '',
    fullName:     '',
    category:     'Designer Sarees',
    fabricType:   '',
    composition:  '',
    printType:    'Solid',
    gsm:          '',
    season:       'All Season',
    washCare:     'Dry clean only',
    occasion:     '',
    description:  '',
    tags:         [] as string[],
    price:        '',
    mrp:          '',
    stock:        '',
    isActive:     true,
    isNewArrival: false,
    isTrending:   false,
  })

  // ── Load product data ─────────────────────────────────────
  useEffect(() => {
    if (!id) return
    fetch(`/api/admin/products?id=${id}`)
      .then(r => r.json())
      .then(json => {
        const p = json.data
        if (!p) { setError('Product not found'); setLoading(false); return }

        const imgs: string[] = []
        if (p.cloudinary_url) imgs.push(p.cloudinary_url)
        if (Array.isArray(p.images)) {
          p.images.forEach((img: any) => {
            const url = typeof img === 'string' ? img : img?.url
            if (url && !imgs.includes(url)) imgs.push(url)
          })
        }
        setImages(imgs)

        setForm({
          name:         p.name || '',
          slug:         p.slug || '',
          fullName:     p.full_name || p.name || '',
          category:     p.category || 'Designer Sarees',
          fabricType:   p.fabric_type || '',
          composition:  p.material_composition || '',
          printType:    p.print_type || 'Solid',
          gsm:          p.gsm ? String(p.gsm) : '',
          season:       Array.isArray(p.season) ? p.season[0] : (p.season || 'All Season'),
          washCare:     Array.isArray(p.wash_care) ? p.wash_care[0] : (p.wash_care || 'Dry clean only'),
          occasion:     p.occasion || '',
          description:  p.description || '',
          tags:         Array.isArray(p.tags) ? p.tags : [],
          price:        p.price ? String(p.price) : '',
          mrp:          p.original_price ? String(p.original_price) : '',
          stock:        p.stock_metres ? String(p.stock_metres) : '',
          isActive:     p.is_active !== undefined ? p.is_active : true,
          isNewArrival: p.is_new_arrival || false,
          isTrending:   p.is_trending || false,
        })
      })
      .catch(() => setError('Failed to load product'))
      .finally(() => setLoading(false))
  }, [id])

  function upd(k: keyof typeof form, v: any) {
    setForm(p => ({ ...p, [k]: v }))
  }
  function addTag() {
    const t = tagInput.trim()
    if (t && !form.tags.includes(t)) upd('tags', [...form.tags, t])
    setTagInput('')
  }
  function removeTag(t: string) {
    upd('tags', form.tags.filter(x => x !== t))
  }

  // ── Cloudinary upload ─────────────────────────────────────
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', UPLOAD_PRESET)
      const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: fd })
      const data = await res.json()
      if (data.secure_url) setImages(prev => [...prev, data.secure_url])
      else setError('Upload failed — try again')
    } catch {
      setError('Upload failed — check internet connection')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }
  function addUrlImage() {
    const url = urlInput.trim()
    if (url && !images.includes(url)) setImages(prev => [...prev, url])
    setUrlInput('')
  }
  function removeImage(idx: number) {
    setImages(prev => prev.filter((_, i) => i !== idx))
  }

  // ── Save ──────────────────────────────────────────────────
  const discount = form.price && form.mrp && Number(form.mrp) > Number(form.price)
    ? Math.round(((Number(form.mrp) - Number(form.price)) / Number(form.mrp)) * 100)
    : null

  async function handleSave() {
    if (!form.name.trim()) return setError('Product name is required')
    if (!form.price)        return setError('Selling price is required')
    setError('')
    setSaving(true)
    const payload: Record<string, any> = {
      id,
      name:                 form.name.trim(),
      slug:                 form.slug,
      full_name:            form.fullName || form.name,
      category:             form.category,
      description:          form.description,
      fabric_type:          form.fabricType  || null,
      print_type:           form.printType   || null,
      material_composition: form.composition || null,
      gsm:                  form.gsm ? Number(form.gsm) : null,
      original_price:       form.mrp   ? Number(form.mrp)   : null,
      price:                Number(form.price),
      stock_metres:         form.stock ? Number(form.stock) : null,
      wash_care:            form.washCare ? [form.washCare] : null,
      season:               form.season   ? [form.season]   : null,
      occasion:             form.occasion || null,
      is_active:            form.isActive,
      is_new_arrival:       form.isNewArrival,
      is_trending:          form.isTrending,
      tags:                 form.tags,
    }
    if (images.length > 0) {
      payload.cloudinary_url = images[0]
      payload.images = images.map((url, i) => ({ url, public_id: '', is_main: i === 0, sort: i }))
    }
    const res  = await fetch('/api/admin/products', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) { setError(data.error || 'Save failed'); return }
    setSaved(true)
    setTimeout(() => { setSaved(false); router.push('/admin/products') }, 1200)
  }

  async function handleDelete() {
    if (!confirm('Delete this product permanently? This cannot be undone.')) return
    setDeleting(true)
    await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' })
    router.push('/admin/products')
  }

  // ── Render ────────────────────────────────────────────────
  if (loading) return (
    <div className="flex items-center justify-center py-32 gap-2 text-stone-400">
      <Loader2 size={20} className="animate-spin" /> Loading product…
    </div>
  )
  if (error && !form.name) return (
    <div className="p-8 text-center text-red-600">
      {error} — <Link href="/admin/products" className="underline">Go back</Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/products" className="p-2 rounded-xl hover:bg-gray-200 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-sm text-gray-500 font-mono">{form.slug}</p>
            </div>
          </div>
          <button onClick={handleDelete} disabled={deleting}
            className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm px-3 py-2 rounded-xl hover:bg-red-50 transition-colors">
            <Trash2 size={14} /> {deleting ? 'Deleting…' : 'Delete Product'}
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
            ✕ {error}
          </div>
        )}

        <div className="space-y-6">

          {/* ── 1. Basic Info ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-3">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-stone-500 mb-1.5">Product Name <span className="text-red-500">*</span></label>
                <input type="text" value={form.name} onChange={e => upd('name', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5">Full Display Name</label>
                <input type="text" value={form.fullName} onChange={e => upd('fullName', e.target.value)}
                  placeholder="Longer name shown on product page"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5">URL Slug</label>
                <input type="text" value={form.slug} onChange={e => upd('slug', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-rose-300" />
                <p className="text-xs text-gray-400 mt-1">gofabrikos.com/fabrics/<strong>{form.slug}</strong></p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5">Category</label>
                <select value={form.category} onChange={e => upd('category', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-300">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5">Fabric Type</label>
                <select value={form.fabricType} onChange={e => upd('fabricType', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-300">
                  <option value="">— Select —</option>
                  {FABRIC_TYPES.map(f => <option key={f}>{f}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5">Material Composition</label>
                <input type="text" value={form.composition} onChange={e => upd('composition', e.target.value)}
                  placeholder="e.g. 100% Pure Silk, 60% Cotton 40% Poly"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5">Print / Weave Type</label>
                <select value={form.printType} onChange={e => upd('printType', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-300">
                  {PRINT_TYPES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5">GSM (Fabric Weight)</label>
                <input type="number" value={form.gsm} onChange={e => upd('gsm', e.target.value)}
                  placeholder="e.g. 80, 120, 220"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5">Season</label>
                <select value={form.season} onChange={e => upd('season', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-300">
                  {SEASONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5">Wash Care</label>
                <select value={form.washCare} onChange={e => upd('washCare', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-300">
                  {WASH_CARE.map(w => <option key={w}>{w}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5">Occasion / Suitable For</label>
                <select value={form.occasion} onChange={e => upd('occasion', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-300">
                  <option value="">— Select —</option>
                  {OCCASIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-stone-500 mb-1.5">Description / Additional Instructions</label>
                <textarea rows={5} value={form.description} onChange={e => upd('description', e.target.value)}
                  placeholder="Describe the fabric: weave style, texture, suitable garments, special features, care notes, occasion tips…"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none" />
              </div>

              {/* Tags */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-stone-500 mb-1.5">Tags (search keywords)</label>
                <div className="flex gap-2 mb-2 flex-wrap min-h-[32px]">
                  {form.tags.map(t => (
                    <span key={t} className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 text-xs px-2.5 py-1 rounded-full border border-rose-200">
                      {t}
                      <button onClick={() => removeTag(t)} className="hover:text-red-600 font-bold leading-none ml-0.5">×</button>
                    </span>
                  ))}
                  {form.tags.length === 0 && <span className="text-xs text-gray-400 py-1">No tags yet</span>}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() }}}
                    placeholder="Type tag and press Enter — e.g. silk, bridal, south-india"
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                  <button type="button" onClick={addTag}
                    className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm rounded-xl font-medium transition-colors">
                    <Plus size={14} className="inline mr-1" />Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── 2. Pricing & Stock ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-3">Pricing &amp; Stock</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5">Selling Price ₹/m <span className="text-red-500">*</span></label>
                <input type="number" value={form.price} onChange={e => upd('price', e.target.value)} placeholder="499"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5">Original MRP ₹/m</label>
                <input type="number" value={form.mrp} onChange={e => upd('mrp', e.target.value)} placeholder="699"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5">Discount</label>
                <div className="w-full px-4 py-2.5 border border-gray-100 rounded-xl text-sm bg-gray-50 font-medium">
                  {discount ? <span className="text-green-600">{discount}% off</span> : <span className="text-gray-400">—</span>}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5">Stock (metres)</label>
                <input type="number" value={form.stock} onChange={e => upd('stock', e.target.value)} placeholder="50"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-gray-100">
              {([
                { label: 'Active (visible on site)', key: 'isActive'     as const },
                { label: 'New Arrival',              key: 'isNewArrival' as const },
                { label: 'Trending',                 key: 'isTrending'   as const },
              ] as const).map(({ label, key }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
                  <button onClick={() => upd(key, !form[key])}
                    className={`w-11 h-6 rounded-full transition-colors relative ${form[key] ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form[key] ? 'left-5' : 'left-0.5'}`} />
                  </button>
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* ── 3. Images ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-3">Product Images</h2>
            <p className="text-xs text-gray-400">First image = main photo shown on site. Add up to 6 images.</p>

            {images.length > 0 && (
              <div className="flex gap-3 flex-wrap">
                {images.map((url, i) => (
                  <div key={i} className={`relative w-24 h-24 rounded-xl overflow-hidden border-2 ${i === 0 ? 'border-rose-400' : 'border-gray-200'}`}>
                    <Image src={url} alt={`Photo ${i+1}`} fill className="object-cover" sizes="96px" />
                    {i === 0 && <span className="absolute top-0.5 left-0.5 bg-rose-500 text-white text-[10px] px-1 rounded font-bold">MAIN</span>}
                    <button onClick={() => removeImage(i)}
                      className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-colors">
                      <X size={10} />
                    </button>
                  </div>
                ))}
                {images.length < 6 && (
                  <button onClick={() => fileRef.current?.click()}
                    className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-rose-300 hover:text-rose-400 transition-colors">
                    <Plus size={20} /><span className="text-[10px] mt-1">Add more</span>
                  </button>
                )}
              </div>
            )}

            {images.length === 0 && (
              <button onClick={() => fileRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-rose-300 transition-colors">
                <Upload size={28} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm font-medium text-gray-500">Click to upload from your computer</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — up to 10 MB</p>
              </button>
            )}

            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />

            {uploading && (
              <div className="flex items-center gap-2 text-sm text-rose-600">
                <Loader2 size={14} className="animate-spin" /> Uploading to Cloudinary…
              </div>
            )}

            <div className="flex gap-3 items-center">
              <button onClick={() => fileRef.current?.click()} disabled={uploading || images.length >= 6}
                className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm rounded-xl font-medium disabled:opacity-50 transition-colors">
                <Upload size={14} /> Upload Photo
              </button>
              <span className="text-gray-300 text-sm">or paste URL</span>
              <div className="flex-1 flex gap-2">
                <input type="text" value={urlInput} onChange={e => setUrlInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addUrlImage() }}}
                  placeholder="https://res.cloudinary.com/…"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                <button onClick={addUrlImage}
                  className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm rounded-xl font-medium transition-colors">
                  Add
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-400">
              To add video: upload to YouTube/Cloudinary and paste the link in Description above.
            </p>
          </div>

          {/* ── Save / Cancel ── */}
          <div className="flex gap-3 pb-8">
            <button onClick={handleSave} disabled={saving || saved}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-8 py-3 rounded-xl flex items-center gap-2 disabled:opacity-60 transition-colors shadow-sm">
              {saved  ? <><Check size={16} /> Saved!</> :
               saving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> :
                        <><Save size={16} /> Save Changes</>}
            </button>
            <Link href="/admin/products"
              className="px-6 py-3 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </Link>
            <div className="flex-1" />
            <a href={`/fabrics/${form.slug}`} target="_blank" rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              👁 View on Site
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
