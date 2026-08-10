<!-- crew plan artifact -->
<details>
<summary>metadata</summary>

- created: 2026-08-10
- modified: [2026-08-10]
- commits: []
- orchestrator-session: 9e3418f4
- implementer-agents: []
- verifier-agents: []
- back-refs: [docs/plans/ia-v2-cards-showcase-2026-07-22.md ("Data gravity — single biggest risk", deferred), docs/plans/auto-match-capture-2026-08-10.md (Slice B, which multiplied write volume ~10x), docs/project_notes/decisions.md ADR-001]
- forward-refs: []
- status: spec

</details>

# Slice D — Persistence hardening (+ two loose ends)

## Purpose / Problem / Solution

**Problem.** This is a no-backend PWA: `localStorage` IS the database, with a cap around 5 MB
shared across every key. The IA-v2 plan already filed this as *"Data gravity — ChatGPT's single
biggest risk"* on 2026-07-22 with the ruling "invest there next, after this IA pass." The IA
pass finished; this never happened. Slice B (`2c8b4b5`) then multiplied write volume roughly
tenfold — each auto-captured match is ~1381 bytes versus ~150 for a manual one.

There are **two distinct failure modes**, both currently unhandled:

1. **Silent loss.** `saveToStorage` (`index.html:4733`) catches every error and only
   `console.warn`s. Five keys persist through it (`snap_collection`, `snap_matches`,
   `snap_decks`, `snap_settings`, `snap_ai_config`, effects at `12932-12936`). On quota
   exhaustion the app keeps running and the UI keeps showing the data — it simply stops
   persisting. Records appear in-session and vanish on reload, with nothing shown to the user.
2. **Partial write.** `autoImportAll` (`index.html:4414`) has **no top-level try/catch** and
   writes ~13 keys via direct `localStorage.setItem` (`4423, 4433, 4442, 4454, 4463, 4484,
   4494, 4503, 4512, 4524, 4533, 4584, 4616`). A quota failure there **throws out of the
   function**, aborting every remaining write. The result is a torn state: some keys reflect
   the new sync, others still hold the previous one, and the user sees a partial success.

**Solution.** One quota-aware write path used everywhere; a sync that either completes or
reports honestly instead of tearing; a bounded growth policy that never discards a match; and a
visible storage gauge so the ceiling stops being invisible.

## Scope boundary

- Repo: `/home/platano/project/Marvel-Snap-Tactics` @ HEAD `5f40bb1`
- Changes under: `index.html` and `sw.js` (CACHE_NAME `v61` → `v62`) ONLY.
- **FROZEN:** `data/*`, `card-data.json`, `manifest.json`, all 7 game-file parsers'
  *parsing* logic (their localStorage writes ARE in scope), `parseGameState`/
  `validateGameResult`. No restyling — existing `--fr-*` variables and primitives only.
- ADR-001: single HTML file, React via CDN, no build step.

## Verified current context

Read on 2026-08-10 — do NOT re-derive.

```js
// index.html:4726
const loadFromStorage = (key, defaultValue) => {
  try { const stored = localStorage.getItem(key); return stored ? JSON.parse(stored) : defaultValue; }
  catch { return defaultValue; }
};
// index.html:4733  <-- swallows quota errors
const saveToStorage = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); }
  catch (e) { console.warn('Storage error:', e); }
};
```

- Persistence effects at `index.html:12932-12936` — 5 keys via `saveToStorage`.
- `autoImportAll` at `index.html:4414`, returns a `results[]` array of strings rendered by
  `showToast` at `10352`. **No top-level try/catch.** The snapshot block at `4605-4620` has its
  own local try/catch; the other writes do not.
- `showToast(message, type='info', duration=3500)` exists at `index.html:10042` — a
  user-visible channel already available.
- Auto match record shape (Slice B, `index.html:10169`): manual fields + `source`, `gameId`,
  and a full `gameResult` object (deck list, cards drawn, cards played, per-location powers,
  opponent). Measured at **1381 bytes**; a manual record is ~150.
- `exportFullVault(collection, matches, settings)` exists and includes `matches` — so a full
  export is the escape hatch *before* any pruning takes effect.
- `navigator.storage.estimate()` is available in Chrome and is the basis for the gauge; it
  reports origin-wide usage (IndexedDB included), NOT localStorage alone. See ruling 5.

