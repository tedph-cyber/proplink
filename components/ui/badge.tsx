import { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'info' | 'destructive'
  className?: string
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-[var(--muted)] text-[var(--muted-foreground)]',
    success: 'bg-[var(--primary)] text-white',
    warning: 'bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-100',
    info: 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-100',
    destructive: 'bg-[var(--destructive)] text-white',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-[var(--letter-spacing)] transition-colors ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
