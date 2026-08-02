import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Buy Fabrics Online | GoFabrikos — Chanderi, Silk, Cotton, Georgette',
  description: 'Shop 2400+ premium Indian fabrics per metre — Chanderi, Banarasi Silk, Kanjivaram, Georgette, Cotton, Linen GST invoice. Pan-India delivery.',
  keywords: 'buy fabric online India, chanderi fabric, silk fabric, kanjivaram silk, georgette fabric, cotton fabric per metre, blouse fabric',
  openGraph: {
    title: 'Buy Fabrics Online | GoFabrikos',
    description: 'Shop 2400+ premium Indian fabrics per metre GST invoice. Pan-India delivery.',
    url: 'https://gofabrikos.com/fabrics',
    siteName: 'GoFabrikos',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buy Fabrics Online | GoFabrikos',
    description: 'Shop 2400+ premium Indian fabrics per metre GST invoice.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
