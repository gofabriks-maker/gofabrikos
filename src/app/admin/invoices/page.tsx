'use client'
import { useState } from 'react'
import {
  FileText, Download, Search, Eye, Printer,
  CheckCircle, Clock, XCircle, Send, IndianRupee, Filter
} from 'lucide-react'

type Invoice = {
  id: string
  number: string
  orderId: string
  customer: string
  phone: string
  city: string
  date: string
  dueDate: string
  amount: number
  gst: number
  total: number
  status: 'paid' | 'pending' | 'overdue' | 'cancelled'
  paymentMode: string
  gstin?: string
}

const INVOICES: Invoice[] = [
  { id:'1',  number:'GF-INV-00142', orderId:'GF-2024', customer:'Fatima Shaikh',   phone:'9876543210', city:'Mumbai',     date:'2026-08-05', dueDate:'2026-08-12', amount:12800, gst:640,  total:13440, status:'paid',      paymentMode:'Razorpay UPI',   gstin:'27AXXXX1234A1Z5' },
  { id:'2',  number:'GF-INV-00141', orderId:'GF-2023', customer:'Rekha Nair',      phone:'9845001122', city:'Kochi',      date:'2026-08-04', dueDate:'2026-08-11', amount:5400,  gst:270,  total:5670,  status:'paid',      paymentMode:'Net Banking' },
  { id:'3',  number:'GF-INV-00140', orderId:'GF-2022', customer:'Meena Patel',     phone:'9988776655', city:'Surat',      date:'2026-08-03', dueDate:'2026-08-10', amount:3200,  gst:160,  total:3360,  status:'pending',   paymentMode:'COD' },
  { id:'4',  number:'GF-INV-00139', orderId:'GF-2021', customer:'Kavitha Rao',     phone:'8012345678', city:'Guntur',     date:'2026-08-02', dueDate:'2026-08-09', amount:8900,  gst:445,  total:9345,  status:'pending',   paymentMode:'Razorpay Card' },
  { id:'5',  number:'GF-INV-00138', orderId:'GF-2020', customer:'Sunita Verma',    phone:'7890123456', city:'Jaipur',     date:'2026-08-01', dueDate:'2026-08-08', amount:2100,  gst:105,  total:2205,  status:'overdue',   paymentMode:'COD' },
  { id:'6',  number:'GF-INV-00137', orderId:'GF-2019', customer:'Priya Sharma',    phone:'9012345678', city:'Delhi',      date:'2026-07-31', dueDate:'2026-08-07', amount:15600, gst:1872, total:17472, status:'paid',      paymentMode:'Razorpay UPI',   gstin:'07BXXXX5678B2Z3' },
  { id:'7',  number:'GF-INV-00136', orderId:'GF-2018', customer:'Anitha Reddy',    phone:'9123456789', city:'Hyderabad',  date:'2026-07-30', dueDate:'2026-08-06', amount:4500,  gst:540,  total:5040,  status:'overdue',   paymentMode:'Net Banking' },
  { id:'8',  number:'GF-INV-00135', orderId:'GF-2017', customer:'Lakshmi Devi',    phone:'9234567890', city:'Chennai',    date:'2026-07-28', dueDate:'2026-08-04', amount:6700,  gst:335,  total:7035,  status:'paid',      paymentMode:'Razorpay Card' },
  { id:'9',  number:'GF-INV-00134', orderId:'GF-2016', customer:'Deepa Krishna',   phone:'9345678901', city:'Bengaluru',  date:'2026-07-25', dueDate:'2026-08-01', amount:9200,  gst:1104, total:10304, status:'paid',      paymentMode:'Razorpay UPI',   gstin:'29CXXXX9012C3Z1' },
  { id:'10', number:'GF-INV-00133', orderId:'GF-2015', customer:'Saritha Nambiar', phone:'9456789012', city:'Kozhikode',  date:'2026-07-20', dueDate:'2026-07-27', amount:1800,  gst:90,   total:1890,  status:'cancelled', paymentMode:'COD' },
]

