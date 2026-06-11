# Claude Code Prompt — StrongTower Homepage Refresh + Blog Redesign

> Paste everything below the line into Claude Code, run from the `proplink` repo root.
> It assumes the design-reference HTML lives in `design_handoff_strongtower_refresh/design_files/`.

---

You are working in **`proplink`** — a Next.js 15 (App Router) + Supabase property marketplace for **StrongTower Holdings**, a Nigerian real-estate platform. Read `_project-debrief.md` (the CLAUDE.md brief) FIRST and treat it as law. Key stack facts:
- **Styling: CSS Modules** (`styles/*.module.css`) for ALL visual styles (colour, type, border, shadow). **Tailwind is allowed for layout/spacing ONLY** (`flex`, `grid`, `gap-*`, `w-full`) — never for colour/visual styling, never arbitrary values (`w-[347px]`). This is the existing convention; follow it exactly.
- **Fonts** via `next/font/google` exposed as CSS vars `--font-display` / `--font-body`.
- **Animation: GSAP** for scroll-driven timelines / cinematic sequences; **Framer Motion** for React mount/unmount (`AnimatePresence`), modal/page transitions, and card stagger. Do not cross those lanes; do not add a third library.
- **Images:** always `next/image` with explicit dimensions or `fill` + sized container.
- **Prices:** always the existing `<Price amount currency />` component — never format inline.
- **Roles:** `seller` + `admin` only — **buyers never sign up**. `seller_type` ∈ individual / agent / developer.

I'm giving you a folder of **HTML/JSX design references** at `design_handoff_strongtower_refresh/design_files/`. These are **prototypes showing intended look, motion, and structure — NOT code to copy.** They are built with React-via-Babel + plain CSS purely for previewing; **do not** port that scaffolding (no inline `<script>`, no Babel, no `app.jsx`/`tweaks-panel.jsx`). Recreate the *design* in the real stack using existing CSS-Module + token patterns. Where the prototype and `_project-debrief.md` disagree, **the brief wins** (the prototype occasionally bends a rule for preview convenience — call it out and follow the brief).

## SCOPE — what to touch and what to leave alone
- **Redesign (public-facing):** Home (`/`), Properties (`/properties` + `[id]`), and the **Blog** (`/blog` + `/blog/[slug]`).
- **Leave structurally intact:** the **admin panel** (`/admin`, `/admin/properties`, `/admin/sellers`, `/admin/blog`) and the **seller dashboard** (`/dashboard/*`). These already use the token system + `admin.module.css` + `AdminSidebar` and are on-brand. They inherit the font change automatically — **do not redesign them**. Only fix anything that visibly breaks from the Fraunces→Bricolage swap (e.g. headings that relied on the serif).

