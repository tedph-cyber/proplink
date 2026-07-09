import Link from 'next/link'
import { Metadata } from 'next'
import styles from '@/styles/content.module.css'

export const metadata: Metadata = {
  title: 'How It Works',
  description: 'Browse, find, and buy property in Nigeria directly from owners — no agents, no middlemen.',
}

const STEPS = [
  { n: '01', title: 'Browse Freely', body: 'No account needed. Search thousands of property listings across all 36 states using powerful filters by type, location, price, and more.' },
  { n: '02', title: 'Find the Right One', body: 'Each listing includes real photos, detailed features, transparent pricing, and direct contact info. Compare side-by-side with zero pressure.' },
  { n: '03', title: 'Connect on WhatsApp', body: 'Tap the WhatsApp button on any listing to start a direct conversation with the seller. Ask questions, schedule visits, negotiate — all without an agent.' },
  { n: '04', title: 'List for Free', body: 'Sellers create a free account, add property details and photos, and go live in minutes. No listing fees, no commissions, no contracts.' },
]

const BENEFITS = [
  {
    icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    title: 'Verified Sellers',
    body: 'Every seller is verified before their listing goes live. You can trust that the person on the other end is who they say they are.',
  },
  {
    icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    title: 'Direct Contact',
    body: 'No contact forms, no middlemen, no automated replies. You get the seller\'s real WhatsApp number and talk to them directly.',
  },
  {
    icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    title: 'Zero Commission',
    body: 'Buying or selling on StrongTower Holdings costs nothing. No agent fees, no hidden charges, no percentage cuts. Just direct transactions.',
  },
]

export default function HowItWorksPage() {
  return (
    <div>
      <section className={styles.hero}>
        <div className={styles.heroBg}><div className={styles.heroBgGradient} /></div>
        <div className={styles.heroInner}>
          <span className={styles.heroBadge}>How It Works</span>
          <h1 className={styles.heroTitle}>
            From <span className={styles.heroTitleEm}>Discovery</span> to Closing
          </h1>
          <p className={styles.heroDesc}>
            StrongTower Holdings makes it simple. Browse properties across Nigeria,
            connect directly with sellers on WhatsApp, and close the deal without agents or commissions.
          </p>
          <div className={styles.heroActions}>
            <Link href="/properties" className={styles.heroCtaPrimary}>
              Browse Properties
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            <Link href="/register" className={styles.heroCtaSecondary}>List for Free</Link>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Simple Steps</span>
            <h2 className={styles.sectionTitle}>How It Works</h2>
            <p className={styles.sectionSubtitle}>Four steps to find or list your next property in Nigeria.</p>
          </div>
          <div className={styles.grid2}>
            {STEPS.map(s => (
              <div key={s.n} className={styles.stepCard}>
                <span className={styles.stepNumber}>Step {s.n}</span>
                <div className={styles.stepDivider} />
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepBody}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Why Use StrongTower</span>
            <h2 className={styles.sectionTitle}>The StrongTower Advantage</h2>
            <p className={styles.sectionSubtitle}>Built differently. Built for Nigeria.</p>
          </div>
          <div className={styles.grid3}>
            {BENEFITS.map(b => (
              <div key={b.title} className={styles.card}>
                <div className={styles.cardIconWrap}>{b.icon}</div>
                <h3 className={styles.cardTitle}>{b.title}</h3>
                <p className={styles.cardBody}>{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaBanner}>
        <div className={styles.ctaBg}><div className={styles.ctaBgPattern} /></div>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Ready to Get Started?</h2>
          <p className={styles.ctaDesc}>Browse thousands of properties across Nigeria today.</p>
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
