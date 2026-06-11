/* StrongTower mock data — exported to window.STData */
(function () {
  const N = (n) => '₦' + n.toLocaleString('en-NG');

  const types = ['Detached Duplex', 'Terrace Duplex', 'Bungalow', 'Block of Flats', 'Land / Plot', 'Penthouse', 'Semi-Detached', 'Shortlet'];

  const props = [
    { id: 'p1', title: '5-Bedroom Detached Duplex with BQ', type: 'Detached Duplex', area: 'Lekki Phase 1', state: 'Lagos', priceNum: 285000000, beds: 5, baths: 6, sqm: 650, verified: true, tag: 'For Sale', featured: true,
      blurb: 'A statement family home on a quiet, tree-lined street in the heart of Lekki Phase 1 — fully serviced estate, fitted kitchen, and a private rooftop terrace.' },
    { id: 'p2', title: 'Waterfront 4-Bed Terrace', type: 'Terrace Duplex', area: 'Banana Island', state: 'Lagos', priceNum: 420000000, beds: 4, baths: 5, sqm: 480, verified: true, tag: 'For Sale', featured: true,
      blurb: 'Wake up to the lagoon. Smart-home wired, 24/7 security, and a shared jetty in Nigeria’s most prestigious address.' },
    { id: 'p3', title: 'Serviced 3-Bedroom Apartment', type: 'Block of Flats', area: 'Maitama', state: 'Abuja', priceNum: 165000000, beds: 3, baths: 4, sqm: 320, verified: true, tag: 'For Sale', featured: true,
      blurb: 'Diplomatic-zone living with concierge, gym and steady power. Steps from embassies and the best of Abuja.' },
    { id: 'p4', title: '800sqm Dry Land, C of O', type: 'Land / Plot', area: 'Guzape', state: 'Abuja', priceNum: 95000000, beds: 0, baths: 0, sqm: 800, verified: true, tag: 'For Sale', featured: true,
      blurb: 'Buildable, fenced, and titled with a genuine Certificate of Occupancy. Gentle slope with skyline views.' },
    { id: 'p5', title: 'Contemporary 4-Bed Semi-Detached', type: 'Semi-Detached', area: 'Old GRA', state: 'Port Harcourt', priceNum: 145000000, beds: 4, baths: 5, sqm: 410, verified: true, tag: 'For Sale', featured: true,
      blurb: 'Architect-designed in the leafy Old GRA — open-plan living, solar-ready, and a landscaped garden.' },
    { id: 'p6', title: 'Penthouse with Private Pool', type: 'Penthouse', area: 'Ikoyi', state: 'Lagos', priceNum: 610000000, beds: 4, baths: 5, sqm: 540, verified: true, tag: 'For Sale', featured: true,
      blurb: 'The top two floors of a landmark tower — plunge pool, panoramic terrace, and two dedicated parking bays.' },
    { id: 'p7', title: 'Cosy 2-Bed Shortlet Apartment', type: 'Shortlet', area: 'Wuse 2', state: 'Abuja', priceNum: 180000, beds: 2, baths: 2, sqm: 95, verified: true, tag: 'Per Night', period: '/night',
      blurb: 'Fully furnished, Netflix-ready and walkable to restaurants. Perfect for a weekend or a work trip.' },
    { id: 'p8', title: '3-Bedroom Bungalow on 600sqm', type: 'Bungalow', area: 'Bodija', state: 'Ibadan', priceNum: 78000000, beds: 3, baths: 3, sqm: 280, verified: false, tag: 'For Sale',
      blurb: 'Spacious compound with room to extend, in a calm residential pocket of Bodija.' },
    { id: 'p9', title: 'Mini Estate — 6 Units of 3-Bed Flats', type: 'Block of Flats', area: 'Enugu GRA', state: 'Enugu', priceNum: 320000000, beds: 18, baths: 24, sqm: 1200, verified: true, tag: 'Investment',
      blurb: 'Income-ready: six fully-let apartments returning steady rent in a sought-after district.' },
    { id: 'p10', title: 'Luxury 5-Bed Smart Home', type: 'Detached Duplex', area: 'Asokoro', state: 'Abuja', priceNum: 540000000, beds: 5, baths: 6, sqm: 720, verified: true, tag: 'For Sale',
      blurb: 'Voice-controlled everything, cinema room, and staff quarters — Asokoro’s quiet luxury.' },
    { id: 'p11', title: '2-Bedroom Apartment, Serviced', type: 'Block of Flats', area: 'Yaba', state: 'Lagos', priceNum: 62000000, beds: 2, baths: 2, sqm: 110, verified: false, tag: 'For Sale',
      blurb: 'Tech-hub adjacent and great value — ideal first home or rental in fast-rising Yaba.' },
    { id: 'p12', title: '1,000sqm Beachfront Land', type: 'Land / Plot', area: 'Eleko', state: 'Lagos', priceNum: 130000000, beds: 0, baths: 0, sqm: 1000, verified: true, tag: 'For Sale',
      blurb: 'Toes-in-the-sand opportunity along the Lekki–Epe corridor. Survey and deed ready.' },
  ].map(p => ({ ...p, price: N(p.priceNum), priceShort: p.priceNum >= 1e6 ? '₦' + (p.priceNum/1e6).toFixed(p.priceNum>=1e8?0:1) + 'M' : N(p.priceNum) }));

  const locations = [
    { city: 'Lagos', count: 1840, sub: 'Lekki · Ikoyi · VI · Ikeja' },
    { city: 'Abuja', count: 1120, sub: 'Maitama · Asokoro · Wuse' },
    { city: 'Port Harcourt', count: 540, sub: 'GRA · Trans-Amadi' },
    { city: 'Ibadan', count: 410, sub: 'Bodija · Jericho' },
    { city: 'Enugu', count: 268, sub: 'GRA · Independence Layout' },
    { city: 'Kano', count: 192, sub: 'Nassarawa · Bompai' },
  ];

  const testimonials = [
    { quote: 'I found my family home in three weeks and spoke to the owner directly. No endless agent fees, no runaround — just a clear, honest process.', name: 'Adaeze Okafor', role: 'Bought in Lekki, Lagos', rating: 5 },
    { quote: 'As a first-time buyer abroad, the verified badge gave me real confidence. Every document checked out exactly as listed.', name: 'Tunde Bakare', role: 'Diaspora buyer, London → Abuja', rating: 5 },
    { quote: 'Listed my late father’s land and closed with a serious buyer in a month. StrongTower made a hard process feel dignified.', name: 'Grace Eze', role: 'Sold land in Enugu', rating: 5 },
    { quote: 'The WhatsApp-first approach just fits how we actually do business in Nigeria. Fast, personal, and transparent.', name: 'Ibrahim Yusuf', role: 'Investor, Kano', rating: 5 },
    { quote: 'Browsing on my phone during my commute, I shortlisted five homes before I even got home. Beautifully simple.', name: 'Chioma Nwosu', role: 'Rented in Port Harcourt', rating: 5 },
  ];

  const steps = [
    { n: '01', title: 'Browse verified listings', body: 'Search by city, type or budget. Every featured listing carries a verification badge so you know the title and photos are real.' },
    { n: '02', title: 'Connect directly — no middlemen', body: 'Message the owner straight from the listing on WhatsApp. Ask questions, request documents, book a viewing on your terms.' },
    { n: '03', title: 'Close with confidence', body: 'Inspect, agree, and complete with transparent guidance at every step. Your legacy, secured — no agent noise.' },
  ];

  const stats = [
    { value: 4200, suffix: '+', label: 'Verified properties listed' },
    { value: 18, suffix: '', label: 'States covered nationwide' },
    { value: 1600, suffix: '+', label: 'Direct owners & sellers' },
    { value: 96, suffix: '%', label: 'Buyers who skip the agent' },
  ];

  const posts = [
    { cat: 'Buyer Guide', title: 'How to verify a Certificate of Occupancy before you pay', read: '6 min read' },
    { cat: 'Market', title: 'Lekki vs. Sangotedo: where your naira goes furthest in 2026', read: '8 min read' },
    { cat: 'Diaspora', title: 'Buying property from abroad without getting burned', read: '5 min read' },
  ];

  const amenities = ['24/7 Security', 'Borehole + Treatment', 'Solar / Inverter', 'Fitted Kitchen', 'Ample Parking', 'CCTV', 'Fibre Internet', 'Recreation / Gym', 'Boys’ Quarters', 'POP Ceilings', 'Ensuite Rooms', 'Estate Gatehouse'];

  const states = ['Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT — Abuja','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara'];

  window.STData = { props, locations, testimonials, steps, stats, posts, amenities, types, states, N };
})();
