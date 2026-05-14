import styles from '@/styles/card.module.css'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={`${styles.root}${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  )
}
