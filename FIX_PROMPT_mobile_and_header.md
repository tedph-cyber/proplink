# Fix Prompt — Header, Spacing & Mobile Responsiveness

Paste into Claude Code, run from the `proplink` repo root. Several issues shipped in the homepage refresh — fix all of them. Honour `_project-debrief.md` (dark + terracotta, one accent, WhatsApp green sacred, Tailwind for layout only, CSS Modules for visuals).

## 🔴 Bug 1 — The header is completely missing
On every page the top nav is gone — no logo, no nav links, **no mobile hamburger**. Fix:
- Confirm `<Header />` actually renders inside `app/(public)/layout.tsx` and is NOT covered/hidden. If the homepage uses the `snap-scroll` landing, make sure its overlay nav still shows on mobile — OR render the shared `Header` above it.
- The header must be **`position: fixed/sticky; top:0; z-index:100`** with a defined height, and the hero must offset for it (`padding-top: var(--nav-h)`).
- **Mobile (`<860px`): desktop nav links hide and the hamburger (`MobileNav`) MUST show.** Verify `.mobileHamburger` is `display:flex` in the mobile media query and the desktop `.nav` is `display:none`. Right now neither appears — likely both got set to `display:none`, or the header has `z-index` below the hero, or it failed to mount. Test at 390px: logo left, hamburger right, tapping it opens the slide-in sheet.

## 🔴 Bug 2 — Unicode escapes printing as literal text
Text shows `STRONGTOWER HOLDINGS \u00b7 NIGERIA`, `\u2014`, `4.9 \u00b7 trusted by…`. The `\u00b7` (·) and `\u2014` (—) escapes are being rendered as raw strings. Fix by replacing them with the actual characters in the source:
- `\u00b7` → `·` (middle dot)  ·  `\u2014` → `—` (em dash)  ·  `\u2013` → `–`
- Grep the codebase for `\\u00` and `\\u20` and replace every occurrence with the real glyph. (This came from copying prototype strings where escapes weren't decoded.)

## 🔴 Bug 3 — Huge empty vertical space / sections look broken
Massive black gaps (e.g. the "Rooted in trust" media panel is empty; stats float in a void). Causes + fixes:
- The "why us" media column is an **empty placeholder** — wire a real `public/image/` photo (e.g. `coolhouse.avif`) into it, or remove the empty column on mobile.
- Don't pin section content to `100vh`/`min-height: 100svh` except the hero. Sections should be **`padding: clamp(56px,9vw,116px) 0`** and size to their content — not stretch to viewport height.
- "No Image Available" cards: provide a proper fallback (a tasteful surface block with the House/Land badge), not a giant empty light panel — and never a white panel on the dark theme.

## 🔴 Bug 4 — Not responsive (content overflows / gets cut off)
"Port Ha…", "Enugu", and cards bleed past the right edge — the desktop grid isn't collapsing. Fix the breakpoints **mobile-first**:
- Wrap every section in a max-width container with side padding: `width:100%; max-width:1240px; margin-inline:auto; padding-inline: clamp(16px, 5vw, 24px)`. Add `overflow-x: hidden` on `body` to kill horizontal scroll.
- **Grids collapse:** featured/blog 3→2→1; "Find your city" mosaic 3→2→1 (drop the row-span feature tiles to single column on mobile); stats 4→2; why-us 2→1 (media on top). Use `repeat(auto-fit, minmax(280px,1fr))` or explicit `@media (max-width: 1000px/640px)` rules.
- **Hero type** must use `clamp()` (e.g. `clamp(2.6rem, 8vw, 6.4rem)`) so it never overflows at 360–390px. Sub-copy max-width ~52ch.
- **Search bar** stacks on mobile: Property Type + State full-width, Search button full-width below.
- **Touch targets ≥ 44px**; horizontal chip rows scroll (`overflow-x:auto`) instead of wrapping awkwardly.

## Verify before done
Test at **360, 390, 768, 1024, 1440px**:
1. Header visible on all of them (hamburger < 860).
2. No `\uXXXX` strings anywhere.
3. No horizontal scrollbar; nothing cut off at the right edge.
4. No section taller than its content (no giant empty bands); every image slot filled or gracefully hidden.
5. Light + dark themes both clean; `prefers-reduced-motion` respected.
