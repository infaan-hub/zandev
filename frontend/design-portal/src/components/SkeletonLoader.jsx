export function SkeletonLine({ width = '100%', height = '12px', className = '' }) {
  return <div className={`bg-white/[0.04] rounded animate-pulse ${className}`} style={{ width, height }} />
}

export function SkeletonCircle({ size = 32, className = '' }) {
  return <div className={`bg-white/[0.04] rounded-full animate-pulse ${className}`} style={{ width: size, height: size }} />
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`rounded-[14px] border border-white/[0.06] bg-[#080808] p-4 space-y-3 ${className}`}>
      <SkeletonLine height="120px" className="rounded-lg" />
      <SkeletonLine width="60%" height="14px" />
      <SkeletonLine width="40%" height="10px" />
      <div className="flex gap-2">
        <SkeletonLine width="60px" height="20px" className="rounded-full" />
        <SkeletonLine width="40px" height="20px" className="rounded-full" />
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  )
}
