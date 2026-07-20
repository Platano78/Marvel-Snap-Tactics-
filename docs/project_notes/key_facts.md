# Key Project Facts

Quick reference for project configuration, URLs, ports, and important constants.

## ⚠️ SECURITY WARNING

**NEVER store in this file:**
- Passwords or API keys
- OAuth client secrets
- Service account JSON keys
- Any authentication tokens

**WHERE secrets belong:**
- User's browser localStorage (for their own API keys)
- Environment variables for deployment
- OAuth tokens managed by Google Identity Services

---

## Project Identity

- **Project Name**: Snapapoulous Prime (Marvel-Snap-Tactics)
- **Repository**: https://github.com/Platano78/Marvel-Snap-Tactics- (note the trailing hyphen — it is part of the repo name)
- **Type**: Progressive Web App (PWA)
- **Framework**: React via CDN (no build step)
- **Styling**: Tailwind CSS via CDN

## Design System

**Canonical spec**: `docs/design-canon.md` — Cosmic Purple (dark, `--cosmic-purple #ad2bee`, Spline
Sans, `ROUND_FULL` interactive controls). Supersedes the palette below (see ADR-005 in decisions.md).
The Marvel palette survives only as the skip-link focus color.

### Legacy Palette (ADR-004, superseded)
- **Marvel Red**: #ED1D24
- **Marvel Blue**: #006EC7
- **Marvel Gold**: #FFC107
- **Marvel Black**: #1A1A1A
- **Marvel White**: #FFFFFF

### Card Series Colors
- **Series 1**: #6B7280 (Gray)
- **Series 2**: #22C55E (Green)
- **Series 3**: #8B5CF6 (Purple)
- **Series 4**: #EAB308 (Yellow)
- **Series 5**: #EF4444 (Red)
- **Spotlight**: #F97316 (Orange)

## localStorage Keys

(note: `snap_rapidapi_key` removed 2026-07-19 — the RapidAPI feature was a dead stub, never wired to input)

| Key | Description |
|-----|-------------|
| `snap_google_access_token` | Google OAuth access token |
| `snap_google_token_expiry` | Google OAuth token expiry |
| `snap_performance_mode` | Low-end device detection / perf mode flag |
| `snap_card_cache` | Cached card data with timestamp |
| `snap_settings` | App settings (theme, provider, etc) |
| `snap_collection` | Owned cards array + lastUpdated |
| `snap_collection_enhanced` | Collection Score + cosmetic counts (avatars, titles, backs, albums) |
| `snap_profile_stats` | Profile stats from ProfileState.json |
| `snap_rank` | RankLog (rank, trophies, high watermark), Skill Rating, season games |
| `snap_wallet` | Full wallet (credits, gold, tokens, border charges, event tickets) |
| `snap_card_performance` | Net cubes gained/lost per card |
| `snap_mastery` | Character mastery levels |
| `snap_battlepass` | Battle Pass progress |
| `snap_rewards` | Rewards state |
| `snap_missions` | Missions state |
| `snap_timemodel` | Time-model data |
| `snap_decks` | Saved decks (up to 20) |
| `snap_ai_config` | Selected AI provider + model config |
| `snap_matches` | Match history array |
| `snap_qr_scan_progress` | In-progress QR vault sync scan state |
| `snap_game_data_mtime` | Newest game-file `lastModified` seen during folder sync (ISO) — feeds the "Game data as of" freshness hint |

## AI Provider Endpoints

### Gemini (Primary)
- **OAuth**: Google Identity Services
- **API**: https://generativelanguage.googleapis.com/v1beta/models

### Claude (Fallback)
- **API**: https://api.anthropic.com/v1/messages
- **Models**: claude-sonnet-5 (default), claude-haiku-4-5-20251001

### OpenAI (Fallback)
- **API**: https://api.openai.com/v1/chat/completions
- **Models**: gpt-4o, gpt-4o-mini

### Groq (Fallback)
- **API**: https://api.groq.com/openai/v1/chat/completions
- **Models**: llama-3.3-70b-versatile (default), llama-3.1-8b-instant (mixtral retired upstream, removed 2026-07-19)

