import Link from 'next/link'
import { Shield } from 'lucide-react'

const SECTIONS = [
  {
    title: '1. Information We Collect',
    content: `When you use GoFabrikos, we collect the following information:

Personal Information: Name, mobile number, email address, and delivery address when you place an order or create an account.

Payment Information: We do not store your card or UPI details. All payments are processed securely through Razorpay, a PCI-DSS compliant payment gateway. GoFabrikos never sees your full card number.

Usage Data: Pages you visit, products you view, device type, browser, and IP address — collected automatically via standard web analytics.

Communications: Messages you send us via WhatsApp, email, or the contact form.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `We use your information to:

• Process and fulfil your orders (name, address, phone for delivery)
• Send order confirmations, invoices, and tracking updates via SMS/email
• Generate GST invoices with your GSTIN if provided
• Respond to your queries and support requests
• Improve our website and product listings based on usage patterns
• Send promotional offers only if you have opted in (you can opt out anytime)

We do not use your data for any purpose other than the above without your explicit consent.`,
  },
  {
    title: '3. Information Sharing',
    content: `GoFabrikos does not sell, rent, or trade your personal information to third parties.

We share limited data only with:

• Courier partners (DTDC, Blue Dart): Your name, address, and phone number — required for delivery.
• Razorpay: Payment processing. Their privacy policy governs data they collect during checkout.
• SMS/Email service providers: To send order and delivery notifications.

All third-party partners are contractually required to protect your data and use it only for the service they provide.`,
  },
  {
    title: '4. Cookies',
    content: `We use essential cookies to keep you logged in and remember your cart. We also use analytics cookies (Google Analytics) to understand how visitors use our site.

You can disable cookies in your browser settings. Disabling essential cookies may affect site functionality (e.g., cart and login may not work).

We do not use advertising cookies or sell cookie data to advertisers.`,
  },
  {
    title: '5. Data Security',
    content: `We take data security seriously:

• All data transmitted between your browser and GoFabrikos is encrypted via HTTPS/TLS.
• Passwords are stored as salted hashes — we never store plain-text passwords.
• Payment data is handled exclusively by Razorpay (PCI-DSS Level 1 certified).
• Access to customer data within our team is limited to authorised personnel only.

No system is 100% secure. If you suspect any unauthorised access to your account, contact us immediately at care@gofabrikos.com.`,
  },
  {
    title: '6. Your Rights',
    content: `You have the right to:

• Access: Request a copy of the personal data we hold about you.
• Correction: Request correction of inaccurate or incomplete data.
• Deletion: Request deletion of your account and associated data (subject to legal obligations).
• Opt-out: Unsubscribe from promotional emails at any time using the unsubscribe link.

To exercise any of these rights, email us at care@gofabrikos.com or WhatsApp +91 95817 34837.`,
  },
  {
    title: '7. Children\'s Privacy',
    content: `GoFabrikos is not directed at children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, contact us and we will delete it promptly.`,
  },
  {
    title: '8. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. Significant changes will be notified via email or a notice on our website. The "Last updated" date at the top of this page reflects the most recent revision. Continued use of GoFabrikos after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: '9. Contact Us',
    content: `For any privacy-related questions or requests:

Business: GoFabrikos (Prop: Lakshmi Sowjanya Aaki)
Address: 3rd Floor, Shop No. 346, Sri Vasavi Wholesale Cloth Merchant Society, Mangalagiri Road, Guntur – 522001, Andhra Pradesh
Email: care@gofabrikos.com
WhatsApp: +91 95817 34837`,
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-rose-800 tracking-wide">
            Go<span className="text-stone-400 font-light">Fabrikos</span>
          </Link>
          <div className="flex gap-4 text-sm text-stone-600">
            <Link href="/terms" className="hover:text-rose-700">Terms</Link>
            <Link href="/contact" className="hover:text-rose-700">Contact</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-stone-900 text-white py-12 px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-700 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4">
          <Shield size={13} /> PRIVACY POLICY
        </div>
        <h1 className="text-3xl font-bold mb-2">Your Privacy Matters</h1>
        <p className="text-stone-300 max-w-md mx-auto">We collect only what we need, protect it carefully, and never sell it.</p>
        <p className="text-stone-400 text-xs mt-3">Last updated: July 2026 · Effective immediately</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Intro */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-8 flex items-start gap-3">
          <Shield size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            This Privacy Policy explains how <strong>GoFabrikos</strong> (Prop: Lakshmi Sowjanya Aaki), operating at gofabrikos.com, collects, uses, and protects your personal information. By using our website, you agree to this policy.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {SECTIONS.map(section => (
            <div key={section.title} className="bg-white rounded-2xl border border-stone-200 p-6">
              <h2 className="text-base font-bold text-stone-800 mb-3">{section.title}</h2>
              <div className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center text-stone-400 text-xs">
          <p>© 2026 GoFabrikos. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/terms" className="hover:text-rose-600">Terms & Conditions</Link>
            <Link href="/returns" className="hover:text-rose-600">Returns Policy</Link>
            <Link href="/contact" className="hover:text-rose-600">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
