# StrongTower Holdings — CLAUDE.md

> This file is the single source of truth for all Claude-assisted development on StrongTower Holdings.
> Begin every session by reading this file. Do not introduce any pattern, library,
> colour, or component not already established here — flag it first and wait for approval.

---

## Project overview

StrongTower Holdings is a Nigerian property marketplace. Buyers browse freely (no signup required)
and contact sellers directly via WhatsApp. Sellers create accounts to list properties.

**Core value props — preserve in every UI decision:**
1. Zero-friction browsing (no signup wall)
2. Direct WhatsApp contact (no middlemen)
3. Pan-Nigeria coverage (all 36 states + FCT)

---

## Stack

```
Framework:    Next.js 15 (App Router)
Language:     TypeScript — simple types only, no generics unless necessary
Database:     Supabase (Postgres + Storage + Auth)
Styling:      CSS Modules for all visual styles — Tailwind for layout/spacing only
Animation:    GSAP for intentional transitions only — no Framer Motion
Images:       next/image always — explicit width/height or fill + sized container
Deployment:   Vercel
```

---

## Animation tooling
Two libraries coexist, each scoped to its domain:
| Tool | Used for | Not used for |
|------|----------|--------------|
| **GSAP** | Scroll-driven animations, timelines, the snap-scroll landing mechanic, cinematic hero sequences | Enter/exit of React-mounted elements, list stagger |
| **Framer Motion** | Mount/unmount animations (`AnimatePresence`), modal/page transitions, property card stagger on scroll | Scroll-position animations, timeline sequences, DOM transforms tied to scroll |
| **CSS transitions** | Hover, focus, simple colour/opacity changes (no library needed) | Everything else |
**Rules:**
- Do not animate a scroll-driven timeline with Framer Motion. Use GSAP.
- Do not hand-manage React mount/unmount with GSAP. Use Framer Motion.
- Do not add a third animation library without flagging it first.
- `framer-motion` is only imported in files that need `AnimatePresence` or `motion.div` for mount transitions — not as a general-purpose animation replacement.
---

## File conventions

```
app/
  (public)/          ← unauthenticated routes (home, properties, blog, etc.)
  (seller)/          ← authenticated routes (dashboard, list property, etc.)
  layout.tsx         ← root layout only — no logic here
components/
  ui/                ← atomic: Button, Badge, Input, Card shell, Price
  layout/            ← Nav, Footer, PageWrapper
  properties/        ← PropertyCard, PropertyGrid, SearchBar, FilterChips
  forms/             ← LoginForm, RegisterForm, ListingForm
styles/
  globals.css        ← CSS variables (:root) + base resets only
  [Component].module.css  ← one CSS module per component
lib/
  supabase.ts
  utils.ts
```

**Rules:**
- One component per file, named after what it renders
- All visual CSS (colour, typography, shadow, border) in `[Component].module.css`
- Tailwind for layout/spacing only: `flex`, `grid`, `w-full`, `h-screen`, `gap-4`, `px-6`
- No arbitrary Tailwind values: no `w-[347px]`, no `text-[13px]`
- No barrel files (`index.ts` re-exports)
- `useRef` for animation state — never `useState` for values that don't drive renders
- No inline styles except GSAP `.set()` calls

---

## Design tokens

> All tokens live in `styles/globals.css` as CSS custom properties.
> Never hardcode hex values in components. Never deviate from these.

```css
:root {
  /* ── Palette ─────────────────────────────────────── */
  --color-bg:          #0c0b0a;       /* near-black warm base */
  --color-surface:     #161412;       /* card / panel surface */
  --color-surface-2:   #1e1b18;       /* elevated surface, modal */
  --color-border:      rgba(255,245,235,0.09);   /* subtle divider */
  --color-border-hover:rgba(255,245,235,0.18);

  --color-accent:      #c4622d;       /* terracotta — primary CTA */
  --color-accent-hover:#d4703a;
  --color-accent-muted:rgba(196,98,45,0.12);

  --color-whatsapp:    #25d366;       /* WhatsApp green — ONLY for WA buttons */
  --color-whatsapp-hover: #1db954;

  --color-text:        #f5f0e8;       /* primary text */
  --color-text-muted:  rgba(245,240,232,0.52);
  --color-text-hint:   rgba(245,240,232,0.32);

  /* ── Typography ──────────────────────────────────── */
  --font-display:      'Bricolage Grotesque', system-ui, sans-serif;
  --font-body:         'Hanken Grotesk', system-ui, sans-serif;

  --text-xs:   0.72rem;   /* 11.5px — captions, badges */
  --text-sm:   0.82rem;   /* 13px — meta, labels */
  --text-base: 1rem;      /* 16px — body */
  --text-lg:   1.18rem;   /* 19px — card headlines */
  --text-xl:   1.45rem;   /* 23px — section labels */
  --text-2xl:  1.85rem;   /* 30px — page headlines */
  --text-3xl:  clamp(2.4rem, 5.5vw, 4.2rem);  /* hero */

  /* ── Spacing ─────────────────────────────────────── */
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* ── Radius ──────────────────────────────────────── */
  --radius-sm:  6px;
  --radius-md:  10px;
  --radius-lg:  16px;
  --radius-xl:  24px;
  --radius-pill: 999px;

  /* ── Transitions ─────────────────────────────────── */
  --ease-base:  cubic-bezier(0.25, 0.1, 0.25, 1);
  --ease-out:   cubic-bezier(0.0, 0.0, 0.2, 1);
  --ease-in:    cubic-bezier(0.4, 0.0, 1, 1);
  --t-fast:  0.15s var(--ease-base);
  --t-base:  0.25s var(--ease-base);
  --t-slow:  0.4s  var(--ease-out);

  /* ── Shadows ─────────────────────────────────────── */
  --shadow-card:    0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.25);
  --shadow-modal:   0 8px 40px rgba(0,0,0,0.6);
}
```

