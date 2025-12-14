export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-2 text-sm">
        <div className="h-4 w-32 animate-pulse rounded bg-zinc-200"></div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Gallery skeleton */}
          <div className="aspect-video w-full animate-pulse rounded-lg bg-zinc-200"></div>
          
          {/* Title skeleton */}
          <div className="space-y-3">
            <div className="h-6 w-24 animate-pulse rounded bg-zinc-200"></div>
            <div className="h-10 w-3/4 animate-pulse rounded bg-zinc-200"></div>
          </div>

          {/* Price skeleton */}
          <div className="h-24 animate-pulse rounded-lg bg-zinc-100"></div>

          {/* Description skeleton */}
          <div className="space-y-2">
            <div className="h-6 w-32 animate-pulse rounded bg-zinc-200"></div>
            <div className="h-4 animate-pulse rounded bg-zinc-100"></div>
            <div className="h-4 animate-pulse rounded bg-zinc-100"></div>
            <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-100"></div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="h-64 animate-pulse rounded-lg bg-zinc-100"></div>
        </div>
      </div>
    </div>
  )
}
