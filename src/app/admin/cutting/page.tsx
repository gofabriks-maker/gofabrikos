'use client'
import { useState } from 'react'
import { Scissors, Plus, Search, CheckCircle, Clock, XCircle, Package, Ruler, User, Hash, Calendar, Printer } from 'lucide-react'

type CuttingSlip = {
  id: string
  slipNo: string
  orderId: string
  customer: string
  rollId: string
  rollCode: string
  fabricName: string
  color: string
  metersOrdered: number
  metersCut: number
  cutBy: string
  issuedDate: string
  completedDate: string | null
  status: 'pending' | 'cutting' | 'done' | 'cancelled'
  notes: string
}

const SLIPS: CuttingSlip[] = [
  { id:'1', slipNo:'CS-0042', orderId:'GF-2024', customer:'Fatima Shaikh',   rollId:'R-0018', rollCode:'BSB-RED-018', fabricName:'Banarasi Silk Brocade',          color:'Red Gold',   metersOrdered:5.5, metersCut:5.5, cutBy:'Ravi Kumar',  issuedDate:'2026-08-05', completedDate:'2026-08-05', status:'done',     notes:'Extra 0.1m buffer given' },
  { id:'2', slipNo:'CS-0041', orderId:'GF-2023', customer:'Rekha Nair',      rollId:'R-0022', rollCode:'GFD-BLU-022', fabricName:'Georgette Floral Digital Print',  color:'Blue Multi', metersOrdered:3.0, metersCut:0,   cutBy:'Sriram',     issuedDate:'2026-08-05', completedDate:null,         status:'cutting',  notes:'' },
  { id:'3', slipNo:'CS-0040', orderId:'GF-2022', customer:'Meena Patel',     rollId:'R-0015', rollCode:'VEK-GRN-015', fabricName:'Velvet Embroidery Kurti',         color:'Bottle Green',metersOrdered:2.5, metersCut:0,   cutBy:'',           issuedDate:'2026-08-05', completedDate:null,         status:'pending',  notes:'Check pattern alignment' },
  { id:'4', slipNo:'CS-0039', orderId:'GF-2021', customer:'Kavitha Rao',     rollId:'R-0010', rollCode:'KSP-MRN-010', fabricName:'Kanjivaram Silk Pure',            color:'Maroon',     metersOrdered:6.2, metersCut:6.2, cutBy:'Ravi Kumar',  issuedDate:'2026-08-04', completedDate:'2026-08-04', status:'done',     notes:'' },
  { id:'5', slipNo:'CS-0038', orderId:'GF-2020', customer:'Sunita Verma',    rollId:'R-0030', rollCode:'CCB-WHT-030', fabricName:'Chanderi Cotton Blend',           color:'White',      metersOrdered:4.0, metersCut:4.0, cutBy:'Sriram',     issuedDate:'2026-08-04', completedDate:'2026-08-04', status:'done',     notes:'' },
  { id:'6', slipNo:'CS-0037', orderId:'GF-2019', customer:'Priya Sharma',    rollId:'R-0008', rollCode:'LFG-GLD-008', fabricName:'Lehenga Fabric Gold Tissue',      color:'Gold',       metersOrdered:8.0, metersCut:0,   cutBy:'',           issuedDate:'2026-08-05', completedDate:null,         status:'pending',  notes:'Wholesale order — handle carefully' },
  { id:'7', slipNo:'CS-0036', orderId:'GF-2018', customer:'Anitha Reddy',    rollId:'R-0025', rollCode:'RSN-NVY-025', fabricName:'Rayon Solid Navy Blue',           color:'Navy Blue',  metersOrdered:3.5, metersCut:3.5, cutBy:'Ravi Kumar',  issuedDate:'2026-08-03', completedDate:'2026-08-03', status:'done',     notes:'' },
  { id:'8', slipNo:'CS-0035', orderId:'GF-2017', customer:'Deepa Krishna',   rollId:'R-0012', rollCode:'OGN-PNK-012', fabricName:'Organza Shimmer Pink',            color:'Baby Pink',  metersOrdered:2.0, metersCut:0,   cutBy:'',           issuedDate:'2026-08-05', completedDate:null,         status:'cancelled',notes:'Customer cancelled order' },
]