**Font loading (in `app/layout.tsx`) — updated 2026 refresh:**
```tsx
import { Hanken_Grotesk, Bricolage_Grotesque } from 'next/font/google'
const hankenGrotesk = Hanken_Grotesk({ subsets: ['latin'], weight: ['300','400','500','600'], variable: '--font-body' })
const bricolage     = Bricolage_Grotesque({ subsets: ['latin'], weight: ['600','700'], variable: '--font-display' })
```

---

## Aesthetic rules

- **Restrained.** One accent colour (`--color-accent`) per page, used on primary CTAs and active states only. Not on backgrounds, not on text, not on borders.
- **Dark and warm.** The site feels like premium editorial print, not a SaaS dashboard. The warm charcoal base distinguishes StrongTower Holdings from competitors (PropertyPro, etc.) who all use white.
- **No glassmorphism.** No `backdrop-filter: blur`. Surfaces are flat and opaque.
- **No decorative shadows.** `--shadow-card` is structural (lifts card off background). Never use shadows as decoration.
- **No gradient text.** No `background-clip: text` ever.
- **Whitespace is intentional.** Do not fill empty sections. Do not add components to fill visual gaps.
- **The WhatsApp button is sacred.** It is always `--color-whatsapp`, always has the WA icon, always the same size and weight. Never reskin it for aesthetic reasons.
- **Bricolage Grotesque is display-only.** Only `h1`, `h2` on marketing pages. All UI text (labels, nav, buttons, forms) uses Hanken Grotesk.

---

## Component patterns

### Button
Two variants only. No others without explicit approval.

```tsx
// Primary — terracotta fill
<Button variant="primary">List Property</Button>

// Ghost — border only
<Button variant="ghost">Browse Properties</Button>

// WhatsApp — never reskin this
<Button variant="whatsapp">
  <WhatsAppIcon /> Contact Seller
</Button>
```

Button sizes: `sm` (32px height), `md` (40px, default), `lg` (48px, hero CTAs only).
No `xl`, no `xs`.

### Price component
**Always use this. Never format prices inline.**
```tsx
<Price amount={45000000} currency="NGN" />
// Renders: ₦45,000,000
```

### PropertyCard
Standard card — always the same structure:
```
┌──────────────────────┐
│  [Image 4:5]         │
│  [Type badge]        │
├──────────────────────┤
│  Headline (1-2 lines)│
│  Location line       │
│  Price               │
│  [WhatsApp CTA]      │
└──────────────────────┘
```

- Image: always `4:5` ratio (400×500), `object-fit: cover`, `next/image`
- Type badge: `House` or `Land` — uses `--color-accent-muted` bg + `--color-accent` text
- No star ratings, no view counts, no like buttons on cards
- One action per card: WhatsApp contact only (no "Save", no "Share" on the card itself)

### SearchBar
The primary search on the home hero:
- Two dropdowns: **Property Type** (All / House / Land) + **State** (37 options)
- One submit button
- No keyword/text search — the market is filter-based, not keyword-based
- On mobile: dropdowns stack full-width, button full-width below

### FilterChips (Properties page)
Compact filter row above the property grid:
- `All` | `House` | `Land` chips for type
- State dropdown (compact)
- Sort dropdown: `Newest` | `Price: Low–High` | `Price: High–Low`
- No price range slider in v1

### Forms (Login / Register / List Property)
- No floating labels
- No custom select dropdowns (use native `<select>`)
- Label above input always
- Error message below the errored field (not a toast, not a modal)
- Submit button at the bottom, full-width on mobile

---

## Page-specific notes

### Home (`/`)
- Hero: full-width, dark BG with a real property image, large `--font-display` headline, the SearchBar centred beneath it
- Below hero: 3 feature callouts (Browse Freely, Direct Contact, Safe & Secure) — horizontal on desktop, stacked on mobile
- Above footer: a single CTA band ("Ready to list? Get started free") — no other sections

### Properties (`/properties`)
- FilterChips at top (sticky on scroll, collapses to a compact bar)
- Grid: 3 columns desktop, 2 tablet, 1 mobile
- Empty state: a single centred message, no illustration, no animation
- Loading: skeleton cards (same dimensions as real cards) — no spinner

