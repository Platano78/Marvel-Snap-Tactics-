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

- [x] All six reports collected (2026-07-20): Q1 home/data (static-trace; live re-crawl owed —
      see below), Q2 cards, Q3 decks, Q4 ai/meta/system, a11y audit, session code review.
- [x] Consolidated triage ruled by owner (2026-07-20): **P0 fixed immediately in-session;
      P1-P3 executed by the next session off this list.**

### CONSOLIDATED TRIAGE (all six reports, owner-ruled 2026-07-20)

**FIXED IN-SESSION (2026-07-20):**
- HIGH (code review): snap_card_performance defId-vs-display-name key mismatch → fixed b3aaf15
  (write-time resolution; + Forge local unification + dead CSS hook).
- P0-1 HIGH (Q4): "Export Full Vault" → import silently loses collection — handleImport sets
  React state then dispatches snap-data-updated synchronously; listener re-reads STALE
  localStorage and clobbers. Fix slice in flight (write-through before dispatch + listener
  stale-clobber sweep). Repro: seed → export → clear → import → collection empty.
- P0-2 MED-HIGH (Q2): Database series filter under-filters grouped pools (Starter 13/26,
  Spotlight 1/6) — chip builder keeps first raw id only; rebuild on POOL_GROUPS like the
  Collection tab (~6802-6806). Fix in same slice. Also fixes wrong chip order.

### EXECUTION LOG (2026-07-20 evening session — crew, three-track per slice)

- [x] **P1 — a11y criticals** → `3b6f990`. Owner ruled: DROP the tab pattern (not fabricate
      tabpanels) — the nav is a bottom app-bar, `role="tablist"` was nested inside
      `role="navigation"`, and primaryTabs has 5 entries vs 10 live routes so a tabset cannot
      represent the route space. Owner also ruled contrast scope = the whole CLASS, not the
      symptom: recon found the 3.22:1 defect on **22** text-bearing controls app-wide, not the 5
      Forge CTAs the triage named. Swapped to `bg-cosmic-purple` = 4.82:1 (verified
      programmatically). 9 decorative/large-text instances deliberately left at 3.22:1 — they
      need only 3:1. Confirmed `cosmic-purple` exists in the Tailwind config, else every gate
      would pass while the fix rendered nothing.
- [x] **P2a — a11y trio** → `44f27da`. Momentum ribbon SR text (memo extended to return
      netCubes/wins/losses; sr-only span placed as a SIBLING of the aria-hidden div — nesting it
      inside would pass every grep while being silently unreadable). History row aria-label now
      appends deck/snap/notes. Forge got a PERSISTENT sr-only `role="status"` live region outside
      every status conditional (a region that mounts with its content is typically not announced).
      `getMatchRemark`'s generated flavor text deliberately NOT announced — it restates fields the
      label already carries.
- [x] **P2b — AbortController timeout + cancel** → `0927fdd`. Was zero AbortController in the
      file. **Four instances of one root confusion** ("connect timeout" vs "total timeout") found
      only AFTER the first implementation passed every gate: (1) callLocal keyed its abort
      short-circuit on error NAME, so an inner timeout was misread as a user cancel and killed the
      Ollama→OpenAI-compat fallback, breaking LM Studio/vLLM; (2) buffered/Forge calls inherited
      the 20s connect timer as a hard TOTAL timeout — they generate fully before sending headers,
      so it would have failed deck generation that previously ran unbounded; (3) streaming kept
      the 20s timer armed until the first chunk, killing slow local prefill; (4) the `/v1` branch
      wrapped timeouts into a plain Error, destroying the name callers branch on.
      Final semantics: 20s to headers → 45s to first chunk → 45s between chunks → 180s for
      buffered → no total cap ever. Proven by three Node harnesses over the REAL extracted source.
      **Process note:** defects 1+2 were caught only after escalating the adversarial pass from
      haiku to sonnet — haiku had returned "clean, zero defects" on this class of work twice.
      Defect 3 was the orchestrator re-reading its own spec. Defect 2 was a SPEC error, not an
      implementation error. Known gaps left: Forge has signal/timeoutMs plumbed but no cancel UI
      (it does get the 180s timeout); testConnection can't say which local wire-format timed out.
