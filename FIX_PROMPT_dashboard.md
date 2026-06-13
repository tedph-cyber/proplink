# Fix Prompt — Seller / Admin Dashboard polish

Paste into Claude Code, run from the `proplink` repo root. The dashboard shell is good — **do NOT redesign it.** These are targeted corrections to bring it back in line with `_project-debrief.md` (dark + **one accent = terracotta `#c4622d`**, WhatsApp green sacred, no decorative gradients, editorial-not-SaaS, no data slop). Touch only the dashboard header/cards/copy — leave the sidebar shell, tables, and routing intact.

## 🔴 1 — Kill the decorative gradient on the welcome banner
The hero/welcome panel uses a dark→cream gradient that (a) violates the "no decorative gradients / glassmorphism" rule and (b) makes the white heading unreadable where it crosses the light end.
- Replace with a **flat dark surface** (`--color-surface` / `--color-surface-2`), OR a real `public/image/` photo (e.g. `premium_skyscraper.avif` / `coolhouse.avif`) behind a **dark scrim** (`linear-gradient(90deg, rgba(12,11,10,.92), rgba(12,11,10,.55))`) so text stays high-contrast.
- Heading + sub-copy must read as crisp off-white (`--color-text`) on dark. No light-on-light anywhere.

## 🔴 2 — Fix the off-voice copy
- Eyebrow **"CURATOR WORKSPACE" → "SELLER DASHBOARD"** (or remove the eyebrow). "Curator" is not the brand voice; sellers aren't curators.
- **"Welcome back, Seller"** is printing the *role*. Show the person: `Welcome back, {profile.full_name?.split(' ')[0] ?? 'there'}`. Never display the literal word "Seller" as a name.

## 🔴 3 — Enforce ONE accent (terracotta)
- The eyebrow and the ROI stat currently render in **blue/indigo** — remove all blue. Accent text = terracotta `--color-accent` only.
- **Allowed exception:** the small green "delta" pills (`+2`, `+12%`) may stay green as semantic up/down indicators — but they are the *only* non-terracotta colour, and only for trend deltas. Everything else (eyebrows, active states, links, highlighted numbers) is terracotta.

## 🔴 4 — Remove the "Estimated ROI" stat (data slop)
"Estimated ROI 18%" is a fabricated number — you can't derive a seller's ROI from listing data, and a fake metric erodes trust (a core brand value). Replace that 4th stat card with a **real, derivable** metric:
- **"Saves / Shortlists"** (times listings were saved), or **"Avg. response time"**, or **"Inquiries this week."**
- Apply the same test to the other three: Total Properties (real ✅), Total Views (real if tracked, else remove), Active Inquiries (real ✅). Drop any stat you can't back with actual data rather than inventing one.

## 🔴 5 — Fix the clipped logo
Sidebar logo shows **"StrongTower Holdi…"** — it's being truncated. Give the lockup room (don't fix the sidebar width so tight) or wrap "Holdings" to its own line under "StrongTower". The wordmark must never clip.

## 🟠 6 — Make the quick-action icons consistent
The Quick Action icons sit in flat **grey** discs that look unfinished on the dark cards. Tint them to match the stat-card icons: **`background: var(--color-accent-muted); color: var(--color-accent);`** Keep the hover lift; keep one icon per action.

## Verify before done
- No gradient on the welcome banner; heading legible at a glance.
- No blue anywhere on the dashboard; terracotta is the only accent (green only on trend deltas).
- Greeting shows a real first name, not "Seller"; eyebrow reads "Seller Dashboard".
- Every stat card maps to real data — no invented ROI.
- Logo wordmark fully visible.
- Light + dark themes both clean; nothing regressed in the sidebar, tables, or other admin pages.
