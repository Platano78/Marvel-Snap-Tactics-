# Snapapoulous Prime 🃏⚡

**Your AI-Powered Marvel Snap Companion**

Track your collection, log matches, calculate snap decisions, and get tactical advice from Snapapoulous - your personal Marvel Snap strategist.

![Marvel Snap Tactics](https://img.shields.io/badge/Marvel%20Snap-Companion-ED1D24?style=for-the-badge)
![PWA Ready](https://img.shields.io/badge/PWA-Installable-006EC7?style=for-the-badge)
![Offline First](https://img.shields.io/badge/Works-Offline-FFC107?style=for-the-badge)

---

## 🚀 Quick Start (30 seconds)

### On Your Phone (Recommended)
1. **Open this link:** [https://platano78.github.io/Marvel-Snap-Tactics-/](https://platano78.github.io/Marvel-Snap-Tactics-/)
2. **Install as app:**
   - **iPhone:** Tap Share → "Add to Home Screen"
   - **Android:** Tap the menu (⋮) → "Install app" or "Add to Home Screen"
3. **Done!** Open from your home screen like any app

### On Desktop
1. Visit the link above in Chrome/Edge
2. Click the install icon in the address bar (or menu → "Install Snapapoulous Prime")
3. Opens as a standalone app

---

## ✨ Features

### 📦 Collection Tracker
- Track which cards you own across all Series (1-5)
- Filter by series, owned/missing, or search
- See your completion percentage
- Bulk actions to quickly mark Series 1 & 2 as owned

### 📊 Match History
- Quick-entry buttons: tap +4 for a 4-cube win, -2 for a 2-cube loss
- Track your stats: win rate, net cubes, current streak
- Filter by time period (today, this week, all time)
- **PC Players:** Drag & drop your Player.log file to auto-import matches
- Export your match data

### 🔄 Cross-Device Sync (New!)
- **PC Log Import:** Drag your Marvel Snap Player.log file to automatically import match history
- **QR Code Sync:** Generate a QR code on PC, scan with your phone to sync collection
- **Full Vault Export:** Backup everything (collection, matches, stats) to a single file
- **Smart Deduplication:** Won't double-count matches you've already logged

### 🎲 Snap Calculator
- Select the turn and your win confidence
- Get SNAP / HOLD / RETREAT recommendations
- Calculate draw probabilities for specific cards
- Know your odds before you commit

### 🤖 AI Tactical Advisor (Snapapoulous)
- **Deck Doctor:** Get suggestions to improve your deck
- **Meta Matchups:** Learn how to beat popular archetypes
- **Board State Analysis:** Describe your situation, get advice
- **Collection Priority:** Know which cards to chase next

---

## 🔧 AI Setup (Optional)

The app works fully offline for collection tracking and match logging. For AI advice, connect a provider:

### Easiest: Google Sign-In
1. Go to Settings → AI Provider
2. Click "Sign in with Google"
3. Done! Chat with Snapapoulous

### Alternative: API Keys
If you have API keys for Groq, Claude, or OpenAI:
1. Go to Settings → AI Provider
2. Select your provider
3. Paste your API key
4. Click "Test Connection"

**Free option:** [Groq](https://console.groq.com/) offers a generous free tier.

---

## 💾 Your Data

**Everything stays on YOUR device.**

- No account required
- No forced cloud sync
- No data collection
- Works completely offline

Your collection and match history are stored in your browser's local storage.

**Backup Options:**
- **Full Vault Export:** Download everything as a single JSON file
- **QR Sync:** Transfer collection to another device via camera
- **Manual Export:** Export collection or matches separately

---

## 📱 Tips for Best Experience

1. **Install as PWA** - Works better than browser bookmark
2. **PC Players:** Import your Player.log for accurate match history
3. **Mobile Players:** Use quick-entry buttons right after each game
4. **Use the calculator before snapping** - Know your odds
5. **Export your vault regularly** - Keep backups of your data

---

## 🛠️ For Developers

This is a single-file PWA built with:
- React 18 (via CDN, no build step)
- Tailwind CSS
- localStorage for persistence
- Service Worker for offline support

### Run Locally
```bash
# Any static file server works
npx serve .
# or
python -m http.server 8000
```

### Project Structure
```
├── index.html      # Main app (everything embedded)
├── manifest.json   # PWA manifest
├── sw.js          # Service worker
├── persona.json   # AI persona configuration
└── assets/icons/  # PWA icons
```

---

## 📝 Changelog

### v1.0 - Phase 1
- Collection tracker with 100+ cards
- Match history with stats dashboard
- Snap calculator with probability math
- Full PWA support (installable, offline)

### v2.0 - Phase 2 & 3
- AI integration (Gemini, Groq, Claude, OpenAI)
- Snapapoulous persona for tactical advice
- Provider abstraction with easy switching
- Export/import all data

### v2.1 - Phase 4 (Log Sync Edition)
- **PC Log Ingestor:** Drag & drop Player.log to auto-import matches
- **QR Code Sync:** Quick PC-to-mobile collection transfer
- **Full Vault Export:** Complete backup with stats summary
- **Smart Deduplication:** Prevents duplicate match entries
- **Log Preview:** Review imported matches before confirming
- Real Google OAuth integration for Gemini

---

## 🎮 About

Built for Marvel Snap players who want to track their progress and make smarter snap decisions. 

*"Every match is a story. Every snap is a statement."* — Snapapoulous

---

## 📄 License

MIT - Do whatever you want with it.

---

**Questions?** Open an issue or just figure it out - it's pretty straightforward. 

*Not affiliated with Marvel, Second Dinner, or Nuverse.*
