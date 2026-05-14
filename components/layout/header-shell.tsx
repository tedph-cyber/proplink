'use client'

import { useEffect, useState } from 'react'
import styles from '@/styles/header.module.css'

export function HeaderShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header className={`${styles.shell}${scrolled ? ` ${styles.shellScrolled}` : ''}`}>
      {children}
    </header>
  )
}
