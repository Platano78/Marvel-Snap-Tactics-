# SNAPAPOULOUS PRIME - Project Specification & Claude Code Prompt

> **Purpose**: This document serves as both project specification and Claude Code execution prompt. Place this in your repo root as `CLAUDE.md` and instruct Claude Code to read it first.

---

## PROJECT IDENTITY

**Name**: Snapapoulous Prime  
**Type**: Progressive Web App (PWA)  
**Domain**: Marvel Snap Companion & AI Tactical Assistant  
**Target**: Mobile-first, works offline, installable from browser

---

## DESIGN LANGUAGE

### Visual Style: Marvel Comic Book
- **NOT cyberpunk** - bright, bold, heroic
- Primary palette: Marvel Red (#ED1D24), Marvel Blue (#006EC7), Gold/Yellow (#FFC107), Deep Black (#1A1A1A), Pure White (#FFFFFF)
- Typography: Bold sans-serif headers (Impact/Anton style), clean body text
- UI Elements: Comic panel borders, halftone dot patterns (subtle), bold drop shadows, speech-bubble tooltips
- Cards: Glossy/holographic feel with colored borders based on card series
- Animations: Punchy, snappy - comic "pop" feel, not smooth/corporate

### Component Styling Reference
```css
/* Core palette */
--marvel-red: #ED1D24;
--marvel-blue: #006EC7;
--marvel-gold: #FFC107;
--marvel-black: #1A1A1A;
--marvel-white: #FFFFFF;
--panel-border: 3px solid var(--marvel-black);
--comic-shadow: 4px 4px 0px var(--marvel-black);

/* Card series colors */
--series-1: #6B7280; /* Gray */
--series-2: #22C55E; /* Green */
--series-3: #8B5CF6; /* Purple */
--series-4: #EAB308; /* Yellow */
--series-5: #EF4444; /* Red */
--spotlight: #F97316; /* Orange */
```

---

## ARCHITECTURE

### Layer Overview
```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                   │
│              React (via CDN, no build step)             │
│                   Tailwind CSS (CDN)                    │
├─────────────────────────────────────────────────────────┤
│                     FEATURE MODULES                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │Collection│ │  Match   │ │   Snap   │ │    AI     │  │
│  │ Tracker  │ │ History  │ │Calculator│ │  Advisor  │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │
├─────────────────────────────────────────────────────────┤
│                    AI ROUTING LAYER                     │
│  ┌─────────────────────────────────────────────────┐   │
│  │              AI Provider Manager                 │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌───────┐ │   │
│  │  │ Claude  │ │ OpenAI  │ │ Gemini  │ │ Groq  │ │   │
│  │  │(API Key)│ │(API Key)│ │ (OAuth) │ │(Key)  │ │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └───────┘ │   │
│  │  ┌─────────────────┐ ┌─────────────────────┐   │   │
│  │  │  Local Models   │ │     MKG Bridge      │   │   │
│  │  │ (Ollama/LMStudio│ │ (DeepSeek Router)   │   │   │
│  │  └─────────────────┘ └─────────────────────┘   │   │
│  └─────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│                   PERSISTENCE LAYER                     │
│                    localStorage                          │
│         (collection, matches, settings, keys)           │
└─────────────────────────────────────────────────────────┘
```

### File Structure
```
snapapoulous-prime/
├── index.html              # Main PWA (single HTML file with embedded React)
├── manifest.json           # PWA manifest for installability
├── sw.js                   # Service worker for offline support
├── assets/
│   └── icons/
│       ├── icon-192.png    # PWA icon
│       └── icon-512.png    # PWA icon large
├── persona.json            # Snapapoulous AI persona configuration
├── CLAUDE.md               # Claude Code instructions (this file)
└── README.md               # User-facing documentation
```

---

## CORE FEATURES

### 1. Collection Tracker
**Purpose**: Track owned cards without requiring game file sync

**Requirements**:
- Display all Marvel Snap cards (200+) in a grid
- Toggle owned/unowned with single tap
- Filter by: Series (1-5, Spotlight), Owned/Missing, Search text
- Show collection completion percentage
- Cards display with series-appropriate border colors
- Bulk actions: Mark all Series 1 owned, Clear all, etc.

**Data Model**:
```javascript
// localStorage key: 'snap_collection'
{
  owned: ['Iron Man', 'Hulk', ...],  // Array of card names
  lastUpdated: '2026-01-21T...'
}
```

### 2. Match History & Stats
**Purpose**: Manual match tracking with quick-entry UI

**Requirements**:
- Quick-entry buttons: +1, +2, +4, +8 cubes (win) and -1, -2, -4, -8 (loss)
- Optional: Opponent name, deck used, notes
- Statistics dashboard:
  - Win rate (overall, today, this week)
  - Net cubes (overall, today, this week)
  - Current streak
  - Cube rate (cubes per game)
- Match history list with filters
- Export match data as JSON

**Data Model**:
```javascript
// localStorage key: 'snap_matches'
[
  {
    id: 'uuid',
    timestamp: '2026-01-21T...',
    result: 'WIN' | 'LOSS',
    cubes: 4,
    opponent: 'string (optional)',
    deck: 'string (optional)',
    notes: 'string (optional)',
    snapped: 'NONE' | 'PLAYER' | 'OPPONENT' | 'BOTH'
  }
]
```

### 3. Snap Calculator
**Purpose**: Probability-based snap/retreat decision aid

**Requirements**:
- Turn selector (1-7)
- Win confidence slider (0-100%)
- Visual recommendation: SNAP / HOLD / RETREAT
- Hypergeometric probability display:
  - Cards seen by turn X
  - Probability of drawing specific card by turn Y
- Advanced mode: Input specific cards to calculate draw odds

**Formulas**:
```javascript
// Cards drawn by turn
cardsDrawnByTurn = (turn) => Math.min(12, 3 + turn)

// Hypergeometric probability (at least 1 copy)
// P(X >= 1) = 1 - P(X = 0)
// Where P(X = 0) = C(K,0) * C(N-K, n) / C(N, n)
// N = deck size (12), K = copies in deck, n = cards drawn
```

### 4. AI Advisor (Snapapoulous Persona)
**Purpose**: AI-powered strategic assistance using user's chosen provider

**Features**:
- **Deck Doctor**: Analyze deck, suggest improvements based on owned cards
- **Meta Matchup Coach**: Explain how to beat specific archetypes
- **Board State Advisor**: Describe situation, get snap/retreat recommendation
- **OTA Impact Analysis**: Analyze how balance changes affect user's decks
- **Collection Priority**: Recommend which cards to acquire next

**Persona Injection**:
Every AI request includes the Snapapoulous persona as system prompt, ensuring consistent tactical response style.

---

## AI PROVIDER INTEGRATION

### Design Philosophy
**Google OAuth (Gemini) is the PRIMARY path** - almost everyone has Gmail, zero API key friction.
**API keys are the ADVANCED fallback** - for users who want Claude, GPT-4, Groq, or local models.

### Provider Priority (UI Order)
1. **Gemini (Google OAuth)** - One-click sign-in, free tier is generous
2. **Local Models** - For privacy-conscious users with Ollama/LM Studio
3. **MKG Bridge** - For users with existing multi-AI router setup
4. **Claude / OpenAI / Groq** - API key required, shown in "Advanced" section

### Provider Configuration UI
Settings page with:
- **Big Google Sign-In button** at top (primary CTA)
- Provider dropdown for alternatives
- API Key input (masked) for key-based providers
- Endpoint URL input for Local/MKG options
- Model selector (provider-specific options)
- "Test Connection" button

### Google OAuth Implementation (Gemini)

#### Setup Requirements
1. Create project in Google Cloud Console
2. Enable Generative Language API
3. Configure OAuth consent screen
4. Create OAuth 2.0 Client ID (Web application)
5. Add authorized JavaScript origins (GitHub Pages URL)

#### OAuth Flow
```javascript
// Google Identity Services (GIS) - modern approach
const GOOGLE_CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com';

function initGoogleAuth() {
  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleCredentialResponse,
    auto_select: true,
    context: 'signin'
  });
  
  // Render the sign-in button
  google.accounts.id.renderButton(
    document.getElementById('google-signin-btn'),
    { 
      theme: 'filled_blue', 
      size: 'large',
      text: 'continue_with',
      shape: 'rectangular'
    }
  );
}

async function handleCredentialResponse(response) {
  // response.credential is a JWT token
  const token = response.credential;
  
  // Store token for API calls
  localStorage.setItem('snap_google_token', token);
  
  // Update UI to show signed-in state
  setGoogleSignedIn(true);
}

// For Gemini API calls, use the token
async function callGeminiWithOAuth(messages) {
  const token = localStorage.getItem('snap_google_token');
  
  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: messages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }))
      })
    }
  );
  
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}
```

#### Required Script Tag
```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

### Provider Implementations (API Key Fallbacks)

#### Claude (Anthropic)
```javascript
{
  name: 'Claude',
  authType: 'api_key',
  endpoint: 'https://api.anthropic.com/v1/messages',
  models: ['claude-sonnet-4-20250514', 'claude-haiku-4-5-20251001'],
  headers: (key) => ({
    'x-api-key': key,
    'anthropic-version': '2023-06-01',
    'Content-Type': 'application/json'
  }),
  formatRequest: (messages, model) => ({
    model,
    max_tokens: 1024,
    messages
  }),
  parseResponse: (data) => data.content[0].text
}
```

#### OpenAI (ChatGPT)
```javascript
{
  name: 'OpenAI',
  authType: 'api_key',
  endpoint: 'https://api.openai.com/v1/chat/completions',
  models: ['gpt-4o', 'gpt-4o-mini'],
  headers: (key) => ({
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json'
  }),
  formatRequest: (messages, model) => ({
    model,
    messages
  }),
  parseResponse: (data) => data.choices[0].message.content
}
```

#### Gemini (Google) - API Key Fallback
```javascript
// For users who prefer API key over OAuth
{
  name: 'Gemini',
  authType: 'api_key',
  endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
  models: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-3-flash-preview', 'gemini-3-pro-preview', 'gemini-2.5-flash-lite'],
  // API key appended as ?key=KEY
  formatRequest: (messages, model) => ({
    contents: messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))
  }),
  buildUrl: (model, apiKey) => 
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
  parseResponse: (data) => data.candidates[0].content.parts[0].text
}
```

#### Groq
```javascript
{
  name: 'Groq',
  authType: 'api_key',
  endpoint: 'https://api.groq.com/openai/v1/chat/completions',
  models: ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768'],
  // Uses OpenAI-compatible format
  headers: (key) => ({
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json'
  }),
  formatRequest: (messages, model) => ({
    model,
    messages
  }),
  parseResponse: (data) => data.choices[0].message.content
}
```

#### Local Models (Ollama/LM Studio)
```javascript
{
  name: 'Local',
  authType: 'none',
  endpoint: 'http://localhost:11434/api/chat',  // User configurable
  models: [],  // Fetched from /api/tags or user-specified
  formatRequest: (messages, model) => ({
    model,
    messages,
    stream: false
  }),
  parseResponse: (data) => data.message.content
}
```

#### MKG Bridge (User's DeepSeek Router)
```javascript
{
  name: 'MKG Bridge',
  authType: 'none',  // Local service
  endpoint: 'http://localhost:PORT/v1/chat/completions',  // User configurable
  models: [],  // Fetched from bridge or user-specified
  // Assumes OpenAI-compatible API
  formatRequest: (messages, model) => ({
    model,
    messages
  }),
  parseResponse: (data) => data.choices[0].message.content
}
```

### AI Request Flow
```javascript
async function askSnapapoulous(userMessage, context) {
  const provider = getActiveProvider();
  const persona = await loadPersona();
  
  const systemPrompt = buildSystemPrompt(persona, context);
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage }
  ];
  
  const request = provider.formatRequest(messages, provider.selectedModel);
  const response = await fetch(provider.endpoint, {
    method: 'POST',
    headers: provider.headers(provider.apiKey),
    body: JSON.stringify(request)
  });
  
  const data = await response.json();
  return provider.parseResponse(data);
}
```

---

## SNAPAPOULOUS PERSONA

### persona.json
```json
{
  "name": "Snapapoulous",
  "version": "2.0",
  "role": "Marvel Snap Tactical Advisor",
  "personality": {
    "tone": "Confident, knowledgeable, encouraging",
    "style": "Direct tactical guidance with clear reasoning",
    "quirks": [
      "References Marvel lore when relevant",
      "Uses card game terminology naturally",
      "Celebrates good plays, constructively critiques mistakes"
    ]
  },
  "expertise": [
    "Deck building and optimization",
    "Meta analysis and counter-strategies", 
    "Probability and statistics",
    "Snap/retreat decision making",
    "Card synergies and combos"
  ],
  "response_format": {
    "deck_analysis": {
      "sections": ["Overview", "Core Synergies", "Weaknesses", "Recommended Changes", "Tech Options"]
    },
    "matchup_advice": {
      "sections": ["Matchup Summary", "Key Turns", "Cards to Watch", "Win Condition"]
    },
    "snap_decision": {
      "sections": ["Recommendation", "Reasoning", "Risk Assessment"]
    }
  },
  "knowledge_context": {
    "inject_user_collection": true,
    "inject_recent_matches": true,
    "inject_current_meta": true
  }
}
```

### System Prompt Builder
```javascript
function buildSystemPrompt(persona, context) {
  return `You are ${persona.name}, a ${persona.role}.

PERSONALITY:
- Tone: ${persona.personality.tone}
- Style: ${persona.personality.style}

YOUR EXPERTISE:
${persona.expertise.map(e => `- ${e}`).join('\n')}

USER CONTEXT:
- Collection: ${context.ownedCards.length} cards owned
- Recent Win Rate: ${context.recentWinRate}%
- Most Played Archetype: ${context.topArchetype}

CURRENT META (January 2026 - Dragons Season):
- Top Decks: Shou-Lao Combo, Destroy, High Evo, Bounce
- Recent OTA: Merlin nerfed, Fantomex/Vulture/Iron Lad buffed

Respond with practical, actionable advice. Be concise but thorough.`;
}
```

---

## PWA REQUIREMENTS

### manifest.json
```json
{
  "name": "Snapapoulous Prime",
  "short_name": "SnapPrime",
  "description": "Marvel Snap AI Companion & Tracker",
  "start_url": "/index.html",
  "display": "standalone",
  "background_color": "#1A1A1A",
  "theme_color": "#ED1D24",
  "icons": [
    { "src": "assets/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "assets/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### Service Worker (sw.js)
```javascript
const CACHE_NAME = 'snapapoulous-v1';
const OFFLINE_ASSETS = [
  '/index.html',
  '/manifest.json',
  '/persona.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

---

## DATA PERSISTENCE

### localStorage Keys
| Key | Description | Type |
|-----|-------------|------|
| `snap_collection` | Owned cards array | `{ owned: string[], lastUpdated: string }` |
| `snap_matches` | Match history | `Match[]` |
| `snap_settings` | App settings | `Settings` |
| `snap_ai_provider` | Selected AI provider config | `ProviderConfig` |
| `snap_api_keys` | Encrypted API keys | `{ [provider]: string }` |

### Settings Schema
```javascript
{
  theme: 'light' | 'dark',  // Future: default dark
  defaultProvider: 'claude' | 'openai' | 'gemini' | 'groq' | 'local' | 'mkg',
  localEndpoint: 'http://localhost:11434',
  mkgEndpoint: 'http://localhost:8000',
  showAdvancedStats: boolean,
  enableOfflineMode: boolean
}
```

---

## NAVIGATION STRUCTURE

### Tabs/Views
1. **Dashboard** (Home)
   - Quick stats summary
   - Quick match entry buttons
   - AI chat input
   
2. **Collection**
   - Card grid with filters
   - Series breakdown
   - Completion progress

3. **History**
   - Match list with filters
   - Detailed stats charts
   - Export options

4. **Calculator**
   - Snap advisor
   - Draw probability tool

5. **Settings**
   - AI provider configuration
   - Data management (export/import/clear)
   - App preferences

---

## IMPLEMENTATION NOTES FOR CLAUDE CODE

### Priority Order
1. **Phase 1**: Core offline functionality
   - Collection tracker with embedded card data (working, styled)
   - Match history (working, styled)
   - Snap calculator (working, styled)
   - PWA manifest + service worker
   
2. **Phase 2**: AI integration (Google OAuth first)
   - Google OAuth sign-in flow (primary path)
   - Gemini API integration
   - Basic chat interface with Snapapoulous persona
   - Provider abstraction layer for fallbacks

3. **Phase 3**: Additional providers + Polish
   - API key providers (Claude, OpenAI, Groq)
   - Local model support (Ollama endpoint)
   - MKG Bridge support
   - Advanced stats/charts
   - RapidAPI optional refresh for bleeding-edge card data
   - Export/import functionality

### Technical Constraints
- **Single HTML file** for main app (React via CDN)
- **No build step** - must work by opening index.html or serving statically
- **Offline-first** - all core features work without network
- **Mobile-first** - touch-friendly, responsive
- **No external CSS frameworks** except Tailwind via CDN

### Card Data Strategy

**Primary source** - Embedded static card list (updated by maintainer when new cards release)
**Optional refresh** - Users can provide RapidAPI key for bleeding-edge data
**Rationale** - Card data changes infrequently (new cards monthly, OTA patches weekly but don't add cards). Embedding eliminates API friction for 99% of users.

#### Static Data Maintenance
- Maintainer pulls fresh data via RapidAPI when new cards release
- Commit updated `cardData.js` to repo
- Users get updates on next app refresh (PWA cache invalidation)

---

## RAPIDAPI MARVEL SNAP INTEGRATION

### API Details
- **Host**: `marvel-snap-api.p.rapidapi.com`
- **Base URL**: `https://marvel-snap-api.p.rapidapi.com/api`
- **Auth**: RapidAPI Key (user provides their own key)

### Required Headers
```javascript
{
  'x-rapidapi-host': 'marvel-snap-api.p.rapidapi.com',
  'x-rapidapi-key': 'USER_API_KEY_HERE'
}
```

### Endpoints

#### Get Cards with Abilities
```
GET /api/get-cards-abilities?page=1
```
Returns paginated list of all cards with their abilities, power, cost, and metadata.

#### Get All Cards
```
GET /api/getCards
```
Returns complete card list.

#### Get Card by Name
```
GET /api/getCardByName?name=Iron%20Man
```
Returns single card details.

#### Get Locations
```
GET /api/getLocations
```
Returns all location cards.

### Implementation

#### RapidAPI Service Module
```javascript
const RAPIDAPI_CONFIG = {
  host: 'marvel-snap-api.p.rapidapi.com',
  baseUrl: 'https://marvel-snap-api.p.rapidapi.com/api'
};

const MarvelSnapAPI = {
  async fetchCards(apiKey) {
    const response = await fetch(`${RAPIDAPI_CONFIG.baseUrl}/getCards`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': RAPIDAPI_CONFIG.host,
        'x-rapidapi-key': apiKey
      }
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  },
  
  async fetchCardsWithAbilities(apiKey, page = 1) {
    const response = await fetch(
      `${RAPIDAPI_CONFIG.baseUrl}/get-cards-abilities?page=${page}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-host': RAPIDAPI_CONFIG.host,
          'x-rapidapi-key': apiKey
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  },
  
  async fetchCardByName(apiKey, cardName) {
    const response = await fetch(
      `${RAPIDAPI_CONFIG.baseUrl}/getCardByName?name=${encodeURIComponent(cardName)}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-host': RAPIDAPI_CONFIG.host,
          'x-rapidapi-key': apiKey
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  },
  
  async fetchLocations(apiKey) {
    const response = await fetch(`${RAPIDAPI_CONFIG.baseUrl}/getLocations`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': RAPIDAPI_CONFIG.host,
        'x-rapidapi-key': apiKey
      }
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  }
};
```

#### Card Data Caching Strategy
```javascript
const CardDataManager = {
  CACHE_KEY: 'snap_card_cache',
  CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours
  
  async getCards(apiKey) {
    // Check cache first
    const cached = this.getCachedCards();
    if (cached) return cached;
    
    // If we have API key, fetch fresh data
    if (apiKey) {
      try {
        const cards = await MarvelSnapAPI.fetchCards(apiKey);
        this.cacheCards(cards);
        return cards;
      } catch (error) {
        console.warn('API fetch failed, using fallback:', error);
      }
    }
    
    // Fallback to embedded static data
    return FALLBACK_CARD_DATA;
  },
  
  getCachedCards() {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) return null;
      
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > this.CACHE_DURATION) {
        return null; // Cache expired
      }
      
      return data;
    } catch {
      return null;
    }
  },
  
  cacheCards(cards) {
    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify({
        data: cards,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Failed to cache cards:', error);
    }
  }
};
```

#### Expected Card Data Shape
```javascript
// Card object from API (normalize as needed)
{
  name: "Iron Man",
  cost: 5,
  power: 0,
  ability: "Ongoing: Your total Power is doubled at this location.",
  series: "Series 1",  // or "Pool 1", normalize to series number
  imageUrl: "https://...",
  // Additional fields may vary
}

// Normalized internal format
{
  name: "Iron Man",
  cost: 5,
  power: 0,
  ability: "Ongoing: Your total Power is doubled at this location.",
  series: 1,  // Numeric for filtering
  tags: ["ongoing"],  // Parsed from ability text
  imageUrl: "https://..."
}
```

#### Settings UI for RapidAPI Key
Add to Settings page:
```jsx
<div className="setting-group">
  <label>RapidAPI Key (Marvel Snap)</label>
  <input 
    type="password"
    value={rapidApiKey}
    onChange={(e) => setRapidApiKey(e.target.value)}
    placeholder="Enter your RapidAPI key..."
  />
  <p className="help-text">
    Get your free key at{' '}
    <a href="https://rapidapi.com/zelgady-SeTJboMFFHk/api/marvel-snap-api" target="_blank">
      RapidAPI Marvel Snap API
    </a>
  </p>
  <button onClick={testRapidApiConnection}>Test Connection</button>
  <button onClick={refreshCardData}>Refresh Card Data</button>
</div>
```

### localStorage Keys for API
| Key | Description |
|-----|-------------|
| `snap_rapidapi_key` | User's RapidAPI key (stored securely) |
| `snap_card_cache` | Cached card data with timestamp |
| `snap_location_cache` | Cached location data with timestamp |

### Offline Fallback
When RapidAPI is unavailable or user has no key, use embedded static data:
```javascript
const FALLBACK_CARD_DATA = [
  { name: "Ant-Man", cost: 1, power: 1, series: 1, ability: "Ongoing: +3 Power if your side is full." },
  { name: "Iron Man", cost: 5, power: 0, series: 1, ability: "Ongoing: Your total Power is doubled at this location." },
  // ... ~200 cards embedded
];
```

Generate this fallback by calling the API once and saving the response as a static JS file during development

### Testing Checklist
- [ ] Works offline after first load
- [ ] Installable as PWA on Android/iOS
- [ ] Collection persists across sessions
- [ ] Match history persists across sessions
- [ ] Google OAuth sign-in works
- [ ] AI chat works with Gemini after OAuth
- [ ] AI chat works with at least one API key provider
- [ ] Local model endpoint works when configured
- [ ] Responsive on mobile and desktop
- [ ] All navigation works
- [ ] Export/import functions correctly

---

## REFERENCE: CARD SERIES DATA

Include in the app as static data (can be updated via API later):

```javascript
const CARD_SERIES = {
  '1': { name: 'Series 1', color: '#6B7280', cards: [...] },
  '2': { name: 'Series 2', color: '#22C55E', cards: [...] },
  '3': { name: 'Series 3', color: '#8B5CF6', cards: [...] },
  '4': { name: 'Series 4', color: '#EAB308', cards: [...] },
  '5': { name: 'Series 5', color: '#EF4444', cards: [...] },
  'spotlight': { name: 'Spotlight', color: '#F97316', cards: [...] }
};
```

---

## DEPLOYMENT

### GitHub Pages (Recommended)
1. Push to GitHub repo
2. Enable GitHub Pages from Settings → Pages → main branch
3. Access at `https://username.github.io/snapapoulous-prime/`

### Alternative: Any Static Host
- Netlify, Vercel, Cloudflare Pages
- Just deploy the folder contents

---

## FINAL NOTES

This specification is comprehensive but Claude Code should feel free to:
- Simplify where implementation proves complex
- Add quality-of-life improvements not specified
- Ask clarifying questions if requirements conflict

The goal is a **working, polished MVP** that can be iterated on, not a perfect first release.

**Key success criteria**: 
1. User can track collection
2. User can log matches quickly
3. User can ask AI for advice
4. App feels Marvel-authentic and fun to use
5. Works on mobile as an installed PWA

---

*Document Version: 1.0*  
*Created: January 2026*  
*For: Claude Code Implementation*
