export default function FabricCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 animate-pulse">
      {/* Image placeholder */}
      <div className="aspect-[3/4] bg-stone-200" />
      {/* Content */}
      <div className="p-3 space-y-2">
        <div className="h-2.5 bg-stone-200 rounded w-1/3" />
        <div className="h-3 bg-stone-200 rounded w-4/5" />
        <div className="h-3 bg-stone-200 rounded w-3/5" />
        <div className="flex items-center gap-1 pt-1">
          <div className="h-2 bg-stone-200 rounded w-16" />
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="h-4 bg-stone-200 rounded w-20" />
          <div className="h-4 bg-stone-200 rounded w-10" />
        </div>
        <div className="h-8 bg-stone-200 rounded-xl w-full mt-1" />
      </div>
    </div>
  )
}

export function FabricGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <FabricCardSkeleton key={i} />
      ))}
    </div>
  )
}
