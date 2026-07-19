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
- **Repository**: https://github.com/Platano78/Marvel-Snap-Tactics
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

## AI Provider Endpoints

### Gemini (Primary)
- **OAuth**: Google Identity Services
- **API**: https://generativelanguage.googleapis.com/v1beta/models

### Claude (Fallback)
- **API**: https://api.anthropic.com/v1/messages
- **Models**: claude-sonnet-4-20250514, claude-haiku-4-5-20251001

### OpenAI (Fallback)
- **API**: https://api.openai.com/v1/chat/completions
- **Models**: gpt-4o, gpt-4o-mini

### Groq (Fallback)
- **API**: https://api.groq.com/openai/v1/chat/completions
- **Models**: llama-3.3-70b-versatile, mixtral-8x7b-32768

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
├── card-data.json                 # Authoritative card data (433 cards)
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
- **URL Pattern**: https://platano78.github.io/Marvel-Snap-Tactics/
- **Alternative Hosts**: Netlify, Vercel, Cloudflare Pages (static deploy)

## Current Season Context

- **Season**: Dragons (January 2026)
- **Top Meta Decks**: Shou-Lao Combo, Destroy, High Evo, Bounce
- **Recent OTA**: Merlin nerfed, Fantomex/Vulture/Iron Lad buffed
- **STALE (2026-07-19)**: `data/meta-context.json` and `data/spotlight-schedule.json` are ~4.5 months
  out of date (last updated March 2026) — this feeds both the AI system prompt and the Oracle tab.
  Content refresh is a research task (needs current-season data), not a code fix; not done in this pass.

---

## Tips

- **Organize by category** for easy scanning
- **Include URLs** wherever possible for quick navigation
- **Update when config changes** - stale facts are worse than no facts
- **Keep it factual** - no opinions or decisions here (those go in decisions.md)
- **Review monthly** - URLs and endpoints change more often than you'd think
