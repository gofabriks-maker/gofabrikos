'use client'
import { useState } from 'react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts'
import {
  Download, TrendingUp, Package, Users, FileBarChart,
  IndianRupee, RotateCcw, Truck, Star, Filter, Calendar
} from 'lucide-react'

const SALES_DATA = [
  { month:'Mar', revenue:182000, orders:145, customers:42 },
  { month:'Apr', revenue:210000, orders:168, customers:51 },
  { month:'May', revenue:195000, orders:156, customers:48 },
  { month:'Jun', revenue:248000, orders:198, customers:63 },
  { month:'Jul', revenue:312000, orders:248, customers:78 },
  { month:'Aug', revenue:428000, orders:229, customers:94 },
]

const CATEGORY_DATA = [
  { name:'Designer Sarees',  revenue:142000, orders:89,  color:'#e11d48' },
  { name:'Lehenga Fabrics',  revenue:98400,  orders:67,  color:'#f59e0b' },
  { name:'Kurti Fabrics',    revenue:74800,  orders:112, color:'#3b82f6' },
  { name:'Plain Fabrics',    revenue:51200,  orders:134, color:'#22c55e' },
  { name:'Blouse Fabrics',   revenue:42600,  orders:58,  color:'#8b5cf6' },
  { name:'Dupattas',         revenue:19000,  orders:34,  color:'#f97316' },
]

const TOP_CUSTOMERS = [
  { name:'Fatima Shaikh',  city:'Mumbai',     orders:88, spent:540000, type:'Dealer' },
  { name:'Rekha Nair',     city:'Kochi',      orders:56, spent:320000, type:'Wholesale' },
  { name:'Meena Patel',    city:'Surat',      orders:42, spent:186000, type:'Wholesale' },
  { name:'Kavitha Rao',    city:'Guntur',     orders:35, spent:112000, type:'VIP' },
  { name:'Lakshmi Devi',   city:'Chennai',    orders:28, spent:94500,  type:'VIP' },
]

const INVENTORY_REPORT = [
  { product:'Banarasi Silk Brocade',    stock:42,  sold:284, value:35700,  status:'Good' },
  { product:'Georgette Floral Digital', stock:23,  sold:176, value:10350,  status:'Low' },
  { product:'Velvet Embroidery Kurti',  stock:8,   sold:132, value:4960,   status:'Critical' },
  { product:'Chanderi Cotton Blend',    stock:3,   sold:88,  value:1260,   status:'Critical' },
  { product:'Rayon Solid Navy Blue',    stock:88,  sold:154, value:17600,  status:'Good' },
]

const REPORT_CARDS = [
  { label:'Sales Report',       icon: TrendingUp,   color:'bg-rose-50 text-rose-600',   key:'sales' },
  { label:'Category Report',    icon: FileBarChart,  color:'bg-blue-50 text-blue-600',   key:'category' },
  { label:'Inventory Report',   icon: Package,       color:'bg-amber-50 text-amber-600', key:'inventory' },
  { label:'Customer Report',    icon: Users,         color:'bg-green-50 text-green-600', key:'customers' },
]

