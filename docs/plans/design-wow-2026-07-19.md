# The Wow Arc — implementation plan (tracked)

**Created**: 2026-07-19, design session #3 (crew discipline)
**Status**: PLANNED — no implementation started; owner review gate passed for direction only
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
- [ ] New flagship surface inside Decks tab (route, not new tab): prompt pill ("Forge me a deck
      around …"), "Only my cards" + "Meta-aware" toggles.
- [ ] AI contract: structured 12-card deck output validated against card DB; unknown card names
      rejected with re-ask; **pool semantics via POOL_GROUPS** (see auto-memory
      `card-data-series-is-pool-index.md`) for any acquisition suggestions.
- [ ] "Only my cards" filters candidate pool to owned collection before the AI call (context
      injection), and post-validates ownership.
- [ ] Ceremony: staged card materialization into the deck (CSS, GPU-cheap, reduced-motion safe);
      gold reserved for synergy/reward accents; AI reasoning streamed as holo annotation chips
      (reuse streaming chunk reader shipped 2026-07-19).
- [ ] Forged deck lands in the existing deck store via the shared deck-upsert helper.
- Gates: forge round-trip on ≥2 providers; invalid-JSON/hallucinated-card path proven; deck
  persists and appears in Decks; offline degrades gracefully (feature gated on provider config).

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
