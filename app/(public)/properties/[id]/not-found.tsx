export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 text-6xl">🏚️</div>
        <h1 className="mb-4 text-3xl font-bold text-zinc-900">Property Not Found</h1>
        <p className="mb-8 text-zinc-600">
          The property you're looking for doesn't exist or has been removed.
        </p>
        <a
          href="/properties"
          className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-6 py-3 text-white hover:bg-zinc-800"
        >
          Browse All Properties
        </a>
      </div>
    </div>
  )
}
