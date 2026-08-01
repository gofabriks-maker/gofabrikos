'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, MessageCircle, Search } from 'lucide-react'

const FAQ_CATEGORIES = [
  {
    cat: 'Ordering & Payment',
    emoji: '🛒',
    faqs: [
      { q: 'What is the minimum order quantity?', a: 'No minimum for retail orders — buy as little as 0.5 metres. For B2B/wholesale pricing, minimum is 50 metres per fabric.' },
      { q: 'How do I place an order?', a: 'Browse fabrics, select your quantity (in metres), add to cart, and checkout. We accept UPI, Credit/Debit Cards, Net Banking, EMI, and Cash on Delivery.' },
      { q: 'Is GST invoice provided?', a: 'Yes, every order — retail and B2B — comes with a proper GST invoice. If you have a GSTIN, add it in your account profile before placing the order.' },
      { q: 'Can I get a discount on bulk orders?', a: 'Yes! Silver tier (50–199 m): 8% off. Gold tier (200–499 m): 15% off. Platinum tier (500 m+): 22% off. Visit our Wholesale page for details.' },
      { q: 'Do you accept COD?', a: 'Yes, Cash on Delivery is available for orders up to ₹5,000. Orders above ₹5,000 require advance payment.' },
    ],
  },
  {
    cat: 'Fabric & Quality',
    emoji: '🧵',
    faqs: [
      { q: 'Are the fabrics authentic?', a: 'Yes. We source directly from certified weaver clusters — Chanderi, Varanasi, Kanchipuram, Surat, Jaipur, and 10+ other hubs. No imitations, no middlemen.' },
      { q: 'How do I choose the right fabric?', a: 'Use our free swatch programme — request up to 3 fabric swatches (10×10 cm) delivered free. Also try our Fabric Visualizer to see how fabric looks on a mannequin.' },
      { q: 'What does GSM mean?', a: 'GSM = Grams per Square Metre. It measures fabric weight/thickness. Higher GSM means heavier, thicker fabric (e.g., 180+ GSM for winter; 80–120 GSM for summer/sheer fabrics).' },
      { q: 'Is the fabric colour accurate in photos?', a: 'We photograph fabrics under standard studio lighting. Minor colour variations can occur due to screen settings. Use the free swatch service for colour-critical decisions.' },
      { q: 'What is the fabric width / selvedge-to-selvedge measurement?', a: 'Width varies by fabric type. Saree fabrics: typically 44–47 inches. Dress materials: 36–44 inches. Width is listed on each product page.' },
    ],
  },
  {
    cat: 'Shipping & Delivery',
    emoji: '🚚',
    faqs: [
      { q: 'How long does delivery take?', a: 'Standard: 3–5 business days (metro cities). Regional/remote areas: 5–8 business days. Express delivery (1–2 days) available at extra cost via Blue Dart.' },
      { q: 'Is shipping free?', a: 'Free shipping on all orders above ₹999. Orders below ₹999 incur ₹80 shipping. Platinum B2B partners get free delivery pan-India on all orders.' },
      { q: 'Do you ship outside India?', a: 'We currently ship pan-India only. For international/export enquiries, contact us on WhatsApp — we handle export orders case by case.' },
      { q: 'How do I track my order?', a: 'You\'ll receive a tracking link via SMS/email after dispatch. You can also visit Track Order on our website and enter your Order ID.' },
      { q: 'What courier do you use?', a: 'We ship via DTDC and Blue Dart depending on the destination. Courier is chosen at the time of dispatch for the fastest route.' },
    ],
  },
  {
    cat: 'Returns & Refunds',
    emoji: '↩️',
    faqs: [
      { q: 'What is your return policy?', a: '7-day return window from the date of delivery. Fabric must be unused, uncut, and in original packaging with tags intact. Visit our Returns page for full process.' },
      { q: 'Can I return a cut piece?', a: 'No. Once fabric is cut or washed, it cannot be returned. Please order a swatch first if you are unsure.' },
      { q: 'How long does a refund take?', a: 'Refund is processed within 3–5 business days after we receive and inspect the returned fabric. Amount credited to original payment method.' },
      { q: 'What if I receive a damaged/wrong item?', a: 'Contact us within 48 hours of delivery with a photo on WhatsApp (+91 95817 34837). We will replace or refund immediately — no questions asked.' },
    ],
  },
  {
    cat: 'Free Swatch',
    emoji: '✂️',
    faqs: [
      { q: 'What is the free swatch programme?', a: 'Request up to 3 fabric swatches (10×10 cm each) delivered to your doorstep — free on your first order. It helps you feel the texture and check colour before buying.' },
      { q: 'How long do swatches take to arrive?', a: 'Swatches are dispatched within 1–2 business days and arrive in 3–5 days depending on your location.' },
      { q: 'Can I request more than 3 swatches?', a: 'The free programme allows up to 3 swatches per request per customer. Additional swatches are available at ₹10 each, adjusted against your order value.' },
    ],
  },
  {
    cat: 'Account & Privacy',
    emoji: '👤',
    faqs: [
      { q: 'Do I need an account to order?', a: 'You can browse without an account. An account is needed to checkout, track orders, save addresses, and manage wishlist.' },
      { q: 'Is my data safe?', a: 'Yes. We never sell your data. Payments are processed via Razorpay (PCI-DSS compliant). See our Privacy Policy for full details.' },
      { q: 'How do I update my GSTIN?', a: 'Log in → My Account → My Profile → Edit → Update GSTIN field. GST invoices will reflect your GSTIN on future orders.' },
    ],
  },
]

