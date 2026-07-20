# Bugs Log

Track recurring bugs with solutions and prevention strategies.

## Format

```markdown
### YYYY-MM-DD - BUG-XXX: Brief Description
- **Issue**: What went wrong
- **Root Cause**: Why it happened
- **Solution**: How it was fixed
- **Prevention**: How to avoid it in the future
```

---

## Entries

### 2026-01-23 - BUG-002: Collection Import Shows 181/332 Cards as Owned
- **Issue**: Importing CollectionState.json showed only 181 cards owned when player actually has 332+
- **Root Cause**: Game stores `CardDefId` (e.g., "AntMan") but UI matched by `card.name` (e.g., "Ant Man") - 201 cards have mismatched names
- **Solution**: Added defId→name lookup in `parseCollection()` - converts CardDefId to display name using card database mapping
- **Prevention**: Always check if game data uses internal IDs vs display names; card-data.json includes both `name` and `defId` fields

### 2026-01-23 - BUG-003: Series Display Shows 6-10 Instead of 1-5
- **Issue**: Collection shows Series 6, 7, 8 which confuses players expecting Pool 1-5
- **Root Cause**: Untapped.gg card database uses internal series numbering (1-10) vs player-facing pools (1-5)
- **Solution**: Added `getSeriesDisplayName()` mapping and `poolStats` aggregation to show P1-P5 + Spotlight
- **Prevention**: When using third-party data sources, verify their taxonomy matches in-game terminology

### 2025-01-22 - BUG-001: AI Stats Access via getOwnedCards()
- **Issue**: AI advisor crashing when trying to access collection stats for context building
- **Root Cause**: `getOwnedCards()` returned array of names but AI context builder expected object with metadata
- **Solution**: Fixed in PR #26 - Updated stats access to use proper collection tracking methods
- **Prevention**: Add TypeScript interfaces for collection data structures; test AI context building with empty/partial collections

### 2026-07-19 - BUG-004: True Offline Cold Boot Renders Blank Page
- **Issue**: A true offline first load (no browser HTTP cache) rendered a blank page instead of the app
- **Root Cause**: `sw.js` fetch handler bailed on all cross-origin requests before caching (`if (url.origin !== location.origin) return;`), so the CDN runtime (React/ReactDOM/Babel/Tailwind) was never cached — only the evictable browser cache masked it
- **Solution**: SW now runtime-caches the CDN origins into a stable `snapapoulous-cdn-runtime` cache; CACHE_NAME bumped
- **Prevention**: Treat CDN script tags as part of the offline contract, not just same-origin assets — audit `sw.js` fetch handler scope whenever a new CDN dependency is added

### 2026-07-19 - BUG-005: qrcode CDN Bundle 404s
- **Issue**: QR vault sync broken in prod — pinned `qrcode@1.5.3/build/qrcode.min.js` 404s
- **Root Cause**: qrcode 1.5.x dropped the prebuilt standalone bundle from the CDN path (1.5.4 also 404s)
- **Solution**: Pinned to `qrcode@1.4.4`, the last version with a standalone build, verified 200
- **Prevention**: When pinning a CDN dependency version, verify the exact asset path resolves — don't assume the latest minor still ships the same build artifact

### 2026-07-19 - BUG-006: CARD_DATA_FALLBACK Diverged From card-data.json
- **Issue**: The embedded 57-card fallback list disagreed with the authoritative 433-card `card-data.json` on series, cost, power, and abilities; "Ant-Man" (hyphen) vs "Ant Man" broke exact-name lookups across the boundary
- **Root Cause**: Fallback was hand-authored early and never regenerated as `card-data.json` evolved
- **Solution**: Regenerated `CARD_DATA_FALLBACK` directly from `card-data.json` (57/57 matched); fixed Hulk power, Ant Man name+series, America Chavez cost
- **Prevention**: Fallback data should be generated from the authoritative source, never hand-maintained in parallel

