/**
 * Content for the "How We Can Help" intent section on the home page.
 * Each intent presents the shared StrongTower funnel:
 * WhatsApp → Qualification → Viewing → Offer → Documentation → Closing
 */

export interface FunnelStep {
  title: string
  body: string
}

export interface LandingIntent {
  id: string
  eyebrow: string
  headline: string
  standfirst: string
  whatsappMessage: string
  steps: FunnelStep[]
}

export const LANDING_INTENTS: LandingIntent[] = [
  {
    id: 'buy',
    eyebrow: 'Buy',
    headline: 'Find verified land & property in Nigeria',
    standfirst:
      'From first search to signed papers, we move at your pace and screen out the noise — every listing verified, every owner real.',
    whatsappMessage:
      "Hi StrongTower, I'd like to BUY verified land or property in Nigeria. Please start my qualification.",
    steps: [
      { title: 'WhatsApp', body: 'Tell us your budget, preferred locations, and timeline in one quick chat.' },
      { title: 'Qualification', body: 'We confirm what you can afford and shortlist only verified, matching properties.' },
      { title: 'Viewing', body: 'We book and coordinate viewings — in person or by guided video.' },
      { title: 'Offer', body: 'We help you make a confident, well-priced offer on the right property.' },
      { title: 'Documentation', body: 'We walk you through title checks and every document before you commit.' },
      { title: 'Closing', body: 'You complete securely and take possession — no agents, no hidden fees.' },
    ],
  },
  {
    id: 'sell',
    eyebrow: 'Sell',
    headline: 'Want to sell your property? Get a free assessment',
    standfirst:
      'Know exactly what your property is worth and reach serious, verified buyers — without handing a commission to an agent.',
    whatsappMessage:
      "Hi StrongTower, I'd like a free assessment to SELL my property. Please start my qualification.",
    steps: [
      { title: 'WhatsApp', body: 'Send your property details and photos — we take it from there.' },
      { title: 'Qualification', body: 'We give you a free assessment and agree a realistic, market-true price.' },
      { title: 'Viewing', body: 'We arrange and host viewings with buyers who are ready to move.' },
      { title: 'Offer', body: 'We present every serious offer and advise you on the strongest one.' },
      { title: 'Documentation', body: 'We prepare and verify the paperwork so nothing stalls the sale.' },
      { title: 'Closing', body: 'We complete the transfer and get you paid — clean and transparent.' },
    ],
  },
  {
    id: 'invest',
    eyebrow: 'Invest',
    headline: 'Discover high-potential investment opportunities',
    standfirst:
      'Land and property built for returns — vetted locations, clear titles, and guidance that treats your capital with respect.',
    whatsappMessage:
      "Hi StrongTower, I'm interested in INVESTING in Nigerian property. Please start my qualification.",
    steps: [
      { title: 'WhatsApp', body: 'Tell us your budget, target returns, and how hands-on you want to be.' },
      { title: 'Qualification', body: 'We match you with high-potential, verified opportunities that fit your goals.' },
      { title: 'Viewing', body: 'We arrange site visits — in person or by live video, from anywhere.' },
      { title: 'Offer', body: 'We help you negotiate sharp terms and secure the asset.' },
      { title: 'Documentation', body: 'We verify titles and handle the investment paperwork end to end.' },
      { title: 'Closing', body: 'You complete the acquisition and start building your portfolio.' },
    ],
  },
  {
    id: 'develop',
    eyebrow: 'Develop',
    headline: 'Have land? Let us help you develop it',
    standfirst:
      'Turn raw land into real value with a partner who handles feasibility, approvals, and delivery — from foundation to finishing.',
    whatsappMessage:
      "Hi StrongTower, I have land and would like help to DEVELOP it. Please start my qualification.",
    steps: [
      { title: 'WhatsApp', body: 'Share your land details and the vision you have for it.' },
      { title: 'Qualification', body: 'We assess feasibility, permits, and a realistic development budget.' },
      { title: 'Viewing', body: 'We carry out a site assessment and survey with our team.' },
      { title: 'Offer', body: 'We agree the development plan, scope, and pricing.' },
      { title: 'Documentation', body: 'We secure approvals and put the contracts in order.' },
      { title: 'Closing', body: 'We break ground and manage delivery through to completion.' },
    ],
  },
  {
    id: 'diaspora',
    eyebrow: 'Diaspora',
    headline: 'Buy property in Nigeria from anywhere',
    standfirst:
      "Distance shouldn't cost you trust. We verify, view, and paper the deal on the ground while you stay in control from abroad.",
    whatsappMessage:
      "Hi StrongTower, I'm in the diaspora and want to BUY property in Nigeria. Please start my qualification.",
    steps: [
      { title: 'WhatsApp', body: 'Message us from any time zone — a real person replies, not a bot.' },
      { title: 'Qualification', body: 'We confirm your budget and goals remotely and send a vetted shortlist.' },
      { title: 'Viewing', body: 'We walk you through live, on-site video viewings of each property.' },
      { title: 'Offer', body: 'We secure the property on your behalf and negotiate in your interest.' },
      { title: 'Documentation', body: 'We run due diligence and handle every document, verified locally.' },
      { title: 'Closing', body: 'We complete safely and hold the keys until you land.' },
    ],
  },
  {
    id: 'affordable-housing',
    eyebrow: 'Affordable Housing',
    headline: 'Own land. Build gradually. Become a homeowner',
    standfirst:
      "Homeownership without the lump sum — secure verified land now and build at the pace your pocket allows.",
    whatsappMessage:
      "Hi StrongTower, I'm interested in AFFORDABLE HOUSING — own land and build gradually. Please start my qualification.",
    steps: [
      { title: 'WhatsApp', body: "Tell us your budget and where you'd like to put down roots." },
      { title: 'Qualification', body: 'We match you with affordable, verified land you can actually pay for.' },
      { title: 'Viewing', body: 'We arrange a site visit so you can see it before you commit.' },
      { title: 'Offer', body: 'We help you secure your plot on terms that work for you.' },
      { title: 'Documentation', body: 'We guide your title and allocation documents to the finish.' },
      { title: 'Closing', body: 'You own the land, build gradually, and become a homeowner.' },
    ],
  },
]
