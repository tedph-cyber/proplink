/* Property detail → window.DetailPage */
function DetailPage({ go, openProp, prop }) {
  const { props, amenities } = window.STData;
  const p = prop || props[0];
  const similar = props.filter(x => x.id !== p.id && (x.state === p.state || x.type === p.type)).slice(0, 3);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => { window.scrollTo(0, 0); }, [p.id]);

  const facts = [
    p.beds > 0 && ['bed', p.beds, 'Bedrooms'],
    p.baths > 0 && ['bath', p.baths, 'Bathrooms'],
    ['ruler', p.sqm + 'm²', p.beds > 0 ? 'Floor area' : 'Plot size'],
    ['home', p.type, 'Property type'],
  ].filter(Boolean);

  return (
    <main className="detail">
      <div className="wrap">
        <button className="detail-back" onClick={() => go('listings')}>
          <Icon name="chevron" size={16} style={{ transform: 'rotate(180deg)' }} /> Back to properties
        </button>

        {/* Gallery */}
        <div className="gallery">
          <div className="gallery-main"><Ph label="Main photo" style={{ position: 'absolute', inset: 0 }} kenburns /></div>
          <div className="gallery-side gs1"><Ph label="Living room" style={{ position: 'absolute', inset: 0 }} /></div>
          <div className="gallery-side gs2"><Ph label="Kitchen" style={{ position: 'absolute', inset: 0 }} /></div>
          <div className="gallery-side gs3"><Ph label="Bedroom" style={{ position: 'absolute', inset: 0 }} /></div>
          <div className="gallery-side gs4">
            <Ph label="Exterior" style={{ position: 'absolute', inset: 0 }} />
            <button className="gallery-all"><Icon name="grid" size={16} /> Show all photos</button>
          </div>
        </div>

        <div className="detail-grid">
          {/* MAIN */}
          <div className="detail-main">
            <div className="detail-titlerow">
              <div>
                <div className="detail-tags">
                  {p.verified && <span className="badge-verify"><Icon name="shield" size={14} /> Verified listing</span>}
                  <span className="pill">{p.tag}</span>
                </div>
                <h1 className="display detail-title">{p.title}</h1>
                <p className="detail-loc"><Icon name="pin" size={16} /> {p.area}, {p.state} State, Nigeria</p>
              </div>
              <div className="detail-iconbtns">
                <button onClick={() => {}}><Icon name="share" size={18} /></button>
                <button onClick={() => setSaved(s => !s)} className={saved ? 'on' : ''}>
                  <Icon name="heart" size={18} style={{ fill: saved ? 'var(--gold)' : 'none', color: saved ? 'var(--gold)' : 'currentColor' }} />
                </button>
              </div>
            </div>

            <div className="facts">
              {facts.map(([ic, v, l], i) => (
                <div key={i} className="fact">
                  <span className="fact-ic"><Icon name={ic} size={20} /></span>
                  <div><strong>{v}</strong><span>{l}</span></div>
                </div>
              ))}
            </div>

            <section className="detail-section">
              <h2>About this property</h2>
              <p>{p.blurb}</p>
              <p>This listing is offered directly by the verified owner — no agents, no middlemen. Documents are available on request, and you can arrange an inspection at a time that suits you. StrongTower confirms the title, owner identity and photographs before any property earns its verified badge.</p>
            </section>

            <section className="detail-section">
              <h2>What this place offers</h2>
              <div className="amen-grid">
                {amenities.map((a, i) => (
                  <div key={i} className="amen"><Icon name="check" size={17} /> {a}</div>
                ))}
              </div>
            </section>

            <section className="detail-section">
              <h2>Where you’ll be</h2>
              <div className="detail-map">
                <Ph label={`Map · ${p.area}, ${p.state}`} style={{ position: 'absolute', inset: 0 }} />
                <div className="map-pin"><Icon name="pin" size={22} /></div>
              </div>
              <p className="muted" style={{ marginTop: 14 }}>Exact location shared with serious enquirers after first contact, for the owner’s privacy and safety.</p>
            </section>
          </div>

          {/* SIDEBAR */}
          <aside className="detail-side">
            <div className="contact-card card">
              <div className="contact-price">
                <strong>{p.price}</strong>{p.period && <span className="muted">{p.period}</span>}
              </div>
              <div className="contact-owner">
                <span className="contact-av"><Ph style={{ position: 'absolute', inset: 0 }} /></span>
                <div>
                  <strong>Listed by owner</strong>
                  <span className="muted">Verified · Responds in ~2 hrs</span>
                </div>
              </div>
              <button className="btn btn-wa btn-block btn-lg contact-wa"><Icon name="whatsapp" size={19} /> Contact Seller on WhatsApp</button>
              <button className="btn btn-ghost btn-block"><Icon name="calendar" size={18} /> Schedule a viewing</button>
              <div className="contact-safe">
                <Icon name="shield" size={16} />
                <p>Never pay before inspecting. <a onClick={() => go('home')}>Read our safety guide</a>.</p>
              </div>
            </div>
          </aside>
        </div>

        {/* Similar */}
        <section className="detail-similar">
          <h2 className="display">More in {p.state}</h2>
          <div className="grid-cards">
            {similar.map((s, i) => (
              <Reveal key={s.id} delay={i * 80}><PropertyCard p={s} onOpen={openProp} /></Reveal>
            ))}
          </div>
        </section>
      </div>

      {/* Mobile sticky contact bar */}
      <div className="mobile-contact">
        <div className="mc-price"><strong>{p.price}</strong>{p.period && <span className="muted">{p.period}</span>}</div>
        <button className="btn btn-wa mc-btn"><Icon name="whatsapp" size={18} /> Contact</button>
      </div>
    </main>
  );
}
window.DetailPage = DetailPage;
