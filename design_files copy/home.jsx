/* Home page → window.HomePage */
function SearchBar({ go }) {
  const { states } = window.STData;
  return (
    <div className="searchbar">
      <div className="searchbar-fields">
        <label className="sb-field">
          <span className="sb-label">Property type</span>
          <div className="sb-input"><Icon name="home" size={16} />
            <select defaultValue=""><option value="">All types</option><option>House</option><option>Land</option></select>
          </div>
        </label>
        <label className="sb-field">
          <span className="sb-label">State</span>
          <div className="sb-input"><Icon name="pin" size={16} />
            <select defaultValue=""><option value="">Anywhere in Nigeria</option>{states.map(s => <option key={s}>{s}</option>)}</select>
          </div>
        </label>
        <button className="sb-go" onClick={() => go('listings')} aria-label="Search">
          <Icon name="search" size={20} /><span className="sb-go-text">Search properties</span>
        </button>
      </div>
    </div>
  );
}

function HomePage({ go, openProp }) {
  const { props, locations, stats, steps, testimonials, posts } = window.STData;
  const featured = props.filter(p => p.featured);

  return (
    <main>
      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="hero-bg">
          <Ph kenburns label="Hero · luxury property at dusk" style={{ position: 'absolute', inset: 0 }} />
          <div className="hero-scrim" />
        </div>
        <div className="wrap hero-inner">
          <p className="eyebrow hero-eyebrow reveal in" style={{ color: 'var(--gold)' }}>StrongTower Holdings · Nigeria</p>
          <h1 className="display hero-title">Building <em>Legacies</em>,<br />one property at a time</h1>
          <p className="hero-sub">Where trust meets opportunity — a marketplace built for the way Nigeria buys and sells real estate. No agents, no middlemen, no noise.</p>
          <SearchBar go={go} />
          <div className="hero-trust">
            <div className="trust-avatars">
              {[0,1,2,3].map(i => <span key={i} className="trust-av"><Ph style={{position:'absolute',inset:0}} /></span>)}
            </div>
            <div className="trust-text">
              <Stars n={5} size={14} />
              <span><strong>4.9</strong> · trusted by <strong>12,000+</strong> Nigerians at home & abroad</span>
            </div>
          </div>
        </div>
        <div className="hero-scroll" aria-hidden="true"><span /></div>
      </section>

      {/* ============ STATS ============ */}
      <section className="stats-band">
        <div className="wrap stats-grid">
          {stats.map((s, i) => (
            <Reveal key={i} className="stat" delay={i * 90}>
              <div className="stat-num"><CountUp end={s.value} suffix={s.suffix} /></div>
              <div className="stat-label">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ FEATURED ============ */}
      <section className="section" id="featured">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <Reveal as="p" className="eyebrow">Handpicked</Reveal>
              <Reveal as="h2" className="display sec-head-title" delay={60}>Featured homes worth the journey</Reveal>
            </div>
            <Reveal delay={120}>
              <button className="btn btn-ghost" onClick={() => go('listings')}>View all properties <Icon name="arrow" size={18} /></button>
            </Reveal>
          </div>
          <div className="grid-cards">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 90}><PropertyCard p={p} onOpen={openProp} /></Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ LOCATIONS ============ */}
      <section className="section section-tight loc-section" id="locations">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <Reveal as="p" className="eyebrow">Explore Nigeria</Reveal>
              <Reveal as="h2" className="display sec-head-title" delay={60}>Find your city</Reveal>
            </div>
          </div>
          <div className="loc-grid">
            {locations.map((l, i) => (
              <Reveal key={l.city} delay={(i % 3) * 80} className={`loc-tile ${i === 0 ? 'loc-tile-lg' : ''}`}>
                <button onClick={() => go('listings')} className="loc-btn">
                  <Ph label={l.city} style={{ position: 'absolute', inset: 0 }} kenburns />
                  <div className="loc-scrim" />
                  <div className="loc-content">
                    <h3>{l.city}</h3>
                    <p>{l.sub}</p>
                    <span className="loc-count">{l.count.toLocaleString('en-NG')} listings <Icon name="arrowUpRight" size={15} /></span>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="section how-section" id="how">
        <div className="wrap">
          <div className="center" style={{ marginBottom: 'clamp(32px,5vw,64px)' }}>
            <Reveal as="p" className="eyebrow">How it works</Reveal>
            <Reveal as="h2" className="display" delay={60} style={{ fontSize: 'clamp(2.1rem,4.5vw,3.6rem)', marginTop: 10 }}>From <em>discovery</em> to closing</Reveal>
          </div>
          <div className="how-grid">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 110} className="how-step">
                <span className="how-num">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHY US ============ */}
      <section className="section why-section" id="why">
        <div className="wrap why-grid">
          <Reveal className="why-media">
            <Ph label="Owner & buyer, in person" style={{ position: 'absolute', inset: 0 }} kenburns />
            <div className="why-float card">
              <span className="badge-verify"><Icon name="shield" size={14} /> Verified listing</span>
              <p>Title checked · Photos confirmed · Owner ID matched</p>
            </div>
          </Reveal>
          <div className="why-text">
            <Reveal as="p" className="eyebrow">The StrongTower advantage</Reveal>
            <Reveal as="h2" className="display" delay={60} style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', margin: '12px 0 8px' }}>Rooted in trust, built for <em>Nigeria</em></Reveal>
            <Reveal as="p" className="lead" delay={120}>Every featured property is vetted, every seller is verified, and every transaction is built on transparency. Real estate, reimagined for a new generation.</Reveal>
            <div className="why-list">
              {[
                ['shield', 'Verified before it’s featured', 'We confirm title documents, owner identity and photos so what you see is what’s real.'],
                ['chat', 'Talk to owners directly', 'No gatekeepers. Message sellers on WhatsApp and negotiate on your own terms.'],
                ['sparkle', 'Built mobile-first', 'Browse, save and enquire from your phone — wherever you are in the world.'],
              ].map(([ic, h, b], i) => (
                <Reveal key={i} delay={140 + i * 90} className="why-item">
                  <span className="why-ic"><Icon name={ic} size={20} /></span>
                  <div><h4>{h}</h4><p>{b}</p></div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="section testi-section">
        <div className="wrap center" style={{ marginBottom: 'clamp(28px,4vw,52px)' }}>
          <Reveal as="p" className="eyebrow">Loved by movers & owners</Reveal>
          <Reveal as="h2" className="display" delay={60} style={{ fontSize: 'clamp(2rem,4.2vw,3.3rem)', marginTop: 10 }}>Stories that build confidence</Reveal>
        </div>
        <div className="testi-marquee-wrap">
          <div className="testi-marquee">
            {[...testimonials, ...testimonials].map((t, i) => (
              <figure key={i} className="testi-card">
                <Stars n={t.rating} />
                <blockquote>“{t.quote}”</blockquote>
                <figcaption>
                  <span className="testi-av"><Ph style={{position:'absolute',inset:0}} /></span>
                  <span><strong>{t.name}</strong><em>{t.role}</em></span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============ BLOG ============ */}
      <section className="section" id="blog">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <Reveal as="p" className="eyebrow">From the journal</Reveal>
              <Reveal as="h2" className="display sec-head-title" delay={60}>Know before you buy</Reveal>
            </div>
            <Reveal delay={120}><button className="btn btn-ghost" onClick={() => go('blog')}>All articles <Icon name="arrow" size={18} /></button></Reveal>
          </div>
          <div className="blog-grid">
            {posts.map((p, i) => (
              <Reveal key={i} delay={i * 90} className="blog-card" as="article" onClick={() => go('blog')} style={{ cursor: 'pointer' }}>
                <div className="blog-media"><Ph label="Article cover" style={{ position: 'absolute', inset: 0 }} /></div>
                <div className="blog-body">
                  <span className="pill">{p.cat}</span>
                  <h3>{p.title}</h3>
                  <span className="blog-read">{p.read} <Icon name="arrowUpRight" size={14} /></span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="cta-band">
        <div className="wrap cta-inner">
          <Reveal className="cta-content">
            <p className="eyebrow" style={{ color: 'var(--gold)' }}>List with StrongTower</p>
            <h2 className="display">Your next chapter is a <em>listing</em> away</h2>
            <p>Reach thousands of serious, verified buyers across Nigeria and the diaspora. Listing is free — your legacy starts here.</p>
            <div className="cta-actions">
              <button className="btn btn-gold btn-lg" onClick={() => go('listings')}>List your property</button>
              <button className="btn btn-lg cta-ghost" onClick={() => go('listings')}>Browse properties</button>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
window.HomePage = HomePage;
