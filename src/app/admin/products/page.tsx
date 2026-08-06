'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Search, Plus, Download, Eye, Edit2, Trash2, ToggleLeft, ToggleRight,
  ChevronLeft, ChevronRight, Package, Star, TrendingUp, Image as ImageIcon,
  CheckCircle, XCircle, Clock, Filter
} from 'lucide-react'

interface Product {
  id: string; name: string; sku: string; category: string
  fabricType: string; price: number; originalPrice: number
  stock: number; status: 'approved'|'draft'|'pending_review'
  isActive: boolean; isNew: boolean; isTrending: boolean
  rating: number; reviews: number; sold: number
  image?: string; gsm?: number; color: string
}

const MOCK: Product[] = [
  { id:'1', name:'Banarasi Silk Brocade',    sku:'GF-BSB-001', category:'Designer Sarees', fabricType:'Silk',      price:850,  originalPrice:1200, stock:42,  status:'approved',      isActive:true,  isNew:false, isTrending:true,  rating:4.8, reviews:28, sold:284, color:'Red & Gold',  gsm:180 },
  { id:'2', name:'Pure Cotton Ikat Print',   sku:'GF-CTN-015', category:'Kurti Fabrics',   fabricType:'Cotton',    price:250,  originalPrice:320,  stock:87,  status:'approved',      isActive:true,  isNew:true,  isTrending:false, rating:4.5, reviews:14, sold:198, color:'Multi',       gsm:140 },
  { id:'3', name:'Georgette Floral Digital', sku:'GF-GRG-022', category:'Lehenga Fabrics', fabricType:'Georgette', price:450,  originalPrice:600,  stock:23,  status:'approved',      isActive:true,  isNew:false, isTrending:true,  rating:4.7, reviews:21, sold:176, color:'Blue Floral', gsm:80  },
  { id:'4', name:'Rayon Solid Navy Blue',    sku:'GF-RYN-008', category:'Plain Fabrics',   fabricType:'Rayon',     price:200,  originalPrice:280,  stock:88,  status:'approved',      isActive:true,  isNew:false, isTrending:false, rating:4.2, reviews:8,  sold:154, color:'Navy Blue',   gsm:120 },
  { id:'5', name:'Velvet Embroidery Kurti',  sku:'GF-VLV-003', category:'Blouse Fabrics',  fabricType:'Velvet',    price:620,  originalPrice:850,  stock:8,   status:'approved',      isActive:true,  isNew:false, isTrending:false, rating:4.9, reviews:35, sold:132, color:'Maroon',      gsm:250 },
  { id:'6', name:'Organza Mirror Work',      sku:'GF-ORG-011', category:'Lehenga Fabrics', fabricType:'Organza',   price:750,  originalPrice:1000, stock:12,  status:'approved',      isActive:true,  isNew:true,  isTrending:true,  rating:4.6, reviews:19, sold:98,  color:'Champagne',   gsm:70  },
  { id:'7', name:'Chanderi Cotton Blend',    sku:'GF-CHD-005', category:'Kurti Fabrics',   fabricType:'Chanderi',  price:420,  originalPrice:550,  stock:3,   status:'approved',      isActive:true,  isNew:false, isTrending:false, rating:4.4, reviews:11, sold:88,  color:'Ivory',       gsm:100 },
  { id:'8', name:'Linen Stripe Natural',     sku:'GF-LNN-002', category:'Plain Fabrics',   fabricType:'Linen',     price:320,  originalPrice:420,  stock:72,  status:'approved',      isActive:true,  isNew:false, isTrending:false, rating:4.3, reviews:6,  sold:76,  color:'Natural',     gsm:160 },
  { id:'9', name:'Chiffon Printed Dupatta',  sku:'GF-CHF-009', category:'Dupattas',        fabricType:'Chiffon',   price:380,  originalPrice:480,  stock:0,   status:'approved',      isActive:false, isNew:false, isTrending:false, rating:4.1, reviews:4,  sold:64,  color:'Pink Print',  gsm:60  },
  { id:'10',name:'Digital Print Kurti',      sku:'GF-DGP-020', category:'Kurti Fabrics',   fabricType:'Cotton',    price:390,  originalPrice:490,  stock:45,  status:'approved',      isActive:true,  isNew:true,  isTrending:false, rating:4.5, reviews:9,  sold:58,  color:'Multi Print', gsm:130 },
  { id:'11',name:'Kalamkari Block Print',    sku:'GF-KLM-001', category:'Kurti Fabrics',   fabricType:'Cotton',    price:480,  originalPrice:620,  stock:30,  status:'pending_review', isActive:false, isNew:true,  isTrending:false, rating:0,   reviews:0,  sold:0,   color:'Earthy',      gsm:140 },
  { id:'12',name:'Ajrakh Hand Block',        sku:'GF-AJR-002', category:'Plain Fabrics',   fabricType:'Cotton',    price:520,  originalPrice:680,  stock:25,  status:'draft',          isActive:false, isNew:true,  isTrending:false, rating:0,   reviews:0,  sold:0,   color:'Indigo',      gsm:150 },
  { id:'13',name:'Bandhani Silk Dupatta',    sku:'GF-BND-003', category:'Dupattas',        fabricType:'Silk',      price:680,  originalPrice:900,  stock:18,  status:'draft',          isActive:false, isNew:true,  isTrending:false, rating:0,   reviews:0,  sold:0,   color:'Yellow',      gsm:90  },
]

