<!-- crew plan artifact -->
<details>
<summary>metadata</summary>

- created: 2026-08-10
- modified: [2026-08-10]
- commits: []
- orchestrator-session: 9e3418f4
- implementer-agents: []
- verifier-agents: []
- back-refs: [docs/plans/auto-match-capture-2026-08-10.md (Slice B, ruling 6 + the dupe risk it created), docs/project_notes/decisions.md ADR-007 (honest-gap discipline), ADR-008 (mobile has no auto path)]
- forward-refs: []
- status: spec

</details>

# Slice C — Spotlight gap state, duplicate-match guard, Quick Match hint

## Purpose / Problem / Solution

**Problem 1 (owner-reported, the one that prompted this).** Advisor → Meta → Spotlight appears
frozen: it renders nothing past 2026-07-28 even after a fresh data refresh. The data is NOT
stale — `data/spotlight-schedule.json` correctly says `season: "Fractured Frontier"`,
`lastUpdated: 2026-08-05`. What the refresh deliberately withheld is the *week-by-week* mapping
for August: the four new Series 5 spotlight-eligible cards are known, but which card headlines
which week could not be cross-verified against two independent sources (every direct fetch of
marvelsnapzone / marvelsnap.pro / snap.fan / fandom returned 403 or 402). Per this project's
honest-gap discipline, weeks 14+ were omitted rather than guessed. **The file's `notes` field
explains all of this and nothing in the app reads it.** The UI renders the last known week and
stops, which is indistinguishable from a broken refresh. The data is honest; the UI is lying by
omission.

**Problem 2 (introduced by Slice B, `2c8b4b5`).** Auto-capture and Quick Match can both record
the same match. Nothing detects it. Two records for one game double-counts net cubes and skews
win rate. This should have been caught in the Slice B spec and was not.

**Problem 3.** Manual records carry no `source` field at all (`handleQuickMatch`,
`index.html:12945`), so "manual" is only inferable by the *absence* of `source: 'auto'`.
Slice B ruling 6 called for manual records to be labeled; that half was never implemented.

**Solution.** Surface the schedule gap explicitly with the reason and the known cards; warn
(never block) on a probable duplicate with a one-tap Undo; label manual records; and show a
quiet indicator on Quick Match when auto-capture is active.

## Scope boundary

- Repo: `/home/platano/project/Marvel-Snap-Tactics` @ HEAD `2c8b4b5`
- Changes under: `index.html`, `sw.js` (CACHE_NAME bump `v60` → `v61`), and
  `data/spotlight-schedule.json` (additive field only — see ruling 2).
- **FROZEN:** `data/meta-context.json`, `card-data.json`, all 7 game-file parsers,
  `parseGameState`/`validateGameResult` (Slice B, just shipped), every existing route. No
  restyling — existing `--fr-*` variables and primitives only.
- ADR-001: single HTML file, React via CDN, no build step.

## Verified current context

Read on 2026-08-10 — do NOT re-derive.

**Spotlight data (`data/spotlight-schedule.json`):**
- Top-level keys: `lastUpdated` (`"2026-08-05"`), `scheduleVersion` (`"3.1"`),
  `season` (`"Fractured Frontier"`), `weeks` (13 entries), `notes` (a long prose string).
- Last entry is `weekNumber: 13`, `endDate: "2026-08-04"` — which is exactly when the new
  season started, hence "stuck on July".
- Every week has a `cacheCards` array present (0 weeks missing it), so existing
  `week.cacheCards.map(...)` at `index.html:9781` is safe. Do not "fix" it.
- The four spotlight-eligible new cards, named verbatim in `notes`: **Psylocke: Fractured
  Frontier, Red Wolf: Fractured Frontier, Death: Fractured Frontier, Red Hulk: Fractured
  Frontier**.

**Spotlight UI (`OracleView`):**
- Fetch at `index.html:9764` (`cache: 'no-cache'`); a second fetch at `11772`
  (`cache: 'reload'`) is the Settings refresh path.
- `!schedule` → "Schedule unavailable" panel (`index.html:9776`).
- `analyzedWeeks` at `index.html:9780` maps `schedule.weeks` and computes EV per week.
- **`schedule.notes` is never read anywhere.** Confirmed by grep.

**Match paths:**
- Manual: `handleQuickMatch` at `index.html:12945` — writes
  `{id, timestamp, result, cubes, opponent:'', deck:'', notes:'', snapped:'NONE'}`.
  **No `source` field.**
