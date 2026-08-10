<!-- crew plan artifact -->
<details>
<summary>metadata</summary>

- created: 2026-08-10
- modified: [2026-08-10]
- commits: []
- orchestrator-session: 9e3418f4
- implementer-agents: []
- verifier-agents: []
- back-refs: [commit 2965ea7 (the "By XP" no-op fix this repeats), docs/project_notes/decisions.md ADR-007]
- forward-refs: []
- status: spec

</details>

# Mastery roster — replace the no-op "Near Cap" sort with "Next Level"

## Purpose / Problem / Solution

**Problem.** The Mastery roster's **By Level / Near Cap** toggle does nothing. Reported by
the owner in-app and confirmed by analysis of the real
`CharacterMasteryState.json`: all **317 cards have `LevelCap: 30`** and **zero are at cap**.
So `Near Cap` sorts by `(cap − level)` ascending — arithmetically identical to `By Level`
descending — and the maxed-cards-sink tiebreaker never fires. Simulating both sorts over
the real 317-card roster produces a **byte-identical order**. The sort code itself
(`index.html:10387`) is correct; the data makes it a no-op.

This is a **repeat of a fixed bug**. Commit `2965ea7` replaced a "By XP" sort for being a
visual no-op (total XP tracks level); its replacement is a no-op for a different reason.
The lesson not learned the first time: *a sort mode must be validated against real data,
not reasoned about.*

**Solution.** Replace `Near Cap` with **Next Level** — order cards by how close they are to
their next mastery level, using level thresholds derived at runtime from the user's own
roster. Cards whose threshold cannot be determined are labeled, never faked.

## Scope boundary

- Repo: `/home/platano/project/Marvel-Snap-Tactics` @ HEAD `73e14ee`
- Changes under: `index.html` `MasteryForgeView` (starts line 10360) and `sw.js`
  (CACHE_NAME bump) ONLY.
- **FROZEN:** `parseMastery` (`index.html:3813`) — the stored `snap_mastery` shape does not
  change. All other views, routes, and the `--fr-*` skin. Do not restyle.

## Verified current context

**Current code:**
- `MasteryForgeView` at `index.html:10360`; `sortMode` state line 10363, values
  `'level' | 'nearcap'`.
- Sort at `index.html:10387`; toggle buttons at `index.html:10473–10490`
  ("By Level" 10479, "Near Cap" 10487).
- `parseMastery` (`index.html:3813`) emits per card:
  `{ card /* defId */, experience, level, levelCap }`. `experience` defaults to `0`,
  `level` to `1`, `levelCap` to `30` when absent.

