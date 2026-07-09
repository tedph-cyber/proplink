'use client'

import { useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import styles from '@/styles/snap-scroll.module.css'

const panelThemes = [
  { accent: '#c4622d' },
  { accent: '#d4af37' },
  { accent: '#5aa06e' },
  { accent: '#c44e2d' },
]

interface SnapPanelData {
  eyebrow: string
  headline: string
  body: string
  number: string
  image: string
  cta: { label: string; href: string }
}

interface SnapScrollProps {
  panels: SnapPanelData[]
}

function parseHeadline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*[^*]+\*)/)
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>
    }
    return part
  })
}

export function SnapScroll({ panels }: SnapScrollProps) {
  const total = panels.length
  const currentRef = useRef(0)
  const isAnimatingRef = useRef(false)
  const panelsWrapRef = useRef<HTMLDivElement>(null)
  const blockerRef = useRef<HTMLDivElement>(null)
  const srRef = useRef<HTMLDivElement>(null)
  const hintsRef = useRef<{ prev: HTMLDivElement | null; next: HTMLDivElement | null }>({ prev: null, next: null })
  const dotsRef = useRef<(HTMLButtonElement | null)[]>([])
  const panelRefs = useRef<(HTMLElement | null)[]>([])
  const delayedCallRef = useRef<gsap.core.Tween | null>(null)

  const updateUI = useCallback(() => {
    const current = currentRef.current
    dotsRef.current.forEach((dot, i) => {
      if (!dot) return
      dot.classList.toggle(styles.dotActive, i === current)
      dot.setAttribute('aria-selected', i === current ? 'true' : 'false')
      dot.tabIndex = i === current ? 0 : -1
    })
    panelRefs.current.forEach((panel, i) => {
      if (!panel) return
      panel.setAttribute('aria-hidden', i !== current ? 'true' : 'false')
    })
    if (hintsRef.current.prev) {
      hintsRef.current.prev.classList.toggle(styles.scrollHintVisible, current > 0)
    }
    if (hintsRef.current.next) {
      hintsRef.current.next.classList.toggle(styles.scrollHintVisible, current < total - 1)
    }
    if (srRef.current) {
      srRef.current.textContent = `Section ${current + 1} of ${total}`
    }
  }, [total])

  const snapTo = useCallback((target: number) => {
    const current = currentRef.current
    if (isAnimatingRef.current || target === current || target < 0 || target >= total) return

    isAnimatingRef.current = true
    blockerRef.current?.classList.add(styles.blockerActive)

    panelRefs.current.forEach((panel, i) => {
      if (!panel) return
      gsap.to(panel, {
        y: `${(i - target) * 100}vh`,
        duration: 0.88,
        ease: 'power3.inOut',
        overwrite: true,
      })
    })

    const entering = panelRefs.current[target]
    const elems = entering ? [
      entering.querySelector(`.${styles.eyebrow}`),
      entering.querySelector(`.${styles.headline}`),
      entering.querySelector(`.${styles.bodyCopy}`),
      entering.querySelector(`.${styles.ctaLink}`),
    ].filter(Boolean) : []

    gsap.fromTo(elems,
      { opacity: 0, y: 22 },
      {
        opacity: 1, y: 0,
        duration: 0.55,
        stagger: 0.09,
        ease: 'power2.out',
        delay: 0.88 * 0.45,
      }
    )

    const leaving = panelRefs.current[current]
    const leavingElems = leaving ? [
      leaving.querySelector(`.${styles.eyebrow}`),
      leaving.querySelector(`.${styles.headline}`),
      leaving.querySelector(`.${styles.bodyCopy}`),
      leaving.querySelector(`.${styles.ctaLink}`),
    ].filter(Boolean) : []

    gsap.to(leavingElems, {
      opacity: 0,
      y: target > current ? -16 : 16,
      duration: 0.3,
      stagger: 0.05,
      ease: 'power2.in',
    })

    delayedCallRef.current?.kill()
    delayedCallRef.current = gsap.delayedCall(0.88, () => {
      currentRef.current = target
      isAnimatingRef.current = false
      blockerRef.current?.classList.remove(styles.blockerActive)
      updateUI()
    })
  }, [total, updateUI])

  useEffect(() => {
    if (panelRefs.current.length === 0) return

    document.body.style.overflow = 'hidden'

    panelRefs.current.forEach((panel, i) => {
      if (!panel) return
      gsap.set(panel, { y: `${i * 100}vh` })
    })

    const firstElems = [
      panelRefs.current[0]?.querySelector(`.${styles.eyebrow}`),
      panelRefs.current[0]?.querySelector(`.${styles.headline}`),
      panelRefs.current[0]?.querySelector(`.${styles.bodyCopy}`),
      panelRefs.current[0]?.querySelector(`.${styles.ctaLink}`),
    ].filter(Boolean)

    gsap.from(firstElems, {
      opacity: 0,
      y: 24,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power2.out',
      delay: 0.25,
    })

    updateUI()
    hintsRef.current.next?.classList.add(styles.scrollHintVisible)

    return () => {
      delayedCallRef.current?.kill()
      gsap.killTweensOf(panelRefs.current.filter(Boolean))
      const contentElems = panelRefs.current.filter(Boolean).flatMap(p => [
        p?.querySelector(`.${styles.eyebrow}`),
        p?.querySelector(`.${styles.headline}`),
        p?.querySelector(`.${styles.bodyCopy}`),
        p?.querySelector(`.${styles.ctaLink}`),
      ].filter(Boolean))
      gsap.killTweensOf(contentElems)
      document.body.style.overflow = ''
    }
  }, [updateUI])

  useEffect(() => {
    let wheelCooldown = false

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (isAnimatingRef.current || wheelCooldown) return
      wheelCooldown = true
      setTimeout(() => { wheelCooldown = false }, 100)

      if (e.deltaY > 0) snapTo(currentRef.current + 1)
      else snapTo(currentRef.current - 1)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [snapTo])

  useEffect(() => {
    let touchStartY = 0
    let touchStartX = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
      touchStartX = e.touches[0].clientX
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const dy = touchStartY - e.changedTouches[0].clientY
      const dx = Math.abs(touchStartX - e.changedTouches[0].clientX)
      if (Math.abs(dy) < 40 || dx > Math.abs(dy) * 0.7) return
      if (dy > 0) snapTo(currentRef.current + 1)
      else snapTo(currentRef.current - 1)
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [snapTo])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', 's'].includes(e.key)) {
        e.preventDefault()
        snapTo(currentRef.current + 1)
      } else if (['ArrowUp', 'PageUp', 'w'].includes(e.key)) {
        e.preventDefault()
        snapTo(currentRef.current - 1)
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [snapTo])

  return (
    <>
      <div className={styles.srOnly} aria-live="polite" ref={srRef}>Section 1 of {total}</div>
      <div className={styles.blocker} ref={blockerRef} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />

      {/* Overlay Navigation */}
      <nav className={styles.nav} role="navigation" aria-label="Main">
        <Link href="/" className={styles.navLogo}>
          <span className={styles.navLogoStrong}>Strong</span>
          Tower
          <span className={styles.navLogoSub}>Holdings</span>
        </Link>
        <ul className={styles.navLinks}>
          <li><Link href="/properties">Properties</Link></li>
          <li><Link href="/blog">Blog</Link></li>
          <li><Link href="/login">Login</Link></li>
        </ul>
      </nav>

      {/* Progress Dots */}
      <div className={styles.progressDots} role="tablist" aria-label="Section navigation">
        {panels.map((_, i) => (
          <button
            key={i}
            className={styles.dot}
            role="tab"
            aria-selected={i === 0}
            aria-label={`Go to section ${i + 1}`}
            data-target={i}
            tabIndex={i === 0 ? 0 : -1}
            ref={(el) => { dotsRef.current[i] = el }}
            onClick={() => snapTo(i)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                snapTo(i)
              }
            }}
          />
        ))}
      </div>

      {/* Scroll Hint — Prev */}
      <div
        className={`${styles.scrollHint} ${styles.scrollHintLeft}`}
        ref={(el) => { hintsRef.current.prev = el }}
        aria-hidden="true"
      >
        <div
          className={styles.scrollHintArrow}
          role="button"
          aria-label="Previous section"
          onClick={() => snapTo(currentRef.current - 1)}
        >
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="2,8 6,4 10,8" />
          </svg>
        </div>
        <span className={styles.scrollHintLabel}>Prev</span>
      </div>

      {/* Scroll Hint — Next */}
      <div
        className={`${styles.scrollHint} ${styles.scrollHintRight}`}
        ref={(el) => { hintsRef.current.next = el }}
        aria-hidden="true"
      >
        <span className={styles.scrollHintLabel}>Next</span>
        <div
          className={styles.scrollHintArrow}
          role="button"
          aria-label="Next section"
          onClick={() => snapTo(currentRef.current + 1)}
        >
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="2,4 6,8 10,4" />
          </svg>
        </div>
      </div>

      {/* Panels */}
      <div className={styles.panels} ref={panelsWrapRef} aria-live="polite">
        {panels.map((panel, i) => {
          const theme = panelThemes[i % panelThemes.length]
          return (
            <section
              key={i}
              className={styles.panel}
              data-index={i}
              role="tabpanel"
              aria-label={`Section ${i + 1}: ${panel.eyebrow}`}
              aria-hidden={i !== 0}
              ref={(el) => { panelRefs.current[i] = el }}
            >
              {/* Background image */}
              <div className={styles.panelBg}>
                <img src={panel.image} alt="" aria-hidden="true" />
              </div>

              {/* Gradient overlay */}
              <div
                className={styles.panelOverlay}
                style={{
                  background: `linear-gradient(145deg, rgba(12,11,10,0.85) 0%, rgba(22,20,18,0.65) 50%, rgba(12,11,10,0.45) 100%)`,
                }}
              />

              <div className={styles.panelCounter} aria-hidden="true">
                <div className={styles.panelCounterNum}>{panel.number}</div>
              </div>

              <div className={styles.panelInner}>
                <div className={styles.eyebrow}>
                  <span className={styles.accentRule} style={{ background: theme.accent }} />
                  {panel.eyebrow}
                </div>
                <h1 className={styles.headline} style={{ color: theme.accent }}>
                  {parseHeadline(panel.headline)}
                </h1>
                <p className={styles.bodyCopy}>{panel.body}</p>
                <Link
                  href={panel.cta.href}
                  className={styles.ctaLink}
                  style={{ borderBottomColor: theme.accent }}
                >
                  {panel.cta.label}
                  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="2" y1="7" x2="11" y2="7" />
                    <polyline points="7,3 11,7 7,11" />
                  </svg>
                </Link>
              </div>

              <footer className={styles.panelFooter}>
                <ul className={styles.footerNav}>
                  <li><Link href="/properties">Properties</Link></li>
                  <li><Link href="/blog">Blog</Link></li>
                  <li><Link href="/register">List Property</Link></li>
                </ul>
                <a href="mailto:strongtowerholdingsglobal@gmail.com" className={styles.footerContact}>
                  strongtowerholdingsglobal@gmail.com
                </a>
              </footer>
            </section>
          )
        })}
      </div>
    </>
  )
}
