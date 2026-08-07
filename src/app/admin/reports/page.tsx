'use client'
import { useState, useEffect, useCallback } from 'react'
import {
  TrendingUp, Package, Users, IndianRupee,
  Download, RefreshCw, Calendar, BarChart3,
  ShoppingBag, Star, ArrowUpRight, ArrowDownRight,
  Minus, Printer, AlertTriangle, CheckCircle2,
  Brain, FileSpreadsheet, Receipt, Lightbulb,
  TrendingDown, Info,
} from 'lucide-react'

// ── Helpers ───────────────────────────────────────────────────────────────────
function inr(n: number) { return `₹${(n||0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}` }
function fmtN(n: number) { return (n||0).toLocaleString('en-IN') }

type Range = 'daily' | 'weekly' | 'monthly' | 'yearly'

// ── KPI Card ──────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, icon: Icon, color, trend }:
  { label: string; value: string; sub?: string; icon: any; color: string; trend?: 'up'|'down'|'flat' }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
        {trend && (
          <span className={`text-xs font-semibold flex items-center gap-0.5 ${
            trend==='up'?'text-green-600':trend==='down'?'text-red-500':'text-gray-400'}`}>
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

// ── Mini bar ──────────────────────────────────────────────────────────────────
function MiniBar({ label, value, max, color='bg-rose-500' }:
  { label:string; value:number; max:number; color?:string }) {
  const pct = max > 0 ? (value/max)*100 : 0
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-xs text-gray-500 w-32 truncate flex-none">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{width:`${pct}%`}}/>
      </div>
      <span className="text-xs font-semibold text-gray-700 w-20 text-right flex-none">
        {value > 500 ? inr(value) : fmtN(value)}
      </span>
    </div>
  )
}

// ── Section header ─────────────────────────────────────────────────────────────
function SHdr({ title, onCSV, onExcel, onPrint }:
  { title:string; onCSV?:()=>void; onExcel?:()=>void; onPrint?:()=>void }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base font-bold text-gray-900">{title}</h2>
      <div className="flex gap-2">
        {onCSV   && <button onClick={onCSV}   className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-green-50 text-green-700 hover:bg-green-100 rounded-xl"><Download size={11}/> CSV</button>}
        {onExcel && <button onClick={onExcel} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl"><FileSpreadsheet size={11}/> Excel</button>}
        {onPrint && <button onClick={onPrint} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl"><Printer size={11}/> Print</button>}
      </div>
    </div>
  )
}

// ── CSV export ────────────────────────────────────────────────────────────────
function dlCSV(filename: string, rows: Record<string,any>[], cols: string[]) {
  const header = cols.join(',')
  const body   = rows.map(r => cols.map(c => JSON.stringify(r[c]??'')).join(',')).join('\n')
  const blob   = new Blob([`${header}\n${body}`], {type:'text/csv'})
  const a      = document.createElement('a')
  a.href = URL.createObjectURL(blob); a.download = filename; a.click()
}

// ── Excel export (SheetJS via CDN) ────────────────────────────────────────────
async function dlExcel(filename: string, sheets: {name:string; rows:Record<string,any>[]; cols:string[]}[]) {
  // Dynamically load SheetJS
  if (!(window as any).XLSX) {
    await new Promise<void>((resolve, reject) => {
      const s = document.createElement('script')
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
      s.onload = () => resolve(); s.onerror = reject
      document.head.appendChild(s)
    })
  }
  const XLSX = (window as any).XLSX
  const wb   = XLSX.utils.book_new()
  sheets.forEach(({ name, rows, cols }) => {
    const data = [cols, ...rows.map(r => cols.map(c => r[c] ?? ''))]
    const ws   = XLSX.utils.aoa_to_sheet(data)
    XLSX.utils.book_append_sheet(wb, ws, name.slice(0,31))
  })
  XLSX.writeFile(wb, filename)
}

// ══════════════════════════════════════════════════════════════════════════════
export default function AdminReportsV2Page() {
  const [activeTab, setActiveTab] = useState<'sales'|'inventory'|'customers'|'finance'|'insights'>('insights')
  const [range,     setRange]     = useState<Range>('monthly')
  const [salesData, setSalesData] = useState<any>(null)
  const [invData,   setInvData]   = useState<any>(null)
  const [custData,  setCustData]  = useState<any>(null)
  const [finData,   setFinData]   = useState<any>(null)
  const [aiData,    setAiData]    = useState<any>(null)
  const [loading,   setLoading]   = useState(false)

  const load = useCallback(async (tab: typeof activeTab, r?: Range) => {
    setLoading(true)
    const rng = r || range
    try {
      if (tab === 'sales')     { const j = await fetch(`/api/admin/reports/sales?range=${rng}`).then(x=>x.json());     setSalesData(j) }
      if (tab === 'inventory') { const j = await fetch('/api/admin/reports/inventory').then(x=>x.json());              setInvData(j)   }
      if (tab === 'customers') { const j = await fetch('/api/admin/reports/customers').then(x=>x.json());              setCustData(j)  }
      if (tab === 'finance')   { const j = await fetch(`/api/admin/reports/finance?range=${rng}`).then(x=>x.json());   setFinData(j)   }
      if (tab === 'insights')  { const j = await fetch('/api/admin/reports/insights').then(x=>x.json());               setAiData(j)    }
    } catch {}
    setLoading(false)
  }, [range])

  useEffect(() => { load(activeTab) }, [activeTab])

  const TABS = [
    { key:'insights',  label:'AI Insights',  icon:Brain },
    { key:'sales',     label:'Sales',         icon:TrendingUp },
    { key:'finance',   label:'Finance & GST', icon:Receipt },
    { key:'inventory', label:'Inventory',     icon:Package },
    { key:'customers', label:'Customers',     icon:Users },
  ]

  const s   = salesData?.summary  || {}
  const inv = invData?.summary    || {}
  const c   = custData?.summary   || {}
  const f   = finData?.summary    || {}
  const ai  = aiData              || {}

  const INSIGHT_COLORS: Record<string, string> = {
    positive: 'border-green-200 bg-green-50',
    warning:  'border-amber-200 bg-amber-50',
    action:   'border-blue-200 bg-blue-50',
    info:     'border-gray-200 bg-gray-50',
  }
  const INSIGHT_ICONS: Record<string, any> = {
    positive: CheckCircle2,
    warning:  AlertTriangle,
    action:   Lightbulb,
    info:     Info,
  }
  const INSIGHT_ICON_COLORS: Record<string, string> = {
    positive: 'text-green-600',
    warning:  'text-amber-600',
    action:   'text-blue-600',
    info:     'text-gray-500',
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 size={24} className="text-rose-600"/> Reports & Intelligence
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">GoFabrikos Business Analytics — Phase 9</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => load(activeTab)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
            <RefreshCw size={14} className={loading?'animate-spin':''}/> Refresh
          </button>
          <button onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 transition-colors">
            <Printer size={14}/> Print Report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-white rounded-xl border border-gray-200 p-1 w-fit mb-6">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setActiveTab(key as any)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab===key ? 'bg-stone-900 text-white' : 'text-gray-500 hover:text-gray-700'
            }`}>
            <Icon size={14}/> {label}
          </button>
        ))}
      </div>

      {/* ══ AI INSIGHTS ══════════════════════════════════════════════════════════ */}
      {activeTab==='insights' && (
        <div className="space-y-5">
          <div className="bg-gradient-to-r from-stone-900 to-stone-800 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Brain size={20} className="text-rose-400"/>
              <h2 className="font-bold text-lg">AI Executive Insights</h2>
              <span className="ml-2 text-xs bg-rose-700 text-white px-2 py-0.5 rounded-full">Live</span>
            </div>
            <p className="text-stone-400 text-sm">
              Narrative analysis for {ai.period?.current_month} {ai.period?.current_year} — generated {ai.generated_at ? new Date(ai.generated_at).toLocaleTimeString('en-IN') : '…'}
            </p>
          </div>

          {/* Quick KPIs */}
          {ai.kpis && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard label="This Month Revenue" value={inr(ai.kpis.curRev||0)} icon={IndianRupee} color="bg-rose-600"
                trend={ai.kpis.revGrowth>0?'up':ai.kpis.revGrowth<0?'down':'flat'}
                sub={`${ai.kpis.revGrowth>0?'+':''}${Math.round(ai.kpis.revGrowth||0)}% vs last month`}/>
              <KpiCard label="Orders This Month" value={fmtN(ai.kpis.curOrders||0)} icon={ShoppingBag} color="bg-blue-600"
                trend={ai.kpis.orderGrowth>0?'up':ai.kpis.orderGrowth<0?'down':'flat'}
                sub={`vs ${fmtN(ai.kpis.prevOrders||0)} last month`}/>
              <KpiCard label="Repeat Customer Rate" value={`${Math.round(ai.kpis.repeatRate||0)}%`} icon={Users} color="bg-purple-600"/>
              <KpiCard label="Cancellation Rate" value={`${Math.round(ai.kpis.cancellRate||0)}%`} icon={AlertTriangle}
                color={ai.kpis.cancellRate>15?'bg-red-600':'bg-green-600'}/>
            </div>
          )}

          {/* Insight cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {(ai.insights||[]).map((ins: any, i: number) => {
              const Icon      = INSIGHT_ICONS[ins.type]      || Info
              const colorCls  = INSIGHT_COLORS[ins.type]     || INSIGHT_COLORS.info
              const iconColor = INSIGHT_ICON_COLORS[ins.type]|| 'text-gray-500'
              return (
                <div key={i} className={`rounded-2xl border p-5 ${colorCls}`}>
                  <div className="flex items-start gap-3">
                    <Icon size={18} className={`${iconColor} flex-none mt-0.5`}/>
                    <div>
                      <p className="font-bold text-gray-900 text-sm mb-1">{ins.title}</p>
                      <p className="text-xs text-gray-600 leading-relaxed">{ins.body}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Top products */}
          {ai.topProducts?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3">Top 5 Products This Month</h3>
              {ai.topProducts.map((p: any, i: number) => (
                <MiniBar key={p.name} label={`${i+1}. ${p.name}`} value={p.revenue}
                  max={ai.topProducts[0]?.revenue||1} color="bg-rose-500"/>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══ SALES TAB ══════════════════════════════════════════════════════════ */}
      {activeTab==='sales' && (
        <div className="space-y-6">
          <div className="flex gap-2 items-center">
            <Calendar size={14} className="text-gray-400"/>
            {(['daily','weekly','monthly','yearly'] as Range[]).map(r => (
              <button key={r} onClick={() => { setRange(r); load('sales', r) }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors ${
                  range===r?'bg-rose-600 text-white':'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                {r.charAt(0).toUpperCase()+r.slice(1)}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <KpiCard label="Revenue"       value={inr(s.totalRevenue||0)}    icon={IndianRupee}   color="bg-rose-600"/>
            <KpiCard label="Paid Orders"   value={fmtN(s.paidOrders||0)}     icon={ShoppingBag}   color="bg-blue-600"/>
            <KpiCard label="Avg Order"     value={inr(s.avgOrderValue||0)}   icon={TrendingUp}    color="bg-purple-600"/>
            <KpiCard label="Metres Sold"   value={fmtN(s.totalMetres||0)}    icon={Package}       color="bg-amber-600"/>
            <KpiCard label="Cancellation"  value={`${s.cancellationRate||0}%`} icon={AlertTriangle} color="bg-gray-500"/>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[{l:'GST',v:inr(s.totalGst||0)},{l:'Discounts',v:inr(s.totalDiscount||0)},{l:'Delivery',v:inr(s.totalDelivery||0)},{l:'Cancelled',v:fmtN(s.cancelledOrders||0)}].map(({l,v})=>(
              <div key={l} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <p className="text-lg font-bold text-gray-900">{v}</p>
                <p className="text-xs text-gray-500 mt-0.5">{l}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <SHdr title="By Payment Mode" onCSV={()=>dlCSV('payment-mode.csv',salesData?.charts?.byPayment||[],['mode','orders','revenue'])}/>
              {(salesData?.charts?.byPayment||[]).map((r:any)=>(
                <MiniBar key={r.mode} label={r.mode} value={r.revenue} max={Math.max(...(salesData?.charts?.byPayment||[]).map((x:any)=>x.revenue))} color="bg-blue-500"/>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <SHdr title="Top States" onCSV={()=>dlCSV('states.csv',salesData?.charts?.byState||[],['state','orders','revenue'])}/>
              {(salesData?.charts?.byState||[]).map((r:any)=>(
                <MiniBar key={r.state} label={r.state} value={r.revenue} max={Math.max(...(salesData?.charts?.byState||[]).map((x:any)=>x.revenue))} color="bg-rose-500"/>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <SHdr title="Top Products"
              onCSV={()=>dlCSV('products.csv',salesData?.charts?.byProduct||[],['name','qty','revenue','orders'])}
              onExcel={()=>dlExcel('sales-report.xlsx',[{name:'Top Products',rows:salesData?.charts?.byProduct||[],cols:['name','qty','revenue','orders']},{name:'Order Register',rows:salesData?.orders||[],cols:['order_number','date','customer_name','customer_phone','city','state','payment_mode','status','total']}])}
              onPrint={()=>window.print()}/>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-100">{['#','Product','Metres','Revenue','Orders'].map(h=><th key={h} className="text-left text-xs font-semibold text-gray-400 pb-2 pr-4">{h}</th>)}</tr></thead>
                <tbody>
                  {(salesData?.charts?.byProduct||[]).slice(0,15).map((p:any,i:number)=>(
                    <tr key={p.name} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2 pr-4 text-gray-400 text-xs">{i+1}</td>
                      <td className="py-2 pr-4 font-medium text-gray-800">{p.name}</td>
                      <td className="py-2 pr-4 text-gray-600">{fmtN(p.qty)} m</td>
                      <td className="py-2 pr-4 font-semibold">{inr(p.revenue)}</td>
                      <td className="py-2 pr-4 text-gray-600">{p.orders}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <SHdr title={`Order Register (${salesData?.orders?.length||0})`}
              onCSV={()=>dlCSV('orders.csv',salesData?.orders||[],['order_number','date','customer_name','customer_phone','city','state','payment_mode','payment_status','status','subtotal','discount','gst','delivery','total','coupon'])}
              onExcel={()=>dlExcel('orders.xlsx',[{name:'Orders',rows:salesData?.orders||[],cols:['order_number','date','customer_name','customer_phone','city','state','payment_mode','payment_status','status','subtotal','discount','gst','delivery','total','coupon']}])}
              onPrint={()=>window.print()}/>
            <div className="overflow-x-auto max-h-80">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-white"><tr className="border-b border-gray-100">{['Order#','Date','Customer','Phone','City','Mode','Status','Total'].map(h=><th key={h} className="text-left font-semibold text-gray-400 pb-2 pr-3 whitespace-nowrap">{h}</th>)}</tr></thead>
                <tbody>
                  {(salesData?.orders||[]).slice().reverse().map((o:any)=>(
                    <tr key={o.order_number} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-1.5 pr-3 font-mono font-semibold text-rose-700">{o.order_number}</td>
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

      {/* ══ FINANCE & GST TAB ══════════════════════════════════════════════════ */}
      {activeTab==='finance' && (
        <div className="space-y-6">
          <div className="flex gap-2 items-center">
            <Calendar size={14} className="text-gray-400"/>
            {(['daily','weekly','monthly','yearly'] as Range[]).map(r=>(
              <button key={r} onClick={()=>{setRange(r);load('finance',r)}}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors ${range===r?'bg-rose-600 text-white':'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                {r.charAt(0).toUpperCase()+r.slice(1)}
              </button>
            ))}
          </div>

          {/* P&L KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard label="Gross Revenue"   value={inr(f.grossRevenue||0)}   icon={IndianRupee} color="bg-rose-600"/>
            <KpiCard label="Net Revenue"     value={inr(f.netRevenue||0)}     icon={TrendingUp}  color="bg-green-600"/>
            <KpiCard label="GST Collected"   value={inr(f.gstCollected||0)}   icon={Receipt}     color="bg-blue-600"/>
            <KpiCard label="Total Received"  value={inr(f.totalReceived||0)}  icon={ShoppingBag} color="bg-purple-600"/>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[{l:'Discounts Given',v:inr(f.totalDiscounts||0)},{l:'Delivery Revenue',v:inr(f.deliveryRevenue||0)},{l:'CGST',v:inr(f.cgstTotal||0)},{l:'IGST',v:inr(f.igstTotal||0)}].map(({l,v})=>(
              <div key={l} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <p className="text-lg font-bold text-gray-900">{v}</p>
                <p className="text-xs text-gray-500 mt-0.5">{l}</p>
              </div>
            ))}
          </div>

          {/* Pending payments alert */}
          {f.pendingCount > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertTriangle size={18} className="text-amber-600 flex-none mt-0.5"/>
              <div>
                <p className="text-sm font-semibold text-amber-800">{f.pendingCount} Pending Orders — {inr(f.pendingAmount)}</p>
                <p className="text-xs text-amber-700 mt-0.5">These orders have not been paid yet. Follow up or cancel to keep accounts accurate.</p>
              </div>
            </div>
          )}

          {/* HSN Summary */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <SHdr title="HSN Summary (GST Return Ready)"
              onCSV={()=>dlCSV('hsn-summary.csv',finData?.hsnSummary||[],['hsn','description','quantity','unit','taxable_value','cgst','sgst','igst','total_tax'])}
              onExcel={()=>dlExcel('hsn-summary.xlsx',[{name:'HSN Summary',rows:finData?.hsnSummary||[],cols:['hsn','description','quantity','unit','taxable_value','cgst','sgst','igst','total_tax']}])}/>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-100">{['HSN','Description','Qty (m)','Taxable Value','CGST','SGST','IGST','Total Tax'].map(h=><th key={h} className="text-left text-xs font-semibold text-gray-400 pb-2 pr-4 whitespace-nowrap">{h}</th>)}</tr></thead>
                <tbody>
                  {(finData?.hsnSummary||[]).map((h:any)=>(
                    <tr key={h.hsn} className="border-b border-gray-50">
                      <td className="py-2 pr-4 font-mono font-semibold text-blue-700">{h.hsn}</td>
                      <td className="py-2 pr-4 text-gray-600 max-w-[200px] truncate">{h.description}</td>
                      <td className="py-2 pr-4">{fmtN(Math.round(h.quantity))} m</td>
                      <td className="py-2 pr-4 font-semibold">{inr(h.taxable_value)}</td>
                      <td className="py-2 pr-4">{inr(h.cgst)}</td>
                      <td className="py-2 pr-4">{inr(h.sgst)}</td>
                      <td className="py-2 pr-4">{inr(h.igst)}</td>
                      <td className="py-2 pr-4 font-bold text-gray-900">{inr(h.total_tax)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* GST Register */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <SHdr title={`GST Register (${finData?.gstRegister?.length||0} invoices)`}
              onCSV={()=>dlCSV('gst-register.csv',finData?.gstRegister||[],['invoice','date','customer','phone','state','supply_type','taxable_value','gst_rate','cgst','sgst','igst','total_gst','total_amount'])}
              onExcel={()=>dlExcel('gst-register.xlsx',[{name:'GST Register',rows:finData?.gstRegister||[],cols:['invoice','date','customer','phone','state','supply_type','taxable_value','gst_rate','cgst','sgst','igst','total_gst','total_amount']}])}
              onPrint={()=>window.print()}/>
            <div className="overflow-x-auto max-h-80">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-white"><tr className="border-b border-gray-100">{['Invoice','Date','Customer','State','Type','Taxable','CGST','SGST','IGST','Total'].map(h=><th key={h} className="text-left font-semibold text-gray-400 pb-2 pr-3 whitespace-nowrap">{h}</th>)}</tr></thead>
                <tbody>
                  {(finData?.gstRegister||[]).slice().reverse().map((r:any)=>(
                    <tr key={r.invoice} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-1.5 pr-3 font-mono font-semibold text-rose-700 text-[10px]">{r.invoice}</td>
                      <td className="py-1.5 pr-3 text-gray-500">{r.date}</td>
                      <td className="py-1.5 pr-3 font-medium text-gray-800">{r.customer}</td>
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

          {/* Payment Register */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <SHdr title="Payment Register"
              onCSV={()=>dlCSV('payment-register.csv',finData?.paymentRegister||[],['order_number','date','customer','phone','payment_mode','payment_ref','amount','status'])}
              onExcel={()=>dlExcel('payment-register.xlsx',[{name:'Payments',rows:finData?.paymentRegister||[],cols:['order_number','date','customer','phone','payment_mode','payment_ref','amount','status']}])}/>
            <div className="overflow-x-auto max-h-72">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-white"><tr className="border-b border-gray-100">{['Order#','Date','Customer','Phone','Mode','Ref','Amount'].map(h=><th key={h} className="text-left font-semibold text-gray-400 pb-2 pr-3">{h}</th>)}</tr></thead>
                <tbody>
                  {(finData?.paymentRegister||[]).slice().reverse().map((r:any)=>(
                    <tr key={r.order_number} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-1.5 pr-3 font-mono font-semibold text-rose-700 text-[10px]">{r.order_number}</td>
                      <td className="py-1.5 pr-3 text-gray-500">{r.date}</td>
                      <td className="py-1.5 pr-3 font-medium">{r.customer}</td>
                      <td className="py-1.5 pr-3 text-gray-500">{r.phone}</td>
                      <td className="py-1.5 pr-3 capitalize">{r.payment_mode}</td>
                      <td className="py-1.5 pr-3 font-mono text-[10px] text-gray-400">{r.payment_ref||'—'}</td>
                      <td className="py-1.5 pr-3 font-semibold">{inr(r.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══ INVENTORY TAB ══════════════════════════════════════════════════════ */}
      {activeTab==='inventory' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard label="Total Products"   value={fmtN(inv.totalProducts||0)}    icon={Package}       color="bg-blue-600"/>
            <KpiCard label="Total Stock (m)"  value={fmtN(inv.totalStockMetres||0)} icon={TrendingUp}    color="bg-purple-600"/>
            <KpiCard label="Stock Value"      value={inr(inv.totalValue||0)}        icon={IndianRupee}   color="bg-rose-600"/>
            <KpiCard label="Low/Out Stock"    value={`${inv.lowStock||0}/${inv.outOfStock||0}`} icon={AlertTriangle} color="bg-amber-500"/>
          </div>
          {(inv.outOfStock>0||inv.lowStock>0) && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertTriangle size={18} className="text-amber-600 flex-none mt-0.5"/>
              <p className="text-sm text-amber-800">{inv.outOfStock||0} products out of stock · {inv.lowStock||0} below reorder level. Restock soon.</p>
            </div>
          )}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <SHdr title="Product Inventory Register"
              onCSV={()=>dlCSV('inventory.csv',invData?.items||[],['name','category','price','stock','available','sold','status','velocity_label','value'])}
              onExcel={()=>dlExcel('inventory.xlsx',[{name:'Inventory',rows:invData?.items||[],cols:['name','category','price','stock','available','sold','status','velocity_label','value']}])}
              onPrint={()=>window.print()}/>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-white"><tr className="border-b border-gray-100">{['Product','Category','Price/m','Stock','Available','Sold','Status','Movement','Value'].map(h=><th key={h} className="text-left font-semibold text-gray-400 pb-2 pr-3 whitespace-nowrap">{h}</th>)}</tr></thead>
                <tbody>
                  {(invData?.items||[]).map((p:any)=>(
                    <tr key={p.id} className={`border-b border-gray-50 hover:bg-gray-50 ${p.status==='out_of_stock'?'bg-red-50/50':p.status==='low_stock'?'bg-amber-50/50':''}`}>
                      <td className="py-1.5 pr-3 font-medium text-gray-800 max-w-[160px] truncate">{p.name}</td>
                      <td className="py-1.5 pr-3 text-gray-500">{p.category}</td>
                      <td className="py-1.5 pr-3">₹{p.price}</td>
                      <td className="py-1.5 pr-3">{fmtN(p.stock)} m</td>
                      <td className="py-1.5 pr-3">{fmtN(p.available)} m</td>
                      <td className="py-1.5 pr-3">{fmtN(p.sold)} m</td>
                      <td className="py-1.5 pr-3"><span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${p.status==='in_stock'?'bg-green-100 text-green-700':p.status==='low_stock'?'bg-amber-100 text-amber-700':'bg-red-100 text-red-700'}`}>{p.status.replace('_',' ')}</span></td>
                      <td className="py-1.5 pr-3"><span className={`text-[10px] font-semibold ${p.velocity_label==='Fast Moving'?'text-green-600':p.velocity_label==='Slow Moving'?'text-red-500':'text-gray-500'}`}>{p.velocity_label}</span></td>
                      <td className="py-1.5 pr-3 font-semibold">{inr(p.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══ CUSTOMERS TAB ══════════════════════════════════════════════════════ */}
      {activeTab==='customers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard label="Total Customers"  value={fmtN(c.totalCustomers||0)}  icon={Users}       color="bg-blue-600"/>
            <KpiCard label="Repeat Customers" value={fmtN(c.repeatCustomers||0)} icon={TrendingUp}  color="bg-green-600"/>
            <KpiCard label="VIP Customers"    value={fmtN(c.vipCustomers||0)}    icon={Star}        color="bg-amber-500"/>
            <KpiCard label="Avg LTV"          value={inr(c.avgLTV||0)}           icon={IndianRupee} color="bg-purple-600"/>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <SHdr title="Top Customers"
              onCSV={()=>dlCSV('customers.csv',custData?.topCustomers||[],['name','phone','email','city','state','orders','revenue','avgOrder','segment'])}
              onExcel={()=>dlExcel('customers.xlsx',[{name:'Customers',rows:custData?.topCustomers||[],cols:['name','phone','email','city','state','orders','revenue','avgOrder','segment']}])}
              onPrint={()=>window.print()}/>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-white"><tr className="border-b border-gray-100">{['#','Customer','Phone','City','Orders','Avg Order','Revenue','Segment'].map(h=><th key={h} className="text-left font-semibold text-gray-400 pb-2 pr-3 whitespace-nowrap">{h}</th>)}</tr></thead>
                <tbody>
                  {(custData?.topCustomers||[]).map((cu:any,i:number)=>(
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
            <SHdr title="Revenue by State" onCSV={()=>dlCSV('customers-state.csv',custData?.byState||[],['state','customers','revenue'])}/>
            {(custData?.byState||[]).map((r:any)=>(
              <MiniBar key={r.state} label={r.state} value={r.revenue} max={Math.max(...(custData?.byState||[]).map((x:any)=>x.revenue))} color="bg-purple-500"/>
            ))}
          </div>
        </div>
      )}

      {/* Loading overlay */}
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
