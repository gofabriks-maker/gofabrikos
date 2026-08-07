'use client'
import { useState, useEffect, useCallback } from 'react'
import {
  TrendingUp, Package, Users, IndianRupee,
  Download, RefreshCw, Calendar, BarChart3,
  ShoppingBag, Star, ArrowUpRight, ArrowDownRight,
  Minus, Printer, AlertTriangle, CheckCircle2,
  Brain, FileSpreadsheet, Receipt, Lightbulb,
  Info, Layers, Megaphone, Share2, MessageCircle,
  Tag, Mail, Building2, ChevronRight,
} from 'lucide-react'

// ── Helpers ───────────────────────────────────────────────────────────────────
function inr(n: number) { return `₹${(n||0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}` }
function fmtN(n: number | string) { return Number(n||0).toLocaleString('en-IN') }
type Range = 'daily'|'weekly'|'monthly'|'yearly'

// ── Shared components ─────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, icon: Icon, color, trend }:
  { label:string; value:string; sub?:string; icon:any; color:string; trend?:'up'|'down'|'flat' }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={18} className="text-white"/>
        </div>
        {trend && (
          <span className={`text-xs font-semibold flex items-center gap-0.5 ${trend==='up'?'text-green-600':trend==='down'?'text-red-500':'text-gray-400'}`}>
            {trend==='up'?<ArrowUpRight size={12}/>:trend==='down'?<ArrowDownRight size={12}/>:<Minus size={12}/>}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-0.5">{value}</p>
      <p className="text-xs font-semibold text-gray-500">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

function MiniBar({ label, value, max, color='bg-rose-500', sub }:
  { label:string; value:number; max:number; color?:string; sub?:string }) {
  const pct = max > 0 ? Math.min((value/max)*100, 100) : 0
  return (
    <div className="flex items-center gap-2 mb-2.5">
      <span className="text-xs text-gray-600 w-36 truncate flex-none">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{width:`${pct}%`}}/>
      </div>
      <span className="text-xs font-semibold text-gray-800 w-24 text-right flex-none">
        {value > 1000 ? inr(value) : fmtN(value)}{sub}
      </span>
    </div>
  )
}

function SHdr({ title, onCSV, onExcel, onPrint, onWhatsApp }:
  { title:string; onCSV?:()=>void; onExcel?:()=>void; onPrint?:()=>void; onWhatsApp?:()=>void }) {
  return (
    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
      <h2 className="text-base font-bold text-gray-900">{title}</h2>
      <div className="flex gap-1.5 flex-wrap">
        {onWhatsApp && <button onClick={onWhatsApp} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-green-50 text-green-700 hover:bg-green-100 rounded-xl"><MessageCircle size={11}/> WhatsApp</button>}
        {onCSV      && <button onClick={onCSV}      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl"><Download size={11}/> CSV</button>}
        {onExcel    && <button onClick={onExcel}    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl"><FileSpreadsheet size={11}/> Excel</button>}
        {onPrint    && <button onClick={onPrint}    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl"><Printer size={11}/> Print</button>}
      </div>
    </div>
  )
}

// ── Exports ───────────────────────────────────────────────────────────────────
function dlCSV(filename: string, rows: any[], cols: string[]) {
  const header = cols.join(',')
  const body   = rows.map(r => cols.map(c => JSON.stringify(r[c]??'')).join(',')).join('\n')
  const blob   = new Blob([`${header}\n${body}`], {type:'text/csv'})
  const a      = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; a.click()
}

async function dlExcel(filename: string, sheets: {name:string;rows:any[];cols:string[]}[]) {
  if (!(window as any).XLSX) {
    await new Promise<void>((resolve, reject) => {
      const s = document.createElement('script')
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
      s.onload = ()=>resolve(); s.onerror = reject; document.head.appendChild(s)
    })
  }
  const XLSX = (window as any).XLSX
  const wb   = XLSX.utils.book_new()
  sheets.forEach(({ name, rows, cols }) => {
    const ws = XLSX.utils.aoa_to_sheet([cols, ...rows.map(r => cols.map(c => r[c]??''))])
    XLSX.utils.book_append_sheet(wb, ws, name.slice(0,31))
  })
  XLSX.writeFile(wb, filename)
}

function waShare(text: string) {
  window.open(`https://wa.me/918790125438?text=${encodeURIComponent(text)}`, '_blank')
}

// ══════════════════════════════════════════════════════════════════════════════
export default function AdminReportsPage() {
  const [activeTab, setActiveTab] = useState<'insights'|'sales'|'finance'|'inventory'|'customers'|'textile'|'marketing'>('insights')
  const [range,     setRange]     = useState<Range>('monthly')
  const [data,      setData]      = useState<Record<string, any>>({})
  const [loading,   setLoading]   = useState(false)

  const load = useCallback(async (tab: typeof activeTab, r?: Range) => {
    setLoading(true)
    const rng = r || range
    const urls: Record<string, string> = {
      insights:  '/api/admin/reports/insights',
      sales:     `/api/admin/reports/sales?range=${rng}`,
      finance:   `/api/admin/reports/finance?range=${rng}`,
      inventory: '/api/admin/reports/inventory',
      customers: '/api/admin/reports/customers',
      textile:   `/api/admin/reports/textile?range=${rng}`,
      marketing: `/api/admin/reports/marketing?range=${rng}`,
    }
    try {
      const j = await fetch(urls[tab]).then(x => x.json())
      setData(prev => ({ ...prev, [tab]: j }))
    } catch {}
    setLoading(false)
  }, [range])

  useEffect(() => { if (!data[activeTab]) load(activeTab) }, [activeTab])

  const d  = data[activeTab] || {}
  const s  = d.summary       || {}

  const TABS = [
    { key:'insights',  label:'AI Insights',   icon:Brain     },
    { key:'sales',     label:'Sales',          icon:TrendingUp},
    { key:'finance',   label:'Finance & GST',  icon:Receipt   },
    { key:'textile',   label:'Textile',        icon:Layers    },
    { key:'inventory', label:'Inventory',      icon:Package   },
    { key:'customers', label:'Customers',      icon:Users     },
    { key:'marketing', label:'Marketing',      icon:Megaphone },
  ]

  const INSIGHT_STYLE: Record<string, {border:string;bg:string;icon:any;iconColor:string}> = {
    positive:{ border:'border-green-200', bg:'bg-green-50',  icon:CheckCircle2, iconColor:'text-green-600' },
    warning: { border:'border-amber-200', bg:'bg-amber-50',  icon:AlertTriangle,iconColor:'text-amber-600' },
    action:  { border:'border-blue-200',  bg:'bg-blue-50',   icon:Lightbulb,    iconColor:'text-blue-600'  },
    info:    { border:'border-gray-200',  bg:'bg-gray-50',   icon:Info,         iconColor:'text-gray-500'  },
  }

  const RangeBar = ({ onChange }: { onChange?: (r: Range) => void }) => (
    <div className="flex gap-2 items-center mb-5">
      <Calendar size={14} className="text-gray-400"/>
      {(['daily','weekly','monthly','yearly'] as Range[]).map(r => (
        <button key={r} onClick={() => { setRange(r); load(activeTab, r); onChange?.(r) }}
          className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors ${range===r?'bg-rose-600 text-white':'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
          {r.charAt(0).toUpperCase()+r.slice(1)}
        </button>
      ))}
    </div>
  )

  // ── WhatsApp summary builder ───────────────────────────────────
  function buildWaSummary(): string {
    const ai = data['insights'] || {}
    const sl = data['sales']    || {}
    const ss = sl.summary       || {}
    const now = new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
    return `📊 *GoFabrikos Business Report — ${now}*\n\n` +
      `💰 Revenue: ${inr(ss.totalRevenue||0)}\n` +
      `🛍️ Orders: ${fmtN(ss.paidOrders||0)} paid\n` +
      `📦 Metres Sold: ${fmtN(ss.totalMetres||0)} m\n` +
      `🏷️ Avg Order: ${inr(ss.avgOrderValue||0)}\n` +
      `❌ Cancellation: ${ss.cancellationRate||0}%\n\n` +
      (ai.insights?.slice(0,2).map((i:any) => `• ${i.title}`).join('\n') || '') +
      `\n\n_Generated from GoFabrikos Admin_`
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen print:p-0 print:bg-white">
      <style>{`@media print { .no-print { display:none !important } }`}</style>

      {/* Header */}
      <div className="flex items-center justify-between mb-6 no-print">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 size={24} className="text-rose-600"/> Reports & Intelligence
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Phase 9 — GoFabrikos Business Analytics</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => waShare(buildWaSummary())}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold transition-colors">
            <MessageCircle size={14}/> Share on WhatsApp
          </button>
          <button onClick={() => load(activeTab)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
            <RefreshCw size={14} className={loading?'animate-spin':''}/> Refresh
          </button>
          <button onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 transition-colors">
            <Printer size={14}/> Print
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-white rounded-xl border border-gray-200 p-1 w-fit mb-6 no-print">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setActiveTab(key as any)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeTab===key ? 'bg-stone-900 text-white' : 'text-gray-500 hover:text-gray-700'
            }`}>
            <Icon size={13}/> {label}
          </button>
        ))}
      </div>

      {/* ══ AI INSIGHTS ══════════════════════════════════════════════════════ */}
      {activeTab==='insights' && (
        <div className="space-y-5">
          <div className="bg-gradient-to-r from-stone-900 to-stone-800 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-2 mb-1">
              <Brain size={20} className="text-rose-400"/>
              <h2 className="font-bold text-lg">AI Executive Insights</h2>
              <span className="ml-2 text-xs bg-rose-700 px-2 py-0.5 rounded-full">Live</span>
            </div>
            <p className="text-stone-400 text-sm">
              {d.period?.current_month} {d.period?.current_year} · generated {d.generated_at ? new Date(d.generated_at).toLocaleTimeString('en-IN') : '…'}
            </p>
          </div>
          {d.kpis && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard label="Month Revenue"    value={inr(d.kpis.curRev||0)}       icon={IndianRupee} color="bg-rose-600"
                trend={d.kpis.revGrowth>0?'up':d.kpis.revGrowth<0?'down':'flat'}
                sub={`${d.kpis.revGrowth>0?'+':''}${Math.round(d.kpis.revGrowth||0)}% vs last month`}/>
              <KpiCard label="Orders"           value={fmtN(d.kpis.curOrders||0)}   icon={ShoppingBag} color="bg-blue-600"
                trend={d.kpis.orderGrowth>0?'up':d.kpis.orderGrowth<0?'down':'flat'}
                sub={`vs ${fmtN(d.kpis.prevOrders||0)} last month`}/>
              <KpiCard label="Repeat Rate"      value={`${Math.round(d.kpis.repeatRate||0)}%`} icon={Users} color="bg-purple-600"/>
              <KpiCard label="Cancellation"     value={`${Math.round(d.kpis.cancellRate||0)}%`} icon={AlertTriangle}
                color={d.kpis.cancellRate>15?'bg-red-600':'bg-green-600'}/>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {(d.insights||[]).map((ins: any, i: number) => {
              const st = INSIGHT_STYLE[ins.type] || INSIGHT_STYLE.info
              const Icon = st.icon
              return (
                <div key={i} className={`rounded-2xl border p-5 ${st.border} ${st.bg}`}>
                  <div className="flex items-start gap-3">
                    <Icon size={18} className={`${st.iconColor} flex-none mt-0.5`}/>
                    <div>
                      <p className="font-bold text-gray-900 text-sm mb-1">{ins.title}</p>
                      <p className="text-xs text-gray-600 leading-relaxed">{ins.body}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          {d.topProducts?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3">Top Products This Month</h3>
              {d.topProducts.map((p: any, i: number) => (
                <MiniBar key={p.name} label={`${i+1}. ${p.name}`} value={p.revenue} max={d.topProducts[0]?.revenue||1} color="bg-rose-500"/>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══ SALES ══════════════════════════════════════════════════════════════ */}
      {activeTab==='sales' && (
        <div className="space-y-6">
          <RangeBar/>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <KpiCard label="Revenue"      value={inr(s.totalRevenue||0)}     icon={IndianRupee}   color="bg-rose-600"/>
            <KpiCard label="Paid Orders"  value={fmtN(s.paidOrders||0)}      icon={ShoppingBag}   color="bg-blue-600"/>
            <KpiCard label="Avg Order"    value={inr(s.avgOrderValue||0)}    icon={TrendingUp}    color="bg-purple-600"/>
            <KpiCard label="Metres Sold"  value={`${fmtN(s.totalMetres||0)} m`} icon={Package}   color="bg-amber-600"/>
            <KpiCard label="Cancellation" value={`${s.cancellationRate||0}%`} icon={AlertTriangle} color="bg-gray-500"/>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <SHdr title="By Payment Mode" onCSV={()=>dlCSV('payment-mode.csv',d.charts?.byPayment||[],['mode','orders','revenue'])}/>
              {(d.charts?.byPayment||[]).map((r:any) => <MiniBar key={r.mode} label={r.mode} value={r.revenue} max={Math.max(...(d.charts?.byPayment||[]).map((x:any)=>x.revenue))} color="bg-blue-500"/>)}
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <SHdr title="Top States" onCSV={()=>dlCSV('states.csv',d.charts?.byState||[],['state','orders','revenue'])}/>
              {(d.charts?.byState||[]).map((r:any) => <MiniBar key={r.state} label={r.state} value={r.revenue} max={Math.max(...(d.charts?.byState||[]).map((x:any)=>x.revenue))} color="bg-rose-500"/>)}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <SHdr title={`Order Register (${d.orders?.length||0})`}
              onCSV={()=>dlCSV('orders.csv',d.orders||[],['order_number','date','customer_name','customer_phone','city','state','payment_mode','payment_status','status','subtotal','discount','gst','delivery','total','coupon'])}
              onExcel={()=>dlExcel('orders.xlsx',[{name:'Orders',rows:d.orders||[],cols:['order_number','date','customer_name','customer_phone','city','state','payment_mode','payment_status','status','subtotal','discount','gst','delivery','total','coupon']}])}
              onWhatsApp={()=>waShare(`📦 *Order Summary (${new Date().toLocaleDateString('en-IN')})*\nOrders: ${fmtN(s.paidOrders||0)}\nRevenue: ${inr(s.totalRevenue||0)}\nMetres: ${fmtN(s.totalMetres||0)} m\nAvg Order: ${inr(s.avgOrderValue||0)}`)}
              onPrint={()=>window.print()}/>
            <div className="overflow-x-auto max-h-80">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-white"><tr className="border-b border-gray-100">{['Order#','Date','Customer','Phone','City','Mode','Status','Total'].map(h=><th key={h} className="text-left font-semibold text-gray-400 pb-2 pr-3 whitespace-nowrap">{h}</th>)}</tr></thead>
                <tbody>
                  {(d.orders||[]).slice().reverse().map((o:any)=>(
                    <tr key={o.order_number} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-1.5 pr-3 font-mono font-semibold text-rose-700 text-[10px]">{o.order_number}</td>
                      <td className="py-1.5 pr-3 text-gray-500">{o.date?.slice(0,10)}</td>
                      <td className="py-1.5 pr-3 font-medium text-gray-800">{o.customer_name}</td>
                      <td className="py-1.5 pr-3 text-gray-500">{o.customer_phone}</td>
                      <td className="py-1.5 pr-3 text-gray-500">{o.city}</td>
                      <td className="py-1.5 pr-3 capitalize">{o.payment_mode}</td>
                      <td className="py-1.5 pr-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${o.payment_status==='paid'?'bg-green-100 text-green-700':o.status==='cancelled'?'bg-red-100 text-red-700':'bg-amber-100 text-amber-700'}`}>{o.payment_status==='paid'?o.status:o.payment_status}</span></td>
                      <td className="py-1.5 pr-3 font-semibold">{inr(o.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══ FINANCE & GST ══════════════════════════════════════════════════════ */}
      {activeTab==='finance' && (
        <div className="space-y-6">
          <RangeBar/>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard label="Gross Revenue"  value={inr(s.grossRevenue||0)}  icon={IndianRupee} color="bg-rose-600"/>
            <KpiCard label="Net Revenue"    value={inr(s.netRevenue||0)}    icon={TrendingUp}  color="bg-green-600"/>
            <KpiCard label="GST Collected"  value={inr(s.gstCollected||0)} icon={Receipt}     color="bg-blue-600"/>
            <KpiCard label="Total Received" value={inr(s.totalReceived||0)} icon={ShoppingBag} color="bg-purple-600"/>
          </div>
          {s.pendingCount > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertTriangle size={18} className="text-amber-600 flex-none mt-0.5"/>
              <p className="text-sm text-amber-800">{s.pendingCount} pending orders — {inr(s.pendingAmount)}. Follow up or cancel.</p>
            </div>
          )}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <SHdr title="HSN Summary (GST Return Ready)"
              onCSV={()=>dlCSV('hsn-summary.csv',d.hsnSummary||[],['hsn','description','quantity','unit','taxable_value','cgst','sgst','igst','total_tax'])}
              onExcel={()=>dlExcel('gst-report.xlsx',[{name:'HSN Summary',rows:d.hsnSummary||[],cols:['hsn','description','quantity','unit','taxable_value','cgst','sgst','igst','total_tax']},{name:'GST Register',rows:d.gstRegister||[],cols:['invoice','date','customer','state','supply_type','taxable_value','cgst','sgst','igst','total_gst','total_amount']}])}
              onWhatsApp={()=>waShare(`🧾 *GST Summary*\nNet Revenue: ${inr(s.netRevenue||0)}\nGST Collected: ${inr(s.gstCollected||0)}\nCGST: ${inr(s.cgstTotal||0)}\nSGST: ${inr(s.sgstTotal||0)}\nIGST: ${inr(s.igstTotal||0)}`)}/>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-100">{['HSN','Description','Qty (m)','Taxable','CGST','SGST','IGST','Total Tax'].map(h=><th key={h} className="text-left text-xs font-semibold text-gray-400 pb-2 pr-4 whitespace-nowrap">{h}</th>)}</tr></thead>
                <tbody>
                  {(d.hsnSummary||[]).map((h:any)=>(
                    <tr key={h.hsn} className="border-b border-gray-50">
                      <td className="py-2 pr-4 font-mono font-semibold text-blue-700">{h.hsn}</td>
                      <td className="py-2 pr-4 text-gray-600 max-w-[180px] truncate">{h.description}</td>
                      <td className="py-2 pr-4">{fmtN(Math.round(h.quantity))} m</td>
                      <td className="py-2 pr-4 font-semibold">{inr(h.taxable_value)}</td>
                      <td className="py-2 pr-4">{inr(h.cgst)}</td>
                      <td className="py-2 pr-4">{inr(h.sgst)}</td>
                      <td className="py-2 pr-4">{inr(h.igst)}</td>
                      <td className="py-2 pr-4 font-bold">{inr(h.total_tax)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <SHdr title={`GST Register (${d.gstRegister?.length||0} invoices)`}
              onCSV={()=>dlCSV('gst-register.csv',d.gstRegister||[],['invoice','date','customer','phone','state','supply_type','taxable_value','cgst','sgst','igst','total_gst','total_amount'])}
              onExcel={()=>dlExcel('gst-register.xlsx',[{name:'GST Register',rows:d.gstRegister||[],cols:['invoice','date','customer','state','supply_type','taxable_value','cgst','sgst','igst','total_gst','total_amount']}])}
              onPrint={()=>window.print()}/>
            <div className="overflow-x-auto max-h-72">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-white"><tr className="border-b border-gray-100">{['Invoice','Date','Customer','State','Type','Taxable','CGST','SGST','IGST','Total'].map(h=><th key={h} className="text-left font-semibold text-gray-400 pb-2 pr-3 whitespace-nowrap">{h}</th>)}</tr></thead>
                <tbody>
                  {(d.gstRegister||[]).slice().reverse().map((r:any)=>(
                    <tr key={r.invoice} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-1.5 pr-3 font-mono text-[10px] text-rose-700">{r.invoice}</td>
                      <td className="py-1.5 pr-3 text-gray-500">{r.date}</td>
                      <td className="py-1.5 pr-3 font-medium">{r.customer}</td>
                      <td className="py-1.5 pr-3 text-gray-500">{r.state}</td>
                      <td className="py-1.5 pr-3"><span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${r.supply_type==='Intra-State'?'bg-green-100 text-green-700':'bg-blue-100 text-blue-700'}`}>{r.supply_type}</span></td>
                      <td className="py-1.5 pr-3">{inr(r.taxable_value)}</td>
                      <td className="py-1.5 pr-3">{inr(r.cgst)}</td>
                      <td className="py-1.5 pr-3">{inr(r.sgst)}</td>
                      <td className="py-1.5 pr-3">{inr(r.igst)}</td>
                      <td className="py-1.5 pr-3 font-semibold">{inr(r.total_amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══ TEXTILE ════════════════════════════════════════════════════════════ */}
      {activeTab==='textile' && (
        <div className="space-y-6">
          <RangeBar/>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard label="Revenue"       value={inr(s.totalRevenue||0)}       icon={IndianRupee} color="bg-rose-600"/>
            <KpiCard label="Metres Sold"   value={`${fmtN(s.totalMetres||0)} m`} icon={Package}   color="bg-blue-600"/>
            <KpiCard label="Fabric Types"  value={fmtN(s.fabricTypes||0)}       icon={Layers}     color="bg-purple-600"/>
            <KpiCard label="Trending Rev%" value={`${s.trendingPct||0}%`}       icon={TrendingUp} color="bg-amber-600"/>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fabric Type */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <SHdr title="Revenue by Fabric Type"
                onCSV={()=>dlCSV('fabric-type.csv',d.byFabricType||[],['type','qty','revenue','skus'])}
                onExcel={()=>dlExcel('textile-report.xlsx',[{name:'Fabric Type',rows:d.byFabricType||[],cols:['type','qty','revenue','skus']},{name:'Category',rows:d.byCategory||[],cols:['cat','qty','revenue']},{name:'Price Band',rows:d.byPriceBand||[],cols:['band','qty','revenue']}])}/>
              {(d.byFabricType||[]).map((r:any) => <MiniBar key={r.type} label={r.type} value={r.revenue} max={(d.byFabricType||[])[0]?.revenue||1} color="bg-rose-500"/>)}
            </div>

            {/* Category */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <SHdr title="Revenue by Category" onCSV={()=>dlCSV('category.csv',d.byCategory||[],['cat','qty','revenue'])}/>
              {(d.byCategory||[]).map((r:any) => <MiniBar key={r.cat} label={r.cat} value={r.revenue} max={(d.byCategory||[])[0]?.revenue||1} color="bg-blue-500"/>)}
            </div>

            {/* GSM */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <SHdr title="Metres Sold by GSM Band" onCSV={()=>dlCSV('gsm.csv',d.byGSM||[],['gsm','qty','revenue'])}/>
              {(d.byGSM||[]).map((r:any) => <MiniBar key={r.gsm} label={r.gsm} value={r.qty} max={(d.byGSM||[])[0]?.qty||1} color="bg-purple-500" sub=" m"/>)}
            </div>

            {/* Price Band */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <SHdr title="Revenue by Price Band" onCSV={()=>dlCSV('price-band.csv',d.byPriceBand||[],['band','qty','revenue'])}/>
              {(d.byPriceBand||[]).map((r:any) => <MiniBar key={r.band} label={r.band} value={r.revenue} max={(d.byPriceBand||[])[0]?.revenue||1} color="bg-amber-500"/>)}
            </div>
          </div>

          {/* Inventory Turnover by Category */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <SHdr title="Inventory Turnover by Category"
              onCSV={()=>dlCSV('inventory-turnover.csv',d.invByCategory||[],['cat','products','totalStock','totalSold','turnover'])}/>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-100">{['Category','Products','Total Stock (m)','Total Sold (m)','Turnover Ratio'].map(h=><th key={h} className="text-left text-xs font-semibold text-gray-400 pb-2 pr-4">{h}</th>)}</tr></thead>
                <tbody>
                  {(d.invByCategory||[]).map((r:any)=>(
                    <tr key={r.cat} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2 pr-4 font-semibold text-gray-800">{r.cat}</td>
                      <td className="py-2 pr-4">{r.products}</td>
                      <td className="py-2 pr-4">{fmtN(r.totalStock)} m</td>
                      <td className="py-2 pr-4">{fmtN(r.totalSold)} m</td>
                      <td className="py-2 pr-4">
                        <span className={`font-semibold ${r.turnover>0.5?'text-green-600':r.turnover>0.2?'text-amber-600':'text-red-500'}`}>
                          {r.turnover}x
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dead Stock Risk */}
          {(d.deadStockRisk||[]).length > 0 && (
            <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-sm">
              <SHdr title="⚠️ Dead Stock Risk — Products Likely Unsold in 180+ Days"
                onCSV={()=>dlCSV('dead-stock.csv',d.deadStockRisk||[],['name','category','stock','sold','daysToSell','value'])}
                onWhatsApp={()=>waShare(`⚠️ *Dead Stock Alert*\n${(d.deadStockRisk||[]).slice(0,5).map((p:any)=>`• ${p.name}: ${p.stock}m stock, ${Math.round(p.daysToSell)} days to sell`).join('\n')}`)}/>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-gray-100">{['Product','Category','Stock (m)','Sold Total','Est. Days to Clear','Stock Value'].map(h=><th key={h} className="text-left text-xs font-semibold text-gray-400 pb-2 pr-4">{h}</th>)}</tr></thead>
                  <tbody>
                    {(d.deadStockRisk||[]).map((p:any)=>(
                      <tr key={p.name} className="border-b border-gray-50 hover:bg-amber-50/30">
                        <td className="py-2 pr-4 font-medium text-gray-800">{p.name}</td>
                        <td className="py-2 pr-4 text-gray-500">{p.category}</td>
                        <td className="py-2 pr-4">{fmtN(p.stock)} m</td>
                        <td className="py-2 pr-4">{fmtN(p.sold)} m</td>
                        <td className="py-2 pr-4"><span className="font-semibold text-red-600">{p.daysToSell > 900 ? '900+ days' : `${Math.round(p.daysToSell)} days`}</span></td>
                        <td className="py-2 pr-4 font-semibold">{inr(p.value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══ INVENTORY ══════════════════════════════════════════════════════════ */}
      {activeTab==='inventory' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard label="Products"      value={fmtN(s.totalProducts||0)}    icon={Package}       color="bg-blue-600"/>
            <KpiCard label="Total Stock"   value={`${fmtN(s.totalStockMetres||0)} m`} icon={TrendingUp} color="bg-purple-600"/>
            <KpiCard label="Stock Value"   value={inr(s.totalValue||0)}        icon={IndianRupee}   color="bg-rose-600"/>
            <KpiCard label="Low/Out"       value={`${s.lowStock||0}/${s.outOfStock||0}`} icon={AlertTriangle} color="bg-amber-500"/>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <SHdr title="Product Inventory Register"
              onCSV={()=>dlCSV('inventory.csv',d.items||[],['name','category','price','stock','available','sold','status','velocity_label','value'])}
              onExcel={()=>dlExcel('inventory.xlsx',[{name:'Inventory',rows:d.items||[],cols:['name','category','price','stock','available','sold','status','velocity_label','value']}])}
              onWhatsApp={()=>waShare(`📦 *Inventory Summary*\nTotal Products: ${fmtN(s.totalProducts||0)}\nTotal Stock: ${fmtN(s.totalStockMetres||0)} m\nStock Value: ${inr(s.totalValue||0)}\n⚠️ Low Stock: ${s.lowStock||0} | Out of Stock: ${s.outOfStock||0}`)}
              onPrint={()=>window.print()}/>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-white"><tr className="border-b border-gray-100">{['Product','Category','₹/m','Stock','Avail','Sold','Status','Movement','Value'].map(h=><th key={h} className="text-left font-semibold text-gray-400 pb-2 pr-3 whitespace-nowrap">{h}</th>)}</tr></thead>
                <tbody>
                  {(d.items||[]).map((p:any)=>(
                    <tr key={p.id} className={`border-b border-gray-50 hover:bg-gray-50 ${p.status==='out_of_stock'?'bg-red-50/40':p.status==='low_stock'?'bg-amber-50/40':''}`}>
                      <td className="py-1.5 pr-3 font-medium text-gray-800 max-w-[150px] truncate">{p.name}</td>
                      <td className="py-1.5 pr-3 text-gray-500">{p.category}</td>
                      <td className="py-1.5 pr-3">₹{p.price}</td>
                      <td className="py-1.5 pr-3">{fmtN(p.stock)}</td>
                      <td className="py-1.5 pr-3">{fmtN(p.available)}</td>
                      <td className="py-1.5 pr-3">{fmtN(p.sold)}</td>
                      <td className="py-1.5 pr-3"><span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${p.status==='in_stock'?'bg-green-100 text-green-700':p.status==='low_stock'?'bg-amber-100 text-amber-700':'bg-red-100 text-red-700'}`}>{p.status.replace('_',' ')}</span></td>
                      <td className="py-1.5 pr-3 text-[10px] font-semibold" style={{color:p.velocity_label==='Fast Moving'?'#16a34a':p.velocity_label==='Slow Moving'?'#dc2626':'#6b7280'}}>{p.velocity_label}</td>
                      <td className="py-1.5 pr-3 font-semibold">{inr(p.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══ CUSTOMERS ══════════════════════════════════════════════════════════ */}
      {activeTab==='customers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard label="Total Customers"  value={fmtN(s.totalCustomers||0)}  icon={Users}       color="bg-blue-600"/>
            <KpiCard label="Repeat Customers" value={fmtN(s.repeatCustomers||0)} icon={TrendingUp}  color="bg-green-600"/>
            <KpiCard label="VIP Customers"    value={fmtN(s.vipCustomers||0)}    icon={Star}        color="bg-amber-500"/>
            <KpiCard label="Avg LTV"          value={inr(s.avgLTV||0)}           icon={IndianRupee} color="bg-purple-600"/>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <SHdr title="Top Customers"
              onCSV={()=>dlCSV('customers.csv',d.topCustomers||[],['name','phone','email','city','state','orders','revenue','avgOrder','segment'])}
              onExcel={()=>dlExcel('customers.xlsx',[{name:'Customers',rows:d.topCustomers||[],cols:['name','phone','email','city','state','orders','revenue','avgOrder','segment']}])}
              onWhatsApp={()=>waShare(`👥 *Customer Summary*\nTotal: ${fmtN(s.totalCustomers||0)}\nRepeat: ${fmtN(s.repeatCustomers||0)} (${s.repeatRate||0}%)\nVIP: ${fmtN(s.vipCustomers||0)}\nAvg LTV: ${inr(s.avgLTV||0)}`)}
              onPrint={()=>window.print()}/>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-white"><tr className="border-b border-gray-100">{['#','Customer','Phone','City','Orders','Avg','Revenue','Segment'].map(h=><th key={h} className="text-left font-semibold text-gray-400 pb-2 pr-3 whitespace-nowrap">{h}</th>)}</tr></thead>
                <tbody>
                  {(d.topCustomers||[]).map((cu:any,i:number)=>(
                    <tr key={cu.phone} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-1.5 pr-3 text-gray-400">{i+1}</td>
                      <td className="py-1.5 pr-3 font-medium text-gray-800">{cu.name}</td>
                      <td className="py-1.5 pr-3 text-gray-500">{cu.phone}</td>
                      <td className="py-1.5 pr-3 text-gray-500">{cu.city}</td>
                      <td className="py-1.5 pr-3">{cu.orders}</td>
                      <td className="py-1.5 pr-3">{inr(cu.avgOrder)}</td>
                      <td className="py-1.5 pr-3 font-semibold">{inr(cu.revenue)}</td>
                      <td className="py-1.5 pr-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${cu.segment==='VIP'?'bg-amber-100 text-amber-700':cu.segment==='Loyal'?'bg-green-100 text-green-700':cu.segment==='Returning'?'bg-blue-100 text-blue-700':'bg-gray-100 text-gray-600'}`}>{cu.segment}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <SHdr title="Revenue by State" onCSV={()=>dlCSV('state-revenue.csv',d.byState||[],['state','customers','revenue'])}/>
            {(d.byState||[]).map((r:any) => <MiniBar key={r.state} label={r.state} value={r.revenue} max={(d.byState||[])[0]?.revenue||1} color="bg-purple-500"/>)}
          </div>
        </div>
      )}

      {/* ══ MARKETING ══════════════════════════════════════════════════════════ */}
      {activeTab==='marketing' && (
        <div className="space-y-6">
          <RangeBar/>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard label="Coupons Used"      value={fmtN(s.totalCouponsUsed||0)}   icon={Tag}       color="bg-rose-600"/>
            <KpiCard label="Discount Given"    value={inr(s.totalDiscountGiven||0)}  icon={IndianRupee} color="bg-amber-600"/>
            <KpiCard label="Subscribers"       value={fmtN(s.newsletterSubscribers||0)} icon={Mail}   color="bg-blue-600"/>
            <KpiCard label="Wholesale Conv."   value={`${s.wholesaleConvRate||0}%`}  icon={Building2} color="bg-purple-600"/>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Coupon performance */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <SHdr title="Coupon Performance"
                onCSV={()=>dlCSV('coupons.csv',d.couponPerformance||[],['code','uses','revenue','discount','avg_order','roi'])}
                onExcel={()=>dlExcel('marketing.xlsx',[{name:'Coupons',rows:d.couponPerformance||[],cols:['code','uses','revenue','discount','avg_order','roi']},{name:'Subscribers',rows:d.recentSubscribers||[],cols:['email','date']}])}/>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-gray-100">{['Coupon','Uses','Revenue','Discount','Avg Order','ROI'].map(h=><th key={h} className="text-left text-xs font-semibold text-gray-400 pb-2 pr-3">{h}</th>)}</tr></thead>
                  <tbody>
                    {(d.couponPerformance||[]).map((c:any)=>(
                      <tr key={c.code} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-2 pr-3 font-mono font-bold text-rose-700">{c.code}</td>
                        <td className="py-2 pr-3">{c.uses}</td>
                        <td className="py-2 pr-3 font-semibold">{inr(c.revenue)}</td>
                        <td className="py-2 pr-3 text-red-600">-{inr(c.discount)}</td>
                        <td className="py-2 pr-3">{inr(c.avg_order)}</td>
                        <td className="py-2 pr-3"><span className={`font-bold ${c.roi>=5?'text-green-600':'text-amber-600'}`}>{c.roi}x</span></td>
                      </tr>
                    ))}
                    {!(d.couponPerformance?.length) && <tr><td colSpan={6} className="py-4 text-gray-400 text-sm">No coupons used this period</td></tr>}
                  </tbody>
                </table>
              </div>
              {d.couponVsNoCoupon && (
                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
                  {[{l:'With Coupon',v:d.couponVsNoCoupon.withCoupon},{l:'Without Coupon',v:d.couponVsNoCoupon.withoutCoupon}].map(({l,v})=>(
                    <div key={l} className="text-center">
                      <p className="text-xs text-gray-400">{l}</p>
                      <p className="font-bold text-gray-900">{fmtN(v.orders)} orders</p>
                      <p className="text-xs text-gray-500">Avg: {inr(v.avgOrder)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Wholesale funnel */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <SHdr title="Wholesale B2B Funnel" onWhatsApp={()=>waShare(`🏢 *B2B Funnel*\nTotal Enquiries: ${d.wholesaleFunnel?.total||0}\nNew: ${d.wholesaleFunnel?.new||0}\nContacted: ${d.wholesaleFunnel?.contacted||0}\nNegotiating: ${d.wholesaleFunnel?.negotiating||0}\nConverted: ${d.wholesaleFunnel?.converted||0}\nConversion Rate: ${d.wholesaleConvRate||0}%`)}/>
              {d.wholesaleFunnel && (
                <div className="space-y-3">
                  {[
                    { label:'Total Enquiries', value:d.wholesaleFunnel.total,       color:'bg-gray-400' },
                    { label:'New',             value:d.wholesaleFunnel.new,         color:'bg-blue-400' },
                    { label:'Contacted',       value:d.wholesaleFunnel.contacted,   color:'bg-amber-400' },
                    { label:'Negotiating',     value:d.wholesaleFunnel.negotiating, color:'bg-purple-400' },
                    { label:'Converted ✓',    value:d.wholesaleFunnel.converted,   color:'bg-green-500' },
                  ].map(f => (
                    <MiniBar key={f.label} label={f.label} value={f.value} max={d.wholesaleFunnel.total||1} color={f.color}/>
                  ))}
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm text-gray-500">Conversion Rate</span>
                    <span className={`text-lg font-bold ${d.wholesaleConvRate>=20?'text-green-600':d.wholesaleConvRate>=10?'text-amber-600':'text-red-500'}`}>{d.wholesaleConvRate||0}%</span>
                  </div>
                </div>
              )}
            </div>

            {/* Newsletter */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <SHdr title={`Newsletter Subscribers (${fmtN(d.totalSubscribers||0)} total)`}
                onCSV={()=>dlCSV('subscribers.csv',d.recentSubscribers||[],['email','date'])}
                onExcel={()=>dlExcel('subscribers.xlsx',[{name:'Subscribers',rows:d.recentSubscribers||[],cols:['email','date']}])}/>
              <div className="space-y-1.5 mb-4">
                {(d.newsletterGrowth||[]).slice(-6).map((g:any) => (
                  <MiniBar key={g.month} label={g.month} value={g.count} max={Math.max(...(d.newsletterGrowth||[]).map((x:any)=>x.count))||1} color="bg-blue-500"/>
                ))}
              </div>
              <p className="text-xs text-gray-400 mb-2">Recent subscribers:</p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {(d.recentSubscribers||[]).slice(0,10).map((s:any) => (
                  <div key={s.email} className="flex items-center justify-between text-xs">
                    <span className="text-gray-700">{s.email}</span>
                    <span className="text-gray-400">{s.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <SHdr title="Review Analytics" onWhatsApp={()=>waShare(`⭐ *Review Summary*\nTotal Reviews: ${d.reviewStats?.total||0}\nApproved: ${d.reviewStats?.approved||0}\nPending: ${d.reviewStats?.pending||0}\nAvg Rating: ${d.reviewStats?.avgRating||0}/5\n5-Star Reviews: ${d.reviewStats?.fiveStars||0}`)}/>
              {d.reviewStats && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[{l:'Total',v:d.reviewStats.total},{l:'Approved',v:d.reviewStats.approved},{l:'Pending',v:d.reviewStats.pending},{l:'5-Star',v:d.reviewStats.fiveStars}].map(({l,v})=>(
                      <div key={l} className="text-center bg-gray-50 rounded-xl p-3">
                        <p className="text-xl font-bold text-gray-900">{v}</p>
                        <p className="text-xs text-gray-500">{l}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    {[1,2,3,4,5].map(s => <Star key={s} size={20} className={s<=Math.round(d.reviewStats.avgRating||0)?'fill-yellow-400 text-yellow-400':'text-gray-200 fill-gray-200'}/>)}
                    <span className="text-lg font-bold text-gray-900 ml-1">{d.reviewStats.avgRating}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Mode Trend */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <SHdr title="Payment Mode Adoption" onCSV={()=>dlCSV('payment-trend.csv',d.paymentTrend||[],['mode','count','revenue'])}/>
            {(d.paymentTrend||[]).map((r:any) => <MiniBar key={r.mode} label={r.mode} value={r.revenue} max={(d.paymentTrend||[])[0]?.revenue||1} color="bg-indigo-500"/>)}
          </div>

          {/* Conversion funnel */}
          {d.convFunnel && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <SHdr title="Order Conversion Funnel"/>
              <div className="grid grid-cols-4 gap-3 text-center">
                {[{l:'Placed',v:d.convFunnel.placed,c:'bg-blue-100 text-blue-800'},{l:'Paid',v:d.convFunnel.paid,c:'bg-green-100 text-green-800'},{l:'Cancelled',v:d.convFunnel.cancelled,c:'bg-red-100 text-red-800'},{l:'Pay Rate',v:`${d.convFunnel.payRate}%`,c:'bg-purple-100 text-purple-800'}].map(({l,v,c})=>(
                  <div key={l} className={`rounded-xl p-4 ${c}`}>
                    <p className="text-2xl font-bold">{v}</p>
                    <p className="text-xs font-semibold mt-0.5">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-white/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-3">
            <RefreshCw size={18} className="animate-spin text-rose-600"/>
            <span className="font-semibold text-gray-700">Loading report…</span>
          </div>
        </div>
      )}
    </div>
  )
}
