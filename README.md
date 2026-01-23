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

### 🔄 Game Data Sync (New in v2.2!)
- **Direct JSON Import:** Import collection, stats, and card performance from game files
- **Link Folder (Chrome/Edge):** One-time setup, then sync with a single click
- **Drag & Drop:** Works in all browsers - drop your game JSON files to import
- **PC Log Import:** Drag your Player.log file to auto-import match history
- **QR Code Sync:** Generate a QR code on PC, scan with your phone to sync collection
- **Full Vault Export:** Backup everything to a single file

### 📊 Analytics Tab (New!)
- **Lifetime Stats:** See your total games, wins, losses, and win rate from game data
- **Card Performance:** Track net cubes gained/lost per card
- **Best/Worst Performers:** Know which cards win (and lose) you the most cubes
- **Currency Tracking:** View your Credits, Gold, and Collector's Tokens

### 📋 Deck Builder
- Create and save up to 20 custom decks
- 12-card deck validation (Marvel Snap standard)
- Search and filter cards while building
- See card costs and power at a glance
- Quick-add from your collection
- Edit or delete saved decks anytime

### 🎲 Deck Simulator (New!)
- **Opening Hand Test:** See probability of each card in starting hand
- **Draw by Turn:** Know your odds of drawing key cards by each turn
- **Curve Analysis:** Check if your deck plays on curve or bricks
- **Combo Finder:** Calculate odds of assembling multi-card combos
- **Interactive Play-Through:** Step through draws turn by turn
- **Advanced Rules:** Simulate thinning, extra draws, hand limits
- Supports up to 200K simulation runs with Web Worker (no UI freeze)
- Seeded RNG for reproducible results
- [📖 Detailed Simulator Guide](docs/SIMULATOR.md)

### 🎯 Snap Calculator
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
4. **Test decks in the Simulator** - Check curve and combo odds before playing
5. **Use the calculator before snapping** - Know your odds
6. **Export your vault regularly** - Keep backups of your data

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
├── index.html          # Main app (everything embedded)
├── manifest.json       # PWA manifest
├── sw.js               # Service worker
├── persona.json        # AI persona configuration
├── assets/icons/       # PWA icons
└── docs/               # Detailed feature documentation
    └── SIMULATOR.md    # Deck Simulator guide
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

### v2.2 - Phase 5 (Game Data Sync)
- **JSON Game File Import:** Direct import from CollectionState.json, ProfileState.json, etc.
- **Linked Folder Sync (Chrome/Edge):** Link your game folder once, sync with one click
- **Drag & Drop JSON:** Works in all browsers - drop multiple files at once
- **Analytics Tab:** New dedicated view for lifetime stats and card performance
- **Card Performance Tracking:** See net cubes earned/lost per card
- **Lifetime Stats Display:** View imported game stats on Dashboard
- **Selective Import:** Choose which data types to import (collection, stats, mastery)
- **Currency Display:** Track Credits, Gold, and Collector's Tokens
- **Character Mastery Import:** Track card mastery levels

### v2.3 - Phase 6 (Deck Tools)
- **Deck Builder:** Create, save, and manage up to 20 custom 12-card decks
- **Deck Simulator:** Full probability simulation suite
  - Opening hand probability analysis
  - Draw-by-turn probability tables
  - Curve and brick rate analysis
  - Multi-card combo probability finder
  - Interactive step-by-step play-through mode
  - Advanced rules: thinning, extra draws, hand limits, junk inserts
- **Dual Simulation Engines:**
  - Exact hypergeometric math for baseline calculations
  - Monte Carlo with Web Worker for 50K-200K runs without freezing
  - Seeded RNG for reproducible results
- **7-Tab Navigation:** Added Simulator alongside Calculator

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
