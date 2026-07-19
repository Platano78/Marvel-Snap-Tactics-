# Creator Decks — Feature Spec

Status: DESIGN SPEC (not yet implemented). Owner idea, 2026-07-19.

## 1. Overview

Surface top Marvel Snap content creators' decks — and the videos that go with them — inside
the app, scored against the user's own collection so a deck reads as "9/12 owned, build this
next" rather than a bare list of names.

This closes a real gap: the existing **Import Deck → Import from URL** flow
(`index.html:6291-6307`) is a stub that always returns `'URL import coming soon!'`
(`index.html:6303`) — there is currently no way to pull a deck from a creator's content into
the app at all except hand-typing a deck code. Creator Decks both fills that gap (curated,
maintainer-vetted decks import in one tap via the existing `decodeDeckCode`/`importFromCode`
path) and adds a discovery surface (video thumbnails, "what are top players running").

Binding constraints (from `CLAUDE.md`, `AGENTS.md`, `docs/design-canon.md`): single
`index.html`, CDN-only, no build step, no backend, offline-first, no *required* API keys,
Cosmic Purple canon UI, no invented numbers anywhere in the UI or docs.

## 2. Two-Tier Data Model

**Tier 1 — curated, offline-safe, maintainer-updated (like `card-data.json`).** Two new JSON
files at the repo root's `data/` directory, alongside the existing `data/meta-context.json`
and `data/spotlight-schedule.json` (same directory, same maintainer-update-and-commit
lifecycle described in `CLAUDE.md`'s "Static Data Maintenance" section).

**Tier 2 — optional, online, per-creator YouTube RSS.** Not committed data; fetched live
through the app's existing CORS-proxy pattern, cached in `localStorage` with a TTL. Entirely
additive — if it fails or the user is offline, Tier 1 still renders a full "Creators" section.

### 2.1 `data/creators.json`

```json
[
  {
    "id": "example-creator-slug",
    "name": "Display Name",
    "channelId": "UCxxxxxxxxxxxxxxxxxxxxxx",
    "avatarUrl": "https://.../avatar.jpg",
    "links": {
      "youtube": "https://youtube.com/@handle",
      "twitter": "",
      "twitch": ""
    }
  }
]
```

| Field | Type | Notes |
|---|---|---|
| `id` | string | Stable slug, referenced by `creator-decks.json` entries. Kebab-case. |
| `name` | string | Display name shown on avatar chips and deck cards. |
| `channelId` | string | YouTube channel ID (the `UC…` form), required for the Tier-2 RSS URL. Not the `@handle`. |
| `avatarUrl` | string | Direct image URL. Rendered `rounded-full` per canon (§5). No API key needed — a plain static image URL, maintainer-sourced. |
| `links` | object | Optional outbound links; empty string when unknown, never omitted (keeps consumers from having to `?.`-guard every field). |

### 2.2 `data/creator-decks.json`

```json
[
  {
    "deckCode": "SW5yb24gTWFuLEh1bGssLi4u",
    "deckName": "Example Deck Name",
    "creatorId": "example-creator-slug",
    "publishedDate": "2026-07-01",
    "videoUrl": "https://youtube.com/watch?v=xxxxxxxxxxx",
    "notes": "One-line maintainer note on why this deck is featured."
  }
]
```

| Field | Type | Notes |
|---|---|---|
| `deckCode` | string | Base64 export string in the exact format `decodeDeckCode` already parses (§3.1). Maintainer captures this from the creator's video/description, not synthesized. |
| `deckName` | string | Display name for the deck card. |
| `creatorId` | string | Foreign key into `creators.json[].id`. |
| `publishedDate` | string | ISO date (`YYYY-MM-DD`), used for sort-by-recency and to show deck age. |
| `videoUrl` | string | Full YouTube watch URL. Used for tap-through (§4) and to derive the thumbnail (§4.2). |
| `notes` | string | Optional, maintainer-authored, empty string if none. Never AI-invented. |

Both files load the same way `card-data.json` does — `fetch('./data/creator-decks.json')` /
`fetch('./data/creators.json')` at component mount, no loader class needed given their small
expected size (a few dozen entries), matching the direct-fetch pattern already used for
`data/meta-context.json` in the Oracle/Meta section rather than the `CardDataLoader` class
pattern (that class exists specifically to layer the fallback/enrichment logic
`card-data.json` needs; these two files don't need it).

## 3. Buildability

### 3.1 Deck-code format (verified against `decodeDeckCode`, `index.html:6239-6288`)

The game's deck-export string is **base64-encoded, comma-separated abbreviated card codes**
— not JSON. Concretely, `decodeDeckCode(input)`:

1. Loads `CardDataLoader.load()` first so `defId` matching has real data (fallback data lacks
   `defId`).
2. Accepts either a bare base64 string or a full pasted export (with `#` comment lines) —
   it regex-finds the base64 line via `/^[A-Za-z0-9+/=]{20,}$/` (`index.html:6246`).
3. `atob(code)` decodes to a comma-separated list of abbreviated card codes, e.g. `Fntmx8` for
   Fantomex (`index.html:6237-6250`).
4. Requires exactly 12 entries or throws (`index.html:6251`).
5. Resolves each abbreviation to a display name via `matchCard` (`index.html:6254-6282`), in
   order: exact `defId` match (case-insensitive) → consonant-pattern match (game
   abbreviations strip all vowels including `y`, per the comment at `index.html:6263`) →
   partial-name-prefix fallback → throws `Unknown card code` if nothing matches.
6. Returns `cardCodes.map(matchCard)` — an array of 12 display names.

**Implication for Creator Decks:** `creator-decks.json[].deckCode` must be a real base64
export string in this exact abbreviated-code format (copy-pasted from the game or a creator's
video description), not hand-authored. The existing `importFromCode` handler
(`index.html:6309-6319`) already does exactly `decodeDeckCode` → `setSelectedCards` →
`setView('create')` — Creator Decks reuses `decodeDeckCode` directly (no new decoder needed)
to get the 12 display names, then diffs those names against `collection.owned` for the
buildability badge, and can call `importFromCode`'s same three-line sequence (with the
decoded names pre-filled) to hand off into the existing deck editor for a full import.

### 3.2 Buildability badge

For each creator deck, decode `deckCode` once (cache the resolved `{names, error}` per
`deckCode` in component state — do not re-decode on every render), then:

```
ownedCount = names.filter(n => collection.owned.includes(n)).length
```

- `ownedCount === 12` → emerald buildability badge ("Buildable now"), emerald being
  semantic-only per canon rule 1 (`docs/design-canon.md:26`).
- `ownedCount < 12` → neutral badge showing `${ownedCount}/12 owned`, matching the existing
  `stats.ownedCount === 12 ? 'text-stitch-green' : 'text-[#ffd700]'` convention already used
  for deck ownership counts in the Decks list (`index.html:6440`).
- `decodeDeckCode` throw (bad/stale code) → hide the buildability row entirely, show a plain
  "deck code unavailable" note instead of a fake badge. Never show a badge computed from a
  partial or failed decode.

### 3.3 Missing-card art chips

Render the missing (`names.filter(n => !collection.owned.includes(n))`) cards as small art
chips using `getCardArtUrl` + `cardLookup.get(name)`, the same lookup pair the Decks tab
already uses for its card-pill row (`index.html:6453-6462`). Reuse the fixed-size-container +
`onError` fallback idiom mandated by canon rule 5 (`docs/design-canon.md:31`), matching the
`card-art card-art-fallback` absolute-fill pattern at `index.html:6416`.

### 3.4 "Closest build" substitution — **needs a data prerequisite, flagged as a blocker**

The natural mechanism is the existing `findSubstitutes(cardName, ownedCards, allCards)`
(`index.html:5038-5079`): for each missing card, it returns up to 5 owned cards that share a
`tags` entry with the target, scored `matchingTags.length * 10 - costDiff`, sorted best-first.

**Verified blocker:** `findSubstitutes` returns `[]` immediately whenever
`!targetCard.tags || targetCard.tags.length === 0` (`index.html:5041`). `card-data.json` (3465
lines, current repo) contains **zero** `"tags"` fields — `grep -c '"tags"' card-data.json` →
`0`. So `findSubstitutes` is presently dead code in practice: it always returns an empty
array for every card, regardless of collection. This isn't a Creator-Decks-specific gap, but
Creator Decks is the first feature that would visibly depend on it working.

Two options, both out of scope for this doc to decide (see Open Questions §8):
1. **Backfill `tags` into `card-data.json`** (archetype/synergy tags — "Destroy", "Ongoing",
   "Move", etc.) as a maintainer data task, unblocking `findSubstitutes` for every feature
   that already calls it (it's also invoked from the AI advisor's substitution context,
   `index.html:5081-5110`), not just this one.
2. **Ship Creator Decks without "closest build" in slice 1** (owned/12 badge + missing-card
   chips only, §3.2–§3.3, which need no tags), add substitution suggestions as a later slice
   once `tags` exist.

Recommendation: (2). Don't block the whole feature on a data-backfill task that belongs to
`card-data.json` maintenance, not this spec.

## 4. Tier 2 — Live Creator Content (Optional, Online)

### 4.1 CORS-proxy pattern (verified against `fetchWithCorsProxy`, `index.html:8549-8575`)

The app already has exactly one established remote-fetch pattern, used today for the
Database tab's "Refresh Card Data" feature (`refreshCardData`, `index.html:8577+`):

```js
const fetchWithCorsProxy = async (url) => {
  const CORS_PROXIES = [
    (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
    (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`
  ];
  // 1. try a direct fetch first (works if the target sends CORS headers)
  // 2. on failure, walk CORS_PROXIES in order, first success wins
  // 3. throws 'All fetch methods failed (CORS blocked)' if everything fails
};
```

Creator Decks' Tier 2 reuses `fetchWithCorsProxy` verbatim against each subscribed creator's
YouTube RSS feed: `https://www.youtube.com/feeds/videos.xml?channel_id=<channelId>`. This is
YouTube's public, no-API-key RSS endpoint — it returns the channel's recent uploads as Atom
XML (title, link, published date, thumbnail-bearing `media:group` — parse with
`DOMParser().parseFromString(text, 'text/xml')`, no dependency needed). No `content-type:
application/json` — response body must be read as `.text()` not `.json()`, unlike the
existing `refreshCardData` call sites.

