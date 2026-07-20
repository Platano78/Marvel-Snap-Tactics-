# Adoption Wave — competitive-research features (tracked plan)

**Created**: 2026-07-20 (crew session; research provenance: `docs/research/competitive-positioning-2026-07-20.md`)
**Status**: PLANNED — owner rulings collected, zero implementation started
**Owner rulings (2026-07-20, do not re-litigate)**:
- Priority = data-ready first: MVP view → Cosmetics → Matchup grid → Completion cost → Recap recon.
- Matchup grid's opponent-archetype capture = optional chip row on quick-match (skippable, never
  blocks the fast log; ungraded old matches simply excluded from the grid — honest gap).
- Per-card MVP view lives in the Analytics tab.
**Standing law**: single index.html / CDN-only / no build; design canon (`docs/design-canon.md`)
binds; every slice = sonnet implement → haiku adversarial → orchestrator gates/diff → commit by
orchestrator only; SW CACHE_NAME bump on every index.html-changing deploy (learned 2026-07-20).
**Sequencing (owner ruling 2026-07-20): Phase 0 is a HARD GATE — no adoption slice starts
until it closes.**

## Phase 0 — QA stabilization gate (blocks Slices 1-5)

The 2026-07-20 full-app crawl (4 QA quadrants + a11y specialist audit + mandated code review)
must be fully worked off first. The crawl IS the foundation for the additional features — new
surfaces get built on verified ground, and each new slice inherits the crawl's fixture library
and gates.

- [ ] All six reports collected (Q1 home/data ✅in-flight, Q2 cards ✅in-flight, Q3 decks
      ✅in-flight, Q4 ai/meta/system ✅in-flight, a11y audit ✅DELIVERED, session code review
      ✅DELIVERED).
- [ ] Known defects already registered from the delivered reports:
      - HIGH (code review): snap_card_performance keyed by raw CardDefId vs display-name reads —
        hero/Arsenal/Analytics silently degraded on real synced data. Fix slice IN FLIGHT
        (write-time resolution + real-write-path gate).
      - MEDIUM (code review): Forge 'local' path lacked callLocal's dual-format fallback —
        folded into the same fix slice.
      - CRITICAL (a11y): nav tabs' aria-controls reference nonexistent panels (pre-existing,
        global); Forge primary CTAs 3.22:1 contrast (text token misused as bg).
      - SERIOUS (a11y): momentum ribbon has no screen-reader equivalent; History rows'
        aria-label override hides remark/deck/snap content.
      - MODERATE/MINOR (a11y): silent forge status transitions (needs aria-live), season sweep
        visual-only, forge carousel not keyboard-traversable, user-scalable=no, "Forge a counter
        deck" pill lands on Decks list not the Forge (needs view deep-link), 9px reasoning
        chips, toggle-chip target size, focus loss on forge transitions.
- [ ] Consolidated triage WITH OWNER: one ranked list, owner rules severity/skip per item.
- [ ] Fix waves executed under full crew discipline (three-track per slice; SW CACHE_NAME bump
      on every index.html deploy).
- [ ] Re-verification: each fixed area re-crawled (targeted, using the quadrant fixtures) before
      Phase 0 closes.
- [ ] Fixture library from the QA reports preserved (the Q1 agent's derived storage shapes) and
      REUSED as the seed corpus for every adoption-slice gate below — and every new slice's spec
      must include a crawl-grade gate: click every new control, verify every displayed number
      against the fixture, empty-state pass, console pass, width pass.

## Slice 1 — Per-card MVP view (Analytics tab)
Data: ready (`snap_card_performance` = `{cards: {[name]: {netCubes}}, importedAt}` + collection).
- [ ] Sortable table/section in Analytics (CardPerformanceView region): card art thumb + name +
      net cubes, sort by netCubes desc default (asc toggle), owned-only filter toggle, count cap
      with "show all". Reuse getCardArtUrl + onError fallback; tabular-nums; emerald/red on +/-.
- [ ] Empty state when no perf data (folder sync never run) — card-art empty state, no barren panel.
- Gates: math spot-check vs seeded fixture; console clean; 360/768 widths; empty state.

## Slice 2 — Cosmetics tab
Data: RECON FIRST — parseCollectionEnhanced captured OwnedAvatars/OwnedTitles/CardBacks/AllAlbumData
per the Feb 28 audit, but `snap_collection_enhanced` may store only COUNTS. If lists aren't
persisted, extend the parser to store them (folder-sync slice) before the view.
- [ ] View under Settings "More Features" grid (route pattern like Hall of Armor): sections per
      category (Avatars / Titles / Card Backs / Albums) with counts + galleries where lists exist.
- [ ] Album completion states from AllAlbumData if shape supports it (recon decides; honest-gap
      any category the data can't back — omit, don't fake).
- Gates: seeded-fixture render per category; empty state; console; widths.

## Slice 3 — Matchup grid (two sub-slices, sequential)
- [ ] 3a Logging capture: optional archetype chip row on quick-match (chips = current
      META_CONTEXT.tierList names + "Other"; single-select, skippable, one tap, appears after a
      cube button is pressed without blocking; stores `opponentArchetype` on the match record).
      Also add the same tagging affordance on History rows (post-hoc tagging, same field).
- [ ] 3b Grid view (History or Analytics — decide at spec time by space): pivot MY deck ×
      opponentArchetype → win rate + net cubes + n; minimum n=3 per cell to render a number
      (below that show n only, no percentage — small-sample honesty); untagged matches excluded,
      with a visible "N untagged" note.
- Gates: fixture with known distribution → hand-computed cell values match; skip-path leaves
  quick-log latency unchanged; old records without the field never crash.

## Slice 4 — Series completion-cost projection
- [ ] RESEARCH GATE first (small, 2-source): current acquisition economics — collector-token
      prices per series/spotlight era, key costs. If sources conflict or era is in flux, record
      honest ranges.
- [ ] View: per pool (game vocabulary via SERIES_TO_POOL, never raw index): missing-card count ×
      researched cost → tokens/keys needed; surface beside Collection pool breakdown.
- Gates: math vs hand-computed fixture; research citations recorded in the commit.

## Slice 5 — Match recap in Companion feed (RECON GATE — may be infeasible)
Feb 28 audit ground truth: GameState.json played-cards arrays are EMPTY post-game. 
- [ ] Recon: re-probe the real state files (GameState/PlayState/ProfileState) for any per-location
      final scores or last-match summary. If nothing: this slice DIES — record the finding and
      close it; do NOT build a fake recap from manual logs.
- [ ] Only if data exists: one recap line per synced match in the Companion feed (location scores),
      template-voiced like the existing remarks.

## Explicitly not chased (architecture can't win — research verdict, owner-endorsed)
Live in-match overlay; population-scale own-data meta stats; zero-touch match capture.