### 2026-07-19 - BUG-007: "Refresh Game Data" No-Op for Spotlight Data
- **Issue**: The Refresh button requested `{cache:'reload'}` for spotlight data but still reported "Updated" even though nothing changed
- **Root Cause**: SW's stale-while-revalidate whitelist only covered card-data/persona/meta-context; spotlight-schedule.json fell through to the cache-first handler, which ignores the reload hint
- **Solution**: Added `spotlight-schedule.json` to the SW precache list and SWR whitelist
- **Prevention**: When adding a new data file to a refresh-on-demand UI action, add it to the SW's SWR whitelist in the same change — the two are coupled but live in different files

### 2026-07-19 - BUG-008: NavBar Active-Tab Indicator Race
- **Issue**: The sliding tab indicator sometimes rendered in the wrong position or direction
- **Root Cause**: Indicator position was computed via DOM measurement, racing against layout/paint timing
- **Solution**: Replaced DOM measurement with an index-based `calc()`; indicator hides when the active tab isn't in the nav row
- **Prevention**: Prefer derived/index-based positioning over `getBoundingClientRect()`-style DOM measurement for animated UI state that depends on render timing

### 2026-07-19 - BUG-009: DeckComparison cardLookup Stale After Card Data Refresh
- **Issue**: `DeckComparison`'s card lookup memo didn't update after card data refreshed
- **Root Cause**: The memo dependency array referenced the wrong casing of the version prop, so `cardDataVersion` changes weren't detected
- **Solution**: Fixed the dependency array to the correct `cardDataVersion` casing
- **Prevention**: When a component consumes a version/invalidation prop, verify the exact prop name and casing in the dependency array — a silent typo there produces a stale-memo bug with no error

### 2026-07-19 - BUG-010: Gemini OAuth Scope "Fix" WAS the Defect (RESOLVED INVERTED)
- **Issue**: The audit speculated `generative-language.retriever` might not authorize `generateContent` and changed the scope to bare `generative-language` (1dca663) — when finally deployed, that change BROKE working production OAuth immediately
- **Root Cause**: Reasoning from the scope's *name* about what it grants; the flagged "needs a live probe" gate was skipped before shipping; a day-long gap between commit and deploy hid the breakage
- **Solution**: Reverted to `.retriever` (ccf73e5). **Ground truth: `.retriever` DOES authorize `generateContent`. Never "correct" this scope again based on what its name implies.**
- **Prevention**: A finding marked "needs a live probe" must not ship its fix until the probe runs; never change a working production auth path on plausible-sounding reasoning absent a reproduced failure

### 2026-07-19 - BUG-011: snap_simulator_deck Persisted Empty String From Empty-State Mount
- **Issue**: If the Simulator was opened before any deck existed, `selectedDeckId` initialized to `''` and got written to `snap_simulator_deck`, sticking on `''` even after the user later created a deck
- **Root Cause**: The persistence effect wrote on every `selectedDeckId` change with no reconciliation against the live `decks` list
- **Solution**: Added a self-healing effect (S1) — if the persisted/initial id doesn't match any current deck, fall back to `decks[0].id`
- **Prevention**: Any id persisted from a list that can be empty at first mount needs a self-heal-on-mismatch effect, not just an initial-load default

### 2026-07-19 - BUG-012: Simulator Percentage Displays Mixed 0dp and 1dp
- **Issue**: Sim results displayed at 0 decimal places (e.g. "34%") while other panels/exact-math comparisons showed 1 or 2 decimal places (e.g. "33.3%", "25.23%") for the same kind of value, reading as a false gap between sim and exact
- **Root Cause**: Each results panel's `toFixed()` call was written independently without a shared formatting convention
- **Solution**: Standardized every percentage display in the simulator (Opening Hand, Draw by Turn heatmap, Curve/Brick sim + exact, Combo Finder sim + exact) to `toFixed(1)`
- **Prevention**: When multiple panels render the same metric type (sim vs. exact) side by side, fix the decimal precision once as a shared convention, not per-callsite

