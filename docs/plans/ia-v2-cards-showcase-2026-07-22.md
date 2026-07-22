# IA v2 — Cards-as-Showcase + Simulator/Cosmetics/Mastery consolidation — 2026-07-22

**Created**: 2026-07-22 (crew design session). Provenance: owner app-walkthrough observations →
orchestrator code-grounded recon → **council (4/4 backends: deepseek/qwen/gemini/minimax, unanimous)**
+ **ChatGPT deep-reason (high effort)** design review → owner rulings (two AskUserQuestion rounds).
Both external reviews independently reached the same conclusions and pushed back on 2 of the owner's
5 original ideas; all rulings below are LOCKED — do not re-litigate.

**Standing law** (unchanged): single `index.html` / CDN-only / no build; design canon binds; every
slice = sonnet implement → haiku adversarial verify → orchestrator gate re-run + diff read → commit by
orchestrator only; **SW CACHE_NAME bump on every index.html-deploying commit** (currently `v33` after
the IA-refactor + game-dup-removal waves; next deploy = **v34**, increment per slice).

**Product thesis (the lens for every call):** surface the player's PRIVATE longitudinal data the game
HIDES; do NOT rebuild surfaces the game already shows well (see ADR-007). The card is the atomic unit —
per-card attributes (art, performance, mastery, variant-ownership) collapse INTO the card, not into
sibling tabs.

---

## Owner's original proposal vs. the ruling (with why)