const STATUS_STYLE: Record<string,string> = {
  paid:      'bg-green-100 text-green-700',
  pending:   'bg-amber-100 text-amber-700',
  overdue:   'bg-red-100 text-red-600',
  cancelled: 'bg-stone-100 text-stone-500',
}
const STATUS_ICON: Record<string,any> = {
  paid: CheckCircle, pending: Clock, overdue: XCircle, cancelled: XCircle,
}

export default function InvoicesPage() {
  const [search, setSearch]       = useState('')
  const [statusF, setStatusF]     = useState('all')
  const [selected, setSelected]   = useState<Invoice|null>(null)

  const filtered = INVOICES.filter(inv => {
    const matchSearch = inv.number.toLowerCase().includes(search.toLowerCase()) ||
                        inv.customer.toLowerCase().includes(search.toLowerCase()) ||
                        inv.orderId.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusF === 'all' || inv.status === statusF
    return matchSearch && matchStatus
  })

  const totals = {
    paid:    INVOICES.filter(i=>i.status==='paid').reduce((s,i)=>s+i.total,0),
    pending: INVOICES.filter(i=>i.status==='pending').reduce((s,i)=>s+i.total,0),
    overdue: INVOICES.filter(i=>i.status==='overdue').reduce((s,i)=>s+i.total,0),
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Invoices</h2>
          <p className="text-sm text-stone-500">GST tax invoices for all orders</p>
        </div>
        <button className="flex items-center gap-2 border border-stone-200 bg-white text-stone-600 text-sm px-3 py-2 rounded-xl hover:bg-stone-50">
          <Download size={14}/>Export All
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-2xl font-bold text-green-600">₹{totals.paid.toLocaleString('en-IN')}</p>
          <p className="text-xs font-semibold text-stone-500 mt-0.5">Collected ({INVOICES.filter(i=>i.status==='paid').length} invoices)</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-2xl font-bold text-amber-600">₹{totals.pending.toLocaleString('en-IN')}</p>
          <p className="text-xs font-semibold text-stone-500 mt-0.5">Pending ({INVOICES.filter(i=>i.status==='pending').length} invoices)</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-2xl font-bold text-red-600">₹{totals.overdue.toLocaleString('en-IN')}</p>
          <p className="text-xs font-semibold text-stone-500 mt-0.5">Overdue ({INVOICES.filter(i=>i.status==='overdue').length} invoices)</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"/>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search invoice, order, customer…"
            className="w-full pl-8 pr-4 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400 bg-white"/>
        </div>
        <select value={statusF} onChange={e=>setStatusF(e.target.value)}
          className="px-3 py-2.5 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none">
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50 text-xs font-semibold text-stone-400 text-left">
              <th className="px-5 py-3">INVOICE #</th>
              <th className="px-5 py-3">CUSTOMER</th>
              <th className="px-5 py-3">DATE</th>
              <th className="px-5 py-3 text-right">AMOUNT</th>
              <th className="px-5 py-3 text-right">GST</th>
              <th className="px-5 py-3 text-right">TOTAL</th>
              <th className="px-5 py-3">STATUS</th>
              <th className="px-5 py-3">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {filtered.map(inv => {
              const Icon = STATUS_ICON[inv.status]
              return (
                <tr key={inv.id} className="hover:bg-stone-50">
                  <td className="px-5 py-3">
                    <div>
                      <p className="font-mono text-xs font-bold text-rose-600">{inv.number}</p>
                      <p className="text-xs text-stone-400">{inv.orderId}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div>
                      <p className="text-sm font-semibold text-stone-800">{inv.customer}</p>
                      <p className="text-xs text-stone-400">{inv.city}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-sm text-stone-600">{inv.date}</p>
                    <p className="text-xs text-stone-400">Due: {inv.dueDate}</p>
                  </td>
                  <td className="px-5 py-3 text-right text-sm text-stone-700">₹{inv.amount.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3 text-right text-sm text-stone-500">₹{inv.gst.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3 text-right font-bold text-stone-900">₹{inv.total.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3">
                    <span className={`flex items-center gap-1 w-fit text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[inv.status]}`}>
                      <Icon size={10}/>{inv.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <button onClick={()=>setSelected(inv)}
                        className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100" title="View"><Eye size={14}/></button>
                      <button className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100" title="Download"><Download size={14}/></button>
                      <button className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100" title="Send"><Send size={14}/></button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-stone-400 text-sm">No invoices found</div>
        )}
      </div>

      {/* Invoice Detail Panel */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end" onClick={()=>setSelected(null)}>
          <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl" onClick={e=>e.stopPropagation()}>
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <div>
                <p className="font-mono font-bold text-rose-600">{selected.number}</p>
                <p className="text-xs text-stone-500">{selected.orderId}</p>
              </div>
              <button onClick={()=>setSelected(null)} className="text-stone-400 hover:text-stone-700 text-lg font-bold">✕</button>
            </div>

            {/* GST Invoice Preview */}
            <div className="p-6 space-y-5">
              {/* Store header */}
              <div className="border-2 border-stone-200 rounded-xl p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-stone-900">GoFabrikos</h3>
                    <p className="text-xs text-stone-500 mt-0.5">3rd Floor, 346, Sri Vasavi WCS,</p>
                    <p className="text-xs text-stone-500">Mangalagiri Road, Guntur – 522001, AP</p>
                    <p className="text-xs text-stone-500">GSTIN: 37DOEPA8029G1Z1</p>
                    <p className="text-xs text-stone-500">care@gofabrikos.com</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-stone-800">TAX INVOICE</p>
                    <p className="text-xs text-stone-500 mt-1">Invoice: {selected.number}</p>
                    <p className="text-xs text-stone-500">Date: {selected.date}</p>
                    <p className="text-xs text-stone-500">Due: {selected.dueDate}</p>
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-4">
                  <p className="text-xs font-bold text-stone-400 mb-1">BILL TO</p>
                  <p className="font-semibold text-stone-800">{selected.customer}</p>
                  <p className="text-xs text-stone-500">{selected.city}</p>
                  <p className="text-xs text-stone-500">{selected.phone}</p>
                  {selected.gstin && <p className="text-xs text-stone-500">GSTIN: {selected.gstin}</p>}
                </div>

                <div className="border-t border-stone-100 mt-4 pt-4">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-stone-400 border-b border-stone-100">
                        <th className="text-left py-1">ITEM</th>
                        <th className="text-right py-1">QTY</th>
                        <th className="text-right py-1">RATE</th>
                        <th className="text-right py-1">AMOUNT</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-stone-700">
                        <td className="py-1.5">Fabric (Order {selected.orderId})</td>
                        <td className="text-right">1</td>
                        <td className="text-right">₹{selected.amount.toLocaleString('en-IN')}</td>
                        <td className="text-right">₹{selected.amount.toLocaleString('en-IN')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="border-t border-stone-100 mt-3 pt-3 space-y-1 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span><span>₹{selected.amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>CGST @ {selected.gst/selected.amount > 0.09 ? '6' : '2.5'}%</span>
                    <span>₹{Math.round(selected.gst/2).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>SGST @ {selected.gst/selected.amount > 0.09 ? '6' : '2.5'}%</span>
                    <span>₹{Math.round(selected.gst/2).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-stone-900 border-t border-stone-100 pt-2 text-sm">
                    <span>TOTAL</span><span>₹{selected.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="border-t border-stone-100 mt-3 pt-3 text-xs text-stone-500">
                  <p>Payment Mode: {selected.paymentMode}</p>
                  <p className="mt-1">Thank you for shopping with GoFabrikos!</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-600 hover:bg-stone-50">
                  <Printer size={14}/>Print
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-sm font-bold text-white">
                  <Download size={14}/>Download PDF
                </button>
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-blue-200 bg-blue-50 text-sm text-blue-700 font-semibold hover:bg-blue-100">
                <Send size={14}/>Email Invoice to Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