### Gemini OAuth scope (2026-07-19 hard ruling)
- Scope is `generative-language.retriever` and it **DOES authorize `generateContent`** — proven in
  production. Changing it to bare `generative-language` broke OAuth and was reverted (ccf73e5).
  Never "correct" this scope based on what its name implies. See BUG-010.

### Local Models
- **Default Endpoint**: http://localhost:11434/api/chat (Ollama)

## External APIs

### RapidAPI Marvel Snap (Optional)
- **Host**: marvel-snap-api.p.rapidapi.com
- **Base URL**: https://marvel-snap-api.p.rapidapi.com/api
- **Documentation**: https://rapidapi.com/zelgady-SeTJboMFFHk/api/marvel-snap-api

## File Structure

```
Marvel-Snap-Tactics/
├── index.html                     # Main PWA (single HTML with embedded React)
├── card-data.json                 # Authoritative card data (459 cards)
├── data/
│   ├── meta-context.json          # AI advisor meta context (stale — see below)
│   └── spotlight-schedule.json    # Spotlight cache rotation schedule
├── manifest.json                  # PWA manifest
├── sw.js                          # Service worker for offline
├── persona.json                   # Snapapoulous AI persona config
├── assets/icons/                  # PWA icons (192, 512)
├── docs/
│   ├── project_notes/             # Project memory (this directory)
│   ├── design-canon.md            # Cosmic Purple canonical design spec
│   └── SIMULATOR.md               # Deck simulator feature docs
└── CLAUDE.md                      # Project specification
```

## Deployment

- **Primary**: GitHub Pages
- **URL Pattern**: https://platano78.github.io/Marvel-Snap-Tactics-/ (trailing hyphen matches the repo name)
- **Alternative Hosts**: Netlify, Vercel, Cloudflare Pages (static deploy)

## Current Season Context

- **Season**: Spider-Man: Brand New Day (July 2026) — refreshed 2026-07-19/20 with both July OTAs
  and 13 spotlight weeks; `data/meta-context.json` + `data/spotlight-schedule.json` are current.
- **Refresh cadence (owner ruling)**: BOTH — monthly scheduled cloud routine
  `trig_01RXr1YBBRFjfNm4ir27Az23` ("Marvel Snap monthly meta-refresh", 5th of each month
  13:00 UTC, https://claude.ai/code/routines/trig_01RXr1YBBRFjfNm4ir27Az23) + on-demand runs.
  Pipeline: official patch notes direct-fetch, 2+ source cross-check, honest-gap discipline.

## Card Database Facts

- `card-data.json` = **459 records** (2026-07-19: 458 two-source-verified + Magus added when MSZ
  flipped it to released). Every record two-source verified or explicitly held.
- **`series` is a POOL INDEX (1-10), NOT the game's Series tier** — decoded by `POOL_GROUPS`
  (index.html ~L3821): Starter(1)/CL(2)/Recruit(3)/S1(4)/S2(5)/S3(6)/S4(7)/S5(8)/Spotlight(9,10).
  Game "Series 5" files as `series: 8`. See BUG-014 and auto-memory
  `card-data-series-is-pool-index.md`.
- Live sync source: marvelsnapzone getinfo API only, filtered to `status === 'released'`
  (index.html:1910); merge-not-replace into the curated DB.
- Held (unreleased/event-only, auto-ingested when released — do not re-research): Spider-Sense.

## Design Direction (2026-07-19, session #3)

- **The Wow Arc** — hypothesis confirmed (screens restructured so cards are the subject);
  compose Vault (home) + Forge (AI deck-maker flagship, "Cosmic Perspective" variant) +
  Companion (narrated Dashboard/History). Canon: `docs/design-canon.md` → "The Wow Arc";
  plan: `docs/plans/design-wow-2026-07-19.md`; Stitch authority project
  `projects/12427902730037601641`.

---

## Tips

- **Organize by category** for easy scanning
- **Include URLs** wherever possible for quick navigation
- **Update when config changes** - stale facts are worse than no facts
- **Keep it factual** - no opinions or decisions here (those go in decisions.md)
- **Review monthly** - URLs and endpoints change more often than you'd think
