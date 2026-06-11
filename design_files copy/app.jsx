/* App shell: router + tweaks → mounts #root */

const ACCENTS = {
  '#c4622d': { g: '#c4622d', d: '#d4703a', s: 'rgba(196,98,45,0.14)' },   /* terracotta (brand) */
  '#b8782f': { g: '#b8782f', d: '#cc8a3c', s: 'rgba(184,120,47,0.14)' },  /* burnt amber */
  '#b0432f': { g: '#b0432f', d: '#c4543d', s: 'rgba(176,67,47,0.14)' },   /* clay red */
  '#9c6b3f': { g: '#9c6b3f', d: '#b07e4e', s: 'rgba(156,107,63,0.14)' },  /* bronze */
};
const PAIRINGS = {
  modern:    { display: "'Bricolage Grotesque', system-ui, sans-serif", ui: "'Hanken Grotesk', system-ui, sans-serif", weight: 600, italic: false },
  editorial: { display: "'Newsreader', Georgia, serif", ui: "'Hanken Grotesk', system-ui, sans-serif", weight: 500, italic: true },
  refined:   { display: "'Spectral', Georgia, serif", ui: "'Hanken Grotesk', system-ui, sans-serif", weight: 500, italic: true },
  luxe:      { display: "'Bodoni Moda', Georgia, serif", ui: "'Hanken Grotesk', system-ui, sans-serif", weight: 500, italic: true },
};
const MOTION = { calm: 0.65, lively: 1, dynamic: 1.4 };

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "accent": "#c4622d",
  "pairing": "modern",
  "motion": "lively"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = React.useState('home');
  const [prop, setProp] = React.useState(null);
  const [article, setArticle] = React.useState(null);
  const [anim, setAnim] = React.useState(0);

  // apply tweaks to :root
  React.useEffect(() => {
    const r = document.documentElement;
    r.setAttribute('data-theme', t.theme);
    const a = ACCENTS[(t.accent || '').toLowerCase()] || ACCENTS['#c4622d'];
    r.style.setProperty('--gold', a.g);
    r.style.setProperty('--gold-deep', a.d);
    r.style.setProperty('--gold-soft', a.s);
    const p = PAIRINGS[t.pairing] || PAIRINGS.modern;
    r.style.setProperty('--font-display', p.display);
    r.style.setProperty('--font-ui', p.ui);
    r.style.setProperty('--display-weight', p.weight);
    r.setAttribute('data-italic', p.italic ? '1' : '0');
    r.style.setProperty('--motion', MOTION[t.motion] ?? 1);
  }, [t.theme, t.accent, t.pairing, t.motion]);

  const go = React.useCallback((to, hash) => {
    if (to === route && hash) { scrollToHash(hash); return; }
    setRoute(to);
    setAnim(a => a + 1);
    if (hash) { setTimeout(() => scrollToHash(hash), 80); }
    else window.scrollTo(0, 0);
  }, [route]);

  const openProp = React.useCallback((p) => {
    setProp(p); setRoute('detail'); setAnim(a => a + 1); window.scrollTo(0, 0);
  }, []);

  const openArticle = React.useCallback((a) => {
    setArticle(a); setRoute('article'); setAnim(n => n + 1); window.scrollTo(0, 0);
  }, []);

  function scrollToHash(hash) {
    const el = document.getElementById(hash);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  const overHero = route === 'home';

  return (
    <>
      <Nav go={go} route={route} overHero={overHero} />
      <div className="page" key={anim}>
        {route === 'home' && <HomePage go={go} openProp={openProp} />}
        {route === 'listings' && <ListingsPage go={go} openProp={openProp} />}
        {route === 'detail' && <DetailPage go={go} openProp={openProp} prop={prop} />}
        {route === 'blog' && <BlogPage go={go} openArticle={openArticle} />}
        {route === 'article' && <ArticlePage go={go} openArticle={openArticle} post={article} />}
      </div>
      <Footer go={go} />

      <TweaksPanel>
        <TweakSection label="Theme" />
        <TweakRadio label="Mode" value={t.theme}
          options={[{value:'dark',label:'Dark'},{value:'light',label:'Light'}]}
          onChange={v => setTweak('theme', v)} />
        <TweakColor label="Accent" value={t.accent}
          options={['#c4622d', '#b8782f', '#b0432f', '#9c6b3f']}
          onChange={v => setTweak('accent', v)} />
        <TweakSection label="Typography" />
        <TweakSelect label="Type pairing" value={t.pairing}
          options={[{value:'modern',label:'Modern · Bricolage (current)'},{value:'editorial',label:'Editorial · Newsreader'},{value:'refined',label:'Refined · Spectral'},{value:'luxe',label:'Luxe · Bodoni Moda'}]}
          onChange={v => setTweak('pairing', v)} />
        <TweakSection label="Motion" />
        <TweakRadio label="Animation" value={t.motion}
          options={[{value:'calm',label:'Calm'},{value:'lively',label:'Lively'},{value:'dynamic',label:'Bold'}]}
          onChange={v => setTweak('motion', v)} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
