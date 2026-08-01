import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'B2B Wholesale Fabrics | GoFabrikos',
  description: 'Wholesale fabric supplier in Guntur. Minimum order ₹5,000. GST invoice. Bulk pricing for boutiques, designers, and retailers across India.',
  openGraph: {
    title: 'B2B Wholesale Fabrics | GoFabrikos',
    description: 'Wholesale fabric supplier in Guntur. Minimum order ₹5,000. GST invoice. Bulk pricing for boutiques, designers, and retailers across India.',
    url: 'https://gofabrikos.com/wholesale',
    siteName: 'GoFabrikos',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'B2B Wholesale Fabrics | GoFabrikos',
    description: 'Wholesale fabric supplier in Guntur. Minimum order ₹5,000. GST invoice. Bulk pricing for boutiques, designers, and retailers across India.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
