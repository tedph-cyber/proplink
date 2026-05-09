import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') redirect('/dashboard')

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
    )},
    { href: '/admin/properties', label: 'Properties', icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
    )},
    { href: '/admin/sellers', label: 'Users', icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    )},
    { href: '/admin/blog', label: 'Blog', icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
    )},
  ]

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* Sidebar */}
      <aside className="hidden md:flex h-screen w-64 fixed left-0 top-0 flex-col z-40"
        style={{ background: 'var(--color-surface)', borderRight: '1px solid var(--color-border)' }}>
        <div className="flex flex-col h-full">
          {/* Brand */}
          <div className="px-6 pt-8 pb-6" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <span className="text-xl font-extrabold tracking-tight" style={{ color: 'var(--color-accent)' }}>StrongTower</span>
            <div className="mt-1 text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--color-text-muted)' }}>Holdings Management</div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map(({ href, label, icon }) => (
              <Link key={href} href={href} className="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm hover:translate-x-0.5 transition-all"
                style={{ color: 'var(--color-text-muted)' }}>
                {icon}
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="p-4" style={{ borderTop: '1px solid var(--color-border)' }}>
            <Link href="/dashboard/properties/new" className="w-full flex items-center justify-center gap-2 py-3 rounded-full font-bold text-sm"
              style={{ background: 'var(--color-accent)', color: 'var(--color-text)' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add New Listing
            </Link>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
