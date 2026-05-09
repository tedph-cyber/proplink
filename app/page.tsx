import { SnapScroll } from '@/components/ui/snap-scroll'

const panels = [
  {
    eyebrow: 'StrongTower Holdings',
    headline: 'Building *Legacies*,\nOne Property at a Time',
    body: 'Where trust meets opportunity — a marketplace built for the way Nigeria buys and sells real estate. No agents, no middlemen, no noise.',
    number: '01',
    image: '/image/strongtower.jpeg',
    cta: { label: 'Browse Properties', href: '/properties' },
  },
  {
    eyebrow: 'How It Works',
    headline: 'From *Discovery* to\nClosing, We Guide You',
    body: 'Browse verified listings from trusted owners, connect directly on WhatsApp, and close with confidence. Every step is transparent.',
    number: '02',
    image: '/image/coolhouse.avif',
    cta: { label: 'Find Your Home', href: '/properties' },
  },
  {
    eyebrow: 'The Advantage',
    headline: 'Built for *Nigeria*,\nRooted in Trust',
    body: 'Every property is vetted, every seller is verified, and every transaction is built on transparency. Real estate, reimagined for a new generation.',
    number: '03',
    image: '/image/keys.avif',
    cta: { label: 'Learn More', href: '/about' },
  },
  {
    eyebrow: 'Get Started',
    headline: 'Your Next *Property*\nAwaits',
    body: 'Join thousands of Nigerians finding their perfect property. No registration required to browse — your dream home is just a click away.',
    number: '04',
    image: '/image/premium_skyscraper.avif',
    cta: { label: 'List Your Property', href: '/register' },
  },
]

export default function Home() {
  return <SnapScroll panels={panels} />
}
