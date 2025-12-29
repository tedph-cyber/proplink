import { InputHTMLAttributes, forwardRef } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-[var(--foreground)] tracking-[var(--letter-spacing)]">
            {label}
            {props.required && <span className="text-[var(--destructive)] ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`flex h-10 w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--input)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-50 transition-all tracking-[var(--letter-spacing)] ${
            error ? 'border-[var(--destructive)] focus:ring-[var(--destructive)]' : ''
          } ${className}`}
          {...props}
        />
        {error && <p className="text-sm text-[var(--destructive)] tracking-[var(--letter-spacing)]">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
