'use client'
import { useState } from 'react'
import {
  Building2, Phone, Mail, MapPin, Package, IndianRupee,
  Clock, CheckCircle, XCircle, MessageSquare, Search, Eye,
  TrendingUp, Users, ShoppingBag, Star
} from 'lucide-react'

type Enquiry = {
  id: string
  name: string
  business: string
  phone: string
  email: string
  city: string
  state: string
  gstin: string
  products: string
  quantity: string
  message: string
  date: string
  status: 'new' | 'contacted' | 'negotiating' | 'converted' | 'rejected'
  estimatedValue: number
  notes: string
}

const ENQUIRIES: Enquiry[] = [
  { id:'1', name:'Fatima Shaikh',    business:'Shaikh Textiles',    phone:'9876543210', email:'fatima@shaikhtextiles.com', city:'Mumbai',    state:'Maharashtra', gstin:'27AXXXX1234A1Z5', products:'Designer Sarees, Lehenga Fabrics', quantity:'50–100m per design', message:'Looking for exclusive designs for bridal season. Need samples first.', date:'2026-08-05', status:'negotiating', estimatedValue:280000, notes:'Sent 5 sample swatches via courier. Follow up on 10th.' },
  { id:'2', name:'Rajan Menon',      business:'Kerala Silk House',  phone:'9845001122', email:'rajan@keralasilk.in',       city:'Kochi',     state:'Kerala',      gstin:'32BXXXX5678B2Z3', products:'Silk Fabrics, Chanderi', quantity:'200–500m/month', message:'Wholesale supplier for our 3 stores. Looking for competitive pricing.', date:'2026-08-04', status:'contacted', estimatedValue:180000, notes:'Called on Aug 4. Interested in price tiers. Send B2B catalog.' },
  { id:'3', name:'Sanjay Gupta',     business:'Gupta Fashion Hub',  phone:'9988776655', email:'sanjay@guptafashion.com',   city:'Surat',     state:'Gujarat',     gstin:'24CXXXX9012C3Z1', products:'Plain Fabrics, Prints', quantity:'1000m+ per month', message:'We are a large distributor. Need factory pricing and minimum order details.', date:'2026-08-03', status:'new', estimatedValue:450000, notes:'' },
  { id:'4', name:'Deepa Iyer',       business:'Deepa Boutique',     phone:'8012345678', email:'deepa@deepaboutique.com',   city:'Chennai',   state:'Tamil Nadu',  gstin:'', products:'Kurti Fabrics', quantity:'20–50m per design', message:'Small boutique, looking for unique prints not available elsewhere.', date:'2026-08-02', status:'converted', estimatedValue:45000, notes:'Converted to dealer account. First order placed: GF-2021.' },
  { id:'5', name:'Priya Agarwal',    business:'Priya Collections',  phone:'7890123456', email:'priya@priyacollections.in', city:'Jaipur',    state:'Rajasthan',   gstin:'08DXXXX3456D4Z2', products:'Lehenga Fabrics, Dupattas', quantity:'100m/month', message:'Looking for Rajasthani style fabrics and embroidery materials.', date:'2026-08-01', status:'contacted', estimatedValue:96000, notes:'WhatsApp catalog sent. Awaiting response.' },
  { id:'6', name:'Suresh Reddy',     business:'Sri Reddy Textiles', phone:'9012345678', email:'suresh@srireddytextiles.in',city:'Hyderabad', state:'Telangana',   gstin:'36EXXXX7890E5Z3', products:'All Categories', quantity:'500m+ monthly', message:'Distributor for Andhra & Telangana. Want exclusivity for some designs.', date:'2026-07-30', status:'rejected', estimatedValue:320000, notes:'Rejected — asked for exclusivity on all designs which is not feasible.' },
  { id:'7', name:'Meena Pillai',     business:'Meena Fabrics',      phone:'9123456789', email:'meena@meenafabrics.com',    city:'Coimbatore',state:'Tamil Nadu',  gstin:'33FXXXX1234F6Z4', products:'Cotton Fabrics, Plain', quantity:'300m/month', message:'Cotton fabric wholesaler, need GST invoice with all orders.', date:'2026-07-28', status:'new', estimatedValue:72000, notes:'' },
]

const STATUS_STYLE: Record<string,string> = {
  new:         'bg-blue-100 text-blue-700',
  contacted:   'bg-amber-100 text-amber-700',
  negotiating: 'bg-purple-100 text-purple-700',
  converted:   'bg-green-100 text-green-700',
  rejected:    'bg-red-100 text-red-600',
}
const STATUS_NEXT: Record<string,string> = {
  new:         'contacted',
  contacted:   'negotiating',
  negotiating: 'converted',
}

