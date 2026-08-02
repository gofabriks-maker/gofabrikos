import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy | GoFabrikos',
  description: 'Learn about GoFabrikos shipping, delivery timelines, and logistics partners.',
}

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <div className="mb-8">
            <Link href="/" className="text-primary text-sm hover:underline">← Back to Home</Link>
            <h1 className="font-playfair text-3xl font-bold text-gray-900 mt-4 mb-2">Shipping &amp; Delivery Policy</h1>
            <p className="text-gray-500 text-sm">Last updated: August 2026</p>
          </div>

          <div className="prose prose-gray max-w-none space-y-8 text-sm leading-relaxed text-gray-700">

            <section>
              <h2 className="font-playfair text-xl font-bold text-gray-800 mb-3">Shipping Coverage</h2>
              <p>We deliver to <strong>500+ cities across India</strong>. All orders are shipped from our warehouse in Guntur, Andhra Pradesh.</p>
            </section>

            <section>
              <h2 className="font-playfair text-xl font-bold text-gray-800 mb-3">Shipping Charges</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-3 border border-gray-200 font-semibold">Order Value</th>
                      <th className="text-left p-3 border border-gray-200 font-semibold">Shipping Charge</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 border border-gray-200">Below ₹999</td>
                      <td className="p-3 border border-gray-200">₹49 – ₹79 (based on weight &amp; location)</td>
                    </tr>
                    <tr className="bg-green-50">
                      <td className="p-3 border border-gray-200">₹999 and above</td>
                      <td className="p-3 border border-gray-200 text-green-700 font-semibold">🆓 FREE Shipping</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="font-playfair text-xl font-bold text-gray-800 mb-3">Delivery Timeline</h2>
              <div className="space-y-3">
                {[
                  { zone: 'Andhra Pradesh & Telangana', time: '2–3 business days' },
                  { zone: 'South India (Tamil Nadu, Karnataka, Kerala)', time: '3–4 business days' },
                  { zone: 'North India (Delhi, UP, Rajasthan, Punjab)', time: '4–6 business days' },
                  { zone: 'Northeast & Remote Areas', time: '6–9 business days' },
                ].map(({ zone, time }) => (
                  <div key={zone} className="flex justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="font-medium text-gray-700">{zone}</span>
                    <span className="text-primary font-semibold">{time}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-gray-500 text-xs">* Business days exclude Sundays and public holidays. Timelines are estimates and may vary during peak seasons.</p>
            </section>

            <section>
              <h2 className="font-playfair text-xl font-bold text-gray-800 mb-3">Logistics Partners</h2>
              <p>We ship via trusted courier partners including <strong>DTDC, Delhivery, Bluedart, and Shiprocket</strong>. A tracking ID is shared via WhatsApp or email once your order is dispatched.</p>
            </section>

            <section>
              <h2 className="font-playfair text-xl font-bold text-gray-800 mb-3">Order Processing</h2>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Orders placed before 2 PM (Mon–Sat) are processed the same day</li>
                <li>Orders placed after 2 PM or on Sunday are processed the next business day</li>
                <li>Custom / bulk B2B orders may require 1–2 extra days for packaging</li>
              </ul>
            </section>

            <section>
              <h2 className="font-playfair text-xl font-bold text-gray-800 mb-3">Failed Delivery</h2>
              <p>If the courier makes 2–3 failed delivery attempts, the package is returned to our warehouse. We will contact you to rearrange delivery. Re-shipping charges may apply.</p>
            </section>

            <section>
              <h2 className="font-playfair text-xl font-bold text-gray-800 mb-3">Contact for Shipping Queries</h2>
              <div className="mt-3 space-y-2 text-gray-600">
                <p>💬 WhatsApp: <a href="https://wa.me/918298308314" className="text-primary hover:underline">+91 82983 08314</a></p>
                <p>📧 Email: <a href="mailto:care@gofabrikos.com" className="text-primary hover:underline">care@gofabrikos.com</a></p>
                <p>🕐 Support Hours: Mon–Sat, 8 AM – 9 PM IST</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
