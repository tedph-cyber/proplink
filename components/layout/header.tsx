import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { UserMenu } from './user-menu'
import { MobileNav } from './mobile-nav'

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Check if user is admin
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
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)] backdrop-blur-sm bg-opacity-95">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 transition-transform hover:scale-105">
          <span className="text-xl sm:text-2xl font-bold text-[var(--primary)] tracking-[var(--letter-spacing)]">PropLink</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          <Link
            href="/properties"
            className="text-sm font-medium text-[var(--foreground)] transition-colors hover:text-[var(--primary)] tracking-[var(--letter-spacing)]"
          >
            Browse Properties
          </Link>
          
          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm font-medium text-purple-600 dark:text-purple-400 transition-colors hover:text-purple-700 dark:hover:text-purple-300 tracking-[var(--letter-spacing)]"
            >
              Admin Panel
            </Link>
          )}
          
          {user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-[var(--foreground)] transition-colors hover:text-[var(--primary)] tracking-[var(--letter-spacing)]"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-[var(--radius)] bg-[var(--primary)] px-3 lg:px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[var(--primary)]/90 hover:shadow-[var(--shadow-md)] tracking-[var(--letter-spacing)] whitespace-nowrap"
              >
                List Property
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Navigation */}
        <MobileNav user={user} isAdmin={isAdmin} />
      </div>
    </header>
  )
}
