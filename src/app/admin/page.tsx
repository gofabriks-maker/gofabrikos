'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Package, ShoppingBag, Users, TrendingUp, Eye, RefreshCw,
  CheckCircle, Clock, Truck, XCircle, ChevronDown, Search,
  BarChart2, MessageSquare, Star, ArrowUpRight, Edit2, Save,
  X, AlertCircle, Layers, Mail, Phone
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────
type OrderStatus = 'confirmed' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled'

interface Order {
  id: number
  order_number: string
  customer_name: string
  customer_mobile: string
  customer_email?: string
  status: OrderStatus
  total: number
  payment_method: string
  created_at: string
  shipping_address: { city?: string; state?: string; pin?: string }
}

interface Product {
  id: number
  slug: string
  name: string
  price: number
  stock_left: number
  is_active: boolean
  category: string
  rating: number
  ratings_count: number
}

interface SwatchRequest {
  id: number
  name: string
  mobile: string
  city: string
  status: string
  created_at: string
}

interface WholesaleEnquiry {
  id: number
  business_name: string
  contact_name: string
  mobile: string
  city: string
  monthly_volume?: string
  status: string
  created_at: string
}

// ── Status colours ────────────────────────────────────────────────────────────
const STATUS_COLORS: Record<OrderStatus, string> = {
  confirmed:  'bg-blue-100 text-blue-700',
  processing: 'bg-yellow-100 text-yellow-700',
  packed:     'bg-purple-100 text-purple-700',
  shipped:    'bg-indigo-100 text-indigo-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
}
const STATUS_ICON: Record<OrderStatus, React.ReactNode> = {
  confirmed:  <CheckCircle size={12} />,
  processing: <Clock size={12} />,
  packed:     <Package size={12} />,
  shipped:    <Truck size={12} />,
  delivered:  <CheckCircle size={12} />,
  cancelled:  <XCircle size={12} />,
}

// ── Mock fallback data ────────────────────────────────────────────────────────
const MOCK_ORDERS: Order[] = [
  { id:1, order_number:'GF-2026-0001', customer_name:'Lakshmi Sowjanya', customer_mobile:'9581734837', customer_email:'sowjanya@gofabrikos.com', status:'delivered', total:3850, payment_method:'UPI', created_at:'2026-07-20T10:30:00Z', shipping_address:{ city:'Guntur', state:'Andhra Pradesh', pin:'522001' } },
  { id:2, order_number:'GF-2026-0002', customer_name:'Priya Sharma', customer_mobile:'9876543210', status:'shipped', total:1299, payment_method:'Card', created_at:'2026-07-22T14:15:00Z', shipping_address:{ city:'Hyderabad', state:'Telangana', pin:'500001' } },
  { id:3, order_number:'GF-2026-0003', customer_name:'Anita Reddy', customer_mobile:'8765432109', status:'processing', total:640, payment_method:'COD', created_at:'2026-07-25T09:00:00Z', shipping_address:{ city:'Vijayawada', state:'Andhra Pradesh', pin:'520001' } },
  { id:4, order_number:'GF-2026-0004', customer_name:'Meena Patel', customer_mobile:'7654321098', status:'confirmed', total:2400, payment_method:'UPI', created_at:'2026-07-28T06:45:00Z', shipping_address:{ city:'Mumbai', state:'Maharashtra', pin:'400001' } },
]