- [x] **P2c — art slug + fallbacks + Forge deep-link** → `4b5b04a`. Diacritic strip verified
      against the LIVE CDN: `araa.webp`=404, `arana.webp`=200, so NFD-strip is provably right and
      needs no SLUG_OVERRIDES; "Araña" is the only non-ASCII card. Both art seams had a DEAD
      fallback branch (`artUrl ? :` never falls through — getCardArtUrl always returns truthy);
      converted to `<img onError>` + artFailed state, extracting `DatabaseCardTile` for per-tile
      state. Deep-link carried a RACE the triage missed: `Decks` is conditionally rendered so it
      mounts AFTER the tab switch — a second event would fire before its listener exists. Fixed
      via App-held state passed as a PROP (exists before the child mounts), `handleSetTab` made
      polymorphic to preserve the other 17 bare-string dispatch sites. **Race-freedom depends on
      React 18 + `createRoot` batching both setters into one render — under legacy
      `ReactDOM.render` a native listener wouldn't batch and the fix would silently no-op.**
      (Dispatch-site baseline is 18, not 19 — the orchestrator's original count wrongly included
      the addEventListener/removeEventListener lines.)

- [x] **P3 — polish tail (all 4 bundles)** → `aa0afc0`. Located by content (numbers had
      shifted ~500 lines). A: viewport pinch-zoom unblocked; Forge carousel tiles keyboard-
      reachable (ArsenalTile passive pattern); hero card shows the gold synergy ring (`inSynergy`
      was computed then discarded in the isHero branch); focus management added on Forge
      state transitions (file had ZERO `.focus()` — ref+effect on `[forgeStatus]` moves focus
      to result/error container). B: Dashboard completionPercent gains the totalCards>0 guard
      Profile already had; CardPerformanceView `performanceData?.cards ?` (corrupt localStorage
      without `.cards` no longer throws; else=[]). C: "Import from URL" demoted to genuinely
      `disabled` + "Coming soon" chip. **C2 and C3 DROPPED as corrected premises** — C2's
      Dormammu/Scream shared videoUrl is ONE legit weekly video (Coccia #192) covering both
      decks per their own notes fields, not a copy-paste bug; C3's mid-stream "unreachable" was
      already fixed by P2b (`0927fdd`) — catch block keeps partial content and says "cut off".
      D: fake 65% season-sweep fallback → 0 (faint track only); 9px title-only reasoning chips →
      11px wrapping; three 36px Forge touch targets → 44px; 21 form fields given matching
      id/name (loop-rendered fields use prop-derived template ids — no dup ids); Collection
      search clears on view-mode switch. **Verification**: sonnet implement → orchestrator
      independent gate re-run + diff-read of every semantic seam (A4 effect deps, A3 ternary,
      B2 both branches, D4 uniqueness, C1 disabled) + implementer Babel parse clean. Execution
      track = the Q1 live crawl below (gates the held push).

**PHASE 0 STATUS: P1 + P2 + P3 COMPLETE. Remaining: Q1 live re-crawl, close-out.**
**sw.js CACHE_NAME is now `v14` — next index.html-deploying commit bumps to v15.**

**VERIFICATION LESSON (carry forward, cost two HIGH defects to learn):** haiku is NOT sufficient
for the adversarial track on anything semantic. It returned "clean, zero defects" on P2a and would
have on P2b; a sonnet adversary that extracted the real functions into Node harnesses and EXECUTED
them found two HIGH defects in code that had passed every gate. Use haiku only for mechanical
checks (P1's token swap); use sonnet for anything requiring execution or real reasoning, and demand
verbatim command output — reject any "clean" verdict that ships without it.
- [x] **P3 — polish tail. OWNER RULED 2026-07-20: implement ALL FOUR bundles, nothing skipped.**
      → landed `aa0afc0` (see execution log above; C2/C3 dropped as corrected premises).

**P1 — a11y criticals (next session):**
- Nav tabs aria-controls → nonexistent `panel-*` ids, no tabpanels exist (index.html:4643,
  Lighthouse-confirmed critical). Either add real panel ids/roles or drop the tab pattern.
- Forge primary CTAs `bg-cosmic-purple-text text-white` = 3.22:1 (text token misused as bg):
  "Save to My Decks" ~8335, "Try Again" ~8242, "Import from Code" ~8364, builder-save ~8133,
  "Configure AI Provider". Swap bg to --cosmic-purple (#ad2bee) and re-verify ≥4.5:1.

**P2 — serious/moderate (next session):**
- Momentum ribbon SR-invisible (~5183): add visually-hidden trend summary or aria-label.
- History rows' aria-label override hides remark/deck/snap from AT (~5490): append to label or
  use aria-describedby. (Dashboard feed reads fine — inconsistent pair.)
- No AbortController/timeout on ANY provider call (Q4): Test Connection hangs forever on
  unresponsive endpoints; Advisor has no Stop control and isLoading locks input. Add timeout +
  cancel affordance.
- Art slug builder strips diacritics ("Araña" → araa.webp 404, index.html:~1737); Database tiles
  + CardDetail hero use background-image with NO fallback path (dead fallback branch since
  getCardArtUrl is always truthy) — transliterate (ñ→n etc.) or SLUG_OVERRIDES, and add real
  onError fallbacks matching the Collection tab's working pattern.
- Forge status transitions silent to AT (~8216): add aria-live/role=status (pattern exists at
  the toast region ~9585).
- "Forge a counter deck" reply pill lands on Decks LIST, not the Forge (~5244): needs a
  forge-view deep-link (setActiveTab payload or event the Decks component consumes).

**P3 — polish tail (next session, owner may skip items):**
- user-scalable=no viewport meta (blocks pinch zoom, WCAG 1.4.4).
- Forge carousel tiles not keyboard-traversable (no tabIndex — ArsenalTile has the right
  pattern); hero card can't show its synergy gold ring (isHero branch excludes it, Q3).
- Season-sweep arc value visual-only; 9px reasoning chips + title-only full text; toggle chips
  36px vs 44px best practice; likely focus loss on forge state transitions.
- Duplicate videoUrl: creator-decks.json Dormammu vs Scream (both t_vrJXXJZGM) — find correct
  Scream URL or drop it.
- "Import from URL" is a permanent no-op stub styled as functional (~7788) — label "coming
  soon" or remove.
- Q1 defensive gaps: Dashboard completionPercent lacks totalCards>0 guard (~4733, Profile's
  ~11539 has it); CardPerformanceView unguarded Object.entries(performanceData.cards) (~9949).
- Form fields lack id/name (16 inputs, recurring lint); Database chip order (fixed by P0-2);
  mid-stream error says "unreachable" after content arrived (~3088); Collection search state
  persists across view-mode switches (probably fine — owner call).
- SPEC-GAP note (not a defect): CLAUDE.md's "Mark all Series 1 owned" bulk action never
  shipped (deliberate simplification, flagged for awareness).

**Q1 LIVE RE-CRAWL owed**: qa-home completed Q1 by static trace only (browser contention);
live click-through pass (screenshots, Quick Match append propagation, console-after-nav,
empty-state render, freshness show/hide, Arsenal re-render) must be re-run SERIALIZED.
Fixture corpus: scratchpad `qa-fixtures.js` (node --check clean, all 14 keys, port-guard
built in) — but scratchpad is session-scoped; next session should copy it into the repo under
`docs/qa/` first (or regenerate from Q1's shapes documented in its header).
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
