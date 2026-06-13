# CLAUDE.md Addendum — Design Refresh (locked decisions)

> Paste this into `proplink/_project-debrief.md` (append to the bottom, or fold into the relevant sections).
> It records the design decisions locked during the 2026 refresh. These supersede any conflicting older note.

---

## ✅ Typography (LOCKED)
- **Display font: `Bricolage Grotesque`** (was Fraunces). Headlines weight **600**, letter-spacing **−0.025em**, line-height **1.02**.
- **Body font: `Hanken Grotesk`** (DM Sans is an acceptable fallback if preferred).
- Both wired through `next/font/google` in `app/layout.tsx` as `--font-display` / `--font-body`; the fallback stack in `styles/globals.css` must be **sans-serif** (Bricolage is a grotesque, not a serif).
- **Bricolage has no italic.** Never use `font-style: italic` on display text. The old italic accent word (e.g. *"Legacies"*) is now **upright + terracotta**.

## ✅ Palette & aesthetic (unchanged, reaffirmed)
- Dark-first, warm near-black `--color-bg #0c0b0a`; **one accent per page = terracotta `#c4622d`**.
- **WhatsApp green `#25d366` is sacred** — only on WhatsApp contact buttons, never reskinned, always with the WA icon.
- **Verified chip = neutral parchment**, never green, never coloured.
- No glassmorphism, no decorative shadows, no gradient text, no off-brand blues/purples.

## ✅ Property model in UI
- `property_type` is **House | Land** only. Card type badge says `House` or `Land` (accent-muted bg + accent text). Beds/baths/area/land-size come from `features`. Prices always via **`<Price>`** (`price_min` + optional `price_max`).
- **Property cards** carry exactly **one action: the WhatsApp "Contact Seller" CTA.** No like / save / star / view-count.
- **Search is filter-only** (Property Type + State). No free-text keyword box anywhere.

## ✅ Blog identity (LOCKED)
- The blog is **"The Foundation" — the StrongTower Journal**: editorial/print feel.
- Categories render as **neutral/terracotta uppercase eyebrows** — never pastel multi-colour badges.
- The old Tailwind `components/blog/blog-card.tsx` (blue `#0568fd`/purple) is **removed**; the on-brand module-CSS story card replaces it everywhere.
- Article pages: reading-progress bar (terracotta), ~68ch measure, drop cap, Bricolage pull quotes, sticky share rail (WhatsApp share allowed), "More from The Foundation" related grid.

## ✅ Shared states (must exist as reused components)
Loading = skeleton cards (no spinners on the grid) · Empty = one centred message + one action · 404 = on-brand dark band (`app/not-found.tsx`) · Toasts = async feedback only (never field validation; validation errors sit inline below the field).

## ✅ Scope discipline
- **Redesigned:** Home, Properties (+ detail), Blog.
- **Audit & font-swap only (do NOT redesign):** auth pages, list-a-property form, admin panel, seller dashboard, static pages. They are already on-brand.
- New/future features inherit the existing token + component system — flag any new pattern before introducing it (per the original brief).

## Animation lanes (reaffirmed)
GSAP = scroll-driven timelines / cinematic sequences / count-ups. Framer Motion = mount/unmount (`AnimatePresence`), route & modal transitions, list/card stagger. CSS = hover/focus/marquee. Never cross the lanes; never add a third library. All motion reduced-motion-aware.
