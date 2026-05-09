import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data.user) {
      const user = data.user
      const meta = user.user_metadata ?? {}

      // Create profile from metadata stored during signUp.
      // Uses upsert so it's idempotent (safe to run multiple times).
      if (meta.role) {
        await supabase.from('profiles').upsert({
          id: user.id,
          role: meta.role ?? 'seller',
          seller_type: meta.seller_type ?? 'individual',
          company_name: meta.company_name ?? null,
          whatsapp_number: meta.whatsapp_number ?? '',
        })
        // Errors here are silently ignored — the user is still authenticated.
        // They can update their profile later via /dashboard/profile.
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Code missing or exchange failed
  return NextResponse.redirect(`${origin}/login?error=confirmation_failed`)
}
