import Link from 'next/link'
import { Metadata } from 'next'
import styles from '@/styles/content.module.css'

export const metadata: Metadata = {
  title: 'Why Us',
  description: 'Why StrongTower Holdings is Nigeria\'s most trusted direct property marketplace. No agents, no commissions, no middlemen.',
}

const REASONS = [
  {
    icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    title: 'Verified, Trusted Listings',
    body: 'Every property is checked. We verify the seller, confirm photos match the actual property, and ensure pricing is transparent. No fake listings, no wasted trips.',
  },
  {
    icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    title: 'Connect Directly, Instantly',
    body: 'No contact forms, no callback requests. Every listing has a WhatsApp button that opens a direct chat with the seller. You talk to the owner, not an agent.',
  },
  {
    icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    title: 'Always Free',
    body: 'Listing a property costs nothing. Browsing costs nothing. Connecting with a seller costs nothing. StrongTower Holdings is free for everyone, always.',
  },
  {
    icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    title: 'Nationwide Coverage',
    body: 'Properties listed across all 36 states and the FCT. Whether you\'re looking in Lagos, Abuja, Port Harcourt, Kano, or anywhere in between, we\'ve got you covered.',
  },
  {
    icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    title: 'Buyer & Seller Insights',
    body: 'Real market data, price trends, and neighbourhood guides help you make informed decisions. Know the market before you make an offer or list your property.',
  },
  {
    icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    title: 'Fast, Mobile-First Experience',
    body: 'Designed for how Nigerians use the internet. Browse, filter, and connect from your phone in seconds. No app download needed — works perfectly in your mobile browser.',
  },
]

export default function WhyUsPage() {
  return (
    <div>
      <section className={styles.hero}>
        <div className={styles.heroBg}><div className={styles.heroBgGradient} /></div>
        <div className={styles.heroInner}>
          <span className={styles.heroBadge}>Why Us</span>
          <h1 className={styles.heroTitle}>
            Built for <span className={styles.heroTitleEm}>Nigeria</span>, Rooted in Trust
          </h1>
          <p className={styles.heroDesc}>
            StrongTower Holdings is reimagining how Nigerians buy and sell property. We cut out the middlemen,
            put you in direct contact with sellers, and keep everything transparent.
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
            <span className={styles.sectionLabel}>The StrongTower Difference</span>
            <h2 className={styles.sectionTitle}>Why Choose Us</h2>
            <p className={styles.sectionSubtitle}>Six reasons Nigerians trust StrongTower Holdings for real estate.</p>
          </div>
          <div className={styles.grid3}>
            {REASONS.map(r => (
              <div key={r.title} className={styles.card}>
                <div className={styles.cardIconWrap}>{r.icon}</div>
                <h3 className={styles.cardTitle}>{r.title}</h3>
                <p className={styles.cardBody}>{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaBanner}>
        <div className={styles.ctaBg}><div className={styles.ctaBgPattern} /></div>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Experience the Difference</h2>
          <p className={styles.ctaDesc}>Browse properties across Nigeria and connect with sellers directly.</p>
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
