import type { Metadata } from 'next'

const BASE = 'https://www.gofabrikos.com'

export const metadata: Metadata = {
  title: 'Buy Indian Fabric Online – Chanderi, Silk, Cotton, Georgette Per Metre',
  description: 'Shop 2,400+ premium Indian fabrics online. Chanderi, Banarasi Silk, Kanjivaram, Cotton, Georgette, Linen & more. Priced per metre. GST invoice on every order. Free shipping above ₹999.',
  keywords: [
    'buy fabric online India',
    'chanderi fabric',
    'banarasi silk fabric online',
    'cotton fabric per metre',
    'georgette fabric online',
    'kanjivaram silk fabric',
    'lehenga fabric online',
    'blouse fabric material',
    'fabric store online India',
  ],
  alternates: {
    canonical: `${BASE}/fabrics`,
  },
  openGraph: {
    title:       'Buy Indian Fabric Online – 2,400+ Fabrics Per Metre | GoFabrikos',
    description: 'Chanderi, Banarasi Silk, Kanjivaram, Cotton, Georgette & more. GST invoice on every order. Pan-India delivery.',
    url:         `${BASE}/fabrics`,
    siteName:    'GoFabrikos',
    type:        'website',
    locale:      'en_IN',
    images: [{
      url:    `${BASE}/og-image.jpg`,
      width:  1200,
      height: 630,
      alt:    'GoFabrikos – Indian Fabric Online',
    }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Buy Indian Fabric Online | GoFabrikos',
    description: '2,400+ premium fabrics per metre. GST invoice. Pan-India delivery.',
    images:      [`${BASE}/og-image.jpg`],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
