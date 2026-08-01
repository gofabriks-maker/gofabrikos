'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Sparkles, RotateCcw, Check, ChevronLeft, ChevronRight } from 'lucide-react'

type GarmentType = 'saree' | 'chudidhar' | 'lehenga' | 'gown' | 'dress' | 'blouse'
type MannequinSize = 'adult' | 'kids'

// ── PNG mannequin image map ───────────────────────────────────────────────
const MANNEQUIN_IMAGES: Record<MannequinSize, Record<GarmentType, string>> = {
  adult: {
    saree:     '/mannequin-frames/adult-female-saree-front.png',
    chudidhar: '/mannequin-frames/adult-female-chudidhar-front.png',
    lehenga:   '/mannequin-frames/adult-female-lehenga-voni-front.png',
    gown:      '/mannequin-frames/adult-female-gown-front.png',
    dress:     '/mannequin-frames/adult-female-dress-dupatta-front.png',
    blouse:    '/mannequin-frames/adult-female-blouse-front.png',
  },
  kids: {
    saree:     '/mannequin-frames/kids-girl-lehenga-voni-front.png',
    chudidhar: '/mannequin-frames/kids-girl-chudidhar-front.png',
    lehenga:   '/mannequin-frames/kids-girl-lehenga-front.png',
    gown:      '/mannequin-frames/kids-girl-party-frock-front.png',
    dress:     '/mannequin-frames/kids-girl-dress-dupatta-front.png',
    blouse:    '/mannequin-frames/kids-girl-frock-front.png',
  },
}

const GARMENTS: { id: GarmentType; label: string; meters: string }[] = [
  { id: 'saree',     label: 'Saree',           meters: '6–9 m' },
  { id: 'chudidhar', label: 'Chudidhar',        meters: '3–5 m' },
  { id: 'lehenga',   label: 'Lehenga Voni',     meters: '4–7 m' },
  { id: 'gown',      label: 'Gown / Anarkali',  meters: '5–8 m' },
  { id: 'dress',     label: 'Dress',            meters: '3–4 m' },
  { id: 'blouse',    label: 'Blouse',           meters: '0.8–1 m' },
]

