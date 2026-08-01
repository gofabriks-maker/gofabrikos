import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: {
    default: "GoFabrikos – India's Finest Fabrics | Buy Fabric Online",
    template: '%s | GoFabrikos',
  },
  description: "Shop 2400+ premium Indian fabrics – Chanderi, Silk, Cotton, Georgette. Priced per meter. Free swatch. GST invoice. Pan-India delivery from Guntur, Andhra Pradesh.",
  keywords: "buy fabric online, chanderi fabric, silk fabric India, blouse fabric, saree fabric, fabric per meter, kanjivaram silk, banarasi fabric, GoFabrikos",
  authors: [{ name: 'GoFabrikos' }],
  creator: 'GoFabrikos',
  publisher: 'GoFabrikos',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: "GoFabrikos – India's Finest Fabrics",
    description: "Shop 2400+ premium Indian fabrics priced per meter. Free swatch. GST invoice. Pan-India delivery.",
    url: "https://gofabrikos.com",
    siteName: "GoFabrikos",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: 'summary_large_image',
    title: "GoFabrikos – India's Finest Fabrics",
    description: "Shop 2400+ premium Indian fabrics priced per meter.",
    creator: '@gofabrikos',
  },
  verification: {
    google: 'add-your-google-search-console-code-here',
  },
  alternates: {
    canonical: 'https://gofabrikos.com',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
