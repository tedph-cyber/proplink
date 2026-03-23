import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BlogPost, BLOG_CATEGORIES } from '@/lib/types'
import { DeleteBlogPostButton } from '@/components/blog/delete-blog-post-button'
import { PublishToggleButton } from '@/components/blog/publish-toggle-button'

export default async function AdminBlogPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') redirect('/dashboard')

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })

  const typedPosts = (posts || []) as BlogPost[]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Blog Posts</h1>
          <p className="mt-1 text-zinc-500 text-sm">
            {typedPosts.length} {typedPosts.length === 1 ? 'post' : 'posts'} total
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[#0568fd] text-white px-5 py-2.5 text-sm font-semibold hover:bg-[#0568fd]/90 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Post
        </Link>
      </div>

      {typedPosts.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-zinc-200 p-16 text-center">
          <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-zinc-100 flex items-center justify-center">
            <svg className="h-7 w-7 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-zinc-800 mb-1">No posts yet</h2>
          <p className="text-sm text-zinc-500 mb-5">Create your first blog post to get started.</p>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0568fd] text-white px-5 py-2.5 text-sm font-semibold hover:bg-[#0568fd]/90 transition-colors"
          >
            Write First Post
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th className="py-3 px-4 text-left font-medium text-zinc-600">Title</th>
                  <th className="py-3 px-4 text-left font-medium text-zinc-600 hidden sm:table-cell">Category</th>
                  <th className="py-3 px-4 text-left font-medium text-zinc-600">Status</th>
                  <th className="py-3 px-4 text-left font-medium text-zinc-600 hidden md:table-cell">Date</th>
                  <th className="py-3 px-4 text-right font-medium text-zinc-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {typedPosts.map(post => {
                  const cat = BLOG_CATEGORIES.find(c => c.value === post.category)
                  const date = post.published_at
                    ? new Date(post.published_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
                    : new Date(post.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
                  return (
                    <tr key={post.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-zinc-900 line-clamp-1">{post.title}</div>
                        <div className="text-xs text-zinc-400 mt-0.5">/blog/{post.slug}</div>
                      </td>
                      <td className="py-3 px-4 text-zinc-600 hidden sm:table-cell">
                        {cat?.label}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          post.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-zinc-100 text-zinc-600'
                        }`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-zinc-500 hidden md:table-cell text-xs">
                        {date}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="text-xs text-zinc-500 hover:text-zinc-800 transition-colors px-2 py-1 rounded hover:bg-zinc-100"
                          >
                            View
                          </Link>
                          <Link
                            href={`/admin/blog/${post.id}/edit`}
                            className="text-xs text-blue-600 hover:text-blue-800 transition-colors px-2 py-1 rounded hover:bg-blue-50"
                          >
                            Edit
                          </Link>
                          <PublishToggleButton postId={post.id} currentStatus={post.status} />
                          <DeleteBlogPostButton postId={post.id} postTitle={post.title} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
