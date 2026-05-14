import Link from "next/link";
import styles from "@/styles/auth.module.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-[var(--color-bg)] overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[var(--color-accent-muted)] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[var(--color-accent-muted)] blur-3xl" />

      <div className="flex flex-1 items-center justify-center py-12 px-4 relative z-10">
        <div className="w-full max-w-xl">
          <Link href="/" className={styles.backLink}>
            <svg className={styles.backLinkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          {children}
        </div>
      </div>
    </div>
  )
}
