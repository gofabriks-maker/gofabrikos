'use client'
import { useState, useMemo } from 'react'
import {
  Search, Plus, Download, Eye, Star, Phone, Mail,
  MapPin, ShoppingBag, TrendingUp, Users, Crown,
  ChevronRight, Gift, MessageSquare, Edit2,
  ChevronLeft, Filter, Award
} from 'lucide-react'

type CustomerType = 'retail' | 'wholesale' | 'vip' | 'dealer'

interface Customer {
  id: string; name: string; phone: string; email: string
  city: string; state: string; type: CustomerType
  orders: number; spent: number; points: number
  lastOrder: string; joined: string; tier?: string
  gstin?: string; business?: string; score: number
}

const MOCK: Customer[] = [
  { id:'1', name:'Ananya Reddy',    phone:'9876543210', email:'ananya@gmail.com',   city:'Hyderabad',  state:'TS', type:'retail',    orders:12, spent:28400,  points:284, lastOrder:'5 Aug 2026', joined:'Jan 2026', score:92 },
  { id:'2', name:'Priya Sharma',    phone:'9123456780', email:'priya@gmail.com',    city:'Delhi',      state:'DL', type:'retail',    orders:8,  spent:14200,  points:142, lastOrder:'5 Aug 2026', joined:'Feb 2026', score:78 },
  { id:'3', name:'Meena Patel',     phone:'9988776655', email:'meena@yahoo.com',    city:'Surat',      state:'GJ', type:'wholesale', orders:42, spent:186000, points:1860,lastOrder:'4 Aug 2026', joined:'Oct 2025', score:98, tier:'gold',     gstin:'24XXXXX0000X1Z5', business:'Meena Fashion House' },
  { id:'4', name:'Lakshmi Devi',    phone:'9765432109', email:'lakshmi@gmail.com',  city:'Chennai',    state:'TN', type:'vip',       orders:28, spent:94500,  points:945, lastOrder:'4 Aug 2026', joined:'Jun 2025', score:95 },
  { id:'5', name:'Sunita Kumari',   phone:'9654321098', email:'sunita@gmail.com',   city:'Bangalore',  state:'KA', type:'retail',    orders:3,  spent:4200,   points:42,  lastOrder:'3 Aug 2026', joined:'Jul 2026', score:45 },
  { id:'6', name:'Rekha Nair',      phone:'9543210987', email:'rekha@gmail.com',    city:'Kochi',      state:'KL', type:'wholesale', orders:56, spent:320000, points:3200,lastOrder:'3 Aug 2026', joined:'Aug 2025', score:99, tier:'platinum', gstin:'32XXXXX0000X1Z8', business:'Rekha Textiles Pvt Ltd' },
  { id:'7', name:'Deepa Varma',     phone:'9432109876', email:'deepa@gmail.com',    city:'Pune',       state:'MH', type:'retail',    orders:5,  spent:8900,   points:89,  lastOrder:'2 Aug 2026', joined:'Mar 2026', score:60 },
  { id:'8', name:'Kavitha Rao',     phone:'9321098765', email:'kavitha@gmail.com',  city:'Guntur',     state:'AP', type:'vip',       orders:35, spent:112000, points:1120,lastOrder:'2 Aug 2026', joined:'Jan 2025', score:97 },
  { id:'9', name:'Pooja Singh',     phone:'9210987654', email:'pooja@gmail.com',    city:'Delhi',      state:'DL', type:'retail',    orders:2,  spent:1800,   points:18,  lastOrder:'1 Aug 2026', joined:'Jul 2026', score:30 },
  { id:'10',name:'Fatima Shaikh',   phone:'9109876543', email:'fatima@gmail.com',   city:'Mumbai',     state:'MH', type:'dealer',    orders:88, spent:540000, points:5400,lastOrder:'31 Jul 2026',joined:'May 2024', score:99, tier:'platinum', gstin:'27XXXXX0000X1Z2', business:'Fatima Wholesale Fabrics' },
]

const TYPE_CFG: Record<CustomerType, { label: string; cls: string; icon: React.ElementType }> = {
  retail:    { label: 'Retail',    cls: 'bg-blue-100 text-blue-700',   icon: Users },
  wholesale: { label: 'Wholesale', cls: 'bg-amber-100 text-amber-700', icon: Award },
  vip:       { label: 'VIP',       cls: 'bg-purple-100 text-purple-700',icon: Crown },
  dealer:    { label: 'Dealer',    cls: 'bg-rose-100 text-rose-700',   icon: Star },
}

