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

## Signature Layer — FULL HOLO (owner ruling 2026-07-19)

The bans prevent the bad; this layer IS the point of view. Cosmic means *cosmic*: nebula depth,
holographic foil, starlight — the game's own cards are holographic and the app shimmers with them.
Rules 1-7 still bind (single accent family, no comic DNA, named-property transitions) — this layer
adds expression WITHIN them, it does not relax them.

1. **Atmosphere**: layered nebula gradient + faint starfield behind the app (CSS only, subtle,
   `prefers-reduced-motion` safe, zero-JS ambient). The flat void is retired.
2. **Glass with depth**: elevated surfaces (dashboard hero, splash, spotlight, modals) use real
   glass — `rgba(60,35,72,0.6)` + backdrop-blur + inner highlight edge. Flat surface-1 remains for
   list rows and dense tables.
3. **Holo-foil**: shimmer/foil sheen on owned cards, god-splits, mastery-maxed, and the victory
   splash — CSS gradient/mask sheen, interaction-and-state driven, GPU-cheap.
4. **Hero moments**: masthead gets cosmic gradient gloss; dashboard gets a featured-card art hero.
5. **Gold = reward**: spotlight keys, maxed mastery, max-stakes. Never chrome, always earned.
6. **Annotation chips**: AI advisor tips as purple holo-notes (Spider-Verse DNA, cosmic-rendered).

## The Wow Arc — structural restructure (owner rulings 2026-07-19, design session #3)

The standing hypothesis is **CONFIRMED by the owner**: Full Holo added texture to screens that
are structurally a generic stat dashboard; the fix is changing what the screens ARE — the
player's cards/collection as the *subject* of every screen, not decoration around stat panels.
All four wow ingredients are in play: card art as UI, motion & ceremony, a flagship experience,
personality & voice.

**Direction ruling: compose all three concepts** (not either/or). Stitch references live in the
authority project (`projects/12427902730037601641`); tracked exports alongside this file:

1. **THE VAULT** (home) — screen `9965615e4d6d4c7285df18e12f8f12d0`, export
   `concept_vault_home.html`. Full-bleed holographic hero card owns the top of Home; rank +
   season progress ride the card as an orbital arc, not a panel; "Your Arsenal" shelf of owned
   cards with stat chips ON the cards; one "Ask Snapapoulous" pill.
2. **THE FORGE** (Decks flagship — the AI deck maker) — screen
   `55dc866d47d149c2802bb879654ce8a6` ("Cosmic Perspective", **owner's pick** over the
   orchestrator-recommended "Ritual Arc"), export `concept_forge_flagship.html`. Ceremonial AI
   deck-building: hero card materializing in a gold-glow frame, deck carousel behind, prompt
   pill ("Forge me a deck around …"), "Only my cards" / "Meta-aware" toggles, AI reasoning as
   purple holo annotation chips. Gold = synergy/reward only. The deck maker is a **design
   pillar**, not a bolt-on (owner ruling).
3. **THE COMPANION** (Dashboard/History voice) — screen `ab81954439ea4d2a8b328bfcba72633d`,
   export `concept_companion_home.html`. Snapapoulous as a living presence: conversational
   headline states the night's story; matches as an annotated feed with one-line advisor
   remarks in holo speech chips; momentum ribbon visualizes the cube streak; stats appear
   inside sentences and chips, never as panel grids.

Rules 1-7 and the Signature Layer still bind. Implementation is a tracked arc:
`docs/plans/design-wow-2026-07-19.md`. Losing variants (`fe184b12…` Ritual Arc,
`274cf95f…` Geometric Zenith, original Forge draft `69cbfb19…`) remain in the Stitch project
for reference but are non-canonical.

## Borrowed DNA (from the retired explorations, re-rendered in-world)

- Victory/defeat splash micro-moment on cube logging (from Spider-Verse splashes) — SHIPPED (ae0aba7).
- Match-notes surfaced as a feed ("Mail Call" lineage) — SHIPPED (ae0aba7).
- Annotation chips (Spider-Verse sticky-note lineage) — part of the Signature Layer.
