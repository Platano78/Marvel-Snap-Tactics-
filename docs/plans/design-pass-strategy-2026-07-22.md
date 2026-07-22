# Design Pass — Strategy & Plan — 2026-07-22

**Status:** strategy locked, awaiting owner greenlight for Phase 1.
**Provenance:** orchestrator recon + `/context` (QMD + Faulkner) + **council 3/3 (gemini/groq-llama/MiniMax2, unanimous)** + Stitch inventory. The IA-v2 wave (D1–D6 + fixes) is DONE and is the structural substrate this pass reskins — no IA changes here.

---

## 1. The confirmed diagnosis (owner hypothesis → council 3/3 agree)

**"Purple, nothing wows" is a STRUCTURAL problem, not a color problem.** The cosmic-purple + Full-Holo look is a *skin on a generic CRUD/dashboard skeleton*. All three council backends independently reached the same verdict and **confirm the owner's standing hypothesis** ("Full Holo added texture to a structurally generic dashboard") — the hypothesis is CONFIRMED, not killed. Reskinning the palette again would be the exact micro-polish trap prior sessions flagged as token-waste (`feedback_redesign_skill`).

**The one signature move (unanimous): Panelization of Data — Dashboard → Storyboard / "Field Report."**
Stop treating the UI as boxes-of-stats. Treat each screen as **comic panels**: variable-width, heavy inked borders, splash-panel hierarchy (the hero datum is the biggest panel), bleed/overflow when a value is dramatic. This changes *layout and identity simultaneously* with no new React components — it's a CSS-variable + wrapper-class job in the single file.

---

## 2. Grounding inputs (do not re-derive)

- **Owner pre-scope** (Faulkner, 2026-07-20 marathon close): *"Next session is the DESIGN SESSION: Stitch-mockup-review-first, 2-3 bold divergent concepts before implementation; standing hypothesis to confirm/kill — Full Holo added texture to a structurally generic dashboard."*
- **Distinctiveness preference** (cross-project memory): distinctiveness = **a signature visual motif carried across every section**, not "clean design." A layout-correct Stitch mockup can still read as AI-generic — the motif is what escapes that.
- **Anti-pattern**: `/redesign-skill` on an already-polished app yields only micro-polish (font swap, shadow tint) that burns tokens with no visible impact — **not** our tool here.
- **Constraints (hard)**: single `index.html`, React/Tailwind via CDN, **no build step**, mobile-first, offline. → identity must be swappable via **CSS variables** (`--panel-border`, `--panel-gutter`, `--accent-glow`, `--ink-weight`).
- **Product thesis (the lens)**: surface the player's PRIVATE longitudinal data the game hides (per-card cubes, mastery, snap/retreat rates, sync deltas). The design job: make that hidden data feel like a **power-up**, not a math problem.

### Stitch — what's already "ready done" (2 projects)
| Project | Updated | Device | Theme | Meaning |
|---|---|---|---|---|
| **Marvel Snap** | 2026-07-20 | MOBILE, 11 screens | DARK · `#ad2bee` · Spline Sans · round-full | The **current** cosmic-purple baseline — the mockups the shipped look came from ("nothing wows"). Our before/baseline. |
| **Snapapoulous Prime Dashboard** | 2026-04-13 | DESKTOP, 10 screens | LIGHT · `#ed1d23` (Marvel RED) · Space Grotesk · round-4 | The **original** Marvel-comic-RED direction (matches CLAUDE.md canon), later abandoned for purple. A live reference for a red-comic concept. |

---

## 3. Council-converged design system (applies *under* whichever concept wins)

- **Type — dual-weight**: heavy condensed all-caps for hero labels/stats (Archivo Black / Bebas Neue class); **monospace for the private data** (cubes, deltas) → a "classified dossier / intel" feel; clean sans (Inter/current Spline) for body.
- **Grid → panels**: abandon the uniform 12-col rhythm. **Heavy inked borders (3–4px)** define panels; asymmetric widths; **bleed** — a dramatic Sync Delta *overflows* its panel edge.
- **Color**: demote purple from primary FILL to **accent/glow**; move base to high-contrast **noir** (deep black / slate). Introduce ONE **"POW" alert color** (heroic red or danger yellow) reserved for high-magnitude private-data deltas — a comic "warning/impact" language.
- **Halftone**: texture ONLY (≤5% wash behind panels/holo cards). **Never on data** — it muddies numbers.
- **Motion — "Snap"** (on-brand pun): hard cuts + page-turn slides + slight spring overshoot; card detail **pops** to foreground, doesn't fade. No lazy corporate fades.

