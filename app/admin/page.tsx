import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') redirect('/dashboard')

  const [
    { count: totalSellers },
    { count: totalProperties },
    { count: activeProperties },
    { count: pendingProperties },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'seller'),
    supabase.from('properties').select('*', { count: 'exact', head: true }),
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
  ])

  const { data: recentProperties } = await supabase
    .from('properties')
    .select('id, title, property_type, status, created_at, state')
    .order('created_at', { ascending: false })
    .limit(8)

  const stats = [
    { label: 'Total Users', value: totalSellers ?? 0, badge: '+12%', badgeColor: 'text-green-600 bg-green-50', icon: 'bg-blue-50 text-blue-600', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /> },
    { label: 'Active Properties', value: activeProperties ?? 0, badge: '+5.2%', badgeColor: 'text-green-600 bg-green-50', icon: 'bg-purple-50 text-purple-600', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /> },
    { label: 'Total Listings', value: totalProperties ?? 0, badge: '+8.1%', badgeColor: 'text-green-600 bg-green-50', icon: 'bg-emerald-50 text-emerald-600', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /> },
    { label: 'Pending Review', value: pendingProperties ?? 0, badge: pendingProperties ? `${pendingProperties} new` : '0', badgeColor: pendingProperties ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50', icon: 'bg-orange-50 text-orange-600', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
  ]

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Top Nav */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border)]/10">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--color-text)]">Welcome, Admin!</h1>
          <p className="text-sm text-[var(--color-text-muted)] font-medium mt-1">High-level platform health overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </span>
            <input className="pl-9 pr-4 py-2 bg-[var(--color-surface-2)] border-none rounded-lg text-sm w-56 focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:outline-none transition-all" placeholder="Search data..." />
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ label, value, badge, badgeColor, icon, svg }) => (
          <div key={label} className="bg-white p-6 rounded-xl shadow-[0_2px_16px_-4px_rgba(10,29,47,0.06)]">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg ${icon}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{svg}</svg>
              </div>
              <span className={`flex items-center text-xs font-bold px-2.5 py-1 rounded-full ${badgeColor}`}>
                {badge}
              </span>
            </div>
            <div className="text-[var(--color-text-muted)] text-xs font-semibold uppercase tracking-wider mb-1">{label}</div>
            <div className="text-3xl font-extrabold tracking-tight text-[var(--color-text)]">{value.toLocaleString()}</div>
          </div>
        ))}
      </section>

      {/* Quick Links */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { href: '/admin/sellers', label: 'Manage Users', sub: 'View and manage seller accounts', color: 'bg-blue-50 text-blue-600' },
          { href: '/admin/properties', label: 'Property Inventory', sub: 'Review, edit and delete listings', color: 'bg-purple-50 text-purple-600' },
          { href: '/admin/blog', label: 'Blog & Content', sub: 'Publish and manage blog posts', color: 'bg-emerald-50 text-emerald-600' },
        ].map(({ href, label, sub, color }) => (
          <Link key={href} href={href} className="bg-white rounded-xl p-6 hover:shadow-md transition-shadow shadow-[0_2px_16px_-4px_rgba(10,29,47,0.04)] flex items-center gap-4">
            <div className={`p-3 rounded-lg ${color} flex-shrink-0`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
            <div>
              <p className="font-semibold text-[var(--color-text)]">{label}</p>
              <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{sub}</p>
            </div>
          </Link>
        ))}
      </section>

      {/* Market Activity Table */}
      <section className="bg-white rounded-xl shadow-[0_2px_16px_-4px_rgba(10,29,47,0.06)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-border)]/10">
          <div>
            <h2 className="font-bold text-[var(--color-text)]">Market Activity</h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Most recent platform transactions</p>
          </div>
          <Link href="/admin/properties" className="text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors">
            Load Detailed History →
          </Link>
        </div>
        {!recentProperties || recentProperties.length === 0 ? (
          <p className="px-6 py-8 text-sm text-[var(--color-text-muted)]">No properties yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--color-surface-2)]/50 border-b border-[var(--color-border)]/10">
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Transaction ID</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Property</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]/10">
                {(recentProperties as any[]).map((p) => (
                  <tr key={p.id} className="hover:bg-[var(--color-surface-2)]/30 transition-colors">
                    <td className="px-6 py-4 text-[var(--color-text-muted)] font-mono text-xs">
                      #PL-{p.id.slice(0, 5).toUpperCase()}
                    </td>
                    <td className="px-4 py-4 font-medium text-[var(--color-text)]">{p.title}</td>
                    <td className="px-4 py-4 text-[var(--color-text-muted)] capitalize">{p.property_type}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        p.status === 'active' ? 'bg-green-50 text-green-700' :
                        p.status === 'sold' ? 'bg-orange-50 text-orange-700' :
                        p.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                        'bg-[var(--color-surface-2)] text-[var(--color-text-muted)]'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[var(--color-text-muted)]">
                      {new Date(p.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