const STATUS_STYLE: Record<string,string> = {
  pending:   'bg-amber-100 text-amber-700',
  cutting:   'bg-blue-100 text-blue-700',
  done:      'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-500',
}
const STATUS_ICON: Record<string,any> = {
  pending: Clock, cutting: Scissors, done: CheckCircle, cancelled: XCircle,
}

const ROLLS = [
  { id:'R-0018', code:'BSB-RED-018', name:'Banarasi Silk Brocade', color:'Red Gold', available:42 },
  { id:'R-0022', code:'GFD-BLU-022', name:'Georgette Floral Digital', color:'Blue Multi', available:23 },
  { id:'R-0015', code:'VEK-GRN-015', name:'Velvet Embroidery Kurti', color:'Bottle Green', available:8 },
  { id:'R-0030', code:'CCB-WHT-030', name:'Chanderi Cotton Blend', color:'White', available:3 },
  { id:'R-0025', code:'RSN-NVY-025', name:'Rayon Solid Navy Blue', color:'Navy Blue', available:88 },
]

export default function CuttingPage() {
  const [search, setSearch]   = useState('')
  const [statusF, setStatusF] = useState('all')
  const [selected, setSelected] = useState<CuttingSlip|null>(null)
  const [showModal, setModal] = useState(false)
  const [slips, setSlips]     = useState<CuttingSlip[]>(SLIPS)

  const [newSlip, setNewSlip] = useState({
    orderId:'', customer:'', rollId:'', metersOrdered:'', notes:''
  })

  const filtered = slips.filter(s => {
    const q = search.toLowerCase()
    const match = s.slipNo.toLowerCase().includes(q) || s.customer.toLowerCase().includes(q) ||
                  s.orderId.toLowerCase().includes(q) || s.rollCode.toLowerCase().includes(q)
    const st = statusF === 'all' || s.status === statusF
    return match && st
  })

  function markDone(id: string) {
    setSlips(prev => prev.map(s => s.id===id
      ? { ...s, status:'done', metersCut:s.metersOrdered, completedDate:new Date().toISOString().split('T')[0], cutBy:'Ravi Kumar' }
      : s
    ))
    setSelected(prev => prev?.id===id ? {...prev, status:'done', metersCut:prev.metersOrdered, completedDate:new Date().toISOString().split('T')[0]} : prev)
  }
  function markCutting(id: string) {
    setSlips(prev => prev.map(s => s.id===id ? { ...s, status:'cutting', cutBy:'Sriram' } : s))
  }

  const stats = {
    pending:  slips.filter(s=>s.status==='pending').length,
    cutting:  slips.filter(s=>s.status==='cutting').length,
    done:     slips.filter(s=>s.status==='done').length,
    metersCut:slips.filter(s=>s.status==='done').reduce((a,s)=>a+s.metersCut,0),
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Cutting Slips</h2>
          <p className="text-sm text-stone-500">Track fabric cutting for each order</p>
        </div>
        <button onClick={()=>setModal(true)}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold px-4 py-2 rounded-xl">
          <Plus size={15}/>New Cutting Slip
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label:'Pending',      value:stats.pending,              color:'text-amber-600' },
          { label:'Being Cut',    value:stats.cutting,              color:'text-blue-600' },
          { label:'Completed Today', value:stats.done,              color:'text-green-600' },
          { label:'Total Metres Cut', value:`${stats.metersCut}m`,  color:'text-rose-600' },
        ].map(s=>(
          <div key={s.label} className="bg-white rounded-xl border border-stone-200 p-4">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs font-semibold text-stone-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"/>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search slip#, order, customer, roll…"
            className="w-full pl-8 pr-4 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400 bg-white"/>
        </div>
        <select value={statusF} onChange={e=>setStatusF(e.target.value)}
          className="px-3 py-2.5 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="cutting">Cutting</option>
          <option value="done">Done</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50 text-xs font-semibold text-stone-400 text-left">
              <th className="px-5 py-3">SLIP #</th>
              <th className="px-5 py-3">ORDER / CUSTOMER</th>
              <th className="px-5 py-3">ROLL / FABRIC</th>
              <th className="px-5 py-3 text-right">ORDERED</th>
              <th className="px-5 py-3 text-right">CUT</th>
              <th className="px-5 py-3">STATUS</th>
              <th className="px-5 py-3">CUTTER</th>
              <th className="px-5 py-3">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {filtered.map(s => {
              const Icon = STATUS_ICON[s.status]
              return (
                <tr key={s.id} className="hover:bg-stone-50">
                  <td className="px-5 py-3">
                    <p className="font-mono font-bold text-xs text-rose-600">{s.slipNo}</p>
                    <p className="text-xs text-stone-400">{s.issuedDate}</p>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-sm font-semibold text-stone-800">{s.orderId}</p>
                    <p className="text-xs text-stone-400">{s.customer}</p>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-xs font-mono text-stone-600">{s.rollCode}</p>
                    <p className="text-xs text-stone-400 max-w-[150px] truncate">{s.fabricName}</p>
                  </td>
                  <td className="px-5 py-3 text-right font-bold text-stone-800">{s.metersOrdered}m</td>
                  <td className="px-5 py-3 text-right">
                    <span className={`font-bold text-sm ${s.metersCut>0?'text-green-600':'text-stone-300'}`}>
                      {s.metersCut > 0 ? `${s.metersCut}m` : '—'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`flex items-center gap-1 w-fit text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[s.status]}`}>
                      <Icon size={10}/>{s.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-stone-500">{s.cutBy || '—'}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <button onClick={()=>setSelected(s)} className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100" title="View"><Ruler size={13}/></button>
                      <button className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100" title="Print"><Printer size={13}/></button>
                      {s.status==='pending' && (
                        <button onClick={()=>markCutting(s.id)}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-2 py-1 rounded-lg hover:bg-blue-50">Start</button>
                      )}
                      {s.status==='cutting' && (
                        <button onClick={()=>markDone(s.id)}
                          className="text-xs font-semibold text-green-600 hover:text-green-800 px-2 py-1 rounded-lg hover:bg-green-50">Done</button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-stone-400 text-sm">No cutting slips found</div>
        )}
      </div>

      {/* Detail Panel */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end" onClick={()=>setSelected(null)}>
          <div className="bg-white w-full max-w-sm h-full overflow-y-auto shadow-2xl" onClick={e=>e.stopPropagation()}>
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <div>
                <p className="font-mono font-bold text-rose-600">{selected.slipNo}</p>
                <p className="text-xs text-stone-400">{selected.orderId}</p>
              </div>
              <button onClick={()=>setSelected(null)} className="text-stone-400 hover:text-stone-700 text-lg font-bold">✕</button>
            </div>
            <div className="p-6 space-y-4">
              {/* Cutting Slip Print Preview */}
              <div className="border-2 border-stone-200 rounded-xl p-4 space-y-3 font-mono text-xs">
                <div className="text-center border-b border-stone-200 pb-3">
                  <p className="font-bold text-sm">GoFabrikos</p>
                  <p className="font-bold">CUTTING SLIP — {selected.slipNo}</p>
                  <p>Date: {selected.issuedDate}</p>
                </div>
                <div className="space-y-1.5">
                  <p><span className="text-stone-400">Order:</span>     {selected.orderId}</p>
                  <p><span className="text-stone-400">Customer:</span>  {selected.customer}</p>
                  <p><span className="text-stone-400">Roll Code:</span> {selected.rollCode}</p>
                  <p><span className="text-stone-400">Fabric:</span>    {selected.fabricName}</p>
                  <p><span className="text-stone-400">Color:</span>     {selected.color}</p>
                </div>
                <div className="border-t border-stone-200 pt-3 space-y-1.5">
                  <p className="font-bold text-base">METRES TO CUT: {selected.metersOrdered}m</p>
                  {selected.notes && <p><span className="text-stone-400">Note:</span> {selected.notes}</p>}
                </div>
                <div className="border-t border-stone-200 pt-3 space-y-1">
                  <p><span className="text-stone-400">Cut By:</span> {selected.cutBy || '___________'}</p>
                  <p><span className="text-stone-400">Actual Cut:</span> {selected.metersCut > 0 ? `${selected.metersCut}m` : '___________'}</p>
                  <p><span className="text-stone-400">Completed:</span> {selected.completedDate || '___________'}</p>
                </div>
                <div className="border-t border-stone-200 pt-2 text-center text-stone-400">
                  Signature: ________________________
                </div>
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-bold">
                <Printer size={14}/>Print Slip
              </button>
              {selected.status === 'pending' && (
                <button onClick={()=>markCutting(selected.id)}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold">
                  Start Cutting
                </button>
              )}
              {selected.status === 'cutting' && (
                <button onClick={()=>markDone(selected.id)}
                  className="w-full py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-bold">
                  Mark as Done
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Slip Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900">New Cutting Slip</h3>
              <button onClick={()=>setModal(false)} className="text-stone-400 hover:text-stone-600 text-lg font-bold">✕</button>
            </div>
            <div className="space-y-3">
              {[
                { label:'Order ID', k:'orderId', placeholder:'e.g. GF-2025' },
                { label:'Customer Name', k:'customer', placeholder:'Customer name' },
                { label:'Metres to Cut', k:'metersOrdered', placeholder:'e.g. 3.5' },
              ].map(f=>(
                <div key={f.k}>
                  <label className="block text-xs font-semibold text-stone-500 mb-1">{f.label}</label>
                  <input value={(newSlip as any)[f.k]} onChange={e=>setNewSlip(p=>({...p,[f.k]:e.target.value}))}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400"/>
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1">Roll</label>
                <select value={newSlip.rollId} onChange={e=>setNewSlip(p=>({...p,rollId:e.target.value}))}
                  className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400">
                  <option value="">Select roll…</option>
                  {ROLLS.map(r=><option key={r.id} value={r.id}>{r.code} — {r.name} ({r.available}m left)</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1">Notes</label>
                <input value={newSlip.notes} onChange={e=>setNewSlip(p=>({...p,notes:e.target.value}))}
                  placeholder="Optional instructions"
                  className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400"/>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={()=>setModal(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-stone-200 text-stone-600">Cancel</button>
              <button onClick={()=>{
                if(!newSlip.orderId||!newSlip.rollId||!newSlip.metersOrdered) return
                const roll = ROLLS.find(r=>r.id===newSlip.rollId)!
                const slip: CuttingSlip = {
                  id:Date.now().toString(), slipNo:`CS-${String(slips.length+1).padStart(4,'0')}`,
                  orderId:newSlip.orderId, customer:newSlip.customer, rollId:newSlip.rollId,
                  rollCode:roll.code, fabricName:roll.name, color:roll.color,
                  metersOrdered:parseFloat(newSlip.metersOrdered), metersCut:0,
                  cutBy:'', issuedDate:new Date().toISOString().split('T')[0], completedDate:null,
                  status:'pending', notes:newSlip.notes,
                }
                setSlips(p=>[slip,...p])
                setModal(false)
                setNewSlip({orderId:'',customer:'',rollId:'',metersOrdered:'',notes:''})
              }}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white">
                Create Slip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
