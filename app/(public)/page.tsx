'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Search, MapPin, Shield, MessageCircle, Sparkles,
  ArrowUpRight, Star, ArrowRight, User, Home as HomeIcon
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { NIGERIAN_STATES } from '@/lib/constants'
import type { Property, PropertyMedia, BlogPost } from '@/lib/types'
import { PropertyCard } from '@/components/properties/property-card'
import { Button } from '@/components/ui/button'
import styles from '@/styles/home.module.css'

gsap.registerPlugin(ScrollTrigger)

/* ─── Search Bar ─── */
function SearchBar() {
  const router = useRouter()
  const [type, setType] = useState('')
  const [state, setState] = useState('')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (type) params.set('type', type)
    if (state) params.set('state', state)
    router.push(`/properties?${params.toString()}`)
  }

  return (
    <div className={styles.searchbar}>
      <div className={styles.searchbarFields}>
        <label className={styles.sbField}>
          <span className={styles.sbLabel}>Property type</span>
          <div className={styles.sbInput}>
            <HomeIcon size={16} />
            <select value={type} onChange={e => setType(e.target.value)}>
              <option value="">All types</option>
              <option value="house">House</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
              <option value="rental">Rental</option>
              <option value="apartment">Apartment</option>
              <option value="duplex">Duplex</option>
              <option value="block of flats">Block of flats</option>
              <option value="mini flat">Mini flat</option>
              <option value="studio apartment">Studio apartment</option>
              <option value="town-house">Town-house</option>
              <option value="shared apartment">Shared apartment</option>
            </select>
          </div>
        </label>
        <label className={styles.sbField}>
          <span className={styles.sbLabel}>State</span>
          <div className={styles.sbInput}>
            <MapPin size={16} />
            <select value={state} onChange={e => setState(e.target.value)}>
              <option value="">Anywhere in Nigeria</option>
              {NIGERIAN_STATES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </label>
        <button className={styles.sbGo} onClick={handleSearch} aria-label="Search">
          <Search size={20} />
          <span>Search properties</span>
        </button>
      </div>
    </div>
  )
}

/* ─── Stars ─── */
function Stars({ n = 5 }: { n?: number }) {
  return (
    <span className={styles.stars}>
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} size={14} fill="currentColor" />
      ))}
    </span>
  )
}

/* ─── CountUp ─── */
function CountUp({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const counted = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !counted.current) {
        counted.current = true
        const obj = { val: 0 }
        gsap.to(obj, {
          val: end,
          duration: 1.7,
          ease: 'power3.out',
          onUpdate: () => setVal(Math.round(obj.val))
        })
      }
    }, { threshold: 0.4 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [end])

  return <span ref={ref}>{val.toLocaleString('en-NG')}{suffix}</span>
}

/* ─── Data ─── */
const locations = [
  { city: 'Lagos', sub: 'Lekki \u00b7 Ikoyi \u00b7 VI \u00b7 Ikeja', count: 1840 },
  { city: 'Abuja', sub: 'Maitama \u00b7 Asokoro \u00b7 Wuse', count: 1120 },
  { city: 'Port Harcourt', sub: 'GRA \u00b7 Trans-Amadi', count: 540 },
  { city: 'Ibadan', sub: 'Bodija \u00b7 Jericho', count: 410 },
  { city: 'Enugu', sub: 'GRA \u00b7 Independence Layout', count: 268 },
  { city: 'Kano', sub: 'Nassarawa \u00b7 Bompai', count: 192 },
]

const stats = [
  { value: 4200, suffix: '+', label: 'Verified properties listed' },
  { value: 18, suffix: '', label: 'States covered nationwide' },
  { value: 1600, suffix: '+', label: 'Direct owners & sellers' },
  { value: 96, suffix: '%', label: 'Buyers who skip the agent' },
]