**Real data (owner's 317-card roster, read 2026-08-10):**
- `LevelCap` is **30 for all 317** cards. Cards at/above cap: **0**.
- **16 cards have no `Experience` field at all** — `parseMastery` currently coerces these
  to `0`, which is indistinguishable from a genuine zero.
- `Experience` is **cumulative**, and level bands are **perfectly non-overlapping** across
  all 21 observed levels. Verified min/max XP per level:

| lvl | n | min | max | | lvl | n | min | max |
|---|---|---|---|---|---|---|---|---|
| 3 | 23 | 15 | 15 | | 14 | 10 | 305 | 340 |
| 4 | 21 | 25 | 30 | | 15 | 6 | 365 | 385 |
| 5 | 13 | 40 | 45 | | 16 | 7 | 405 | 445 |
| 6 | 28 | 50 | 65 | | 17 | 2 | 475 | 495 |
| 7 | 29 | 70 | 90 | | 18 | 1 | 555 | 555 |
| 8 | 22 | 95 | 115 | | 19 | 3 | 595 | 605 |
| 9 | 30 | 120 | 145 | | 20 | 1 | 685 | 685 |
| 10 | 51 | 150 | 180 | | 22 | 1 | 800 | 800 |
| 11 | 29 | 185 | 215 | | 24 | 1 | 950 | 950 |
| 12 | 14 | 220 | 255 | | 25 | 1 | 1025 | 1025 |
| 13 | 8 | 260 | 295 | | | | | |

- **Levels 1, 2, 21, 23 have zero cards** — so no threshold can be observed for entering
  them. Levels 21 and 23 sit directly above populated levels 20 and 22, meaning the 2 cards
  at levels 20 and 22 (and the level-25 card, the roster maximum) have **no derivable next
  threshold**.

## Design rulings (with WHY)

1. **Derive thresholds at runtime from the loaded roster**, never hardcode them.
   `threshold(L+1) = min(experience among cards at level L+1)`. — A hardcoded table would be
   wrong for any other collection and would rot when the game retunes mastery. Deriving
   from `snap_mastery` self-adapts.

2. **Sort key = `threshold(level+1) − experience`, ascending** (smallest gap first). — This
   is the literal reading of "closest to next level" and is genuinely distinct from
   `By Level`: a level-10 card at 180 XP (gap 5) correctly outranks a level-16 card at
   405 XP (gap 70).

3. **Observed minima are UPPER BOUNDS on the true threshold.** The real threshold is
   ≤ the smallest XP seen at that level. State this in the methodology copy. The *ordering*
   remains valid because the bias is applied consistently; only the absolute gap number is
   conservative. — ADR-007 honesty: we surface the estimate and say it is one.

4. **Cards with no derivable next threshold sink to the bottom**, in a labeled group
   ("No estimate — no roster data above this level"). Do NOT interpolate or extrapolate a
   threshold for them. — Inventing a threshold for levels 21/23 is exactly the
   fabricated-data failure this project has repeatedly ruled against.

5. **Cards missing `Experience` sink separately and are labeled**, not treated as 0 XP.
   Requires distinguishing absent from zero — see Phase 1. — A card with no XP data is not
   a card at the start of its level; conflating them mis-ranks 16 real cards.

6. **Show the gap number on the card in Next Level mode** (e.g. "5 XP to L11"), with the
   estimate caveat available in a methodology drawer — mirroring the existing Dossier
   methodology-drawer pattern. — A sort you cannot see the basis for is the no-op bug
   again, just harder to notice.

7. **Rename `sortMode` value `'nearcap'` → `'nextlevel'`** and the label "Near Cap" →
   "Next Level". — Leaving the old name invites the next reader to assume cap logic.

## Implementation phases

### Phase 1 — Preserve absent-vs-zero XP
- [ ] In `parseMastery` (`index.html:3813`) — **the one permitted change to the frozen
      parser** — set `experience: data.Experience ?? null` instead of `|| 0`, so an absent
      field is distinguishable from a genuine 0.
- [ ] Audit every existing reader of `snap_mastery.cards[].experience` and make each
      null-safe. Known readers: `MasteryForgeView` (10360+) and the summary/stat block.
      Grep for `experience` and fix every site — a null leaking into arithmetic renders
      `NaN`.
- [ ] Existing stored `snap_mastery` from a previous sync has `0` where it should have
      `null`. Do not migrate; the next sync overwrites it. Ensure `0` is handled gracefully
      in the meantime (it sorts as a genuine zero — acceptable, transient).

### Phase 2 — Threshold derivation
- [ ] `useMemo` over `resolvedCards`: build `Map<level, minExperience>` from cards whose
      `experience` is non-null, then `nextThreshold(L) = map.get(L+1) ?? null`.
- [ ] Recompute when the roster changes (`snap-data-updated`), not once on mount.
- [ ] Return `null` gap for: `experience == null`, OR `nextThreshold(level) == null`.

### Phase 3 — Sort + labels
- [ ] Rename `'nearcap'` → `'nextlevel'` (state, handler, `aria-pressed`, button label).
- [ ] Sort: cards with a numeric gap first (ascending), then the "no estimate" group, then
      the "no XP data" group. Stable within each group (fall back to level desc, then name).
- [ ] Render the gap on each tile in Next Level mode only; render the group labels.
- [ ] Methodology drawer explaining: thresholds are derived from your own roster and are
      upper-bound estimates; some cards have no estimate and why.

### Phase 4 — Cache
- [ ] Bump `sw.js` CACHE_NAME (line 2) from its then-current value to the next `v`.

## HARD GATES

**The gate that this slice exists for — run it and paste the output:**
- With the real roster loaded, dump the rendered order in BOTH modes and assert they
  **differ**. A passing build MUST show a different first-10 for `By Level` vs `Next Level`.
  Given the real data, `By Level` starts `Wolverine(25), Deadpool(24), Magneto(22),
  Storm(20), CaptainAmerica(19), IronMan(19)`. `Next Level` must NOT start with that
  sequence. **If the two orders match, the slice has failed** — that is the exact bug
  being fixed, and it is how the previous two attempts shipped broken.
- Zero console errors and zero React warnings on: Cards → Mastery, both sort modes, the
  methodology drawer open and closed.
- No `NaN`, `undefined`, `null`, or `Infinity` visible anywhere in the rendered roster.
  Grep the rendered DOM text for those four strings; expect zero hits.
- The 16 no-XP cards and the 3 no-threshold cards appear in their labeled groups, and
  their count matches the data (verify by counting in the source JSON).
- Existing Mastery summary stats (Cards / Avg Level / Maxed) are UNCHANGED vs HEAD.
- Paste all outputs verbatim. Any failure = fix before reporting.
- **Do NOT commit — orchestrator commits.**

## Verification (crew triple-track)

- [ ] **Haiku adversarial pass** — spec to refute: "the two sort modes produce provably
      different orders on the real roster, no card displays a fabricated threshold, and no
      absent-XP card is rendered as 0." Risky seams: the `?? null` change leaking null into
      arithmetic elsewhere (`NaN` render); off-by-one in `nextThreshold(level)` (must be
      `level+1`, not `level`); the derived map rebuilding on roster change; group ordering
      stability; whether "Maxed" stat still reads `levelCap` correctly after the rename.
      Verified defects only — severity, file:line, no hypotheticals.
- [ ] **Independent gate re-run** — orchestrator re-runs the differing-order gate itself
      against the real roster. This is non-negotiable: the previous two sorts shipped
      because nobody ran this check.
- [ ] **Diff read of the risky seam** — the null-vs-zero change and every `experience`
      reader, with line numbers.

## Notes

**Why this bug shipped twice.** Both `By XP` and `Near Cap` are correct code over data whose
distribution makes them degenerate. Neither was ever executed against a real 317-card
roster. The differing-order gate above is the durable fix for the *process*, not just this
sort — any future sort mode added here must pass it.

## Amend log (append-only)

- 2026-08-10 — created — orchestrator
