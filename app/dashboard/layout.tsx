import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* Sidebar */}
      <aside className="hidden md:flex h-screen w-64 fixed left-0 top-0 flex-col z-40" style={{ background: 'var(--color-surface)', borderRight: '1px solid var(--color-border)' }}>
        <div className="flex flex-col h-full py-8">
          {/* Brand */}
          <div className="px-8 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-accent)' }}>
                <span className="font-black text-sm" style={{ color: 'var(--color-text)' }}>ST</span>
              </div>
              <div>
                <h2 className="font-bold text-lg tracking-tight leading-none" style={{ color: 'var(--color-text)' }}>StrongTower Holdings</h2>
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase mt-0.5" style={{ color: 'var(--color-accent)' }}>Building Legacies</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-1 px-4">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-full font-semibold text-sm transition-transform hover:translate-x-0.5"
              style={{ background: 'var(--color-accent)', color: 'var(--color-text)' }}>
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Dashboard
            </Link>
            <Link href="/dashboard/properties" className="flex items-center gap-3 px-4 py-2.5 rounded-full font-medium text-sm hover:bg-[var(--color-surface-2)] hover:translate-x-0.5 transition-all"
              style={{ color: 'var(--color-text-muted)' }}>
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              My Listings
            </Link>
            <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-2.5 rounded-full font-medium text-sm hover:bg-[var(--color-surface-2)] hover:translate-x-0.5 transition-all"
              style={{ color: 'var(--color-text-muted)' }}>
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </Link>
            <Link href="/properties" className="flex items-center gap-3 px-4 py-2.5 rounded-full font-medium text-sm hover:bg-[var(--color-surface-2)] hover:translate-x-0.5 transition-all"
              style={{ color: 'var(--color-text-muted)' }}>
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Browse
            </Link>
          </nav>

          {/* CTA */}
          <div className="px-6 mt-auto">
            <Link href="/dashboard/properties/new" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
              style={{ background: 'var(--color-accent)', color: 'var(--color-text)' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              List New Property
            </Link>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30"
          style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
          <div className="flex items-center justify-between px-6 md:px-8 py-4">
            <h1 className="font-bold text-xl tracking-tight" style={{ color: 'var(--color-text)' }}>StrongTower Holdings</h1>
            <div className="flex items-center gap-3">
              <Link href="/" className="text-sm font-medium transition-colors"
                style={{ color: 'var(--color-text-muted)' }}>
                ← Home
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