const MOCK_PRODUCTS: Product[] = [
  { id:1, slug:'mull-chanderi-digital-print',    name:'Mull Chanderi Digital Print',   price:125,  stock_left:28, is_active:true,  category:'Chanderi',   rating:4.7, ratings_count:2189 },
  { id:2, slug:'pure-silk-banarasi-brocade',     name:'Pure Silk Banarasi Brocade',    price:850,  stock_left:14, is_active:true,  category:'Banarasi',   rating:4.8, ratings_count:1872 },
  { id:3, slug:'handloom-khadi-cotton',          name:'Handloom Khadi Cotton',         price:280,  stock_left:52, is_active:true,  category:'Khadi',      rating:4.7, ratings_count:1456 },
  { id:4, slug:'kanjivaram-pure-silk',           name:'Kanjivaram Pure Silk',          price:1200, stock_left:8,  is_active:true,  category:'Kanjivaram', rating:5.0, ratings_count:892 },
  { id:5, slug:'georgette-embroidered',          name:'Georgette Embroidered',         price:320,  stock_left:35, is_active:true,  category:'Georgette',  rating:4.6, ratings_count:2034 },
  { id:6, slug:'linen-slub-plain',               name:'Linen Slub Plain',              price:380,  stock_left:41, is_active:true,  category:'Linen',      rating:4.5, ratings_count:1123 },
  { id:7, slug:'cotton-ikat-double',             name:'Cotton Ikat Double',            price:450,  stock_left:23, is_active:true,  category:'Ikat',       rating:4.8, ratings_count:1567 },
  { id:8, slug:'mysore-silk-plain',              name:'Mysore Silk Plain',             price:680,  stock_left:19, is_active:true,  category:'Mysore Silk',rating:4.6, ratings_count:978 },
  { id:9, slug:'handblock-dabu-print-cotton',    name:'Handblock Dabu Print Cotton',   price:380,  stock_left:45, is_active:true,  category:'Block Print', rating:4.7, ratings_count:1345 },
  { id:10, slug:'pashmina-wool-blend',           name:'Pashmina Wool Blend',           price:950,  stock_left:12, is_active:true,  category:'Pashmina',   rating:4.9, ratings_count:654 },
  { id:11, slug:'sambalpuri-ikat-silk',          name:'Sambalpuri Ikat Silk',          price:780,  stock_left:16, is_active:true,  category:'Ikat',       rating:4.8, ratings_count:789 },
  { id:12, slug:'raw-silk-dupion',               name:'Raw Silk Dupion',               price:520,  stock_left:31, is_active:true,  category:'Raw Silk',   rating:4.7, ratings_count:1102 },
]

const MOCK_SWATCHES: SwatchRequest[] = [
  { id:1, name:'Kavya Nair',       mobile:'9988776655', city:'Kochi',        status:'pending',    created_at:'2026-07-26T08:00:00Z' },
  { id:2, name:'Sunita Verma',     mobile:'8877665544', city:'Delhi',        status:'dispatched', created_at:'2026-07-24T12:00:00Z' },
  { id:3, name:'Radhika Krishnan', mobile:'7766554433', city:'Chennai',      status:'delivered',  created_at:'2026-07-22T10:00:00Z' },
]