## Design rulings (with WHY)

1. **One write path. `saveToStorage` gains a quota-aware signature and every direct
   `localStorage.setItem` of a `snap_*` key routes through it.** It must distinguish a quota
   failure from any other error (name `QuotaExceededError`, or legacy code 22 / 1014 for
   Firefox) and return a result the caller can act on — e.g. `{ok:true}` /
   `{ok:false, reason:'quota'|'other', error}`. — Two code paths with two different failure
   behaviors is the root cause of both bugs; unify before fixing either.

2. **A failed write must always reach the user.** On quota failure, `showToast` an
   unambiguous message naming what did not save and telling them to export. Never
   `console.warn` alone. — Silent data loss is the specific failure this slice exists to
   eliminate. A warning nobody sees is not handling.

3. **`autoImportAll` must never tear.** Wrap the whole function so a mid-sync failure cannot
   abandon remaining writes, and track per-key success. If any key fails, the toast must say
   which succeeded and which did not, instead of reporting a clean "Sync complete!". — A
   partial sync silently mixing old and new state is worse than a failed one, because the user
   believes it worked.

4. **NEVER discard a match record. Bound growth by stripping detail, not entries.** Keep every
   record's core fields (`id`, `timestamp`, `result`, `cubes`, `opponent`, `deck`, `notes`,
   `snapped`, `source`, `gameId`) forever — those feed every statistic. Retain the rich
   `gameResult` sub-object only for the newest **200** records; older records drop that field
   only. — Stats integrity is non-negotiable; recap detail is a nice-to-have. This bounds the
   heavy payload at roughly 276 KB while leaving lifetime history intact at ~200 bytes/match.
   Dropping whole matches would corrupt win rate and net cubes, which is the opposite of the
   goal.

5. **The storage gauge must state what it actually measures.** `navigator.storage.estimate()`
   returns origin-wide usage including IndexedDB and Cache Storage — it is NOT a localStorage
   quota reading, and localStorage has its own separate ~5 MB limit. Display the estimate for
   what it is, and separately compute the actual serialized size of the `snap_*` keys
   (`sum of key.length + value.length`) which IS the number that matters for the 5 MB cap.
   Label both honestly. — Presenting an origin-wide figure as "your localStorage usage" would
   be exactly the kind of confidently-wrong number this project keeps rooting out.

6. **Pruning runs on write, is idempotent, and is announced once.** Apply the cap when
   `snap_matches` is persisted. When pruning first strips records, `showToast` once explaining
   that older matches kept their stats but lost their card-level detail, and point at export.
   Do not toast on every subsequent write. — Silent mutation of the user's data is the same
   sin as silent loss, even when the mutation is correct.

7. **Degrade, don't block, when the quota is genuinely full.** If a write still fails after
   pruning, keep the in-memory state (so the session continues and nothing is lost on screen),
   surface a persistent warning, and make export prominent. Never clear data to make room, and
   never silently drop the newest record. — The user's escape hatch is an export; destroying
   data to fit is never the app's call.

8. **Also fix, in this slice (small, related):** the Match History **Win Rate** tile still
   guards on `weekWinRate !== null` with a `>=` comparison, so at exactly zero it renders
   "trending_up 0%" while the sibling Today's Net tile renders "Steady" (`64f0862` left this
   deliberately). Make it consistent with Today's Net. — Cheap, same file, same area, and it
   is the last known inconsistency from that fix.

## Implementation phases

### Phase 1 — Unified quota-aware write path
- [ ] Rewrite `saveToStorage` (`index.html:4733`) to detect quota errors specifically and
      return a structured result. Keep the existing call signature working for existing
      callers (they may ignore the return value).
- [ ] Route every direct `localStorage.setItem('snap_*', …)` through it. The sites are listed
      in Verified current context — **verify that list against a fresh grep; do not trust it
      blindly**, and report any site the list missed.
- [ ] Leave non-`snap_*` writes (e.g. Google token keys at `1759-1760`) alone.

### Phase 2 — Non-tearing sync
- [ ] Wrap `autoImportAll` so no single failed write aborts the rest.
- [ ] Track per-key outcome; on any failure the returned `results[]` must reflect it and the
      toast at `10352` must not read as unqualified success.
- [ ] Preserve existing behavior exactly when everything succeeds — same toast text.

