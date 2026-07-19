# Design canon — Cosmic Purple (the committed world)

Authority chain: Stitch project **Marvel Snap** (`projects/12427902730037601641`, MOBILE) → tracked exports
`docs/stitch_designs/marvel_snap_mobile/*.html` → this file. Owner ruling 2026-07-19: this is the sole
design world; the comic-book direction (ADR-004 era, dashboard-project explorations) is retired.

## Canonical theme (fetched from Stitch designTheme, 2026-07-19)

- colorMode: **DARK**
- customColor: **#ad2bee** (== `--cosmic-purple`)
- font: **Spline Sans** (Inter fallback)
- roundness: **ROUND_FULL** — interactive controls (buttons, inputs, filter chips) are full pills
  (`rounded-full`); panels/cards are soft (`rounded-2xl`+). Sharp corners are not of this world.
- saturation: 3 (muted — no neon soup)

## Token surface (already in index.html `:root` / Tailwind config)

- Purples: `--cosmic-purple #ad2bee` (decorative), `--cosmic-purple-text #c75fff` (text/interactive, WCAG AA)
- Surfaces: `#120818` (base) / `#1c1022` (surface-1) / `#2b1933` (surface-2)
- Gold accent: `#ffd700` (sparingly)
- Easing: `--ease-snap: cubic-bezier(0.2, 0.9, 0.3, 1)` — the one shared curve
- `body { font-variant-numeric: tabular-nums }`

## Rules

1. ONE accent family: purple. Emerald/red are **semantic only** (win/loss). Gold is rare.
2. Glow is **interaction-only** (hover/focus). Static glow is banned.
3. Never `transition: all` — name properties, use `--ease-snap`.
4. Typography: labels = `text-xs uppercase tracking-[0.15em] font-semibold` muted; values = big bold
   white, no text-shadow; headings = `font-bold tracking-tight`, normal case. No script/comic fonts.
5. Real card art is structural, not decoration — empty states and rows use `getCardArtUrl` imagery
   with fixed-size containers + `onError` fallback.
6. Density per the Stitch screens: stat headers, progress bars with helper text, art rows,
   "what you can do next" sections. No barren panels.
7. Kill-list (extinct classes/patterns): Bangers/Caveat/Permanent Marker, halftone/kirby patterns,
   comic tilts, hard offset shadows, green/red comic blocks.

## Borrowed DNA (from the retired explorations, re-rendered in-world)

- Victory/defeat splash micro-moment on cube logging (from Spider-Verse splashes) — planned.
- Match-notes surfaced as a feed ("Mail Call" lineage) — planned.
