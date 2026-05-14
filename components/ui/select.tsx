import React from 'react'
import styles from '@/styles/input.module.css'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export function Select({ label, id, options, placeholder, className, ...props }: SelectProps) {
  return (
    <div className={styles.group}>
      <label htmlFor={id} className={styles.label}>{label}</label>
      <select id={id} className={`${styles.select}${className ? ` ${className}` : ''}`} {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}