const STATUS_CFG = {
  approved:      { label:'Active',         cls:'bg-green-100 text-green-700',  icon: CheckCircle },
  pending_review:{ label:'Pending Review', cls:'bg-amber-100 text-amber-700',  icon: Clock },
  draft:         { label:'Draft',          cls:'bg-stone-100 text-stone-500',  icon: XCircle },
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(MOCK)
  const [search, setSearch]     = useState('')
  const [catFilter, setCat]     = useState('all')
  const [statFilter, setStat]   = useState('all')
  const [selected, setSelected] = useState<string[]>([])
  const [page, setPage]         = useState(1)
  const PER = 10

  const cats = ['all', ...Array.from(new Set(products.map(p => p.category)))]

  const filtered = useMemo(() => products.filter(p => {
    const ms = !search || [p.name,p.sku,p.fabricType,p.color].some(f => f.toLowerCase().includes(search.toLowerCase()))
    const mc = catFilter === 'all' || p.category === catFilter
    const mst = statFilter === 'all' || p.status === statFilter
    return ms && mc && mst
  }), [products, search, catFilter, statFilter])

  const paginated = filtered.slice((page-1)*PER, page*PER)
  const totalPages = Math.ceil(filtered.length / PER)

  function toggleActive(id: string) {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p))
  }

  const stats = {
    total:   products.length,
    active:  products.filter(p => p.isActive).length,
    draft:   products.filter(p => p.status === 'draft').length,
    pending: products.filter(p => p.status === 'pending_review').length,
    lowStock:products.filter(p => p.stock > 0 && p.stock < 15).length,
  }

  const toggleSelect = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  const allSelected = paginated.length > 0 && paginated.every(p => selected.includes(p.id))

  const discPct = (p: Product) => Math.round((1 - p.price/p.originalPrice) * 100)

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-stone-900">Products</h2>
          <p className="text-sm text-stone-500">{filtered.length} of {products.length} products</p></div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 border border-stone-200 bg-white text-stone-600 text-sm px-3 py-2 rounded-xl hover:bg-stone-50"><Download size={14} />Export</button>
          <Link href="/admin/products/new"
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold px-4 py-2 rounded-xl">
            <Plus size={14} />Add Product
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {[
          { label:'Total',     value: stats.total,    color:'text-stone-900' },
          { label:'Active',    value: stats.active,   color:'text-green-600' },
          { label:'Draft',     value: stats.draft,    color:'text-stone-500' },
          { label:'Pending',   value: stats.pending,  color:'text-amber-600' },
          { label:'Low Stock', value: stats.lowStock, color:'text-red-500' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-stone-200 px-4 py-3 text-center">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-stone-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}}
              placeholder="Search name, SKU, fabric type, color…"
              className="w-full pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400" />
          </div>
          <select value={catFilter} onChange={e=>{setCat(e.target.value);setPage(1)}}
            className="px-3 py-2 rounded-xl text-sm border border-stone-200 bg-white text-stone-600 focus:outline-none">
            {cats.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
          </select>
          <select value={statFilter} onChange={e=>{setStat(e.target.value);setPage(1)}}
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
            <button className="ml-auto text-xs text-stone-500" onClick={()=>setSelected([])}>Clear</button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50 text-left text-xs font-semibold text-stone-400">
                <th className="px-4 py-3">
                  <input type="checkbox" checked={allSelected}
                    onChange={()=>setSelected(allSelected?[]:paginated.map(p=>p.id))} className="rounded" />
                </th>
                <th className="px-4 py-3">PRODUCT</th>
                <th className="px-4 py-3">CATEGORY</th>
                <th className="px-4 py-3">FABRIC</th>
                <th className="px-4 py-3 text-right">PRICE</th>
                <th className="px-4 py-3 text-right">STOCK</th>
                <th className="px-4 py-3 text-right">SOLD</th>
                <th className="px-4 py-3">RATING</th>
                <th className="px-4 py-3">STATUS</th>
                <th className="px-4 py-3">ACTIVE</th>
                <th className="px-4 py-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {paginated.length === 0 && <tr><td colSpan={11} className="text-center py-12 text-stone-400 text-sm">No products found</td></tr>}
              {paginated.map(p => {
                const scfg = STATUS_CFG[p.status]
                const SIcon = scfg.icon
                return (
                  <tr key={p.id} className={`hover:bg-stone-50 transition-colors ${selected.includes(p.id)?'bg-rose-50':''}`}>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.includes(p.id)} onChange={()=>toggleSelect(p.id)} className="rounded" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center shrink-0">
                          <Package size={16} className="text-stone-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-stone-800 max-w-[160px] truncate">{p.name}</p>
                          <p className="text-xs text-stone-400 font-mono">{p.sku}</p>
                          <div className="flex gap-1 mt-0.5">
                            {p.isNew && <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 rounded font-semibold">NEW</span>}
                            {p.isTrending && <span className="text-[10px] bg-rose-100 text-rose-600 px-1.5 rounded font-semibold">🔥</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-stone-600">{p.category}</td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-stone-600">{p.fabricType}</p>
                      <p className="text-xs text-stone-400">{p.color}</p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <p className="text-sm font-bold text-stone-900">₹{p.price}/m</p>
                      <p className="text-xs text-stone-400 line-through">₹{p.originalPrice}</p>
                      <span className="text-[10px] text-green-600 font-semibold">{discPct(p)}% off</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-sm font-bold ${p.stock === 0 ? 'text-red-600' : p.stock < 15 ? 'text-amber-600' : 'text-stone-800'}`}>
                        {p.stock === 0 ? 'Out' : `${p.stock}m`}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-stone-600">{p.sold > 0 ? `${p.sold}m` : '—'}</td>
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
                      <button onClick={()=>toggleActive(p.id)} className={`text-xl ${p.isActive?'text-green-500':'text-stone-300'}`}>
                        {p.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/products/${p.id}`}
                          className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-800">
                          <Edit2 size={14} />
                        </Link>
                        <button className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-600">
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
        <div className="border-t border-stone-100 px-4 py-3 flex items-center justify-between">
          <p className="text-xs text-stone-500">{filtered.length} products</p>
          <div className="flex items-center gap-2">
            <button disabled={page===1} onClick={()=>setPage(p=>p-1)} className="p-1.5 rounded-lg border border-stone-200 disabled:opacity-40"><ChevronLeft size={14}/></button>
            <span className="text-xs text-stone-600 px-2">Page {page} of {totalPages||1}</span>
            <button disabled={page>=totalPages} onClick={()=>setPage(p=>p+1)} className="p-1.5 rounded-lg border border-stone-200 disabled:opacity-40"><ChevronRight size={14}/></button>
          </div>
        </div>
      </div>
    </div>
  )
}
