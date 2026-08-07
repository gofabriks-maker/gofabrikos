'use client'
import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Search, Plus, Download, Edit2, Trash2, ToggleLeft, ToggleRight,
  ChevronLeft, ChevronRight, Package,
  CheckCircle, XCircle, Clock, Star, Loader2
} from 'lucide-react'

interface Product {
  id: string; name: string; sku: string; category: string
  fabricType: string; price: number; originalPrice: number
  stock: number; status: 'approved' | 'draft' | 'pending_review'
  isActive: boolean; isNew: boolean; isTrending: boolean
  rating: number; reviews: number; sold: number
  image?: string; gsm?: number; color: string
}

const STATUS_CFG = {
  approved:       { label: 'Active',          cls: 'bg-green-100 text-green-700',  icon: CheckCircle },
  pending_review: { label: 'Pending Review',  cls: 'bg-amber-100 text-amber-700',  icon: Clock },
  draft:          { label: 'Draft',           cls: 'bg-stone-100 text-stone-500',  icon: XCircle },
}

function mapRow(p: any): Product {
  // Resolve image URL
  let image = p.cloudinary_url || ''
  if (!image && Array.isArray(p.images) && p.images.length > 0) {
    const first = p.images[0]
    image = typeof first === 'string' ? first : first?.url || ''
  }

  // Derive status badge: if is_active → treat as approved, else use p.status
  const status: Product['status'] =
    p.is_active ? 'approved' : (p.status === 'draft' ? 'draft' : 'pending_review')

  return {
    id:            String(p.id),
    name:          p.name || '',
    sku:           p.sku  || '',
    category:      p.category || '',
    fabricType:    p.fabric_type || '',
    price:         Number(p.price) || 0,
    originalPrice: Number(p.original_price || p.price) || 0,
    stock:         Number(p.stock_metres) || 0,
    status,
    isActive:      !!p.is_active,
    isNew:         !!p.is_new_arrival,
    isTrending:    !!p.is_trending,
    rating:        Number(p.avg_rating) || 0,
    reviews:       Number(p.review_count) || 0,
    sold:          Number(p.purchase_count) || 0,
    image:         image || undefined,
    gsm:           p.gsm ? Number(p.gsm) : undefined,
    color:         p.color || '',
  }
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading,  setLoading]  = useState(true)
  const [loadErr,  setLoadErr]  = useState('')

  const [search,     setSearch]  = useState('')
  const [catFilter,  setCat]     = useState('all')
  const [statFilter, setStat]    = useState('all')
  const [selected,   setSelected]= useState<string[]>([])
  const [page,       setPage]    = useState(1)
  const PER = 10

  // Fetch from API (which reads gf_products)
  useEffect(() => {
    setLoading(true)
    fetch('/api/admin/products?limit=200')
      .then(r => r.json())
      .then(json => {
        if (json.error) { setLoadErr(json.error); return }
        setProducts((json.data || []).map(mapRow))
      })
      .catch(() => setLoadErr('Failed to load products'))
      .finally(() => setLoading(false))
  }, [])

  async function toggleActive(id: string) {
    const p = products.find(x => x.id === id)
    if (!p) return
    // Optimistic update
    setProducts(prev => prev.map(x => x.id === id ? { ...x, isActive: !x.isActive } : x))
    await fetch('/api/admin/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_active: !p.isActive }),
    })
  }

  async function deleteProduct(id: string) {
    if (!confirm('Delete this product? This cannot be undone.')) return
    setProducts(prev => prev.filter(x => x.id !== id))
    await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' })
  }

  const cats = ['all', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))]

  const filtered = useMemo(() => products.filter(p => {
    const ms  = !search || [p.name, p.sku, p.fabricType, p.color].some(f => f.toLowerCase().includes(search.toLowerCase()))
    const mc  = catFilter  === 'all' || p.category === catFilter
    const mst = statFilter === 'all' || p.status   === statFilter
    return ms && mc && mst
  }), [products, search, catFilter, statFilter])

  const paginated  = filtered.slice((page - 1) * PER, page * PER)
  const totalPages = Math.ceil(filtered.length / PER)

  const toggleSelect = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  const allSelected = paginated.length > 0 && paginated.every(p => selected.includes(p.id))

  const discPct = (p: Product) =>
    p.originalPrice > p.price ? Math.round((1 - p.price / p.originalPrice) * 100) : 0

  const stats = {
    total:    products.length,
    active:   products.filter(p => p.isActive).length,
    draft:    products.filter(p => p.status === 'draft').length,
    pending:  products.filter(p => p.status === 'pending_review').length,
    lowStock: products.filter(p => p.stock > 0 && p.stock < 15).length,
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Products</h2>
          <p className="text-sm text-stone-500">{filtered.length} of {products.length} products</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 border border-stone-200 bg-white text-stone-600 text-sm px-3 py-2 rounded-xl hover:bg-stone-50">
            <Download size={14} /> Export
          </button>
          <Link href="/admin/products/new"
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold px-4 py-2 rounded-xl">
            <Plus size={14} /> Add Product
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {[
          { label: 'Total',     value: stats.total,    color: 'text-stone-900' },
          { label: 'Active',    value: stats.active,   color: 'text-green-600' },
          { label: 'Draft',     value: stats.draft,    color: 'text-stone-500' },
          { label: 'Pending',   value: stats.pending,  color: 'text-amber-600' },
          { label: 'Low Stock', value: stats.lowStock, color: 'text-red-500'   },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-stone-200 px-4 py-3 text-center">
            <p className={`text-xl font-bold ${s.color}`}>{loading ? '…' : s.value}</p>
            <p className="text-xs text-stone-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Error */}
      {loadErr && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          ✕ {loadErr}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search name, SKU, fabric type…"
              className="w-full pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400"
            />
          </div>
          <select value={catFilter} onChange={e => { setCat(e.target.value); setPage(1) }}
            className="px-3 py-2 rounded-xl text-sm border border-stone-200 bg-white text-stone-600 focus:outline-none">
            {cats.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
          </select>
          <select value={statFilter} onChange={e => { setStat(e.target.value); setPage(1) }}
            className="px-3 py-2 rounded-xl text-sm border border-stone-200 bg-white text-stone-600 focus:outline-none">
            <option value="all">All Status</option>
            <option value="approved">Active</option>
            <option value="pending_review">Pending Review</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        {selected.length > 0 && (
          <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 rounded-xl px-4 py-2.5">
            <span className="text-xs font-semibold text-rose-700">{selected.length} selected</span>
            <button className="text-xs text-rose-600 hover:underline">Activate</button>
            <button className="text-xs text-rose-600 hover:underline">Deactivate</button>
            <button className="text-xs text-rose-600 hover:underline">Delete</button>
            <button className="ml-auto text-xs text-stone-500" onClick={() => setSelected([])}>Clear</button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-2 text-stone-400">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm">Loading products…</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50 text-left text-xs font-semibold text-stone-400">
                  <th className="px-4 py-3">
                    <input type="checkbox" checked={allSelected}
                      onChange={() => setSelected(allSelected ? [] : paginated.map(p => p.id))}
                      className="rounded" />
                  </th>
                  <th className="px-4 py-3">PRODUCT</th>
                  <th className="px-4 py-3">CATEGORY</th>
                  <th className="px-4 py-3">FABRIC</th>
                  <th className="px-4 py-3 text-right">PRICE</th>
                  <th className="px-4 py-3 text-right">STOCK</th>
                  <th className="px-4 py-3">RATING</th>
                  <th className="px-4 py-3">STATUS</th>
                  <th className="px-4 py-3">ACTIVE</th>
                  <th className="px-4 py-3 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={10} className="text-center py-16 text-stone-400 text-sm">
                      {products.length === 0
                        ? 'No products yet — click "Add Product" to create your first.'
                        : 'No products match the current filters.'}
                    </td>
                  </tr>
                )}
                {paginated.map(p => {
                  const scfg  = STATUS_CFG[p.status]
                  const SIcon = scfg.icon
                  return (
                    <tr key={p.id} className={`hover:bg-stone-50 transition-colors ${selected.includes(p.id) ? 'bg-rose-50' : ''}`}>
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleSelect(p.id)} className="rounded" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0 flex items-center justify-center">
                            {p.image ? (
                              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                              <Package size={16} className="text-stone-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-stone-800 max-w-[160px] truncate">{p.name}</p>
                            <p className="text-xs text-stone-400 font-mono">{p.sku}</p>
                            <div className="flex gap-1 mt-0.5">
                              {p.isNew      && <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 rounded font-semibold">NEW</span>}
                              {p.isTrending && <span className="text-[10px] bg-rose-100 text-rose-600 px-1.5 rounded font-semibold">🔥</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-stone-600">{p.category || '—'}</td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-stone-600">{p.fabricType || '—'}</p>
                        {p.gsm && <p className="text-xs text-stone-400">{p.gsm} GSM</p>}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <p className="text-sm font-bold text-stone-900">₹{p.price}/m</p>
                        {p.originalPrice > p.price && <>
                          <p className="text-xs text-stone-400 line-through">₹{p.originalPrice}</p>
                          <span className="text-[10px] text-green-600 font-semibold">{discPct(p)}% off</span>
                        </>}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`text-sm font-bold ${p.stock === 0 ? 'text-red-600' : p.stock < 15 ? 'text-amber-600' : 'text-stone-800'}`}>
                          {p.stock === 0 ? 'Out' : `${p.stock}m`}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {p.rating > 0 ? (
                          <div className="flex items-center gap-1">
                            <Star size={12} className="text-amber-400 fill-amber-400" />
                            <span className="text-xs font-semibold text-stone-700">{p.rating}</span>
                            <span className="text-xs text-stone-400">({p.reviews})</span>
                          </div>
                        ) : <span className="text-xs text-stone-300">No reviews</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${scfg.cls}`}>
                          <SIcon size={10} />{scfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleActive(p.id)} className={`text-xl ${p.isActive ? 'text-green-500' : 'text-stone-300'}`}>
                          {p.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/products/${p.id}`}
                            className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-800">
                            <Edit2 size={14} />
                          </Link>
                          <button onClick={() => deleteProduct(p.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-600">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="border-t border-stone-100 px-4 py-3 flex items-center justify-between">
          <p className="text-xs text-stone-500">{filtered.length} products</p>
          <div className="flex items-center gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="p-1.5 rounded-lg border border-stone-200 disabled:opacity-40">
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs text-stone-600 px-2">Page {page} of {totalPages || 1}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
              className="p-1.5 rounded-lg border border-stone-200 disabled:opacity-40">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
