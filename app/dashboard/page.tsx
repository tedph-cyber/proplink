import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Profile } from '@/lib/types'
import { SectionReveal, StaggerReveal, StaggerItem } from '@/components/ui/motion-wrappers'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const typedProfile = profile as Profile | null

  // Count user's properties
  const { count: propertiesCount } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('seller_id', user.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <SectionReveal className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--foreground)] tracking-tight">Dashboard</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">Welcome back, {user.email}</p>
      </SectionReveal>

      <StaggerReveal className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
        {/* Properties Card */}
        <StaggerItem>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 h-full">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">Total Properties</p>
              <p className="mt-2 text-3xl font-bold text-[var(--foreground)]">{propertiesCount || 0}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100/80 dark:bg-blue-500/20 flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          </div>
        </div>
        </StaggerItem>

        {/* Account Type Card */}
        <StaggerItem>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 h-full">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">Account Type</p>
              <p className="mt-2 text-lg font-semibold text-[var(--foreground)] capitalize">
                {typedProfile?.seller_type || 'Individual'}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100/80 dark:bg-green-500/20 flex items-center justify-center">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>
        </StaggerItem>

        {/* WhatsApp Card */}
        <StaggerItem>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 h-full">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">WhatsApp</p>
              <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                {typedProfile?.whatsapp_number || 'Not set'}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-emerald-100/80 dark:bg-emerald-500/20 flex items-center justify-center">
              <svg className="h-6 w-6 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
          </div>
        </div>
        </StaggerItem>
      </StaggerReveal>

      {/* Quick Actions */}
      <SectionReveal>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="mb-4 text-lg font-semibold text-[var(--foreground)]">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/dashboard/properties/new"
            className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-4 transition-colors hover:bg-[var(--muted)] hover:shadow-sm"
          >
            <div className="h-10 w-10 rounded-full bg-blue-100/80 dark:bg-blue-500/20 flex items-center justify-center">
              <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-[var(--foreground)]">Add Property</p>
              <p className="text-xs text-[var(--muted-foreground)]">List a new property</p>
            </div>
          </Link>

          <Link
            href="/dashboard/properties"
            className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-4 transition-colors hover:bg-[var(--muted)] hover:shadow-sm"
          >
            <div className="h-10 w-10 rounded-full bg-green-100/80 dark:bg-green-500/20 flex items-center justify-center">
              <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-[var(--foreground)]">My Properties</p>
              <p className="text-xs text-[var(--muted-foreground)]">View all listings</p>
            </div>
          </Link>

          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-4 transition-colors hover:bg-[var(--muted)] hover:shadow-sm"
          >
            <div className="h-10 w-10 rounded-full bg-purple-100/80 dark:bg-purple-500/20 flex items-center justify-center">
              <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-[var(--foreground)]">Profile</p>
              <p className="text-xs text-[var(--muted-foreground)]">Edit your details</p>
            </div>
          </Link>

          <Link
            href="/properties"
            className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-4 transition-colors hover:bg-[var(--muted)] hover:shadow-sm"
          >
            <div className="h-10 w-10 rounded-full bg-orange-100/80 dark:bg-orange-500/20 flex items-center justify-center">
              <svg className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-[var(--foreground)]">Browse</p>
              <p className="text-xs text-[var(--muted-foreground)]">View marketplace</p>
            </div>
          </Link>
        </div>
      </div>
      </SectionReveal>
    </div>
  )
}