### 4.2 Thumbnails — no API key

`https://img.youtube.com/vi/<videoId>/mqdefault.jpg` in a plain `<img>` tag. `videoId` is
parsed out of each RSS entry's `<link href="https://www.youtube.com/watch?v=VIDEO_ID">` (or,
for `creator-decks.json` entries that ship with a `videoUrl` directly, parsed the same way
from that field). No API key, no proxy needed for the image itself — `img.youtube.com` sends
permissive CORS/embedding headers, unlike the RSS feed. Give it the same fixed-container +
`onError` treatment as card art (canon rule 5) since thumbnails are exactly as likely to
404/rate-limit as card art.

### 4.3 Tap-through: link-out, not embed (recommendation, argued)

Recommend **link-out to YouTube** (`window.open(videoUrl, '_blank')` / plain `<a>`), not an
embedded `<iframe>` player. Reasons:
- `youtube-nocookie.com` iframe embeds still pull the full YouTube IFrame Player API script
  from a third-party origin — a break from "no build step, no bundler," and the CSP an
  offline-first PWA would want (`connect-src`/`frame-src` locked to same-origin plus the two
  CORS proxies and YouTube RSS/thumbnail hosts) gets substantially looser to allow an
  embedded player iframe.
- The service worker's fetch handler explicitly no-ops on cross-origin requests
  (`url.origin !== location.origin` → early `return`, `sw.js:248-250`) — an iframe player is
  cross-origin by construction and would never benefit from any of the app's caching/offline
  strategy anyway; there's no offline story for an embedded player.
