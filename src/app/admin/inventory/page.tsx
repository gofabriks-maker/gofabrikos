'use client'
import { useState, useMemo } from 'react'
import {
  Search, Plus, AlertTriangle, Package, BarChart3,
  ChevronDown, Eye, Edit2, Scissors, QrCode, Download,
  ArrowUpDown, CheckCircle, XCircle, Filter
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────
interface Roll {
  id:        string
  rollNo:    string
  product:   string
  category:  string
  shade:     string
  total:     number
  available: number
  reserved:  number
  damaged:   number
  cost:      number
  status:    'active' | 'low' | 'exhausted' | 'damaged'
  rack:      string
  received:  string
}

// ── Mock rolls ─────────────────────────────────────────────────────────────
const MOCK_ROLLS: Roll[] = [
  { id:'1', rollNo:'RL-2026-0001', product:'Banarasi Silk Brocade',    category:'Designer Sarees', shade:'BRS-001',  total:50,  available:42,  reserved:4,  damaged:4,  cost:850,  status:'active',    rack:'R-A1', received:'2026-07-01' },
  { id:'2', rollNo:'RL-2026-0002', product:'Pure Cotton Ikat Print',   category:'Kurti Fabrics',   shade:'CTN-015',  total:80,  available:67,  reserved:8,  damaged:5,  cost:350,  status:'active',    rack:'R-B2', received:'2026-07-05' },
  { id:'3', rollNo:'RL-2026-0003', product:'Georgette Floral Digital', category:'Lehenga Fabrics', shade:'GRG-022',  total:60,  available:23,  reserved:6,  damaged:2,  cost:450,  status:'low',       rack:'R-A3', received:'2026-07-08' },
  { id:'4', rollNo:'RL-2026-0004', product:'Rayon Solid Navy Blue',    category:'Plain Fabrics',   shade:'RYN-008',  total:100, available:88,  reserved:12, damaged:0,  cost:280,  status:'active',    rack:'R-C1', received:'2026-07-10' },
  { id:'5', rollNo:'RL-2026-0005', product:'Velvet Embroidery Kurti',  category:'Blouse Fabrics',  shade:'VLV-003',  total:30,  available:8,   reserved:2,  damaged:0,  cost:620,  status:'low',       rack:'R-A2', received:'2026-07-12' },
  { id:'6', rollNo:'RL-2026-0006', product:'Organza Mirror Work',      category:'Lehenga Fabrics', shade:'ORG-011',  total:40,  available:12,  reserved:3,  damaged:5,  cost:750,  status:'low',       rack:'R-B1', received:'2026-07-15' },
  { id:'7', rollNo:'RL-2026-0007', product:'Chanderi Cotton Blend',    category:'Kurti Fabrics',   shade:'CHD-005',  total:70,  available:3,   reserved:0,  damaged:0,  cost:420,  status:'low',       rack:'R-C3', received:'2026-07-18' },
  { id:'8', rollNo:'RL-2026-0008', product:'Linen Stripe Natural',     category:'Plain Fabrics',   shade:'LNN-002',  total:90,  available:72,  reserved:6,  damaged:2,  cost:320,  status:'active',    rack:'R-D1', received:'2026-07-20' },
  { id:'9', rollNo:'RL-2026-0009', product:'Chiffon Printed Dupatta',  category:'Dupattas',        shade:'CHF-009',  total:45,  available:0,   reserved:0,  damaged:0,  cost:380,  status:'exhausted', rack:'R-B3', received:'2026-06-01' },
  { id:'10',rollNo:'RL-2026-0010', product:'Digital Print Kurti',      category:'Kurti Fabrics',   shade:'DGP-020',  total:60,  available:45,  reserved:9,  damaged:6,  cost:390,  status:'active',    rack:'R-A4', received:'2026-07-25' },
]

const STATUS_CONFIG = {
  active:    { label: 'Active',    cls: 'bg-green-100 text-green-700' },
  low:       { label: 'Low Stock', cls: 'bg-amber-100 text-amber-700' },
  exhausted: { label: 'Exhausted', cls: 'bg-red-100 text-red-600' },
  damaged:   { label: 'Damaged',   cls: 'bg-purple-100 text-purple-700' },
}

// ── Add Roll Modal ─────────────────────────────────────────────────────────
function AddRollModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10">
        <h3 className="text-lg font-bold text-stone-900 mb-4">Add New Roll</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            ['Roll Number', 'e.g. RL-2026-0011'],
            ['Product',     'Search product name'],
            ['Batch No.',   'e.g. BATCH-001'],
            ['Shade',       'Shade code'],
            ['Total Metres','e.g. 60'],
            ['Cost/Metre',  'e.g. 450'],
            ['Rack',        'e.g. R-A1'],
            ['Shelf',       'e.g. S-1'],
          ].map(([label, placeholder]) => (
            <div key={label}>
              <label className="block text-xs font-semibold text-stone-500 mb-1">{label}</label>
              <input placeholder={placeholder}
                className="w-full text-sm px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400" />
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose}
            className="flex-1 py-2.5 border border-stone-200 rounded-xl text-sm text-stone-600 hover:bg-stone-50">
            Cancel
          </button>
          <button onClick={onClose}
            className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl">
            Add Roll
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Inventory Page ────────────────────────────────────────────────────
export default function InventoryPage() {
  const [rolls]    = useState<Roll[]>(MOCK_ROLLS)
  const [search, setSearch]       = useState('')
  const [filter, setFilter]       = useState('all')
  const [sortBy, setSortBy]       = useState<'available' | 'total' | 'received'>('available')
  const [addOpen, setAddOpen]     = useState(false)

  const filtered = useMemo(() => {
    let list = rolls.filter(r => {
      const matchSearch = !search ||
        [r.rollNo, r.product, r.category, r.shade].some(f => f.toLowerCase().includes(search.toLowerCase()))
      const matchFilter = filter === 'all' || r.status === filter
      return matchSearch && matchFilter
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
    lowStock:    rolls.filter(r => r.status === 'low').length,
    totalValue:  rolls.reduce((s, r) => s + r.available * r.cost, 0),
  }

  const lowStockRolls = rolls.filter(r => ['low','exhausted'].includes(r.status))

  return (
    <>
      <AddRollModal open={addOpen} onClose={() => setAddOpen(false)} />

      <div className="p-6 max-w-[1400px] mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900">Inventory</h2>
            <p className="text-sm text-stone-500">Roll-based fabric stock management</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 border border-stone-200 bg-white text-stone-600 text-sm px-3 py-2 rounded-xl hover:bg-stone-50">
              <Download size={14} />Export
            </button>
            <button onClick={() => setAddOpen(true)}
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold px-4 py-2 rounded-xl">
              <Plus size={14} />Add Roll
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Rolls',      value: stats.totalRolls, sub: 'Active rolls',           cls: 'bg-blue-50 text-blue-600',  icon: Package },
            { label: 'Available Stock',  value: `${stats.totalMetres}m`, sub: 'Metres available',cls: 'bg-green-50 text-green-600', icon: BarChart3 },
            { label: 'Low Stock Alerts', value: stats.lowStock,   sub: 'Need restocking',        cls: 'bg-amber-50 text-amber-600', icon: AlertTriangle },
            { label: 'Inventory Value',  value: `₹${(stats.totalValue/1000).toFixed(0)}K`, sub: 'At cost price', cls: 'bg-rose-50 text-rose-600', icon: BarChart3 },
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

        {/* Low stock alert banner */}
        {lowStockRolls.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={16} className="text-amber-500" />
              <p className="text-sm font-bold text-amber-800">{lowStockRolls.length} rolls need restocking</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {lowStockRolls.map(r => (
                <span key={r.id} className="text-xs bg-white border border-amber-200 text-amber-700 px-2 py-1 rounded-lg">
                  {r.product} · <strong>{r.available}m</strong>
                </span>
              ))}
            </div>
          </div>
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
                  <tr><td colSpan={10} className="text-center py-12 text-stone-400 text-sm">No rolls found</td></tr>
                )}
                {filtered.map(roll => {
                  const pct = (roll.available / roll.total) * 100
                  const cfg = STATUS_CONFIG[roll.status]
                  return (
                    <tr key={roll.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-bold text-rose-600">{roll.rollNo}</p>
                        <p className="text-xs text-stone-400">{roll.received}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-stone-800 max-w-[160px] truncate">{roll.product}</p>
                        <p className="text-xs text-stone-400">{roll.category}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-stone-600 font-mono">{roll.shade}</td>
                      <td className="px-4 py-3 text-right text-sm text-stone-600">{roll.total}m</td>
                      <td className="px-4 py-3 text-right">
                        <div>
                          <p className={`text-sm font-bold ${roll.available < 15 ? 'text-red-600' : 'text-stone-800'}`}>
                            {roll.available}m
                          </p>
                          <div className="w-16 h-1 bg-stone-100 rounded-full mt-1 ml-auto">
                            <div className={`h-1 rounded-full ${pct < 30 ? 'bg-red-400' : pct < 60 ? 'bg-amber-400' : 'bg-green-400'}`}
                              style={{ width: `${Math.min(pct, 100)}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-stone-500">{roll.reserved}m</td>
                      <td className="px-4 py-3 text-right text-sm text-stone-500">
                        {roll.damaged > 0 ? (
                          <span className="text-red-500 font-medium">{roll.damaged}m</span>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-stone-600">{roll.rack}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.cls}`}>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button title="View" className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700">
                            <Eye size={14} />
                          </button>
                          <button title="Cut" className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-rose-600">
                            <Scissors size={14} />
                          </button>
                          <button title="QR Code" className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-blue-600">
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