- Auto: `index.html:10169` — writes the same fields plus `source:'auto'`, `gameId`,
  `gameResult`. Uses `file.lastModified` (match-end time) as `timestamp`.
- `updateMatch(id, patch)` helper exists at `index.html:12958`.
- `setLastMatchId` + the archetype-tag strip already render conditionally under Quick Match
  (`index.html:5316`), so there is an established pattern for post-add UI in that panel.

**Meta context (`data/meta-context.json`, FROZEN):** its `newSeasonCards` array contains
**Season Pass** cards (Thanos, Jane Foster) which are NOT spotlight-cache cards. Do NOT source
the gap display from this file — see ruling 2.

## Design rulings (with WHY)

1. **Render the gap, don't hide it.** After the last known week, show a panel stating: the
   current season, the `lastUpdated` date, the known-but-unscheduled cards, and a plain-English
   reason that the week mapping is unverified. — The silence is deliberate and correct; the bug
   is that it is indistinguishable from breakage. Saying "we don't know yet, and here's why"
   is the honest-gap discipline actually reaching the user.

2. **Move the known cards from prose into a structured field — verbatim, inventing nothing.**
   Add to `data/spotlight-schedule.json`:
   ```json
   "pendingWeeks": {
     "afterWeek": 13,
     "season": "Fractured Frontier",
     "knownCards": ["Psylocke: Fractured Frontier", "Red Wolf: Fractured Frontier",
                    "Death: Fractured Frontier", "Red Hulk: Fractured Frontier"],
     "reason": "The four new Series 5 Spotlight-eligible cards are confirmed, but which card headlines which week could not be cross-verified against two independent sources this refresh. Left unscheduled rather than guessed.",
     "sourcesBlocked": ["marvelsnapzone.com", "marvelsnap.pro", "snap.fan", "fandom wiki"]
   }
   ```
   Every value above is a faithful restructuring of the existing `notes` text — **do not add a
   card, a date, or a claim that is not already in that field.** Leave `notes` in place
   unchanged. — The data file stays authoritative and the UI stays dumb; sourcing the display
   from `meta-context.json` instead would wrongly present Season Pass cards as spotlight cards.

3. **The gap panel must not compute or display an EV, pity estimate, or recommendation for the
   pending cards.** Names and the reason only. — EV depends on which cards land in a given
   week's cache; with no week mapping any number would be fabricated.

4. **Duplicate guard WARNS, never blocks or auto-deletes.** After a manual Quick Match add, if
   an `source:'auto'` record exists with the same `result`, the same `cubes`, and a `timestamp`
   within **10 minutes**, show an inline non-modal warning in the Quick Match panel with a
   one-tap **Undo** that removes the just-added manual record. Auto-dismiss it when the next
   match is added. — Blocking would lose real data on a false positive, and back-to-back
   identical results (two +4 wins in ten minutes) are entirely possible. A warning with Undo
   makes a false positive harmless while still catching the real case.

5. **The guard only ever removes the record the user just created**, identified by the `id`
   returned from that add. Never delete an auto record, never delete an older manual one. —
   Data-loss handling: the undo target must be unambiguous.

6. **Label manual records `source: 'manual'`** in `handleQuickMatch`. Do NOT migrate existing
   stored records. Any reader must treat a missing `source` as manual. — Completes Slice B
   ruling 6; a migration would rewrite history for no benefit.

7. **Quick Match keeps every button and stays exactly where it is.** Auto-capture is PC-only,
   requires the window open and visible, and is off by default — and ADR-008 leaves mobile with
   no automatic path at all. The hint is informational only. — Removing or demoting Quick Match
   would silently drop every match played on the Tab S9, Z Fold, or Pixel.

8. **The hint renders only when auto-capture is actually running** (`settings.autoCaptureMatches`
   AND a folder is linked). Wording must not overstate: it captures matches while the window is
   visible, not "every match". — Slice B's own note: the miss rate under a hidden window is
   unmeasured.

## Implementation phases

### Phase 1 — Spotlight gap panel
- [ ] Add the `pendingWeeks` block to `data/spotlight-schedule.json` exactly as in ruling 2.
- [ ] In `OracleView`, render a gap panel after the week list when `schedule.pendingWeeks`
      exists and `pendingWeeks.afterWeek` is >= the last rendered week number.
- [ ] Panel content: season, `lastUpdated`, the `knownCards` list, the `reason`, and a muted
      line noting which sources were unreachable. No EV, no recommendation (ruling 3).
