'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import {
  Tag, Plus, Copy, Trash2, CheckCircle, XCircle, Clock,
  Percent, IndianRupee, Users, ShoppingBag, Calendar, ToggleLeft, ToggleRight, Loader
} from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Coupon = {
  id: string
  code: string
  type: 'percent' | 'flat'
  value: number
  min_order: number
  max_discount: number | null
  usage_limit: number
  used_count: number
  start_date: string
  end_date: string
  is_active: boolean
  applicable_to: string
  description: string
}

function getStatus(c: Coupon): 'active' | 'expired' | 'scheduled' | 'disabled' {
  if (!c.is_active) return 'disabled'
  const today = new Date().toISOString().split('T')[0]
  if (c.end_date < today) return 'expired'
  if (c.start_date > today) return 'scheduled'
  return 'active'
}

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

const BLANK_FORM = {
  code:'', type:'percent', value:'', min_order:'', max_discount:'',
  usage_limit:'', start_date:'', end_date:'', applicable_to:'All Products', description:''
}

export default function PromotionsPage() {
  const [tab, setTab]         = useState<'all'|'active'|'scheduled'|'expired'|'disabled'>('all')
  const [showModal, setModal] = useState(false)
  const [copied, setCopied]   = useState<string|null>(null)
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [form,    setForm]    = useState<typeof BLANK_FORM>({...BLANK_FORM})

  // Load coupons from Supabase
  async function loadCoupons() {
    setLoading(true)
    const { data, error } = await supabase
      .from('gf_coupons')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setCoupons(data)
    setLoading(false)
  }

  useEffect(() => { loadCoupons() }, [])

  const filtered = tab === 'all'
    ? coupons
    : coupons.filter(c => getStatus(c) === tab)

  function copyCode(code: string) {
    navigator.clipboard.writeText(code)
    setCopied(code)
    setTimeout(() => setCopied(null), 1500)
  }

  async function toggleActive(c: Coupon) {
    const { error } = await supabase
      .from('gf_coupons')
      .update({ is_active: !c.is_active })
      .eq('id', c.id)
    if (!error) setCoupons(prev => prev.map(x => x.id === c.id ? { ...x, is_active: !c.is_active } : x))
  }

  async function deleteCoupon(id: string) {
    if (!confirm('Delete this coupon?')) return
    const { error } = await supabase.from('gf_coupons').delete().eq('id', id)
    if (!error) setCoupons(prev => prev.filter(x => x.id !== id))
  }

  async function createCoupon() {
    if (!form.code || !form.value) return
    setSaving(true)
    const payload = {
      code:         form.code.trim().toUpperCase(),
      type:         form.type,
      value:        parseFloat(form.value),
      min_order:    parseFloat(form.min_order) || 0,
      max_discount: form.max_discount ? parseFloat(form.max_discount) : null,
      usage_limit:  parseInt(form.usage_limit) || 1000,
      used_count:   0,
      start_date:   form.start_date || new Date().toISOString().split('T')[0],
      end_date:     form.end_date || '2099-12-31',
      is_active:    true,
      applicable_to:form.applicable_to,
      description:  form.description,
    }
    const { data, error } = await supabase.from('gf_coupons').insert([payload]).select().single()
    if (!error && data) {
      setCoupons(prev => [data, ...prev])
      setModal(false)
      setForm({...BLANK_FORM})
    } else {
      alert('Error: ' + (error?.message || 'Could not create coupon'))
    }
    setSaving(false)
  }

  const stats = {
    active:    coupons.filter(c => getStatus(c) === 'active').length,
    scheduled: coupons.filter(c => getStatus(c) === 'scheduled').length,
    expired:   coupons.filter(c => getStatus(c) === 'expired').length,
    totalUsed: coupons.reduce((s, c) => s + (c.used_count || 0), 0),
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Promotions & Coupons</h2>
          <p className="text-sm text-stone-500">Manage discount codes — changes apply to cart instantly</p>
        </div>
        <button onClick={() => setModal(true)}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold px-4 py-2 rounded-xl">
          <Plus size={15}/> Create Coupon
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label:'Active Coupons',    value: stats.active,    color:'text-green-600' },
          { label:'Scheduled',         value: stats.scheduled, color:'text-blue-600' },
          { label:'Expired',           value: stats.expired,   color:'text-stone-400' },
          { label:'Total Redemptions', value: stats.totalUsed, color:'text-rose-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-stone-200 p-4">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs font-semibold text-stone-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl w-fit">
        {(['all','active','scheduled','expired','disabled'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-colors
              ${tab === t ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-stone-400 gap-2">
          <Loader size={18} className="animate-spin"/> Loading coupons...
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 text-stone-400">
          <Tag size={36} className="mx-auto mb-3 opacity-30"/>
          <p className="font-medium">No coupons found</p>
          <p className="text-sm mt-1">Click "Create Coupon" to add your first discount code.</p>
        </div>
      )}

      {/* Coupons Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(c => {
            const status = getStatus(c)
            const StatusIcon = STATUS_ICONS[status]
            const pct = c.usage_limit > 0 ? Math.round(((c.used_count || 0) / c.usage_limit) * 100) : 0
            return (
              <div key={c.id} className={`bg-white rounded-xl border p-5 space-y-4 ${!c.is_active ? 'opacity-60' : ''} border-stone-200`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-lg text-stone-900 tracking-widest">{c.code}</span>
                      <button onClick={() => copyCode(c.code)} className="text-stone-400 hover:text-stone-600 transition-colors">
                        {copied === c.code ? <CheckCircle size={14} className="text-green-500"/> : <Copy size={14}/>}
                      </button>
                    </div>
                    <p className="text-xs text-stone-500">{c.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[status]}`}>
                      <StatusIcon size={10}/>{status}
                    </span>
                    <button onClick={() => toggleActive(c)} className="text-stone-400 hover:text-stone-600">
                      {c.is_active ? <ToggleRight size={20} className="text-green-500"/> : <ToggleLeft size={20}/>}
                    </button>
                    <button onClick={() => deleteCoupon(c.id)} className="text-stone-300 hover:text-red-500 transition-colors">
                      <Trash2 size={15}/>
                    </button>
                  </div>
                </div>

                {/* Discount badge */}
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-sm
                    ${c.type === 'percent' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>
                    {c.type === 'percent' ? <Percent size={14}/> : <IndianRupee size={14}/>}
                    {c.value}{c.type === 'percent' ? '% OFF' : '₹ OFF'}
                  </div>
                  <div className="text-xs text-stone-500 space-y-0.5">
                    <p>Min order: <span className="font-semibold text-stone-700">₹{(c.min_order || 0).toLocaleString('en-IN')}</span></p>
                    {c.max_discount && <p>Max discount: <span className="font-semibold text-stone-700">₹{c.max_discount.toLocaleString('en-IN')}</span></p>}
                  </div>
                </div>

                {/* Usage bar */}
                <div>
                  <div className="flex justify-between text-xs text-stone-500 mb-1.5">
                    <span className="flex items-center gap-1"><Users size={10}/>{c.used_count || 0} used</span>
                    <span>{c.usage_limit} limit</span>
                  </div>
                  <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${pct >= 90 ? 'bg-red-500' : pct >= 60 ? 'bg-amber-500' : 'bg-green-500'}`}
                      style={{width: `${Math.min(pct, 100)}%`}}/>
                  </div>
                </div>

                {/* Dates & applicable */}
                <div className="flex items-center justify-between text-xs text-stone-500 pt-1 border-t border-stone-100">
                  <span className="flex items-center gap-1">
                    <Calendar size={10}/>{c.start_date} → {c.end_date}
                  </span>
                  <span className="flex items-center gap-1">
                    <ShoppingBag size={10}/>{c.applicable_to}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Create Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-base">Create New Coupon</h3>
              <button onClick={() => setModal(false)} className="text-stone-400 hover:text-stone-600 text-lg font-bold">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-stone-500 mb-1">Coupon Code *</label>
                <input value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})}
                  placeholder="e.g. SAVE20" maxLength={20}
                  className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl font-mono tracking-widest focus:outline-none focus:border-rose-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1">Discount Type *</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                  className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400">
                  <option value="percent">Percentage (%)</option>
                  <option value="flat">Flat Amount (₹)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1">Value *</label>
                <input type="number" value={form.value} onChange={e => setForm({...form, value: e.target.value})}
                  placeholder={form.type === 'percent' ? 'e.g. 10' : 'e.g. 500'}
                  className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1">Min Order (₹)</label>
                <input type="number" value={form.min_order} onChange={e => setForm({...form, min_order: e.target.value})}
                  placeholder="e.g. 500"
                  className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1">Max Discount (₹)</label>
                <input type="number" value={form.max_discount} onChange={e => setForm({...form, max_discount: e.target.value})}
                  placeholder="Leave blank = no cap"
                  className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1">Usage Limit</label>
                <input type="number" value={form.usage_limit} onChange={e => setForm({...form, usage_limit: e.target.value})}
                  placeholder="e.g. 200"
                  className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1">Start Date</label>
                <input type="date" value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})}
                  className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1">End Date</label>
                <input type="date" value={form.end_date} onChange={e => setForm({...form, end_date: e.target.value})}
                  className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-stone-500 mb-1">Applicable To</label>
                <select value={form.applicable_to} onChange={e => setForm({...form, applicable_to: e.target.value})}
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
                <input value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  placeholder="Internal note about this coupon"
                  className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400" />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={() => { setModal(false); setForm({...BLANK_FORM}) }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-stone-200 text-stone-600 hover:bg-stone-50">
                Cancel
              </button>
              <button onClick={createCoupon} disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-60 flex items-center justify-center gap-2">
                {saving ? <><Loader size={14} className="animate-spin"/>Saving...</> : 'Create Coupon'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