const MOCK_WHOLESALE: WholesaleEnquiry[] = [
  { id:1, business_name:'Sree Textiles',   contact_name:'Ravi Kumar',   mobile:'9876501234', city:'Vijayawada', monthly_volume:'₹2–5L', status:'new',       created_at:'2026-07-27T09:00:00Z' },
  { id:2, business_name:'Rani Boutique',   contact_name:'Rani Devi',    mobile:'8765012345', city:'Guntur',     monthly_volume:'₹50K–1L',status:'contacted', created_at:'2026-07-25T14:00:00Z' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(date: string) {
  return new Date(date).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
}
function fmtCur(n: number) {
  return '₹' + n.toLocaleString('en-IN')
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [tab, setTab] = useState<'overview'|'orders'|'products'|'swatches'|'wholesale'>('overview')
  const [orders, setOrders]       = useState<Order[]>(MOCK_ORDERS)
  const [products, setProducts]   = useState<Product[]>(MOCK_PRODUCTS)
  const [swatches, setSwatches]   = useState<SwatchRequest[]>(MOCK_SWATCHES)
  const [wholesale, setWholesale] = useState<WholesaleEnquiry[]>(MOCK_WHOLESALE)
  const [search, setSearch]       = useState('')
  const [editingProduct, setEditingProduct] = useState<number|null>(null)
  const [editPrice, setEditPrice]  = useState('')
  const [editStock, setEditStock]  = useState('')
  const [savingId, setSavingId]    = useState<number|null>(null)
  const [updatingOrder, setUpdatingOrder] = useState<number|null>(null)

  // Try to load from Supabase
  useEffect(() => {
    async function load() {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const sb = createClient()
        const [{ data: ord }, { data: prod }, { data: sw }, { data: ws }] = await Promise.all([
          sb.from('orders').select('*').order('created_at', { ascending: false }),
          sb.from('products').select('id,slug,name,price,stock_left,is_active,category,rating,ratings_count').order('id'),
          sb.from('swatch_requests').select('*').order('created_at', { ascending: false }),
          sb.from('wholesale_enquiries').select('*').order('created_at', { ascending: false }),
        ])
        if (ord  && ord.length  > 0) setOrders(ord as Order[])
        if (prod && prod.length > 0) setProducts(prod as Product[])
        if (sw   && sw.length   > 0) setSwatches(sw as SwatchRequest[])
        if (ws   && ws.length   > 0) setWholesale(ws as WholesaleEnquiry[])
      } catch { /* use mock data */ }
    }
    load()
  }, [])

  async function updateOrderStatus(id: number, status: OrderStatus) {
    setUpdatingOrder(id)
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const sb = createClient()
      await sb.from('orders').update({ status }).eq('id', id)
    } catch {}
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    setUpdatingOrder(null)
  }

  async function saveProduct(id: number) {
    setSavingId(id)
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const sb = createClient()
      await sb.from('products').update({
        price: Number(editPrice),
        stock_left: Number(editStock),
      }).eq('id', id)
    } catch {}
    setProducts(prev => prev.map(p => p.id === id
      ? { ...p, price: Number(editPrice), stock_left: Number(editStock) }
      : p))
    setSavingId(null)
    setEditingProduct(null)
  }

  async function toggleActive(id: number, current: boolean) {
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const sb = createClient()
      await sb.from('products').update({ is_active: !current }).eq('id', id)
    } catch {}
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: !current } : p))
  }

  // Stats
  const totalRevenue   = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)
  const pendingOrders  = orders.filter(o => !['delivered','cancelled'].includes(o.status)).length
  const lowStock       = products.filter(p => p.stock_left < 15).length
  const newEnquiries   = wholesale.filter(w => w.status === 'new').length

  const TABS = [
    { key:'overview',   label:'Overview',   icon:<BarChart2 size={15}/> },
    { key:'orders',     label:'Orders',     icon:<ShoppingBag size={15}/>, badge: orders.length },
    { key:'products',   label:'Products',   icon:<Package size={15}/>,    badge: lowStock },
    { key:'swatches',   label:'Swatches',   icon:<Star size={15}/> },
    { key:'wholesale',  label:'Wholesale',  icon:<Users size={15}/>,      badge: newEnquiries },
  ]

  const filteredOrders   = orders.filter(o =>
    o.order_number.toLowerCase().includes(search.toLowerCase()) ||
    o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    o.customer_mobile.includes(search) ||
    o.status.toLowerCase().includes(search.toLowerCase()))
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-stone-400 hover:text-white text-sm">← Website</Link>
          <span className="text-stone-600">|</span>
          <span className="font-bold text-lg">GoFabrikos Admin</span>
          <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full font-semibold">DASHBOARD</span>
        </div>
        <div className="text-xs text-stone-400">Prop: Lakshmi Sowjanya Aaki · Guntur, AP</div>
      </div>

      {/* Tab Bar */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.key} onClick={() => { setTab(t.key as typeof tab); setSearch('') }}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                tab === t.key ? 'border-stone-800 text-stone-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t.icon} {t.label}
              {t.badge ? <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">{t.badge}</span> : null}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label:'Total Revenue',    value: fmtCur(totalRevenue),  icon:<TrendingUp size={20}/>,   color:'text-green-600',  bg:'bg-green-50' },
                { label:'Pending Orders',   value: pendingOrders,          icon:<Clock size={20}/>,        color:'text-amber-600',  bg:'bg-amber-50' },
                { label:'Total Products',   value: products.length,        icon:<Package size={20}/>,      color:'text-blue-600',   bg:'bg-blue-50' },
                { label:'Low Stock Items',  value: lowStock,               icon:<AlertCircle size={20}/>,  color:'text-red-600',    bg:'bg-red-50' },
              ].map(stat => (
                <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className={`w-10 h-10 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>{stat.icon}</div>
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">Recent Orders</h2>
                <button onClick={() => setTab('orders')} className="text-xs text-blue-600 hover:underline flex items-center gap-1">View all <ArrowUpRight size={12}/></button>
              </div>
              <div className="divide-y divide-gray-50">
                {orders.slice(0,4).map(o => (
                  <div key={o.id} className="flex items-center justify-between px-6 py-3">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{o.order_number}</div>
                      <div className="text-xs text-gray-500">{o.customer_name} · {fmt(o.created_at)}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-sm">{fmtCur(o.total)}</span>
                      <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[o.status]}`}>
                        {STATUS_ICON[o.status]} {o.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Low Stock Alert */}
            {lowStock > 0 && (
              <div className="bg-white rounded-xl border border-red-200">
                <div className="flex items-center gap-2 px-6 py-4 border-b border-red-100">
                  <AlertCircle size={16} className="text-red-500"/>
                  <h2 className="font-semibold text-red-700">Low Stock Alert</h2>
                </div>
                <div className="divide-y divide-gray-50">
                  {products.filter(p => p.stock_left < 15).map(p => (
                    <div key={p.id} className="flex items-center justify-between px-6 py-3">
                      <div className="text-sm font-medium text-gray-900">{p.name}</div>
                      <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">{p.stock_left}m left</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ORDERS ── */}
        {tab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search by order no, name, mobile..."
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300"/>
              </div>
              <span className="text-sm text-gray-500">{filteredOrders.length} orders</span>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto"><table className="w-full text-sm min-w-[600px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Order #','Customer','Date','Amount','Payment','Status','Action'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredOrders.map(o => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-600">{o.order_number}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{o.customer_name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1"><Phone size={10}/>{o.customer_mobile}</div>
                        {o.shipping_address?.city && <div className="text-xs text-gray-400">{o.shipping_address.city}, {o.shipping_address.state}</div>}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{fmt(o.created_at)}</td>
                      <td className="px-4 py-3 font-bold text-gray-900">{fmtCur(o.total)}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{o.payment_method}</td>
                      <td className="px-4 py-3">
                        <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium w-fit ${STATUS_COLORS[o.status]}`}>
                          {STATUS_ICON[o.status]} {o.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={o.status}
                          disabled={updatingOrder === o.id}
                          onChange={e => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                          className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-stone-400 disabled:opacity-50">
                          {(['confirmed','processing','packed','shipped','delivered','cancelled'] as OrderStatus[]).map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table></div>
              {filteredOrders.length === 0 && (
                <div className="text-center py-12 text-gray-400">No orders found</div>
              )}
            </div>
          </div>
        )}

        {/* ── PRODUCTS ── */}
        {tab === 'products' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Link
                href="/admin/products/new"
                className="flex items-center gap-1.5 bg-primary text-white text-sm px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium flex-shrink-0"
              >
                <Package size={14} /> Add Product
              </Link>
              <div className="relative flex-1 max-w-sm">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300"/>
              </div>
              <span className="text-sm text-gray-500">{filteredProducts.length} products</span>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto"><table className="w-full text-sm min-w-[600px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Product','Category','Price (₹/m)','Stock','Rating','Active','Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredProducts.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link href={`/fabrics/${p.slug}`} className="font-medium text-gray-900 hover:text-blue-600">{p.name}</Link>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{p.category}</td>
                      <td className="px-4 py-3">
                        {editingProduct === p.id ? (
                          <input type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)}
                            className="w-20 border border-blue-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"/>
                        ) : (
                          <span className="font-semibold">₹{p.price}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editingProduct === p.id ? (
                          <input type="number" value={editStock} onChange={e => setEditStock(e.target.value)}
                            className="w-16 border border-blue-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"/>
                        ) : (
                          <span className={`font-semibold ${p.stock_left < 15 ? 'text-red-600' : 'text-green-600'}`}>
                            {p.stock_left}m
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 text-xs text-amber-600">
                          <Star size={11} className="fill-amber-400 text-amber-400"/> {p.rating} ({p.ratings_count})
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleActive(p.id, p.is_active)}
                          className={`relative inline-flex h-5 w-9 rounded-full transition-colors ${p.is_active ? 'bg-green-500' : 'bg-gray-300'}`}>
                          <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${p.is_active ? 'translate-x-4' : 'translate-x-0.5'}`}/>
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        {editingProduct === p.id ? (
                          <div className="flex gap-2">
                            <button onClick={() => saveProduct(p.id)} disabled={savingId === p.id}
                              className="text-xs bg-green-600 text-white px-2 py-1 rounded flex items-center gap-1 hover:bg-green-700 disabled:opacity-50">
                              <Save size={11}/> Save
                            </button>
                            <button onClick={() => setEditingProduct(null)}
                              className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300">
                              <X size={11}/>
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => { setEditingProduct(p.id); setEditPrice(String(p.price)); setEditStock(String(p.stock_left)) }}
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                            <Edit2 size={11}/> Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table></div>
            </div>
          </div>
        )}

        {/* ── SWATCHES ── */}
        {tab === 'swatches' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Free Swatch Requests</h2>
              <p className="text-xs text-gray-500 mt-1">{swatches.length} total requests</p>
            </div>
            <div className="overflow-x-auto"><table className="w-full text-sm min-w-[600px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['#','Name','Mobile','City','Status','Date'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {swatches.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400 text-xs">{s.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                    <td className="px-4 py-3 text-gray-600">{s.mobile}</td>
                    <td className="px-4 py-3 text-gray-600">{s.city}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        s.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        s.status === 'dispatched' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'}`}>{s.status}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{fmt(s.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table></div>
            {swatches.length === 0 && <div className="text-center py-12 text-gray-400">No swatch requests yet</div>}
          </div>
        )}

        {/* ── WHOLESALE ── */}
        {tab === 'wholesale' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">B2B Wholesale Enquiries</h2>
              <p className="text-xs text-gray-500 mt-1">{wholesale.length} total enquiries · {newEnquiries} new</p>
            </div>
            <div className="overflow-x-auto"><table className="w-full text-sm min-w-[600px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Business','Contact','Mobile','City','Volume','Status','Date'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {wholesale.map(w => (
                  <tr key={w.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{w.business_name}</td>
                    <td className="px-4 py-3 text-gray-600">{w.contact_name}</td>
                    <td className="px-4 py-3 text-gray-600">{w.mobile}</td>
                    <td className="px-4 py-3 text-gray-600">{w.city}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{w.monthly_volume || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        w.status === 'converted' ? 'bg-green-100 text-green-700' :
                        w.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                        w.status === 'closed'    ? 'bg-gray-100 text-gray-600' :
                        'bg-amber-100 text-amber-700'}`}>{w.status}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{fmt(w.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table></div>
            {wholesale.length === 0 && <div className="text-center py-12 text-gray-400">No wholesale enquiries yet</div>}
          </div>
        )}

      </div>
    </div>
  )
}
