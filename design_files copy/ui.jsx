/* Shared UI primitives → window */
const { useState, useEffect, useRef, useCallback } = React;

/* ---------------- Icons (simple line icons, Lucide-derived) ---------------- */
function Icon({ name, size = 20, stroke = 1.6, style, className }) {
  const p = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round',
    style, className, 'aria-hidden': true,
  };
  const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>,
    pin: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>,
    bed: <><path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20" /><path d="M6 8V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2" /></>,
    bath: <><path d="M4 12V5a2 2 0 0 1 2-2 2 2 0 0 1 2 2" /><path d="M2 12h20v3a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4Z" /><path d="M6 19v2M18 19v2" /></>,
    ruler: <><path d="M3 9l6-6 12 12-6 6Z" /><path d="M9 7l1.5 1.5M12 4l2 2M6 12l1.5 1.5M15 13l2 2M12 16l1.5 1.5" /></>,
    check: <path d="M20 6 9 17l-5-5" />,
    star: <path d="m12 2 3 6.5 7 .9-5 4.8 1.3 7L12 18l-6.6 3.2L6.7 14l-5-4.8 7-.9Z" fill="currentColor" stroke="none" />,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    arrowUpRight: <><path d="M7 17 17 7" /><path d="M8 7h9v9" /></>,
    heart: <path d="M19 14c1.5-1.5 3-3.3 3-5.5A4.5 4.5 0 0 0 12 5 4.5 4.5 0 0 0 2 8.5c0 2.2 1.5 4 3 5.5l7 7Z" />,
    menu: <><path d="M3 6h18M3 12h18M3 18h18" /></>,
    close: <><path d="M18 6 6 18M6 6l12 12" /></>,
    chat: <path d="M21 11.5a8.4 8.4 0 0 1-12 7.6L3 21l1.9-6A8.4 8.4 0 1 1 21 11.5Z" />,
    whatsapp: <><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.4A10 10 0 1 0 12 2Z" /><path d="M8.5 7.5c-.3 0-.6.1-.8.4-.3.4-.9 1-.9 2.3s1 2.6 1.1 2.8c.1.2 1.9 3 4.7 4.1 2.3.9 2.8.7 3.3.7.6-.1 1.8-.8 2-1.5.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3l-1.8-.9c-.3-.1-.5-.1-.7.1l-.7.9c-.1.2-.3.2-.5.1-.7-.3-1.5-.7-2.3-1.7-.6-.7-.9-1.3-1-1.5-.1-.2 0-.4.1-.5l.4-.5c.1-.2.1-.3.2-.5 0-.2 0-.4 0-.5l-.7-1.7c-.2-.5-.4-.5-.6-.5Z" fill="currentColor" stroke="none" /></>,
    shield: <><path d="M12 2 4 5v6c0 5 3.5 8 8 11 4.5-3 8-6 8-11V5Z" /><path d="m9 12 2 2 4-4" /></>,
    chevron: <path d="m9 6 6 6-6 6" />,
    chevDown: <path d="m6 9 6 6 6-6" />,
    sliders: <><path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h12M20 18h0" /><circle cx="16" cy="6" r="2" /><circle cx="8" cy="12" r="2" /><circle cx="18" cy="18" r="2" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    phone: <path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
    play: <path d="M7 4v16l13-8Z" fill="currentColor" stroke="none" />,
    sparkle: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z" />,
    home: <><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></>,
    share: <><circle cx="6" cy="12" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="18" cy="18" r="2" /><path d="m8 11 8-4M8 13l8 4" /></>,
  };
  return <svg {...p}>{paths[name] || null}</svg>;
}

/* ---------------- Scroll reveal ---------------- */
function Reveal({ children, delay = 0, as = 'div', className = '', style, ...rest }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Tag = as;
  return (
    <Tag ref={ref} className={`reveal ${seen ? 'in' : ''} ${className}`}
      style={{ '--reveal-delay': delay + 'ms', ...style }} {...rest}>
      {children}
    </Tag>
  );
}

/* ---------------- Count up on view ---------------- */
function CountUp({ end, suffix = '', dur = 1700 }) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          if (reduce) { setVal(end); return; }
          const t0 = performance.now();
          const tick = (t) => {
            const p = Math.min(1, (t - t0) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(end * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [end]);
  return <span ref={ref}>{val.toLocaleString('en-NG')}{suffix}</span>;
}

/* ---------------- Placeholder image ---------------- */
function Ph({ label, className = '', style, kenburns = false, children }) {
  return (
    <div className={`ph ${className}`} style={style}>
      <div className={kenburns ? 'kenburns' : ''} style={{ position: 'absolute', inset: 0,
        background: 'inherit' }} />
      {label && <span className="ph-label">{label}</span>}
      {children}
    </div>
  );
}

/* ---------------- Stars ---------------- */
function Stars({ n = 5, size = 15 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2, color: 'var(--gold)' }}>
      {Array.from({ length: n }).map((_, i) => <Icon key={i} name="star" size={size} />)}
    </span>
  );
}

/* ---------------- Property card (per CLAUDE.md: type badge + one WhatsApp action) ---------------- */
function PropertyCard({ p, onOpen }) {
  const isLand = /land|plot/i.test(p.type);
  return (
    <article className="prop-card" onClick={() => onOpen && onOpen(p)}
      style={{ cursor: 'pointer' }}>
      <div className="prop-card-media">
        <Ph label="Property photo" style={{ position: 'absolute', inset: 0 }} />
        <span className="prop-card-badge">{isLand ? 'Land' : 'House'}</span>
      </div>
      <div className="prop-card-body">
        <h3 className="prop-card-title">{p.title}</h3>
        <p className="prop-card-loc">
          {p.verified && <span className="prop-verified"><Icon name="check" size={13} /> Verified</span>}
          <span><Icon name="pin" size={13} /> {p.area}, {p.state}</span>
        </p>
        {p.beds > 0 && (
          <div className="prop-card-specs">
            <span><Icon name="bed" size={15} /> {p.beds}</span>
            <span><Icon name="bath" size={15} /> {p.baths}</span>
            <span><Icon name="ruler" size={15} /> {p.sqm}m²</span>
          </div>
        )}
        {p.beds === 0 && <div className="prop-card-specs"><span><Icon name="ruler" size={15} /> {p.sqm}m² plot</span></div>}
        <div className="prop-card-price">
          <strong>{p.price}</strong>{p.period && <span className="muted"> {p.period}</span>}
        </div>
        <button className="btn btn-wa prop-card-wa" onClick={(e) => { e.stopPropagation(); }}>
          <Icon name="whatsapp" size={17} /> Contact Seller
        </button>
      </div>
    </article>
  );
}

Object.assign(window, { Icon, Reveal, CountUp, Ph, Stars, PropertyCard });