### 2026-07-19 - BUG-013: Folder Sync Discarded In-Game Deck Edits and Deletions
- **Issue**: Decks edited or deleted in the game never updated in the app; Profile tab also never refreshed after sync
- **Root Cause**: Append-only name-keyed merge kept the app's stale copy on edit and never removed deleted decks; Profile tab had no listener for the sync-update event
- **Solution**: Merge keyed by deck identity with in-game state winning, deletion propagation, and Profile subscribed to `snap-data-updated` (three slices, 2026-07-19/20 marathon)
- **Prevention**: A "sync" that only appends is not a sync — test edit and delete round-trips against the real game files, not just first import

### 2026-07-19 - BUG-014: card-data.json `series` Is a Pool Index, Not the Game's Series Tier
- **Issue**: 8 new frontier cards filed as `series: 5` (research said "Series 5", correct in game vocabulary) silently landed in Pool 2, skewing collection %, filters, buildability math, and AI acquisition advice
- **Root Cause**: Semantic collision — the schema's `series` field is a POOL INDEX (1-10) decoded by `POOL_GROUPS`; game "Series 5" = `series: 8`. Every type/schema gate passes because it's not a type error
- **Solution**: Corrected in d6e6b36; Horsemen re-verified as `series: 8` with API evidence; auto-memory `card-data-series-is-pool-index.md` written
- **Prevention**: Translate game-Series → pool index via POOL_GROUPS on every card add/edit, then gate on the per-index count delta before/after

### 2026-07-19 - BUG-015: Built-in Live Card Sync Was Broken End to End
- **Issue**: The in-app card sync silently degraded the card DB
- **Root Cause**: Dead primary API endpoint; fallback ingested junk without a released-filter; wrong series semantics; wholesale cache-replace at boot clobbered curated data
- **Solution**: 8f966ec — MSZ-only source, `status === 'released'` filter, real carddefids, merge-not-replace, poisoned-cache self-healing
- **Prevention**: Any auto-sync into curated data must merge (never replace), filter to released content, and be re-verified when its upstream API changes shape

### 2026-07-19 - BUG-016: Empty Streaming Placeholder Poisoned Claude Chat History
- **Issue**: (Caught pre-commit during the streaming-chat build) An empty assistant placeholder message created for streaming could get persisted into chat history, and Claude's API rejects empty assistant turns on the next request
- **Root Cause**: Placeholder-first streaming pattern without a guard for the zero-chunks failure path
- **Solution**: Guard added before commit; split-chunk torture gate added to the streaming test path
- **Prevention**: Any placeholder-then-fill pattern needs an explicit empty-on-failure cleanup path, verified by a torture test that forces zero/split chunks

### 2026-07-19 - BUG-017: Dead `poolStats['Pool 3']` Key After Pool Vocabulary Fix
- **Issue**: Pool display vocabulary change (Starter/Series 1-5/Spotlight) left a lookup reading the old `'Pool 3'` key one hop from the renamed map — silently undefined
- **Root Cause**: Key rename without sweeping all consumers
- **Solution**: Caught by haiku adversarial verification pre-commit; consumer updated (57ecb72)
- **Prevention**: Renaming map keys requires grepping every consumer of the map, not just the definition site

### 2026-07-19 - NOT-A-BUG: "Stale Rank" (76 vs 94) Was Stale Game Files
- **Issue**: App showed rank 76 while real rank was 94 — looked like a sync bug
- **Root Cause**: The linked game state files themselves were stale because the PC client hadn't been opened; the app faithfully showed what the files said
- **Solution**: Data-freshness hint ("Game data as of <mtime>") added near rank on Dashboard + Profile so a stale source is self-diagnosing
- **Prevention**: When app data disagrees with live reality, check the source files' mtimes before hunting an app bug

---

## Tips

- Focus on **recurring** bugs that waste time when re-encountered
- Include enough detail that someone (or an AI) can apply the fix without deep investigation
- The **Prevention** field is the most valuable - it turns bugs into lessons
- Keep entries concise (3-5 lines max)
- Archive bugs older than 6 months if no longer relevant
