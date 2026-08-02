import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ | GoFabrikos Fabric Store',
  description: 'Frequently asked questions about ordering, fabric quality, shipping, returns, and fabric quality at GoFabrikos.',
  openGraph: {
    title: 'FAQ | GoFabrikos Fabric Store',
    description: 'Frequently asked questions about ordering, fabric quality, shipping, returns, and fabric quality at GoFabrikos.',
    url: 'https://gofabrikos.com/faq',
    siteName: 'GoFabrikos',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ | GoFabrikos Fabric Store',
    description: 'Frequently asked questions about ordering, fabric quality, shipping, returns, and fabric quality at GoFabrikos.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
