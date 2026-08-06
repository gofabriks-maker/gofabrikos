'use client'
import { useEffect, useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import {
  IndianRupee, ShoppingBag, Users, Clock, TrendingUp,
  Package, AlertTriangle, Layers, FileBarChart, Plus,
  RefreshCw, ArrowUpRight
} from 'lucide-react'
import Link from 'next/link'

type Stats = {
  today:    { revenue: number; orders: number }
  month:    { revenue: number; orders: number; avgOrderValue: number }
  totals:   { customers: number; products: number; pendingOrders: number; lowStockItems: number }
  recentOrders: any[]
  topProducts:  any[]
  revenueChart: any[]
  statusBreakdown: Record<string, number>
}

const STATUS_COLORS: Record<string, string> = {
  pending:   '#f59e0b',
  confirmed: '#3b82f6',
  processing:'#8b5cf6',
  shipped:   '#06b6d4',
  delivered: '#22c55e',
  cancelled: '#ef4444',
}

const PIE_COLORS = ['#f59e0b','#3b82f6','#8b5cf6','#22c55e','#ef4444']

// Fallback data shown while real data loads or if DB is empty
const FALLBACK_CHART = [
  { date:'Mon', revenue:28400, orders:18 },
  { date:'Tue', revenue:32100, orders:22 },
  { date:'Wed', revenue:24800, orders:16 },
  { date:'Thu', revenue:41200, orders:28 },
  { date:'Fri', revenue:38700, orders:25 },
  { date:'Sat', revenue:52300, orders:34 },
  { date:'Sun', revenue:45900, orders:30 },
]

function fmt(n: number) {
  if (n >= 100000) return `₹${(n/100000).toFixed(1)}L`
  if (n >= 1000)   return `₹${(n/1000).toFixed(1)}K`
  return `₹${n.toLocaleString('en-IN')}`
}

export default function DashboardPage() {
  const [stats, setStats]       = useState<Stats|null>(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string|null>(null)
  const [chartRange, setRange]  = useState<'7d'|'30d'>('7d')
  const [lastRefresh, setLast]  = useState(new Date())

  async function fetchStats() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/stats', { cache: 'no-store' })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setStats(data)
      setLast(new Date())
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStats() }, [])

  const kpis = stats ? [
    { label:'Today\'s Revenue',  value: fmt(stats.today.revenue),             sub:`${stats.today.orders} orders today`,    icon: IndianRupee, color:'bg-rose-50 text-rose-600' },
    { label:'Monthly Revenue',   value: fmt(stats.month.revenue),             sub:`${stats.month.orders} orders this month`, icon: TrendingUp,  color:'bg-green-50 text-green-600' },
    { label:'Total Customers',   value: stats.totals.customers.toLocaleString('en-IN'), sub:'Registered customers',    icon: Users,       color:'bg-blue-50 text-blue-600' },
    { label:'Pending Orders',    value: stats.totals.pendingOrders.toString(), sub:'Needs action',                      icon: Clock,       color:'bg-amber-50 text-amber-600' },
    { label:'Avg Order Value',   value: `₹${stats.month.avgOrderValue.toLocaleString('en-IN')}`, sub:'This month',    icon: ShoppingBag, color:'bg-purple-50 text-purple-600' },
    { label:'Active Products',   value: stats.totals.products.toLocaleString('en-IN'), sub:'Listed on store',          icon: Layers,      color:'bg-teal-50 text-teal-600' },
    { label:'Low Stock Items',   value: stats.totals.lowStockItems.toString(), sub:'Below threshold',                  icon: AlertTriangle,color:'bg-orange-50 text-orange-600' },
    { label:'Today\'s Orders',   value: stats.today.orders.toString(),        sub:'Orders placed today',               icon: Package,     color:'bg-stone-50 text-stone-600' },
  ] : []

  const chartData = stats?.revenueChart?.length
    ? stats.revenueChart.map(d => ({ ...d, date: d.date?.slice(5) }))
    : FALLBACK_CHART

  const pieData = stats ? Object.entries(stats.statusBreakdown).map(([name, value]) => ({ name, value })) : []

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Dashboard</h2>
          <p className="text-xs text-stone-400 mt-0.5">
            {loading ? 'Loading live data…' : error ? '⚠️ Using cached data' : `Live · refreshed ${lastRefresh.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}`}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchStats} disabled={loading}
            className="flex items-center gap-1.5 text-sm border border-stone-200 bg-white text-stone-600 px-3 py-2 rounded-xl hover:bg-stone-50 disabled:opacity-50">
            <RefreshCw size={13} className={loading?'animate-spin':''}/> Refresh
          </button>
          <Link href="/admin/products/add"
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold px-4 py-2 rounded-xl">
            <Plus size={14}/>Add Product
          </Link>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700 flex items-center gap-2">
          <AlertTriangle size={14}/>
          Database not yet set up — showing demo data. Run the Phase 1 SQL schema in Supabase to see live data.
          <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="underline font-semibold ml-auto">Open Supabase →</a>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {loading ? (
          Array.from({length:8}).map((_,i)=>(
            <div key={i} className="bg-white rounded-xl border border-stone-200 p-4 animate-pulse">
              <div className="h-7 bg-stone-100 rounded w-24 mb-2"/>
              <div className="h-3 bg-stone-100 rounded w-32"/>
            </div>
          ))
        ) : (
          kpis.map(k=>(
            <div key={k.label} className="bg-white rounded-xl border border-stone-200 p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${k.color}`}>
                  <k.icon size={16}/>
                </div>
              </div>
              <p className="text-2xl font-bold text-stone-900">{k.value}</p>
              <p className="text-xs font-semibold text-stone-500 mt-0.5">{k.label}</p>
              <p className="text-xs text-stone-400">{k.sub}</p>
            </div>
          ))
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-5">
        {/* Revenue Chart */}
        <div className="col-span-2 bg-white rounded-xl border border-stone-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-stone-900">Revenue Trend</h3>
            <div className="flex gap-1 bg-stone-100 p-0.5 rounded-lg">
              {(['7d','30d'] as const).map(r=>(
                <button key={r} onClick={()=>setRange(r)}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors
                    ${chartRange===r?'bg-white text-stone-800 shadow-sm':'text-stone-400'}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} margin={{top:5,right:5,left:-15,bottom:0}}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#e11d48" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="date" tick={{fontSize:10,fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:'#94a3b8'}} axisLine={false} tickLine={false} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/>
              <Tooltip contentStyle={{borderRadius:10,border:'1px solid #e2e8f0',fontSize:12}}
                formatter={(v:number)=>[`₹${v.toLocaleString('en-IN')}`,'']}/>
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#e11d48" strokeWidth={2.5}
                fill="url(#revGrad)" dot={{r:3,fill:'#e11d48'}}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Pie */}
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <h3 className="font-bold text-stone-900 mb-4">Order Status</h3>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65}
                    dataKey="value" paddingAngle={3}>
                    {pieData.map((_,i)=><Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}/>)}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius:10,fontSize:12}}/>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {pieData.map((d,i)=>(
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{background:PIE_COLORS[i % PIE_COLORS.length]}}/>
                      <span className="text-stone-600 capitalize">{d.name}</span>
                    </div>
                    <span className="font-bold text-stone-700">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-40 flex items-center justify-center text-stone-400 text-xs text-center">
              <div><Package size={24} className="mx-auto mb-2 opacity-30"/>No orders yet</div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-3 gap-5">
        {/* Recent Orders */}
        <div className="col-span-2 bg-white rounded-xl border border-stone-200">
          <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
            <h3 className="font-bold text-stone-900">Recent Orders</h3>
            <Link href="/admin/orders" className="text-xs text-rose-600 hover:underline flex items-center gap-1">
              View all <ArrowUpRight size={11}/>
            </Link>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">
              {Array.from({length:4}).map((_,i)=>(
                <div key={i} className="animate-pulse flex gap-3">
                  <div className="h-4 bg-stone-100 rounded flex-1"/>
                  <div className="h-4 bg-stone-100 rounded w-20"/>
                </div>
              ))}
            </div>
          ) : stats?.recentOrders?.length ? (
            <table className="w-full">
              <thead>
                <tr className="text-xs font-semibold text-stone-400 border-b border-stone-50">
                  <th className="px-5 py-2.5 text-left">ORDER</th>
                  <th className="px-5 py-2.5 text-left">CUSTOMER</th>
                  <th className="px-5 py-2.5 text-right">AMOUNT</th>
                  <th className="px-5 py-2.5 text-left">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {stats.recentOrders.map((o:any)=>(
                  <tr key={o.orderNumber} className="hover:bg-stone-50">
                    <td className="px-5 py-3 font-mono text-xs font-bold text-rose-600">{o.orderNumber}</td>
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-stone-800">{o.customerName}</p>
                      <p className="text-xs text-stone-400">{o.city}</p>
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-stone-900">₹{o.amount?.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full capitalize"
                        style={{background:`${STATUS_COLORS[o.status]}20`,color:STATUS_COLORS[o.status]}}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-10 text-center text-stone-400 text-sm">
              <ShoppingBag size={24} className="mx-auto mb-2 opacity-30"/>No orders yet
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <h3 className="font-bold text-stone-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label:'Add Product',   href:'/admin/products/add', icon: Plus,        color:'bg-rose-50 text-rose-600' },
              { label:'View Orders',   href:'/admin/orders',       icon: ShoppingBag,  color:'bg-blue-50 text-blue-600' },
              { label:'Inventory',     href:'/admin/inventory',    icon: Layers,       color:'bg-amber-50 text-amber-600' },
              { label:'Customers',     href:'/admin/customers',    icon: Users,        color:'bg-green-50 text-green-600' },
              { label:'Invoices',      href:'/admin/invoices',     icon: FileBarChart, color:'bg-purple-50 text-purple-600' },
              { label:'Reports',       href:'/admin/reports',      icon: TrendingUp,   color:'bg-teal-50 text-teal-600' },
            ].map(a=>(
              <Link key={a.label} href={a.href}
                className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-stone-100 hover:border-stone-200 hover:shadow-sm transition-all text-center">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${a.color}`}>
                  <a.icon size={16}/>
                </div>
                <span className="text-xs font-semibold text-stone-700">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
