import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Page Not Found | StrongTower Holdings',
}

export default function NotFound() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 20px',
    }}>
      <div style={{
        background: '#080706',
        color: '#f5f0e8',
        borderRadius: 'var(--radius-lg)',
        padding: '72px 32px',
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: 'clamp(4rem, 12vw, 8rem)',
          lineHeight: 1,
          letterSpacing: '-0.03em',
        }}>
          4<span style={{ color: 'var(--color-accent)' }}>0</span>4
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.7rem',
          margin: '8px 0 10px',
          color: '#f5f0e8',
          fontWeight: 600,
        }}>
          Page not found
        </h1>
        <p style={{
          color: 'rgba(245,240,232,0.6)',
          margin: '0 auto 24px',
          maxWidth: '40ch',
          lineHeight: 1.55,
        }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>
        <Link href="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '9px',
          fontFamily: 'var(--font-body)',
          fontWeight: 600,
          fontSize: '0.95rem',
          padding: '14px 28px',
          borderRadius: '999px',
          background: 'var(--color-accent)',
          color: '#fff',
          textDecoration: 'none',
          transition: 'background 0.3s, transform 0.35s var(--ease-base)',
        }}>
          Back to home
        </Link>
      </div>
    </main>
  )
}
