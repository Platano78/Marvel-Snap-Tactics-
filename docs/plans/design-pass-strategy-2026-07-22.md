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
