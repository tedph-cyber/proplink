# Fix Prompt — Lighten the mobile menu + add a theme switcher

Paste into Claude Code, run from `proplink` root. The mobile menu is now too **heavy** — fix the weight, then add a real light/dark theme toggle (the one previewed as a Tweak). Honour `_project-debrief.md` (dark default, one accent = terracotta, WhatsApp green sacred, no glassmorphism).

## 1 — Lighten the menu (it currently feels top-heavy + bottom-heavy)
- **Move the links UP.** They're vertically centered, leaving a dead gap under the header. Anchor the link list near the **top**, just below the header divider (`justify-content: flex-start`, small top padding). The empty space should fall at the **bottom**, above the foot — not above the links.
- **Reduce footer weight — don't stack three equal pills.** Keep ONE primary pill only:
  - **"List a property"** — terracotta, full width (primary).
  - **"Log in"** — make it a **text link with an arrow**, not a bordered full-width button (`Log in →`, muted → terracotta on tap). Lighter.
  - **WhatsApp** — make it a **slim inline row** (green icon + "Chat on WhatsApp" text link), NOT a full-width outlined pill. Sacred green stays, but as a quiet row, not a heavy button.
  - Keep the muted contact line at the very bottom.
  - Net effect: one solid button + two light links = far less weight.
- **Make the "ST" watermark much fainter** — it's reading like a render glitch behind the buttons. Drop it to `rgba(245,240,232,0.02)` (or remove it and keep only the soft terracotta top-right glow). The glow alone is enough atmosphere; the watermark is optional, not both at full strength.
- Tighten the link rhythm slightly (the 1.7rem display links can lose ~10–15% vertical padding) so the group feels intentional, not sparse.

Goal: same content, ~half the visual weight — closer to a light editorial panel than a dense app drawer.

## 2 — Add the theme switcher (light / dark)
There's a sun/theme icon in the desktop topbar already — make a real, persistent toggle and surface it on mobile too.
- **Mechanism:** toggle `data-theme="light" | "dark"` on `<html>`. All colours are already tokens, so theme = swapping token values under `html[data-theme="light"]` (warm paper bg, dark ink text) vs the dark default. Confirm a complete light-theme token block exists in `globals.css`; fill any gaps so **every** surface/border/text token has a light value (no hardcoded hex escaping the theme).
- **Persist** the choice to `localStorage` (`st-theme`) and read it on load **before paint** (small inline script in `app/layout.tsx` `<head>`) to avoid a flash of the wrong theme. Default to dark; respect `prefers-color-scheme` on first visit if no stored value.
- **Placement:**
  - Desktop: the existing topbar sun/moon icon button toggles it.
  - **Mobile: add a toggle inside the menu foot** — a small segmented "Light / Dark" control or a sun/moon icon row, above the contact line. ≥44px target.
- **Icon:** sun when in dark (tap → go light), moon when in light. Smooth ~.3s colour transition on `:root` (guard with `prefers-reduced-motion`).
- WhatsApp green and terracotta accent are identical in both themes — only neutrals flip.

## Verify (375px + desktop)
- Links sit near the top; footer is one terracotta button + light Log-in and WhatsApp links; watermark barely visible or gone — menu feels noticeably lighter.
- Theme toggle works from both desktop topbar and mobile menu, persists across reloads, no flash of wrong theme on load.
- Light theme is complete and on-brand (warm paper, terracotta accent intact); dark unchanged; no element stuck in the wrong palette.
- One accent + WhatsApp green only; no glassmorphism; reduced-motion respected.
