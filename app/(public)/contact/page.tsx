export const metadata = {
  title: 'Contact Us – PropLink',
  description: 'Get in touch with the PropLink team for support, partnerships, or general enquiries.',
}

const CONTACT_ITEMS = [
  {
    icon: (
      <svg className="h-5 w-5 text-[#0568fd]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    label: 'WhatsApp',
    value: '+234 800 000 0000',
    description: 'Fastest response — available Mon–Sat, 8am–6pm WAT',
    href: 'https://wa.me/2348000000000',
  },
  {
    icon: (
      <svg className="h-5 w-5 text-[#0568fd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: 'Email',
    value: 'hello@proplink.ng',
    description: 'We reply within 24 hours on business days',
    href: 'mailto:hello@proplink.ng',
  },
  {
    icon: (
      <svg className="h-5 w-5 text-[#0568fd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: 'Location',
    value: 'Lagos, Nigeria',
    description: 'Serving buyers and sellers across all 36 states',
    href: null,
  },
]

const FAQS_PREVIEW = [
  { q: 'How do I list my property?', a: 'Create a free account, go to your dashboard, and click "Add Property". It takes less than 5 minutes.' },
  { q: 'Is PropLink free to use?', a: 'Yes — browsing is completely free. Listing a property is also free for sellers.' },
  { q: 'How do buyers contact sellers?', a: 'Every listing has a WhatsApp button. Buyers tap it and start a direct chat with the seller — no agent involved.' },
]

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-b from-zinc-50 to-white py-14 border-b border-zinc-100">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h1 className="text-4xl font-bold text-zinc-900 mb-3">Get in Touch</h1>
          <p className="text-zinc-500 text-lg">
            Questions, feedback, or partnership enquiries — we'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact cards */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="grid gap-5 sm:grid-cols-3">
            {CONTACT_ITEMS.map(item => (
              <div key={item.label} className="rounded-2xl border border-zinc-200 p-6 text-center hover:shadow-md transition-shadow">
                <div className="mx-auto mb-4 h-11 w-11 rounded-xl bg-[#0568fd]/10 flex items-center justify-center">
                  {item.icon}
                </div>
                <p className="font-semibold text-zinc-900 mb-1">{item.label}</p>
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-sm text-[#0568fd] font-medium hover:underline block mb-2"
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-sm text-zinc-700 font-medium mb-2">{item.value}</p>
                )}
                <p className="text-xs text-zinc-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick FAQ */}
      <section className="py-14 bg-zinc-50 border-t border-zinc-100">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-2xl font-bold text-zinc-900 mb-8 text-center">Quick Answers</h2>
          <div className="space-y-4">
            {FAQS_PREVIEW.map(item => (
              <div key={item.q} className="rounded-2xl border border-zinc-200 bg-white p-5">
                <p className="font-semibold text-zinc-900 mb-1">{item.q}</p>
                <p className="text-sm text-zinc-500">{item.a}</p>
              </div>
            ))}
          </div>
          <p className="text-center mt-6 text-sm text-zinc-500">
            More questions?{' '}
            <a href="/faq" className="text-[#0568fd] hover:underline font-medium">Visit our full FAQ →</a>
          </p>
        </div>
      </section>

      {/* Response time note */}
      <section className="py-10 bg-white border-t border-zinc-100">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-5 py-2.5">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-green-700 font-medium">
              We typically respond within a few hours on WhatsApp
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}
