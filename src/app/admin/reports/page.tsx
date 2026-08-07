'use client'
import { useState, useEffect, useCallback } from 'react'
import {
  TrendingUp, Package, Users, IndianRupee,
  Download, RefreshCw, Filter, Calendar,
  BarChart3, ShoppingBag, Star, ArrowUpRight,
  ArrowDownRight, Minus, FileText, ChevronDown,
  Printer, Mail, Share2, AlertTriangle, CheckCircle2,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────
type SalesSummary = {
  totalRevenue: number; totalOrders: number; paidOrders: number
  cancelledOrders: number; totalDiscount: number; totalGst: number
  totalDelivery: number; avgOrderValue: number; totalMetres: number
  cancellationRate: number
}
type InvSummary = {
  totalProducts: number; totalStockMetres: number; totalValue: number
  outOfStock: number; lowStock: number; inStock: number
  fastMoving: number; slowMoving: number
}
type CustSummary = {
  totalCustomers: number; repeatCustomers: number; oneTimeCustomers: number
  vipCustomers: number; activeLastMonth: number; totalRevenue: number
  avgLTV: number; repeatRate: number
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n: number) { return `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` }
function fmtN(n: number) { return n.toLocaleString('en-IN') }

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
            trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-500' : 'text-gray-400'
          }`}>
            {trend === 'up' ? <ArrowUpRight size={12} /> : trend === 'down' ? <ArrowDownRight size={12} /> : <Minus size={12} />}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-0.5">{value}</p>
      <p className="text-xs font-semibold text-gray-500">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

function SectionHeader({ title, onExportCSV, onPrint }:
  { title: string; onExportCSV?: () => void; onPrint?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      <div className="flex gap-2">
        {onExportCSV && (
          <button onClick={onExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-green-50 text-green-700 hover:bg-green-100 rounded-xl transition-colors">
            <Download size={12} /> CSV
          </button>
        )}
        {onPrint && (
          <button onClick={onPrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl transition-colors">
            <Printer size={12} /> Print
          </button>
        )}
      </div>
    </div>
  )
}

// ── CSV Export ─────────────────────────────────────────────────────────────────
function downloadCSV(filename: string, rows: Record<string, any>[], cols: string[]) {
  const header = cols.join(',')
  const body   = rows.map(r => cols.map(c => JSON.stringify(r[c] ?? '')).join(',')).join('\n')
  const blob   = new Blob([`${header}\n${body}`], { type: 'text/csv' })
  const url    = URL.createObjectURL(blob)
  const a      = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

// ── Mini bar chart ─────────────────────────────────────────────────────────────
function MiniBar({ label, value, max, color = 'bg-rose-500' }:
  { label: string; value: number; max: number; color?: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-xs text-gray-500 w-28 truncate flex-none">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-700 w-20 text-right flex-none">
        {typeof value === 'number' && value > 100 ? fmt(value) : fmtN(value)}
      </span>
    </div>
  )
}

// ── Date range ─────────────────────────────────────────────────────────────────
type Range = 'daily' | 'weekly' | 'monthly' | 'yearly'

// ══════════════════════════════════════════════════════════════════════════════
export default function AdminReportsPage() {
  const [activeTab, setActiveTab] = useState<'sales'|'inventory'|'customers'>('sales')
  const [range,     setRange]     = useState<Range>('monthly')
  const [salesData, setSalesData] = useState<any>(null)
  const [invData,   setInvData]   = useState<any>(null)
  const [custData,  setCustData]  = useState<any>(null)
  const [loading,   setLoading]   = useState(false)

  const loadSales = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/reports/sales?range=${range}`)
    const j   = await res.json()
    setSalesData(j)
    setLoading(false)
  }, [range])

  const loadInventory = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/reports/inventory')
    const j   = await res.json()
    setInvData(j)
    setLoading(false)
  }, [])

  const loadCustomers = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/reports/customers')
    const j   = await res.json()
    setCustData(j)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (activeTab === 'sales')     loadSales()
    if (activeTab === 'inventory') loadInventory()
    if (activeTab === 'customers') loadCustomers()
  }, [activeTab, loadSales, loadInventory, loadCustomers])

  const s: SalesSummary    = salesData?.summary || {}
  const inv: InvSummary    = invData?.summary   || {}
  const cust: CustSummary  = custData?.summary  || {}

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 size={24} className="text-rose-600" /> Reports & Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Business intelligence — GoFabrikos</p>
        </div>
        <button onClick={() => {
          if (activeTab === 'sales')     loadSales()
          if (activeTab === 'inventory') loadInventory()
          if (activeTab === 'customers') loadCustomers()
        }} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-white rounded-xl border border-gray-200 p-1 w-fit mb-6">
        {[
          { key: 'sales',     label: 'Sales',     icon: TrendingUp },
          { key: 'inventory', label: 'Inventory', icon: Package },
          { key: 'customers', label: 'Customers', icon: Users },
        ].map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setActiveTab(key as any)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === key ? 'bg-stone-900 text-white' : 'text-gray-500 hover:text-gray-700'
            }`}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* ══ SALES TAB ══════════════════════════════════════════════════════════ */}
      {activeTab === 'sales' && (
        <div className="space-y-6">
          {/* Range selector */}
          <div className="flex gap-2 items-center">
            <Calendar size={14} className="text-gray-400" />
            {(['daily','weekly','monthly','yearly'] as Range[]).map(r => (
              <button key={r} onClick={() => setRange(r)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors ${
                  range === r ? 'bg-rose-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <KpiCard label="Revenue"        value={fmt(s.totalRevenue || 0)}    icon={IndianRupee}  color="bg-rose-600"  />
            <KpiCard label="Paid Orders"    value={fmtN(s.paidOrders || 0)}     icon={ShoppingBag}  color="bg-blue-600"  />
            <KpiCard label="Avg Order"      value={fmt(s.avgOrderValue || 0)}   icon={TrendingUp}   color="bg-purple-600"/>
            <KpiCard label="Metres Sold"    value={fmtN(s.totalMetres || 0)}    icon={Package}      color="bg-amber-600" />
            <KpiCard label="Cancellation"   value={`${s.cancellationRate || 0}%`} icon={AlertTriangle} color="bg-gray-500" />
          </div>

          {/* Revenue detail row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'GST Collected',   value: fmt(s.totalGst      || 0) },
              { label: 'Discounts Given', value: fmt(s.totalDiscount  || 0) },
              { label: 'Delivery Charges',value: fmt(s.totalDelivery  || 0) },
              { label: 'Cancelled Orders',value: fmtN(s.cancelledOrders || 0) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <p className="text-lg font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* By Payment Mode */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <SectionHeader title="Revenue by Payment Mode"
                onExportCSV={() => downloadCSV('payment-mode.csv', salesData?.charts?.byPayment || [], ['mode','orders','revenue'])} />
              {(salesData?.charts?.byPayment || []).map((r: any) => (
                <MiniBar key={r.mode} label={r.mode} value={r.revenue}
                  max={Math.max(...(salesData?.charts?.byPayment || []).map((x: any) => x.revenue))}
                  color="bg-blue-500" />
              ))}
              {!(salesData?.charts?.byPayment?.length) && !loading && <p className="text-sm text-gray-400">No data</p>}
            </div>

            {/* Top States */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <SectionHeader title="Top States by Revenue"
                onExportCSV={() => downloadCSV('states.csv', salesData?.charts?.byState || [], ['state','orders','revenue'])} />
              {(salesData?.charts?.byState || []).map((r: any) => (
                <MiniBar key={r.state} label={r.state} value={r.revenue}
                  max={Math.max(...(salesData?.charts?.byState || []).map((x: any) => x.revenue))}
                  color="bg-rose-500" />
              ))}
              {!(salesData?.charts?.byState?.length) && !loading && <p className="text-sm text-gray-400">No data</p>}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <SectionHeader title="Top Products by Revenue"
              onExportCSV={() => downloadCSV('top-products.csv', salesData?.charts?.byProduct || [],
                ['name','qty','revenue','orders'])}
              onPrint={() => window.print()} />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['#','Product','Metres Sold','Revenue','Orders'].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-400 pb-2 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(salesData?.charts?.byProduct || []).slice(0, 15).map((p: any, i: number) => (
                    <tr key={p.name} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2 pr-4 text-gray-400 text-xs">{i+1}</td>
                      <td className="py-2 pr-4 font-medium text-gray-800">{p.name}</td>
                      <td className="py-2 pr-4 text-gray-600">{fmtN(p.qty)} m</td>
                      <td className="py-2 pr-4 font-semibold text-gray-900">{fmt(p.revenue)}</td>
                      <td className="py-2 pr-4 text-gray-600">{fmtN(p.orders)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!(salesData?.charts?.byProduct?.length) && !loading && <p className="text-sm text-gray-400 mt-2">No data for this period</p>}
            </div>
          </div>

          {/* Daily trend */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <SectionHeader title="Daily Revenue Trend"
              onExportCSV={() => downloadCSV('daily-trend.csv', salesData?.charts?.byDate || [], ['date','orders','revenue','metres'])} />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Date','Orders','Revenue','Metres'].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-400 pb-2 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...(salesData?.charts?.byDate || [])].reverse().map((d: any) => (
                    <tr key={d.date} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2 pr-4 text-gray-600">{new Date(d.date).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</td>
                      <td className="py-2 pr-4">{fmtN(d.orders)}</td>
                      <td className="py-2 pr-4 font-semibold text-gray-900">{fmt(d.revenue)}</td>
                      <td className="py-2 pr-4 text-gray-600">{fmtN(d.metres)} m</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!(salesData?.charts?.byDate?.length) && !loading && <p className="text-sm text-gray-400 mt-2">No data for this period</p>}
            </div>
          </div>

          {/* Coupon report */}
          {salesData?.charts?.byCoupon?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <SectionHeader title="Coupon Usage"
                onExportCSV={() => downloadCSV('coupons.csv', salesData?.charts?.byCoupon || [], ['code','uses','discount'])} />
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {['Coupon Code','Uses','Total Discount'].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-gray-400 pb-2 pr-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {salesData.charts.byCoupon.map((c: any) => (
                      <tr key={c.code} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-2 pr-4 font-mono font-semibold text-rose-700">{c.code}</td>
                        <td className="py-2 pr-4">{c.uses}</td>
                        <td className="py-2 pr-4">{fmt(c.discount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Full order register */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <SectionHeader title={`Order Register (${salesData?.orders?.length || 0} orders)`}
              onExportCSV={() => downloadCSV('order-register.csv', salesData?.orders || [],
                ['order_number','date','customer_name','customer_phone','city','state','payment_mode','payment_status','status','subtotal','discount','gst','delivery','total','coupon'])}
              onPrint={() => window.print()} />
            <div className="overflow-x-auto max-h-80">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-gray-100">
                    {['Order #','Date','Customer','Phone','City','Mode','Status','Total'].map(h => (
                      <th key={h} className="text-left font-semibold text-gray-400 pb-2 pr-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(salesData?.orders || []).slice().reverse().map((o: any) => (
                    <tr key={o.order_number} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-1.5 pr-3 font-mono font-semibold text-rose-700">{o.order_number}</td>
                      <td className="py-1.5 pr-3 whitespace-nowrap text-gray-500">{o.date?.slice(0,10)}</td>
                      <td className="py-1.5 pr-3 font-medium text-gray-800">{o.customer_name}</td>
                      <td className="py-1.5 pr-3 text-gray-500">{o.customer_phone}</td>
                      <td className="py-1.5 pr-3 text-gray-500">{o.city}</td>
                      <td className="py-1.5 pr-3 capitalize">{o.payment_mode}</td>
                      <td className="py-1.5 pr-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          o.payment_status === 'paid' ? 'bg-green-100 text-green-700'
                          : o.status === 'cancelled'  ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                        }`}>{o.payment_status === 'paid' ? o.status : o.payment_status}</span>
                      </td>
                      <td className="py-1.5 pr-3 font-semibold">{fmt(o.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!(salesData?.orders?.length) && !loading && <p className="text-sm text-gray-400 mt-2">No orders for this period</p>}
            </div>
          </div>
        </div>
      )}

      {/* ══ INVENTORY TAB ══════════════════════════════════════════════════════ */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard label="Total Products"    value={fmtN(inv.totalProducts || 0)}    icon={Package}       color="bg-blue-600"  />
            <KpiCard label="Total Stock (m)"   value={fmtN(inv.totalStockMetres || 0)} icon={TrendingUp}    color="bg-purple-600"/>
            <KpiCard label="Stock Value"       value={fmt(inv.totalValue || 0)}        icon={IndianRupee}   color="bg-rose-600"  />
            <KpiCard label="Low / Out Stock"   value={`${inv.lowStock||0} / ${inv.outOfStock||0}`} icon={AlertTriangle} color="bg-amber-500" />
          </div>

          {/* Alerts */}
          {(inv.outOfStock > 0 || inv.lowStock > 0) && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertTriangle size={18} className="text-amber-600 flex-none mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Stock Alert</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  {inv.outOfStock || 0} products out of stock · {inv.lowStock || 0} products below reorder level.
                  Review and restock soon to avoid lost sales.
                </p>
              </div>
            </div>
          )}

          {/* By Category */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <SectionHeader title="Stock by Category"
              onExportCSV={() => downloadCSV('inventory-by-category.csv', invData?.byCategory || [],
                ['category','count','totalStock','totalValue','lowStock'])} />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Category','Products','Total Stock (m)','Stock Value','Low/Out'].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-400 pb-2 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(invData?.byCategory || []).map((c: any) => (
                    <tr key={c.category} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2 pr-4 font-semibold text-gray-800">{c.category}</td>
                      <td className="py-2 pr-4">{c.count}</td>
                      <td className="py-2 pr-4">{fmtN(Math.round(c.totalStock))} m</td>
                      <td className="py-2 pr-4 font-semibold">{fmt(c.totalValue)}</td>
                      <td className="py-2 pr-4">
                        {c.lowStock > 0
                          ? <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-semibold">{c.lowStock}</span>
                          : <CheckCircle2 size={14} className="text-green-500" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Product inventory list */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <SectionHeader title="Product Inventory Register"
              onExportCSV={() => downloadCSV('inventory.csv', invData?.items || [],
                ['name','category','price','stock','available','sold','status','velocity_label','value'])}
              onPrint={() => window.print()} />
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-gray-100">
                    {['Product','Category','Price','Stock','Available','Sold','Status','Movement','Value'].map(h => (
                      <th key={h} className="text-left font-semibold text-gray-400 pb-2 pr-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(invData?.items || []).map((p: any) => (
                    <tr key={p.id} className={`border-b border-gray-50 hover:bg-gray-50 ${
                      p.status === 'out_of_stock' ? 'bg-red-50/50' : p.status === 'low_stock' ? 'bg-amber-50/50' : ''
                    }`}>
                      <td className="py-1.5 pr-3 font-medium text-gray-800 max-w-[160px] truncate">{p.name}</td>
                      <td className="py-1.5 pr-3 text-gray-500">{p.category}</td>
                      <td className="py-1.5 pr-3">₹{p.price}/m</td>
                      <td className="py-1.5 pr-3">{fmtN(p.stock)} m</td>
                      <td className="py-1.5 pr-3">{fmtN(p.available)} m</td>
                      <td className="py-1.5 pr-3">{fmtN(p.sold)} m</td>
                      <td className="py-1.5 pr-3">
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === 'in_stock'     ? 'bg-green-100 text-green-700'
                          : p.status === 'low_stock'  ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                        }`}>{p.status.replace('_',' ')}</span>
                      </td>
                      <td className="py-1.5 pr-3">
                        <span className={`text-[10px] font-semibold ${
                          p.velocity_label === 'Fast Moving' ? 'text-green-600'
                          : p.velocity_label === 'Slow Moving' ? 'text-red-500'
                          : 'text-gray-500'
                        }`}>{p.velocity_label}</span>
                      </td>
                      <td className="py-1.5 pr-3 font-semibold">{fmt(p.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══ CUSTOMERS TAB ══════════════════════════════════════════════════════ */}
      {activeTab === 'customers' && (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard label="Total Customers"  value={fmtN(cust.totalCustomers || 0)}  icon={Users}       color="bg-blue-600"   />
            <KpiCard label="Repeat Customers" value={fmtN(cust.repeatCustomers || 0)} icon={TrendingUp}  color="bg-green-600"  />
            <KpiCard label="VIP Customers"    value={fmtN(cust.vipCustomers || 0)}    icon={Star}        color="bg-amber-500"  />
            <KpiCard label="Avg LTV"          value={fmt(cust.avgLTV || 0)}           icon={IndianRupee} color="bg-purple-600" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Repeat Rate',       value: `${cust.repeatRate || 0}%` },
              { label: 'Active (30 days)',   value: fmtN(cust.activeLastMonth || 0) },
              { label: 'One-time Buyers',    value: fmtN(cust.oneTimeCustomers || 0) },
              { label: 'Total Revenue',      value: fmt(cust.totalRevenue || 0) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <p className="text-lg font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* By State */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <SectionHeader title="Revenue by State"
              onExportCSV={() => downloadCSV('customers-by-state.csv', custData?.byState || [], ['state','customers','revenue'])} />
            {(custData?.byState || []).map((r: any) => (
              <MiniBar key={r.state} label={r.state} value={r.revenue}
                max={Math.max(...(custData?.byState || []).map((x: any) => x.revenue))}
                color="bg-purple-500" />
            ))}
          </div>

          {/* Top Customers */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <SectionHeader title="Top Customers by Revenue"
              onExportCSV={() => downloadCSV('top-customers.csv', custData?.topCustomers || [],
                ['name','phone','email','city','state','orders','revenue','avgOrder','segment'])}
              onPrint={() => window.print()} />
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-gray-100">
                    {['#','Customer','Phone','City','Orders','Avg Order','Revenue','Segment'].map(h => (
                      <th key={h} className="text-left font-semibold text-gray-400 pb-2 pr-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(custData?.topCustomers || []).map((c: any, i: number) => (
                    <tr key={c.phone} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-1.5 pr-3 text-gray-400">{i+1}</td>
                      <td className="py-1.5 pr-3 font-medium text-gray-800">{c.name}</td>
                      <td className="py-1.5 pr-3 text-gray-500">{c.phone}</td>
                      <td className="py-1.5 pr-3 text-gray-500">{c.city}</td>
                      <td className="py-1.5 pr-3">{c.orders}</td>
                      <td className="py-1.5 pr-3">{fmt(c.avgOrder)}</td>
                      <td className="py-1.5 pr-3 font-semibold text-gray-900">{fmt(c.revenue)}</td>
                      <td className="py-1.5 pr-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.segment === 'VIP'       ? 'bg-amber-100 text-amber-700'
                          : c.segment === 'Loyal'   ? 'bg-green-100 text-green-700'
                          : c.segment === 'Returning'? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600'
                        }`}>{c.segment}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!(custData?.topCustomers?.length) && !loading && <p className="text-sm text-gray-400 mt-2">No data</p>}
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-white/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-3">
            <RefreshCw size={18} className="animate-spin text-rose-600" />
            <span className="font-semibold text-gray-700">Loading report…</span>
          </div>
        </div>
      )}
    </div>
  )
}