- Link-out matches the existing "Import from URL... coming soon" intent in the Decks tab —
  the app has never tried to render third-party video/page content in-app; it links out
  (`marvelsnapzone.com`, `untapped.gg` in the URL-import stub).
- Con, for the doc to be honest about it: link-out costs a context switch (leaves the app).
  If user testing says that hurts adoption, an inline embed is a valid slice-3+ revisit, but
  it should be its own decision with its own CSP change, not bundled into slice 1.

### 4.4 TTL cache + failure states

`localStorage` key `snap_creator_feed_cache` (following the existing `snap_*` naming
convention, `docs/project_notes/key_facts.md`), shaped like the existing
`CardDataManager`/`snap_card_cache` pattern already in `CLAUDE.md` (`{ data, timestamp }`,
24h `CACHE_DURATION`) — reuse that exact shape, keyed per `channelId`, so a stale-entry check
is `Date.now() - timestamp > CACHE_DURATION`.

Failure/state matrix:

| Condition | Behavior |
|---|---|
| Offline (or Tier 2 fetch fails, cache empty) | Tier 1 "Creators" section renders fully (avatars, deck cards, buildability, missing-card chips). No video thumbnails; a small "Videos need a connection" note replaces the video row per creator. |
| Offline, cache has a stale entry | Show the stale cached thumbnails/titles with an "as of &lt;date&gt;" note rather than nothing — same spirit as the existing SWR pattern for `card-data.json` (`sw.js:284-294`), just implemented in-app since RSS XML isn't one of the SW's precached/SWR-listed URLs (§6). |
| `fetchWithCorsProxy` throws (both proxies down) | Same as offline: fall back to cache if present, else hide the video row for that creator only — never block the Tier-1 deck card on a Tier-2 failure. |
| `creator-decks.json` or `creators.json` itself fails to load (rare, they're precached) | Hide the entire Creators section — don't render a broken/empty state, since without Tier 1 there's nothing to show at all. |

## 5. UI Spec (Cosmic Purple canon)

- **Creator avatar chips**: `rounded-full` per canon `roundness: ROUND_FULL` for interactive
  controls (`docs/design-canon.md:12`), horizontal scroll row at the top of the Creators
  section, each chip = avatar image (`w-12 h-12 rounded-full object-cover`) + name label
  below, tapping filters the deck list to that creator (client-side filter, no navigation).
- **Deck cards**: `rounded-2xl` panel matching the existing Decks-tab deck card container
  (`index.html:6395`, `rounded-2xl p-5 bg-stark-surface border border-[rgba(173,43,238,0.18)]`),
  containing:
  - Creator avatar (small, `rounded-full`) + name + `publishedDate`, top row.
  - **Art signature row** — reuse the exact Sweep 4 pattern verbatim
    (`index.html:6407-6423`): `flex -space-x-3` overlapping first-4-cards strip,
    `w-10 aspect-[3/4] rounded-lg overflow-hidden border-2 border-stark-surface`, art via
    `getCardArtUrl`, `card-art card-art-fallback` absolute-fill placeholder underneath,
    `onError` hide, `+N` overflow tile past 4 cards.
  - Buildability badge (§3.2) — emerald (`text-stitch-green`, canon's one semantic-only
    color) when `12/12`, else the existing gold `#ffd700` "N/12 owned" convention.
  - Missing-card chips (§3.3) when not fully buildable.
  - `notes` (if non-empty), small muted text.
  - Video thumbnail (if Tier 2 resolved one), `aspect-video rounded-lg`, tap-through per §4.3.
  - Primary action: "Import This Deck" button — `bg-cosmic-purple-text` pill, wires to
    `decodeDeckCode(deckCode)` → `setSelectedCards` → `setView('create')`, i.e. the exact
    `importFromCode` sequence (`index.html:6309-6319`) with the code pre-supplied instead of
    typed.
- No new color introduced — emerald stays semantic-only (canon rule 1), gold stays rare
  (used only for the existing "not fully owned" convention, not decoratively).
- Empty-collection / zero-owned-cards teaser (no creators loaded, or all decks 0/12): follow
  the existing "art-forward teaser, not a barren panel" idiom already used for the empty
  Decks-list state (`index.html:6359-6382`) rather than inventing a new empty-state pattern.

## 6. Placement

**Recommendation: a "Creators" section inside the existing Decks tab**, below the deck list
(or as a second sub-view reached by a segmented control at the top of the Decks tab —
implementation detail for slice 1, not this doc), **plus** a tile in Settings → "More
Features" (`index.html:8908-8943`, the existing `grid grid-cols-2 gap-2` of
`stitch-list-item` buttons dispatching `setActiveTab` `CustomEvent`s — Creator Decks would
add one more `stitch-list-item` button dispatching `setActiveTab: 'decks'` with a query param
or app-state flag to land directly on the Creators sub-view).

