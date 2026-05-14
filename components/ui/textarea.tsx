import { TextareaHTMLAttributes, forwardRef } from 'react'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-[var(--color-text)] tracking-[var(--letter-spacing)]">
            {label}
            {props.required && <span className="text-[var(--destructive)] ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`flex min-h-30 w-full rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-50 transition-all tracking-[var(--letter-spacing)] ${
            error ? 'border-[var(--destructive)] focus:ring-[var(--destructive)]' : ''
          } ${className}`}
          {...props}
        />
        {error && <p className="text-sm text-[var(--destructive)] tracking-[var(--letter-spacing)]">{error}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
