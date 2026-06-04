export default function SkeletonLoader({ className = '' }) {
  return <div className={`bg-slate-200 animate-pulse rounded-xl ${className}`} />
}

export function SkeletonCard() {
  return (
    <div className="card space-y-3">
      <SkeletonLoader className="h-4 w-2/3" />
      <SkeletonLoader className="h-3 w-full" />
      <SkeletonLoader className="h-3 w-4/5" />
    </div>
  )
}