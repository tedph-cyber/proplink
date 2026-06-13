# Handoff: StrongTower Homepage Refresh + Type Change

## Overview
This package covers two related pieces of work for the **StrongTower Holdings** marketplace (`proplink` — Next.js 15 + Supabase):

1. **Typography change** — replace the display font **Fraunces** with **Bricolage Grotesque** across the app. Body font **DM Sans** is replaced by **Hanken Grotesk** in the prototype, but see note below — keeping DM Sans is also fine. This is the one change that should land in the **real codebase now**.
2. **A richer, more animated homepage + listings + property-detail experience** — delivered as an **HTML design reference** (not production code). It shows the intended sections, motion, and Airbnb-influenced structure to rebuild inside the existing Next.js app using its established patterns (CSS Modules, GSAP/Framer Motion).

## About the Design Files
The files in `design_files/` are **design references created in HTML/React-via-Babel** — prototypes showing intended look and behaviour, **not production code to copy directly**. The task is to **recreate these designs in the existing `proplink` codebase** using its established environment: Next.js App Router, CSS Modules (`styles/*.module.css`), `next/font/google`, GSAP + Framer Motion, and the Supabase data layer. Do **not** introduce React-Babel, inline `<script>` tags, or a new styling system.

## Fidelity
**High-fidelity.** Colours, type, spacing, motion, and copy are intentional and final-ish. Recreate the UI faithfully using the codebase's existing libraries and module-CSS patterns. Where the prototype and the real `CLAUDE.md` brief disagree, **the brief wins** (notes inline below).

---

## PART 1 — The Type Change (do this in the real repo)

The whole app references fonts through two CSS variables — **`--font-display`** and **`--font-body`** — used across ~14 `styles/*.module.css` files and `app/globals.css`. So the change is small and localised: swap the font *sources*, keep the variable names. **Two files** define those variables and both must change.

### File 1 — `app/layout.tsx` (the `next/font/google` source of truth)

**Current:**
```ts
import { DM_Sans, Fraunces } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "600"],
  variable: "--font-display",
  display: "swap",
});

// <html className={`${dmSans.variable} ${fraunces.variable}`} suppressHydrationWarning>
```

**Change to:**
```ts
import { Hanken_Grotesk, Bricolage_Grotesque } from "next/font/google";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

// <html className={`${hanken.variable} ${bricolage.variable}`} suppressHydrationWarning>
```
> Keep the variable names `--font-display` / `--font-body` exactly — every module CSS already points at them, so nothing downstream needs editing.
> If you'd rather **keep DM Sans for body**, leave the `DM_Sans` import as-is and only swap Fraunces → Bricolage Grotesque. The firm decision is the **display** font; the prototype pairs it with Hanken Grotesk, but DM Sans is an acceptable body keep.

### File 2 — `styles/globals.css` (the fallback declaration, ~lines 23–24)

**Current:**
```css
--font-display:      'Fraunces', Georgia, serif;
--font-body:         'DM Sans', system-ui, sans-serif;
```

**Change to:**
```css
--font-display:      'Bricolage Grotesque', system-ui, sans-serif;
--font-body:         'Hanken Grotesk', system-ui, sans-serif;
```
> Note the display fallback stack changes from a **serif** to **sans-serif** — Bricolage is a grotesque sans, so the fallback must be sans too, otherwise the flash-of-fallback looks wrong.

### Display-font usage rules (Bricolage Grotesque)
- **Weight 600** for hero/section headlines; 700–800 only for very large hero type.
- **Letter-spacing `-0.025em`**, **line-height `1.02`** on big headlines.
- Bricolage has **no true italic** — the old Fraunces italic accent (e.g. italic *“Legacies”*) must become an **upright, terracotta-coloured** word, NOT italic. Grep the module CSS for `font-style: italic` on any element using `var(--font-display)` and remove it (check `header`, `about`, `blog-post`, `property-detail`, `snap-scroll` modules).
- The accent word in the hero uses the terracotta accent colour for emphasis, not italics.

---

## PART 2 — Homepage / Listings / Detail design reference

### Brand tokens (already match the real `globals.css` — confirm, don't reinvent)
| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#0c0b0a` | page background (warm near-black) |
| surface | `#161412` | cards / panels |
| surface-2 | `#1e1b18` | elevated |
| text | `#f5f0e8` | primary text |
| text-muted | `rgba(245,240,232,0.60)` | secondary |
| border | `rgba(255,245,235,0.09)` | hairlines |
| **accent (terracotta)** | `#c4622d` | ONE accent per page; hover `#d4703a` |
| accent-muted | `rgba(196,98,45,0.14)` | chip/badge fills |
| **WhatsApp** | `#25d366` on `#06210f` | **sacred — only on WhatsApp contact buttons** |

Radii: `sm 10 / md 16 / lg 24 / xl 32`. **No glassmorphism, no decorative drop-shadows** (per brief). Dark-first with a light toggle (`html[data-theme="light"]`).

### House rules (from `_project-debrief.md` / CLAUDE.md — must honour)
- **One accent per page.** Terracotta only; green is WhatsApp-only.
- **Property cards have NO like/save/star buttons.** (The early mock had them — they are removed.)
- **Filter-only search** — Property type + State selectors. **No free-text keyword box** in the primary search.
- “Verified” trust chip is **neutral parchment**, never green.
- Editorial print feel, not SaaS.

### Screens

