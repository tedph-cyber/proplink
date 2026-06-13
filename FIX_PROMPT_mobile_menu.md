# Fix Prompt — Mobile menu (fill it out + add a branded background)

Paste into Claude Code, run from `proplink` root. The mobile slide-in menu opens correctly but is **empty and atmosphere-less** — four links in a void. Make it feel like a deliberate, premium panel. Honour `_project-debrief.md` (dark, **one accent = terracotta `#c4622d`**, WhatsApp green sacred, no glassmorphism, editorial feel).

## 1 — Structure: give the panel a head / links / foot (flex column, full height)
The panel is `display:flex; flex-direction:column; min-height:100dvh`. Three zones:
- **Head** — logo lockup left, close (✕) right, thin hairline divider under it (already there — keep).
- **Links** (flex:1) — Properties, How it works, Why us, Journal. Make them **big editorial display type** (`var(--font-display)`, ~1.7rem), generous vertical padding (≥16px each = 44px+ tap target), left-aligned. Add a hover/active micro-interaction: text → terracotta and nudges right ~6px (`padding-left` transition). Stagger them in (each link fades+slides up ~40ms apart) when the menu opens — Framer Motion or a CSS keyframe gated on the `.open` class. Reduced-motion: no transform.
- **Foot** (pinned bottom) — this is what's missing and why it looks empty:
  - Primary CTA **"List a property"** (terracotta, full width).
  - Secondary **"Log in"** (ghost border, full width). *(Buyers don't sign up — so it's List-a-property + Log in for sellers, not "Sign up".)*
  - A WhatsApp contact row (green icon + "Chat on WhatsApp") — sacred green, the one allowed non-terracotta.
  - Small muted contact line: `hello@strongtowerholdings.com` · "Lagos · Abuja · Port Harcourt".

## 2 — The "cool background" (branded, not flat black)
Layer these on the panel, back-to-front. All inside the panel container (`position:relative; overflow:hidden`):

```css
.mobileMenu {
  position: fixed; inset: 0 0 0 auto;
  width: min(86vw, 380px);
  background: var(--color-surface);     /* #161412 base */
  overflow: hidden;
}

/* (a) warm terracotta glow, top-right — gives depth without a gradient banner */
.mobileMenu::before {
  content: "";
  position: absolute; top: -120px; right: -120px;
  width: 360px; height: 360px;
  background: radial-gradient(circle, rgba(196,98,45,0.22), transparent 70%);
  pointer-events: none;
}

/* (b) giant editorial wordmark watermark, bottom — premium print feel */
.mobileMenu::after {
  content: "ST";
  position: absolute; left: -8px; bottom: -40px;
  font-family: var(--font-display);
  font-size: 240px; line-height: 1; font-weight: 600;
  color: rgba(245,240,232,0.035);       /* barely-there off-white */
  pointer-events: none; user-select: none;
}
```

Optional upgrade instead of (b): a real `public/image/` photo (e.g. `coolhouse.avif`) pinned to the **bottom 30%** of the panel at low opacity under a dark scrim, so the menu fades into a property image at the base. Either reads as "designed," not "empty div."

Keep the links/foot at `position:relative; z-index:1` so they sit above the background layers.

## 3 — Polish
- Backdrop scrim behind the panel: `rgba(12,11,10,0.6)` (no heavy blur — avoid glassmorphism), tap-to-close.
- Panel slides in `transform: translateX(105%) → 0`, `.5s cubic-bezier(.22,1,.36,1)`.
- Lock body scroll while open; restore on close. Trap focus; Esc closes.
- The active route link shows in terracotta.

## Verify (test at 375px)
- Menu no longer looks empty — links up top, CTAs + WhatsApp + contact pinned at the bottom, subtle glow + watermark behind.
- Tap targets ≥44px; links stagger in; one accent (terracotta) + the single WhatsApp green; no blue, no glassmorphism.
- Body doesn't scroll behind it; Esc and tap-outside close it.