export default function FaqPage() {
  const [openCat, setOpenCat] = useState<string>(FAQ_CATEGORIES[0].cat)
  const [openQ, setOpenQ]     = useState<string | null>(null)
  const [search, setSearch]   = useState('')

  const filtered = search.trim()
    ? FAQ_CATEGORIES.map(c => ({
        ...c,
        faqs: c.faqs.filter(f =>
          f.q.toLowerCase().includes(search.toLowerCase()) ||
          f.a.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter(c => c.faqs.length > 0)
    : FAQ_CATEGORIES

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-rose-800 tracking-wide">
            Go<span className="text-stone-400 font-light">Fabrikos</span>
          </Link>
          <div className="flex items-center gap-4 text-sm text-stone-600">
            <Link href="/fabrics" className="hover:text-rose-700">Shop</Link>
            <Link href="/contact" className="hover:text-rose-700">Contact</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-stone-900 text-white py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
        <p className="text-stone-300 max-w-md mx-auto mb-6">Everything you need to know about GoFabrikos</p>
        {/* Search */}
        <div className="max-w-md mx-auto relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search questions…"
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-stone-400 text-sm focus:outline-none focus:border-rose-400 focus:bg-white/20"
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Category tabs */}
        {!search && (
          <div className="flex flex-wrap gap-2 mb-8">
            {FAQ_CATEGORIES.map(c => (
              <button
                key={c.cat}
                onClick={() => setOpenCat(c.cat)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  openCat === c.cat
                    ? 'bg-rose-800 text-white shadow'
                    : 'bg-white border border-stone-200 text-stone-600 hover:border-rose-300'
                }`}
              >
                <span>{c.emoji}</span> {c.cat}
              </button>
            ))}
          </div>
        )}

        {/* FAQs */}
        <div className="space-y-8">
          {filtered.map(category => (
            (!search && category.cat !== openCat) ? null : (
              <div key={category.cat}>
                {search && (
                  <h2 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-3">
                    {category.emoji} {category.cat}
                  </h2>
                )}
                <div className="space-y-2">
                  {category.faqs.map((faq, i) => {
                    const key = `${category.cat}-${i}`
                    const isOpen = openQ === key
                    return (
                      <div key={key} className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                        <button
                          onClick={() => setOpenQ(isOpen ? null : key)}
                          className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold text-stone-800 hover:bg-stone-50 transition-colors"
                        >
                          <span className="pr-4">{faq.q}</span>
                          {isOpen
                            ? <ChevronUp size={16} className="text-rose-600 flex-shrink-0" />
                            : <ChevronDown size={16} className="text-stone-400 flex-shrink-0" />
                          }
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-4 pt-2 text-sm text-stone-600 leading-relaxed border-t border-stone-100">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-stone-400">
              <p className="text-lg mb-2">No results for &ldquo;{search}&rdquo;</p>
              <p className="text-sm">Try different words or <Link href="/contact" className="text-rose-600 hover:underline">contact us directly</Link></p>
            </div>
          )}
        </div>

        {/* Still need help */}
        <div className="mt-12 bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-stone-800 mb-2">Still have a question?</h3>
          <p className="text-stone-500 text-sm mb-4">Our team is available Mon–Sat, 8 AM – 9 PM on WhatsApp.</p>
          <a
            href="https://wa.me/919581734837?text=Hi%20GoFabrikos%2C%20I%20have%20a%20question."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
          >
            <MessageCircle size={18} /> Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
