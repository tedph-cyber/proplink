'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import styles from '@/styles/header.module.css'

interface ThemeToggleProps {
  mobile?: boolean
}

export function ThemeToggle({ mobile }: ThemeToggleProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const stored = localStorage.getItem('st-theme') || 'dark'
    setTheme(stored as 'dark' | 'light')
  }, [])

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('st-theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  const Icon = theme === 'dark' ? Sun : Moon

  return (
    <button
      onClick={toggle}
      className={mobile ? styles.mobileThemeToggle : styles.themeToggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      <Icon className={styles.themeToggleIcon} />
      {mobile && <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>}
    </button>
  )
}