function CustomerPanel({ c, onClose }: { c: Customer | null; onClose: () => void }) {
  if (!c) return null
  const cfg = TYPE_CFG[c.type]
  const CIcon = cfg.icon
  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-sm bg-white h-full overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b px-5 py-4 flex items-center gap-3 z-10">
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-stone-100"><ChevronRight size={18} /></button>
          <div className="flex-1">
            <p className="font-bold text-stone-900">{c.name}</p>
            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.cls}`}>
              <CIcon size={10} />{cfg.label}
            </span>
          </div>
          <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-bold">
            {c.name[0]}
          </div>
        </div>
        <div className="p-5 space-y-4">
          {/* Contact */}
          <div className="bg-stone-50 rounded-xl p-4 space-y-2">
            <p className="text-xs font-bold text-stone-400 mb-2">CONTACT</p>
            <div className="flex items-center gap-2 text-sm text-stone-700"><Phone size={13} className="text-stone-400" />{c.phone}</div>
            <div className="flex items-center gap-2 text-sm text-stone-700"><Mail size={13} className="text-stone-400" />{c.email}</div>
            <div className="flex items-center gap-2 text-sm text-stone-700"><MapPin size={13} className="text-stone-400" />{c.city}, {c.state}</div>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Orders',    value: c.orders },
              { label: 'Spent',     value: `₹${(c.spent/1000).toFixed(0)}K` },
              { label: 'Points',    value: c.points },
            ].map(s => (
              <div key={s.label} className="bg-stone-50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-stone-900">{s.value}</p>
                <p className="text-xs text-stone-400">{s.label}</p>
              </div>
            ))}
          </div>
          {/* Score */}
          <div className="bg-stone-50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-bold text-stone-400">CUSTOMER SCORE</p>
              <span className={`text-sm font-bold ${c.score >= 80 ? 'text-green-600' : c.score >= 50 ? 'text-amber-600' : 'text-red-500'}`}>{c.score}/100</span>
            </div>
            <div className="w-full h-2 bg-stone-200 rounded-full">
              <div className={`h-2 rounded-full ${c.score >= 80 ? 'bg-green-500' : c.score >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}
                style={{ width: `${c.score}%` }} />
            </div>
          </div>
          {/* B2B info */}
          {c.business && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-xs font-bold text-amber-700 mb-2">B2B DETAILS</p>
              <p className="text-sm font-semibold text-stone-800">{c.business}</p>
              {c.gstin && <p className="text-xs text-stone-500 mt-1">GSTIN: {c.gstin}</p>}
              {c.tier && <p className="text-xs mt-1"><span className="font-semibold capitalize">{c.tier}</span> tier</p>}
            </div>
          )}
          {/* Loyalty */}
          <div className="bg-stone-50 rounded-xl p-4">
            <div className="flex justify-between"><p className="text-xs font-bold text-stone-400">LOYALTY POINTS</p><Gift size={14} className="text-rose-500" /></div>
            <p className="text-2xl font-bold text-stone-900 mt-1">{c.points} pts</p>
            <p className="text-xs text-stone-400">≈ ₹{c.points} discount value</p>
          </div>
          {/* Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center gap-1.5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl">
              <Phone size={14} />Call
            </button>
            <button className="flex items-center justify-center gap-1.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl">
              <MessageSquare size={14} />WhatsApp
            </button>
          </div>
          <div className="text-xs text-stone-400 text-center">Joined: {c.joined} · Last order: {c.lastOrder}</div>
        </div>
      </div>
    </div>
  )
}

export default function CustomersPage() {
  const [customers] = useState<Customer[]>(MOCK)
  const [search, setSearch] = useState('')
  const [typeFilter, setType] = useState('all')
  const [active, setActive] = useState<Customer | null>(null)
  const [page, setPage] = useState(1)
  const PER = 8

  const filtered = useMemo(() => customers.filter(c => {
    const ms = !search || [c.name,c.phone,c.email,c.city,c.business||''].some(f => f.toLowerCase().includes(search.toLowerCase()))
    const mt = typeFilter === 'all' || c.type === typeFilter
    return ms && mt
  }), [customers, search, typeFilter])

  const paginated = filtered.slice((page-1)*PER, page*PER)
  const totalPages = Math.ceil(filtered.length / PER)

  const stats = {
    total:     customers.length,
    retail:    customers.filter(c => c.type === 'retail').length,
    wholesale: customers.filter(c => c.type === 'wholesale').length,
    vip:       customers.filter(c => ['vip','dealer'].includes(c.type)).length,
    ltv:       customers.reduce((s,c) => s+c.spent, 0),
  }

  return (
    <>
      <CustomerPanel c={active} onClose={() => setActive(null)} />
      <div className="p-6 max-w-[1400px] mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div><h2 className="text-xl font-bold text-stone-900">Customers</h2>
            <p className="text-sm text-stone-500">{filtered.length} customers</p></div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 border border-stone-200 bg-white text-stone-600 text-sm px-3 py-2 rounded-xl hover:bg-stone-50"><Download size={14} />Export</button>
            <button className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold px-4 py-2 rounded-xl"><Plus size={14} />Add Customer</button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label:'Total',     value: stats.total,     color:'text-stone-900' },
            { label:'Retail',    value: stats.retail,    color:'text-blue-600' },
            { label:'Wholesale', value: stats.wholesale, color:'text-amber-600' },
            { label:'VIP/Dealer',value: stats.vip,       color:'text-purple-600' },
            { label:'Total LTV', value:`₹${(stats.ltv/100000).toFixed(1)}L`, color:'text-rose-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-stone-200 px-4 py-3 text-center">
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-stone-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}}
              placeholder="Search name, phone, email, city, business…"
              className="w-full pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[{l:'All',v:'all'},{l:'Retail',v:'retail'},{l:'Wholesale',v:'wholesale'},{l:'VIP',v:'vip'},{l:'Dealer',v:'dealer'}].map(f => (
              <button key={f.v} onClick={()=>{setType(f.v);setPage(1)}}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors
                  ${typeFilter===f.v?'bg-rose-600 text-white':'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
                {f.l}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50 text-left text-xs font-semibold text-stone-400">
                  <th className="px-4 py-3">CUSTOMER</th>
                  <th className="px-4 py-3">TYPE</th>
                  <th className="px-4 py-3">CONTACT</th>
                  <th className="px-4 py-3 text-right">ORDERS</th>
                  <th className="px-4 py-3 text-right">TOTAL SPENT</th>
                  <th className="px-4 py-3 text-right">POINTS</th>
                  <th className="px-4 py-3">SCORE</th>
                  <th className="px-4 py-3">LAST ORDER</th>
                  <th className="px-4 py-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {paginated.length === 0 && <tr><td colSpan={9} className="text-center py-12 text-stone-400 text-sm">No customers found</td></tr>}
                {paginated.map(c => {
                  const cfg = TYPE_CFG[c.type]
                  const CIcon = cfg.icon
                  return (
                    <tr key={c.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-bold text-sm shrink-0">{c.name[0]}</div>
                          <div>
                            <p className="text-sm font-semibold text-stone-800">{c.name}</p>
                            {c.business && <p className="text-xs text-stone-400 truncate max-w-[140px]">{c.business}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.cls}`}>
                          <CIcon size={10} />{cfg.label}
                        </span>
                        {c.tier && <p className="text-xs text-stone-400 mt-0.5 capitalize">{c.tier}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-stone-700">{c.phone}</p>
                        <p className="text-xs text-stone-400">{c.city}, {c.state}</p>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-stone-800">{c.orders}</td>
                      <td className="px-4 py-3 text-right">
                        <p className="text-sm font-bold text-stone-900">₹{c.spent.toLocaleString('en-IN')}</p>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{c.points} pts</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-stone-100 rounded-full">
                            <div className={`h-1.5 rounded-full ${c.score>=80?'bg-green-500':c.score>=50?'bg-amber-400':'bg-red-400'}`}
                              style={{width:`${c.score}%`}} />
                          </div>
                          <span className="text-xs text-stone-500">{c.score}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-stone-500">{c.lastOrder}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={()=>setActive(c)} className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-800">
                          <Eye size={15} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="border-t border-stone-100 px-4 py-3 flex items-center justify-between">
            <p className="text-xs text-stone-500">{filtered.length} customers · LTV ₹{(filtered.reduce((s,c)=>s+c.spent,0)/100000).toFixed(1)}L</p>
            <div className="flex items-center gap-2">
              <button disabled={page===1} onClick={()=>setPage(p=>p-1)} className="p-1.5 rounded-lg border border-stone-200 disabled:opacity-40 hover:bg-stone-50"><ChevronLeft size={14}/></button>
              <span className="text-xs text-stone-600 px-2">Page {page} of {totalPages||1}</span>
              <button disabled={page>=totalPages} onClick={()=>setPage(p=>p+1)} className="p-1.5 rounded-lg border border-stone-200 disabled:opacity-40 hover:bg-stone-50"><ChevronRight size={14}/></button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
