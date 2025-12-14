import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { UserMenu } from './user-menu'

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
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-zinc-900">PropLink</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/properties"
            className="text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900"
          >
            Browse Properties
          </Link>
          
          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm font-medium text-purple-600 transition-colors hover:text-purple-700"
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
                className="text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
              >
                List Property
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
