import styles from '@/styles/badge.module.css'

type BadgeVariant = 'typeHouse' | 'typeLand' | 'statusActive' | 'statusPending' | 'statusInactive' | 'statusSold' | 'neutral'

interface BadgeProps {
  variant: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantLabel: Record<BadgeVariant, string> = {
  typeHouse: 'House',
  typeLand: 'Land',
  statusActive: 'Active',
  statusPending: 'Pending',
  statusInactive: 'Inactive',
  statusSold: 'Sold',
  neutral: '',
}

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span className={`${styles.base} ${styles[variant]}${className ? ` ${className}` : ''}`}>
      {children}
    </span>
  )
}
