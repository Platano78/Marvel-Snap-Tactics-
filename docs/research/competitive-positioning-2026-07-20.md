# Competitive positioning — Snapapoulous Prime vs the Snap tracker market

**Date**: 2026-07-20 · **Provenance**: sonnet research agent (crew session), sources cited inline,
cross-checked 2+ where feasible; the agent's honest-gap list is preserved at the bottom. Treat
pricing/telemetry claims as point-in-time.

## The field

| App | What it is | Data acquisition | Cost |
|---|---|---|---|
| **Untapped.gg** (HearthSim) | Market leader; native desktop app + Android + web | Auto log-reading + live in-match HUD overlay; account required | Free + $4.99–7.99/mo premium |
| **SnapComplete** (Feb 2026) | Browser tracker, deep collection/cosmetics angle | Account-linked server-side real-time capture; "local by default" until sign-in (then Supabase/AWS) | Free + $3.33–5/mo premium |
| **Marvel Snap Zone Tracker** | Free Electron app from marvelsnapzone.com | Client-side; collection + match history + turn playback; no Android overlay | Free |
| **marvelsnap.pro** | Open-source Electron tracker | Reads the SAME local state JSONs our folder-sync reads — then **uploads to their server** | Free |
| **Snap.fan tracker** | Community tracker + stats site | Local card tracker, no overlay | Free |

## Where we genuinely differ (verifiable, no puffery)

1. **No account, ever** — every competitor wants a login for its best features or sync.
2. **Reads the game's own files and never phones home** — marvelsnap.pro uses the same technique
   but uploads; we are the only fully client-side one.
3. **AI deck builder constrained to the player's owned collection**, hallucination-proof
   validation, 6 providers including fully-local LLM — nobody else has AI assistance at all.
4. **Zero cost, zero infrastructure** — single file on Pages; competitors run servers and two
   charge subscriptions to pay for them.
5. **Hackable/inspectable** — the whole client is one readable file.

## Where we structurally lose (don't chase)

- **Live in-match overlay HUD** (Untapped) — needs a background process; a PWA can't.
- **Population-scale win-rate data as our own** — needs a server aggregating all users' matches;
  re-serving marvelsnapzone's weekly aggregate is the correct architecture.
- **Zero-touch automatic match capture** — needs account backend or native process; our manual
  quick-log is the deliberate trade. Make logging *faster*, don't fake automation.

## Adoption candidates (all client-side-feasible over data we already hold)

1. **Personal archetype-vs-archetype matchup grid** — pivot over existing match logs (my deck ×
   opponent deck → win rate). Untapped's premium standout, personal-scope version is pure math.
2. **Personal per-card MVP view** — sortable "which of MY cards earns cubes" (extends the
   Arsenal shelf data into its own surface).
3. **Pool/series completion-cost projection** — tokens/credits needed to finish Series X; we
   already have pool vocabulary + collection.
4. **Cosmetics tab** — we already parse avatars/titles/backs/albums (Feb 2026 audit); surface
   them as a view instead of Profile footnotes.
5. **Lightweight match recap in the Companion feed** — per-location score sequence if the synced
   state offers it (GameState.json was previously skipped as low-value; re-evaluate scope only).

## Agent's honest gaps (unverified, not guessed)

Untapped telemetry specifics beyond "account required"; Snap Zone / marvelsnap.pro / snap.fan
account+privacy details (privacy pages 403'd); Untapped Android feature parity.

Primary sources: snap.untapped.gg · untapped.gg/en/installed · help.hearthsim.net ·
snapcomplete.com (+ /faq/snapcomplete-vs-untapped) · marvelsnapzone.com/tracker ·
marvelsnap.pro/marvel-snap-tracker (+ github.com/Razviar/marvelsnaptracker) ·
snap.fan/news/snapfan-deck-tracker
