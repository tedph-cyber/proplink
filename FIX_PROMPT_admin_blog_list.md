# Fix Prompt — Admin Blog Posts: mobile table + filters

Paste into Claude Code, run from `proplink` root. The admin **Blog Posts** list is broken on mobile — a desktop table is overflowing, filters are inconsistent, and the empty state collides with the table header. Fix responsively; honour `_project-debrief.md` (dark, one accent = terracotta, no glassmorphism, editorial voice). This is the admin Blog **CMS list** (`app/admin/blog/*`), not the public blog.

## 🔴 1 — Table must become cards on mobile (it currently overflows)
The posts table runs off the right edge ("DETAILS" clipped to "AILS", category/status columns cut off, horizontal scrollbar). Fix:
- **≥768px:** keep the table (Details · Category · Status · Date · Actions).
- **<768px:** **drop the table entirely and render each post as a stacked card** — title + excerpt on top, a row of meta (category eyebrow + status pill + date), and the actions (Edit / Delete / View) as an icon row or a small menu. One post = one card, full width, no horizontal scroll.
- Never rely on `overflow-x:auto` as the mobile "solution" — convert to cards. Add `overflow-x:hidden` safety on the container.

## 🔴 2 — Fix the filter chips (inconsistent + misleading)
Currently "All / Published" are plain text while "Draft" is a filled terracotta pill — it looks like Draft is always selected.
- Make all three (**All · Published · Draft**) the **same chip component**. Only the **active** one gets the terracotta treatment (filled or underlined — pick one and apply uniformly); inactive ones are muted text/quiet outline.
- Add the live count per filter if easy (`All (12)`, `Drafts (3)`).
- Horizontal row, ≥44px tap targets, wraps or scrolls cleanly on narrow screens.

## 🔴 3 — Fix the empty state (it's colliding with the table header)
The "No blog posts yet → Create New Post" block is rendering **inside/over** the table frame, overlapping the header row.
- When there are no posts, render the empty state **instead of** the table (not layered on top): hide the table header + body, show a single centred block — icon, "No posts yet", one short helper line, one **terracotta "New Post"** button. Centered in normal flow, not absolutely positioned over the table.
- Make the helper copy match the active filter ("No drafts yet." when the Draft tab is active).

## 🟠 4 — Lighten the "New Post" button + fix voice
- The top **"+ New Post"** button is a heavy full-width pill. On desktop, make it an **auto-width button aligned right** of the page title; on mobile it can be full-width but **slimmer** (reduce vertical padding). One primary terracotta button is enough — the empty-state button can be ghost/secondary so two terracotta buttons don't stack.
- Copy: "**Curate** and manage your market insights and guides" → "**Write and manage** your market insights and guides." (Avoid "curate" — off-voice.)
- The "Admin Panel" title shows mixed yellow/white letters — make it a single solid colour (`--color-text`); remove whatever per-letter colouring is leaking in.

## Verify (375px + desktop)
- No horizontal scroll anywhere; no clipped column headers; posts show as cards on mobile, table on desktop.
- All three filters look uniform; only the active one is highlighted; counts correct.
- Empty state replaces the table cleanly (no overlap) and reflects the active filter.
- One terracotta primary action per view; title is a single colour; light + dark both clean.