Alternatives considered and rejected:
- **New top-level nav tab** — `AGENTS.md` and the nav itself are explicit that nav is "at
  capacity" (5 tabs: Dashboard/Collection/History/Calculator/Settings-adjacent Oracle etc.
  per the existing routing table); adding a 6th contradicts the brief and the mobile-first
  bottom-nav real-estate constraint.
- **Folding into the AI Advisor / Oracle tab** — tempting since Oracle already synthesizes
  meta context, but Creator Decks is fundamentally deck-browsing, not chat — it belongs next
  to the other deck-browsing surface (the Decks tab), not bolted onto a conversational UI.
- **Standalone panel off the Dashboard** — Dashboard is deliberately kept to "quick stats +
  quick match entry + AI chat input" per `CLAUDE.md`'s nav spec; a whole creator-deck browser
  there would violate that scope.

## 7. Service Worker Changes

Two changes to `sw.js`, both small and localized:

1. **Precache** (`OFFLINE_ASSETS`, `sw.js:12-22`): add `'./data/creator-decks.json'` and
   `'./data/creators.json'`, following the existing pattern for `data/meta-context.json` /
   `data/spotlight-schedule.json` (already in that array). Requires bumping `CACHE_NAME`
   (`sw.js:2`, currently `'snapapoulous-stitch-v4'` → `v5`) per the SW's own versioning
   convention, same as any `OFFLINE_ASSETS` change.