export default function WholesalePage() {
  const [search, setSearch]       = useState('')
  const [statusF, setStatusF]     = useState('all')
  const [selected, setSelected]   = useState<Enquiry|null>(null)
  const [enquiries, setEnquiries] = useState<Enquiry[]>(ENQUIRIES)
  const [notes, setNotes]         = useState('')

  const filtered = enquiries.filter(e => {
    const q = search.toLowerCase()
    const match = e.name.toLowerCase().includes(q) || e.business.toLowerCase().includes(q) || e.city.toLowerCase().includes(q)
    const st = statusF === 'all' || e.status === statusF
    return match && st
  })

  function advance(id: string) {
    setEnquiries(prev => prev.map(e =>
      e.id === id && STATUS_NEXT[e.status]
        ? { ...e, status: STATUS_NEXT[e.status] as Enquiry['status'] }
        : e
    ))
    setSelected(prev => prev && prev.id === id && STATUS_NEXT[prev.status]
      ? { ...prev, status: STATUS_NEXT[prev.status] as Enquiry['status'] }
      : prev
    )
  }

  const stats = {
    new:        enquiries.filter(e=>e.status==='new').length,
    pipeline:   enquiries.filter(e=>['contacted','negotiating'].includes(e.status)).reduce((s,e)=>s+e.estimatedValue,0),
    converted:  enquiries.filter(e=>e.status==='converted').length,
    total:      enquiries.length,
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Wholesale & B2B</h2>
          <p className="text-sm text-stone-500">Manage bulk enquiries and dealer relationships</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
          <p className="text-xs font-semibold text-stone-500 mt-0.5">New Enquiries</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-2xl font-bold text-purple-600">₹{(stats.pipeline/1000).toFixed(0)}K</p>
          <p className="text-xs font-semibold text-stone-500 mt-0.5">Pipeline Value</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-2xl font-bold text-green-600">{stats.converted}</p>
          <p className="text-xs font-semibold text-stone-500 mt-0.5">Converted Dealers</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-2xl font-bold text-stone-700">{stats.total}</p>
          <p className="text-xs font-semibold text-stone-500 mt-0.5">Total Enquiries</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"/>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search name, business, city…"
            className="w-full pl-8 pr-4 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400 bg-white"/>
        </div>
        <select value={statusF} onChange={e=>setStatusF(e.target.value)}
          className="px-3 py-2.5 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none">
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="negotiating">Negotiating</option>
          <option value="converted">Converted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Enquiries List */}
      <div className="space-y-3">
        {filtered.map(e => (
          <div key={e.id} className="bg-white rounded-xl border border-stone-200 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600 font-bold shrink-0">
                  {e.name[0]}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-stone-900">{e.name}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[e.status]}`}>{e.status}</span>
                  </div>
                  <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                    <Building2 size={10}/>{e.business} · {e.city}, {e.state}
                  </p>
                  <div className="flex gap-4 mt-2 flex-wrap">
                    <span className="text-xs text-stone-500 flex items-center gap-1"><Package size={10}/>{e.products}</span>
                    <span className="text-xs text-stone-500 flex items-center gap-1"><ShoppingBag size={10}/>{e.quantity}</span>
                    <span className="text-xs font-semibold text-green-700 flex items-center gap-1"><IndianRupee size={10}/>₹{e.estimatedValue.toLocaleString('en-IN')} est.</span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1.5 line-clamp-2">{e.message}</p>
                  {e.notes && (
                    <p className="text-xs text-blue-600 mt-1 flex items-start gap-1"><MessageSquare size={10} className="mt-0.5 shrink-0"/>Note: {e.notes}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <p className="text-xs text-stone-400">{e.date}</p>
                <div className="flex gap-1.5">
                  <a href={`tel:${e.phone}`} className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100"><Phone size={13}/></a>
                  <a href={`mailto:${e.email}`} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"><Mail size={13}/></a>
                  <button onClick={()=>setSelected(e)} className="p-1.5 rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200"><Eye size={13}/></button>
                </div>
                {STATUS_NEXT[e.status] && (
                  <button onClick={()=>advance(e.id)}
                    className="text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 px-3 py-1.5 rounded-lg">
                    Move to {STATUS_NEXT[e.status]}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-stone-200 py-12 text-center text-stone-400 text-sm">No enquiries found</div>
        )}
      </div>

      {/* Detail Panel */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end" onClick={()=>setSelected(null)}>
          <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl" onClick={e=>e.stopPropagation()}>
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-stone-900">{selected.name}</p>
                <p className="text-xs text-stone-500">{selected.business}</p>
              </div>
              <button onClick={()=>setSelected(null)} className="text-stone-400 hover:text-stone-700 text-lg font-bold">✕</button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-stone-600"><Phone size={14}/>{selected.phone}</div>
                <div className="flex items-center gap-2 text-stone-600"><Mail size={14}/>{selected.email}</div>
                <div className="flex items-center gap-2 text-stone-600"><MapPin size={14}/>{selected.city}, {selected.state}</div>
                {selected.gstin && <div className="flex items-center gap-2 text-stone-600"><Building2 size={14}/>GSTIN: {selected.gstin}</div>}
              </div>
              <div className="bg-stone-50 rounded-xl p-4 space-y-2">
                <p className="text-xs font-bold text-stone-400">ENQUIRY DETAILS</p>
                <p className="text-sm text-stone-700"><span className="font-semibold">Products:</span> {selected.products}</p>
                <p className="text-sm text-stone-700"><span className="font-semibold">Quantity:</span> {selected.quantity}</p>
                <p className="text-sm text-stone-700"><span className="font-semibold">Est. Value:</span> ₹{selected.estimatedValue.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-stone-400 mb-2">MESSAGE</p>
                <p className="text-sm text-stone-700 bg-stone-50 p-3 rounded-xl">{selected.message}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-stone-400 mb-2">NOTES</p>
                <textarea value={notes || selected.notes} onChange={e=>setNotes(e.target.value)}
                  rows={3} placeholder="Add internal notes…"
                  className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400 resize-none"/>
              </div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <a href={`tel:${selected.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-semibold">
                    <Phone size={14}/>Call
                  </a>
                  <a href={`https://wa.me/91${selected.phone}`} target="_blank" rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-bold">
                    <MessageSquare size={14}/>WhatsApp
                  </a>
                </div>
                {STATUS_NEXT[selected.status] && (
                  <button onClick={()=>advance(selected.id)}
                    className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold">
                    Move to {STATUS_NEXT[selected.status]}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
