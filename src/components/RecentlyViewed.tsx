'use client'

import Link from 'next/link'
import { Clock } from 'lucide-react'
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed'

interface Props {
  excludeId?: number   // exclude the current product from the list
}

export default function RecentlyViewed({ excludeId }: Props) {
  const { recent, loaded } = useRecentlyViewed()

  const display = recent.filter(p => p.id !== excludeId).slice(0, 5)

  if (!loaded || display.length === 0) return null

  return (
    <section className="py-10 border-t border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-5">
          <Clock size={17} className="text-stone-400" />
          <h2 className="text-base font-semibold text-stone-700">Recently Viewed</h2>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {display.map(product => (
            <Link
              key={product.id}
              href={`/fabrics/${product.slug}`}
              className="flex-shrink-0 w-36 group"
            >
              <div className="aspect-square rounded-xl overflow-hidden bg-stone-100 mb-2">
                <img
                  src={product.image_url || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-xs font-semibold text-stone-700 line-clamp-2 leading-tight group-hover:text-rose-600 transition-colors">
                {product.name}
              </p>
              <p className="text-xs text-rose-600 font-bold mt-0.5">₹{product.price}/m</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
