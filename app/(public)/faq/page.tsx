'use client'

import { useState } from 'react'
import Link from 'next/link'

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
        a: 'That\'s between you and the seller. PropLink shows the price the seller has listed, which may be a range (min–max). Negotiation happens directly in your WhatsApp conversation.',
      },
      {
        q: 'How do I know a listing is genuine?',
        a: 'Sellers are required to provide accurate information and real photos. If you suspect a fraudulent listing, contact us immediately via WhatsApp or email and we will investigate.',
      },
      {
        q: 'Can I save or bookmark properties?',
        a: 'This feature is coming soon. For now, you can share a property\'s URL or screenshot it for future reference.',
      },
    ],
  },
  {
    group: 'For Sellers',
    items: [
      {
        q: 'How much does it cost to list a property?',
        a: 'Listing a property on PropLink is completely free. There are no listing fees, no commissions, and no hidden charges.',
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
        a: 'Yes. PropLink supports both residential houses and land plots. Each type has specific fields — for houses: bedrooms, bathrooms, house type; for land: size and unit (sqm, acres, plots, etc.).',
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
        a: 'WhatsApp is the primary way buyers contact sellers on PropLink. Without a valid WhatsApp number, buyers cannot reach you. Make sure you include your country code (e.g., 2348012345678 for Nigeria).',
      },
      {
        q: 'Can I change my WhatsApp number later?',
        a: 'Yes. Go to Dashboard → Profile Settings and update your WhatsApp number at any time. The change will reflect on all your active listings immediately.',
      },
      {
        q: 'I forgot my password. How do I reset it?',
        a: 'On the login page, click "Forgot password?" (coming soon) or contact us via WhatsApp and we\'ll help you recover your account.',
      },
    ],
  },
  {
    group: 'Platform & Safety',
    items: [
      {
        q: 'Is PropLink available outside Nigeria?',
        a: 'PropLink is currently focused on the Nigerian property market. All listings are within Nigeria. We may expand to other African markets in the future.',
      },
      {
        q: 'How do I report a suspicious listing?',
        a: 'Contact us immediately via WhatsApp (+234 800 000 0000) or email (hello@proplink.ng) with the listing URL. We investigate all reports promptly.',
      },
      {
        q: 'Does PropLink handle payments or escrow?',
        a: 'No. PropLink is a listing and discovery platform. All payment arrangements are made directly between buyer and seller. We strongly advise verifying a property in person before making any payment.',
      },
    ],
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-zinc-200 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold text-zinc-900 hover:bg-zinc-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span>{q}</span>
        <svg
          className={`h-4 w-4 text-zinc-400 shrink-0 ml-3 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-zinc-500 leading-relaxed border-t border-zinc-100 bg-zinc-50/40 pt-3">
          {a}
        </div>
      )}
    </div>
  )
}

export default function FaqPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-b from-zinc-50 to-white py-14 border-b border-zinc-100">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h1 className="text-4xl font-bold text-zinc-900 mb-3">Frequently Asked Questions</h1>
          <p className="text-zinc-500 text-lg">Everything you need to know about buying and selling on PropLink.</p>
        </div>
      </section>

      {/* FAQ Groups */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="space-y-12">
            {FAQ_GROUPS.map(group => (
              <div key={group.group}>
                <h2 className="text-xl font-bold text-zinc-900 mb-5">{group.group}</h2>
                <div className="space-y-3">
                  {group.items.map(item => (
                    <FaqItem key={item.q} q={item.q} a={item.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still have questions */}
      <section className="py-12 bg-zinc-50 border-t border-zinc-100">
        <div className="container mx-auto px-4 max-w-xl text-center">
          <h2 className="text-xl font-bold text-zinc-900 mb-2">Still have a question?</h2>
          <p className="text-sm text-zinc-500 mb-5">
            Our team is available on WhatsApp and email to help with anything not covered here.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-[#0568fd] text-white px-6 py-2.5 text-sm font-semibold hover:bg-[#0568fd]/90 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  )
}
