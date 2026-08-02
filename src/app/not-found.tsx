import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4 text-center">

      {/* Decorative fabric threads */}
      <div className="text-8xl font-playfair font-bold text-stone-200 select-none leading-none mb-4">
        404
      </div>

      <div className="w-16 h-1 rounded-full mb-6" style={{ background: 'linear-gradient(90deg, #C8102E, #D4AF37)' }} />

      <h1 className="text-2xl font-playfair font-bold text-stone-800 mb-2">
        This fabric got lost in the weave
      </h1>
      <p className="text-stone-500 text-sm max-w-sm mb-8">
        The page you are looking for doesn&apos;t exist or has been moved.
        Let us guide you back to our collection.
      </p>

      {/* Quick links */}
      <div className="flex flex-wrap gap-3 justify-center mb-10">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #C8102E, #9B0C24)' }}
        >
          🏠 Go Home
        </Link>
        <Link
          href="/fabrics"
          className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-sm font-semibold transition-colors"
        >
          🧵 Browse Fabrics
        </Link>
        <Link
          href="/contact"
          className="px-5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 text-sm font-semibold hover:border-rose-300 transition-colors"
        >
          📞 Contact Us
        </Link>
      </div>

      {/* Popular categories */}
      <div className="text-xs text-stone-400 mb-3 uppercase tracking-wider">Popular Categories</div>
      <div className="flex flex-wrap gap-2 justify-center max-w-md">
        {[
          { label: 'Lehenga Fabrics', slug: 'lehenga' },
          { label: 'Blouse Fabrics',  slug: 'blouse' },
          { label: 'Kurti Fabrics',   slug: 'kurti' },
          { label: 'Plain Fabrics',   slug: 'plain' },
          { label: 'Dupattas',        slug: 'dupatta' },
          { label: 'Designer Sarees', slug: 'saree' },
        ].map(({ label, slug }) => (
          <Link
            key={slug}
            href={`/fabrics?category=${slug}`}
            className="px-3 py-1.5 rounded-full bg-white border border-stone-200 text-stone-600 text-xs hover:border-rose-300 hover:text-rose-600 transition-colors"
          >
            {label}
          </Link>
        ))}
      </div>

      {/* WhatsApp help */}
      <a
        href="https://wa.me/918298308314?text=Hi! I need help finding a fabric on GoFabrikos."
        target="_blank"
        rel="noopener noreferrer"
        className="mt-10 inline-flex items-center gap-2 text-sm text-stone-400 hover:text-emerald-600 transition-colors"
      >
        <span className="text-lg">💬</span>
        Need help? Chat with us on WhatsApp
      </a>
    </main>
  )
}