---

## 4. The 3 divergent concepts (mock in Stitch, stress-tested on Card Detail)

All three share the **same panelization skeleton + demoted-purple + POW alert + Snap motion**; they diverge on **identity/skin only** (so the owner compares identity, not content):

- **A — "Field Report" (Noir / Secret Files)** · council's favored (easiest CSS, strongest identity break). Mono type, redacted/stat bars, "classified dossier" chrome, black+slate with purple/POW accents. Frames private data as recovered intel.
- **B — "Splash Page" (Literal Comic / Action Spread)** · max energy. Bold primaries (option to revive Marvel **RED** from the Apr project), thick ink borders, halftone wash, stats in action/"POW" bubbles. Frames mastery as a hero's journey.
- **C — "Tactical HUD" (Stark-Tech)** · modern/utility. Geometric, power-bar viz, live-feed sync deltas, minimal comic fluff. Frames the app as a mission console.

**Stress test = the winner is the one where a Sync Delta / Mastery reads in < 0.5s**, not the one that looks coolest.

---

## 5. Tool pipeline (each named tool gets a role)

| Phase | Tool | Role |
|---|---|---|
| 0 recon | `/context` + **council** | ✅ DONE — confirmed diagnosis + signature move + system (this doc). |
| 1 diverge | **Stitch** | Review the 2 existing projects; generate the 3 concept mockups on **Card Detail + Home** (`create_design_system` per concept → `generate_variants`). |
| 1 critique | **ChatGPT** (`/codex` reason / adversarial) | Source-verified adversarial critique of the 3 *concrete* concepts: which reads fastest, which is a noise-trap, which is most ownable. (Critique concrete mockups, not abstract strategy.) |
| 2 systematize | **frontend-design-pipeline** + **ui-ux-pro-max** + **ui-pipeline** | Translate the chosen concept into a real CSS-variable design system + panel primitives, Stitch→code **without losing character**. |
| 3 implement | **crew** | Ship it as slices (sonnet implement → haiku adversarial verify → orchestrator commit + sw bump), exactly like the IA wave. |

---

## 6. Sequence & slices (Phase 3, crew)

Reskin order = highest-complexity/stress-test screen first, then per tab:
1. **Card Detail showcase** (the stress test — panelize the "Your Card" data blocks first).
2. **Home** (dashboard → storyboard hero panel).
3. **Cards** (grid → gallery panels; Browse/Mastery).
4. **Decks** (deck cards → panels; Consistency + Creators banner).
5. **Advisor** (chat + matchup banner).
6. **More/Settings** + global motion/halftone/POW-alert polish pass.

Each slice: apply design tokens → panelize layout → Snap motion → verify 3 ways → commit (sw bump each). CSS variables mean the "identity" lives in `:root`, so a concept can still be tuned globally after Phase 2.

---

## 7. How we present the choice to the owner ("presenting this")

- Deliver the **3 concepts side-by-side on the SAME screen (Card Detail)** — screenshots from Stitch, or one comparison artifact — so the decision is about *identity*, not content.
- Single decision prompt: **"Which one makes the hidden data feel like a power-up, not a math problem?"**
- Orchestrator recommendation to beat: **Field Report (A)** — council 2/3 named it (cheapest CSS, biggest identity shift) — but the owner picks.

---

## 8. Framing decisions — LOCKED (owner, 2026-07-22)

1. **Palette lane** → **Purple stays, add red as B.** Concepts **A (Field Report)** and **C (Tactical HUD)** stay in the cosmic-purple/noir family; concept **B (Splash Page)** revives Marvel **RED** (`#ED1D24`, the Apr comic direction). Divergence directly pits purple-noir vs red-comic.
2. **Pilot scope** → **Card Detail + Home pilot.** Phase 1 mocks the 3 concepts on **Card Detail + Home only**; pick a winner; implement those two first as the proof; THEN roll the chosen CSS-variable system across Cards → Decks → Advisor → More.

## 9. Phase 1 kickoff (decision-complete — next action)

Generate 3 concept mockups in **Stitch**, each on **Card Detail + Home**, sharing the panelization skeleton (§3) and diverging only on identity (§4), palettes per §8.1:
- Concept A "Field Report": DARK noir + purple accent, mono private-data, redacted/stat bars, dossier chrome.
- Concept B "Splash Page": Marvel RED base, heavy ink borders, halftone wash, action/POW stat bubbles.
- Concept C "Tactical HUD": DARK + purple accent, geometric power-bar viz, live-feed sync deltas.
Then: ChatGPT adversarial critique (which reads a Sync Delta fastest / most ownable / noise-trap) → present 3-up on Card Detail → owner picks → Phase 2 (systematize the winner into CSS-variable tokens) → Phase 3 crew slices (Card Detail first).

