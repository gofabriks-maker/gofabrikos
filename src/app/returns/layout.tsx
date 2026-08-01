import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Returns & Shipping Policy | GoFabrikos',
  description: 'GoFabrikos offers 7-day easy returns, free shipping above ₹999, and 3–5 day refunds. Pan-India delivery via DTDC and Blue Dart.',
  openGraph: {
    title: 'Returns & Shipping Policy | GoFabrikos',
    description: 'GoFabrikos offers 7-day easy returns, free shipping above ₹999, and 3–5 day refunds. Pan-India delivery via DTDC and Blue Dart.',
    url: 'https://gofabrikos.com/returns',
    siteName: 'GoFabrikos',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Returns & Shipping Policy | GoFabrikos',
    description: 'GoFabrikos offers 7-day easy returns, free shipping above ₹999, and 3–5 day refunds. Pan-India delivery via DTDC and Blue Dart.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
