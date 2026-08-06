'use client'
import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import {
  IndianRupee, TrendingUp, CreditCard, Banknote, Receipt,
  Download, ChevronDown, CheckCircle, Clock, AlertTriangle,
  RefreshCw, ArrowUpRight, ArrowDownRight
} from 'lucide-react'

const MONTHLY = [
  { month:'Mar', revenue:182000, expenses:45000, gst:8600, refunds:5200 },
  { month:'Apr', revenue:210000, expenses:48000, gst:9800, refunds:6100 },
  { month:'May', revenue:195000, expenses:47000, gst:9100, refunds:4800 },
  { month:'Jun', revenue:248000, expenses:52000, gst:11600, refunds:7200 },
  { month:'Jul', revenue:312000, expenses:58000, gst:14600, refunds:9100 },
  { month:'Aug', revenue:428000, expenses:65000, gst:20200, refunds:11400 },
]

const PAYMENTS = [
  { id:'TXN-001', order:'GF-2026-0024', customer:'Ananya Reddy',  gateway:'Razorpay', method:'UPI',     amount:3850,  status:'captured', date:'5 Aug 2026' },
  { id:'TXN-002', order:'GF-2026-0023', customer:'Priya Sharma',  gateway:'Razorpay', method:'Card',    amount:1299,  status:'captured', date:'5 Aug 2026' },
  { id:'TXN-003', order:'GF-2026-0022', customer:'Meena Patel',   gateway:'Razorpay', method:'UPI',     amount:5600,  status:'captured', date:'4 Aug 2026' },
  { id:'TXN-004', order:'GF-2026-0021', customer:'Lakshmi Devi',  gateway:'COD',      method:'COD',     amount:2400,  status:'pending',  date:'4 Aug 2026' },
  { id:'TXN-005', order:'GF-2026-0020', customer:'Sunita Kumari', gateway:'Razorpay', method:'Net Bank',amount:780,   status:'pending',  date:'3 Aug 2026' },
  { id:'TXN-006', order:'GF-2026-0019', customer:'Rekha Nair',    gateway:'Razorpay', method:'UPI',     amount:9500,  status:'captured', date:'3 Aug 2026' },
  { id:'TXN-007', order:'GF-2026-0018', customer:'Deepa Varma',   gateway:'Razorpay', method:'Card',    amount:2250,  status:'refunded', date:'2 Aug 2026' },
  { id:'TXN-008', order:'GF-2026-0017', customer:'Kavitha Rao',   gateway:'COD',      method:'COD',     amount:3500,  status:'captured', date:'2 Aug 2026' },
]

const GST_DATA = [
  { type:'5% GST (Fabrics)',  taxable:320000, cgst:8000, sgst:8000, igst:0,    total:16000 },
  { type:'12% GST (Stitched)',taxable:18000,  cgst:1080, sgst:1080, igst:0,    total:2160  },
  { type:'IGST (Out-of-State)',taxable:42000, cgst:0,    sgst:0,    igst:2100, total:2100  },
]

const STATUS_STYLES: Record<string,string> = {
  captured: 'bg-green-100 text-green-700',
  pending:  'bg-orange-100 text-orange-700',
  refunded: 'bg-purple-100 text-purple-700',
  failed:   'bg-red-100 text-red-700',
}