2. **Stale-while-revalidate whitelist** (`sw.js:285`): add
   `|| event.request.url.includes('creator-decks.json') || event.request.url.includes('creators.json')`
   to the existing SWR branch condition, so both files behave like `card-data.json` — serve
   cached instantly, refresh in background when online.

**Tier 2 is explicitly NOT added to `sw.js`.** The YouTube RSS/XML fetches
(`www.youtube.com/feeds/videos.xml`) and the CORS-proxy requests that wrap them are
cross-origin and hit the SW's early-return branch (`url.origin !== location.origin`,
`sw.js:248-250`) — the SW never sees them; they're handled entirely in-app via the TTL
`localStorage` cache (§4.4), not via Cache Storage. `img.youtube.com` thumbnail requests are
likewise cross-origin and un-intercepted by the SW (falls through to ordinary browser HTTP
caching, same as any other external `<img>` today — no special-casing needed, unlike the
`marvelsnapzone.com` card-art branch at `sw.js:206-222` which exists only because that host is
the *primary* art source the whole app depends on).

## 8. Implementation Plan — 3 Slices, Hard Gates

**Slice 1 — Tier 1 only (offline-safe core).**
- Add `data/creators.json`, `data/creator-decks.json` (seeded per Open Questions §9), wire
  `sw.js` precache + SWR (§7).
- Creators section in Decks tab: avatar chips, deck cards (art signature row, §5), owned/12
  badge (§3.2), missing-card chips (§3.3), "Import This Deck" wired to `decodeDeckCode` (§3.1).
- Settings "More Features" tile (§6).
- **Gate:** app works fully offline with the section populated (airplane-mode manual check);
  every seeded `deckCode` decodes via `decodeDeckCode` without throwing (script/manual check
  against all seed entries); no new top-level nav item added; no network call fired from this
  slice's code path.

**Slice 2 — Tier 2 (live video row).**
- `fetchWithCorsProxy` against YouTube RSS per creator (§4.1), thumbnail rendering (§4.2),
  TTL cache (§4.4), full failure-state matrix (§4.4 table).
- **Gate:** with network fully disabled, Slice 1's UI is pixel-identical (no broken image
  icons, no hung spinners) — Tier 2 failure must be invisible-by-degradation, not
  visible-by-error; with a proxy artificially failed (block one host), the other proxy or the
  cache still serves; a manual "kill both proxies" test falls back to the offline behavior,
  not a thrown error surfaced to the user.

**Slice 3 — Substitutions ("closest build"), conditional.**
- Only after the `tags` backfill decision in §3.4 Open Questions is resolved. Wires
  `findSubstitutes` per missing card.
- **Gate:** blocked/skipped entirely if `card-data.json` has no `tags` coverage by the time
  this slice starts — do not ship a "closest build" UI backed by a function that silently
  returns `[]` for every card, since that reads as a bug (empty suggestions) rather than an
  honest "not available."

## 9. Open Questions for Owner

1. **Which creators to seed?** The following are **SUGGESTIONS ONLY — not verified, not
   confirmed, need owner sign-off** before any `channelId`/`avatarUrl` is committed to
   `data/creators.json`. They are widely-known Marvel Snap YouTube creators by general
   reputation, not independently confirmed by this research pass:
   - Zoo (SnapZoo)
   - Alexander (Snap Judgement / similar)
   - TrackStar
   - Reddit user u/... / community "meta report" channels (name TBD)
   - Marvel Snap Zone's own YouTube channel (distinct from the `marvelsnapzone.com` site
     already used for card art/URL-import)
   - Brody / EZmoneysniper-style deck-tech channels (name TBD)

   These six are placeholders to react to, not a shipped list. The actual `channelId` values
   (the `UC…` form) must be looked up per-channel and are not guessed here.

2. **Embed vs link-out** (§4.3) — this doc recommends link-out for slice 1. Confirm, or flag
   if in-app embed is a hard requirement (changes CSP scope and SW behavior notes above).

3. **Tier 2 on by default, or opt-in?** Options: (a) on by default, silent-degrade per the
   failure matrix (§4.4) — simplest, matches how `refreshCardData`'s CORS-proxy fetches
   already run without an explicit opt-in toggle; (b) opt-in toggle in Settings (consistent
   with the RapidAPI key being explicitly user-provided, though that feature was later
   removed as a dead stub per `key_facts.md`). Recommendation leans (a) for consistency with
   the one existing remote-fetch feature, but flagging since Tier 2 makes a background
   network call slice 1 does not.

4. Should `creator-decks.json` entries carry an explicit `series`/`archetype` tag apart from
   the `tags` backfill in §3.4, to allow filtering the Creators section by archetype even
   before substitutions ship? Not scoped in this doc — raise only if wanted.