const steps = [
  { n: '01', title: 'Browse verified listings', body: 'Search by city, type or budget. Every featured listing carries a verification badge so you know the title and photos are real.' },
  { n: '02', title: 'Connect directly \u2014 no middlemen', body: 'Message the owner straight from the listing on WhatsApp. Ask questions, request documents, book a viewing on your terms.' },
  { n: '03', title: 'Close with confidence', body: 'Inspect, agree, and complete with transparent guidance at every step. Your legacy, secured \u2014 no agent noise.' },
]

const testimonials = [
  { quote: 'I found my family home in three weeks and spoke to the owner directly. No endless agent fees, no runaround \u2014 just a clear, honest process.', name: 'Adaeze Okafor', role: 'Bought in Lekki, Lagos' },
  { quote: 'As a first-time buyer abroad, the verified badge gave me real confidence. Every document checked out exactly as listed.', name: 'Tunde Bakare', role: 'Diaspora buyer, London \u2192 Abuja' },
  { quote: 'Listed my late father\'s land and closed with a serious buyer in a month. StrongTower made a hard process feel dignified.', name: 'Grace Eze', role: 'Sold land in Enugu' },
  { quote: 'The WhatsApp-first approach just fits how we actually do business in Nigeria. Fast, personal, and transparent.', name: 'Ibrahim Yusuf', role: 'Investor, Kano' },
  { quote: 'Browsing on my phone during my commute, I shortlisted five homes before I even got home. Beautifully simple.', name: 'Chioma Nwosu', role: 'Rented in Port Harcourt' },
]

const whyBenefits: [string, string, string][] = [
  ['shield', 'Verified before it\'s featured', 'We confirm title documents, owner identity and photos so what you see is what\'s real.'],
  ['chat', 'Talk to owners directly', 'No gatekeepers. Message sellers on WhatsApp and negotiate on your own terms.'],
  ['sparkle', 'Built mobile-first', 'Browse, save and enquire from your phone \u2014 wherever you are in the world.'],
]

function whyIcon(name: string) {
  switch (name) {
    case 'shield': return <Shield size={20} />
    case 'chat': return <MessageCircle size={20} />
    case 'sparkle': return <Sparkles size={20} />
    default: return null
  }
}

const locGradients = [
  'linear-gradient(135deg, #2a1d16, #1a1310)',
  'linear-gradient(135deg, #1e1a18, #13100e)',
  'linear-gradient(135deg, #251e18, #161210)',
  'linear-gradient(135deg, #1f1a14, #12100c)',
  'linear-gradient(135deg, #28201a, #181410)',
  'linear-gradient(135deg, #221c17, #14110e)',
]

const blogGradient = 'linear-gradient(135deg, #1e1a18, #13100e)'

