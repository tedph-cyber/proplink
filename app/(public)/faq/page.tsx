'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SectionReveal } from '@/components/ui/motion-wrappers'
import styles from '@/styles/content.module.css'

const FAQ_GROUPS = [
  {
    group: 'For Buyers',
    items: [
      {
        q: 'Do I need an account to browse properties?',
        a: 'No. You can browse all listings, view photos, and see prices without creating an account. An account is only required if you want to list a property.',
      },
      {
        q: 'How do I contact a seller?',
        a: 'Every listing has a "Contact via WhatsApp" button. Tap it to open a pre-filled WhatsApp chat with the seller directly — no agents, no commissions.',
      },
      {
        q: 'Are the prices negotiable?',
        a: 'That\'s between you and the seller. StrongTower Holdings shows the price the seller has listed, which may be a range (min–max). Negotiation happens directly in your WhatsApp conversation.',
      },
      {
        q: 'How do I know a listing is genuine?',
        a: 'Sellers are required to provide accurate information and real photos. If you suspect a fraudulent listing, contact us immediately via WhatsApp or email and we will investigate.',
      },
    ],
  },
  {
    group: 'For Sellers',
    items: [
      {
        q: 'How much does it cost to list a property?',
        a: 'Listing a property on StrongTower Holdings is completely free. There are no listing fees, no commissions, and no hidden charges.',
      },
      {
        q: 'How do I list a property?',
        a: 'Create a free seller account, go to your Dashboard, click "Add Property", fill in the details (type, location, price, features), upload photos, and hit publish. It takes about 5 minutes.',
      },
      {
        q: 'How many photos can I upload per listing?',
        a: 'You can upload multiple photos per listing. We recommend at least 5 high-quality images — exterior, interior rooms, kitchen, and any standout features.',
      },
      {
        q: 'Can I edit or delete my listing after publishing?',
        a: 'Yes. Go to Dashboard → My Properties, click "Edit" on any listing to update details, change photos, or change the status (active, sold, inactive). You can also delete a listing at any time.',
      },
      {
        q: 'Can I list land as well as houses?',
        a: 'Yes. StrongTower Holdings supports both residential houses and land plots. Each type has specific fields — for houses: bedrooms, bathrooms, house type; for land: size and unit (sqm, acres, plots, etc.).',
      },
      {
        q: 'What happens after I list a property?',
        a: 'Your listing goes live immediately and becomes searchable by buyers. Interested buyers will contact you directly via WhatsApp using the number you provided on your profile.',
      },
    ],
  },
  {
    group: 'Account & Profile',
    items: [
      {
        q: 'What type of account should I create?',
        a: 'Choose "Individual" if you\'re a private person selling your own property. Choose "Company" if you\'re an estate agency or developer listing on behalf of a business.',
      },
      {
        q: 'Why is a WhatsApp number required?',
        a: 'WhatsApp is the primary way buyers contact sellers on StrongTower Holdings. Without a valid WhatsApp number, buyers cannot reach you. Make sure you include your country code (e.g., 2348012345678 for Nigeria).',
      },
      {
        q: 'Can I change my WhatsApp number later?',
        a: 'Yes. Go to Dashboard → Profile Settings and update your WhatsApp number at any time. The change will reflect on all your active listings immediately.',
      },
    ],
  },
  {
    group: 'Platform & Safety',
    items: [
      {
        q: 'Is StrongTower Holdings available outside Nigeria?',
        a: 'StrongTower Holdings is currently focused on the Nigerian property market. All listings are within Nigeria. We may expand to other African markets in the future.',
      },
      {
        q: 'How do I report a suspicious listing?',
        a: 'Contact us immediately via WhatsApp (+234 703 520 9012) or email (strongtowerholdingsglobal@gmail.com) with the listing URL. We investigate all reports promptly.',
      },
      {
        q: 'Does StrongTower Holdings handle payments or escrow?',
        a: 'No. StrongTower Holdings is a listing and discovery platform. All payment arrangements are made directly between buyer and seller. We strongly advise verifying a property in person before making any payment.',
      },
    ],
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={styles.faqItem}>
      <button
        className={`${styles.faqQuestion} ${open ? styles.faqQuestionOpen : ''}`}
        onClick={() => setOpen(!open)}
      >
        <span>{q}</span>
        <svg
          className={`${styles.faqIcon} ${open ? styles.faqIconOpen : ''}`}
          width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14M5 12h14" />
        </svg>
      </button>
      <div
        className={styles.faqAnswer}
        style={{ maxHeight: open ? '300px' : '0' }}
      >
        <div className={styles.faqAnswerInner}>{a}</div>
      </div>
    </div>
  )
}

export default function FaqPage() {
  return (
    <div>
      <section className={styles.hero}>
        <div className={styles.heroBg}><div className={styles.heroBgGradient} /></div>
        <SectionReveal>
          <div className={styles.heroInner}>
            <span className={styles.heroBadge}>FAQ</span>
            <h1 className={styles.heroTitle}>
              Frequently Asked <span className={styles.heroTitleEm}>Questions</span>
            </h1>
            <p className={styles.heroDesc}>
              Everything you need to know about buying, selling, and using StrongTower Holdings.
            </p>
          </div>
        </SectionReveal>
      </section>

      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.sectionInner}>
          <SectionReveal>
            <div style={{ maxWidth: 800, marginInline: 'auto' }}>
              {FAQ_GROUPS.map(group => (
                <div key={group.group} className={styles.faqGroup}>
                  <h2 className={styles.faqGroupTitle}>{group.group}</h2>
                  {group.items.map(item => (
                    <FaqItem key={item.q} q={item.q} a={item.a} />
                  ))}
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInnerNarrow}>
          <div style={{ textAlign: 'center' }}>
            <h2 className={styles.ctaTitle} style={{ marginBottom: '0.75rem' }}>Still Have a Question?</h2>
            <p className={styles.sectionSubtitle}>
              Our team is available on WhatsApp and email to help with anything not covered here.
            </p>
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/contact" className={styles.heroCtaPrimary}>
              Contact Us
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.ctaBanner}>
        <div className={styles.ctaBg}><div className={styles.ctaBgPattern} /></div>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Ready to Get Started?</h2>
          <p className={styles.ctaDesc}>Browse thousands of properties across Nigeria and connect with sellers directly.</p>
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