| # | Owner idea | Ruling | Why (council 4/4 + ChatGPT + owner) |
|---|---|---|---|
| 1 | Decks becomes a sub-tab of Cards | **REJECTED — Decks stays primary** | Cards = library/reference (noun); Decks = workshop/action (verb). Burying the core BUILD workflow two levels deep adds friction to the most-used tool. Nav stays 5. |
| 2 | Promote Creators to primary nav | **REJECTED — Creators stays inside Decks** | Creators is external editorial/discovery content, OFF-thesis (not private data). It already lives as a section inside Decks; "bring to forefront" = make it more prominent THERE, not a primary slot. No slot was freed (see #1) so nothing to promote into. |
| 3 | Cosmetics folds into Cards as "click card → see variant artworks" | **ACCEPTED, REFRAMED** | Right placement, impossible visual: variant ARTWORK is unfetchable (`getCardArtUrl`, index.html:1732, is base-art-by-NAME slug only; no variant-art URL). Ship **owned-variant COMPLETION** ("you own X/Y variants"), a count/progress — NOT a gallery, NOT repeated base art, NOT placeholders. More on-thesis (private completion the game doesn't aggregate). |
| 4 | Mastery Forge folds into Cards | **ACCEPTED + roster preserved** | Per-card mastery → card detail. BUT keep the cross-card ROSTER (near-a-reward / unused / most-XP-this-week) as a Cards sub-view — a per-card page can't answer roster questions (ChatGPT catch). |
| 5 | Simulator → "sim my decks vs a meta deck" | **REWORKED — tab dropped, split in two** | A real deck-vs-deck BATTLE sim needs a full Snap engine (abilities+locations+turn+opponent-AI) in a single HTML file = the unanimous "biggest risk: engine scope creep" + false-precision trap. Split the Simulator's two real capabilities: **draw-consistency math → Deck detail**; **matchup analysis → Advisor** (deck list fed as context). |

**Nav after this wave (unchanged, 5):** `Home · Cards · Decks · Advisor · More`.
**Routes REMOVED this wave:** `cosmetics`, `mastery`, `simulator` (their value relocates, see slices).

---

## Verified data sources (recon done 2026-07-22 — do not re-derive)
- **Card performance** per card: `snap_card_performance` (keys = card names, from `parseProfile` CardStats). **BUG — see B0.**
- **Mastery** per card: `snap_mastery` (`.cards[]` with level/levelCap/xp; defId→name via CARD_DATA map — the defId art bug was fixed in the Mastery Forge rebuild, keep that resolution).
- **Variants owned** per card: `snap_collection_enhanced` `.cards[]` with `variants[].artVariantDefId` (owned-variant set). Hall of Armor (Profile, `UserProfile`) already computes this — RETIRE it into card detail.
- **Draw-odds engine**: `hypergeometricAtLeastOne`/`hypergeometricAllCards` (~index.html:12549) + `MonteCarloEngine.simulateGame` (~12588) — models YOUR draws by turn. Tested/deterministic per `docs/plans/deck-simulator-rebuild.md`. RELOCATE, don't rewrite.
- **Advisor** (`AIChat`) already takes context (collection, matches, aiConfig) + has Ask/Meta modes (S6). Matchup adds deck-list context.
- **CardDetail** component exists (full-screen overlay on card tap) — the expansion target for D1.

---

## Slices (sequential; one implementing agent per slice; verify 3 ways each)

### B0 — Bug: `.NET` type-string leaks onto Analytics as a fake card  (DO FIRST, independent)
`parseProfile` (index.html:3515) does `Object.entries(account.CardStats).map(([card, netCubes]) => …)`
with NO key filtering. A serialization-artifact key
(`System.Collections.Generic.Dictionary\`2[[CubeDef.Id...],[Int32...]], mscorlib`) flows through as a
"card" and renders on Analytics/Card Performance. **Fix:** drop entries whose key isn't a real card —
filter keys containing `System.` / `mscorlib` / backtick / `, ` (type-string markers), OR (stronger)
keep only keys that resolve via the defId→name / known-card map the sync layer already uses (4138-4150).
Gate: no `System.`/`mscorlib` string renders on Analytics with real fixtures; legit cards unaffected.

### D1 — Card detail becomes the showcase (the core payload)
Expand `CardDetail` to render, for the tapped card, a **"Your card"** section: base art + card info
(existing) + **performance** (net cubes, from B0-fixed data) + **mastery** (this card's level/XP/next) +
**variant completion** ("X/Y variants owned" — count/progress, NEVER a gallery) + **deck cross-links**
("used in N of your decks", "add to deck"). All data sources verified above. Preserve hook order.
Gate: tapping an owned card shows all sections truthfully; unowned/no-data cards degrade gracefully
(no fake variants, no NaN); no console errors.

### D2 — Mastery: roster → Cards sub-view; drop `mastery` route
Move `MasteryForgeView`'s roster (sort by level / near-cap / unused) into Cards as a sub-view/mode
(alongside Browse). Per-card mastery already in card detail (D1). Remove the `mastery` top-level route +
whitelist + More tile. Keep the roster's defId→name art resolution.
Gate: mastery roster reachable inside Cards; no `mastery` route refs; per-card mastery still in detail.

### D3 — Cosmetics: retire tab + Hall of Armor into card detail
Variant completion now lives in card detail (D1). Remove `CosmeticsView` + the `cosmetics` route +
whitelist + More tile. Drop title/back/album COUNT tracking (game-visible trivia + don't-duplicate rule;
owner ruled variants-only). Retire Profile's **Hall of Armor** (its variant showcase now redundant with
card detail). NOTE: keep the `snap_collection_enhanced` PARSE/sync/VAULT keys write-only (reversible),
per the ADR-007 pattern — only remove DISPLAY.
Gate: no `cosmetics` route; Hall of Armor gone from Profile; variant data still parsed/synced.

### D4 — Deck detail: Consistency readout; drop `simulator` route
Relocate the draw-odds engine (hypergeometric + MonteCarlo) into **Deck detail** as a Consistency
section ("P(draw <key card> by turn X)", "P(combo by turn Y)"). Remove the `simulator` top-level route +
whitelist + More tile + the standalone Simulator view. Reuse the existing tested math verbatim — do NOT
rewrite. Preserve the determinism/seed discipline from `deck-simulator-rebuild.md`.
Gate: consistency readout renders in a deck's detail; no `simulator` route refs; math outputs match the
old tool for a fixed deck+seed.

### D5 — Advisor: matchup analysis (your deck vs a meta deck)
Add matchup analysis to `AIChat`: from a saved deck, an **"Analyze matchup"** action opens Advisor with
the deck list + a chosen meta deck attached as context; Advisor produces qualitative guidance
(curve/archetype/tech-check, facts-vs-inference explicit). Reuse the Ask/Meta scaffolding (S6) — matchup
is an Advisor capability, not a new tab. This is the home for what the dropped Simulator's "vs meta"
idea wanted. (Owner Q: "can the sim feed deck data to Advisor?" → YES, this is that.)
Gate: an "Analyze matchup" entry from Decks lands in Advisor with deck context; chat unaffected.

### D6 — Creators prominence inside Decks
Make Creators more visible WITHIN Decks (owner: "bring to the forefront" — inside Decks, not primary
nav). Scope TBD at spec time (e.g. a Creators mode/section header promotion within the Decks hub). Small.
Gate: Creators content is more discoverable inside Decks; no nav change.

**Sequencing:** B0 first (live bug, independent). D1 is the keystone (card detail carries mastery +
variants) — D2/D3 depend on it (they retire the tabs whose value D1 absorbs). D4/D5/D6 independent after.
Consider a fresh session per 2-3 slices (crew rotation) — this wave is design-heavy.

---

## Deferred / roadmap (NOT this wave — flagged, owner-aware)
- **Data gravity (ChatGPT's "single biggest risk"):** a no-backend PWA risks stale/evicted/lost local
  data; if capture is laborious the app drifts to generic browsing (anti-thesis). Highest long-term
  leverage = frictionless import, durable persistence, export/restore, "last updated" honesty. Vault
  export/import exists — the ruling is *invest there next*, after this IA pass.
- **Album completion-over-time** (ChatGPT's mild dissent on dropping albums): if a longitudinal
  album-completion trend proves valuable, it could return as a small Profile item. Owner ruled
  variants-only for now; revisit only on evidence.
- **"Cards" vs "Collection" label** (ChatGPT suggested "Collection" reads as more player-centered):
  minor; keep "Cards" unless the showcase reframe makes it feel wrong in use.
- The pending **visual design session** (Full Holo / "purple, nothing wows") is still open and orthogonal
  to this IA wave.
