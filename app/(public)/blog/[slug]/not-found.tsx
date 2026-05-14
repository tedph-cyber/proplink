import Link from 'next/link'

export default function BlogNotFound() {
  return (
    <main className="px-6 lg:px-10 py-16 lg:py-20 max-w-7xl mx-auto text-center">
      <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-bold text-xs tracking-widest uppercase mb-6">
        404
      </span>
      <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-text)] mb-4">Post not found</h1>
      <p className="text-[var(--color-text-muted)] mb-8">This article may have been moved or doesn&apos;t exist.</p>
      <Link href="/blog" className="bg-[var(--color-accent)] px-8 py-3 rounded-xl text-white font-bold text-sm inline-block">
        Back to Blog →
      </Link>
    </main>
  )
}
