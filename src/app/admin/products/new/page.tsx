'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Upload, X, Check, Loader2, ImagePlus, Package } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const CATEGORIES = [
  'Lehenga Fabrics', 'Blouse Fabrics', 'Kurti Fabrics', 'Plain Fabrics',
  'Dupattas', 'Designer Sarees', 'Men Kurta Fabrics',
]

const SEASONS = ['All Season', 'Summer & Spring', 'Winter', 'Winter & Festive', 'Wedding & Festive', 'Monsoon']

const WASH_CARE_OPTIONS = [
  'Dry clean only', 'Dry clean recommended', 'Hand wash cold', 'Machine wash cold',
  'Machine wash gentle', 'Do not wash — spot clean only',
]

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

interface ImageItem { url: string; uploading?: boolean; error?: string }

export default function NewProductPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [name,            setName]           = useState('')
  const [slug,            setSlug]           = useState('')
  const [slugManual,      setSlugManual]     = useState(false)
  const [fullName,        setFullName]       = useState('')
  const [category,        setCategory]       = useState(CATEGORIES[0])
  const [fabricType,      setFabricType]     = useState('')
  const [printType,       setPrintType]      = useState('')
  const [gsm,             setGsm]            = useState('')
  const [composition,     setComposition]    = useState('')
  const [season,          setSeason]         = useState(SEASONS[0])
  const [washCare,        setWashCare]       = useState(WASH_CARE_OPTIONS[0])
  const [description,     setDescription]    = useState('')
  const [metresPerGarment,setMetresPerGarment] = useState('')
  const [price,           setPrice]          = useState('')
  const [originalPrice,   setOriginalPrice]  = useState('')
  const [stockLeft,       setStockLeft]      = useState('')
  const [isNewArrival,    setIsNewArrival]   = useState(false)
  const [isTrending,      setIsTrending]     = useState(false)
  const [isActive,        setIsActive]       = useState(true)
  const [tags,            setTags]           = useState('')
  const [images,          setImages]         = useState<ImageItem[]>([])
  const [saving,          setSaving]         = useState(false)
  const [saved,           setSaved]          = useState(false)
  const [error,           setError]          = useState('')

  function handleNameChange(val: string) {
    setName(val)
    if (!slugManual) setSlug(slugify(val))
  }

  const discount = price && originalPrice
    ? Math.round((1 - Number(price) / Number(originalPrice)) * 100)
    : 0

  // ── Image upload ─────────────────────────────────────────────────
  async function uploadFile(file: File) {
    const idx = images.length
    setImages(prev => [...prev, { url: '', uploading: true }])

    const fd = new FormData()
    fd.append('file', file)

    try {
      const res  = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setImages(prev => prev.map((img, i) => i === idx ? { url: data.url } : img))
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Upload failed'
      setImages(prev => prev.map((img, i) => i === idx ? { url: '', error: msg } : img))
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (images.length + files.length > 5) {
      alert('Maximum 5 images allowed')
      return
    }
    files.forEach(uploadFile)
    e.target.value = ''
  }

  function removeImage(idx: number) {
    setImages(prev => prev.filter((_, i) => i !== idx))
  }

  // ── Save product ─────────────────────────────────────────────────
  async function handleSave(e: React.FormEvent, addAnother = false) {
    e.preventDefault()
    setError('')

    if (!name || !price || !stockLeft || images.filter(i => i.url).length === 0) {
      setError('Please fill: Name, Price, Stock, and at least 1 image.')
      return
    }
    if (images.some(i => i.uploading)) {
      setError('Please wait — images still uploading.')
      return
    }

    setSaving(true)
    try {
      const supabase  = createClient()
      const imageUrls = images.filter(i => i.url).map(i => i.url)
      const tagArr    = tags.split(',').map(t => t.trim()).filter(Boolean)

      const { error: dbErr } = await supabase.from('products').insert({
        slug:               slug || slugify(name),
        name,
        full_name:          fullName || name,
        price:              Number(price),
        original_price:     originalPrice ? Number(originalPrice) : Number(price),
        discount:           discount || 0,
        category,
        fabric_type:        fabricType,
        print_type:         printType,
        gsm:                gsm ? Number(gsm) : null,
        composition,
        season,
        wash_care:          washCare,
        description,
        metres_per_garment: metresPerGarment ? Number(metresPerGarment) : null,
        stock_left:         Number(stockLeft),
        is_new_arrival:     isNewArrival,
        is_trending:        isTrending,
        is_active:          isActive,
        image_url:          imageUrls[0],
        images:             imageUrls,
        tags:               tagArr,
        rating:             0,
        ratings_count:      0,
        viewing_now:        0,
        likes:              0,
        views_today:        0,
        orders_today:       0,
      })

      if (dbErr) throw dbErr

      setSaved(true)

      if (addAnother) {
        // Reset form for next product
        setTimeout(() => {
          setName(''); setSlug(''); setSlugManual(false); setFullName('')
          setFabricType(''); setPrintType(''); setGsm(''); setComposition('')
          setDescription(''); setMetresPerGarment(''); setPrice(''); setOriginalPrice('')
          setStockLeft(''); setIsNewArrival(false); setIsTrending(false); setIsActive(true)
          setTags(''); setImages([]); setSaved(false)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }, 800)
      } else {
        setTimeout(() => router.push('/admin'), 1000)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setError('Save failed: ' + msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-stone-900 text-white px-6 py-4 flex items-center gap-4 sticky top-0 z-40">
        <Link href="/admin" className="flex items-center gap-1.5 text-stone-400 hover:text-white text-sm">
          <ArrowLeft size={16} /> Back to Admin
        </Link>
        <span className="text-stone-600">|</span>
        <span className="font-bold flex items-center gap-2"><Package size={16} /> Add New Product</span>
      </div>

      <form onSubmit={e => handleSave(e, false)} className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
            <X size={16} /> {error}
          </div>
        )}

        {/* Success */}
        {saved && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
            <Check size={16} /> Product saved successfully!
          </div>
        )}

        {/* ── Section 1: Basic Info ── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-bold text-gray-800 text-base border-b pb-2">Basic Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Product Name *</label>
              <input required value={name} onChange={e => handleNameChange(e.target.value)}
                placeholder="e.g., Mull Chanderi Digital Print"
                className="input" />
            </div>

            <div>
              <label className="label">URL Slug *</label>
              <input value={slug} onChange={e => { setSlug(e.target.value); setSlugManual(true) }}
                placeholder="auto-generated"
                className="input font-mono text-xs" />
              <p className="text-xs text-gray-400 mt-1">gofabrikos.com/fabrics/{slug || 'your-slug'}</p>
            </div>

            <div>
              <label className="label">Full Name (for display)</label>
              <input value={fullName} onChange={e => setFullName(e.target.value)}
                placeholder="e.g., Mull Chanderi Digital Print — Ivory & Rose"
                className="input" />
            </div>

            <div>
              <label className="label">Category *</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="input">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="label">Fabric Type</label>
              <input value={fabricType} onChange={e => setFabricType(e.target.value)}
                placeholder="e.g., Pure Silk, Cotton, Georgette"
                className="input" />
            </div>

            <div>
              <label className="label">Print / Weave Type</label>
              <input value={printType} onChange={e => setPrintType(e.target.value)}
                placeholder="e.g., Digital Print, Plain, Handloom"
                className="input" />
            </div>

            <div>
              <label className="label">Composition</label>
              <input value={composition} onChange={e => setComposition(e.target.value)}
                placeholder="e.g., 100% Cotton or 70% Silk 30% Cotton"
                className="input" />
            </div>

            <div>
              <label className="label">GSM (weight)</label>
              <input type="number" value={gsm} onChange={e => setGsm(e.target.value)}
                placeholder="e.g., 120"
                className="input" />
            </div>

            <div>
              <label className="label">Season</label>
              <select value={season} onChange={e => setSeason(e.target.value)} className="input">
                {SEASONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="label">Wash Care</label>
              <select value={washCare} onChange={e => setWashCare(e.target.value)} className="input">
                {WASH_CARE_OPTIONS.map(w => <option key={w}>{w}</option>)}
              </select>
            </div>

            <div>
              <label className="label">Metres per Garment</label>
              <input type="number" step="0.5" value={metresPerGarment} onChange={e => setMetresPerGarment(e.target.value)}
                placeholder="e.g., 5.5"
                className="input" />
              <p className="text-xs text-gray-400 mt-1">Shown as buying guide to customers</p>
            </div>

            <div className="sm:col-span-2">
              <label className="label">Description *</label>
              <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)}
                placeholder="Describe the fabric — quality, origin, best use, special features..."
                className="input resize-none" />
            </div>

            <div className="sm:col-span-2">
              <label className="label">Tags (comma-separated)</label>
              <input value={tags} onChange={e => setTags(e.target.value)}
                placeholder="e.g., silk, saree, wedding, banarasi, festive"
                className="input" />
            </div>
          </div>
        </div>

        {/* ── Section 2: Pricing & Stock ── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-bold text-gray-800 text-base border-b pb-2">Pricing & Stock</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Selling Price ₹/metre *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
                <input required type="number" value={price} onChange={e => setPrice(e.target.value)}
                  placeholder="0"
                  className="input pl-7" />
              </div>
            </div>
            <div>
              <label className="label">Original / MRP ₹/metre</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
                <input type="number" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)}
                  placeholder="0 (leave blank if no discount)"
                  className="input pl-7" />
              </div>
            </div>
            <div>
              <label className="label">Discount</label>
              <div className="input bg-gray-50 text-gray-600 flex items-center">
                {discount > 0 ? `${discount}% off` : 'No discount'}
              </div>
            </div>
            <div>
              <label className="label">Stock Available (metres) *</label>
              <input required type="number" value={stockLeft} onChange={e => setStockLeft(e.target.value)}
                placeholder="e.g., 50"
                className="input" />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-6 pt-2">
            {[
              { label: 'Active (visible on site)',  val: isActive,      set: setIsActive },
              { label: 'New Arrival',               val: isNewArrival,  set: setIsNewArrival },
              { label: 'Trending',                  val: isTrending,    set: setIsTrending },
            ].map(t => (
              <label key={t.label} className="flex items-center gap-2 cursor-pointer select-none">
                <button type="button" onClick={() => t.set(!t.val)}
                  className={`relative inline-flex h-5 w-9 rounded-full transition-colors ${t.val ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${t.val ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </button>
                <span className="text-sm text-gray-700">{t.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ── Section 3: Images ── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-bold text-gray-800 text-base border-b pb-2">
            Product Images * <span className="text-xs font-normal text-gray-400">(up to 5 photos, first = main image)</span>
          </h2>

          {/* Upload area */}
          <div
            onClick={() => images.length < 5 && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              images.length < 5
                ? 'border-rose-300 hover:border-rose-500 hover:bg-rose-50 cursor-pointer'
                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
            }`}
          >
            <ImagePlus size={32} className="mx-auto mb-2 text-rose-400" />
            <p className="text-sm font-semibold text-gray-700">Click to upload fabric photos</p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP • Max 10MB each • Up to 5 photos</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Image previews */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-100">
                  {img.uploading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                      <Loader2 size={20} className="text-rose-500 animate-spin" />
                      <span className="text-xs text-gray-500">Uploading...</span>
                    </div>
                  ) : img.error ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-2">
                      <X size={18} className="text-red-500" />
                      <span className="text-[10px] text-red-500 text-center leading-tight">{img.error}</span>
                    </div>
                  ) : (
                    <>
                      <img src={img.url} alt={`Product ${i+1}`} className="w-full h-full object-cover" />
                      {i === 0 && (
                        <span className="absolute top-1 left-1 bg-rose-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">MAIN</span>
                      )}
                    </>
                  )}
                  {!img.uploading && (
                    <button type="button" onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black">
                      <X size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Action buttons ── */}
        <div className="flex flex-col sm:flex-row gap-3 pb-8">
          <button
            type="button"
            onClick={e => handleSave(e as unknown as React.FormEvent, true)}
            disabled={saving}
            className="flex-1 py-3.5 bg-rose-800 text-white rounded-xl font-bold hover:bg-rose-900 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            Save & Add Another Product
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-3.5 bg-stone-800 text-white rounded-xl font-bold hover:bg-stone-900 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Package size={16} />}
            Save & Go to Admin
          </button>
          <Link href="/admin"
            className="px-6 py-3.5 border border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50 text-center">
            Cancel
          </Link>
        </div>
      </form>

      <style jsx global>{`
        .label { display: block; font-size: 0.75rem; font-weight: 600; color: #6b7280; margin-bottom: 0.25rem; }
        .input { width: 100%; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 0.625rem 1rem; font-size: 0.875rem; outline: none; transition: border-color 0.15s; }
        .input:focus { border-color: #fda4af; box-shadow: 0 0 0 2px rgba(253,164,175,0.2); }
      `}</style>
    </div>
  )
}
