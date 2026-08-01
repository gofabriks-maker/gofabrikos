import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact GoFabrikos | WhatsApp & Phone Support',
  description: 'Contact GoFabrikos for fabric enquiries. WhatsApp +91 95817 34837. Located at Sri Vasavi WCS, Mangalagiri Road, Guntur 522001, Andhra Pradesh.',
  openGraph: {
    title: 'Contact GoFabrikos | WhatsApp & Phone Support',
    description: 'Contact GoFabrikos for fabric enquiries. WhatsApp +91 95817 34837. Located at Sri Vasavi WCS, Mangalagiri Road, Guntur 522001, Andhra Pradesh.',
    url: 'https://gofabrikos.com/contact',
    siteName: 'GoFabrikos',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact GoFabrikos | WhatsApp & Phone Support',
    description: 'Contact GoFabrikos for fabric enquiries. WhatsApp +91 95817 34837. Located at Sri Vasavi WCS, Mangalagiri Road, Guntur 522001, Andhra Pradesh.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
