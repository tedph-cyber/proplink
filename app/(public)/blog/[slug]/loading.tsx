export default function BlogPostLoading() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-8">
        <div className="h-4 w-12 rounded bg-zinc-200" />
        <div className="h-3 w-3 rounded bg-zinc-200" />
        <div className="h-4 w-10 rounded bg-zinc-200" />
        <div className="h-3 w-3 rounded bg-zinc-200" />
        <div className="h-4 w-40 rounded bg-zinc-200" />
      </div>

      {/* Cover image skeleton */}
      <div className="rounded-2xl bg-zinc-200 aspect-[16/7] mb-8" />

      {/* Header skeleton */}
      <div className="mb-8 space-y-3">
        <div className="h-5 w-24 rounded-full bg-zinc-200" />
        <div className="h-9 w-3/4 rounded bg-zinc-200" />
        <div className="h-9 w-1/2 rounded bg-zinc-200" />
        <div className="flex gap-3 mt-4">
          <div className="h-4 w-24 rounded bg-zinc-200" />
          <div className="h-4 w-16 rounded bg-zinc-200" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="space-y-3 mb-12">
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`h-4 rounded bg-zinc-200 ${i % 5 === 4 ? 'w-2/3' : 'w-full'}`} />
        ))}
        <div className="h-6 w-1/3 rounded bg-zinc-200 mt-6" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`h-4 rounded bg-zinc-200 ${i % 4 === 3 ? 'w-3/4' : 'w-full'}`} />
        ))}
      </div>
    </div>
  )
}
