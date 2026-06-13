/* Listings page → window.ListingsPage */
function ListingsPage({ go, openProp }) {
  const { props, states } = window.STData;
  const cats = ['All', 'Detached Duplex', 'Terrace Duplex', 'Bungalow', 'Block of Flats', 'Land / Plot', 'Penthouse', 'Semi-Detached', 'Shortlet'];
  const catIcon = { 'All': 'grid', 'Detached Duplex': 'home', 'Terrace Duplex': 'home', 'Bungalow': 'home', 'Block of Flats': 'home', 'Land / Plot': 'ruler', 'Penthouse': 'sparkle', 'Semi-Detached': 'home', 'Shortlet': 'calendar' };

  const [cat, setCat] = React.useState('All');
  const [sort, setSort] = React.useState('featured');
  const [stateF, setStateF] = React.useState('');
  const [verifiedOnly, setVerifiedOnly] = React.useState(false);

  let list = props.filter(p => (cat === 'All' || p.type === cat));
  if (verifiedOnly) list = list.filter(p => p.verified);
  if (stateF) list = list.filter(p => stateF.includes(p.state));
  list = [...list].sort((a, b) => {
    if (sort === 'low') return a.priceNum - b.priceNum;
    if (sort === 'high') return b.priceNum - a.priceNum;
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  return (
    <main className="listings">
      {/* Sticky toolbar */}
      <div className="lst-toolbar">
        <div className="wrap">
          <div className="lst-searchrow">
            <div className="lst-statesel">
              <Icon name="pin" size={17} />
              <select value={stateF} onChange={e => setStateF(e.target.value)}>
                <option value="">All states · Nigeria</option>
                {states.map(s => <option key={s} value={s.split(' — ')[0].replace('FCT','Abuja')}>{s}</option>)}
              </select>
            </div>
            <button className={`lst-filterbtn ${verifiedOnly ? 'on' : ''}`} onClick={() => setVerifiedOnly(v => !v)}>
              <Icon name="check" size={17} /> <span>Verified only</span>
            </button>
            <div className="lst-sort">
              <Icon name="sliders" size={16} />
              <select value={sort} onChange={e => setSort(e.target.value)}>
                <option value="featured">Newest first</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
              </select>
            </div>
          </div>
          <div className="lst-cats hide-scrollbar">
            {cats.map(c => (
              <button key={c} className={`cat-chip ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>
                <Icon name={catIcon[c]} size={18} />
                <span>{c === 'Land / Plot' ? 'Land' : c}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="wrap lst-body">
        <div className="lst-head">
          <div>
            <h1 className="display lst-title">{cat === 'All' ? 'All properties' : cat}</h1>
            <p className="muted lst-count">{list.length} {list.length === 1 ? 'property' : 'properties'} across Nigeria</p>
          </div>
          <button className="lst-map-btn"><Icon name="pin" size={16} /> Show map</button>
        </div>

        {list.length === 0 ? (
          <div className="lst-empty">
            <Icon name="search" size={40} />
            <h3>No properties match your search</h3>
            <p>Try a different category or clear your filters.</p>
            <button className="btn btn-ghost" onClick={() => { setCat('All'); setStateF(''); setVerifiedOnly(false); }}>Reset filters</button>
          </div>
        ) : (
          <div className="grid-cards lst-grid">
            {list.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 70}><PropertyCard p={p} onOpen={openProp} /></Reveal>
            ))}
          </div>
        )}

        {list.length > 0 && (
          <div className="lst-more">
            <button className="btn btn-ghost btn-lg">Load more <Icon name="chevDown" size={18} /></button>
          </div>
        )}
      </div>
    </main>
  );
}
window.ListingsPage = ListingsPage;
