'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import {
  TrendingUp, TrendingDown, ShoppingBag, Package, Users, IndianRupee,
  Clock, CheckCircle, AlertTriangle, RotateCcw, ArrowUpRight,
  Truck, Star, Zap, Activity, Eye, Plus, RefreshCw, Layers, FileBarChart
} from 'lucide-react'

// ── Mock data (swap with Supabase queries) ─────────────────────────────────
const REVENUE_7D = [
  { day: 'Mon', revenue: 12400, orders: 8 },
  { day: 'Tue', revenue: 8900,  orders: 6 },
  { day: 'Wed', revenue: 19800, orders: 14 },
  { day: 'Thu', revenue: 15200, orders: 10 },
  { day: 'Fri', revenue: 22100, orders: 16 },
  { day: 'Sat', revenue: 31400, orders: 22 },
  { day: 'Sun', revenue: 28700, orders: 19 },
]

const REVENUE_30D = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  revenue: Math.floor(Math.random() * 30000) + 8000,
  orders:  Math.floor(Math.random() * 20) + 5,
}))

const ORDER_STATUS = [
  { name: 'Delivered',    value: 142, color: '#22c55e' },
  { name: 'Shipped',      value: 38,  color: '#3b82f6' },
  { name: 'Processing',   value: 24,  color: '#f59e0b' },
  { name: 'Pending',      value: 12,  color: '#f97316' },
  { name: 'Cancelled',    value: 8,   color: '#ef4444' },
  { name: 'Returned',     value: 5,   color: '#8b5cf6' },
]

const TOP_FABRICS = [
  { name: 'Banarasi Silk Brocade',    category: 'Designer Sarees', sold: 284, revenue: 142000, stock: 42 },
  { name: 'Pure Cotton Ikat Print',   category: 'Kurti Fabrics',   sold: 198, revenue: 49500,  stock: 87 },
  { name: 'Georgette Floral Digital', category: 'Lehenga Fabrics', sold: 176, revenue: 79200,  stock: 23 },
  { name: 'Rayon Solid Plain',        category: 'Plain Fabrics',   sold: 154, revenue: 30800,  stock: 112 },
  { name: 'Velvet Embroidery Kurti',  category: 'Blouse Fabrics',  sold: 132, revenue: 79200,  stock: 8 },
]

const RECENT_ORDERS = [
  { id: 'GF-2026-0024', customer: 'Ananya Reddy',   amount: 3850,  status: 'delivered',  date: '5 Aug' },
  { id: 'GF-2026-0023', customer: 'Priya Sharma',   amount: 1299,  status: 'shipped',    date: '5 Aug' },
  { id: 'GF-2026-0022', customer: 'Meena Patel',    amount: 5600,  status: 'processing', date: '4 Aug' },
  { id: 'GF-2026-0021', customer: 'Lakshmi Devi',   amount: 2400,  status: 'confirmed',  date: '4 Aug' },
  { id: 'GF-2026-0020', customer: 'Sunita Kumari',  amount: 780,   status: 'pending',    date: '3 Aug' },
]

const LOW_STOCK = [
  { name: 'Velvet Embroidery Kurti',  available: 8,  threshold: 10 },
  { name: 'Banarasi Silk Dupatta',    available: 5,  threshold: 10 },
  { name: 'Organza Mirror Work',      available: 12, threshold: 15 },
  { name: 'Chanderi Cotton Blend',    available: 3,  threshold: 10 },
]

// ── Sub-components ─────────────────────────────────────────────────────────

