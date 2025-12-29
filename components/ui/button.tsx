import { ButtonHTMLAttributes, forwardRef } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-[var(--radius)] font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 tracking-[var(--letter-spacing)]'

    const variants = {
      primary: 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 shadow-sm',
      secondary: 'bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--secondary)]/80 border border-[var(--border)]',
      outline: 'border border-[var(--border)] bg-transparent hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]',
      ghost: 'hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]',
      destructive: 'bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:opacity-90 shadow-sm',
    }

    const sizes = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-11 px-8 text-base',
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
