<!-- crew plan artifact -->
<details>
<summary>metadata</summary>

- created: 2026-08-10
- modified: [2026-08-10]
- commits: []
- orchestrator-session: 9e3418f4
- implementer-agents: []
- verifier-agents: []
- back-refs: [docs/plans/adoption-wave-2026-07-20.md (Slice 5 — "DEAD", now REVERSED), docs/project_notes/decisions.md ADR-001, ADR-007, ADR-008]
- forward-refs: []
- status: spec

</details>

# Auto Match Capture — real match records from `GameState.json`

## Purpose / Problem / Solution

**Problem.** Match history is manual-entry only. The app's stated moat is the private
longitudinal data the game hides, yet the single richest source of it has been sitting
unread on disk. The 2026-07-20 recon (adoption-wave Slice 5) declared per-match data
non-existent and closed the slice — **that verdict was wrong**. It inspected
`GameState.json → LocalGame`, which is empty after a match. The sibling branch
`RemoteGame` holds a complete, fully-populated record of the last finished game:
per-location power for both sides, winner per location, opponent identity and rank,
cards drawn and played in order, deck used, energy spent, and the exact turn either
player snapped. Verified against the owner's live files on 2026-08-10.

**Solution.** An opt-in background poller reads `GameState.json` through the folder handle
the app already holds, detects a newly-finished match by GUID, and appends a real match
record to `snap_matches`. Off by default; one toggle in Settings. No new permissions, no
new dependencies, no manual step per match.

## Scope boundary

- Repo: `/home/platano/project/Marvel-Snap-Tactics` @ HEAD `73e14ee`
- Changes under: `index.html` (parser layer + sync layer + Settings) and `sw.js`
  (CACHE_NAME bump) ONLY.
- **FROZEN:** all existing parsers, all existing routes, `card-data.json`, `manifest.json`,
  the Field Report skin tokens (`--fr-*`) and primitives. Do not restyle anything.
- Honors ADR-001 (single HTML file, no build step).

## Verified current context

Read from the live install and the repo on 2026-08-10 — do NOT re-derive these.

**Game file location (PC):**
`C:\Users\Aldwin\AppData\LocalLow\Second Dinner\SNAP\Standalone\States\nvprod\GameState.json`
— same `nvprod` folder the user already links. UTF-8 BOM, same as every other parsed state
file, so the existing BOM-tolerant read path applies unchanged.

**Shape (verified on a real completed match, GameId `58542213-c178-4005-b678-a0fcaa7a45fc`):**

`GameState.json` is `$id`/`$ref` graph-serialized. A `$ref` resolution table must be built
before reading (walk the whole doc collecting `$id`, then resolve `{"$ref":"N"}` on access).

```
RemoteGame.GameState
  Id                       "58542213-…"        <- dedupe key (GUID, per match)
  LeagueDefId              "Ranked"
  TotalTurns / Turn        6 / 6
  CubeValue                4
  StakesRaisedCount        2
  Winner / Loser           {$ref} -> Player
  _players[2]              -> Player
  _locations[3]            -> Location
  ClientResultMessage      -> GameResultMessage
```

`Player` (deref'd): `EntityId`, `EndedTurn`, `_turnsOnStakesRaiseRequested` (**snap turns**,
e.g. `[5]`), `PlayerInfo` -> `{Name, AccountId, CollectionScore, HighWatermarkRank}`.
In the verified sample: local = `platano` (EntityId 2), opponent = `Morado Wolf`
(EntityId 7, rank 93, collection 28029), opponent snapped turn 5.

