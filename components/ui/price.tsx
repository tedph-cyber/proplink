import styles from '@/styles/price.module.css'

interface PriceProps {
  amount: number
  currency?: 'NGN'
  muted?: boolean
  className?: string
}

export function Price({ amount, currency = 'NGN', muted, className }: PriceProps) {
  const formatted = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)

  return (
    <span className={`${styles.root}${muted ? ` ${styles.muted}` : ''}${className ? ` ${className}` : ''}`}>
      {formatted}
    </span>
  )
}
