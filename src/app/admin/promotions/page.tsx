'use client'
import { useState } from 'react'
import {
  Tag, Plus, Copy, Trash2, CheckCircle, XCircle, Clock,
  Percent, IndianRupee, Users, ShoppingBag, Calendar, ToggleLeft, ToggleRight
} from 'lucide-react'

type Coupon = {
  id: string
  code: string
  type: 'percent' | 'flat'
  value: number
  minOrder: number
  maxDiscount: number | null
  usageLimit: number
  usedCount: number
  startDate: string
  endDate: string
  status: 'active' | 'expired' | 'scheduled' | 'disabled'
  applicableTo: string
  description: string
}

const COUPONS: Coupon[] = [
  { id:'1', code:'WELCOME20',   type:'percent', value:20, minOrder:500,  maxDiscount:300,  usageLimit:1000, usedCount:342,  startDate:'2026-01-01', endDate:'2026-12-31', status:'active',    applicableTo:'All Products',      description:'New customer welcome discount' },
  { id:'2', code:'SAREE500',    type:'flat',    value:500,minOrder:3000, maxDiscount:null, usageLimit:200,  usedCount:87,   startDate:'2026-07-01', endDate:'2026-08-31', status:'active',    applicableTo:'Designer Sarees',   description:'Saree festival offer' },
  { id:'3', code:'BULK15',      type:'percent', value:15, minOrder:5000, maxDiscount:1000, usageLimit:500,  usedCount:156,  startDate:'2026-01-01', endDate:'2026-12-31', status:'active',    applicableTo:'Wholesale Orders',  description:'Bulk purchase discount' },
  { id:'4', code:'ONAM2026',    type:'percent', value:12, minOrder:1000, maxDiscount:500,  usageLimit:300,  usedCount:0,    startDate:'2026-09-01', endDate:'2026-09-15', status:'scheduled', applicableTo:'All Products',      description:'Onam festival special' },
  { id:'5', code:'SUMMER10',    type:'percent', value:10, minOrder:800,  maxDiscount:200,  usageLimit:400,  usedCount:400,  startDate:'2026-04-01', endDate:'2026-06-30', status:'expired',   applicableTo:'All Products',      description:'Summer season offer' },
  { id:'6', code:'FIRST100',    type:'flat',    value:100,minOrder:500,  maxDiscount:null, usageLimit:999,  usedCount:623,  startDate:'2026-01-01', endDate:'2026-12-31', status:'active',    applicableTo:'First Order Only',  description:'First order flat discount' },
  { id:'7', code:'DIWALI25',    type:'percent', value:25, minOrder:2000, maxDiscount:800,  usageLimit:500,  usedCount:0,    startDate:'2026-10-15', endDate:'2026-11-05', status:'scheduled', applicableTo:'All Products',      description:'Diwali festive discount' },
  { id:'8', code:'FABRIC50',    type:'flat',    value:50, minOrder:300,  maxDiscount:null, usageLimit:1000, usedCount:234,  startDate:'2026-03-01', endDate:'2026-05-31', status:'expired',   applicableTo:'Plain Fabrics',     description:'Plain fabric promo' },
]

const STATUS_COLORS: Record<string, string> = {
  active:    'bg-green-100 text-green-700',
  expired:   'bg-stone-100 text-stone-500',
  scheduled: 'bg-blue-100 text-blue-700',
  disabled:  'bg-red-100 text-red-500',
}
const STATUS_ICONS: Record<string, any> = {
  active:    CheckCircle,
  expired:   XCircle,
  scheduled: Clock,
  disabled:  XCircle,
}

