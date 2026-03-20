import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { UserMenu } from './user-menu'
import { MobileNav } from './mobile-nav'
import { ToggleTheme } from '@/components/ui/toggle-theme'
import { HeaderShell } from './header-shell'

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    isAdmin = profile?.role === 'admin'
  }

  return (
    <HeaderShell>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 transition-transform hover:scale-105">
          <span className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-[#0568fd] to-[#c379df] bg-clip-text text-transparent tracking-tight">
            PropLink
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          <Link
            href="/properties"
            className="text-sm font-medium text-[var(--foreground)] transition-colors hover:text-[var(--primary)]"
          >
            Browse Properties
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm font-medium text-purple-600 dark:text-purple-400 transition-colors hover:text-purple-700 dark:hover:text-purple-300"
            >
              Admin Panel
            </Link>
          )}

          <ToggleTheme />

          {user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-[var(--foreground)] transition-colors hover:text-[var(--primary)]"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-gradient-to-r from-[#0568fd] to-[#5247c8] px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-md hover:shadow-[#0568fd]/30 whitespace-nowrap"
              >
                List Property
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Navigation */}
        <MobileNav user={user} isAdmin={isAdmin} />
      </div>
    </HeaderShell>
  )
}
