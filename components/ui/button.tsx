import styles from '@/styles/button.module.css'

type ButtonVariant = 'primary' | 'ghost' | 'whatsapp'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${styles.base} ${styles[variant]} ${styles[size]}${className ? ` ${className}` : ''}`}
      {...props}
    >
      {children}
    </button>
  )
}
