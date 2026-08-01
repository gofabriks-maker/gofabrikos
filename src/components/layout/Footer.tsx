import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div>
            <Link href="/" className="font-playfair text-2xl font-bold text-primary block mb-3">
              Go<span className="text-gold">Fabrikos</span>
            </Link>
            <p className="text-sm leading-relaxed mb-5 max-w-xs">
              India's finest fabric store — from weaver clusters to your doorstep. Quality fabrics, honest pricing, GST invoice on every order.
            </p>
            <div className="flex gap-3">
              {['📘','📸','▶️','💬'].map((icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-sm hover:border-gold hover:text-gold transition-colors">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-5">Shop</h4>
            <ul className="space-y-3">
              {[
                ['All Fabrics', '/fabrics'],
                ['Saree Fabrics', '/fabrics?category=saree'],
                ['Blouse Fabrics', '/fabrics?category=blouse'],
                ['Lehenga Fabrics', '/fabrics?category=lehenga'],
                ['New Arrivals', '/fabrics?sort=newest'],
                ['Sale', '/fabrics?sort=sale'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm hover:text-gold transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-5">Help</h4>
            <ul className="space-y-3">
              {[
                ['Free Swatch', '/free-swatch'],
                ['Track Order', '/track-order'],
                ['Returns Policy', '/returns'],
                ['FAQ', '/faq'],
                ['B2B Wholesale', '/wholesale'],
                ['Contact Us', '/contact'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm hover:text-gold transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-5">Contact</h4>
            <div className="space-y-3 text-sm">
              <p>💬 <a href="https://wa.me/919581734837" className="hover:text-gold transition-colors">+91 95817 34837</a></p>
              <p>📧 care@gofabrikos.com</p>
              <p>🕐 Mon–Sat: 8 AM – 9 PM</p>
              <p>📍 Guntur, Andhra Pradesh</p>
              <p>🏛 GSTIN: On every invoice</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs">
            © 2026 GoFabrikos. All rights reserved.
            <Link href="/privacy" className="ml-3 hover:text-gold transition-colors">Privacy</Link>
            <Link href="/terms" className="ml-3 hover:text-gold transition-colors">Terms</Link>
          </p>
          <div className="flex gap-2">
            {['UPI', 'Razorpay', 'EMI', 'COD', 'Cards'].map((method) => (
              <span key={method} className="text-xs bg-gray-800 border border-gray-700 rounded px-2.5 py-1 font-medium text-gray-300">
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
