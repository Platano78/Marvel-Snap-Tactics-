# The Wow Arc — implementation plan (tracked)

**Created**: 2026-07-19, design session #3 (crew discipline)
**Status**: IN FLIGHT — Phase 1 SHIPPED `2fe6a8e` + **owner-BLESSED (2026-07-20)**; Phase 2
SHIPPED (engine `b910b9b` + ceremony `92e1c06`, both three-track verified, live-proven on the
local model); Phase 3 dispatched 2026-07-20. Follow-on ticket: callLocal OpenAI-compat gap
(chat provider; found during 2a).
**Authority**: `docs/design-canon.md` → "The Wow Arc" section (owner rulings recorded there)
**Stitch references**: authority project `projects/12427902730037601641`; exports
`docs/stitch_designs/marvel_snap_mobile/concept_{vault_home,forge_flagship,companion_home}.html`

## Rulings this plan implements (do not re-litigate)

- Hypothesis CONFIRMED: restructure what screens ARE — cards as subject, not decoration.
- Compose all three concepts: Vault = Home, Forge = Decks flagship, Companion = Dashboard/History voice.
- Forge visual reference = "Cosmic Perspective" variant (owner's pick, `55dc866d…`).
- AI deck maker enters as a design pillar (flagship experience), built on the existing
  advisor infrastructure (6 streaming providers, persona, collection context, meta context).
- Sacred invariants hold: single `index.html`, CDN-only, no build step, mobile-first,
  design-canon rules 1-7 + Signature Layer.

## Phases (each = one crew slice: sonnet implement → haiku adversarial → orchestrator gates/diff → owner render review)

### Phase 1 — Vault Home
- [ ] Restructure Dashboard hero: full-bleed featured-card art hero (owned card, `getCardArtUrl`,
      onError fallback), rank + season progress as an orbital arc ON the card, not a stat row.
- [ ] "Your Arsenal" shelf: horizontal scroll of owned cards with per-card stat chips
      (win rate when played / cubes earned — reuse existing per-card match aggregation).
- [ ] Single "Ask Snapapoulous" pill routes to advisor.
- [ ] Consume `concept_vault_home.html` tokens/structure; keep existing quick-match entry reachable.
- Gates: app boots offline, no console errors, Lighthouse a11y not worse, reduced-motion safe.

### Phase 2 — The Forge (AI deck maker flagship)

Split into two slices (2026-07-19 orchestrator spec, post-recon). Amendment to the original
sketch: the Forge calls providers **buffered (no onChunk)** — a strict-JSON contract streamed in
fragments is parse-fragile; the ceremony stages its reveals from the *parsed* result instead
(visually identical, structurally robust).

**Slice 2a — Forge engine (function first):**
- [ ] Forge lives INSIDE the Decks component as a third `view` ('forge'), entered from a Forge
      button on the deck-list header — uses the existing `decks`/`setDecks` + save semantics.
- [ ] Prompt pill + toggles: "Only my cards" (default ON), "Meta-aware" (default ON).
- [ ] AI contract: system prompt demands STRICT JSON `{name, cards[12], reasoning:[{card,note}],
      synergies:[[a,b]…]}`; candidate pool injected as compact "Name (cost)" lines (owned-only
      when toggle ON); meta context (topArchetypes/tierList) injected when Meta-aware ON.
- [ ] Validation: strip fences → parse → resolve each card case-insensitively against the card DB
      → exactly 12 unique + ownership check (when toggle ON). One automatic corrective re-ask on
      violation; second failure surfaces the invalid list and opens the valid subset in the
      manual deck builder. Acquisition vocabulary via SERIES_TO_POOL (never raw pool indices).
- [ ] Buffered provider calls via the existing per-provider functions (no onChunk); reuse the
      chat's no-empty-placeholder failure discipline (BUG-016).
- [ ] Save → existing deck shape `{id,name,cards,createdAt,updatedAt}` via Decks' own state path.
- Gates: LIVE forge round-trip against the always-on local model (:8084, OpenAI-compatible `local`
  provider — no API keys needed); hallucinated-card + invalid-JSON paths proven by fetch
  monkey-patch; deck persists into snap_decks and renders in My Decks; unconfigured-provider
  path shows the standard error.

**Slice 2b — Forge ceremony (after 2a verified):**
- [ ] Visual layer per `concept_forge_flagship.html` ("Cosmic Perspective", owner's pick): hero
      card materializing in gold-glow frame, deck carousel, staged card reveals (CSS stagger,
      GPU-cheap, `prefers-reduced-motion` collapses to instant), reasoning as purple holo
      annotation chips revealed in sequence, gold reserved for synergy threads/reward.
- [ ] No continuous ambient animation; named-property transitions with `--ease-snap` only.
- Gates: renders at 360/390/768 without page overflow; reduced-motion collapse verified; console
  clean; ceremony driven entirely from the parsed result (no stream coupling).

### Phase 3 — Companion voice
- [ ] Dashboard headline: conversational summary line computed locally (net cubes today, best
      deck) — template-based, AI-optional enhancement later.
- [ ] Match feed: annotated rows (opponent key card art, cube result, one-line remark) — remarks
      template-based from match facts (snapped/turn/streak), AI-optional.
- [ ] Momentum ribbon: cube-streak thread along the feed (SVG/CSS, reduced-motion safe).
- [ ] Stats-in-sentences discipline on Dashboard/History; panel grids demoted, not deleted
      (Analytics keeps its tables — it is the power surface).
- Gates: works with zero AI configured (templates only), no regression to match logging.

## Sequencing & risks

- One implementing agent per repo per slice; owner render review after every phase.
- Phase 2 is the largest and depends on nothing in Phase 1 — can lead if owner prefers.
- Risk: AI deck output quality varies by provider — mitigation is the validation contract, not
  prompt faith. Risk: hero-art licensing is same-source as existing card art (no new exposure).
