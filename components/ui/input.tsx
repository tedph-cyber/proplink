import styles from '@/styles/input.module.css'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function Input({ label, id, className, ...props }: InputProps) {
  return (
    <div className={styles.group}>
      {label && <label htmlFor={id} className={styles.label}>{label}</label>}
      <input id={id} className={`${styles.input}${className ? ` ${className}` : ''}`} {...props} />
    </div>
  )
}