/* ─── Home ─── */
export default function Home() {
  const router = useRouter()
  const [properties, setProperties] = useState<(Property & { property_media?: PropertyMedia[] })[]>([])
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const statsRef = useRef<HTMLDivElement>(null)
  const whyMediaRef = useRef<HTMLDivElement>(null)
  const whyFloatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createClient()

    const fetchData = async () => {
      try {
        const [propRes, blogRes] = await Promise.all([
          supabase
            .from('properties')
            .select('*, property_media(*)')
            .eq('status', 'active')
            .limit(6)
            .order('created_at', { ascending: false }),
          supabase
            .from('blog_posts')
            .select('*')
            .eq('status', 'published')
            .limit(3)
            .order('published_at', { ascending: false }),
        ])
        if (propRes.data) setProperties(propRes.data as (Property & { property_media?: PropertyMedia[] })[])
        if (blogRes.data) setPosts(blogRes.data)
      } catch (e) {
        console.error('Home fetch error:', e)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (!whyMediaRef.current || !whyFloatRef.current) return
    gsap.fromTo(
      whyFloatRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: whyMediaRef.current, start: 'top 80%' } }
    )
  }, [])

  return (
    <>
      {/* ═══════ HERO ═══════ */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div className={styles.heroScrim} />
        </div>
        <div className={`wrap ${styles.heroInner}`}>
          <p className={`${styles.eyebrow} ${styles.heroEyebrow}`}>StrongTower Holdings · Nigeria</p>
          <h1 className={`${styles.display} ${styles.heroTitle}`}>
            Building <em>Legacies</em>,<br />one property at a time
          </h1>
          <p className={styles.heroSub}>
            Where trust meets opportunity — a marketplace built for the way Nigeria buys and sells real estate. No agents, no middlemen, no noise.
          </p>
          <SearchBar />
          <div className={styles.heroTrust}>
            <div className={styles.trustAvatars}>
              {[0, 1, 2, 3].map(i => (
                <span key={i} className={styles.trustAv}>
                  <User size={18} />
                </span>
              ))}
            </div>
            <div className={styles.trustText}>
              <Stars n={5} />
              <span><strong>4.9</strong> · trusted by <strong>12,000+</strong> Nigerians at home & abroad</span>
            </div>
          </div>
        </div>
        <div className={styles.heroScroll} aria-hidden="true">
          <span className={styles.heroScrollDot} />
        </div>
      </section>

      {/* ═══════ STATS ═══════ */}
      <section className={styles.statsBand} ref={statsRef}>
        <div className={`wrap ${styles.statsGrid}`}>
          {stats.map((s, i) => (
            <div key={i} className={styles.stat}>
              <div className={styles.statNum}>
                <CountUp end={s.value} suffix={s.suffix} />
              </div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ FEATURED ═══════ */}
      <section className={styles.section} id="featured">
        <div className="wrap">
          <div className={styles.secHead}>
            <div>
              <p className={styles.eyebrow}>Handpicked</p>
              <h2 className={`${styles.display} ${styles.secHeadTitle}`}>Featured homes worth the journey</h2>
            </div>
            <Button variant="ghost" onClick={() => router.push('/properties')}>
              View all properties <ArrowRight size={18} />
            </Button>
          </div>
          {loading ? (
            <div className={styles.featuredGrid}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ aspectRatio: '4/3', borderRadius: 'var(--radius-lg)', background: 'var(--color-surface)' }} />
              ))}
            </div>
          ) : (
            <div className={styles.featuredGrid}>
              {properties.map(p => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════ LOCATIONS ═══════ */}
      <section className={`${styles.section} ${styles.sectionTight} ${styles.locSection}`} id="locations">
        <div className="wrap">
          <div className={styles.secHead}>
            <div>
              <p className={styles.eyebrow}>Explore Nigeria</p>
              <h2 className={`${styles.display} ${styles.secHeadTitle}`}>Find your city</h2>
            </div>
          </div>
          <div className={styles.locGrid}>
            {locations.map((l, i) => (
              <div key={l.city} className={`${styles.locTile} ${i === 0 ? styles.locTileLg : ''}`}>
                <button onClick={() => router.push(`/properties?state=${encodeURIComponent(l.city)}`)} className={styles.locBtn}>
                  <div className={styles.locBg} style={{ background: locGradients[i] }} />
                  <div className={styles.locScrim} />
                  <div className={styles.locContent}>
                    <h3>{l.city}</h3>
                    <p className={styles.locSub}>{l.sub}</p>
                    <span className={styles.locCount}>
                      {l.count.toLocaleString('en-NG')} listings <ArrowUpRight size={15} />
                    </span>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className={`${styles.section} ${styles.howSection}`} id="how">
        <div className="wrap">
          <div style={{ textAlign: 'center', marginBottom: 'clamp(32px,5vw,64px)' }}>
            <p className={styles.eyebrow}>How it works</p>
            <h2 className={styles.display} style={{ fontSize: 'clamp(2.1rem,4.5vw,3.6rem)', marginTop: 10 }}>
              From <em>discovery</em> to closing
            </h2>
          </div>
          <div className={styles.howGrid}>
            {steps.map(s => (
              <div key={s.n} className={styles.howStep}>
                <span className={styles.howNum}>{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ WHY US ═══════ */}
      <section className={styles.section} id="why">
        <div className={`wrap ${styles.whyGrid}`}>
          <div className={styles.whyMedia} ref={whyMediaRef}>
            <img src="/image/coolhouse.avif" alt="Modern Nigerian home" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(12,11,10,0.7), rgba(12,11,10,0.05) 50%)' }} />
            <div className={styles.whyFloat} ref={whyFloatRef}>
              <span className={styles.whyFloatBadge}>
                <Shield size={14} /> Verified listing
              </span>
              <p>Title checked · Photos confirmed · Owner ID matched</p>
            </div>
          </div>
          <div>
            <p className={styles.eyebrow}>The StrongTower advantage</p>
            <h2 className={styles.display} style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', margin: '12px 0 8px' }}>
              Rooted in trust, built for <em>Nigeria</em>
            </h2>
            <p className={styles.lead}>
              Every featured property is vetted, every seller is verified, and every transaction is built on transparency. Real estate, reimagined for a new generation.
            </p>
            <div className={styles.whyList}>
              {whyBenefits.map(([ic, h, b], i) => (
                <div key={i} className={styles.whyItem}>
                  <span className={styles.whyIc}>{whyIcon(ic)}</span>
                  <div>
                    <h4>{h}</h4>
                    <p>{b}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section className={`${styles.section} ${styles.testiSection}`}>
        <div className="wrap" style={{ textAlign: 'center', marginBottom: 'clamp(28px,4vw,52px)' }}>
          <p className={styles.eyebrow}>Loved by movers & owners</p>
          <h2 className={styles.display} style={{ fontSize: 'clamp(2rem,4.2vw,3.3rem)', marginTop: 10 }}>Stories that build confidence</h2>
        </div>
        <div className={styles.testiMarqueeWrap}>
          <div className={styles.testiMarquee}>
            {[...testimonials, ...testimonials].map((t, i) => (
              <figure key={i} className={styles.testiCard}>
                <span className={styles.testiStars}>
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star key={si} size={14} fill="currentColor" />
                  ))}
                </span>
                <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption>
                  <span className={styles.testiAv}>
                    <User size={18} />
                  </span>
                  <span>
                    <strong className={styles.testiName}>{t.name}</strong>
                    <em className={styles.testiRole}>{t.role}</em>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ BLOG ═══════ */}
      <section className={styles.section} id="blog">
        <div className="wrap">
          <div className={styles.secHead}>
            <div>
              <p className={styles.eyebrow}>From the journal</p>
              <h2 className={`${styles.display} ${styles.secHeadTitle}`}>Know before you buy</h2>
            </div>
            <Button variant="ghost" onClick={() => router.push('/blog')}>
              All articles <ArrowRight size={18} />
            </Button>
          </div>
          {loading ? (
            <div className={styles.blogGrid}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ aspectRatio: '16/10', borderRadius: 'var(--radius-lg)', background: 'var(--color-surface)' }} />
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className={styles.blogGrid}>
              {posts.map(p => (
                <article key={p.id} className={styles.blogCard} onClick={() => router.push(`/blog/${p.slug}`)}>
                  <div className={styles.blogMedia}>
                    <div style={{ width: '100%', height: '100%', background: blogGradient }} />
                  </div>
                  <div className={styles.blogBody}>
                    <span className={styles.pill}>{p.category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
                    <h3>{p.title}</h3>
                    <span className={styles.blogRead}>
                      {p.excerpt ? `${Math.max(1, Math.round(p.excerpt.split(' ').length / 200))} min read` : 'Read article'} <ArrowUpRight size={14} />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className={styles.ctaBand}>
        <div className={styles.ctaGlow} aria-hidden="true" />
        <div className={`wrap ${styles.ctaInner}`}>
          <div className={styles.ctaContent}>
            <p className={styles.eyebrow}>List with StrongTower</p>
            <h2 className={styles.display}>Your next chapter is a <em>listing</em> away</h2>
            <p>Reach thousands of serious, verified buyers across Nigeria and the diaspora. Listing is free — your legacy starts here.</p>
            <div className={styles.ctaActions}>
              <Button variant="primary" size="lg" onClick={() => router.push('/register')}>
                List your property
              </Button>
              <button className={styles.ctaGhost} onClick={() => router.push('/properties')}>
                Browse properties
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
