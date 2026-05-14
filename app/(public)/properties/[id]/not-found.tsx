export default function NotFound() {
  return (
    <div className="container-base py-16">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 text-6xl">🏚️</div>
        <h1 className="mb-4 text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
          Property Not Found
        </h1>
        <p className="mb-8" style={{ color: 'var(--color-text-muted)' }}>
          The property you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <a
          href="/properties"
          className="inline-flex items-center justify-center rounded-lg px-6 py-3 transition-colors"
          style={{
            background: 'var(--color-accent)',
            color: 'var(--color-text)',
          }}
        >
          Browse All Properties
        </a>
      </div>
    </div>
  )
}
