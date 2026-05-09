import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Profile } from '@/lib/types'

export default async function AdminSellersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') redirect('/dashboard')

  const [
    { count: totalSellers },
    { count: agentCount },
    { count: individualCount },
    { data: sellers },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'seller'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'seller').eq('seller_type', 'agent'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'seller').eq('seller_type', 'individual'),
    supabase.from('profiles').select(`*, properties:properties(count)`).eq('role', 'seller').order('created_at', { ascending: false }),
  ])

  const typedSellers = sellers as (Profile & { properties: { count: number }[] })[] | null

  const stats = [
    { label: 'Total Sellers', value: totalSellers ?? 0, bg: 'bg-[var(--color-surface-2)]', color: 'text-[var(--color-accent)]', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
    { label: 'Agents', value: agentCount ?? 0, bg: 'bg-[var(--color-accent)]', color: 'text-white', textValue: 'text-white', textLabel: 'text-white/80', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { label: 'Individuals', value: individualCount ?? 0, bg: 'bg-[var(--color-surface-2)]', color: 'text-[var(--color-accent)]', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ]

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-text)] mb-1">
            User{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent)]">
              Management
            </span>
          </h1>
          <p className="text-[var(--color-text-muted)]">View and manage all registered sellers on the platform.</p>
        </div>
      </div>

      {/* Stats */}
      <section className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 [scrollbar-width:none]">
        {stats.map(({ label, value, bg, color, textValue, textLabel, icon }) => (
          <div key={label} className={`min-w-[200px] p-5 rounded-xl ${bg} flex flex-col justify-between flex-shrink-0`}>
            <div>
              <div className={`w-8 h-8 flex items-center justify-center mb-2 ${color}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                </svg>
              </div>
              <p className={`text-sm font-medium ${textLabel ?? 'text-[var(--color-text-muted)]'}`}>{label}</p>
            </div>
            <p className={`text-3xl font-extrabold mt-4 tracking-tighter ${textValue ?? 'text-[var(--color-text)]'}`}>{value}</p>
          </div>
        ))}
      </section>

      {/* Table */}
      {!typedSellers || typedSellers.length === 0 ? (
        <div className="bg-[var(--color-surface)] rounded-3xl p-16 text-center shadow-[0_2px_16px_-4px_rgba(10,29,47,0.06)]">
          <p className="text-[var(--color-text-muted)] text-lg mb-2 font-semibold">No sellers registered yet</p>
          <p className="text-[var(--color-text-muted)] text-sm">Sellers will appear here after they create an account.</p>
        </div>
      ) : (
        <div className="bg-[var(--color-surface)] rounded-3xl overflow-hidden shadow-[0_2px_16px_-4px_rgba(10,29,47,0.06)] border border-[var(--color-border)]/5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-surface-2)]/50">
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Seller</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Type</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">WhatsApp</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Properties</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Joined</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-surface-2)]">
              {typedSellers.map((seller) => {
                const propertyCount = seller.properties?.[0]?.count || 0
                const typeStyles: Record<string, string> = {
                  agent: 'bg-[var(--color-accent-muted)] text-[var(--color-accent)]',
                  developer: 'bg-[var(--color-accent-muted)]/50 text-[var(--color-accent)]',
                  individual: 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)]',
                }
                const typeStyle = typeStyles[seller.seller_type ?? 'individual'] ?? typeStyles.individual

                return (
                  <tr key={seller.id} className="hover:bg-[var(--color-surface-2)]/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-surface-2)] to-[var(--color-surface)] flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-[var(--color-accent)]">
                            {(seller.company_name || 'S').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-[var(--color-text)] text-sm leading-tight">
                            {seller.company_name || 'Individual Seller'}
                          </p>
                          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{seller.id.slice(0, 8)}…</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize ${typeStyle}`}>
                        {seller.seller_type || 'individual'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm text-[var(--color-text-muted)] font-medium">
                        {seller.whatsapp_number || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-accent-muted)] text-[var(--color-accent)] text-xs font-bold">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        {propertyCount}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm text-[var(--color-text-muted)] font-medium">
                        {new Date(seller.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <Link
                        href={`/admin/sellers/${seller.id}`}
                        className="text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="px-8 py-4 bg-[var(--color-surface-2)]/20 border-t border-[var(--color-border)]/10">
            <p className="text-sm text-[var(--color-text-muted)] font-medium">
              Showing <span className="text-[var(--color-text)] font-bold">{typedSellers.length}</span> sellers
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
