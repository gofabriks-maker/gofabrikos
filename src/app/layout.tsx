import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const BASE = 'https://www.gofabrikos.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: "GoFabrikos – Buy Fabric Online | Indian Fabrics Per Metre",
    template: '%s | GoFabrikos',
  },
  description: "Shop 2,400+ premium Indian fabrics online — Chanderi, Banarasi Silk, Kanjivaram, Cotton, Georgette. Priced per metre. GST invoice on every order. Free shipping above ₹999. Pan-India delivery.",
  keywords: [
    "buy fabric online India",
    "chanderi fabric online",
    "banarasi silk fabric",
    "kanjivaram silk online",
    "fabric per metre",
    "lehenga fabric online",
    "blouse fabric",
    "cotton fabric online",
    "georgette fabric",
    "GoFabrikos",
    "fabric store Hyderabad",
    "Indian fabric online",
    "silk fabric buy online",
    "saree fabric online",
    "dupatta fabric",
  ],
  authors:   [{ name: 'GoFabrikos', url: BASE }],
  creator:   'GoFabrikos',
  publisher: 'GoFabrikos',
  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:               true,
      follow:              true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet':       -1,
    },
  },
  openGraph: {
    title:       "GoFabrikos – India's Finest Fabrics | Buy Online Per Metre",
    description: "Shop 2,400+ premium Indian fabrics. Chanderi, Banarasi, Kanjivaram, Cotton & more. Priced per metre. GST invoice. Pan-India delivery.",
    url:         BASE,
    siteName:    'GoFabrikos',
    type:        'website',
    locale:      'en_IN',
    images: [{
      url:    `${BASE}/og-image.jpg`,
      width:  1200,
      height: 630,
      alt:    'GoFabrikos – India\'s Finest Fabrics',
    }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       "GoFabrikos – India's Finest Fabrics",
    description: "Shop 2,400+ premium Indian fabrics per metre. GST invoice on every order.",
    site:        '@gofabrikos',
    creator:     '@gofabrikos',
    images:      [`${BASE}/og-image.jpg`],
  },
  alternates: {
    canonical: BASE,
  },
  icons: {
    icon:  [
      { url: '/favicon.ico',              sizes: 'any' },
      { url: '/logo-icon.png',            type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  category: 'shopping',
}

// JSON-LD: LocalBusiness + Organisation + WebSite with SearchAction
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':       'Organization',
      '@id':         `${BASE}/#organization`,
      name:          'GoFabrikos',
      url:           BASE,
      logo: {
        '@type':     'ImageObject',
        url:         `${BASE}/logo.png`,
        width:       200,
        height:      60,
      },
      contactPoint: {
        '@type':            'ContactPoint',
        telephone:          '+91-87901-25438',
        contactType:        'customer service',
        availableLanguage:  ['English', 'Telugu', 'Hindi'],
      },
      sameAs: [
        'https://www.instagram.com/gofabrikos',
        'https://www.facebook.com/gofabrikos',
      ],
    },
    {
      '@type':       'WebSite',
      '@id':         `${BASE}/#website`,
      url:           BASE,
      name:          'GoFabrikos',
      publisher:     { '@id': `${BASE}/#organization` },
      potentialAction: {
        '@type':        'SearchAction',
        target:         `${BASE}/fabrics?q={search_term_string}`,
        'query-input':  'required name=search_term_string',
      },
    },
    {
      '@type':           'LocalBusiness',
      '@id':             `${BASE}/#localbusiness`,
      name:              'GoFabrikos',
      description:       'Premium Indian fabric store — Chanderi, Banarasi, Silk, Cotton & more. Pan-India delivery.',
      url:               BASE,
      telephone:         '+91-87901-25438',
      email:             'care@gofabrikos.com',
      address: {
        '@type':           'PostalAddress',
        addressLocality:   'Hyderabad',
        addressRegion:     'Telangana',
        addressCountry:    'IN',
      },
      priceRange:        '₹₹',
      currenciesAccepted:'INR',
      paymentAccepted:   'Cash, Credit Card, UPI, Net Banking',
      openingHours:      'Mo-Sa 09:00-19:00',
      image:             `${BASE}/og-image.jpg`,
      logo:              `${BASE}/logo.png`,
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
