import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Wishlist | GoFabrikos',
  description: 'View and manage your saved fabrics on GoFabrikos.',
  robots: { index: false, follow: false },
}

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
