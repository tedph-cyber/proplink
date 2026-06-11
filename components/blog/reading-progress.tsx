'use client'

import { useEffect, useState } from 'react'

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let reduced = false
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduced = mq.matches
    const onChange = (e: MediaQueryListEvent) => { reduced = e.matches }
    mq.addEventListener('change', onChange)

    const onScroll = () => {
      if (reduced) return
      const html = document.documentElement
      const max = html.scrollHeight - html.clientHeight
      setProgress(max > 0 ? Math.min(100, (html.scrollTop / max) * 100) : 0)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      mq.removeEventListener('change', onChange)
    }
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '3px',
        background: 'var(--color-accent)',
        zIndex: 100,
        width: `${progress}%`,
        transition: 'width 0.1s linear',
      }}
    />
  )
}
