import { memo } from 'react'

const SkeletonCard = memo(function SkeletonCard({ index }: { index: number }) {
  return (
    <div
      className="card p-5 animate-pulse"
      style={{ animationDelay: `${index * 100}ms` }}
      aria-hidden="true"
    >
      {/* Domain skeleton */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-4 h-4 rounded-sm bg-zinc-800" />
        <div className="h-3 w-32 rounded bg-zinc-800" />
      </div>
      {/* Title skeleton */}
      <div className="h-5 w-3/4 rounded bg-zinc-800 mb-3" />
      {/* Description skeleton lines */}
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-zinc-800/70" />
        <div className="h-3 w-5/6 rounded bg-zinc-800/70" />
        <div className="h-3 w-2/3 rounded bg-zinc-800/70" />
      </div>
    </div>
  )
})

export default SkeletonCard