### Phase 3 — Bounded growth
- [ ] On persisting `snap_matches`, strip `gameResult` from all but the newest 200 records
      (by `timestamp` descending; fall back to array order when a timestamp is invalid).
- [ ] Never remove a record. Never touch the core fields.
- [ ] One-time toast on first strip (ruling 6); track that it has fired in `snap_settings`.
- [ ] Idempotent: re-running over already-stripped data changes nothing and re-toasts nothing.

### Phase 4 — Storage gauge + failure UI
- [ ] In Settings' data-management area, show: measured `snap_*` serialized bytes against the
      ~5 MB practical cap, and separately `navigator.storage.estimate()` labelled as
      origin-wide (ruling 5). Handle `estimate()` being unavailable.
- [ ] Persistent warning state when a write has failed, with export made prominent.
- [ ] Style with existing primitives only.

### Phase 5 — Win Rate zero-case + cache
- [ ] Win Rate tile (~`index.html:5587-5593`): render "Steady" at exactly zero, matching
      Today's Net. Do not otherwise alter the tile.
- [ ] `sw.js` line 2: `snapapoulous-stitch-v61` → `v62`.

## HARD GATES

Paste every output verbatim. Any failure = fix before reporting. **Do NOT commit.**

1. **Quota is actually exercised, not simulated by inspection.** Fill `localStorage` with
   ballast until a real `QuotaExceededError` fires, then attempt each of: a `snap_matches`
   write, and a full `autoImportAll`. Show that (a) the user sees a toast, (b) `autoImportAll`
   completes rather than throwing, and (c) the per-key results report the failures. Paste the
   caught error's `name`.
2. **Non-tearing proof.** With quota exhausted mid-sync, show which keys were written and which
   were not, and that the reported results match reality — no key claimed written that was not.
3. **Pruning correctness.** Seed 250 auto records. After a write: record COUNT is still 250,
   the newest 200 retain `gameResult`, the oldest 50 have lost only that field, and every core
   field survives on all 250. Paste before/after counts and a sample stripped record.
4. **Stats invariance.** Compute total games / win rate / net cubes over the 250 records before
   and after pruning — they must be **identical**. This is the gate that proves ruling 4 held.
5. **Idempotence.** Run the persist path three times over already-pruned data: no further
   change, no additional toast.
6. **Gauge honesty.** Show the computed `snap_*` byte total against a hand-checked sum, and
   confirm the origin-wide estimate is labelled distinctly. A gauge that presents
   `navigator.storage.estimate()` as localStorage usage fails this gate.
7. **Win Rate zero-case** renders "Steady", and the non-zero cases are unchanged.
8. **No regression**: Home, Cards, Decks, Advisor, History, Analytics, Profile, Settings all
   render with zero console errors and zero React warnings; a normal folder sync still
   populates all 7 parsers.
9. `sw.js:2` = `snapapoulous-stitch-v62`.

## Verification (crew triple-track)

- [ ] **Haiku adversarial pass** — spec to refute: "no code path can lose a match record or
      report a sync as successful when it was not." Risky seams: a `snap_*` write site missed
      by the migration; pruning that reorders or drops records when a timestamp is invalid
      (`NaN` sort comparators are undefined behaviour — this repo has already been bitten by
      timestamp handling in `bbf928a`); the one-time toast flag firing on every load; the
      gauge conflating origin-wide with localStorage; a quota failure inside the quota handler
      itself (writing `snap_settings` to record the toast flag can itself fail).
- [ ] **Independent gate re-run** — orchestrator re-runs gates 3, 4 and 5 (pruning, stats
      invariance, idempotence) directly, since those are pure functions over data and can be
      re-derived without a browser.
- [ ] **Diff read** — the migrated write sites and the pruning comparator, with line numbers.

## Notes

**The gauge is the durable fix.** Every other item here handles failure better; the gauge stops
the user from reaching failure blind. A no-backend app whose database has an invisible ceiling
will hit that ceiling eventually — the only question is whether it is announced or discovered.

**Deliberately NOT in this slice:** migrating to IndexedDB. It would remove the cap entirely and
is the obvious long-term answer, but it is a storage-layer rewrite touching every read and write
in an 11k-line single file, and it should not ride along with a hardening pass. Revisit as its
own wave if the gauge shows real users approaching the cap.

## Amend log (append-only)

- 2026-08-10 — created — orchestrator
