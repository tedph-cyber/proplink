export default function Loading() {
  return (
    <div className="container-base py-8 lg:py-12">
      <div className="mb-8">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-[var(--color-surface-2)]"></div>
        <div className="mt-2 h-6 w-32 animate-pulse rounded bg-[var(--color-surface-2)]"></div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="overflow-hidden rounded-lg border border-[var(--color-border)]">
            <div className="aspect-4/3 animate-pulse bg-[var(--color-surface-2)]"></div>
            <div className="p-4 space-y-3">
              <div className="h-6 animate-pulse rounded bg-[var(--color-surface-2)]"></div>
              <div className="h-8 w-32 animate-pulse rounded bg-[var(--color-surface-2)]"></div>
              <div className="h-4 animate-pulse rounded bg-[var(--color-surface-2)]"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