function KpiCard({
  label, value, subtext, icon: Icon, trend, color = 'rose', href,
}: {
  label: string; value: string; subtext?: string
  icon: React.ElementType; trend?: number; color?: string; href?: string
}) {
  const colors: Record<string, string> = {
    rose:   'bg-rose-50 text-rose-600',
    blue:   'bg-blue-50 text-blue-600',
    green:  'bg-green-50 text-green-600',
    amber:  'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  }
  const inner = (
    <div className="bg-white rounded-xl border border-stone-200 p-5 hover:shadow-md transition-shadow cursor-default">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon size={18} />
        </div>
        {trend !== undefined && (
          <span className={`flex items-center gap-1 text-xs font-semibold
            ${trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-stone-900 mb-0.5">{value}</p>
      <p className="text-xs font-semibold text-stone-500">{label}</p>
      {subtext && <p className="text-xs text-stone-400 mt-0.5">{subtext}</p>}
    </div>
  )
  return href ? <Link href={href}>{inner}</Link> : inner
}

const STATUS_STYLES: Record<string, string> = {
  delivered:  'bg-green-100 text-green-700',
  shipped:    'bg-blue-100 text-blue-700',
  processing: 'bg-amber-100 text-amber-700',
  confirmed:  'bg-cyan-100 text-cyan-700',
  pending:    'bg-orange-100 text-orange-700',
  cancelled:  'bg-red-100 text-red-700',
  returned:   'bg-purple-100 text-purple-700',
}

// ── Main Dashboard ─────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [range, setRange] = useState<'7d' | '30d'>('7d')
  const chartData = range === '7d' ? REVENUE_7D : REVENUE_30D

  const totalRevenue   = chartData.reduce((s, d) => s + d.revenue, 0)
  const totalOrders    = chartData.reduce((s, d) => s + d.orders, 0)

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Executive Dashboard</h2>
          <p className="text-sm text-stone-500">Thursday, 6 August 2026 · GoFabrikos, Guntur AP</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/products/new"
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
            <Plus size={15} />Add Product
          </Link>
          <button className="flex items-center gap-2 bg-white border border-stone-200 text-stone-600 text-sm px-3 py-2 rounded-xl hover:bg-stone-50">
            <RefreshCw size={14} />Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
        <KpiCard label="Today's Revenue" value="₹28,700" subtext="vs ₹22,100 yesterday"
          icon={IndianRupee} trend={29.7} color="rose" />
        <KpiCard label="Today's Orders"  value="19"       subtext="vs 16 yesterday"
          icon={ShoppingBag} trend={18.8} color="blue" href="/admin/orders" />
        <KpiCard label="Total Customers" value="1,842"    subtext="+12 this week"
          icon={Users} trend={8.4} color="green" href="/admin/customers" />
        <KpiCard label="Pending Orders"  value="12"       subtext="Needs attention"
          icon={Clock} trend={-5} color="amber" href="/admin/orders" />
        <KpiCard label="Monthly Revenue" value="₹4.28L"   subtext="Aug 2026"
          icon={TrendingUp} trend={12.3} color="purple" />
        <KpiCard label="Avg Order Value" value="₹1,510"   subtext="Last 30 days"
          icon={Activity} trend={3.1} color="orange" />
        <KpiCard label="Low Stock Items" value="4"         subtext="Below threshold"
          icon={AlertTriangle} color="amber" href="/admin/inventory" />
        <KpiCard label="Total Products"  value="13"        subtext="10 active, 3 draft"
          icon={Package} color="rose" href="/admin/products" />
      </div>

      {/* Revenue Chart + Order Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-stone-900">Revenue Trend</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                ₹{(totalRevenue / 1000).toFixed(1)}K · {totalOrders} orders
              </p>
            </div>
            <div className="flex rounded-xl border border-stone-200 overflow-hidden text-xs">
              {(['7d', '30d'] as const).map(r => (
                <button key={r} onClick={() => setRange(r)}
                  className={`px-3 py-1.5 font-medium transition-colors
                    ${range === r ? 'bg-rose-600 text-white' : 'text-stone-500 hover:bg-stone-50'}`}>
                  {r === '7d' ? '7 Days' : '30 Days'}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#e11d48" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']}
                contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="#e11d48" strokeWidth={2}
                fill="url(#revGrad)" dot={false} activeDot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <h3 className="font-bold text-stone-900 mb-1">Order Status</h3>
          <p className="text-xs text-stone-500 mb-4">229 total orders</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={ORDER_STATUS} cx="50%" cy="50%" innerRadius={50} outerRadius={70}
                paddingAngle={2} dataKey="value">
                {ORDER_STATUS.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number, name: string) => [v, name]}
                contentStyle={{ borderRadius: 10, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {ORDER_STATUS.map(s => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-stone-600">{s.name}</span>
                </div>
                <span className="font-semibold text-stone-700">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Fabrics + Recent Orders + Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Top Fabrics */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-stone-900">Top Selling Fabrics</h3>
            <Link href="/admin/reports" className="text-xs text-rose-600 flex items-center gap-1 hover:underline">
              View Report <ArrowUpRight size={12} />
            </Link>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-stone-400 border-b border-stone-100">
                <th className="pb-2">Product</th>
                <th className="pb-2 text-right">Sold</th>
                <th className="pb-2 text-right">Revenue</th>
                <th className="pb-2 text-right">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {TOP_FABRICS.map((f, i) => (
                <tr key={i} className="group hover:bg-stone-50 transition-colors">
                  <td className="py-2.5 pr-3">
                    <p className="text-sm font-medium text-stone-800 truncate max-w-[200px]">{f.name}</p>
                    <p className="text-xs text-stone-400">{f.category}</p>
                  </td>
                  <td className="py-2.5 text-right text-sm text-stone-700 font-medium">{f.sold}m</td>
                  <td className="py-2.5 text-right text-sm text-stone-700 font-medium">
                    ₹{(f.revenue / 1000).toFixed(0)}K
                  </td>
                  <td className="py-2.5 text-right">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                      ${f.stock < 15 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {f.stock}m
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right column */}
        <div className="space-y-4">

          {/* Recent Orders */}
          <div className="bg-white rounded-xl border border-stone-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-stone-900 text-sm">Recent Orders</h3>
              <Link href="/admin/orders" className="text-xs text-rose-600 hover:underline flex items-center gap-1">
                All <ArrowUpRight size={11} />
              </Link>
            </div>
            <div className="space-y-2.5">
              {RECENT_ORDERS.map(o => (
                <Link key={o.id} href={`/admin/orders/${o.id}`}
                  className="flex items-center justify-between hover:bg-stone-50 rounded-lg px-2 py-1.5 -mx-2 transition-colors">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-stone-700 truncate">{o.customer}</p>
                    <p className="text-xs text-stone-400">{o.id} · {o.date}</p>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <p className="text-xs font-bold text-stone-800">₹{o.amount.toLocaleString('en-IN')}</p>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full capitalize ${STATUS_STYLES[o.status] || ''}`}>
                      {o.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white rounded-xl border border-amber-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={14} className="text-amber-500" />
              <h3 className="font-bold text-stone-900 text-sm">Low Stock Alert</h3>
            </div>
            <div className="space-y-2">
              {LOW_STOCK.map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <p className="text-xs text-stone-700 truncate max-w-[140px]">{s.name}</p>
                  <span className="text-xs font-bold text-amber-600">{s.available}m left</span>
                </div>
              ))}
            </div>
            <Link href="/admin/inventory"
              className="mt-3 block text-center text-xs text-amber-600 font-semibold hover:underline">
              Manage Inventory →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-stone-200 p-5">
        <h3 className="font-bold text-stone-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { label: 'Add Product',    href: '/admin/products/new', icon: Package,    color: 'bg-rose-50 text-rose-600' },
            { label: 'View Orders',    href: '/admin/orders',       icon: ShoppingBag, color: 'bg-blue-50 text-blue-600' },
            { label: 'Inventory',      href: '/admin/inventory',    icon: Layers,     color: 'bg-green-50 text-green-600' },
            { label: 'Customers',      href: '/admin/customers',    icon: Users,      color: 'bg-purple-50 text-purple-600' },
            { label: 'Create Invoice', href: '/admin/invoices',     icon: IndianRupee, color: 'bg-amber-50 text-amber-600' },
            { label: 'Reports',        href: '/admin/reports',      icon: TrendingUp, color: 'bg-orange-50 text-orange-600' },
          ].map(a => (
            <Link key={a.href} href={a.href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-stone-100 hover:border-stone-300 hover:shadow-sm transition-all">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.color}`}>
                <a.icon size={18} />
              </div>
              <span className="text-xs font-semibold text-stone-700 text-center">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}