## 10. Phase 1 RESULT — pick LOCKED (owner, 2026-07-22)

**Winner: A "Field Report" base identity + B "Splash Page" energy ("A's soul, B's energy").**

- **Executed:** Stitch project "Snap — Design Pass Concepts" (`projects/6159647980375162328`), 3 design systems (A `assets/7861476939588740308`, B `assets/16544935332947469040`, C `assets/7715685138557257106`), 6 screens rendered (Gemini 3 Pro) on Card Detail + Home, grounded in real `Your Card` / `Since Last Sync` data. First pass read too conservative → owner note "be bold, flashy, have fun" → regenerated bolder v2s of all 3 Card Details + C-Home. 3-up board artifact delivered.
- **Winning screen IDs** (project `6159647980375162328`): A CardDetail `bb7dbc86fb62445a94f4068a39e20b2c`, A Home `e93519860bfa4a0d96bc4d271c82f29c`; B CardDetail `04c74a07f60f4b8ca8e7567ce5b21906`, B Home `4e906aef7bb1468e9ee404c6f3019ac0`; C CardDetail `b73fb863042842efa19ceab86964393e`, C Home `e3c654e3aec14bafa05d3f7c83ba897f`.
- **Adversarial critique (ChatGPT):** A won all three tests — fastest exact-number read, most ownable (declassify-the-hidden-record = the moat), cleanest signal/noise. B's POW! starburst = highest noise risk (container out-shouts the number); C = generic-AI-dashboard risk. Recommendation was A; **owner chose A-base but explicitly wants B's fun dialed up** — resolves the standing "A is important-but-not-fun" objection.
- **Phase 2 mandate (the systematize step):** translate A "Field Report" into the CSS-variable design system + panel primitives (`--panel-border`, `--panel-gutter`, `--accent-glow`, `--ink-weight`, noir base, purple demoted to accent, amber #FFC107 as the single POW alert, Space-Mono private-data numerals, Anton/condensed hero labels). **The differentiator vs. plain-A:** engineer a **rationed "reveal moment"** at sync time (redaction bars break open → amber hero number punches past its panel → stamp impact → settles to clean static read) so the dossier lands as a *triumph*, not paperwork. Borrow B's exuberance as a ≤1s event, NOT permanent decoration. Motion honors `prefers-reduced-motion`.
- **Phase 3:** crew slices, Card Detail first (§6 order), sw CACHE_NAME bump per slice (currently `snapapoulous-stitch-v42`).

## 11. Phase 2 RESULT — "Field Report · Splash Edition" (2026-07-22)

Systematized as a **live real-CSS prototype** (artifact `68d24a47-44f7-44fd-8ecb-5ac8a9f11bb8`; source `scratchpad/fr-proto-v1.tpl.html`). Two owner calls after v0:
- **Colour pivot → "Bright splash paper" (owner liked B's palette):** noir base DROPPED. Final skin = bright comic paper `#fffdf7`, white panels, 3px black ink borders + hard 4px offset shadow, ≤5% halftone; **Marvel red/blue/gold**. **Flips the app default surface dark→LIGHT** (real product change, Phase 3).
- **Kept from A ("A's soul, B's skin"):** dossier data framing (Space-Mono numbers, case-file panels, file-tab headers) + the **rationed reveal** (ink censor wipe → hero number punch + gold POW burst → `DECLASSIFIED`/`SYNCED` stamp → fades; no wallpaper). Space Mono owns every private number.
- **Colour logic = POW threshold gate (confirmed):** RED = high-mag cube swings only · GOLD = milestones · BLUE = accent/nav · INK = ordinary values (no traffic-light). Stamp wording kept.
- **Tokens for Phase 3:** paste the `--fr-*` block + primitives (`.fr-panel`, `.fr-panel--splash`, `.fr-hero`, `.fr-burst`, `.fr-reveal/.redact/.fr-stamp`) as a Layer-2.5 skin onto the 4-layer `:root`; reuse `--ease-snap` + `prefers-reduced-motion`/`data-motion`/`data-perf` gates; reveal fires on `snap-data-updated`. Add Anton + Space Mono to the Google-Fonts `<link>`; body stays Spline Sans.
