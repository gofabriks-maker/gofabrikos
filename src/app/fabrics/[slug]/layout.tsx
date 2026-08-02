import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const name = params.slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
  return {
    title: `${name} | Buy Online at GoFabrikos`,
    description: `Buy ${name} fabric online at GoFabrikos. Priced per metre. GST invoice on every order. Pan-India delivery.`,
    openGraph: {
      title: `${name} | GoFabrikos`,
      description: `Buy ${name} fabric per metre at GoFabrikos GST invoice. Pan-India delivery.`,
      url: `https://gofabrikos.com/fabrics/${params.slug}`,
      siteName: 'GoFabrikos',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} | GoFabrikos`,
      description: `Buy ${name} fabric per metre at GoFabrikos.`,
    },
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
