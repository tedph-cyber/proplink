/* "The Foundation" — Blog listing + article → window.BlogPage, window.ArticlePage */

function JournalMasthead() {
  const { posts } = window.BlogData;
  return (
    <header className="masthead">
      <div className="wrap">
        <div className="masthead-rule" />
        <div className="masthead-top">
          <span className="masthead-kicker">StrongTower Journal · Est. 2024</span>
          <span className="masthead-issue">June 2026 · {posts.length} dispatches</span>
        </div>
        <h1 className="masthead-title">The Foundation</h1>
        <p className="masthead-stand">Field notes on buying, building and owning property in Nigeria — written for people who'd rather skip the agent.</p>
      </div>
    </header>
  );
}

function CategoryRail({ active, onPick }) {
  const { CATEGORIES } = window.BlogData;
  return (
    <div className="journal-rail">
      <div className="wrap">
        <div className="journal-rail-inner hide-scrollbar">
          {CATEGORIES.map(c => (
            <button key={c.value} className={`j-chip ${active === c.value ? 'active' : ''}`} onClick={() => onPick(c.value)}>{c.label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StoryCard({ post, onOpen }) {
  return (
    <article className="story-card" onClick={() => onOpen(post)}>
      <div className="story-media"><Ph label={post.cover} style={{ position: 'absolute', inset: 0 }} /></div>
      <span className="story-eyebrow">{post.categoryLabel}</span>
      <h3 className="story-title">{post.title}</h3>
      <p className="story-excerpt">{post.excerpt}</p>
      <div className="story-foot"><span>{post.date}</span><span className="dot" /><span>{post.read} min read</span></div>
    </article>
  );
}

function WideStory({ post, onOpen }) {
  return (
    <article className="story-wide story-card" onClick={() => onOpen(post)}>
      <div className="story-media"><Ph label={post.cover} style={{ position: 'absolute', inset: 0 }} /></div>
      <div className="story-wide-body">
        <span className="story-eyebrow">{post.categoryLabel}</span>
        <h3 className="story-title">{post.title}</h3>
        <p className="story-excerpt">{post.excerpt}</p>
        <div className="story-foot"><span>{post.author}</span><span className="dot" /><span>{post.read} min read</span></div>
      </div>
    </article>
  );
}

function BlogPage({ go, openArticle }) {
  const { posts } = window.BlogData;
  const [cat, setCat] = React.useState('all');

  const filtered = cat === 'all' ? posts : posts.filter(p => p.category === cat);
  const lead = filtered.find(p => p.featured) || filtered[0];
  const rest = filtered.filter(p => p !== lead);
  // insert a wide feature after the 3rd card
  const wideIndex = 3;

  return (
    <main className="journal">
      <JournalMasthead />
      <CategoryRail active={cat} onPick={setCat} />

      <div className="wrap">
        {lead && (
          <Reveal as="article" className="lead-story" onClick={() => openArticle(lead)}>
            <div className="lead-media">
              <Ph label={lead.cover} style={{ position: 'absolute', inset: 0 }} kenburns />
              <span className="lead-badge">Featured</span>
            </div>
            <div className="lead-body">
              <span className="lead-eyebrow">{lead.categoryLabel}</span>
              <h2 className="lead-title">{lead.title}</h2>
              <p className="lead-excerpt">{lead.excerpt}</p>
              <div className="lead-meta"><span>{lead.author}</span><span className="dot" /><span>{lead.date}</span><span className="dot" /><span>{lead.read} min read</span></div>
              <span className="lead-link">Read the story <Icon name="arrow" size={17} /></span>
            </div>
          </Reveal>
        )}

        {rest.length > 0 && (
          <div className="journal-grid">
            {rest.map((p, i) => (
              <React.Fragment key={p.slug}>
                {i === wideIndex && rest.length > wideIndex + 1 && (
                  <Reveal><WideStory post={rest[wideIndex]} onOpen={openArticle} /></Reveal>
                )}
                {i !== wideIndex && (
                  <Reveal delay={(i % 3) * 70}><StoryCard post={p} onOpen={openArticle} /></Reveal>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        <Reveal as="section" className="journal-news">
          <div className="journal-news-inner">
            <p className="eyebrow">Stay informed</p>
            <h3>The market report, once a month.</h3>
            <p>Join 5,000+ buyers, sellers and investors getting our monthly read on the Nigerian property market — plus the legal breakdowns we wish we'd had earlier.</p>
            <form className="news-form" onSubmit={(e) => e.preventDefault()}>
              <input className="news-input" type="email" placeholder="Your email address" />
              <button className="btn btn-gold" type="submit">Subscribe</button>
            </form>
          </div>
        </Reveal>
      </div>
    </main>
  );
}

function ArticlePage({ go, openArticle, post }) {
  const { posts } = window.BlogData;
  const p = post || posts[0];
  const related = posts.filter(x => x.slug !== p.slug && x.category === p.category).concat(posts.filter(x => x.slug !== p.slug)).slice(0, 3);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => { window.scrollTo(0, 0); }, [p.slug]);
  React.useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [p.slug]);

  return (
    <main className="article">
      <div className="read-progress" style={{ width: progress + '%' }} />
      <div className="wrap">
        <button className="article-back" onClick={() => go('blog')}>
          <Icon name="chevron" size={16} style={{ transform: 'rotate(180deg)' }} /> The Foundation
        </button>

        <div className="article-head">
          <span className="article-eyebrow">{p.categoryLabel}</span>
          <h1 className="article-title">{p.title}</h1>
          <p className="article-stand">{p.standfirst}</p>
          <div className="article-meta">
            <span className="av"><Ph style={{ position: 'absolute', inset: 0 }} /></span>
            <span><strong>{p.author}</strong> · {p.authorRole}</span>
            <span className="dot" /><span>{p.date}</span><span className="dot" /><span>{p.read} min read</span>
          </div>
        </div>

        <div className="article-cover"><Ph label={p.cover} style={{ position: 'absolute', inset: 0 }} kenburns /></div>

        <div className="article-layout">
          <aside className="share-rail">
            <span>Share</span>
            <button className="share-btn" aria-label="Share"><Icon name="share" size={18} /></button>
            <button className="share-btn" aria-label="Copy link"><Icon name="arrowUpRight" size={18} /></button>
            <button className="share-btn wa" aria-label="Share on WhatsApp"><Icon name="chat" size={18} /></button>
          </aside>

          <article className="article-body">
            {p.body.map((blk, i) => {
              if (blk.t === 'h2') return <h2 key={i}>{blk.x}</h2>;
              if (blk.t === 'h3') return <h3 key={i}>{blk.x}</h3>;
              if (blk.t === 'quote') return <blockquote key={i} className="article-quote"><p>"{blk.x}"</p></blockquote>;
              return <p key={i} className={i === 0 ? 'dropcap' : ''}>{blk.x}</p>;
            })}

            <div className="article-tags">
              {[p.categoryLabel, 'Nigeria', 'Property', 'StrongTower'].map((t, i) => <span key={i} className="pill">{t}</span>)}
            </div>

            <div className="article-author">
              <span className="av"><Ph style={{ position: 'absolute', inset: 0 }} /></span>
              <div>
                <strong>{p.author}</strong>
                <span>{p.authorRole} · Contributor to The Foundation</span>
              </div>
            </div>
          </article>
          <div />
        </div>

        <section className="article-related">
          <h2>More from The Foundation</h2>
          <div className="journal-grid" style={{ padding: 0 }}>
            {related.map((r, i) => (
              <Reveal key={r.slug} delay={(i % 3) * 70}><StoryCard post={r} onOpen={openArticle} /></Reveal>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

Object.assign(window, { BlogPage, ArticlePage });
