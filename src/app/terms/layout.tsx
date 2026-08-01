import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions | GoFabrikos',
  description: 'Terms and conditions for purchasing fabrics on GoFabrikos. Governed by courts of Guntur, Andhra Pradesh.',
  openGraph: {
    title: 'Terms & Conditions | GoFabrikos',
    description: 'Terms and conditions for purchasing fabrics on GoFabrikos. Governed by courts of Guntur, Andhra Pradesh.',
    url: 'https://gofabrikos.com/terms',
    siteName: 'GoFabrikos',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms & Conditions | GoFabrikos',
    description: 'Terms and conditions for purchasing fabrics on GoFabrikos. Governed by courts of Guntur, Andhra Pradesh.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
