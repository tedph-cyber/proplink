import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Profile } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const typedProfile = profile as Profile | null

  const { count: propertiesCount } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('seller_id', user.id)

  const { data: recentProperties } = await supabase
    .from('properties')
    .select('id, title, state, status, created_at')
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const displayName = typedProfile?.company_name || user.email?.split('@')[0] || 'Seller'

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Hero Welcome Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-[var(--color-text)] min-h-[220px] flex items-center p-10 md:p-12">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-text)] via-[var(--color-text)]/80 to-transparent z-10" />
        <div className="absolute inset-0 opacity-20"
          style={{ background: 'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop") center/cover no-repeat' }}
        />
        <div className="relative z-20 space-y-2">
          <span className="text-xs tracking-[0.2em] text-[#b2c5ff] uppercase font-bold">Curator Workspace</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Welcome back, {displayName}</h2>
          <p className="text-white/60 text-lg max-w-md">
            Manage your listings and reach buyers across Nigeria.
          </p>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            label: 'Total Properties',
            value: propertiesCount ?? 0,
            badge: '+2',
            color: 'text-[var(--color-accent)]',
            bg: 'bg-[var(--color-accent-muted)]',
            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
          },
          {
            label: 'Total Views',
            value: '4.2k',
            badge: '+12%',
            color: 'text-[var(--color-accent)]',
            bg: 'bg-[var(--color-accent-muted)]/40',
            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />,
          },
          {
            label: 'Active Inquiries',
            value: '28',
            badge: '+8',
            color: 'text-[var(--color-accent)]',
            bg: 'bg-[var(--color-accent-muted)]/50',
            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
          },
          {
            label: 'Estimated ROI',
            value: '18%',
            badge: '+2.4%',
            color: 'text-[var(--color-accent)]',
            bg: 'bg-[var(--color-accent-muted)]',
            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
          },
        ].map(({ label, value, badge, color, bg, icon }) => (
          <div key={label} className="bg-[var(--color-surface)] rounded-3xl p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 shadow-[0_2px_16px_-4px_rgba(10,29,47,0.06)]">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center ${color}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
              </div>
              <span className="text-xs font-bold bg-green-50 text-green-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                {badge}
              </span>
            </div>
            <div>
              <p className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider font-bold mb-1">{label}</p>
              <h3 className="text-3xl font-extrabold text-[var(--color-text)]">{value}</h3>
            </div>
          </div>
        ))}
      </section>

      {/* Quick Actions */}
      <section className="space-y-4">
        <h3 className="text-2xl font-extrabold text-[var(--color-text)] tracking-tight">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { href: '/dashboard/properties/new', label: 'List New Property', sub: 'Add a listing', color: 'bg-[var(--color-accent-muted)]', active: 'hover:bg-[var(--color-accent)] hover:text-white', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /> },
            { href: '/properties', label: 'Market Insights', sub: 'Browse market', color: 'bg-[var(--color-accent-muted)]/40', active: 'hover:bg-[var(--color-accent)] hover:text-white', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /> },
            { href: '/dashboard/properties', label: 'Manage Listings', sub: 'View all', color: 'bg-[var(--color-accent-muted)]/50', active: 'hover:bg-[var(--color-accent)] hover:text-white', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /> },
            { href: '/dashboard/profile', label: 'Safety Guide', sub: 'Update profile', color: 'bg-[var(--color-accent-muted)]', active: 'hover:bg-[var(--color-accent)] hover:text-white', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /> },
          ].map(({ href, label, sub, color, active, icon }) => (
            <Link key={href} href={href} className={`group relative ${color} p-8 rounded-3xl text-left overflow-hidden transition-all duration-300 ${active}`}>
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white/60 group-hover:bg-white/20 flex items-center justify-center text-[var(--color-accent)] group-hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
                </div>
                <div>
                  <p className="font-bold text-sm">{label}</p>
                  <p className="text-xs opacity-60 mt-0.5">{sub}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="bg-[var(--color-surface)] rounded-3xl shadow-[0_2px_16px_-4px_rgba(10,29,47,0.06)] overflow-hidden">
        <div className="flex items-center justify-between px-8 py-6 border-b border-[var(--color-border)]/10">
          <h3 className="text-lg font-bold text-[var(--color-text)]">Recent Activity</h3>
          <Link href="/dashboard/properties" className="text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors">
            View all activity →
          </Link>
        </div>

        {!recentProperties || recentProperties.length === 0 ? (
          <div className="px-8 py-12 text-center text-[var(--color-text-muted)] text-sm">
            No listings yet.{' '}
            <Link href="/dashboard/properties/new" className="text-[var(--color-accent)] font-semibold hover:underline">Add your first property →</Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]/10 bg-[var(--color-surface-2)]/50">
                <th className="px-8 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Listing Detail</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Date Listed</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Status</th>
                <th className="px-8 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]/10">
              {(recentProperties as any[]).map((p) => (
                <tr key={p.id} className="hover:bg-[var(--color-surface-2)]/40 transition-colors">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[var(--color-surface-2)] flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--color-text)] leading-tight">{p.title}</p>
                        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{p.state}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[var(--color-text-muted)]">
                    {new Date(p.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      p.status === 'active' ? 'bg-green-50 text-green-700' :
                      p.status === 'sold' ? 'bg-orange-50 text-orange-700' :
                      'bg-[var(--color-surface-2)] text-[var(--color-text-muted)]'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <Link href={`/properties/${p.id}`} className="text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors">
                      View Analytics
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}
