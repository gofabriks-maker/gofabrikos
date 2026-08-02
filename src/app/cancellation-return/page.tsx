import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cancellation & Return Policy | GoFabrikos',
  description: 'Learn about GoFabrikos cancellation and return policy for fabric orders.',
}

export default function CancellationReturnPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <div className="mb-8">
            <Link href="/" className="text-primary text-sm hover:underline">← Back to Home</Link>
            <h1 className="font-playfair text-3xl font-bold text-gray-900 mt-4 mb-2">Cancellation &amp; Return Policy</h1>
            <p className="text-gray-500 text-sm">Last updated: August 2026</p>
          </div>

          <div className="prose prose-gray max-w-none space-y-8 text-sm leading-relaxed text-gray-700">

            <section>
              <h2 className="font-playfair text-xl font-bold text-gray-800 mb-3">Order Cancellation</h2>
              <p>You may cancel your order within <strong>24 hours</strong> of placing it, provided it has not yet been dispatched. To cancel, contact us via WhatsApp at +91 82983 08314 with your Order ID.</p>
              <ul className="list-disc list-inside mt-3 space-y-1 text-gray-600">
                <li>Orders cancelled before dispatch: 100% refund within 3–5 business days</li>
                <li>Orders already dispatched cannot be cancelled</li>
                <li>Custom-cut or bulk orders are non-cancellable once confirmed</li>
              </ul>
            </section>

            <section>
              <h2 className="font-playfair text-xl font-bold text-gray-800 mb-3">Return Policy</h2>
              <p>We accept returns within <strong>7 days</strong> of delivery under the following conditions:</p>
              <ul className="list-disc list-inside mt-3 space-y-1 text-gray-600">
                <li>Fabric received is damaged, defective, or significantly different from what was ordered</li>
                <li>Wrong fabric, colour, or quantity was sent</li>
                <li>Fabric is unused and in original packaging</li>
              </ul>
              <p className="mt-3 text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
                ⚠️ Returns are <strong>not accepted</strong> for change of mind, colour variation due to screen differences, or fabric that has been washed, cut, or stitched.
              </p>
            </section>

            <section>
              <h2 className="font-playfair text-xl font-bold text-gray-800 mb-3">Return Process</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>WhatsApp us at +91 82983 08314 with your Order ID and photos of the issue</li>
                <li>Our team will review and respond within 24 hours</li>
                <li>If approved, ship the fabric back to our address (Guntur, AP)</li>
                <li>Refund is processed within 5–7 business days of receiving the return</li>
              </ol>
              <p className="mt-3 text-gray-600">Return shipping cost is borne by GoFabrikos for defective/wrong items. For other approved returns, the customer bears the shipping cost.</p>
            </section>

            <section>
              <h2 className="font-playfair text-xl font-bold text-gray-800 mb-3">Refund Method</h2>
              <p>Refunds are processed to the original payment method:</p>
              <ul className="list-disc list-inside mt-3 space-y-1 text-gray-600">
                <li>UPI / Bank Transfer: 3–5 business days</li>
                <li>Credit/Debit Card: 5–7 business days</li>
                <li>COD orders: Bank transfer after receiving bank details</li>
              </ul>
            </section>

            <section>
              <h2 className="font-playfair text-xl font-bold text-gray-800 mb-3">Contact Us</h2>
              <p>For any cancellation or return queries:</p>
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