`Location` (deref'd): `LocationDefId`, `CurPlayer1Power`, `CurPlayer2Power`,
`WinnerEntityId`, `SlotIndex`, `_cards[]`.
Verified sample: `DeathsDomain` (lost), `LakeHellas` 19–10 (won), `PyramidOfRamaTut` 17–10
(won).

`ClientResultMessage` (**local player only** — the array has exactly one item):
`GameId`, `LeagueDefId`, `IsStakesRaisedByPlayer`, `FinalCubeValue`, `TurnsTaken`,
`TotalTurns`, `LocationDefIdsAtEndOfGame[3]`, and
`GameResultAccountItems[0]` -> `{IsWinner, FinalCubeValue, EnergySpent, CardDefIdsDrawn[],
CardDefIdsPlayed[], LocationResults[3] {IsWinner, CardsPlayed, PowerPlayed},
Deck {Name, Cards[]}, CurrencyRewardEarned}`.
Verified sample: deck `"Auto-Cable"`, 12 cards, 9 played, 19 energy, +4 cubes, win.

**Known-empty (do NOT build on these):**
- `LocalGame.*` — `CardsPlayed`, `CardsDrawn`, `_players`, `_locations` all empty
  post-match. This is what the old recon read.
- `LocationWinRecord._entries` — **empty**. There is no lifetime per-location record.
- `Location._cards[].OwnerEntityId` — null at the top level of the card object. Per-side
  card attribution is NOT directly available (see Design rulings).
- `ProfileState.MatchHistory` / `HistoryPerLeague` — still `[]`. Unchanged.

**App-side seams:**
- Folder handle persisted in IndexedDB `SnapSyncDB`, `settings/folderHandle`;
  restored on mount at `index.html:9858` (`restoreFolderHandle`), permission checked with
  `queryPermission({mode:'read'})` at `index.html:9863` — **no re-prompt once granted**.
- Sync `fileMap` at `index.html:9955` (7 entries; `GameState.json` absent).
- `autoImportAll` at `index.html:4262`.
- `snap_matches` write path and the id-match/update/append logic at `index.html:10890`.
- `VAULT_SYNCED_KEYS` at `index.html:4516`.
- Settings component region: `canLinkFolder` at `index.html:10406`.
- `sw.js` CACHE_NAME currently `snapapoulous-stitch-v57` (line 2).

## Design rulings (with WHY)

1. **Off by default, single toggle in Settings.** Label: *Auto-capture matches*, with
   sub-text naming the real requirement ("polls the linked folder while this window is
   visible"). Persist in `snap_settings` as `autoCaptureMatches: false`. — Because polling
   a file on a timer is a behavior change the owner should opt into, and because it is
   useless without a linked folder.

2. **Toggle is disabled (greyed, with reason) when no folder is linked.** — Because there
   is nothing to poll; a toggle that silently does nothing is the bug class we are
   currently fixing elsewhere in this same session.

3. **Poll cadence 30s, and only when `document.visibilityState === 'visible'`.** Also
   re-poll immediately on `visibilitychange` → visible. — The owner is running the app on
   a second monitor specifically so the window stays visible and unthrottled. The
   visibility guard means the hidden-tab throttling case degrades to "catch up on focus"
   instead of firing pointless timers.

4. **Dedupe on `RemoteGame.GameState.Id`.** Keep the last captured GUID in
   `snap_settings.lastCapturedGameId`. Skip if unchanged. — The file holds only the most
   recent match and is re-read many times; the GUID makes capture idempotent.

5. **Only capture a FINISHED match.** Require `ClientResultMessage` present AND `Winner`
   resolvable AND `Turn >= 1`. Skip otherwise. — Mid-match reads must never produce a
   record.

6. **Auto records are flagged `source: 'auto'`; manual entries keep `source: 'manual'`
   (backfill absent values as `'manual'`).** Never silently merge, never overwrite a manual
   record. — The owner must always be able to tell which numbers the app observed from
   those they typed.

7. **Per-side card attribution is NOT claimed.** `CardDefIdsPlayed` is the local player's
   and is labeled as such ("Your cards"). Opponent cards are NOT rendered in this slice,
   because `OwnerEntityId` is null and subtracting one list from the other is inference,
   not observation. — ADR-007 honesty law; the whole point of reversing Slice 5 is that we
   now have real data and do not need to fabricate.

8. **Missed matches are not reconstructed.** If two games complete between polls, the
   first is gone. Do not interpolate. The UI must not claim completeness. — Same law.
   `ProfileState` cumulative totals still tick, so the existing Time Stone differential
   continues to report *how many* games were played; the recap detail is simply absent for
   the missed ones.

9. **`GameState.json` is NOT added to the main sync `fileMap`.** The poller reads it
   directly. — The regular sync is a user-initiated full import; match capture is a
   different cadence with different failure semantics. Keeping them separate means a
   capture failure can never break the vault import.

10. **No new UI surface in this slice.** Records land in `snap_matches` and render through
    the existing Match History list and `MatchTurnAnalysis` detail. — Scope control; the
    recap UI is a follow-up once real records exist to design against.

## Implementation phases

### Phase 1 — Parser (`parseGameState`)
- [ ] Add `parseGameState(json)` to `GameDataParser`, alongside the existing 7 parsers.
- [ ] Build the `$id` → object table by walking the document once; add a `deref` helper.
- [ ] Return `null` for: missing `RemoteGame`, missing `ClientResultMessage`, unresolvable
      `Winner`. (Mid-match and empty-file cases.)
- [ ] Identify the local player by matching `PlayerInfo.AccountId` against
      `GameResultAccountItems[0].AccountId`. Do NOT assume EntityId 2 is local.
- [ ] Emit:
      `{ type:'gameResult', gameId, leagueDefId, result:'WIN'|'LOSS', cubes, turnsTaken,
         totalTurns, energySpent, deckName, deckCards[], cardsDrawn[], cardsPlayed[],
         locations:[{defId, slotIndex, yourPower, theirPower, won}],
         opponent:{name, rank, collectionScore},
         snap:{you:boolean, them:boolean, yourTurns[], theirTurns[]},
         capturedAt }`
- [ ] Map `CurPlayer1Power`/`CurPlayer2Power` to your/their side via the local player's
      `EntityId` and `WinnerEntityId` — **verify the Player1/Player2 ordering empirically
      against the sample below; do not guess.**

**Testing strategy:** unit-style assertions against a committed fixture derived from the
verified sample. Edge cases: mid-match file (no `ClientResultMessage`), 2-location and
4-location games, a loss, a retreat (low `TurnsTaken`), both-snapped, neither-snapped,
missing `Experience`-style absent optional fields.

**Verified expected output for the fixture** (assert exactly):
`result:'WIN'`, `cubes:4`, `turnsTaken:6`, `energySpent:19`, `deckName:'Auto-Cable'`,
`opponent.name:'Morado Wolf'`, `opponent.rank:93`, `snap.them:true`,
`snap.theirTurns:[5]`, `snap.you:false`,
locations `LakeHellas` 19–10 won, `PyramidOfRamaTut` 17–10 won, `DeathsDomain` lost.

**Closed loop:** do not exit until every box is `[x]` and the fixture assertions pass.

### Phase 2 — Capture loop
- [ ] Add `autoCaptureMatches` (default `false`) and `lastCapturedGameId` (default `null`)
      to the `snap_settings` schema, with safe defaults for existing stored settings.
- [ ] Poller: `setInterval` 30s, started only when `autoCaptureMatches && folderHandle`;
      cleared on unmount, on toggle-off, and on unlink. No leaked intervals.
- [ ] Guard each tick on `document.visibilityState === 'visible'`; add a
      `visibilitychange` listener that polls once on becoming visible.
- [ ] Read `GameState.json` via the existing handle path; `queryPermission` first, and on
      anything other than `'granted'` disable capture and surface a one-line notice —
      **never call `requestPermission` from a timer** (it needs a user gesture and will
      throw).
- [ ] On a new `gameId`: parse, append to `snap_matches` with `source:'auto'`, persist
      `lastCapturedGameId`, dispatch `snap-data-updated`.
- [ ] Wrap the whole tick in try/catch — a malformed or mid-write file must log and skip,
      never throw into React.

**Testing strategy:** toggle on/off with folder linked and unlinked; verify no interval
survives unmount; verify re-reading the same file twice appends exactly one record;
verify a mid-match file appends none.

### Phase 3 — Settings toggle
- [ ] Render the toggle in the Settings sync area (near the existing linked-folder UI at
      `index.html:10406`), styled with existing `--fr-*` primitives — no new CSS tokens.
- [ ] Disabled state + reason text when `!isLinked`.
- [ ] Show last-captured info: match count captured this session and `lastCapturedGameId`
      presence (not the raw GUID — a human-readable "last capture: <relative time>").
- [ ] Accessibility: real `<button role="switch">` or checkbox with `aria-checked`,
      44px min touch target, keyboard operable, visible focus ring.

### Phase 4 — Vault + cache
- [ ] Confirm `snap_matches` is already in `VAULT_SYNCED_KEYS` (`index.html:4516`); add
      only if absent. Do NOT add the new settings keys if settings are already covered.
- [ ] Bump `sw.js` CACHE_NAME `snapapoulous-stitch-v57` → `v58`.

## HARD GATES

- `node --check` is not applicable (single HTML). Instead:
  `python3 -c "print(open('index.html',encoding='utf-8').read().count('<script'))"` → unchanged vs HEAD.
- Load `index.html` in a browser with a linked folder; console must show **ZERO** errors and
  **ZERO** React warnings on: app load, Settings open, toggle on, toggle off, tab switch.
- With capture ON and the real `nvprod` folder linked: one poll cycle produces exactly one
  new `snap_matches` entry for the current `GameState.json`, and a second cycle produces
  **zero**. Paste the resulting record verbatim.
- With capture OFF: no `GameState.json` read occurs across 3 poll intervals (verify via a
  counter or console instrumentation, then remove it).
- Existing sync still works end to end: run a normal folder sync, all 7 parsers still
  populate, no regression in Collection / Profile / Mastery.
- Paste all outputs verbatim. Any failure = fix before reporting.
- **Do NOT commit — orchestrator commits.**

## Verification (crew triple-track — orchestrator runs, none trusts the others)

- [ ] **Haiku adversarial pass** — spec to refute: "auto-capture appends exactly one honest
      record per finished match, never fabricates a field, never fires when disabled, and
      leaks no interval." Risky seams to hunt: `$ref` resolution correctness (a wrong deref
      silently yields plausible-but-wrong powers); local-vs-opponent identification
      (EntityId assumption); Player1/Player2 → your/their mapping; interval cleanup on
      unmount and toggle-off; `requestPermission` called from a non-gesture context;
      mid-match file producing a record; dedupe key persistence across reload. Verified
      defects only — severity, file:line, no hypotheticals.
- [ ] **Independent gate re-run** — orchestrator re-runs every HARD GATE against the real
      game files, not the agent's claim.
- [ ] **Diff read of the risky seam** — the deref table, the side-mapping, and the interval
      lifecycle, with line numbers.
- Adjudication: check claims against the live `GameState.json`, not against reasoning.

## Notes

**Capture rate is a measured unknown.** Chrome throttles hidden-tab timers to ~1/min, and
after 5 minutes hidden to ~1/5min; a match runs ~2–4 minutes and only the latest persists.
The owner is running the app visible on a second monitor, which avoids throttling entirely,
so the expected miss rate there is near zero — but it is **unmeasured**. UI copy must say
what it does ("captures matches while this window is visible"), never "captures every
match". Revisit after a real play session with a capture-vs-`ProfileState`-delta comparison.

**Reversal of record.** `docs/plans/adoption-wave-2026-07-20.md` Slice 5 is marked DEAD on
the basis that no per-location data exists. That conclusion is superseded by this plan; the
`LocalGame`-vs-`RemoteGame` distinction is the reason it was missed. An ADR should record
this so the dead-end is not re-derived a third time.

## Amend log (append-only)

- 2026-08-10 — created — orchestrator
