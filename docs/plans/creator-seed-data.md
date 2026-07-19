# Creator Decks — Verified Seed Data

Status: RESEARCH OUTPUT, ready to transform into `data/creators.json` +
`data/creator-decks.json`. Companion to `docs/plans/creator-decks-feature.md` §9.

Research date: 2026-07-19. Repo HEAD at research time: `cc952a7`.

**OWNER RULING (2026-07-19, second pass):** the creator list is now canonical — four named
creators (Regiskillbin, Bynx, Alexander Coccia, SnapsterTV) replace the open candidate search
from the first research pass. §1 below covers exactly these four. Everything verified-active in
the first pass that isn't one of these four moves to §5 ("Bench" — verified, not seeded, kept in
case the owner wants more later). Everything found to be stale/wrong/inactive stays in §6
("Dropped"), unchanged from the first pass.

**Method note (unchanged from pass 1 — read before using this data):** Every `channelId` was
extracted from the live channel page's `"externalId"` field (fetched via `curl`, not the YouTube
API) and independently confirmed by fetching that exact channel's public RSS feed
(`https://www.youtube.com/feeds/videos.xml?channel_id=<id>`), reading the first `<entry>`'s
title/date/link — pasted verbatim below. Every card name in every deck was checked with a Python
script against this repo's `card-data.json` (exact-string match on `name` or `defId`). Nothing
below was typed from memory; anything unverifiable is in §5/§6, not folded into the tables.

---

## 1. Canonical Creators (4 of 4 verified)

All four posted Marvel Snap content within the last 24 hours of the research date
(2026-07-19) — the two new names (Regiskillbin, SnapsterTV) are both same-day-active,
posting multiple times a week.

| id | name | channelId | canonical URL | avatarUrl |
|---|---|---|---|---|
| `regiskillbin` | RegisKillbin | `UCbt1SGMrWj5Q7TMXAfmTERQ` | https://www.youtube.com/@RegisKillbin | `https://yt3.googleusercontent.com/ytc/AIdro_nZvSYOBpU1gZGCasRxgT5U1jsL5DutI19wtcBW-wjNPgc=s900-c-k-c0x00ffffff-no-rj` |
| `bynx-plays` | Bynx_Plays | `UCrHCec2oVPLvJQR43pjiVFg` | https://www.youtube.com/@Bynx_Plays | `https://yt3.googleusercontent.com/zh4pwYNNkWs3Dh5UGwATfXjdI0giJcib4IMpwaViXK2nyxmXRE298e2yuZmfCNshIs2pIM88=s900-c-k-c0x00ffffff-no-rj` |
| `alexander-coccia` | Alexander Coccia | `UCoJqslowQxACrT3msrmKJLg` | https://www.youtube.com/@AlexanderCoccia | `https://yt3.googleusercontent.com/-qf1e1Gbsuj2ZkAdivAUOf51yVyGlAgiCiOl0Dqj6sSArXyR3Z6tfzJcX4aJwKw-jFeh2uXGiA=s900-c-k-c0x00ffffff-no-rj` |
| `snapstertv` | SnapsterTV | `UCdF0CzSQ4-GXsdDf83sNJmQ` | https://www.youtube.com/@SnapsterTV | `https://yt3.googleusercontent.com/PAKjmrU6NK9TeotRKvYriwiwfDw2FP9gdFgX7CLwWbLBchQcOB3vvsrEtrE7yuMzFbKIY2UnnQ=s900-c-k-c0x00ffffff-no-rj` |

### 1.1 RSS proof (hard gate — one live entry per creator)

Fetched via `curl -A "Mozilla/5.0" "https://www.youtube.com/feeds/videos.xml?channel_id=<id>"`,
first `<entry>` shown:

