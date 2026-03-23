import Link from 'next/link'

export default function BlogPostNotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center max-w-lg">
      <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-zinc-100 flex items-center justify-center">
        <svg className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-zinc-900 mb-2">Post not found</h1>
      <p className="text-zinc-500 mb-6 text-sm">
        This post may have been moved, removed, or the URL is incorrect.
      </p>
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 rounded-full bg-[#0568fd] text-white px-5 py-2 text-sm font-semibold hover:bg-[#0568fd]/90 transition-colors"
      >
        Back to Blog
      </Link>
    </div>
  )
}
