'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from '@/styles/admin.module.css'

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

export interface AdminSidebarProps {
  brand: {
    logo?: string
    name: string
    subtitle: string
  }
  navItems: NavItem[]
  cta: {
    href: string
    label: string
    icon: React.ReactNode
  }
  variant?: 'admin' | 'dashboard'
}

const AUTO_HIDE_DELAY = 6000

export function AdminSidebar({ brand, navItems, cta, variant = 'admin' }: AdminSidebarProps) {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState(true)
  const [pinned, setPinned] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sidebarRef = useRef<HTMLElement>(null)

  const startTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      if (!pinned && !mobileOpen) setExpanded(false)
    }, AUTO_HIDE_DELAY)
  }, [pinned, mobileOpen])

  const handleMouseEnter = () => {
    if (!expanded) setExpanded(true)
    startTimer()
  }

  const handleMouseMove = () => {
    if (!expanded) setExpanded(true)
    startTimer()
  }

  const handleMouseLeave = () => {
    startTimer()
  }

  useEffect(() => {
    startTimer()
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [startTimer])

  const sidebarClass = variant === 'dashboard' ? styles.dashSidebar : styles.sidebar
  const navClass = variant === 'dashboard' ? styles.dashNav : styles.sidebarNav
  const ctaClass = variant === 'dashboard' ? styles.dashCta : styles.sidebarCta
  const ctaLinkClass = variant === 'dashboard' ? styles.dashCtaLink : styles.sidebarCtaLink

  const closeMobile = () => setMobileOpen(false)

  return (
    <>
      {/* Mobile hamburger toggle */}
      <button
        type="button"
        onClick={() => {
          setMobileOpen(v => !v)
          setExpanded(true)
        }}
        className={styles.mobileToggle}
        aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          {mobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile overlay backdrop */}
      <div
        className={`${styles.sidebarOverlay} ${mobileOpen ? styles.sidebarOverlayVisible : ''}`}
        onClick={closeMobile}
      />

      <aside
        ref={sidebarRef}
        className={`${sidebarClass} ${expanded ? styles.sidebarExpanded : styles.sidebarCollapsed} ${mobileOpen ? styles.sidebarMobileOpen : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
      {/* Pin toggle */}
      <button
        type="button"
        onClick={() => { setPinned(p => !p); setExpanded(true) }}
        className={styles.pinBtn}
        aria-label={pinned ? 'Unpin sidebar' : 'Pin sidebar'}
      >
        <svg
          className={pinned ? styles.pinIconActive : styles.pinIcon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      </button>

      {/* Brand */}
      <div className={variant === 'dashboard' ? styles.dashBrand : styles.sidebarBrand}>
        {variant === 'dashboard' ? (
          <div className={styles.dashBrandRow}>
            <div className={styles.dashBrandLogo}>
              <span className={styles.dashBrandLogoText}>{brand.logo}</span>
            </div>
            <div className={expanded ? styles.brandLabel : styles.brandLabelHidden}>
              <h2 className={styles.dashBrandName}>{brand.name}</h2>
              <p className={styles.dashBrandTagline}>{brand.subtitle}</p>
            </div>
          </div>
        ) : (
          <div>
            <span className={styles.sidebarBrandName}>{brand.name}</span>
            <div className={`${styles.sidebarBrandSub} ${expanded ? '' : styles.brandLabelHidden}`}>
              {brand.subtitle}
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className={navClass}>
        {navItems.map(({ href, label, icon }) => {
          const isActive = pathname === href || (href !== '/admin' && href !== '/dashboard' && pathname.startsWith(href))
          const linkClass = variant === 'dashboard'
            ? (isActive ? styles.dashNavActive : styles.dashNavLink)
            : (isActive ? styles.sidebarLinkActive : styles.sidebarLink)

          return (
            <Link key={href} href={href} className={linkClass} onClick={closeMobile}>
              {icon}
              <span className={expanded ? styles.navLabel : styles.navLabelHidden}>{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* CTA */}
      <div className={ctaClass}>
        <Link href={cta.href} className={ctaLinkClass} onClick={closeMobile}>
          {cta.icon}
          <span className={expanded ? styles.navLabel : styles.navLabelHidden}>{cta.label}</span>
        </Link>
      </div>
    </aside>
    </>
  )
}
