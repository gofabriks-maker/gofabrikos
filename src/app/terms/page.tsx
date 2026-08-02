import Link from 'next/link'
import { FileText } from 'lucide-react'

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing or using the GoFabrikos website (gofabrikos.com), placing an order, or creating an account, you agree to be bound by these Terms and Conditions and our Privacy Policy.

If you do not agree with any part of these terms, please do not use our website.`,
  },
  {
    title: '2. Business Information',
    content: `GoFabrikos is a proprietary business operated by:

Proprietor: Lakshmi Sowjanya Aaki
Business Name: GoFabrikos
Registered Address: 3rd Floor, Shop No. 346, Sri Vasavi Wholesale Cloth Merchant Society, Mangalagiri Road, Guntur – 522001, Andhra Pradesh, India
GST Registration: Registered under GST (Andhra Pradesh — State Code 37)
Email: care@gofabrikos.com
Phone: +91 82983 08314`,
  },
  {
    title: '3. Products & Pricing',
    content: `All fabric prices are listed per metre (₹/m) inclusive of applicable taxes (GST).

We reserve the right to change prices at any time without prior notice. The price at the time of placing your order is the price you pay.

Product images and descriptions are provided in good faith. Minor colour variations may occur due to screen settings and photography. We recommend using our Fabric Visualizer before purchasing large quantities.

All products are subject to availability. In the rare case a product becomes unavailable after your order, we will notify you and offer a full refund or alternative.`,
  },
  {
    title: '4. Placing an Order',
    content: `By placing an order on GoFabrikos, you confirm that:

• You are at least 18 years of age
• The information you provide is accurate and complete
• You are authorised to use the payment method provided

An order confirmation email/SMS does not constitute a binding contract. GoFabrikos reserves the right to cancel any order due to pricing errors, fraud suspicion, or stock unavailability, with a full refund issued.`,
  },
  {
    title: '5. Payment',
    content: `We accept UPI, Credit Cards, Debit Cards, Net Banking, EMI, and Cash on Delivery (COD up to ₹5,000).

All online payments are processed securely by Razorpay. GoFabrikos does not store your payment card details.

For B2B/wholesale orders, credit terms (15-day or 30-day) are available for Gold and Platinum tier partners respectively, subject to approval.`,
  },
  {
    title: '6. GST & Invoicing',
    content: `A GST invoice is issued on every order — retail and B2B.

If you have a GSTIN and require a B2B invoice with Input Tax Credit (ITC), please update your GSTIN in your account profile before placing the order. Invoices cannot be revised after dispatch.

GoFabrikos's GSTIN is issued under Andhra Pradesh (State Code 37).`,
  },
  {
    title: '7. Shipping & Delivery',
    content: `We ship pan-India via DTDC and Blue Dart. Delivery timelines are estimates and not guaranteed. GoFabrikos is not liable for delays caused by courier partners, weather, or other events outside our control.

Title and risk of loss for purchased items pass to you upon dispatch (when the courier takes possession).

Please inspect parcels upon delivery. Report visible damage to the courier before accepting. Signed delivery is assumed to mean the package was received in good condition.`,
  },
  {
    title: '8. Returns & Refunds',
    content: `Please refer to our Returns & Shipping Policy page for complete details.

In summary: 7-day return window for unused, uncut fabric in original packaging. Refunds processed within 3–5 business days of receiving the returned item.

GoFabrikos reserves the right to refuse returns that do not meet our return conditions.`,
  },
  {
    title: '9. Intellectual Property',
    content: `All content on gofabrikos.com — including text, images, logos, the Fabric Visualizer tool, and code — is the intellectual property of GoFabrikos or its licensors.

You may not reproduce, distribute, or commercially exploit any content from this site without written permission. You may share product links and images for personal, non-commercial use.`,
  },
  {
    title: '10. Limitation of Liability',
    content: `GoFabrikos's liability is limited to the value of the order in question. We are not liable for:

• Indirect, incidental, or consequential damages
• Loss of business, profit, or data arising from use of our site or products
• Delays, errors, or failures caused by third-party services (couriers, payment gateways)

Some jurisdictions do not allow limitation of liability; in such cases, our liability is limited to the maximum extent permitted by law.`,
  },
  {
    title: '11. Governing Law & Disputes',
    content: `These Terms are governed by the laws of India. Any disputes arising from these Terms or your use of GoFabrikos shall be subject to the exclusive jurisdiction of the courts of Guntur, Andhra Pradesh.

We encourage you to contact us first at care@gofabrikos.com to resolve any issue informally before pursuing legal action.`,
  },
  {
    title: '12. Changes to Terms',
    content: `We may update these Terms from time to time. Changes take effect when published on this page. Your continued use of the website after changes constitutes acceptance. We recommend checking this page periodically.`,
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-rose-800 tracking-wide">
            Go<span className="text-stone-400 font-light">Fabrikos</span>
          </Link>
          <div className="flex gap-4 text-sm text-stone-600">
            <Link href="/privacy" className="hover:text-rose-700">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-rose-700">Contact</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-stone-900 text-white py-12 px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-stone-700 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4">
          <FileText size={13} /> TERMS & CONDITIONS
        </div>
        <h1 className="text-3xl font-bold mb-2">Terms & Conditions</h1>
        <p className="text-stone-300 max-w-md mx-auto">Please read these terms carefully before using GoFabrikos.</p>
        <p className="text-stone-400 text-xs mt-3">Last updated: July 2026 · Effective immediately</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Table of contents */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 mb-8">
          <h2 className="text-sm font-bold text-stone-700 mb-3 uppercase tracking-wider">Contents</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {SECTIONS.map(s => (
              <a
                key={s.title}
                href={`#${s.title.replace(/\s+/g, '-').toLowerCase()}`}
                className="text-sm text-stone-600 hover:text-rose-700 py-0.5"
              >
                {s.title}
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-5">
          {SECTIONS.map(section => (
            <div
              key={section.title}
              id={section.title.replace(/\s+/g, '-').toLowerCase()}
              className="bg-white rounded-2xl border border-stone-200 p-6"
            >
              <h2 className="text-base font-bold text-stone-800 mb-3">{section.title}</h2>
              <div className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center text-stone-400 text-xs">
          <p>© 2026 GoFabrikos (Prop: Lakshmi Sowjanya Aaki). All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/privacy" className="hover:text-rose-600">Privacy Policy</Link>
            <Link href="/returns" className="hover:text-rose-600">Returns Policy</Link>
            <Link href="/contact" className="hover:text-rose-600">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