export default function FinancePage() {
  const [period, setPeriod] = useState('this_month')
  const [tab, setTab] = useState<'overview'|'transactions'|'gst'>('overview')

  const current = MONTHLY[MONTHLY.length - 1]
  const prev    = MONTHLY[MONTHLY.length - 2]
  const revGrowth = ((current.revenue - prev.revenue) / prev.revenue * 100).toFixed(1)
  const netProfit = current.revenue - current.expenses - current.gst - current.refunds

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-stone-900">Finance</h2>
          <p className="text-sm text-stone-500">GST: 37DOEPA8029G1Z1 · GoFabrikos, Guntur AP</p></div>
        <div className="flex gap-2">
          <select value={period} onChange={e=>setPeriod(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm border border-stone-200 bg-white text-stone-600 focus:outline-none">
            <option value="this_month">August 2026</option>
            <option value="last_month">July 2026</option>
            <option value="this_year">FY 2026–27</option>
          </select>
          <button className="flex items-center gap-2 border border-stone-200 bg-white text-stone-600 text-sm px-3 py-2 rounded-xl hover:bg-stone-50">
            <Download size={14}/>Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label:'Gross Revenue',  value:`₹${(current.revenue/100000).toFixed(2)}L`, trend:+parseFloat(revGrowth), icon:IndianRupee, color:'bg-rose-50 text-rose-600' },
          { label:'Net Profit',     value:`₹${(netProfit/1000).toFixed(1)}K`,         trend:+8.2,                  icon:TrendingUp,  color:'bg-green-50 text-green-600' },
          { label:'GST Liability',  value:`₹${(current.gst/1000).toFixed(1)}K`,       trend:+38.4,                 icon:Receipt,     color:'bg-amber-50 text-amber-600' },
          { label:'Total Refunds',  value:`₹${(current.refunds/1000).toFixed(1)}K`,   trend:+25.3,                 icon:RefreshCw,   color:'bg-purple-50 text-purple-600' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-stone-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${k.color}`}>
                <k.icon size={18} />
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-semibold ${k.trend>=0?'text-green-600':'text-red-500'}`}>
                {k.trend>=0?<ArrowUpRight size={12}/>:<ArrowDownRight size={12}/>}{Math.abs(k.trend)}%
              </span>
            </div>
            <p className="text-2xl font-bold text-stone-900">{k.value}</p>
            <p className="text-xs text-stone-400 mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 bg-white rounded-t-xl px-4">
        {(['overview','transactions','gst'] as const).map(t => (
          <button key={t} onClick={()=>setTab(t)}
            className={`px-4 py-3 text-sm font-semibold capitalize border-b-2 transition-colors
              ${tab===t?'border-rose-600 text-rose-600':'border-transparent text-stone-500 hover:text-stone-700'}`}>
            {t === 'gst' ? 'GST Summary' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && (
        <div className="space-y-5">
          {/* Revenue vs Expenses Chart */}
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <h3 className="font-bold text-stone-900 mb-1">Revenue vs Expenses (6 months)</h3>
            <p className="text-xs text-stone-500 mb-4">Monthly financial overview</p>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={MONTHLY} margin={{top:5,right:5,left:-10,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{fontSize:11,fill:'#94a3b8'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize:11,fill:'#94a3b8'}} axisLine={false} tickLine={false}
                  tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={(v:number)=>[`₹${v.toLocaleString('en-IN')}`,'']}
                  contentStyle={{borderRadius:10,border:'1px solid #e2e8f0',fontSize:12}} />
                <Legend wrapperStyle={{fontSize:12}} />
                <Bar dataKey="revenue"  name="Revenue"  fill="#e11d48" radius={[4,4,0,0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#94a3b8" radius={[4,4,0,0]} />
                <Bar dataKey="gst"      name="GST"      fill="#f59e0b" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* P&L Summary */}
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <h3 className="font-bold text-stone-900 mb-4">P&L Summary — August 2026</h3>
            <div className="space-y-2">
              {[
                { label:'Gross Revenue',        value:current.revenue,                  cls:'font-bold text-stone-900' },
                { label:'Cost of Goods (Est.)', value:-current.expenses,                cls:'text-stone-700' },
                { label:'Gross Profit',          value:current.revenue-current.expenses, cls:'font-bold text-green-700',  border:true },
                { label:'GST Paid',              value:-current.gst,                     cls:'text-stone-700' },
                { label:'Refunds Issued',        value:-current.refunds,                 cls:'text-stone-700' },
                { label:'Net Profit',            value:netProfit,                        cls:'font-bold text-lg text-green-700', border:true },
              ].map((row,i) => (
                <div key={i} className={`flex justify-between py-2 ${row.border?'border-t border-stone-200 mt-2':''}` }>
                  <span className={`text-sm ${row.cls}`}>{row.label}</span>
                  <span className={`text-sm ${row.cls} ${row.value < 0?'text-red-600':''}`}>
                    {row.value < 0 ? '-' : ''}₹{Math.abs(row.value).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label:'Razorpay',    amount:38200, count:28, icon:CreditCard, color:'bg-blue-50 text-blue-600' },
              { label:'Cash on Delivery', amount:8400, count:6,  icon:Banknote,   color:'bg-green-50 text-green-600' },
              { label:'Pending',    amount:2100,  count:3,  icon:Clock,      color:'bg-amber-50 text-amber-600' },
            ].map(pg => (
              <div key={pg.label} className="bg-white rounded-xl border border-stone-200 p-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${pg.color}`}>
                  <pg.icon size={16} />
                </div>
                <p className="text-xl font-bold text-stone-900">₹{pg.amount.toLocaleString('en-IN')}</p>
                <p className="text-sm text-stone-500">{pg.label}</p>
                <p className="text-xs text-stone-400 mt-0.5">{pg.count} transactions</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {tab === 'transactions' && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50 text-left text-xs font-semibold text-stone-400">
                  <th className="px-4 py-3">TXN ID</th>
                  <th className="px-4 py-3">ORDER</th>
                  <th className="px-4 py-3">CUSTOMER</th>
                  <th className="px-4 py-3">GATEWAY</th>
                  <th className="px-4 py-3">METHOD</th>
                  <th className="px-4 py-3 text-right">AMOUNT</th>
                  <th className="px-4 py-3">STATUS</th>
                  <th className="px-4 py-3">DATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {PAYMENTS.map(tx => (
                  <tr key={tx.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3 text-xs font-mono text-stone-500">{tx.id}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-rose-600">{tx.order}</td>
                    <td className="px-4 py-3 text-sm text-stone-700">{tx.customer}</td>
                    <td className="px-4 py-3 text-xs text-stone-600">{tx.gateway}</td>
                    <td className="px-4 py-3 text-xs text-stone-600">{tx.method}</td>
                    <td className="px-4 py-3 text-right font-bold text-stone-900">₹{tx.amount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLES[tx.status]||''}`}>{tx.status}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-stone-500">{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* GST Tab */}
      {tab === 'gst' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-stone-900">GST Summary — August 2026</h3>
              <button className="flex items-center gap-2 border border-stone-200 text-stone-600 text-sm px-3 py-2 rounded-xl hover:bg-stone-50">
                <Download size={14}/>Export GSTR-1
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50 text-left text-xs font-semibold text-stone-400">
                    <th className="px-4 py-3">GST TYPE</th>
                    <th className="px-4 py-3 text-right">TAXABLE VALUE</th>
                    <th className="px-4 py-3 text-right">CGST</th>
                    <th className="px-4 py-3 text-right">SGST</th>
                    <th className="px-4 py-3 text-right">IGST</th>
                    <th className="px-4 py-3 text-right">TOTAL TAX</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {GST_DATA.map(row => (
                    <tr key={row.type} className="hover:bg-stone-50">
                      <td className="px-4 py-3 text-sm font-medium text-stone-700">{row.type}</td>
                      <td className="px-4 py-3 text-right text-sm text-stone-700">₹{row.taxable.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-right text-sm text-stone-700">₹{row.cgst.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-right text-sm text-stone-700">₹{row.sgst.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-right text-sm text-stone-700">₹{row.igst.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-right font-bold text-amber-600">₹{row.total.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-stone-200 bg-amber-50">
                    <td className="px-4 py-3 font-bold text-stone-900">TOTAL</td>
                    <td className="px-4 py-3 text-right font-bold text-stone-900">₹{GST_DATA.reduce((s,r)=>s+r.taxable,0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-right font-bold text-stone-900">₹{GST_DATA.reduce((s,r)=>s+r.cgst,0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-right font-bold text-stone-900">₹{GST_DATA.reduce((s,r)=>s+r.sgst,0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-right font-bold text-stone-900">₹{GST_DATA.reduce((s,r)=>s+r.igst,0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-right font-bold text-amber-700 text-base">₹{GST_DATA.reduce((s,r)=>s+r.total,0).toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              <strong>GSTIN:</strong> 37DOEPA8029G1Z1 · <strong>Filing Due:</strong> 11 September 2026 (GSTR-1) · <strong>Status:</strong> Not Filed
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