### Single Property (`/properties/[id]`)
- Image gallery: one large image + 3 thumbs — tap to expand (lightbox)
- Price and WhatsApp CTA sticky at the bottom on mobile (fixed bar)
- Property details as a simple key-value grid — no accordion
- No related listings in v1

### Login / Register (`/login`, `/register`)
- Centred card on dark background
- No split-screen, no decorative illustration
- "Don't have an account? Create account" link — plain text, no button

### Seller dashboard (`/dashboard`)
- Sidebar nav on desktop, bottom tab bar on mobile
- Listings in a simple table (image thumb, title, status, date, actions)
- Status badges: `Active` (green), `Pending` (amber), `Inactive` (muted)
- No analytics charts in v1

---

## What NOT to do

```
✗    No third animation libraries beyond GSAP and Framer Motion
✗  No Framer Motion for scroll-driven / timeline animations (use GSAP)
✗  No GSAP for React mount/unmount animations (use Framer Motion AnimatePresence)
✗  No shadcn/ui — build components from scratch per this brief
✗  No Zustand / Redux — React Context only, scoped per feature
✗  No glassmorphism (backdrop-filter: blur)
✗  No arbitrary Tailwind values
✗  No gradient text
✗  No decorative drop shadows
✗  No floating labels on form inputs
✗  No price formatting inline — always use <Price />
✗  No reskinning the WhatsApp button
✗  No star ratings or like buttons on property cards
✗  No keyword search bar (filter-only UX)
✗  No barrel files
✗  No TypeScript generics unless structurally necessary
```

---

## 2026 Design Refresh — addendum

> These decisions were locked during the 2026 refresh and **supersede** any conflicting older note above.

### Typography (LOCKED)
- **Display font: `Bricolage Grotesque`** (was Fraunces). Headlines weight **600**, letter-spacing **−0.025em**, line-height **1.02**.
- **Body font: `Hanken Grotesk`** (was DM Sans).
- Both wired through `next/font/google` in `app/layout.tsx` as `--font-display` / `--font-body`; the fallback stack in `styles/globals.css` must be **sans-serif**.
- **Bricolage has no italic.** Never use `font-style: italic` on display text. The old italic accent word is now **upright + terracotta**.

### Palette & aesthetic (reaffirmed)
- Dark-first, warm near-black `--color-bg #0c0b0a`; one accent per page = terracotta `#c4622d`.
- **WhatsApp green `#25d366` is sacred** — only on WA buttons, never reskinned.
- **Verified chip = neutral parchment**, never green.
- No glassmorphism, no decorative shadows, no gradient text.

### Property model in UI
- `property_type` = **House | Land** only. Card type badge says `House` or `Land`.
- **Property cards** carry exactly **one action: WhatsApp Contact Seller.** No like/save/star/view-count.
- **Search is filter-only** (type + state). No free-text keyword box.

### Blog identity (LOCKED)
- The blog is **"The Foundation" — the StrongTower Journal**: editorial/print feel.
- Categories = **neutral/terracotta uppercase eyebrows** — never pastel badges.
- The old Tailwind `components/blog/blog-card.tsx` is **removed**; on-brand module-CSS story card replaces it.
- Article pages: terracotta reading-progress bar, ~68ch body, drop cap, Bricolage pull quotes, sticky share rail, "More from The Foundation" related grid.

### Shared states
- Loading = skeleton cards (no spinners on grid)
- Empty = one centred message + one action
- 404 = on-brand dark band (`app/not-found.tsx`)
- Toasts = async feedback only (field validation errors sit inline below the field)

### Scope discipline
- **Redesigned:** Home, Properties (+ detail), Blog.
- **Audit & font-swap only (not redesigned):** auth, dashboard, admin, static pages.
- New features inherit existing token + component system — flag any new pattern.

### Animation lanes (reaffirmed)
- GSAP = scroll-driven timelines / cinematic sequences / count-ups
- Framer Motion = mount/unmount (`AnimatePresence`), route & modal transitions, list stagger
- CSS = hover / focus / marquee
- Never cross lanes; never add a third library. All motion respects `prefers-reduced-motion`.

### Pages completed in refresh
- **Home** (`app/page.tsx`): 9 sections — hero with search, stats band, featured grid, locations mosaic, how-it-works, why-us, testimonials marquee, blog teasers, CTA band. GSAP scroll animations + count-ups.
- **Properties listing** (`app/(public)/properties/page.tsx`): URL-driven filters, sticky toolbar, pill selects, 3-column grid.
- **Property detail** (`app/(public)/properties/[id]/page.tsx`): Gallery grid, facts strip, amenities, sidebar contact card, mobile sticky bar, similar properties.
- **Blog listing** (`app/(public)/blog/page.tsx`): "The Foundation" masthead, category rail, lead story, story grid, newsletter band.
- **Blog post** (`app/(public)/blog/[slug]/page.tsx`): Reading progress bar, drop cap, pull quotes, share rail, related grid.
- **404** (`app/not-found.tsx`): On-brand dark band with terracotta accent.
- **Header + Footer**: Fixed nav, transparent→solid on scroll, slide-in mobile menu, 4-column footer with social buttons.

---