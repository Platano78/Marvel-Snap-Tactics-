# Marvel Snap acquisition economics — research (2026-07-20)

Research gate for Adoption Slice 4 (series completion-cost projection). Web research via two
independent sources. Records the per-series token costs the app authors into a static
`SERIES_TOKEN_COST` table, plus the honest caveats that bound the projection.

## Sources
- **Official**: marvelsnap.com (Second Dinner) — token-shop / pack pricing.
- **Community**: marvelsnapzone.com — corroborated the same numbers (fetched via search-index
  snippets; direct WebFetch returned 403 on all attempts, so treat MSZ as confirmation of the
  official numbers, not an independent primary capture). Numbers agreed everywhere they overlapped.
- Researched 2026-07-20. Confidence: HIGH on the per-tier direct-purchase token costs (two-source
  agreement); MEDIUM on pack values; the weekly-income figure (~1,986 tokens/wk) is a derived
  community estimate — NOT used by the feature.

## KEY FINDING — the old Key/Cache system is RETIRED
The Spotlight Cache + Spotlight Key gacha system was retired **April 29, 2025**, replaced by
**Snap Packs + direct Token Shop purchases**. Any "keys needed" projection describes a dead
mechanic. Slice 4 is **tokens-only** — do NOT build key/cache UI. (The plan's "tokens/keys"
wording predates this finding.)

## Token cost per series (direct purchase — guaranteed exact card)
| Game series | Direct token cost / card | Snap Pack (cheaper, random-within-series, no dupes) |
|---|---|---|
| Series 3 | **1,000** | Collector's Pack 650 |
| Series 4 | **3,000** | Collector's Pack 2,000 |
| Series 5 | **6,000** | Collector's Pack 4,000 |
| Spotlight (newest rotation) | treat as **6,000** (S5-tier) | newest cards may be pack-only at debut |
| Series 1, Series 2, Starter | **not token-purchasable** | earned via Collection-Level track (credits/boosters) |

Notes:
- S3 direct-buy is now a *random unowned* S3 card (not pick-your-own), but the per-card token
  price is unchanged, so the completion math (missing × price) still holds.
- Snap Packs never dupe within a series, so N packs ≈ N new cards — the cheaper efficient path.
  The feature shows **direct guaranteed cost** as the headline (the simplest honest "tokens to
  finish" number) and may note packs as a cheaper alternative.

## Caveats the UI must carry (honest-UI)
1. **Snapshot, not live**: per-tier prices are stable, but Second Dinner moves cards between
   series **card-by-card with no fixed schedule**, so a card's series (and thus its cost) drifts.
   The projection reflects card-data.json's CURRENT `series` assignments as of the last maintainer
   refresh — label it a snapshot.
2. **Token-purchasable tiers only**: Series 1/2 + Starter cards are NOT bought with tokens — show
   their missing COUNT but no token figure (omit, don't fake).
3. **Keys are gone** — tokens only.

## Cost table to author (index.html)
```js
// Direct-purchase token cost per game series (research: docs/research/acquisition-economics-2026-07-20.md)
// null = not token-purchasable (Collection-Level / credits track)
const SERIES_TOKEN_COST = {
  'Starter': null, 'Series 1': null, 'Series 2': null,
  'Series 3': 1000, 'Series 4': 3000, 'Series 5': 6000, 'Spotlight': 6000,
};
```
