import Link from 'next/link'
import { RotateCcw, Truck, Clock, CheckCircle, XCircle, Phone, AlertCircle } from 'lucide-react'

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-rose-800 tracking-wide">
            Go<span className="text-stone-400 font-light">Fabrikos</span>
          </Link>
          <div className="flex items-center gap-4 text-sm text-stone-600">
            <Link href="/faq" className="hover:text-rose-700">FAQ</Link>
            <Link href="/contact" className="hover:text-rose-700">Contact</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-stone-900 text-white py-12 px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-700 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4">
          <RotateCcw size={13} /> RETURNS & SHIPPING POLICY
        </div>
        <h1 className="text-3xl font-bold mb-2">7-Day Hassle-Free Returns</h1>
        <p className="text-stone-300 max-w-md mx-auto">
          Shop with confidence. If you're not happy, we'll make it right — no questions asked.
        </p>
        <p className="text-stone-400 text-xs mt-3">Last updated: July 2026</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">

        {/* Quick summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: <RotateCcw size={20} className="text-emerald-600" />, title: '7-Day Returns', desc: 'Return within 7 days of delivery', bg: 'bg-emerald-50 border-emerald-200' },
            { icon: <Truck size={20} className="text-blue-600" />, title: 'Free Shipping', desc: 'On orders above ₹999 pan-India', bg: 'bg-blue-50 border-blue-200' },
            { icon: <Clock size={20} className="text-amber-600" />, title: '3–5 Day Refund', desc: 'Back to original payment method', bg: 'bg-amber-50 border-amber-200' },
          ].map(c => (
            <div key={c.title} className={`${c.bg} border rounded-2xl p-5 flex items-start gap-3`}>
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                {c.icon}
              </div>
              <div>
                <p className="font-bold text-stone-800 text-sm">{c.title}</p>
                <p className="text-xs text-stone-500 mt-0.5">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Returns Policy */}
        <section className="bg-white rounded-2xl border border-stone-200 p-6 lg:p-8">
          <h2 className="text-xl font-bold text-stone-800 mb-5 flex items-center gap-2">
            <RotateCcw size={20} className="text-rose-600" /> Returns Policy
          </h2>

          <div className="space-y-6 text-sm text-stone-600 leading-relaxed">
            <div>
              <h3 className="font-bold text-stone-800 mb-2">Return Window</h3>
              <p>You may initiate a return within <strong>7 days</strong> from the date of delivery. Returns initiated after 7 days will not be accepted.</p>
            </div>

            <div>
              <h3 className="font-bold text-stone-800 mb-3">What Can Be Returned</h3>
              <div className="space-y-2">
                {[
                  'Fabric received in original, unused, and uncut condition',
                  'Fabric with all original tags and packaging intact',
                  'Wrong item delivered (full return + free pickup)',
                  'Defective or damaged fabric (full return + free pickup)',
                ].map(item => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle size={15} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-stone-800 mb-3">What Cannot Be Returned</h3>
              <div className="space-y-2">
                {[
                  'Fabric that has been cut, stitched, or altered in any way',
                  'Fabric that has been washed or dry-cleaned',
                  'Fabric without original tags or packaging',
                  'Customised or made-to-order items',
                  'Free swatch orders',
                ].map(item => (
                  <div key={item} className="flex items-start gap-2">
                    <XCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-stone-800 mb-2">How to Initiate a Return</h3>
              <ol className="space-y-2 list-decimal list-inside marker:text-rose-600 marker:font-bold">
                <li>WhatsApp us at <a href="https://wa.me/918298308314" className="text-rose-600 hover:underline font-medium">+91 82983 08314</a> with your Order ID and reason for return</li>
                <li>We'll confirm eligibility and share the return address within 24 hours</li>
                <li>Pack the fabric securely in original packaging and ship it back</li>
                <li>Once received and inspected, refund is processed within 3–5 business days</li>
              </ol>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
              <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-amber-700 text-xs">
                <strong>Damaged/Wrong item?</strong> Contact us within 48 hours of delivery with a photo on WhatsApp. We will arrange free pickup and replacement or full refund.
              </p>
            </div>
          </div>
        </section>

        {/* Shipping Policy */}
        <section className="bg-white rounded-2xl border border-stone-200 p-6 lg:p-8">
          <h2 className="text-xl font-bold text-stone-800 mb-5 flex items-center gap-2">
            <Truck size={20} className="text-blue-600" /> Shipping Policy
          </h2>

          <div className="space-y-6 text-sm text-stone-600 leading-relaxed">
            <div>
              <h3 className="font-bold text-stone-800 mb-3">Shipping Charges</h3>
              <div className="overflow-hidden rounded-xl border border-stone-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200">
                      <th className="text-left px-4 py-3 font-semibold text-stone-700">Order Value</th>
                      <th className="text-left px-4 py-3 font-semibold text-stone-700">Shipping Charge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { val: 'Below ₹999', charge: '₹80 flat' },
                      { val: '₹999 and above', charge: 'FREE' },
                      { val: 'Platinum B2B tier', charge: 'FREE (all orders)' },
                    ].map((row, i) => (
                      <tr key={row.val} className={i < 2 ? 'border-b border-stone-100' : ''}>
                        <td className="px-4 py-3 text-stone-700">{row.val}</td>
                        <td className={`px-4 py-3 font-semibold ${row.charge.includes('FREE') ? 'text-emerald-600' : 'text-stone-800'}`}>{row.charge}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-stone-800 mb-3">Delivery Timeframes</h3>
              <div className="overflow-hidden rounded-xl border border-stone-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200">
                      <th className="text-left px-4 py-3 font-semibold text-stone-700">Location</th>
                      <th className="text-left px-4 py-3 font-semibold text-stone-700">Standard</th>
                      <th className="text-left px-4 py-3 font-semibold text-stone-700">Express</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { loc: 'Andhra Pradesh / Telangana', std: '1–3 days', exp: 'Next day' },
                      { loc: 'Metro Cities (Mumbai, Delhi, Chennai…)', std: '2–4 days', exp: '1–2 days' },
                      { loc: 'Other Cities', std: '3–5 days', exp: '2–3 days' },
                      { loc: 'Remote / Rural Areas', std: '5–8 days', exp: 'Not available' },
                    ].map((row, i) => (
                      <tr key={row.loc} className={i < 3 ? 'border-b border-stone-100' : ''}>
                        <td className="px-4 py-3 text-stone-700">{row.loc}</td>
                        <td className="px-4 py-3 text-stone-700">{row.std}</td>
                        <td className="px-4 py-3 text-stone-700">{row.exp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-stone-400 mt-2">* Delivery times are estimates from date of dispatch. Delays may occur during festivals and peak seasons.</p>
            </div>

            <div>
              <h3 className="font-bold text-stone-800 mb-2">Dispatch Time</h3>
              <p>Orders are dispatched within <strong>24–48 hours</strong> of payment confirmation (Mon–Sat). Orders placed on Sunday or public holidays are dispatched the next working day.</p>
            </div>

            <div>
              <h3 className="font-bold text-stone-800 mb-2">Courier Partners</h3>
              <p>We ship via <strong>DTDC</strong> and <strong>Blue Dart</strong> depending on destination. You'll receive an SMS/email with tracking details after dispatch.</p>
            </div>
          </div>
        </section>

        {/* Need help */}
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-stone-800">Questions about your return or delivery?</p>
            <p className="text-stone-500 text-sm mt-1">Our team is available Mon–Sat, 8 AM – 9 PM</p>
          </div>
          <a
            href="tel:+918298308314"
            className="flex items-center gap-2 px-5 py-2.5 bg-rose-800 text-white rounded-xl text-sm font-semibold hover:bg-rose-900 whitespace-nowrap"
          >
            <Phone size={15} /> +91 82983 08314
          </a>
        </div>
      </div>
    </div>
  )
}