export default function ReportsPage() {
  const [activeReport, setActive] = useState('sales')
  const [dateRange, setRange]     = useState('6months')

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-stone-900">Reports</h2>
          <p className="text-sm text-stone-500">Business intelligence & analytics</p></div>
        <div className="flex gap-2">
          <select value={dateRange} onChange={e=>setRange(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm border border-stone-200 bg-white text-stone-600 focus:outline-none">
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="6months">Last 6 Months</option>
            <option value="year">This Year</option>
          </select>
          <button className="flex items-center gap-2 border border-stone-200 bg-white text-stone-600 text-sm px-3 py-2 rounded-xl hover:bg-stone-50">
            <Download size={14} />Export
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {REPORT_CARDS.map(r => (
          <button key={r.key} onClick={()=>setActive(r.key)}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left
              ${activeReport===r.key?'border-rose-300 bg-rose-50 shadow-sm':'border-stone-200 bg-white hover:border-stone-300'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${r.color}`}>
              <r.icon size={18} />
            </div>
            <span className={`text-sm font-semibold ${activeReport===r.key?'text-rose-700':'text-stone-700'}`}>{r.label}</span>
          </button>
        ))}
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label:'Total Revenue',   value:'₹13.75L', sub:'Last 6 months',  color:'text-rose-600' },
          { label:'Total Orders',    value:'1,144',   sub:'Last 6 months',  color:'text-blue-600' },
          { label:'Avg Order Value', value:'₹1,202',  sub:'Per transaction',color:'text-green-600' },
          { label:'Repeat Rate',     value:'68%',     sub:'Return customers',color:'text-purple-600' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-stone-200 p-4">
            <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-xs font-semibold text-stone-600 mt-0.5">{k.label}</p>
            <p className="text-xs text-stone-400">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Sales Report */}
      {activeReport === 'sales' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <h3 className="font-bold text-stone-900 mb-1">Monthly Revenue Trend</h3>
            <p className="text-xs text-stone-500 mb-4">Revenue, orders and new customers per month</p>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={SALES_DATA} margin={{top:5,right:5,left:-10,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{fontSize:11,fill:'#94a3b8'}} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{fontSize:11,fill:'#94a3b8'}} axisLine={false} tickLine={false}
                  tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`} />
                <YAxis yAxisId="right" orientation="right" tick={{fontSize:11,fill:'#94a3b8'}} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{borderRadius:10,border:'1px solid #e2e8f0',fontSize:12}} />
                <Legend wrapperStyle={{fontSize:12}} />
                <Line yAxisId="left"  type="monotone" dataKey="revenue" name="Revenue (₹)" stroke="#e11d48" strokeWidth={2.5} dot={{r:4}} />
                <Line yAxisId="right" type="monotone" dataKey="orders"  name="Orders"      stroke="#3b82f6" strokeWidth={2} dot={{r:3}} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
              <h3 className="font-bold text-stone-900">Monthly Sales Breakdown</h3>
              <button className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-700 border border-stone-200 px-3 py-1.5 rounded-lg">
                <Download size={12} />Export CSV
              </button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50 text-xs font-semibold text-stone-400 text-left">
                  <th className="px-5 py-3">MONTH</th>
                  <th className="px-5 py-3 text-right">REVENUE</th>
                  <th className="px-5 py-3 text-right">ORDERS</th>
                  <th className="px-5 py-3 text-right">CUSTOMERS</th>
                  <th className="px-5 py-3 text-right">AOV</th>
                  <th className="px-5 py-3 text-right">GROWTH</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {SALES_DATA.map((row, i) => {
                  const prev = SALES_DATA[i-1]
                  const growth = prev ? ((row.revenue-prev.revenue)/prev.revenue*100).toFixed(1) : null
                  return (
                    <tr key={row.month} className="hover:bg-stone-50">
                      <td className="px-5 py-3 font-semibold text-stone-700">{row.month} 2026</td>
                      <td className="px-5 py-3 text-right font-bold text-stone-900">₹{row.revenue.toLocaleString('en-IN')}</td>
                      <td className="px-5 py-3 text-right text-stone-600">{row.orders}</td>
                      <td className="px-5 py-3 text-right text-stone-600">{row.customers}</td>
                      <td className="px-5 py-3 text-right text-stone-600">₹{Math.round(row.revenue/row.orders).toLocaleString('en-IN')}</td>
                      <td className="px-5 py-3 text-right">
                        {growth && (
                          <span className={`text-xs font-semibold ${parseFloat(growth)>=0?'text-green-600':'text-red-500'}`}>
                            {parseFloat(growth)>=0?'+':''}{growth}%
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Category Report */}
      {activeReport === 'category' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-xl border border-stone-200 p-5">
              <h3 className="font-bold text-stone-900 mb-4">Revenue by Category</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={CATEGORY_DATA} layout="vertical" margin={{top:0,right:20,left:10,bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" tick={{fontSize:10,fill:'#94a3b8'}} axisLine={false} tickLine={false}
                    tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`} />
                  <YAxis type="category" dataKey="name" tick={{fontSize:11,fill:'#64748b'}} axisLine={false} tickLine={false} width={110} />
                  <Tooltip formatter={(v:number)=>[`₹${v.toLocaleString('en-IN')}`,'']}
                    contentStyle={{borderRadius:10,border:'1px solid #e2e8f0',fontSize:12}} />
                  <Bar dataKey="revenue" name="Revenue" radius={[0,4,4,0]}>
                    {CATEGORY_DATA.map((entry,i) => <Cell key={i} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl border border-stone-200 p-5">
              <h3 className="font-bold text-stone-900 mb-4">Category Share</h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={CATEGORY_DATA} cx="50%" cy="50%" outerRadius={75} dataKey="revenue" label={({name,percent})=>`${(percent*100).toFixed(0)}%`} labelLine={false}>
                    {CATEGORY_DATA.map((e,i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={(v:number)=>[`₹${v.toLocaleString('en-IN')}`,'']} contentStyle={{borderRadius:10,fontSize:12}} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {CATEGORY_DATA.map(c => (
                  <div key={c.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{background:c.color}} />
                      <span className="text-stone-600">{c.name}</span>
                    </div>
                    <span className="font-semibold text-stone-700">₹{(c.revenue/1000).toFixed(0)}K</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Report */}
      {activeReport === 'inventory' && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
            <h3 className="font-bold text-stone-900">Inventory Status Report</h3>
            <button className="flex items-center gap-1.5 text-xs text-stone-500 border border-stone-200 px-3 py-1.5 rounded-lg hover:bg-stone-50">
              <Download size={12} />Export
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50 text-xs font-semibold text-stone-400 text-left">
                <th className="px-5 py-3">PRODUCT</th>
                <th className="px-5 py-3 text-right">STOCK LEFT</th>
                <th className="px-5 py-3 text-right">TOTAL SOLD</th>
                <th className="px-5 py-3 text-right">STOCK VALUE</th>
                <th className="px-5 py-3">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {INVENTORY_REPORT.map(row => (
                <tr key={row.product} className="hover:bg-stone-50">
                  <td className="px-5 py-3 font-medium text-stone-800 text-sm">{row.product}</td>
                  <td className="px-5 py-3 text-right">
                    <span className={`text-sm font-bold ${row.stock<10?'text-red-600':row.stock<25?'text-amber-600':'text-stone-800'}`}>{row.stock}m</span>
                  </td>
                  <td className="px-5 py-3 text-right text-sm text-stone-600">{row.sold}m</td>
                  <td className="px-5 py-3 text-right text-sm font-semibold text-stone-800">₹{row.value.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                      ${row.status==='Good'?'bg-green-100 text-green-700':row.status==='Low'?'bg-amber-100 text-amber-700':'bg-red-100 text-red-700'}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Customer Report */}
      {activeReport === 'customers' && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
            <h3 className="font-bold text-stone-900">Top Customers by Revenue</h3>
            <button className="flex items-center gap-1.5 text-xs text-stone-500 border border-stone-200 px-3 py-1.5 rounded-lg hover:bg-stone-50">
              <Download size={12} />Export
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50 text-xs font-semibold text-stone-400 text-left">
                <th className="px-5 py-3">RANK</th>
                <th className="px-5 py-3">CUSTOMER</th>
                <th className="px-5 py-3">TYPE</th>
                <th className="px-5 py-3 text-right">ORDERS</th>
                <th className="px-5 py-3 text-right">TOTAL SPENT</th>
                <th className="px-5 py-3 text-right">AOV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {TOP_CUSTOMERS.map((c,i) => (
                <tr key={c.name} className="hover:bg-stone-50">
                  <td className="px-5 py-3">
                    <span className={`text-sm font-bold ${i===0?'text-amber-500':i===1?'text-stone-400':i===2?'text-amber-700':'text-stone-400'}`}>#{i+1}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-bold text-xs">{c.name[0]}</div>
                      <div>
                        <p className="text-sm font-semibold text-stone-800">{c.name}</p>
                        <p className="text-xs text-stone-400">{c.city}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">{c.type}</span>
                  </td>
                  <td className="px-5 py-3 text-right text-sm font-semibold text-stone-700">{c.orders}</td>
                  <td className="px-5 py-3 text-right font-bold text-stone-900">₹{c.spent.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3 text-right text-sm text-stone-600">₹{Math.round(c.spent/c.orders).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
