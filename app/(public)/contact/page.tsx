import Link from 'next/link'
import { Metadata } from 'next'
import { SectionReveal } from '@/components/ui/motion-wrappers'
import styles from '@/styles/content.module.css'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the StrongTower Holdings team for support, partnerships, or general enquiries.',
}

const CONTACT_ITEMS = [
  {
    icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" /></svg>,
    label: 'WhatsApp',
    value: '+234 703 520 9012',
    description: 'Fastest response — available Mon–Sat, 8am–6pm WAT',
    href: 'https://wa.me/2347035209012',
  },
  {
    icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    label: 'Email',
    value: 'strongtowerholdingsglobal@gmail.com',
    description: 'We reply within 24 hours on business days',
    href: 'mailto:strongtowerholdingsglobal@gmail.com',
  },
  {
    icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    label: 'Location',
    value: 'Lagos, Nigeria',
    description: 'Serving buyers and sellers across all 36 states',
    href: null,
  },
]

export default function ContactPage() {
  return (
    <div>
      <section className={styles.hero}>
        <div className={styles.heroBg}><div className={styles.heroBgGradient} /></div>
        <SectionReveal>
          <div className={styles.heroInner}>
            <span className={styles.heroBadge}>Get in Touch</span>
            <h1 className={styles.heroTitle}>
              We&apos;d <span className={styles.heroTitleEm}>Love to Hear</span> From You
            </h1>
            <p className={styles.heroDesc}>
              Questions, feedback, or partnership enquiries — reach out and we&apos;ll get back to you
              as quickly as possible.
            </p>
          </div>
        </SectionReveal>
      </section>

      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.sectionInner}>
          <SectionReveal>
            <div className={styles.contactGrid}>
              {CONTACT_ITEMS.map(item => (
                <div key={item.label} className={styles.contactCard}>
                  <div className={styles.contactIcon}>{item.icon}</div>
                  <p className={styles.contactLabel}>{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className={styles.contactValue}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer">
                      {item.value}
                    </a>
                  ) : (
                    <p className={styles.contactValue} style={{ color: 'var(--color-text)' }}>{item.value}</p>
                  )}
                  <p className={styles.contactDesc}>{item.description}</p>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInnerNarrow}>
          <div style={{ textAlign: 'center' }}>
            <h2 className={styles.ctaTitle} style={{ marginBottom: '0.75rem' }}>Quick Answers</h2>
            <p className={styles.sectionSubtitle}>Common questions answered here.</p>
          </div>
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { q: 'How do I list my property?', a: 'Create a free account, go to your dashboard, and click "Add Property". It takes less than 5 minutes.' },
              { q: 'Is StrongTower free to use?', a: 'Yes — browsing is completely free. Listing a property is also free for sellers.' },
              { q: 'How do buyers contact sellers?', a: 'Every listing has a WhatsApp button. Buyers tap it and start a direct chat with the seller — no agent involved.' },
            ].map(item => (
              <div key={item.q} className={styles.card} style={{ transform: 'none', cursor: 'default' }}>
                <p style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.25rem' }}>{item.q}</p>
                <p className={styles.cardBody}>{item.a}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/faq" className={styles.contactValue}>View full FAQ →</Link>
          </div>
        </div>
      </section>

      <section className={styles.ctaBanner}>
        <div className={styles.ctaBg}><div className={styles.ctaBgPattern} /></div>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Ready to Find Your Property?</h2>
          <p className={styles.ctaDesc}>Browse thousands of listings across Nigeria and connect with sellers directly.</p>
          <div className={styles.ctaActions}>
            <Link href="/properties" className={styles.ctaPrimary}>
              Browse Properties
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            <Link href="/register" className={styles.ctaSecondary}>List for Free</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