**1. Home (`design_files/index.html` → `home.jsx`)**
- **Hero**: full-height, dark, large Bricolage headline with terracotta accent word; sub-copy; **filter search bar** (Property type dropdown, State dropdown, Search button — no keyword field); trust row (avatars + 4.9 rating). Ken-Burns on hero image. Entrance animation on load.
- **Stats band**: 4 count-up stats (`4,200+ verified properties`, `18 states`, `1,600+ owners`, `96% skip the agent`). Animate on scroll into view.
- **Featured properties**: 3-col grid (→ 2 → 1 responsive) of property cards. Cards: image (4:3) with verified badge + tag, title, location, beds/baths/sqm, price. Hover lift + image zoom. **No like button.**
- **Browse by city**: mosaic of location tiles (Lagos, Abuja, PH, Ibadan, Enugu, Kano) with count + scrim.
- **How it works**: 3 numbered steps on a dark band.
- **Why us**: media + floating verified card + 3 benefit rows.
- **Testimonials**: horizontal auto-scroll marquee (pauses on hover).
- **Blog teasers**: 3 article cards.
- **CTA band**: terracotta-tinted, “List your property”.

**2. Listings (`listings.jsx`)**
- **Sticky toolbar**: State selector + “Verified only” toggle + sort dropdown (featured / price asc / desc). **No keyword search box.**
- **Category chip row** (Airbnb-style, horizontally scrollable, icon + label): All, Detached Duplex, Terrace, Bungalow, Block of Flats, Land, Penthouse, Semi-Detached, Shortlet. Active = underline.
- **Results grid** (same property cards), result count header, “Show map” button, “Load more”.
- Empty state with reset.

**3. Property detail (`detail.jsx`)**
- **Gallery**: 1 large + 4 thumbnails grid (collapses on mobile), “Show all photos”.
- **Title row**: verified badge + tag, title, location. Share + save icon buttons (save here is fine — it's the detail page, not the card).
- **Facts strip**: beds / baths / area / type with icons.
- **Sections**: About, What this place offers (amenities grid), Where you'll be (map placeholder + privacy note).
- **Sticky contact card** (desktop right rail): price, owner row, **WhatsApp button (green)**, schedule viewing, request callback, safety note. On mobile this becomes a **fixed bottom contact bar**.
- **Similar properties** grid.

### Interactions & Motion
- **Scroll reveal**: fade + translateY(26px) on entry via IntersectionObserver; stagger siblings ~90ms. Honour `prefers-reduced-motion`.
- **Count-up** stats on first view (~1.7s, ease-out cubic).
- **Hover**: cards lift 6px + inner image scale 1.06; buttons translateY(-2px).
- **Ken-Burns** slow zoom on hero/feature images.
- **Marquee** testimonials, pause on hover.
- **Page/route transitions**: fade + small rise.
- In the real app, implement these with the **existing GSAP / Framer Motion** setup rather than the prototype's hand-rolled observers.
- Motion intensity scales off a `--motion` multiplier in the prototype; map to a reduced-motion-aware constant.

### Responsive
Mobile-first (most users on phones). Breakpoints used: 1000 / 860 / 640 / 520 / 420px. Hamburger sheet nav under 860px. Search bar fields stack on mobile. Detail page right rail → bottom sticky bar under 1000px. Hit targets ≥ 44px.

### Typography scale (display = Bricolage, body = Hanken/DM Sans)
- Hero headline: `clamp(2.9rem, 8vw, 6.4rem)`, weight 600, ls −0.025em, lh 1.02
- Section title: `clamp(2rem, 4.5vw, 3.4rem)`
- Eyebrow: 0.72rem, weight 600, ls 0.18em, uppercase, terracotta
- Body/lead: 1.0–1.08rem, lh 1.6, muted
- Card price: ~1.18rem display weight

### Assets
The prototype uses **labelled striped placeholders** for all imagery. The real repo already has photos in **`public/image/`** (`coolhouse.avif`, `premium_skyscraper.avif`, `keys.avif`, `assorted houses.avif`, etc.) — wire those in where the prototype shows placeholders. Icons in the prototype are inline line-SVGs (Lucide-style); the real app can use its existing icon approach.

## Files (in `design_files/`)
- `index.html` — entry; loads styles + scripts, page-transition + boot splash
- `styles.css` — design tokens (matches real `globals.css`), type scale, buttons, reveal, placeholders
- `components.css` — nav, property card, footer, section header
- `home.css`, `listings.css` — page styles
- `data.js` — mock Nigerian property data, locations, testimonials, stats, amenities
- `ui.jsx` — Icon set, Reveal, CountUp, Ph (placeholder), Stars, PropertyCard
- `nav-footer.jsx` — Nav (sticky, scroll state, mobile sheet) + Footer
- `home.jsx`, `listings.jsx`, `detail.jsx` — the three screens
- `app.jsx` — router + Tweaks panel (theme/accent/type/motion) — **prototype-only**, not for production
- `tweaks-panel.jsx` — prototype Tweaks shell — **prototype-only**
- `Type Explorer.html` — the 5-way font comparison used to choose Bricolage Grotesque

> The Tweaks panel and router (`app.jsx`, `tweaks-panel.jsx`) are **prototype scaffolding** to preview options — they are NOT part of the design to ship. The chosen defaults are: theme **dark**, accent **#c4622d**, type **Bricolage Grotesque / Hanken Grotesk**, motion **lively**.