- [ ] Absent `pendingWeeks` → render nothing extra (older/newer data files must not break).
- [ ] Style with existing `fr-panel` / `fr-label` / `--fr-*` only.

**Testing:** with the real data file; with `pendingWeeks` deleted; with `knownCards: []`.

### Phase 2 — Manual source label + duplicate guard
- [ ] `handleQuickMatch` (`index.html:12945`) adds `source: 'manual'`.
- [ ] After adding, scan `matches` for an entry with `source === 'auto'`,
      `result === result`, `cubes === cubes`, and `Math.abs(new Date(m.timestamp) - now) <= 600000`.
- [ ] If found, set a `dupeWarning` state carrying the new record's `id` and the matched auto
      record's timestamp.
- [ ] Undo removes ONLY the record whose `id` matches (ruling 5) and clears the warning.
- [ ] Warning clears on the next Quick Match add and on navigating away.
- [ ] Guard against invalid timestamps — a record whose `new Date(m.timestamp)` is `NaN` must
      never match (this is the malformed-data lesson from `bbf928a`; `NaN` comparisons are
      always false, so verify rather than assume).

**Testing:** auto record then matching manual within 10 min (warns); outside 10 min (no warn);
different cubes (no warn); different result (no warn); two manual adds with no auto record
present (no warn); Undo removes exactly one record and leaves the auto record intact.

### Phase 3 — Quick Match hint
- [ ] Thread whatever state is needed (`settings.autoCaptureMatches` and linked status) to the
      Quick Match panel. If the Dashboard component does not already receive it, pass it as a
      prop from the owner of that state rather than reading `localStorage` directly inside
      render.
- [ ] Render a single muted line in the Quick Match panel header area when active, e.g.
      "Auto-capture on — PC matches log themselves while this window is visible."
- [ ] Renders nothing when auto-capture is off or no folder is linked.

### Phase 4 — Cache
- [ ] `sw.js` line 2: `snapapoulous-stitch-v60` → `v61`.
- [ ] Confirm `data/spotlight-schedule.json` is served fresh — the existing fetches use
      `cache: 'no-cache'` / `'reload'`, so no SW change should be needed. Verify, don't assume.

## HARD GATES

- Spotlight tab renders the gap panel with all four card names, the season, and the reason.
  Screenshot + the rendered text. **The panel must contain no number that is not in the data
  file** — grep the rendered panel text for any EV/percentage/date beyond `lastUpdated`.
- Delete `pendingWeeks` from a copy of the data file → the tab renders exactly as it does at
  HEAD, with no error and no empty container.
- Duplicate guard: run all six test cases from Phase 2 and paste the resulting `snap_matches`
  length and contents for each. The Undo case must show the auto record surviving.
- A manual add with NO auto-capture ever enabled produces no warning and no console noise.
- New manual records carry `source: 'manual'`; existing stored records without `source` still
  render correctly in History and Analytics (load a fixture containing both shapes).
- Zero console errors and zero React warnings on: Advisor → Meta → Spotlight, Home (Quick Match
  add + Undo), History, Analytics.
- `sw.js:2` = `snapapoulous-stitch-v61`.
- Paste outputs verbatim. Any failure = fix before reporting. **Do NOT commit.**

## Verification (crew triple-track)

- [ ] **Haiku adversarial pass** — spec to refute: "the gap panel displays only facts present in
      the data file, the duplicate guard never removes a record other than the one just added,
      and manual labeling breaks no existing consumer." Risky seams: any fabricated
      number/date in the gap panel; the 10-minute window arithmetic with an invalid or
      future timestamp; Undo targeting the wrong `id` when several records share
      result+cubes; readers that branch on `source` and mishandle `undefined`.
- [ ] **Independent gate re-run** — orchestrator re-runs the six duplicate cases and the
      missing-`pendingWeeks` case.
- [ ] **Diff read** — the Undo removal predicate and the timestamp comparison, with line numbers.

## Notes

The Spotlight complaint is worth recording as a pattern: **an honest omission that isn't
explained reads to the user as a bug.** The data layer has followed the no-fabrication rule
rigorously; the presentation layer never got the other half, which is saying why something is
missing. Any future "we couldn't verify this" gap in this app should ship with its explanation
visible, not buried in a `notes` field nothing reads.

## Amend log (append-only)

- 2026-08-10 — created — orchestrator
