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

### Color Palette
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

| Key | Description |
|-----|-------------|
| `snap_collection` | Owned cards array + lastUpdated |
| `snap_matches` | Match history array |
| `snap_settings` | App settings (theme, provider, etc) |
| `snap_ai_provider` | Selected AI provider config |
| `snap_api_keys` | User's API keys (encrypted) |
| `snap_google_token` | Google OAuth token |
| `snap_rapidapi_key` | RapidAPI key (optional) |
| `snap_card_cache` | Cached card data with timestamp |

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
├── index.html          # Main PWA (single HTML with embedded React)
├── manifest.json       # PWA manifest
├── sw.js               # Service worker for offline
├── persona.json        # Snapapoulous AI persona config
├── assets/icons/       # PWA icons (192, 512)
├── docs/
│   ├── project_notes/  # Project memory (this directory)
│   └── SIMULATOR.md    # Deck simulator feature docs
└── CLAUDE.md           # Project specification
```

## Deployment

- **Primary**: GitHub Pages
- **URL Pattern**: https://platano78.github.io/Marvel-Snap-Tactics/
- **Alternative Hosts**: Netlify, Vercel, Cloudflare Pages (static deploy)

## Current Season Context

- **Season**: Dragons (January 2026)
- **Top Meta Decks**: Shou-Lao Combo, Destroy, High Evo, Bounce
- **Recent OTA**: Merlin nerfed, Fantomex/Vulture/Iron Lad buffed

---

## Tips

- **Organize by category** for easy scanning
- **Include URLs** wherever possible for quick navigation
- **Update when config changes** - stale facts are worse than no facts
- **Keep it factual** - no opinions or decisions here (those go in decisions.md)
- **Review monthly** - URLs and endpoints change more often than you'd think
