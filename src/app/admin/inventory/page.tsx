'use client'
import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import {
  Search, Plus, AlertTriangle, Package, BarChart3,
  Eye, Scissors, QrCode, Download, Loader2, X, Edit2, Save, Check
} from 'lucide-react'

interface Roll {
  id:        string
  rollNo:    string
  product:   string
  category:  string
  slug:      string
  shade:     string
  total:     number
  available: number
  reserved:  number
  damaged:   number
  cost:      number
  status:    'active' | 'low' | 'exhausted' | 'damaged'
  rack:      string
  received:  string
  productId: string
  image?:    string
}

const STATUS_CONFIG = {
  active:    { label: 'Active',    cls: 'bg-green-100 text-green-700' },
  low:       { label: 'Low Stock', cls: 'bg-amber-100 text-amber-700' },
  exhausted: { label: 'Exhausted', cls: 'bg-red-100 text-red-600' },
  damaged:   { label: 'Damaged',   cls: 'bg-purple-100 text-purple-700' },
}

function mapRow(r: any): Roll {
  const p = r.gf_products || {}
  const avail = Number(r.available_metres) || 0
  let image = p.cloudinary_url || ''
  if (!image && Array.isArray(p.images) && p.images.length > 0) {
    const first = p.images[0]
    image = typeof first === 'string' ? first : first?.url || ''
  }
  const status: Roll['status'] =
    avail === 0 ? 'exhausted' : avail < 15 ? 'low' : 'active'

  return {
    id:        r.id,
    rollNo:    r.roll_number || '',
    product:   p.name || 'Unknown',
    category:  p.category || '',
    slug:      p.slug || '',
    shade:     r.shade_code || '',
    total:     Number(r.total_metres) || 0,
    available: avail,
    reserved:  Number(r.reserved_metres) || 0,
    damaged:   Number(r.damaged_metres) || 0,
    cost:      Number(r.cost_price) || Number(p.price) || 0,
    status,
    rack:      r.rack_location || '',
    received:  r.received_date ? r.received_date.split('T')[0] : '',
    productId: r.product_id || '',
    image:     image || undefined,
  }
}

