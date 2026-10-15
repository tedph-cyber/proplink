'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Search, Tag, TrendingUp, HardHat, Globe, PiggyBank,
  MessageCircle, ChevronDown,
} from 'lucide-react'
import { LANDING_INTENTS } from '@/lib/landing-content'
import { COMPANY_WHATSAPP } from '@/lib/constants'
import { buildWhatsAppLink } from '@/lib/utils'
import styles from '@/styles/how-we-help.module.css'

gsap.registerPlugin(ScrollTrigger)

const INTENT_ICONS: Record<string, typeof Search> = {
  buy: Search,
  sell: Tag,
  invest: TrendingUp,
  develop: HardHat,
  diaspora: Globe,
  'affordable-housing': PiggyBank,
}

export function HowWeHelp() {
  const [openId, setOpenId] = useState<string>(LANDING_INTENTS[0].id)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.from(`.${styles.reveal}`, {
        opacity: 0,
        y: 26,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 78%' },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  const toggle = (id: string) => setOpenId(prev => (prev === id ? '' : id))

  return (
    <section className={styles.section} id="how-we-help" ref={sectionRef}>
      <div className="wrap">
        <div className={`${styles.head} ${styles.reveal}`}>
          <p className={styles.eyebrow}>How we can help</p>
          <h2 className={`${styles.display} ${styles.title}`}>
            Wherever you are in your <em>property journey</em>
          </h2>
          <p className={styles.sub}>
            Six ways we work with Nigerians at home and abroad. Pick your path — every one starts
            with a WhatsApp message and ends with keys in hand.
          </p>
        </div>

        <div className={styles.accordion}>
          {LANDING_INTENTS.map(intent => {
            const Icon = INTENT_ICONS[intent.id] ?? Search
            const open = openId === intent.id
            const waLink = buildWhatsAppLink(COMPANY_WHATSAPP, intent.whatsappMessage)
            return (
              <div
                key={intent.id}
                className={`${styles.card} ${open ? styles.cardOpen : ''} ${styles.reveal}`}
              >
                <h3 className={styles.cardHeading}>
                  <button
                    type="button"
                    id={`help-trigger-${intent.id}`}
                    className={styles.cardButton}
                    aria-expanded={open}
                    aria-controls={`help-panel-${intent.id}`}
                    onClick={() => toggle(intent.id)}
                  >
                    <span className={styles.cardIcon} aria-hidden="true">
                      <Icon size={20} />
                    </span>
                    <span className={styles.cardText}>
                      <span className={styles.cardEyebrow}>{intent.eyebrow}</span>
                      <span className={styles.cardHeadline}>{intent.headline}</span>
                    </span>
                    <span
                      className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
                      aria-hidden="true"
                    >
                      <ChevronDown size={20} />
                    </span>
                  </button>
                </h3>

                <div
                  id={`help-panel-${intent.id}`}
                  role="region"
                  aria-labelledby={`help-trigger-${intent.id}`}
                  className={`${styles.panel} ${open ? styles.panelOpen : ''}`}
                  inert={!open}
                >
                  <div className={styles.panelInner}>
                    <div className={styles.panelBody}>
                      <p className={styles.standfirst}>{intent.standfirst}</p>
                      <ol className={styles.funnel}>
                        {intent.steps.map((step, i) => (
                          <li key={step.title} className={styles.funnelStep}>
                            <span className={styles.funnelNum} aria-hidden="true">{i + 1}</span>
                            <span className={styles.funnelText}>
                              <span className={styles.funnelTitle}>{step.title}</span>
                              <span className={styles.funnelBody}>{step.body}</span>
                            </span>
                          </li>
                        ))}
                      </ol>
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.waBtn}
                      >
                        <MessageCircle size={18} />
                        Start on WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
