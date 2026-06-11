/* Nav + Footer → window */
const { useState: useStateNF, useEffect: useEffectNF } = React;

function Logo({ onDark = false }) {
  return (
    <span className="logo">
      <span className="logo-name"><span className="logo-strong">Strong</span><span className="logo-tower">Tower</span></span>
      <span className="logo-hold">Holdings</span>
    </span>
  );
}

function Nav({ go, route, overHero = false }) {
  const [scrolled, setScrolled] = useStateNF(false);
  const [open, setOpen] = useStateNF(false);
  useEffectNF(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffectNF(() => { document.body.style.overflow = open ? 'hidden' : ''; }, [open]);

  const solid = scrolled || !overHero;
  const links = [
    { id: 'listings', label: 'Properties' },
    { id: 'home', label: 'How it works', hash: 'how' },
    { id: 'home', label: 'Why us', hash: 'why' },
    { id: 'blog', label: 'Journal' },
  ];

  const nav = (id, hash) => { setOpen(false); go(id, hash); };

  return (
    <>
      <header className={`nav ${solid ? 'nav-solid' : 'nav-over'}`}>
        <div className="wrap nav-inner">
          <button className="nav-logo" onClick={() => nav('home')} aria-label="StrongTower home">
            <Logo onDark={!solid} />
          </button>
          <nav className="nav-links">
            {links.map((l, i) => (
              <button key={i} className="nav-link" onClick={() => nav(l.id, l.hash)}>{l.label}</button>
            ))}
          </nav>
          <div className="nav-actions">
            <button className="nav-link nav-login" onClick={() => nav('listings')}>
              <Icon name="user" size={17} /> Log in
            </button>
            <button className="btn btn-gold nav-cta" onClick={() => nav('listings')}>List a property</button>
            <button className="nav-burger" aria-label="Menu" onClick={() => setOpen(true)}>
              <Icon name="menu" size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* mobile sheet */}
      <div className={`mobile-menu ${open ? 'open' : ''}`}>
        <div className="mobile-menu-head wrap">
          <Logo />
          <button className="nav-burger" aria-label="Close" onClick={() => setOpen(false)}><Icon name="close" size={26} /></button>
        </div>
        <nav className="mobile-links">
          <button onClick={() => nav('home')}>Home</button>
          {links.map((l, i) => <button key={i} onClick={() => nav(l.id, l.hash)}>{l.label}</button>)}
        </nav>
        <div className="mobile-menu-foot">
          <button className="btn btn-ghost btn-block" onClick={() => nav('listings')}>Log in</button>
          <button className="btn btn-gold btn-block" onClick={() => nav('listings')}>List a property</button>
          <p className="muted" style={{ fontSize: '.85rem', marginTop: 18 }}>hello@strongtowerholdings.com</p>
        </div>
      </div>
      {open && <div className="scrim" onClick={() => setOpen(false)} />}
    </>
  );
}

function Footer({ go }) {
  const cols = [
    { h: 'Explore', items: ['All properties', 'Lagos', 'Abuja', 'Port Harcourt', 'Land & plots'] },
    { h: 'Company', items: ['Our story', 'How it works', 'Verification', 'Careers', 'Press'] },
    { h: 'Support', items: ['Help centre', 'List a property', 'Contact us', 'WhatsApp', 'FAQs'] },
    { h: 'Legal', items: ['Terms', 'Privacy', 'Cookies', 'Refund policy'] },
  ];
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo onDark />
            <p className="footer-blurb">Building legacies, one property at a time. A trusted marketplace built for the way Nigeria buys and sells real estate — no agents, no middlemen, no noise.</p>
            <div className="footer-social">
              {['chat', 'share', 'phone'].map((n, i) => (
                <button key={i} className="footer-soc" aria-label="social"><Icon name={n} size={18} /></button>
              ))}
            </div>
          </div>
          <div className="footer-cols">
            {cols.map((c, i) => (
              <div key={i} className="footer-col">
                <h4>{c.h}</h4>
                {c.items.map((it, j) => (
                  <button key={j} onClick={() => go('listings')} className="footer-item">{it}</button>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 StrongTower Holdings. All rights reserved.</span>
          <span className="footer-made">Made in Nigeria · Serving the world 🇳🇬</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Nav, Footer, Logo });
