# Owned-Data Insight Wave — turn synced local state into private insight

**Created**: 2026-07-21 (crew session; ideation provenance: ChatGPT divergent brainstorm + orchestrator
source-verified triage against the real synced files).
**Thesis**: the app's moat is **private, longitudinal, player-owned data** — insight untapped.gg
architecturally cannot reproduce (it has no access to your cumulative game-state over time). This wave
surfaces already-synced-but-hidden fields and adds a snapshot engine for cross-sync deltas.
**Standing law** (unchanged): single `index.html` / CDN-only / no build; design canon
(`docs/design-canon.md`) binds; every slice = sonnet implement → adversarial verify → orchestrator
gates/diff → commit by orchestrator only; **SW CACHE_NAME bump on every index.html-deploying commit**
(currently `snapapoulous-stitch-v20` → next is v21).

## KILLED PREMISE — do NOT revive (source-verified 2026-07-21)
`ProfileState.Account.CardStats` is **net cubes per card**, NOT play counts (parser confirms:
index.html:3511 `.map(([card, netCubes]) => ...)`). There is **no per-card play-frequency data** in
the synced files. Every "most-played cards / play-count delta / played-vs-performance quadrant /
rediscover favorites" idea is built on phantom data — ChatGPT proposed several; all rejected. CardStats
is already surfaced (Slice 1 CardPerformanceView). `ProfileState.MatchHistory` is **empty**
(`HistoryPerLeague: []`) — re-confirms Slice 5 (per-match recap) is truly impossible; do not scaffold it.

## Verified data shapes (real synced files, field names confirmed)
- **ProfileState.Account**: `Wins 9854, Losses 6660, Ties 70, Snaps 1401, Concedes 781,
  OpponentConcedes 2256`. Parser stores all into `snap_profile_stats` (spread of `data.profile.stats`
  = `{wins, losses, ties, totalGames, winRate=wins/(wins+losses), snaps, concedes, opponentConcedes}`,
  index.html:3600-3610, write 4109). **Analytics "Lifetime Stats" card (10387) shows only Total
  Games / Win Rate / Wins / Snaps** — ties/concedes/opponentConcedes are stored but never rendered.
- **CharacterMasteryState**: `CharacterMasteryProgress.CharacterProgressData[defId] =
  {Experience, LastClaimedLevel, LevelCap:30, RewardTrackSeeds}` for 314 cards. Parsed → `snap_mastery`,
  rendered thinly (MasteryView ~10272: totalCards/avgLevel/maxedCards + top 10).
- **ProfileState.RankLog** Rank 95 + **LeaderboardLog.InfiniteLeaderboardSkillRating 4215** → `snap_rank`.
- **RewardState.PityCounter** `{CollectorsCacheAsset, CollectorsCacheSeasonalAsset1, None}`. Unsurfaced.
- Sync writes ~16 `snap_*` keys; all are read somewhere (no truly dead parse). "Fell to the wayside"
  = depth/prominence gaps, not dead code.

## Slice A — S.H.I.E.L.D. Player Dossier — SELECTED (do first: cheap, standalone)
Extend the Analytics "Lifetime Stats" card (10387) — data already in `profileStats`. Add derived,
honest metrics with tap-to-reveal exact formula: recorded outcomes (totalGames), snap rate
(snaps/totalGames), **intimidation index** (opponentConcedes/totalGames), retreat rate
(concedes/totalGames), surface Ties. Keep existing winRate = wins/(wins+losses). Never imply
opponent concedes were *caused* by snapping. Empty/partial safe (all `|| 0`).
- Gates: crawl-grade (fixture with known stats → hand-verified derived values; empty state; console; 360/768).

## Slice B — Time Stone (snapshot engine) — SELECTED (keystone; do second)
On each successful folder sync, append a compact timestamped snapshot (ring buffer, bounded retention)
to a new `snap_snapshots` key: `{syncedAt, wins, losses, ties, snaps, concedes, opponentConcedes,
rank, skillRating, masteryXpTotal, pity:{...}}`. A "Since last sync" delta view (label intervals
"issues/chapters", NOT matches — cannot reconstruct matches). **Negative deltas flagged as
reset/source-change, never as gameplay.** First sync = no history (honest empty state). Detect season
resets. Add `schemaVersion` + `syncedAt` to the snapshot record. NO card play-count deltas (phantom).
- Gates: seed 2 snapshots → deltas exactly match arithmetic; single-snapshot empty state; negative-delta
  flagging; retention cap; console; widths.

## Slice C — Mastery Forge — SELECTED (do third; richer once B exists)
Deepen MasteryView into a roster-development screen: highest-XP cards, `LastClaimedLevel`/30 bars,
unmastered owned cards, maxed count. **Raw XP + LastClaimedLevel/30 only — do NOT invent XP-to-next
thresholds** (RewardTrackSeeds unverified). Once Slice B ships, add "mastery XP gained since last sync".
- Gates: fixture with known mastery → counts/levels exact; no threshold fabrication; empty state; widths.

## Deferred / cleanup
- **Mission War Room** — not selected this wave (owner ruling 2026-07-21). MissionState is real + already
  thinly rendered; deepen later if wanted.
- **Flight Recorder / Pity Watch / Comic Annual** — depend on Slice B or are niche/polish; revisit after.
- **CLEANUP (honesty debt)**: `MatchTurnAnalysis` (index.html:5772) renders HARDCODED fake per-location
  scores (`24/28/18/24/30/40/18`) — dead Slice-5 scaffolding. Cut or gate behind a "no real data" notice.