- **RegisKillbin** (`UCbt1SGMrWj5Q7TMXAfmTERQ`): *"I have entered THE VOID of despair..."* —
  published `2026-07-19T04:56:56+00:00` — https://www.youtube.com/watch?v=KfVDSCKzZhQ. Video is
  confirmed Marvel Snap content (description opens "Marvel Snap | I have entered THE VOID of
  despair...", includes an untapped.gg decklist link).
- **Bynx_Plays** (`UCrHCec2oVPLvJQR43pjiVFg`): *"Mother Askani Dead? Play The Other Broken Cards!
  | Marvel SNAP"* — published `2026-07-18T05:18:04+00:00` —
  https://www.youtube.com/watch?v=BMhWb8QzX6o. (Re-confirmed same as first pass — still current.)
- **Alexander Coccia** (`UCoJqslowQxACrT3msrmKJLg`): *"the latest marvel snap balance update is
  pretty good"* — published `2026-07-16T21:01:49+00:00` —
  https://www.youtube.com/watch?v=O9SwtV2bzQM. (Re-confirmed same as first pass — still current.)
- **SnapsterTV** (`UCdF0CzSQ4-GXsdDf83sNJmQ`): *"The Best 2099 Deck I've Tried SO FAR!"* —
  published `2026-07-19T11:00:12+00:00` — https://www.youtube.com/watch?v=5o0QrWmu5JI. Description
  confirms Marvel Snap (Twitch: twitch.tv/dekkster, Twitter: @DekksterGaming).

### 1.2 Important identity note — SnapsterTV vs. "Dekkster/Snapster" from pass 1

Pass 1 found and **dropped** a channel handled `@DekksterSnap` (`UCgGD2hAYPE83x7iDKqph_Kg`,
stale since 2025-11-24) after a secondary source said "Snapster rebranded to Dekkster." That
channel and **this** one (`SnapsterTV`, `UCdF0CzSQ4-GXsdDf83sNJmQ`) are **not the same channel**,
but per the video descriptions fetched this pass, they're **the same person** — SnapsterTV's own
description reads "Link to Twitch VODs and other highlights from Dekkster/Snapster's streams,"
and every SnapsterTV video links `twitch.tv/dekkster` / `@DekksterGaming`. Read as: Dekkster now
runs SnapsterTV as the live/active channel; `@DekksterSnap` is a dormant older one. The owner's
pick (SnapsterTV) is the correct, currently-active one — flagging the overlap so the two aren't
confused if `@DekksterSnap` resurfaces later.

### 1.3 Avatar URLs

Both extracted from the same cached channel-page fetches used for the `channelId`/RSS
verification (the `"avatar":{"thumbnails":[{"url":"..."` field in the raw HTML) — same method as
the other two creators, not guessed.

---

## 2. `data/creators.json`-ready records (canonical 4)

```json
[
  {
    "id": "regiskillbin",
    "name": "RegisKillbin",
    "channelId": "UCbt1SGMrWj5Q7TMXAfmTERQ",
    "avatarUrl": "https://yt3.googleusercontent.com/ytc/AIdro_nZvSYOBpU1gZGCasRxgT5U1jsL5DutI19wtcBW-wjNPgc=s900-c-k-c0x00ffffff-no-rj",
    "links": { "youtube": "https://www.youtube.com/@RegisKillbin", "twitter": "", "twitch": "" }
  },
  {
    "id": "bynx-plays",
    "name": "Bynx_Plays",
    "channelId": "UCrHCec2oVPLvJQR43pjiVFg",
    "avatarUrl": "https://yt3.googleusercontent.com/zh4pwYNNkWs3Dh5UGwATfXjdI0giJcib4IMpwaViXK2nyxmXRE298e2yuZmfCNshIs2pIM88=s900-c-k-c0x00ffffff-no-rj",
    "links": { "youtube": "https://www.youtube.com/@Bynx_Plays", "twitter": "https://twitter.com/Bynx_Plays", "twitch": "https://www.twitch.tv/Bynx_Plays" }
  },
  {
    "id": "alexander-coccia",
    "name": "Alexander Coccia",
    "channelId": "UCoJqslowQxACrT3msrmKJLg",
    "avatarUrl": "https://yt3.googleusercontent.com/-qf1e1Gbsuj2ZkAdivAUOf51yVyGlAgiCiOl0Dqj6sSArXyR3Z6tfzJcX4aJwKw-jFeh2uXGiA=s900-c-k-c0x00ffffff-no-rj",
    "links": { "youtube": "https://www.youtube.com/@AlexanderCoccia", "twitter": "https://twitter.com/AlexanderCoccia", "twitch": "https://www.twitch.tv/alexandercoccia" }
  },
  {
    "id": "snapstertv",
    "name": "SnapsterTV",
    "channelId": "UCdF0CzSQ4-GXsdDf83sNJmQ",
    "avatarUrl": "https://yt3.googleusercontent.com/PAKjmrU6NK9TeotRKvYriwiwfDw2FP9gdFgX7CLwWbLBchQcOB3vvsrEtrE7yuMzFbKIY2UnnQ=s900-c-k-c0x00ffffff-no-rj",
    "links": { "youtube": "https://www.youtube.com/@SnapsterTV", "twitter": "https://twitter.com/DekksterGaming", "twitch": "https://www.twitch.tv/dekkster" }
  }
]
```

All four `avatarUrl`s are sourced the same way (channel-page `"avatar"` field, §1.3) — none
guessed. As noted in the pass-1 doc, `yt3.googleusercontent.com` URLs can rotate on avatar
changes; re-verify or fall back to the UI's initials-chip if any 404 by implementation time.

---

## 3. Decks — format finding (unchanged from pass 1, still binding)

`decodeDeckCode` (feature spec §3.1) requires the game's **native** base64 export —
`atob(code)` must yield a comma-separated list of abbreviated codes like `Fntmx8`.

All decks found for the canonical 4 in this pass — Regis, Bynx, and Coccia all share decks via
**untapped.gg deck-builder links** in their video descriptions, which encode the deck as
full-slug `defId`s in the URL path (e.g. `Blade-BuckyBarnes-Carnage-Fantomex-...`), not the
game's abbreviated base64 export. Confirmed again this pass (same method as pass 1): the base64
blob embedded on an untapped.gg deck page decodes to **JSON**
(`{"Name":"...","Cards":[{"CardDefId":"..."}]}`), not `decodeDeckCode`'s expected format.

**None of the canonical 4's decks below have a working `deckCode`.** This is a real gap versus
pass 1's KM Best decks (§5a, bench), which did paste literal in-game exports. Flagging plainly:
if the implementer wants the canonical-4 creators AND working "Import This Deck" buttons in
slice 1, either (a) accept card-list-only browsing for these four (no import action) as a schema
variant, or (b) supplement with the bench KM Best decks (§5a) which do have real `deckCode`s,
under a `creatorId` the owner would need to bless separately since KM Best isn't in the canonical
4. Not deciding this — flagging for the owner/implementer.

---

## 4a. RegisKillbin — 2 decks, card lists verified, no deckCode

### Deck 1 — "Easy Mode — #1 Deck" (Fantomex list) — 12/12 ✓ clean match

Source: video "EASY MODE. The latest #1 DECK will destroy them!" — published `2026-07-13` —
https://www.youtube.com/watch?v=AxXvJilZLL0. Description: *"The deck with the highest win-rate
on Untapped.gg right now is this Fantomex list... This deck currently has the highest win-rate
from after Infinite according to the data on Untapped.gg."*

| Card | In `card-data.json`? |
|---|---|
| Blade | ✓ |
| Bucky Barnes | ✓ |
| Carnage | ✓ |
| Fantomex | ✓ |
| Gambit | ✓ |
| The Hood | ✓ |
| Killmonger | ✓ |
| Marrow | ✓ |
| Mercury | ✓ |
| Shadow King | ✓ |
| Wild Child | ✓ |
| Zombie Captain Marvel | ✓ |

Source deck link:
`https://snap.untapped.gg/en/decks/Blade-BuckyBarnes-Carnage-Fantomex-Gambit-Hood-Killmonger-Marrow-Mercury-ShadowKing-WildChild-ZombieCaptainMarvel_#1%20Deck`

### Deck 2 — "Tombstone Galactus" ("Galactustone") — 11/12

Source: video "TOMBSTONE GALACTUS!? I love this deck." — published `2026-07-12` —
https://www.youtube.com/watch?v=EmiO0FEtoyI. Description: *"I was looking for an excuse to play
more Tombstone, and trying him out in a Nimrod Galactus deck seemed absolutely perfect... This
deck had a strong 69% win-rate for me."*

| Card | In `card-data.json`? |
|---|---|
| Adamantium Infusion | ✓ |
| Arnim Zola | ✓ |
| Black Panther | ✓ |
| Fastball Special | ✓ |
| Galactus | ✓ |
| Kid Omega | ✓ |
| Magik | ✓ |
| Nimrod | ✓ |
| Shuri | ✓ |
| Symbiote Spider-Man | ✓ |
| **Tombstone** | **✗ not found — not in `card-data.json`** |
| Venom | ✓ |

Source deck link:
`https://snap.untapped.gg/en/decks/AdamantiumInfusion-ArnimZola-BlackPanther-FastballSpecial-Galactus-KidOmega-Magik-Nimrod-Shuri-SymbioteSpiderMan-Tombstone-Venom_Galactustone`

### Not promoted — Deck 3 (for the record)

"Rama-Tut's Balthakk" (video "THIS. IS. NUTS. I love Rama-Tut's Wong Balls!!", 2026-07-10,
https://www.youtube.com/watch?v=GteVkiNLY9k): Agamotto, King Eitri, **Lady Bullseye** (✗),
Luna Snow, Magik, **Mother Askani** (✗), Mystique, Prodigy, Quinjet, **Rama-Tut** (✗), Sage,
Wong — 9/12, three misses (all cards genuinely absent from `card-data.json`, not a sourcing
issue). Also worth noting: Regis's newest video that day (§1.1, "THE VOID of despair") is
explicitly a **joke/bad deck** ("Power Estimate: Do not play this deck. It is awful.") — real and
dated, but not promoted here since it's presented as a negative example, not a recommendation.

---

## 4b. Bynx_Plays — 1 deck, card list verified, no deckCode

*(Same deck already verified in pass 1 — re-included here since Bynx is now canonical, not just
bench.)*

### "Buff Riders" (Isca Buff deck) — 9/12

Source: "Let's Play Marvel SNAP! Here we spotlight an Isca Buff Deck!" —
https://www.youtube.com/watch?v=BMhWb8QzX6o (published `2026-07-18`, same video verified in
§1.1).

| Card | In `card-data.json`? |
|---|---|
| Agony | ✓ |
| America Chavez | ✓ |
| Brood | ✓ |
| Captain Carter | ✓ |
| Grand Master | ✓ |
| Gwenpool | ✓ |
| **Isca** | **✗ not found** |
| Mister Sinister | ✓ |
| **Stick** | **✗ not found** |
| **"StormHorseman" slug** | **✗ not found — likely a Storm Horseman variant not in `card-data.json`** |
| Wolverine Horseman of War | ✓ |
| Zabu | ✓ |

Source deck link:
`https://snap.untapped.gg/en/decks/Agony-AmericaChavez-Brood-CaptainCarter-GrandMaster-Gwenpool-Isca-MrSinister-Stick-StormHorseman-WolverineHorseman-Zabu_Buff%20Riders`

---

## 4c. Alexander Coccia — 2 decks, card lists verified, no deckCode

*(Same two decks already verified in pass 1 — re-included since Coccia is canonical.)*

### "Dormammu" — 11/12

Source: "TOP 10 BEST DECKS IN MARVEL SNAP | Weekly Marvel Snap Meta Report #192" — published
`2026-07-10` — https://www.youtube.com/watch?v=t_vrJXXJZGM (deck #4 of 10).

| Card | In `card-data.json`? |
|---|---|
| Bucky Barnes | ✓ |
| Carnage | ✓ |
| Death | ✓ |
| Debrii | ✓ |
| Dormammu | ✓ |
| Killmonger | ✓ |
| **Muse** | **✗ not found** |
| Squirrel Girl | ✓ |
| Uncle Ben | ✓ |
| Venom | ✓ |
| Weapon X Wolverine | ✓ |
| X-23 | ✓ |

Source deck link:
`https://snap.untapped.gg/en/decks/BuckyBarnes-Carnage-Death-Debrii-Dormammu-Killmonger-Muse-SquirrelGirl-UncleBen-Venom-WeaponXWolverine-X23_SNAP%20Deck`

### "Scream" — 11/12

Same source video, deck #7 of 10.

| Card | In `card-data.json`? |
|---|---|
| Aero | ✓ |
| Batroc the Leaper | ✓ |
| Kingpin | ✓ |
| Kraven | ✓ |
| Magneto | ✓ |
| Polaris | ✓ |
| Prowler | ✓ |
| Sam Wilson Captain America | ✓ |
| Scream | ✓ |
| Spider-Man | ✓ |
| **Spider-Man Brand New Day** | **✗ not found** |
| Stegron | ✓ |

Source deck link:
`https://snap.untapped.gg/en/decks/Aero-Batroc-Kingpin-Kraven-Magneto-Polaris-Prowler-SamWilson-Scream-SpiderMan-SpiderManBrandNewDay-Stegron_Scream`

---

## 4d. SnapsterTV — 0 verified decks (UNVERIFIED, not substituted)

Checked the latest deck-titled video ("The Best 2099 Deck I've Tried SO FAR!", 2026-07-19,
https://www.youtube.com/watch?v=5o0QrWmu5JI) plus three more from the preceding week ("This
Bounce Deck Felt AMAZING to me!" 07-16, "This is my New Favorite Creation!" 07-12, "I can't get
enough of this deck!" 07-14). **All four use the identical description template** pointing to an
external link, `https://tinyurl.com/DekksDecks`, rather than an inline decklist or a per-video
untapped.gg link like Regis/Coccia use.

Followed the redirect: `tinyurl.com/DekksDecks` → a **live, auto-updating** untapped.gg profile
page (`snap.untapped.gg/en/profile/<id>/<id>?...&timeRange=last7days`) showing "decks played in
the last 7 days." Fetched that page directly — its deck data loads via a client-side API call
after page load (Next.js hydration), not present in the static HTML (`grep`-checked for
`CardDefId` in the fetched HTML: zero matches). Getting real decks out of it would require either
executing the page's JS or reverse-engineering its API, both out of scope for a `curl`-based
verification pass, and neither would give a **specific, dated, video-attributed** deck the way
the other three creators' inline links do.

**Conclusion: SnapsterTV is a verified-active creator (§1) with zero verified decks from this
pass.** Not substituting a different SnapsterTV video or guessing at the "2099" deck's contents
— his current sharing pattern doesn't yield a statically-scrapable, video-specific decklist. If
the implementer wants a SnapsterTV deck, the untapped.gg profile link is real and could be
manually checked in a browser (or via an authenticated/JS-capable fetch) to grab whatever's live
at that time — but nothing here should be treated as sourced from that page since it wasn't
actually read.

---

## 5. Bench (verified-active in pass 1, not part of the canonical 4 — kept for later)

These three creators were independently verified the same way as §1 (real channelId, RSS-proven
recent activity) during the first, open-candidate research pass, before the owner's canonical
list arrived. Not seeded now, but real and ready if the owner wants to expand later.

| id | name | channelId | canonical URL | Latest RSS entry (proof) |
|---|---|---|---|---|
| `km-best` | KM Best: In A Snap | `UCxAk-60TmWvmnhGX1h6oFaQ` | https://www.youtube.com/@KMBestInASnap | *"This Is (Probably) The Best Deck In Marvel SNAP..."* — `2026-07-18T23:41:50+00:00` — https://www.youtube.com/watch?v=g6YrcqwIOIw |
| `educated-collins` | EducatedCollins Snap | `UCpLx2pIcvSq8gtqMf9vLd_g` | https://www.youtube.com/@EducatedCollinsSnap | *"Once Upon a Galaxy June Day 1 Tournament Review"* — `2026-06-20T23:00:03+00:00` — https://www.youtube.com/watch?v=jXSnnmjQups |
| `hooglandia` | Hooglandia Marvel Snap | `UCIrrsLO5q9ERnvw2XwE8MYA` | https://www.youtube.com/channel/UCIrrsLO5q9ERnvw2XwE8MYA | *"HIGHEST WIN RATE Marvel SNAP Decks after our latest card changes"* — `2026-07-18T04:23:28+00:00` — https://www.youtube.com/watch?v=firTMQ_xrGY |

**Bench avatarUrls** (captured in pass 1, still usable if promoted later):
- KM Best: `https://yt3.googleusercontent.com/WnFrPH8UiK5SVgcs2jm5l2u3zsxnQP9IjvqWFCtVjCdW_M2j18Ye6jz6kDPEcqHM-rgS1vGk2A=s900-c-k-c0x00ffffff-no-rj`
- EducatedCollins: `https://yt3.googleusercontent.com/igghD4BJnfVmOJonpbbwSSRHgDGECD5g84giDjr3PA4SdbI_0aJJps-VCnD6ShJXHq8uyAwO=s900-c-k-c0x00ffffff-no-rj`
- Hooglandia: `https://yt3.googleusercontent.com/3qstnXWPBbLJWSw6EtGXEqOS0k67BV5qlI39fuAKj3lXAsQqxne6rSW78JZ9oPJhGRcEmRlp=s900-c-k-c0x00ffffff-no-rj`

**Note on EducatedCollins:** verified-active, but contributed zero verified decks in pass 1 —
her Marvel Snap uploads are gameplay/tournament-review format, not deck-code posts (checked
"The Two Marvel Snap Decks I'm climbing with this Season," 2026-05-26, no deck code or card list
in its description).

### 5a. Bench decks — KM Best (the only bench creator with a working `deckCode`)

Source: "The BEST INFINITE Decks To CLIMB In MARVEL SNAP! | KMB Infinite Decks 7/12/26
Spider-Man BND Season" — published `2026-07-12T16:02:48-07:00` —
https://www.youtube.com/watch?v=pR5j55yqFQI. KM Best pastes the literal in-game export in his
video descriptions (confirmed by decoding: `atob(...)` → `Gmbt6,ShdwKngA,Bld5,...`, a valid
12-entry comma-separated abbreviation list — the exact format `decodeDeckCode` needs). This is
the **only** source across both research passes that yields a directly-usable `deckCode`.

**Deck A — "The Hood / Zombie Captain Marvel" — 12/12 ✓ clean match**

The Hood, Blade, Wild Child, Bucky Barnes, Carnage, Marrow, Gambit, Killmonger, Mobius M. Mobius,
Shadow King, Zombie Captain Marvel, Fantomex — all 12 confirmed in `card-data.json`.

`deckCode`: `R21idDYsU2hkd0tuZ0EsQmxkNSxNYnNNTWJzRCxabWJDcHRuTXJ2bDEzLEhkNCxCY2tCcm5zQixDcm5nNyxLbGxtbmdyQSxNcnJ3NixGbnRteDgsV2xkQ2hsZDk=`

**Deck B — "Sasquatch Wingbeat" — 11/12** (1 miss: Mother Askani, not in `card-data.json`)

Majestic Wingbeat, Quinjet, Elektra, Nico Minoru, Victoria Hand, Iron Patriot, Mirage, Mobius M.
Mobius, Gambit Horseman of Death, **Mother Askani (✗)**, Moon Girl, Sasquatch.

`deckCode`: `U3NxdGNoOSxNdGhyQXNrbkMsR21idEhyc21uRSxNYnNNTWJzRCxJcm5QdHJ0QixWY3RySG5kQyxOY01uckEsRWxrdHI3LFFuanQ3LE1yZzYsTWpzdGNXbmdidDEwLE1uR3JsOA==`

Four more KM Best decks (Quinjet Askani, Stardust Askani, SuGi Ozymandias, Batroc Movers) were
decoded and card-checked in pass 1 with more misses each (2-4 cards absent from
`card-data.json`) — full card lists and their `deckCode`s are preserved in git history of this
file (first-pass commit) if wanted; omitted here to keep the bench section focused.

### 5b. Bench decks — Hooglandia

**"High Evo" — 12/12 ✓ clean match.** Abomination, Armor, Cyclops, Enchantress, High
Evolutionary, Hulk, Misty Knight, Scorpion, Shang-Chi, Shocker, Sunspot, The Thing. Source:
`https://snap.untapped.gg/en/decks/Abomination-Armor-Cyclops-Enchantress-HighEvolutionary-Hulk-MistyKnight-Scorpion-ShangChi-Shocker-Sunspot-TheThing_High%20Evo`
(video https://www.youtube.com/watch?v=firTMQ_xrGY, 2026-07-18). No `deckCode` (untapped.gg
format, same §3 caveat).

**"Nimrods" — 12/12 ✓ clean match.** Adamantium Infusion, Arnim Zola, Black Panther, Carnage,
Fastball Special, Galactus, Kid Omega, Magik, Nimrod, Shuri, Symbiote Spider-Man, Venom. Source:
`https://snap.untapped.gg/en/decks/AdamantiumInfusion-ArnimZola-BlackPanther-Carnage-FastballSpecial-Galactus-KidOmega-Magik-Nimrod-Shuri-SymbioteSpiderMan-Venom_Galactus`
(same video). No `deckCode`.

---

## 6. Dropped (unchanged from pass 1 — stale, wrong, or unverifiable)

| Candidate | Why dropped |
|---|---|
| Cozy Snap (`UCJn355XRwzLd-klJxzkM_qw`) | RSS confirmed — latest upload `2025-10-07`, over 9 months stale. |
| DeraJN (`UCX36HWtZ5hdHyH4B-y0HOTA`) | RSS confirmed — latest upload `2025-12-04`, ~7.5 months stale. |
| Marvel Snap Zone YouTube channel (`UCO--WeKbS6I29Gf8AHrVBxw`) | RSS confirmed — latest upload `2024-06-02`, over 2 years stale. The **website** `marvelsnapzone.com` remains active and separate — do not conflate. |
| MOLT: Marvel Snap (`UCw8B21pKmlyx5TwaRa6Gtug`) | RSS confirmed — latest upload `2025-06-09`, over a year stale. |
| TLSG - Marvel Snap (`UC16zSeVc_i-vqx7JoEWaX2A`) | RSS confirmed — latest upload `2025-05-06`, over a year stale. |
| `@DekksterSnap` (`UCgGD2hAYPE83x7iDKqph_Kg`) | RSS confirmed — latest upload `2025-11-24`, ~8 months stale. **Same person as the now-canonical SnapsterTV** (see §1.2) but this specific channel is dormant — don't seed it. |
| The Snapshot podcast channel (`UCDIOMyLj4xKDNrAqkzZMm2Q`) | RSS confirmed — latest YouTube upload `2024-09-09`, over 2 years stale on YouTube. |
| Emperor AhnaldT101 (`UCuKkFu9WVxCRoj2EbWzIj3Q`) | RSS confirmed active (`2026-07-17`), but content has pivoted entirely to Star Wars: Galaxy of Heroes — no longer a Marvel Snap creator. |
| LmL | No distinct "LmL Marvel Snap" YouTube channel found via web search. Dropped rather than guessed. |

### Cards confirmed absent from `card-data.json` entirely (both passes combined)

Mother Askani, Rama-Tut, Ozymandias, Wilson Fisk, Spider-Man Brand New Day, Askani'son, Muse,
Isca, Stick, Storm (Horseman variant), Lady Bullseye, Venus, Tarantula, Boomerang, Triton,
Drax (Avatar of Life variant), Moondragon, Mary Jane, Jeff the Baby Dolphin, Jubilee/Silver
Surfer fusion card, **Tombstone** (new this pass). A `card-data.json` maintenance gap
independent of this feature — flagging for the implementer/maintainer, not fixing here.

---

## 7. Gate evidence summary

- `git status --short` at time of writing showed only this file (new/modified across both
  passes) plus a pre-existing unstaged edit to `docs/plans/creator-decks-feature.md` that
  predates this research work — no other files touched.
- Every `channelId` in §1 (canonical) and §5 (bench) is backed by a fetched RSS response with a
  real, dated, titled entry — none guessed or pattern-matched from a URL slug.
- Every card name in every deck in §4 and §5 was checked against a live `python3` read of this
  repo's `card-data.json` (433 entries) — ✓/✗ shown per card.
- SnapsterTV (§4d) is the one canonical creator with zero verified decks — documented as
  genuinely unverifiable with this pass's method (live client-hydrated profile page, not a
  static per-video decklist), not silently dropped or replaced.
