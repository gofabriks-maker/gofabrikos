import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | GoFabrikos',
  description: 'GoFabrikos privacy policy — how we collect, use, and protect your personal data.',
  openGraph: {
    title: 'Privacy Policy | GoFabrikos',
    description: 'GoFabrikos privacy policy — how we collect, use, and protect your personal data.',
    url: 'https://gofabrikos.com/privacy',
    siteName: 'GoFabrikos',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | GoFabrikos',
    description: 'GoFabrikos privacy policy — how we collect, use, and protect your personal data.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