export default function PromotionsPage() {
  const [tab, setTab]         = useState<'all'|'active'|'scheduled'|'expired'>('all')
  const [showModal, setModal] = useState(false)
  const [copied, setCopied]   = useState<string|null>(null)
  const [coupons, setCoupons] = useState<Coupon[]>(COUPONS)

  const [form, setForm] = useState({
    code:'', type:'percent', value:'', minOrder:'', maxDiscount:'',
    usageLimit:'', startDate:'', endDate:'', applicableTo:'All Products', description:''
  })

  const filtered = tab === 'all' ? coupons : coupons.filter(c => c.status === tab)

  function copyCode(code: string) {
    navigator.clipboard.writeText(code)
    setCopied(code)
    setTimeout(() => setCopied(null), 1500)
  }

  function toggleStatus(id: string) {
    setCoupons(prev => prev.map(c =>
      c.id === id ? { ...c, status: c.status === 'active' ? 'disabled' : 'active' } : c
    ))
  }

  const stats = {
    active:    coupons.filter(c=>c.status==='active').length,
    scheduled: coupons.filter(c=>c.status==='scheduled').length,
    expired:   coupons.filter(c=>c.status==='expired').length,
    totalUsed: coupons.reduce((s,c)=>s+c.usedCount,0),
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Promotions & Coupons</h2>
          <p className="text-sm text-stone-500">Manage discount codes and offers</p>
        </div>
        <button onClick={()=>setModal(true)}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold px-4 py-2 rounded-xl">
          <Plus size={15}/>Create Coupon
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label:'Active Coupons',    value: stats.active,    color:'text-green-600' },
          { label:'Scheduled',         value: stats.scheduled, color:'text-blue-600' },
          { label:'Expired',           value: stats.expired,   color:'text-stone-400' },
          { label:'Total Redemptions', value: stats.totalUsed, color:'text-rose-600' },
        ].map(s=>(
          <div key={s.label} className="bg-white rounded-xl border border-stone-200 p-4">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs font-semibold text-stone-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl w-fit">
        {(['all','active','scheduled','expired'] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-colors
              ${tab===t?'bg-white text-stone-900 shadow-sm':'text-stone-500 hover:text-stone-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(c => {
          const StatusIcon = STATUS_ICONS[c.status]
          const pct = Math.round((c.usedCount/c.usageLimit)*100)
          return (
            <div key={c.id} className={`bg-white rounded-xl border p-5 space-y-4 ${c.status==='disabled'?'opacity-60':''} border-stone-200`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-lg text-stone-900 tracking-widest">{c.code}</span>
                    <button onClick={()=>copyCode(c.code)}
                      className="text-stone-400 hover:text-stone-600 transition-colors">
                      {copied===c.code ? <CheckCircle size={14} className="text-green-500"/> : <Copy size={14}/>}
                    </button>
                  </div>
                  <p className="text-xs text-stone-500">{c.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[c.status]}`}>
                    <StatusIcon size={10}/>{c.status}
                  </span>
                  {c.status !== 'expired' && (
                    <button onClick={()=>toggleStatus(c.id)} className="text-stone-400 hover:text-stone-600">
                      {c.status==='active'?<ToggleRight size={20} className="text-green-500"/>:<ToggleLeft size={20}/>}
                    </button>
                  )}
                </div>
              </div>

              {/* Discount badge */}
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-sm
                  ${c.type==='percent'?'bg-rose-50 text-rose-700':'bg-amber-50 text-amber-700'}`}>
                  {c.type==='percent'?<Percent size={14}/>:<IndianRupee size={14}/>}
                  {c.value}{c.type==='percent'?'% OFF':'₹ OFF'}
                </div>
                <div className="text-xs text-stone-500 space-y-0.5">
                  <p>Min order: <span className="font-semibold text-stone-700">₹{c.minOrder.toLocaleString('en-IN')}</span></p>
                  {c.maxDiscount && <p>Max discount: <span className="font-semibold text-stone-700">₹{c.maxDiscount.toLocaleString('en-IN')}</span></p>}
                </div>
              </div>

              {/* Usage bar */}
              <div>
                <div className="flex justify-between text-xs text-stone-500 mb-1.5">
                  <span className="flex items-center gap-1"><Users size={10}/>{c.usedCount} used</span>
                  <span>{c.usageLimit} limit</span>
                </div>
                <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${pct>=90?'bg-red-500':pct>=60?'bg-amber-500':'bg-green-500'}`}
                    style={{width:`${pct}%`}}/>
                </div>
              </div>

              {/* Dates & applicable */}
              <div className="flex items-center justify-between text-xs text-stone-500 pt-1 border-t border-stone-100">
                <span className="flex items-center gap-1">
                  <Calendar size={10}/>{c.startDate} → {c.endDate}
                </span>
                <span className="flex items-center gap-1">
                  <ShoppingBag size={10}/>{c.applicableTo}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Create Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-base">Create New Coupon</h3>
              <button onClick={()=>setModal(false)} className="text-stone-400 hover:text-stone-600 text-lg font-bold">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-stone-500 mb-1">Coupon Code</label>
                <input value={form.code} onChange={e=>setForm({...form,code:e.target.value.toUpperCase()})}
                  placeholder="e.g. SAVE20" maxLength={20}
                  className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl font-mono tracking-widest focus:outline-none focus:border-rose-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1">Discount Type</label>
                <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}
                  className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400">
                  <option value="percent">Percentage (%)</option>
                  <option value="flat">Flat Amount (₹)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1">Value</label>
                <input type="number" value={form.value} onChange={e=>setForm({...form,value:e.target.value})}
                  placeholder={form.type==='percent'?'e.g. 20':'e.g. 500'}
                  className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1">Min Order (₹)</label>
                <input type="number" value={form.minOrder} onChange={e=>setForm({...form,minOrder:e.target.value})}
                  placeholder="e.g. 500"
                  className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1">Usage Limit</label>
                <input type="number" value={form.usageLimit} onChange={e=>setForm({...form,usageLimit:e.target.value})}
                  placeholder="e.g. 200"
                  className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1">Start Date</label>
                <input type="date" value={form.startDate} onChange={e=>setForm({...form,startDate:e.target.value})}
                  className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1">End Date</label>
                <input type="date" value={form.endDate} onChange={e=>setForm({...form,endDate:e.target.value})}
                  className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-stone-500 mb-1">Applicable To</label>
                <select value={form.applicableTo} onChange={e=>setForm({...form,applicableTo:e.target.value})}
                  className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400">
                  <option>All Products</option>
                  <option>Designer Sarees</option>
                  <option>Lehenga Fabrics</option>
                  <option>Plain Fabrics</option>
                  <option>Wholesale Orders</option>
                  <option>First Order Only</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-stone-500 mb-1">Description</label>
                <input value={form.description} onChange={e=>setForm({...form,description:e.target.value})}
                  placeholder="Internal note about this coupon"
                  className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400" />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={()=>setModal(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-stone-200 text-stone-600 hover:bg-stone-50">
                Cancel
              </button>
              <button onClick={()=>{
                if(!form.code||!form.value) return
                const newCoupon: Coupon = {
                  id: Date.now().toString(), code:form.code, type:form.type as 'percent'|'flat',
                  value:parseFloat(form.value), minOrder:parseFloat(form.minOrder)||0,
                  maxDiscount:null, usageLimit:parseInt(form.usageLimit)||100, usedCount:0,
                  startDate:form.startDate, endDate:form.endDate,
                  status: form.startDate > new Date().toISOString().split('T')[0] ? 'scheduled' : 'active',
                  applicableTo:form.applicableTo, description:form.description,
                }
                setCoupons(p=>[newCoupon,...p])
                setModal(false)
                setForm({code:'',type:'percent',value:'',minOrder:'',maxDiscount:'',usageLimit:'',startDate:'',endDate:'',applicableTo:'All Products',description:''})
              }}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white">
                Create Coupon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
