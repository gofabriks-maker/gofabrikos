'use client'
import { useState } from 'react'
import {
  Store, CreditCard, Truck, Bell, Shield, Globe, Save,
  Eye, EyeOff, CheckCircle, Edit2, Mail, Phone, MapPin,
  Building, Tag, IndianRupee, Package, Percent
} from 'lucide-react'

const TABS = [
  { key:'store',    label:'Store Details',   icon: Store },
  { key:'shipping', label:'Shipping',        icon: Truck },
  { key:'payment',  label:'Payment',         icon: CreditCard },
  { key:'gst',      label:'GST & Finance',   icon: IndianRupee },
  { key:'notify',   label:'Notifications',   icon: Bell },
  { key:'security', label:'Security',        icon: Shield },
]

export default function SettingsPage() {
  const [tab, setTab] = useState('store')
  const [saved, setSaved] = useState(false)
  const [showKey, setShowKey] = useState(false)

  const [store, setStore] = useState({
    name:       'GoFabrikos',
    tagline:    "India's Finest Fabrics",
    email:      'care@gofabrikos.com',
    phone:      '+91 9000000000',
    address:    '3rd Floor, 346, Sri Vasavi WCS, Mangalagiri Road, Guntur – 522001, AP',
    website:    'https://www.gofabrikos.com',
    currency:   'INR',
    timezone:   'Asia/Kolkata',
    proprietor: 'Lakshmi Sowjanya Aaki',
  })

  const [shipping, setShipping] = useState({
    freeShippingAbove: '999',
    codCharge:         '0',
    defaultCourier:    'Delhivery',
    processingDays:    '2',
    codEnabled:        true,
    freeShippingEnabled: true,
  })

  const [gst, setGst] = useState({
    gstin:        '37DOEPA8029G1Z1',
    defaultRate:  '5',
    invoicePrefix:'GF-INV',
    orderPrefix:  'GF',
    panNumber:    '',
    gstRegDate:   '2024-10-23',
    gstStatus:    'Active · Regular Taxpayer',
  })

  const [notify, setNotify] = useState({
    newOrder:     true,
    lowStock:     true,
    newEnquiry:   true,
    orderEmail:   true,
    orderSms:     false,
    orderWhatsapp:true,
    dailyReport:  true,
  })

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const Field = ({ label, value, onChange, type='text', disabled=false, mono=false }: {
    label:string; value:string; onChange?:(v:string)=>void; type?:string; disabled?:boolean; mono?:boolean
  }) => (
    <div>
      <label className="block text-xs font-semibold text-stone-500 mb-1.5">{label}</label>
      <input type={type} value={value} disabled={disabled}
        onChange={e => onChange?.(e.target.value)}
        className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:border-rose-400
          ${disabled ? 'bg-stone-50 text-stone-500 cursor-default' : 'bg-white border-stone-200'}
          ${mono ? 'font-mono' : ''}`} />
    </div>
  )

  const Toggle = ({ label, desc, value, onChange }: { label:string; desc?:string; value:boolean; onChange:(v:boolean)=>void }) => (
    <div className="flex items-center justify-between py-3 border-b border-stone-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-stone-800">{label}</p>
        {desc && <p className="text-xs text-stone-400 mt-0.5">{desc}</p>}
      </div>
      <button onClick={()=>onChange(!value)}
        className={`w-11 h-6 rounded-full transition-colors relative ${value?'bg-rose-600':'bg-stone-200'}`}>
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value?'translate-x-5':'translate-x-0.5'}`} />
      </button>
    </div>
  )

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-xl font-bold text-stone-900">Settings</h2>
          <p className="text-sm text-stone-500">Manage your store configuration</p></div>
        <button onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors
            ${saved ? 'bg-green-600 text-white' : 'bg-rose-600 hover:bg-rose-700 text-white'}`}>
          {saved ? <><CheckCircle size={15}/>Saved!</> : <><Save size={15}/>Save Changes</>}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-48 shrink-0">
          <nav className="space-y-1">
            {TABS.map(t => (
              <button key={t.key} onClick={()=>setTab(t.key)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left
                  ${tab===t.key?'bg-rose-600 text-white':'text-stone-600 hover:bg-stone-100'}`}>
                <t.icon size={16} />{t.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-2xl border border-stone-200 p-6">

          {/* Store Details */}
          {tab === 'store' && (
            <div className="space-y-5">
              <h3 className="font-bold text-stone-900 text-base">Store Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Store Name"   value={store.name}       onChange={v=>setStore({...store,name:v})} />
                <Field label="Tagline"      value={store.tagline}    onChange={v=>setStore({...store,tagline:v})} />
                <Field label="Proprietor"   value={store.proprietor} onChange={v=>setStore({...store,proprietor:v})} />
                <Field label="Website URL"  value={store.website}    onChange={v=>setStore({...store,website:v})} />
                <Field label="Email"        value={store.email}      onChange={v=>setStore({...store,email:v})} type="email" />
                <Field label="Phone"        value={store.phone}      onChange={v=>setStore({...store,phone:v})} />
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-stone-500 mb-1.5">Address</label>
                  <textarea value={store.address} onChange={e=>setStore({...store,address:e.target.value})} rows={2}
                    className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400 resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 mb-1.5">Currency</label>
                  <select value={store.currency} onChange={e=>setStore({...store,currency:e.target.value})}
                    className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400">
                    <option value="INR">INR (₹) — Indian Rupee</option>
                    <option value="USD">USD ($) — US Dollar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 mb-1.5">Timezone</label>
                  <select value={store.timezone} onChange={e=>setStore({...store,timezone:e.target.value})}
                    className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400">
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Shipping */}
          {tab === 'shipping' && (
            <div className="space-y-5">
              <h3 className="font-bold text-stone-900 text-base">Shipping Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Free Shipping Above (₹)" value={shipping.freeShippingAbove} onChange={v=>setShipping({...shipping,freeShippingAbove:v})} />
                <Field label="COD Charge (₹)"          value={shipping.codCharge}         onChange={v=>setShipping({...shipping,codCharge:v})} />
                <Field label="Default Courier"          value={shipping.defaultCourier}    onChange={v=>setShipping({...shipping,defaultCourier:v})} />
                <Field label="Processing Days"          value={shipping.processingDays}    onChange={v=>setShipping({...shipping,processingDays:v})} />
              </div>
              <div className="border border-stone-100 rounded-xl p-4">
                <Toggle label="Enable COD"           desc="Cash on Delivery option at checkout"    value={shipping.codEnabled}        onChange={v=>setShipping({...shipping,codEnabled:v})} />
                <Toggle label="Free Shipping Banner"  desc="Show free shipping above threshold"     value={shipping.freeShippingEnabled} onChange={v=>setShipping({...shipping,freeShippingEnabled:v})} />
              </div>
            </div>
          )}

          {/* Payment */}
          {tab === 'payment' && (
            <div className="space-y-5">
              <h3 className="font-bold text-stone-900 text-base">Payment Settings</h3>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle size={16} className="text-green-600 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-800">Razorpay Connected</p>
                  <p className="text-xs text-green-600">Live mode · Keys configured in Vercel environment variables</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-500 mb-1.5">Razorpay Key ID (Live)</label>
                  <div className="relative">
                    <input type={showKey?'text':'password'} value="rzp_live_••••••••••••••••"
                      disabled className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl bg-stone-50 font-mono pr-10" />
                    <button onClick={()=>setShowKey(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
                      {showKey?<EyeOff size={15}/>:<Eye size={15}/>}
                    </button>
                  </div>
                  <p className="text-xs text-stone-400 mt-1">Managed via Vercel Environment Variables. Edit there to change.</p>
                </div>
              </div>
              <div className="border border-stone-100 rounded-xl p-4">
                <p className="text-xs font-bold text-stone-400 mb-3">ENABLED PAYMENT METHODS</p>
                {['UPI / QR Code','Credit / Debit Card','Net Banking','Wallet (Paytm, PhonePe)','Cash on Delivery'].map(m => (
                  <div key={m} className="flex items-center justify-between py-2.5 border-b border-stone-50 last:border-0">
                    <span className="text-sm text-stone-700">{m}</span>
                    <CheckCircle size={16} className="text-green-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GST & Finance */}
          {tab === 'gst' && (
            <div className="space-y-5">
              <h3 className="font-bold text-stone-900 text-base">GST & Finance Settings</h3>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-xs font-bold text-green-700 mb-1">GST STATUS</p>
                <p className="text-sm font-semibold text-green-800">{gst.gstStatus}</p>
                <p className="text-xs text-green-600">Registered: {gst.gstRegDate} · Aadhaar Authenticated</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="GSTIN"               value={gst.gstin}        onChange={v=>setGst({...gst,gstin:v})} mono />
                <Field label="Default GST Rate (%)"value={gst.defaultRate}  onChange={v=>setGst({...gst,defaultRate:v})} />
                <Field label="Invoice Number Prefix"value={gst.invoicePrefix}onChange={v=>setGst({...gst,invoicePrefix:v})} />
                <Field label="Order Number Prefix"  value={gst.orderPrefix}  onChange={v=>setGst({...gst,orderPrefix:v})} />
                <Field label="GST Registration Date"value={gst.gstRegDate}   disabled />
                <Field label="GST Status"           value={gst.gstStatus}    disabled />
              </div>
            </div>
          )}

          {/* Notifications */}
          {tab === 'notify' && (
            <div className="space-y-5">
              <h3 className="font-bold text-stone-900 text-base">Notification Settings</h3>
              <div>
                <p className="text-xs font-bold text-stone-400 mb-2">ADMIN ALERTS</p>
                <div className="border border-stone-100 rounded-xl p-4">
                  <Toggle label="New Order Alert"      desc="Get notified on every new order"       value={notify.newOrder}     onChange={v=>setNotify({...notify,newOrder:v})} />
                  <Toggle label="Low Stock Alert"      desc="Alert when stock goes below threshold"  value={notify.lowStock}     onChange={v=>setNotify({...notify,lowStock:v})} />
                  <Toggle label="New B2B Enquiry"      desc="Alert on new wholesale enquiries"       value={notify.newEnquiry}   onChange={v=>setNotify({...notify,newEnquiry:v})} />
                  <Toggle label="Daily Summary Report" desc="Receive daily sales report at 9 PM"    value={notify.dailyReport}  onChange={v=>setNotify({...notify,dailyReport:v})} />
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-stone-400 mb-2">CUSTOMER NOTIFICATIONS</p>
                <div className="border border-stone-100 rounded-xl p-4">
                  <Toggle label="Order Confirmation Email"    desc="Send email on order placement"      value={notify.orderEmail}    onChange={v=>setNotify({...notify,orderEmail:v})} />
                  <Toggle label="WhatsApp Order Updates"      desc="Send WhatsApp on status changes"    value={notify.orderWhatsapp} onChange={v=>setNotify({...notify,orderWhatsapp:v})} />
                  <Toggle label="SMS Notifications"           desc="Send SMS for delivery updates"      value={notify.orderSms}      onChange={v=>setNotify({...notify,orderSms:v})} />
                </div>
              </div>
            </div>
          )}

          {/* Security */}
          {tab === 'security' && (
            <div className="space-y-5">
              <h3 className="font-bold text-stone-900 text-base">Security Settings</h3>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-amber-800">Admin Password</p>
                <p className="text-xs text-amber-600 mt-0.5">Admin password is managed via Vercel Environment Variables (ADMIN_PASSWORD). To change it, update the variable in Vercel and redeploy.</p>
                <a href="https://vercel.com" target="_blank" rel="noreferrer"
                  className="inline-block mt-2 text-xs font-semibold text-amber-700 underline">
                  Open Vercel Settings →
                </a>
              </div>
              <div className="border border-stone-100 rounded-xl p-4 space-y-3">
                <p className="text-xs font-bold text-stone-400">CURRENT SECURITY CONFIG</p>
                {[
                  ['Session Duration',    '8 hours'],
                  ['Cookie Type',         'httpOnly, Secure, SameSite Strict'],
                  ['Brute Force Protection','1s delay on wrong password'],
                  ['Admin Login URL',     '/admin/login'],
                  ['Protected Routes',    '/admin/* (all pages)'],
                ].map(([k,v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-stone-500">{k}</span>
                    <span className="text-stone-800 font-medium text-right max-w-[220px]">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
