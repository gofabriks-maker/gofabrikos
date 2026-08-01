import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Fabric Swatch | GoFabrikos',
  description: 'Get free fabric swatches delivered to your door before buying. Try before you buy — available on select GoFabrikos fabrics.',
  openGraph: {
    title: 'Free Fabric Swatch | GoFabrikos',
    description: 'Get free fabric swatches delivered to your door before buying. Try before you buy — available on select GoFabrikos fabrics.',
    url: 'https://gofabrikos.com/free-swatch',
    siteName: 'GoFabrikos',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Fabric Swatch | GoFabrikos',
    description: 'Get free fabric swatches delivered to your door before buying. Try before you buy — available on select GoFabrikos fabrics.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