const FABRICS = [
  { id: 1, name: 'Mull Chanderi',      slug: 'mull-chanderi-digital-print',  price: 125,  category: 'Chanderi',    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' },
  { id: 2, name: 'Banarasi Brocade',   slug: 'pure-silk-banarasi-brocade',   price: 850,  category: 'Banarasi',    img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80' },
  { id: 3, name: 'Khadi Cotton',       slug: 'handloom-khadi-cotton',        price: 280,  category: 'Khadi',       img: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&q=80' },
  { id: 4, name: 'Kanjivaram Silk',    slug: 'kanjivaram-pure-silk',         price: 1200, category: 'Kanjivaram',  img: 'https://images.unsplash.com/photo-1594938298603-c8148c4f4d47?w=600&q=80' },
  { id: 5, name: 'Georgette',          slug: 'georgette-embroidered-fabric', price: 320,  category: 'Georgette',   img: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&q=80' },
  { id: 6, name: 'Linen Slub',         slug: 'linen-slub-fabric',            price: 195,  category: 'Linen',       img: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80' },
  { id: 7, name: 'Mysore Silk',        slug: 'mysore-silk-plain',            price: 650,  category: 'Mysore Silk', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80' },
  { id: 8, name: 'Cotton Ikat',        slug: 'cotton-ikat-fabric',           price: 220,  category: 'Ikat',        img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' },
  { id: 9, name: 'Pashmina',           slug: 'pashmina-wool-blend',          price: 950,  category: 'Pashmina',    img: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&q=80' },
]

const COLOR_TONES = [
  { name: 'Deep Red',     hex: '#C8102E' }, { name: 'Royal Navy',   hex: '#1B2A6B' },
  { name: 'Forest Green', hex: '#1A5C38' }, { name: 'Royal Purple', hex: '#4B0082' },
  { name: 'Peacock Teal', hex: '#008080' }, { name: 'Rose Pink',    hex: '#C06080' },
  { name: 'Turmeric',     hex: '#C8901A' }, { name: 'Ivory',        hex: '#C8B89A' },
  { name: 'Charcoal',     hex: '#333344' }, { name: 'Brick',        hex: '#A0401A' },
  { name: 'Sage',         hex: '#5A7A5A' }, { name: 'Maroon',       hex: '#6B0000' },
]

// ── PNG Mannequin Display with fabric overlay ─────────────────────────────
function MannequinDisplay({
  garment, size, fabricImg, tintColor,
}: {
  garment: GarmentType
  size: MannequinSize
  fabricImg: string | null
  tintColor: string | null
}) {
  const src = MANNEQUIN_IMAGES[size][garment]

  return (
    <div className="relative inline-block select-none" style={{ lineHeight: 0 }}>
      {/* ── Base mannequin PNG ── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`${size} mannequin wearing ${garment}`}
        className="block object-contain"
        style={{ maxHeight: 520, maxWidth: '100%' }}
        draggable={false}
      />

      {/* ── Fabric texture overlay (mix-blend-mode: multiply) ── */}
      {fabricImg && (
        <img
          src={fabricImg}
          alt="fabric overlay"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{
            mixBlendMode: 'multiply',
            opacity: 0.82,
          }}
          draggable={false}
        />
      )}

      {/* ── Color tint overlay (when no fabric, just a color is chosen) ── */}
      {tintColor && !fabricImg && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundColor: tintColor,
            mixBlendMode: 'multiply',
            opacity: 0.55,
          }}
        />
      )}

      {/* ── Shadow / depth overlay to keep mannequin three-dimensional ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 30% 50%, transparent 55%, rgba(0,0,0,0.08) 100%)',
        }}
      />
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default function VisualizerPage() {
  const [garment, setGarment]       = useState<GarmentType>('saree')
  const [size, setSize]             = useState<MannequinSize>('adult')
  const [selectedFabric, setFabric] = useState<typeof FABRICS[0] | null>(null)
  const [tintColor, setTintColor]   = useState<string | null>(null)
  const [fabricPage, setFabricPage] = useState(0)
  const [addedToCart, setAddedToCart] = useState(false)

  const FABRICS_PER_PAGE = 6
  const totalPages = Math.ceil(FABRICS.length / FABRICS_PER_PAGE)
  const visibleFabrics = FABRICS.slice(fabricPage * FABRICS_PER_PAGE, (fabricPage + 1) * FABRICS_PER_PAGE)

  function handleAddToCart() {
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  function handleReset() {
    setFabric(null)
    setTintColor(null)
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* ── Nav ─────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-rose-800 tracking-wide">
            Go<span className="text-stone-400 font-light">Fabrikos</span>
          </Link>
          <div className="flex items-center gap-4 text-sm text-stone-600">
            <Link href="/fabrics" className="hover:text-rose-700">Fabrics</Link>
            <Link href="/cart" className="hover:text-rose-700 flex items-center gap-1">
              <ShoppingBag size={16} /> Cart
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero title ──────────────────────────────────────── */}
      <div className="bg-white border-b border-stone-200 py-5 text-center">
        <h1 className="text-2xl font-bold text-stone-800 flex items-center justify-center gap-2">
          <Sparkles size={22} className="text-rose-600" />
          Fabric Visualizer
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          See how your fabric drapes — select a garment, pick a fabric, see the look
        </p>
      </div>

      {/* ── Main layout ─────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">

        {/* ── LEFT: Mannequin display ──────────────────────── */}
        <div className="flex flex-col items-center gap-6">

          {/* Adult / Kids toggle */}
          <div className="flex items-center gap-1 bg-stone-100 rounded-full p-1">
            {(['adult', 'kids'] as MannequinSize[]).map(s => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${
                  size === s
                    ? 'bg-white text-rose-800 shadow-sm'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                {s === 'adult' ? 'Adult' : 'Kids / Girls'}
              </button>
            ))}
          </div>

          {/* Garment type pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {GARMENTS.map(g => (
              <button
                key={g.id}
                onClick={() => setGarment(g.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  garment === g.id
                    ? 'bg-rose-800 text-white border-rose-800'
                    : 'bg-white text-stone-600 border-stone-300 hover:border-rose-400'
                }`}
              >
                {g.label}
                <span className={`ml-1.5 ${garment === g.id ? 'text-rose-200' : 'text-stone-400'}`}>
                  {g.meters}
                </span>
              </button>
            ))}
          </div>

          {/* Mannequin card */}
          <div
            className="bg-white rounded-2xl shadow-md overflow-hidden flex items-end justify-center"
            style={{ minHeight: 540, padding: '24px 32px 0' }}
          >
            <MannequinDisplay
              garment={garment}
              size={size}
              fabricImg={selectedFabric?.img ?? null}
              tintColor={tintColor}
            />
          </div>

          {/* Selected info */}
          <div className="flex items-center gap-3 text-sm">
            {selectedFabric ? (
              <>
                <div
                  className="w-8 h-8 rounded-full border-2 border-white shadow"
                  style={{ backgroundImage: `url(${selectedFabric.img})`, backgroundSize: 'cover' }}
                />
                <span className="font-medium text-stone-700">{selectedFabric.name}</span>
                <span className="text-stone-400">·</span>
                <span className="text-rose-700 font-semibold">₹{selectedFabric.price}/m</span>
                <button
                  onClick={handleReset}
                  className="ml-2 p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500"
                  title="Reset"
                >
                  <RotateCcw size={14} />
                </button>
              </>
            ) : (
              <span className="text-stone-400 italic">← Select a fabric to preview on the mannequin</span>
            )}
          </div>
        </div>

        {/* ── RIGHT: Selection panel ───────────────────────── */}
        <div className="flex flex-col gap-6">

          {/* Fabric picker */}
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-stone-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-stone-700 uppercase tracking-wider">Choose Fabric</h2>
              <Link href="/fabrics" className="text-xs text-rose-600 hover:underline">
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              {visibleFabrics.map(f => (
                <button
                  key={f.id}
                  onClick={() => { setFabric(f); setTintColor(null) }}
                  className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                    selectedFabric?.id === f.id
                      ? 'border-rose-600 shadow-md scale-105'
                      : 'border-transparent hover:border-stone-300'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.img} alt={f.name} className="w-full h-full object-cover" />
                  {selectedFabric?.id === f.id && (
                    <div className="absolute inset-0 bg-rose-600/20 flex items-center justify-center">
                      <Check size={16} className="text-white drop-shadow" />
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-1">
                    <p className="text-white text-[9px] font-medium leading-tight truncate">{f.name}</p>
                    <p className="text-rose-200 text-[9px]">₹{f.price}/m</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Fabric pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setFabricPage(p => Math.max(0, p - 1))}
                  disabled={fabricPage === 0}
                  className="p-1 rounded-full hover:bg-stone-100 disabled:opacity-30"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs text-stone-400">{fabricPage + 1} / {totalPages}</span>
                <button
                  onClick={() => setFabricPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={fabricPage === totalPages - 1}
                  className="p-1 rounded-full hover:bg-stone-100 disabled:opacity-30"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Color tones */}
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-stone-100">
            <h2 className="text-sm font-bold text-stone-700 uppercase tracking-wider mb-3">
              Or Apply a Color Tone
            </h2>
            <div className="grid grid-cols-6 gap-2">
              {COLOR_TONES.map(c => (
                <button
                  key={c.hex}
                  title={c.name}
                  onClick={() => { setTintColor(c.hex); setFabric(null) }}
                  className={`w-full aspect-square rounded-full border-2 transition-all hover:scale-110 ${
                    tintColor === c.hex ? 'border-stone-700 scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
            {tintColor && !selectedFabric && (
              <button
                onClick={handleReset}
                className="mt-3 text-xs text-stone-400 hover:text-stone-600 flex items-center gap-1"
              >
                <RotateCcw size={12} /> Clear color
              </button>
            )}
          </div>

          {/* Fabric details + CTA */}
          {selectedFabric && (
            <div className="bg-rose-50 rounded-2xl p-5 border border-rose-100">
              <p className="text-xs text-stone-500 uppercase tracking-wider mb-1">{selectedFabric.category}</p>
              <h3 className="text-lg font-bold text-stone-800 mb-1">{selectedFabric.name}</h3>
              <p className="text-2xl font-bold text-rose-700 mb-4">
                ₹{selectedFabric.price}
                <span className="text-sm font-normal text-stone-500 ml-1">per metre</span>
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3 bg-rose-800 text-white rounded-xl font-semibold hover:bg-rose-900 transition-colors flex items-center justify-center gap-2"
                >
                  {addedToCart ? (
                    <><Check size={16} /> Added to Cart</>
                  ) : (
                    <><ShoppingBag size={16} /> Add to Cart</>
                  )}
                </button>
                <Link
                  href={`/fabrics/${selectedFabric.slug}`}
                  className="w-full py-2.5 border border-rose-300 text-rose-700 rounded-xl text-sm font-medium hover:bg-rose-100 transition-colors text-center"
                >
                  View Full Details
                </Link>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 text-xs text-stone-500 leading-relaxed">
            <p className="font-semibold text-stone-600 mb-1">How it works</p>
            <p>1. Choose Adult or Kids mannequin</p>
            <p>2. Select garment type (Saree, Lehenga, etc.)</p>
            <p>3. Pick a fabric — it drapes over the mannequin</p>
            <p>4. Add to cart when you&apos;re happy with the look</p>
          </div>
        </div>
      </div>
    </div>
  )
}
