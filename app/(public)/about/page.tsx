import Link from 'next/link'

export const metadata = {
  title: 'About Us – PropLink',
  description: 'Learn about PropLink — Nigeria\'s direct property marketplace connecting buyers and sellers without the middleman.',
}

const STATS = [
  { label: 'Properties Listed', value: '2,000+' },
  { label: 'Nigerian States', value: '36' },
  { label: 'Direct Connections', value: 'WhatsApp' },
  { label: 'Listing Fee', value: '₦0' },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Browse Freely',
    body: 'No account needed to browse. Search thousands of houses and land listings across all 36 Nigerian states using our filters.',
  },
  {
    step: '02',
    title: 'Find Your Property',
    body: 'Filter by type, location, price range, bedrooms, and more. Each listing includes photos, detailed features, and transparent pricing.',
  },
  {
    step: '03',
    title: 'Contact via WhatsApp',
    body: 'Tap the WhatsApp button on any listing to start a direct conversation with the seller — no agents, no commissions, no delays.',
  },
  {
    step: '04',
    title: 'List for Free',
    body: 'Sellers create a free account and list their properties in minutes. Reach serious buyers across Nigeria at zero cost.',
  },
]

const VALUES = [
  {
    icon: (
      <svg className="h-6 w-6 text-[#0568fd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Transparency',
    body: 'Every listing shows real prices, real photos, and direct seller contact. No inflated agent fees or hidden costs.',
  },
  {
    icon: (
      <svg className="h-6 w-6 text-[#0568fd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Accessibility',
    body: 'Whether you\'re in Lagos, Abuja, Kano, or Port Harcourt — PropLink works for every Nigerian looking to buy, sell, or invest.',
  },
  {
    icon: (
      <svg className="h-6 w-6 text-[#0568fd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Simplicity',
    body: 'Designed mobile-first for the everyday Nigerian. List a property in under 5 minutes and start receiving inquiries the same day.',
  },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-b from-zinc-50 to-white py-16 md:py-24 border-b border-zinc-100">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <span className="inline-block rounded-full bg-[#0568fd]/10 text-[#0568fd] text-xs font-semibold px-4 py-1.5 mb-5">
            About PropLink
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 leading-tight mb-5">
            Nigeria's Direct<br />Property Marketplace
          </h1>
          <p className="text-lg text-zinc-500 max-w-2xl mx-auto leading-relaxed">
            PropLink connects buyers and sellers directly — no agents, no commissions, no unnecessary delays.
            Browse thousands of properties across Nigeria and talk to sellers instantly via WhatsApp.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-zinc-900 mb-1">{stat.value}</p>
                <p className="text-sm text-zinc-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 bg-zinc-50 border-t border-zinc-100">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-zinc-900 mb-5">Our Mission</h2>
          <p className="text-zinc-600 leading-relaxed text-lg">
            Property search in Nigeria is often slow, expensive, and frustrating — weighed down by agents who add cost without adding value.
            PropLink was built to fix that. We give every Nigerian a platform to list, search, and transact property directly,
            putting the power back in the hands of buyers and sellers.
          </p>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-white border-t border-zinc-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-zinc-900 mb-12 text-center">How PropLink Works</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {HOW_IT_WORKS.map(item => (
              <div key={item.step} className="flex gap-5">
                <div className="shrink-0 w-10 h-10 rounded-full bg-[#0568fd]/10 flex items-center justify-center">
                  <span className="text-[#0568fd] text-xs font-bold">{item.step}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-zinc-50 border-t border-zinc-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-zinc-900 mb-12 text-center">What We Stand For</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {VALUES.map(v => (
              <div key={v.title} className="rounded-2xl border border-zinc-200 bg-white p-6">
                <div className="h-11 w-11 rounded-xl bg-[#0568fd]/10 flex items-center justify-center mb-4">
                  {v.icon}
                </div>
                <h3 className="font-semibold text-zinc-900 mb-2">{v.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-[#0568fd] to-[#0568fd]/80">
        <div className="container mx-auto px-4 text-center max-w-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to Get Started?
          </h2>
          <p className="text-white/80 mb-7 text-sm">
            Browse properties freely or create a free account to list yours today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/properties"
              className="rounded-full bg-white text-[#0568fd] px-6 py-2.5 text-sm font-semibold hover:bg-white/90 transition-colors"
            >
              Browse Properties
            </Link>
            <Link
              href="/register"
              className="rounded-full border border-white/50 text-white px-6 py-2.5 text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              List for Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
