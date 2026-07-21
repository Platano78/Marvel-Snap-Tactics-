READ FIRST:
- ~/.claude/docs/solutions/Marvel-Snap-Tactics-20260721-handoff.md  (this session's full handoff)
  — or Serena memory `session-handoff-20260721-0102.md`
- docs/plans/adoption-wave-2026-07-20.md — THE work queue. Slice 2 section is now **UNBLOCKED**
  with the real cosmetic data shapes captured. Slices 1/3a/3b/4 SHIPPED, 5 DEAD.
- docs/project_notes/bugs.md — BUG-018 (hooks above early returns — INVISIBLE to parse+diff,
  only a live run catches it), BUG-019/020 (this session's fixes).
- docs/design-canon.md (design law) + AGENTS.md (router — grep section banners, NEVER read the
  whole ~14k-line index.html).

STATE (2026-07-21): everything pushed to origin/main (HEAD c5b9c42). **sw.js CACHE_NAME = v19 —
next index.html-deploying commit MUST bump to v20.** Adoption wave: 4/5 shipped; Slice 2 is the
last buildable slice, now unblocked.

INVOCATION:
/crew Build Slice 2 — Cosmetics tab (two-parter): extend parseCollectionEnhanced to persist the
cosmetic lists, then build the Cosmetics view.

LANE ROUTING:
Route bulk work to the loaded local model per FLEET-STATE (session-start injection). If local is
empty, use coder :8084. Escalate to haiku/sonnet only as needed. (Crew: sonnet implements, live
Playwright crawls execute-verify via the webapp-testing skill — chrome-devtools MCP is flaky.)

NEXT TASK — SLICE 2 (Cosmetics), the two-parter:
Real data source (live): /mnt/c/Users/Aldwin/AppData/LocalLow/Second Dinner/SNAP/Standalone/
States/nvprod/CollectionState.json (~2 MB — inspect shapes with a bounded python script reading
only the cosmetic sub-structures; do NOT read the whole file into context).

Confirmed shapes (ServerState):
- AvatarInventory.OwnedAvatars[] = { CardArtAvatar: { CardDefId, ArtVariantDefId? } } → Avatars
  gallery via card art. BUILDABLE.
- AllAlbumData[] (~80) = { AlbumStats: { AlbumDefId, AcknowledgedVariants[], AlbumRewardStatsList[] },
  AlbumDef, AllAlbumRewardData } → album completion (one build-time dig into AlbumDef for the
  total-variant count). LIKELY BUILDABLE.
- OwnedTitles[] = { TitleDefId } opaque, CardBacks[] = { CardBackDefId } opaque → COUNT only
  (honest gap, no name/art map).

Part 1: extend parseCollectionEnhanced (index.html ~3919-3930, currently .length only; storage
write ~4067) to persist avatar CardDefIds (+variant) and per-album completion into
snap_collection_enhanced; KEEP the existing counts (Profile/Dashboard read them). Verify against
the REAL file.
Part 2: Cosmetics view — MatchHistory-style 3-point route registration (router switch ~14192,
More-Features button ~11009, URL whitelist ~14006 → add 'cosmetics'). Sections: Avatars gallery
(getCardArtUrl), Album completion bars, Titles/Card Backs as honest counts. Gates: crawl-grade
(real-shaped fixture per category, empty state, console, 360/768), SW bump v19→v20.

BUILD TRAP: getCardArtUrl(card) reads card.name, but avatars store CardDefId (defId, e.g. "Uatu").
card-data.json has BOTH name and defId — resolve defId→name (or defId→art) for avatar thumbnails
(see b3aaf15 for the prior defId↔display-name fix).