## Non-negotiable house rules (from the brief)
- **One accent per page.** Terracotta `--color-accent` (#c4622d) only, on primary CTAs + active states. **Green is WhatsApp-only** (`#25d366`) on WhatsApp contact buttons — never reskinned.
- **Property cards: NO like / save / star / view-count.** Exactly **one action per card — the WhatsApp "Contact Seller" button.** (The prototype omits even that for preview simplicity; the brief WANTS the WhatsApp CTA on the card — include it.)
- **Primary search is filter-only** — Property Type + State selectors, **no free-text keyword box** anywhere in the primary search UX.
- **"Verified" chip is neutral parchment**, never green, never coloured.
- **No glassmorphism, no decorative drop-shadows** (`--shadow-card` is structural only). Editorial print feel, not SaaS. No gradient text.
- Dark-first, with the existing light toggle (`html[data-theme="light"]`). Respect `prefers-reduced-motion`.
- Mobile-first — most users are on phones. Hit targets ≥ 44px.

## Design tokens (already in `styles/globals.css` — reuse, don't reinvent)
`--color-bg #0c0b0a` · surface `#161412` · surface-2 `#1e1b18` · text `#f5f0e8` · text-muted `rgba(245,240,232,.6)` · border `rgba(255,245,235,.09)` · **accent `#c4622d`** / hover `#d4703a` / muted `rgba(196,98,45,.14)` · WhatsApp `#25d366` on `#06210f`. Radii sm/md/lg/xl = 10/16/24/32. Spacing + type use the existing `--space-*`, `--text-*`, `--radius-pill` scales.

---

# TASK 1 — Typography change (do this first, it's global)

Replace the display font **Fraunces → Bricolage Grotesque** everywhere. Body stays **DM Sans** OR moves to **Hanken Grotesk** (your call — display is the firm decision). Two files:

**`app/layout.tsx`** — swap the `next/font/google` imports, keep the CSS-variable names:
```ts
import { Bricolage_Grotesque, Hanken_Grotesk } from "next/font/google";
const bricolage = Bricolage_Grotesque({ subsets:["latin"], weight:["500","600","700","800"], variable:"--font-display", display:"swap" });
const hanken    = Hanken_Grotesk({ subsets:["latin"], weight:["300","400","500","600","700"], variable:"--font-body", display:"swap" });
// <html className={`${hanken.variable} ${bricolage.variable}`} ...>
```

**`styles/globals.css`** (~lines 23–24) — update the fallback stack from serif to **sans**:
```css
--font-display: 'Bricolage Grotesque', system-ui, sans-serif;
--font-body:    'Hanken Grotesk', system-ui, sans-serif;
```

Then: Bricolage has **no italic**. Grep every `*.module.css` for `font-style: italic` on display text and remove it — replace the old italic accent word (e.g. *"Legacies"*) with an **upright, terracotta-coloured** word. Display headlines use **weight 600, letter-spacing −0.025em, line-height 1.02**.

---

# TASK 2 — Recreate the homepage / listings / detail (high-fidelity)

Reference files: `design_files/home.jsx` + `home.css`, `listings.jsx` + `listings.css`, `detail.jsx`, `ui.jsx`, `nav-footer.jsx`, `data.js`. (`app.jsx` and `tweaks-panel.jsx` are prototype scaffolding — ignore for production.) Pull real listing data from Supabase; wire real photos from `public/image/` via `next/image` where the prototype shows striped placeholders.

**Property model reality-check** (`lib/types.ts`): `property_type` is only **`house | land`**. Houses carry `features.house_types` (duplex/bungalow/flat/terrace/detached/semi_detached/townhouse/cottage) + `bedroom_category` (1/2/3/4/5_plus); land carries a `land_size_unit` (sqm/sqft/acres/hectares/plots). Price is `price_min` (+ optional `price_max`) → always render with `<Price>`. Location is `state` / `lga` / `city`. So the prototype's many “types” collapse to **House / Land**, and the type **badge** on a card is just `House` or `Land` (accent-muted bg + accent text). Beds/baths/area come from `features`.

**Homepage sections, in order:** full-height dark hero (Bricolage headline + terracotta accent word, **filter-only** SearchBar = Property Type [All/House/Land] + State [37 options] + Search button, trust row, Ken-Burns image) → count-up stats band (animate on scroll) → featured properties grid (3→2→1; cards = 4:5 `next/image`, House/Land badge, title, location line, `<Price>`, **and the WhatsApp “Contact Seller” CTA**; hover lift + image zoom; verified chip neutral) → browse-by-city mosaic → how-it-works (3 numbered steps, dark band) → why-us (media + floating verified card + 3 benefits) → testimonials marquee (pause on hover) → blog teasers (3 cards — see Task 3) → terracotta CTA band.

**Listings (`/properties`):** sticky toolbar = **FilterChips** (All / House / Land) + compact State dropdown + Sort (Newest / Price low→high / high→low) + “Verified only” toggle. **No keyword box.** Results grid (3/2/1), count header, skeleton-card loading (not a spinner), single centred empty state.

**Detail (`/properties/[id]`):** gallery (1 large + 3 thumbs → lightbox), title row, facts as a simple key-value grid (no accordion), description, location/map block + privacy note, **price + WhatsApp CTA sticky at the bottom on mobile** (fixed bar); the prototype’s desktop right-rail contact card is a fine enhancement but the brief’s baseline is the mobile sticky bar. Similar-properties grid is optional (brief says none in v1 — your call, keep it tasteful if included).

**Motion:** **GSAP** for scroll-reveal (fade + ~26px rise, ~90ms stagger) and the count-up (~1.7s ease-out); **Framer Motion** for card stagger on mount and route/modal transitions. Hover lift, Ken-Burns, and the testimonial marquee are plain CSS. All reduced-motion-aware. Do **not** ship the prototype's hand-rolled IntersectionObservers.

---

# TASK 3 — Blog redesign: **"The Foundation" — the StrongTower Journal**

**A working mock of this is in the bundle** — `design_files/blog.jsx` + `blog.css` + `blog-data.js` (listing **and** article views). Build the real thing to match it. The blog *listing* (`app/(public)/blog/page.tsx` + `styles/blog.module.css`) is already on-token — keep that foundation but elevate it into a true **editorial journal**. **Critically: delete the off-brand `components/blog/blog-card.tsx`** (Tailwind, blue `#0568fd`/purple, multi-colour category badges, white cards) and replace it with an on-brand module-CSS card. No coloured category badges anywhere — categories render as a **neutral/terracotta uppercase eyebrow**, not pastel pills.

Data shape (`lib/types.ts → BlogPost`): `title, slug, excerpt, content, cover_image_url, category, tags, status, published_at, author`. Categories (`BLOG_CATEGORIES`): Market Insights · Buyer's Guide · Sellers Tips · Investment · Legal & Finance · Neighborhood. Read time = `Math.ceil(words/200)`.

## My design concept — make the blog feel like a printed property journal, not a CMS feed

**A. Masthead (replaces the generic hero).** Treat it like a magazine cover plate: a thin top hairline, a small terracotta kicker "STRONGTOWER JOURNAL · EST. 2024", then a large Bricolage masthead **"The Foundation"** (the journal's name), and a one-line italic-free standfirst: *"Field notes on buying, building and owning property in Nigeria — written for people who skip the agent."* Right-aligned issue line: current month + year and post count. Keep the existing `heroGlow` terracotta radial but make it subtle. No search box up here.

**B. Lead story (full-bleed editorial split).** The newest/featured post as a large two-column block: a 16:10 cover image on one side (Ken-Burns on hover), and on the other a stacked plate — terracotta category eyebrow, big Bricolage title (clamp ~2–3rem), excerpt, then a meta footer (author · date · N min read) and an underlined "Read the story →" with an arrow that slides on hover. Hairline border, surface background, no shadow.

**C. Category rail.** Reuse the **same chip pattern as the property listings** — a horizontally-scrollable row (All + the 6 categories), icon optional, **underline active state**, wired to `/blog?category=…` (the page already reads that param). This visually ties Blog to Properties.

**D. Story grid with editorial rhythm.** 3-column grid (→2→1) of on-brand story cards that share the **property-card visual language**: surface card, hairline border, 16:10 cover with hover zoom, terracotta category eyebrow, Bricolage title (2-line clamp), excerpt (2-line clamp), and a bottom meta row (date · read time) separated by a hairline. **Hover = lift 6px + image scale 1.06.** Every 4th or 5th item, break the grid with a **full-width "wide" horizontal feature** (image left, text right) for magazine pacing — the listing already has `wideCard`; restyle it to match.

**E. Sidebar / newsletter.** Keep the existing sidebar structure but on-brand: "Popular Topics" as neutral chips, "Latest Posts" as compact image+title rows, and the **newsletter band** in a terracotta-tinted surface ("Join 5,000+ investors…", email input + Subscribe). On mobile the sidebar drops **below** the grid. Newsletter button is terracotta (NOT WhatsApp green).

**F. Empty state.** Editorial, not generic: small terracotta mark, Bricolage "No dispatches yet", muted line, and a terracotta link back to Properties.

## Blog POST page (`app/(public)/blog/[slug]` + `styles/blog-post.module.css`) — elevate to a reading experience
- **Reading-progress bar** pinned to top in terracotta (scroll-linked, reduced-motion-aware).
- **Article header:** terracotta category eyebrow → large Bricolage title (measure ~16ch, weight 600, −0.025em) → standfirst/excerpt in muted body → meta row (author company name · published date · read time). Then a **full-bleed cover image**.
- **Body:** single centred column, **measure ~68ch**, `--font-body` at ~1.125rem / line-height 1.75, generous paragraph spacing. Optional **drop cap** on the first paragraph (Bricolage, terracotta). Style `h2/h3` in Bricolage; links in terracotta with underline; `blockquote` as a **pull quote** — large Bricolage, terracotta, hairline rule, no italics. Images full-measure with a small caption style.
- **Sticky share rail** (desktop, left of the column): share + copy-link + a **WhatsApp share** button (green allowed here — it's a real WhatsApp action). Collapses into an inline row on mobile.
- **Footer of article:** tag chips (neutral), a slim author plate (company name + "Verified seller/contributor"), then a **"More from The Foundation"** related grid (3 on-brand story cards, same category or recent).
- Honour the existing `blog-content.tsx` renderer — restyle via the module, don't rewrite the parser.

## Acceptance criteria for the blog
- Zero **off-brand colour** remains in any blog component — no blue `#0568fd`, no purple, no pastel multi-colour category badges. (Tailwind for layout/spacing is fine; all *visual* styling lives in module CSS using tokens.) `blog-card.tsx` is replaced with a module-CSS component used by both the grid and any other caller.
- Categories appear only as neutral/terracotta uppercase eyebrows.
- Light + dark themes both correct; all motion reduced-motion-aware; mobile-first verified at 375px.
- Visually a sibling of the new homepage/listings — same cards, same chips, same type, same one-accent discipline.

---

# TASK 4 — Shared states, atoms & patterns

Reference: `design_files/States-and-Atoms.html` (+ `states.css`). Make sure these exist as **real, reused components** (most already live in `components/ui/` — audit and fill gaps), all on tokens:
- **Buttons** — `primary` (terracotta), `ghost` (border), `whatsapp` (green, sacred, with WA icon). Sizes sm/md/lg. Disabled state.
- **`<Price>`** — `₦` formatting, range + period support. Never format inline.
- **Badges** — neutral parchment **Verified** chip; House / Land type badge (accent-muted bg + accent text).
- **Status pills** — Active / Pending / Sold / Inactive (used in dashboard + admin tables).
- **Form fields** — label-above-input, native selects, focus ring in accent, **inline error below the field** (never a toast for validation).
- **Loading** — skeleton cards that match real card dimensions (no spinners on the property grid).
- **Empty state** — one centred message + one action, no illustration/animation.
- **404 / error page** — on-brand dark band, terracotta accent, clear way home. Add `app/not-found.tsx` if missing.
- **Toasts** — async feedback only (published / save failed), success + error variants. Not for field validation.

# TASK 5 — Verify & polish the already-built pages (DO NOT redesign)

These already exist and are on-brand; they only need to survive the font swap and meet the brief. **Audit, don't rebuild:**
- **Auth** (`app/(auth)/login|register|forgot-password`, `auth.module.css`) — already has account-type selector, password toggle, email-sent screen. Confirm headings read well in Bricolage; the brief says "no decorative illustration" — tone down or remove the large `blur-3xl` accent **glows** in `(auth)/layout.tsx` + register if they read as decoration. Keep labels-above, native inputs.
- **List-a-property** (`dashboard/properties/new` + `[id]/edit`) — already a 2-step Details→Media flow with House/Land conditional fields, state/LGA, media dropzone, tips sidebar. Just verify type/spacing after the font swap; replace the Unsplash tip image with a `public/image/` asset.
- **Admin** (`/admin/*`) + **seller dashboard** (`/dashboard/*`) — confirm tables, stat cards, and status pills still read correctly in Bricolage. No structural change.
- **Static pages** (`about / contact / faq / privacy / terms`) — confirm headings/spacing; they follow the brief's editorial rules already.

---

## Deliverables
1. **Task 1** — type change committed and verified across the whole app.
2. **Task 2** — Home, Properties, Property detail recreated to match the references, wired to Supabase + real `public/image/` photos.
3. **Task 3** — Blog listing + post redesigned as "The Foundation"; off-brand `blog-card.tsx` removed.
4. **Task 4** — shared atoms + states (loading / empty / 404 / toast) exist as reused components.
5. **Task 5** — already-built pages verified/polished post-swap (no redesign).
6. A short PR description summarising changes and any brief-vs-prototype decisions you made.

Work incrementally, scope commits (type swap → atoms/states → home → properties → detail → blog → polish pass), and run the app to verify each step.

## Files in this bundle (`design_files/`)
- `index.html` — prototype entry (loads the CSS + JSX below)
- `styles.css` · `components.css` · `home.css` · `listings.css` · `blog.css` · `states.css` — design tokens + component/page styles
- `data.js` · `blog-data.js` — mock data
- `ui.jsx` · `nav-footer.jsx` — primitives, Nav, Footer
- `home.jsx` · `listings.jsx` · `detail.jsx` — public funnel screens
- `blog.jsx` — "The Foundation" listing + article reader
- `States-and-Atoms.html` — shared atoms + states reference sheet
- `app.jsx` · `tweaks-panel.jsx` — **prototype scaffolding only — do not port**
