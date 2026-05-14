import Link from 'next/link'
import { SectionReveal, StaggerReveal, StaggerItem } from '@/components/ui/motion-wrappers'
import styles from '@/styles/about.module.css'

export const metadata = {
  title: 'About Us – StrongTower Holdings',
  description: 'Nigeria\'s direct property marketplace connecting buyers and sellers without the middleman.',
}

const STATS = [
  { label: 'Properties Listed', value: '2,000+' },
  { label: 'Nigerian States', value: '36' },
  { label: 'Direct Connections', value: 'WhatsApp' },
  { label: 'Listing Fee', value: '₦0' },
]

const STEPS = [
  {
    step: '01',
    title: 'Browse Freely',
    body: 'No account needed. Search thousands of property listings across all 36 Nigerian states using powerful filters.',
  },
  {
    step: '02',
    title: 'Find Your Property',
    body: 'Filter by type, location, price range, and bedrooms. Each listing includes photos, detailed features, and transparent pricing.',
  },
  {
    step: '03',
    title: 'Contact via WhatsApp',
    body: 'Tap the WhatsApp button on any listing to start a direct conversation with the seller — no agents, no commissions, no delays.',
  },
  {
    step: '04',
    title: 'List for Free',
    body: 'Sellers create an account and list their properties in minutes. Reach serious buyers across Nigeria at zero cost.',
  },
]

const VALUES = [
  {
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Transparency',
    body: 'Every listing shows real prices, real photos, and direct seller contact. No inflated agent fees or hidden costs — just honest property listings.',
  },
  {
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Accessibility',
    body: 'Whether in Lagos, Abuja, Kano, or Port Harcourt — PropLink works for every Nigerian looking to buy, sell, or invest in real estate.',
  },
  {
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Simplicity',
    body: 'Designed mobile-first for the everyday Nigerian. List a property in under 5 minutes and start receiving inquiries the same day.',
  },
]

export default function AboutPage() {
  return (
    <div>

      {/* ─── Hero ──────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div className={styles.heroBgGradient} />
        </div>
        <SectionReveal>
          <div className={styles.heroInner}>
            <span className={styles.heroBadge}>About StrongTower Holdings</span>
            <h1 className={styles.heroTitle}>
              Nigeria&apos;s Direct<br />
              <span className={styles.heroTitleEm}>Property Marketplace</span>
            </h1>
            <p className={styles.heroDesc}>
              PropLink connects buyers and sellers directly — no agents, no commissions, no unnecessary delays.
              Browse thousands of properties across Nigeria and talk to sellers instantly via WhatsApp.
            </p>
            <div className={styles.heroActions}>
              <Link href="/properties" className={styles.heroCtaPrimary}>
                Browse Properties
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href="/register" className={styles.heroCtaSecondary}>
                List for Free
              </Link>
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* ─── Stats ──────────────────────────────── */}
      <section className={styles.stats}>
        <SectionReveal>
          <div className={styles.statsInner}>
            <StaggerReveal className={styles.statsGrid}>
              {STATS.map(stat => (
                <StaggerItem key={stat.label} className={styles.statCard}>
                  <span className={styles.statValue}>{stat.value}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </StaggerItem>
              ))}
            </StaggerReveal>
          </div>
        </SectionReveal>
      </section>

      {/* ─── Mission ────────────────────────────── */}
      <section className={styles.mission}>
        <SectionReveal>
          <div className={styles.missionInner}>
            <span className={styles.missionAccent} />
            <h2 className={styles.missionTitle}>Our Mission</h2>
            <p className={styles.missionText}>
              Property search in Nigeria is often slow, expensive, and frustrating — weighed down by agents
              who add cost without adding value. PropLink was built to fix that. We give every Nigerian a
              platform to list, search, and transact property directly, putting the power back in the hands
              of buyers and sellers.
            </p>
          </div>
        </SectionReveal>
      </section>

      {/* ─── How It Works ───────────────────────── */}
      <section className={styles.howItWorks}>
        <div className={styles.howItWorksInner}>
          <SectionReveal>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>How It Works</span>
              <h2 className={styles.sectionTitle}>From Discovery to Closing</h2>
              <p className={styles.sectionSubtitle}>
                Four simple steps to find or list your next property.
              </p>
            </div>
          </SectionReveal>
          <StaggerReveal className={styles.stepsGrid}>
            {STEPS.map(item => (
              <StaggerItem key={item.step} className={styles.stepCard}>
                <span className={styles.stepNumber}>{item.step}</span>
                <div className={styles.stepDivider} />
                <h3 className={styles.stepTitle}>{item.title}</h3>
                <p className={styles.stepBody}>{item.body}</p>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* ─── Values ─────────────────────────────── */}
      <section className={styles.values}>
        <div className={styles.valuesInner}>
          <SectionReveal>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Our Principles</span>
              <h2 className={styles.sectionTitle}>What We Stand For</h2>
              <p className={styles.sectionSubtitle}>
                The values that guide every decision we make.
              </p>
            </div>
          </SectionReveal>
          <StaggerReveal className={styles.valuesGrid}>
            {VALUES.map(v => (
              <StaggerItem key={v.title} className={styles.valueCard}>
                <div className={styles.valueIconWrap}>
                  {v.icon}
                </div>
                <h3 className={styles.valueTitle}>{v.title}</h3>
                <p className={styles.valueBody}>{v.body}</p>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────── */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaBg}>
          <div className={styles.ctaBgPattern} />
        </div>
        <SectionReveal>
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>Ready to Get Started?</h2>
            <p className={styles.ctaDesc}>
              Browse thousands of properties across Nigeria or create a free account to list yours today.
            </p>
            <div className={styles.ctaActions}>
              <Link href="/properties" className={styles.ctaPrimary}>
                Browse Properties
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href="/register" className={styles.ctaSecondary}>
                List for Free
              </Link>
            </div>
          </div>
        </SectionReveal>
      </section>

    </div>
  )
}
