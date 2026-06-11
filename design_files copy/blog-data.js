/* "The Foundation" — StrongTower Journal mock content → window.BlogData */
(function () {
  const CATEGORIES = [
    { value: 'all', label: 'All' },
    { value: 'market-insights', label: 'Market Insights' },
    { value: 'buyers-guide', label: "Buyer's Guide" },
    { value: 'sellers-tips', label: 'Sellers Tips' },
    { value: 'investment', label: 'Investment' },
    { value: 'legal-finance', label: 'Legal & Finance' },
    { value: 'neighborhood', label: 'Neighborhood' },
  ];

  const posts = [
    {
      slug: 'verify-certificate-of-occupancy',
      category: 'legal-finance', categoryLabel: 'Legal & Finance',
      title: 'How to verify a Certificate of Occupancy before you pay a kobo',
      excerpt: 'A C of O is only as good as its provenance. Here is the exact paper trail to demand — and the three red flags that should stop a deal cold.',
      author: 'Adeola Martins', authorRole: 'Property Lawyer · Lagos',
      date: '12 May 2026', read: 6, featured: true, cover: 'Land documents on a desk',
      standfirst: 'In Nigeria, the document is the asset. Before money moves, the title has to survive scrutiny — here is how to do that scrutiny yourself.',
      body: [
        { t: 'p', x: 'Every serious property conversation in Nigeria eventually arrives at one question: is the title clean? A Certificate of Occupancy — the C of O — is the state government’s acknowledgement that you hold the land for a defined term. But a photocopy in a WhatsApp chat proves nothing. The real work is tracing it back to the issuing authority.' },
        { t: 'h2', x: 'Start at the registry, not the seller' },
        { t: 'p', x: 'The single most important step is a search at the state Land Registry. For a modest fee, the registry confirms whether the title exists, who it is registered to, and whether it carries any encumbrance — a mortgage, a court restriction, or a government acquisition notice. If the name on the C of O does not match the person selling, stop until that gap is explained in writing.' },
        { t: 'quote', x: 'A title you have not personally traced to the registry is a story, not a security.' },
        { t: 'h2', x: 'The three red flags' },
        { t: 'p', x: 'First, a seller who resists a registry search “because it takes too long.” Second, a survey plan whose coordinates do not place the land where you physically stood. Third, a price meaningfully below the street — genuine bargains exist, but suspiciously cheap titled land usually hides a defect. Treat each as a reason to slow down, not speed up.' },
        { t: 'h3', x: 'What StrongTower verifies for you' },
        { t: 'p', x: 'On every property that carries our verified badge, we confirm the title document, match the owner’s identity, and check that the photographs are genuine. It does not replace your own due diligence — but it means the listings you browse here start from a position of honesty.' },
      ],
    },
    {
      slug: 'lekki-vs-sangotedo-2026',
      category: 'neighborhood', categoryLabel: 'Neighborhood',
      title: 'Lekki vs. Sangotedo: where your naira goes furthest in 2026',
      excerpt: 'The Lekki–Epe corridor keeps stretching east. We map what a fixed budget actually buys in each pocket — and where the next wave of value is moving.',
      author: 'Chidi Okonkwo', authorRole: 'Market Analyst', date: '04 May 2026', read: 8,
      cover: 'Aerial of the Lekki–Epe corridor',
      standfirst: 'As the corridor matures, the value frontier keeps moving east. Here is what the same budget buys at each stop.',
      body: [
        { t: 'p', x: 'Five years ago, Lekki Phase 1 was the aspiration. Today it is the benchmark — and the budget that once bought a duplex there now buys location plus a longer commute, or more house further east. The question is no longer “Lekki or not?” but “how far along the corridor?”' },
        { t: 'h2', x: 'What the corridor looks like now' },
        { t: 'p', x: 'Sangotedo has quietly become the corridor’s value anchor: serviced estates, real infrastructure, and prices that still leave room to grow. For buyers prioritising space and titled land, it increasingly outperforms the older, denser pockets closer to the toll.' },
        { t: 'quote', x: 'The smart money is not chasing the postcode — it is chasing the road that is about to be finished.' },
        { t: 'p', x: 'None of this is advice to buy blind. Infrastructure timelines slip, and a “coming soon” interchange can stay coming for years. But for buyers willing to hold, the eastern corridor remains the clearest value story on the mainland-to-island axis.' },
      ],
    },
    {
      slug: 'buying-from-the-diaspora',
      category: 'buyers-guide', categoryLabel: "Buyer's Guide",
      title: 'Buying property from abroad without getting burned',
      excerpt: 'Distance is the scammer’s best friend. A practical playbook for diaspora buyers — from verifying a seller to structuring payment so you never pay on trust alone.',
      author: 'Ngozi Eze', authorRole: 'Diaspora Advisor · London', date: '28 Apr 2026', read: 5,
      cover: 'Phone showing a video property tour',
      standfirst: 'You can buy well from 5,000 km away — but only if you replace trust with process at every step.',
      body: [
        { t: 'p', x: 'The diaspora buyer’s disadvantage is simple: you cannot stand on the land. Every protection you build has to compensate for that one fact. The good news is that a disciplined process closes most of the gap.' },
        { t: 'h2', x: 'Verify the human, then the property' },
        { t: 'p', x: 'Insist on a live video call where the seller walks the property holding today’s newspaper or a written note. It sounds theatrical; it defeats recycled photos instantly. Then verify the title independently through a lawyer you appointed — never one the seller recommended.' },
        { t: 'quote', x: 'Never pay on trust. Pay on proof, in stages, against documents.' },
        { t: 'p', x: 'Structure payment in tranches tied to verified milestones, and route funds through traceable channels only. A seller genuinely holding clean title will understand caution. One who pushes for a fast, full, off-platform payment is telling you something.' },
      ],
    },
    {
      slug: 'first-rental-yield',
      category: 'investment', categoryLabel: 'Investment',
      title: 'Reading rental yield like an investor, not an optimist',
      excerpt: 'Gross yield flatters. We break down the real numbers — service charge, voids, and the “naira today” discount — so your spreadsheet tells the truth.',
      author: 'Tunde Bakare', authorRole: 'Investment Desk', date: '19 Apr 2026', read: 7,
      cover: 'Block of serviced apartments',
      standfirst: 'The headline yield is a marketing number. The yield you keep is what matters.',
      body: [
        { t: 'p', x: 'A 10% gross yield is a great line in a sales pitch and a poor basis for a decision. Between the rent advertised and the cash you bank sit service charges, vacancy, agency renewal, and the quiet erosion of holding costs. Net yield is the only honest figure.' },
        { t: 'h2', x: 'Subtract before you celebrate' },
        { t: 'p', x: 'Model a realistic void period — a month or two between tenants is normal, not pessimistic. Deduct the estate service charge, a maintenance reserve, and any management fee. What remains, divided by your true all-in cost, is your real return.' },
        { t: 'quote', x: 'Buy the net yield you can defend in a bad year, not the gross yield you can dream about in a good one.' },
      ],
    },
    {
      slug: 'staging-to-sell-faster',
      category: 'sellers-tips', categoryLabel: 'Sellers Tips',
      title: 'Five low-cost fixes that sell a Nigerian home faster',
      excerpt: 'You do not need a renovation to move a listing. You need light, a working narrative, and photographs that respect the buyer’s intelligence.',
      author: 'Grace Eze', authorRole: 'Seller Coach', date: '11 Apr 2026', read: 4,
      cover: 'Bright, staged living room',
      standfirst: 'Most stale listings are not overpriced — they are badly presented. Fix the presentation first.',
      body: [
        { t: 'p', x: 'Before you drop the price, fix the photos. The majority of enquiries are won or lost in the first three images. Shoot in daylight, declutter ruthlessly, and never use a wide-angle lens that promises a room the buyer will not find.' },
        { t: 'h2', x: 'Light, space, story' },
        { t: 'p', x: 'Open every curtain. Replace dim bulbs. Stage one clear narrative per room so a buyer can picture their life, not your storage. Small spend, large difference.' },
        { t: 'quote', x: 'A buyer forgives an honest flaw. They never forgive a photo that lied.' },
      ],
    },
    {
      slug: 'inflation-and-land',
      category: 'market-insights', categoryLabel: 'Market Insights',
      title: 'Why land keeps winning when the naira wobbles',
      excerpt: 'In an inflationary cycle, dirt has a quiet logic. We look at why titled land remains the default store of value for Nigerian households — and its limits.',
      author: 'Chidi Okonkwo', authorRole: 'Market Analyst', date: '02 Apr 2026', read: 6,
      cover: 'Surveyed plot with beacons',
      standfirst: 'Land is the household hedge of choice — but the logic has limits worth naming.',
      body: [
        { t: 'p', x: 'When currency loses value, hard assets gain appeal — and in Nigeria, titled land is the household’s instinctive hedge. It is finite, it is visible, and it sidesteps the volatility that erodes cash savings month to month.' },
        { t: 'h2', x: 'The logic, and its edges' },
        { t: 'p', x: 'But land is not a magic vault. Illiquidity is real — selling well takes time. Title risk is real. And “land banking” in a location with no demand driver can mean holding a beautifully titled field that nobody wants for a decade.' },
        { t: 'quote', x: 'Land protects value best where someone, eventually, will want to build.' },
      ],
    },
  ];

  const topics = ['Land Titles', 'First-time Buyers', 'Investment Guides', 'Lagos Market', 'Construction Tips', 'Diaspora'];

  window.BlogData = { CATEGORIES, posts, topics };
})();