// ── Edit Roll Modal ─────────────────────────────────────────────────────────
function EditRollModal({
  roll, onClose, onSaved,
}: {
  roll: Roll | null
  onClose: () => void
  onSaved: (updated: Roll) => void
}) {
  const [form, setForm]     = useState({ shade: '', total: '', available: '', reserved: '', damaged: '', rack: '', cost: '' })
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')
  const [saved,  setSaved]  = useState(false)

  useEffect(() => {
    if (roll) setForm({
      shade:     roll.shade,
      total:     String(roll.total),
      available: String(roll.available),
      reserved:  String(roll.reserved),
      damaged:   String(roll.damaged),
      rack:      roll.rack,
      cost:      String(roll.cost || ''),
    })
  }, [roll])

  if (!roll) return null

  async function handleSave() {
    if (!form.available) return setError('Available metres is required')
    setSaving(true); setError('')
    const res  = await fetch('/api/admin/inventory', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        id:               roll.id,
        shade_code:       form.shade,
        total_metres:     Number(form.total || roll.total),
        available_metres: Number(form.available),
        reserved_metres:  Number(form.reserved || 0),
        damaged_metres:   Number(form.damaged  || 0),
        rack_location:    form.rack,
        cost_price:       form.cost ? Number(form.cost) : undefined,
      }),
    })
    const json = await res.json()
    setSaving(false)
    if (!res.ok) { setError(json.error || 'Save failed'); return }
    setSaved(true)
    const avail = Number(form.available)
    const status: Roll['status'] = avail === 0 ? 'exhausted' : avail < 15 ? 'low' : 'active'
    onSaved({ ...roll, shade: form.shade, total: Number(form.total || roll.total), available: avail, reserved: Number(form.reserved || 0), damaged: Number(form.damaged || 0), rack: form.rack, cost: form.cost ? Number(form.cost) : roll.cost, status })
    setTimeout(() => { setSaved(false); onClose() }, 800)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold text-stone-900">Edit Roll</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600"><X size={18} /></button>
        </div>
        <p className="text-sm text-stone-500 mb-4">{roll.rollNo} · {roll.product}</p>
        {error && <p className="text-sm text-red-600 mb-3">✕ {error}</p>}
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: 'shade',     label: 'Shade Code',          placeholder: 'e.g. BAN-001',  type: 'text'   },
            { key: 'rack',      label: 'Rack Location',        placeholder: 'e.g. R-A1',     type: 'text'   },
            { key: 'total',     label: 'Total Metres',         placeholder: 'e.g. 100',      type: 'number' },
            { key: 'cost',      label: 'Cost Price (₹/metre)', placeholder: 'e.g. 900',      type: 'number' },
            { key: 'available', label: 'Available Metres *',   placeholder: 'e.g. 50',       type: 'number' },
            { key: 'reserved',  label: 'Reserved Metres',      placeholder: '0',             type: 'number' },
            { key: 'damaged',   label: 'Damaged Metres',       placeholder: '0',             type: 'number' },
          ].map(({ key, label, placeholder, type }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-stone-500 mb-1">{label}</label>
              <input
                type={type}
                placeholder={placeholder}
                value={(form as any)[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full text-sm px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} disabled={saving}
            className="flex-1 py-2.5 border border-stone-200 rounded-xl text-sm text-stone-600 hover:bg-stone-50">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving || saved}
            className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-60">
            {saved    ? <><Check size={14} /> Saved!</> :
             saving   ? <><Loader2 size={14} className="animate-spin" /> Saving…</> :
                        <><Save size={14} /> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Add Roll Modal ─────────────────────────────────────────────────────────
interface AddRollModalProps {
  open: boolean
  onClose: () => void
  products: { id: string; name: string; category: string }[]
  onAdded: (roll: Roll) => void
}

function AddRollModal({ open, onClose, products, onAdded }: AddRollModalProps) {
  const [form, setForm]     = useState({ product_id: '', shade_code: '', total_metres: '', cost_price: '', rack_location: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  if (!open) return null

  async function handleSave() {
    if (!form.product_id)    return setError('Select a product')
    if (!form.total_metres)  return setError('Enter total metres')
    setSaving(true); setError('')
    const res  = await fetch('/api/admin/inventory', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ ...form, available_metres: form.total_metres }),
    })
    const json = await res.json()
    setSaving(false)
    if (!res.ok) { setError(json.error || 'Save failed'); return }
    onAdded(mapRow({ ...json.data, gf_products: products.find(p => p.id === form.product_id) }))
    onClose()
    setForm({ product_id: '', shade_code: '', total_metres: '', cost_price: '', rack_location: '' })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-stone-900">Add New Roll</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600"><X size={18} /></button>
        </div>
        {error && <p className="text-sm text-red-600 mb-3">✕ {error}</p>}
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-stone-500 mb-1">Product *</label>
            <select value={form.product_id} onChange={e => setForm(f => ({ ...f, product_id: e.target.value }))}
              className="w-full text-sm px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400 bg-white">
              <option value="">Select product…</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          {[
            { key: 'shade_code',    label: 'Shade Code',      placeholder: 'e.g. BAN-001' },
            { key: 'total_metres',  label: 'Total Metres *',  placeholder: 'e.g. 60',     type: 'number' },
            { key: 'cost_price',    label: 'Cost/Metre (₹)',  placeholder: 'e.g. 900',    type: 'number' },
            { key: 'rack_location', label: 'Rack Location',   placeholder: 'e.g. R-A1' },
          ].map(({ key, label, placeholder, type }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-stone-500 mb-1">{label}</label>
              <input
                type={type || 'text'}
                placeholder={placeholder}
                value={(form as any)[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full text-sm px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} disabled={saving}
            className="flex-1 py-2.5 border border-stone-200 rounded-xl text-sm text-stone-600 hover:bg-stone-50">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-60">
            {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : 'Add Roll'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Inventory Page ────────────────────────────────────────────────────
export default function InventoryPage() {
  const [rolls,    setRolls]    = useState<Roll[]>([])
  const [products, setProducts] = useState<{ id: string; name: string; category: string }[]>([])
  const [loading,  setLoading]  = useState(true)
  const [loadErr,  setLoadErr]  = useState('')
  const [editRoll, setEditRoll] = useState<Roll | null>(null)

  const [search,  setSearch]  = useState('')
  const [filter,  setFilter]  = useState('all')
  const [sortBy,  setSortBy]  = useState<'available' | 'total' | 'received'>('available')
  const [addOpen, setAddOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch('/api/admin/inventory')
      .then(r => r.json())
      .then(json => {
        if (json.error) { setLoadErr(json.error); return }
        setRolls((json.data || []).map(mapRow))
      })
      .catch(() => setLoadErr('Failed to load inventory'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetch('/api/admin/products?limit=200')
      .then(r => r.json())
      .then(json => {
        setProducts((json.data || []).map((p: any) => ({
          id: p.id, name: p.name, category: p.category || '',
        })))
      })
  }, [])

  const filtered = useMemo(() => {
    let list = rolls.filter(r => {
      const ms = !search ||
        [r.rollNo, r.product, r.category, r.shade, r.rack].some(f => f.toLowerCase().includes(search.toLowerCase()))
      const mf = filter === 'all' || r.status === filter
      return ms && mf
    })
    list = [...list].sort((a, b) => {
      if (sortBy === 'available') return a.available - b.available
      if (sortBy === 'total')     return b.total - a.total
      return b.received.localeCompare(a.received)
    })
    return list
  }, [rolls, search, filter, sortBy])

  const stats = {
    totalRolls:  rolls.length,
    totalMetres: rolls.reduce((s, r) => s + r.available, 0),
    lowStock:    rolls.filter(r => r.status === 'low' || r.status === 'exhausted').length,
    totalValue:  rolls.reduce((s, r) => s + r.available * r.cost, 0),
  }

  const lowStockRolls = rolls.filter(r => ['low', 'exhausted'].includes(r.status))

  function handleSaved(updated: Roll) {
    setRolls(prev => prev.map(r => r.id === updated.id ? updated : r))
  }

  return (
    <>
      <EditRollModal roll={editRoll} onClose={() => setEditRoll(null)} onSaved={handleSaved} />
      <AddRollModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        products={products}
        onAdded={roll => setRolls(prev => [...prev, roll])}
      />

      <div className="p-6 max-w-[1400px] mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900">Inventory</h2>
            <p className="text-sm text-stone-500">Roll-based fabric stock management</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 border border-stone-200 bg-white text-stone-600 text-sm px-3 py-2 rounded-xl hover:bg-stone-50">
              <Download size={14} /> Export
            </button>
            <button onClick={() => setAddOpen(true)}
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold px-4 py-2 rounded-xl">
              <Plus size={14} /> Add Roll
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Rolls',      value: loading ? '…' : stats.totalRolls,  cls: 'bg-blue-50 text-blue-600',   icon: Package },
            { label: 'Available Stock',  value: loading ? '…' : `${stats.totalMetres}m`, cls: 'bg-green-50 text-green-600', icon: BarChart3 },
            { label: 'Low Stock Alerts', value: loading ? '…' : stats.lowStock,    cls: 'bg-amber-50 text-amber-600', icon: AlertTriangle },
            { label: 'Inventory Value',  value: loading ? '…' : `₹${(stats.totalValue / 1000).toFixed(0)}K`, cls: 'bg-rose-50 text-rose-600', icon: BarChart3 },
          ].map(k => (
            <div key={k.label} className="bg-white rounded-xl border border-stone-200 p-4">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${k.cls}`}>
                <k.icon size={16} />
              </div>
              <p className="text-2xl font-bold text-stone-900">{k.value}</p>
              <p className="text-xs text-stone-400 mt-0.5">{k.label}</p>
            </div>
          ))}
        </div>

        {/* Low stock banner */}
        {!loading && lowStockRolls.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={16} className="text-amber-500" />
              <p className="text-sm font-bold text-amber-800">{lowStockRolls.length} rolls need restocking</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {lowStockRolls.map(r => (
                <button key={r.id} onClick={() => setEditRoll(r)}
                  className="text-xs bg-white border border-amber-200 text-amber-700 px-2 py-1 rounded-lg hover:bg-amber-50 transition-colors">
                  {r.product} · <strong>{r.available}m</strong> — click to update stock
                </button>
              ))}
            </div>
          </div>
        )}

        {loadErr && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">✕ {loadErr}</div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search roll number, product, shade…"
              className="w-full pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { label: 'All',       value: 'all' },
              { label: 'Active',    value: 'active' },
              { label: 'Low Stock', value: 'low' },
              { label: 'Exhausted', value: 'exhausted' },
            ].map(f => (
              <button key={f.value} onClick={() => setFilter(f.value)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors
                  ${filter === f.value ? 'bg-rose-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
                {f.label}
              </button>
            ))}
            <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-2 rounded-xl text-xs border border-stone-200 bg-white text-stone-600 focus:outline-none">
              <option value="available">Sort: Low Stock First</option>
              <option value="total">Sort: Total Metres</option>
              <option value="received">Sort: Newest</option>
            </select>
          </div>
        </div>

        {/* Rolls Table */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-2 text-stone-400">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm">Loading inventory…</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50 text-left text-xs font-semibold text-stone-400">
                    <th className="px-4 py-3">ROLL</th>
                    <th className="px-4 py-3">PRODUCT</th>
                    <th className="px-4 py-3">SHADE</th>
                    <th className="px-4 py-3 text-right">TOTAL</th>
                    <th className="px-4 py-3 text-right">AVAILABLE</th>
                    <th className="px-4 py-3 text-right">RESERVED</th>
                    <th className="px-4 py-3 text-right">DAMAGED</th>
                    <th className="px-4 py-3">RACK</th>
                    <th className="px-4 py-3">STATUS</th>
                    <th className="px-4 py-3 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={10} className="text-center py-16 text-stone-400 text-sm">
                        {rolls.length === 0
                          ? 'No rolls yet — click "Add Roll" to add fabric stock.'
                          : 'No rolls match the current filters.'}
                      </td>
                    </tr>
                  )}
                  {filtered.map(roll => {
                    const pct = roll.total > 0 ? (roll.available / roll.total) * 100 : 0
                    const cfg = STATUS_CONFIG[roll.status]
                    return (
                      <tr key={roll.id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="text-sm font-bold text-rose-600">{roll.rollNo}</p>
                          <p className="text-xs text-stone-400">{roll.received}</p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {roll.image && (
                              <img src={roll.image} alt={roll.product}
                                className="w-8 h-8 rounded-lg object-cover shrink-0" />
                            )}
                            <div>
                              <p className="text-sm font-medium text-stone-800 max-w-[140px] truncate">{roll.product}</p>
                              <p className="text-xs text-stone-400">{roll.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-stone-600 font-mono">{roll.shade || '—'}</td>
                        <td className="px-4 py-3 text-right text-sm text-stone-600">{roll.total}m</td>
                        <td className="px-4 py-3 text-right">
                          <p className={`text-sm font-bold ${roll.available < 15 ? 'text-red-600' : 'text-stone-800'}`}>
                            {roll.available}m
                          </p>
                          <div className="w-16 h-1 bg-stone-100 rounded-full mt-1 ml-auto">
                            <div className={`h-1 rounded-full ${pct < 30 ? 'bg-red-400' : pct < 60 ? 'bg-amber-400' : 'bg-green-400'}`}
                              style={{ width: `${Math.min(pct, 100)}%` }} />
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-stone-500">{roll.reserved}m</td>
                        <td className="px-4 py-3 text-right text-sm">
                          {roll.damaged > 0
                            ? <span className="text-red-500 font-medium">{roll.damaged}m</span>
                            : <span className="text-stone-400">—</span>}
                        </td>
                        <td className="px-4 py-3 text-xs font-mono text-stone-600">{roll.rack || '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.cls}`}>
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* Edit — opens edit modal */}
                            <button
                              title="Edit stock"
                              onClick={() => setEditRoll(roll)}
                              className="p-1.5 rounded-lg hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors">
                              <Edit2 size={14} />
                            </button>
                            {/* View — opens product on frontend */}
                            {roll.slug ? (
                              <Link
                                href={`/fabrics/${roll.slug}`}
                                target="_blank"
                                title="View on site"
                                className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors">
                                <Eye size={14} />
                              </Link>
                            ) : (
                              <button title="View on site" className="p-1.5 rounded-lg text-stone-200 cursor-not-allowed">
                                <Eye size={14} />
                              </button>
                            )}
                            {/* Cut & QR — coming soon */}
                            <button title="Cut slip (coming soon)"
                              onClick={() => alert('Cutting slip feature coming soon!')}
                              className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors">
                              <Scissors size={14} />
                            </button>
                            <button title="QR code (coming soon)"
                              onClick={() => alert('QR code feature coming soon!')}
                              className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-blue-600 transition-colors">
                              <QrCode size={14} />
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
          <div className="border-t border-stone-100 px-4 py-3">
            <p className="text-xs text-stone-500">
              {filtered.length} rolls · {filtered.reduce((s, r) => s + r.available, 0)}m available ·
              Value: ₹{filtered.reduce((s, r) => s + r.available * r.cost, 0).toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
