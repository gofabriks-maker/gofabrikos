import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About GoFabrikos | Premium Fabric Store, Guntur',
  description: 'GoFabrikos is a premium online fabric store by Lakshmi Sowjanya Aaki, Guntur. Specialising in Chanderi, Silk, Cotton and Handloom fabrics across India.',
  openGraph: {
    title: 'About GoFabrikos | Premium Fabric Store, Guntur',
    description: 'GoFabrikos is a premium online fabric store by Lakshmi Sowjanya Aaki, Guntur. Specialising in Chanderi, Silk, Cotton and Handloom fabrics across India.',
    url: 'https://gofabrikos.com/about',
    siteName: 'GoFabrikos',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About GoFabrikos | Premium Fabric Store, Guntur',
    description: 'GoFabrikos is a premium online fabric store by Lakshmi Sowjanya Aaki, Guntur. Specialising in Chanderi, Silk, Cotton and Handloom fabrics across India.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
