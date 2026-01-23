# Hybrid UI Redesign Implementation Plan

**Project**: Snapapoulous Prime v2.5.0 → v3.0.0
**Date**: January 23, 2026
**Branch**: `feature/hybrid-ui-redesign`
**Review**: Gemini + ChatGPT before implementation

---

## Executive Summary

This is a **UI RESKIN**, not a feature rewrite. We are updating the visual design language from the current Marvel Comic Book style to a **Hybrid MCU Cinematic + Spider-Verse** approach while preserving all existing functionality.

### Design Philosophy
- **MCU Cinematic Base**: Premium dark interfaces, glass panels, arc-reactor blue glows, sophisticated data visualization
- **Spider-Verse Accents**: Chromatic glitch effects, hand-drawn annotations, stepped animations on high-energy moments (victories, snaps, streaks)

---

## Current State Analysis

### Version
- **Current**: v2.5.0 - Player-Centric Collection Redesign
- **Target**: v3.0.0 - Hybrid UI Redesign

### Existing Tab Structure (PRESERVE ALL)

**Primary Navigation (NavBar):**
| Tab ID | Label | Icon | Component |
|--------|-------|------|-----------|
| `dashboard` | Home | ⚡ | Dashboard (Player OS Home) |
| `oracle` | Oracle | 🔮 | Oracle |
| `collection` | Cards | 🃏 | CollectionTracker |
| `planner` | Plan | 📈 | SeasonPlanner |
| `ai` | AI | 🤖 | AIChat |
| `settings` | More | ☰ | Settings + Sub-menu |

**Secondary Tabs (via Settings/More menu):**
| Tab ID | Component |
|--------|-----------|
| `missions` | MissionTracker |
| `battlepass` | BattlePassTracker |
| `armor` | InfinityArmorTracker |
| `economy` | EconomyTracker |
| `board` | BoardView |
| `decks` | DeckManager |
| `simulator` | DeckSimulator |
| `calculator` | SnapCalculator |

### Current Tech Stack (NO CHANGES)
- React 18 via CDN (production.min.js)
- Babel standalone for JSX transformation
- Tailwind CSS via CDN
- Single HTML file architecture (~390KB)
- PWA with service worker
- Google Identity Services for OAuth

### Current Design Elements (REPLACING)
```css
/* Current - Marvel Comic Book Style */
.panel-border { border: 3px solid #1A1A1A; box-shadow: 4px 4px 0px #1A1A1A; }
.halftone { background-image: radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px); }
--marvel-red: #ED1D24;
--marvel-blue: #006EC7;
--marvel-gold: #FFC107;
font-family: Impact, Arial Black, sans-serif; /* Headers */
```

---

## Target Design System

### New CSS Custom Properties (REVISED per Gemini 3 Pro + ChatGPT 5.2)

```css
:root {
  /* ============================================
     LAYER 1: BRAND TOKENS (Raw palette values)
     ============================================ */

  /* MCU Foundation */
  --mcu-blue: #00aaff;
  --mcu-blue-light: #33bbff;        /* Lightened for microtext - ChatGPT 5.2 */
  --mcu-blue-glow: rgba(0, 170, 255, 0.4);
  --mcu-red: #ff4444;
  --mcu-red-glow: rgba(255, 68, 68, 0.4);
  --mcu-gold: #C9A227;

  /* Spider-Verse Accents */
  --spider-pink: #ff00ff;
  --spider-cyan: #00ffff;
  --spider-yellow: #fef08a;

  /* Series Colors (unchanged) */
  --series-1: #6B7280;
  --series-2: #22C55E;
  --series-3: #8B5CF6;
  --series-4: #EAB308;
  --series-5: #EF4444;
  --spotlight: #F97316;

  /* ============================================
     LAYER 2: SEMANTIC TOKENS (ChatGPT 5.2)
     Role-based mappings to reduce decision fatigue
     ============================================ */

  /* Surfaces */
  --ui-surface-base: #0a0c0e;
  --ui-surface-1: #121216;
  --ui-surface-2: #1a1a20;
  --ui-surface-glass: rgba(18, 18, 22, 0.7);
  --ui-surface-glass-solid: rgba(18, 18, 22, 0.92);  /* Low-perf fallback */

  /* Borders */
  --ui-border: rgba(255, 255, 255, 0.08);
  --ui-border-accent: rgba(0, 170, 255, 0.3);

  /* Text */
  --ui-text-primary: #eaeaf0;
  --ui-text-secondary: #8888a0;
  --ui-text-muted: #5c5c6e;
  --ui-text-accent: var(--mcu-blue-light);  /* Use lighter blue for small text */

  /* Accent (maps to MCU blue by default) */
  --ui-accent: var(--mcu-blue);
  --ui-accent-glow: var(--mcu-blue-glow);
  --ui-accent-light: var(--mcu-blue-light);

  /* Semantic States */
  --ui-success: #22C55E;
  --ui-warning: #EAB308;
  --ui-danger: var(--mcu-red);
  --ui-info: var(--mcu-blue);

  /* Focus Ring (accessibility) */
  --ui-focus-ring: var(--mcu-gold);
  --ui-focus-ring-glow: rgba(201, 162, 39, 0.4);

  /* Shadows */
  --ui-shadow-soft: 0 4px 12px rgba(0, 0, 0, 0.3);
  --ui-shadow-glow: 0 0 20px var(--ui-accent-glow);
  --ui-shadow-strong: 0 8px 24px rgba(0, 0, 0, 0.5);

  /* Spider-Verse Highlight (overlays only) */
  --ui-highlight: var(--spider-yellow);
  --ui-highlight-glitch: var(--spider-pink);

  /* ============================================
     LAYER 3: EFFECT TOKENS
     ============================================ */

  /* Glass Effects */
  --glass-blur: blur(12px);
  --glass-blur-mobile: blur(6px);
  --glass-blur-none: blur(0px);

  /* Chromatic Effects */
  --chromatic-offset: 2px;
  --sketch-shadow: 6px 6px 0 #111;

  /* Neon Outer Glow for accessibility (Gemini 3 Pro) */
  --text-glow-accent: 0 0 8px var(--mcu-blue-glow), 0 0 16px var(--mcu-blue-glow);

  /* ============================================
     LAYER 4: TYPOGRAPHY TOKENS
     ============================================ */

  --font-ui: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'SF Mono', 'Menlo', monospace;  /* System mono - no external load */
  --font-hero: 'Permanent Marker', cursive;
  /* Removed: Caveat, JetBrains Mono - reduced to 2 fonts per Gemini */
}

/* ============================================
   PERFORMANCE MODE TOGGLE (ChatGPT 5.2)
   Detect low-power devices and disable heavy effects
   ============================================ */

/* Low-perf mode: disable blur, use solid backgrounds */
html[data-perf="low"] {
  --glass-blur: var(--glass-blur-none);
  --glass-blur-mobile: var(--glass-blur-none);
  --ui-surface-glass: var(--ui-surface-glass-solid);
  --ui-shadow-glow: none;
  --text-glow-accent: none;
}

/* Auto-detect via media queries */
@media (prefers-reduced-motion: reduce) {
  :root {
    --glass-blur: var(--glass-blur-none);
    --ui-shadow-glow: none;
  }
}

/* ============================================
   REDUCED MOTION - COMPLETE HANDLING (ChatGPT 5.2)
   Kill ALL animations, not just specific ones
   ============================================ */

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Manual toggle via Settings */
html[data-motion="reduced"] *,
html[data-motion="reduced"] *::before,
html[data-motion="reduced"] *::after {
  animation: none !important;
  transition: none !important;
}
```

### Performance Mode Detection (JavaScript)

```javascript
// Add to app initialization
function detectPerformanceMode() {
  const isLowPower =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
    localStorage.getItem('snap_perf_mode') === 'low';

  if (isLowPower) {
    document.documentElement.setAttribute('data-perf', 'low');
  }
}

// Settings toggle
function setPerformanceMode(mode) {
  localStorage.setItem('snap_perf_mode', mode);
  document.documentElement.setAttribute('data-perf', mode);
}
```

### New Utility Classes (NAMESPACED per Gemini 3 Pro)

> **IMPORTANT**: All new classes prefixed with `mcu-` to avoid legacy conflicts during migration.
> Legacy classes (`.panel-border`, `.halftone`, `.shadow-comic`) will be **FULLY PURGED** in v3.0.0 - no mixed styles.

```css
/* ============================================
   MCU GLASS PANEL (replaces .panel-border)
   ============================================ */
.mcu-glass {
  background: var(--ui-surface-glass);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--ui-border-accent);
  box-shadow: var(--ui-shadow-glow);
  border-radius: 12px;
  will-change: transform;  /* GPU acceleration - Gemini 3 Pro */
}

@media (max-width: 768px) {
  .mcu-glass {
    backdrop-filter: var(--glass-blur-mobile);
    -webkit-backdrop-filter: var(--glass-blur-mobile);
  }
}

/* ============================================
   MCU GLOW EFFECTS
   ============================================ */
.mcu-glow-blue {
  box-shadow: 0 0 15px var(--mcu-blue-glow), inset 0 0 5px var(--mcu-blue-glow);
}

.mcu-glow-red {
  box-shadow: 0 0 15px var(--mcu-red-glow), inset 0 0 5px var(--mcu-red-glow);
}

.mcu-glow-gold {
  box-shadow: 0 0 15px rgba(201, 162, 39, 0.4), inset 0 0 5px rgba(201, 162, 39, 0.2);
}

/* Text with neon glow for accessibility (Gemini 3 Pro) */
.mcu-text-glow {
  text-shadow: var(--text-glow-accent);
}

/* Spider-Verse Chromatic Text (Victory/High-Energy only) */
.glitch-text {
  text-shadow:
    var(--chromatic-offset) 0 var(--spider-pink),
    calc(-1 * var(--chromatic-offset)) 0 var(--spider-cyan);
}

/* Spider-Verse Sketch Border (Hover states) */
.sketch-border {
  border: 3px solid #111;
  box-shadow: var(--sketch-shadow);
}

/* HUD Grid Background */
.hud-grid {
  background-image:
    linear-gradient(rgba(0, 170, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 170, 255, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
}

/* Arc Reactor Pulse Animation */
@keyframes arc-pulse {
  0%, 100% { box-shadow: 0 0 20px var(--mcu-blue-glow); }
  50% { box-shadow: 0 0 30px var(--mcu-blue-glow), 0 0 40px var(--mcu-blue-glow); }
}

.arc-pulse {
  animation: arc-pulse 2s ease-in-out infinite;
}

/* Spider-Verse Glitch Animation (Victory only) */
@keyframes chromatic-glitch {
  0%, 100% { text-shadow: 2px 0 var(--spider-pink), -2px 0 var(--spider-cyan); }
  25% { text-shadow: -2px 0 var(--spider-pink), 2px 0 var(--spider-cyan); }
  50% { text-shadow: 1px 1px var(--spider-pink), -1px -1px var(--spider-cyan); }
  75% { text-shadow: -1px 1px var(--spider-pink), 1px -1px var(--spider-cyan); }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  .arc-pulse,
  .glitch-text {
    animation: none;
    text-shadow: none;
  }
}
```

---

## Component Migration Map

### Global Changes

| Current | New | Notes |
|---------|-----|-------|
| `bg-marvel-black` | `bg-[#0a0c0e]` | Darker, more cinematic |
| `bg-marvel-red` header | Glass panel header | MCU aesthetic |
| `panel-border` class | `glass-panel` class | Glass morphism |
| `shadow-comic` | `glow-blue` | Subtle energy glow |
| `halftone` pattern | `hud-grid` pattern | Tech grid background |
| Impact font | Inter + Permanent Marker | Modern + personality |

### Component-Specific Changes

#### 1. NavBar
```jsx
// CURRENT
<nav className="bg-marvel-black border-t-4 border-marvel-red">

// NEW
<nav className="bg-[#0a0c0e]/95 backdrop-blur-md border-t border-[#00aaff]/20">
  {/* Active tab: glow-blue effect instead of marvel-red text */}
```

#### 2. Header
```jsx
// CURRENT
<header className="bg-marvel-red halftone py-4 px-4 shadow-comic">
  <h1 className="font-comic text-white">

// NEW
<header className="glass-panel py-4 px-6 mb-4">
  <h1 className="font-['Inter'] font-black text-white tracking-wider">
  {/* Add subtle arc-reactor glow border-bottom */}
```

#### 3. Dashboard Stats Cards
```jsx
// CURRENT
<div className="panel-border bg-gray-800 p-4 rounded">

// NEW
<div className="glass-panel p-5 border-l-4 border-l-[#00aaff]/60">
  <p className="text-[#00aaff]/50 text-[10px] font-bold tracking-widest uppercase">
  <span className="font-mono text-3xl text-white font-bold">
```

#### 4. Quick Match Buttons
```jsx
// CURRENT
<button className="bg-green-600 panel-border">+4</button>
<button className="bg-red-600 panel-border">-4</button>

// NEW
<button className="glass-panel border-[#00aaff]/40 hover:glow-blue text-[#00aaff]">+4</button>
<button className="glass-panel border-[#ff4444]/40 hover:glow-red text-[#ff4444]">-4</button>
```

#### 5. Victory/Defeat States (Spider-Verse Accent)
```jsx
// NEW - Victory Splash (Spider-Verse energy moment)
<div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
  <h1 className="font-['Permanent_Marker'] text-8xl glitch-text text-white">
    VICTORY
  </h1>
  <div className="bg-[#fef08a] text-black px-6 py-3 sketch-border rotate-3">
    +8 CUBES EARNED
  </div>
</div>
```

#### 6. Collection Cards
```jsx
// CURRENT
<div className={`panel-border series-border-${card.series}`}>

// NEW
<div className={`glass-panel border-l-4`}
     style={{ borderLeftColor: `var(--series-${card.series})` }}>
  {/* Keep series colors, update container style */}
```

---

## Spider-Verse Accent Trigger Map (REVISED per Gemini 3 Pro + ChatGPT 5.2)

> **Core Principle**: Tie Spider-Verse effects to **Cube Equity** - keep energy rare to keep it special.
> **UI Fatigue Prevention**: Gate overlays by intensity to avoid friction during quick match logging.

### Trigger Rules by Cube Value

| Cube Value | Overlay Type | Effect Level | Duration |
|------------|--------------|--------------|----------|
| **8 cubes** (Win/Loss) | Full-screen splash | MAX (chromatic glitch + starburst) | 2.5s |
| **4 cubes** (Win/Loss) | Full-screen splash | HIGH (chromatic text, no starburst) | 2s |
| **2 cubes** (Win/Loss) | Toast notification | MEDIUM (sketch border accent) | 1.5s |
| **1 cube** (Win/Loss) | Toast notification | LOW (simple color flash) | 1s |
| **Retreat** (any) | Toast notification | MINIMAL (red tint only) | 0.8s |

### Special Triggers (Gemini 3 Pro - Hall of Armor Integration)

| Event | Trigger Condition | Effect |
|-------|-------------------|--------|
| **God Split Display** | Card variant = "Inked" or "Gold" or "Krackle" | Holographic shimmer + sketch border |
| **Successful Snap** | User snapped AND won | Brief glitch pulse on result |
| **Win Streak Milestone** | Streak reaches 3, 5, 10 | Static sketch border on streak counter (NOT animated) |
| **Infinity Split Viewed** | Hall of Armor shows Infinity-tier | Premium glow + subtle pulse |

### Trigger Behavior Matrix

| Game Event | MCU Base State | Spider-Verse Accent | Overlay Type |
|------------|----------------|---------------------|--------------|
| 8-cube Victory | Blue glow panel | Full chromatic glitch + starburst + thought bubble | Full Splash |
| 8-cube Defeat | Red glow panel | Chromatic "DEFEAT" + muted starburst | Full Splash |
| 4-cube Victory | Blue glow panel | Chromatic "VICTORY" text only | Full Splash |
| 4-cube Defeat | Red glow panel | Subtle chromatic on text | Full Splash |
| 2-cube Win/Loss | Color flash | Sketch border toast | Toast |
| 1-cube Win/Loss | Simple highlight | Minimal accent | Toast |
| SNAP button press | Button active state | Stepped transform + sketch shadow | Inline |
| Match log hover | Glass panel hover | 1-2° rotation | Inline |
| Win streak 3+ | Streak counter glow | Static sketch border (NO animation) | Inline |
| Hall of Armor God Split | Museum pedestal | Holographic shimmer | Inline |

### What NOT to Trigger On (ChatGPT 5.2)

- ❌ Simple collection browsing (no glitches)
- ❌ 1-cube retreats (minimal feedback only)
- ❌ Persistent states (NO continuous glitch animations)
- ❌ Body text (chromatic effects on headers only)
- ❌ Nested panels (HUD grid on page backgrounds only)

---

## Hybrid Guardrails - Style QA Rubric (ChatGPT 5.2)

> **Purpose**: Prevent "theming drift" during implementation. The hybrid must stay hybrid.

### The 80/20 Rule

| Element Type | Style Ratio | Guidance |
|--------------|-------------|----------|
| **Surfaces & Layout** | 100% MCU | Glass panels, dark backgrounds, grid patterns |
| **Typography** | 80% MCU / 20% Spider | Inter for UI, Permanent Marker for hero headers only |
| **Colors** | 90% MCU / 10% Spider | Arc-reactor blue primary, Spider-yellow for highlights only |
| **Animations** | 70% MCU / 30% Spider | Smooth glows default, stepped/glitch only on triggers |
| **Overlays** | 50% MCU / 50% Spider | Victory/defeat screens get full Spider-Verse treatment |

### Hard Rules (MUST Follow)

1. **Chromatic effects NEVER on body text** - Headers and overlay titles only
2. **No more than 1 continuous animation visible per screen** - Arc-pulse OR glitch, not both
3. **HUD grid only on page backgrounds** - Never on nested panels (causes moiré)
4. **Sketch borders are HOVER STATES only** - Not default state (prevents comic UI drift)
5. **Touch targets remain 44x44px minimum** - MCU thin-line aesthetic must not shrink buttons

### Visual Consistency Checks

Before merging any component, verify:

- [ ] Glass panels use `mcu-glass` class (not legacy `panel-border`)
- [ ] All text uses semantic color tokens (`--ui-text-*`)
- [ ] Glows use `--ui-accent-glow` (not hardcoded rgba)
- [ ] Spider-Verse effects only on documented trigger conditions
- [ ] No Impact/Arial Black font usage (legacy purged)
- [ ] `will-change: transform` on all animated elements

### Animation Budget Per Screen

| Screen Type | Max Continuous Animations | Max Triggered Animations |
|-------------|---------------------------|--------------------------|
| Dashboard | 1 (arc-pulse on primary stat) | 2 (hover effects) |
| Collection Grid | 0 | 1 per card (hover glow) |
| Match Entry | 1 (SNAP button pulse) | 3 (button feedback) |
| Victory Overlay | 2 (chromatic + starburst) | 0 |
| Settings | 0 | 1 (toggle feedback) |

---

## Font Loading Strategy (REVISED per Gemini 3 Pro)

> **Decision**: **Self-host fonts** for true offline-first PWA capability.
> Google Fonts CDN introduces a point of failure for offline scenarios.

### Reduced Font Set (2 fonts only)

| Font | Weight(s) | Usage | Fallback |
|------|-----------|-------|----------|
| **Inter** | 400, 500, 600, 700 | All UI text, labels, body, stats | system-ui, sans-serif |
| **Permanent Marker** | 400 | Hero headers, victory text, Spider-Verse accents | cursive |

**Removed** (per Gemini recommendation):
- ~~JetBrains Mono~~ → Use system monospace (`SF Mono`, `Menlo`)
- ~~Caveat~~ → Not essential, reduces load

### Self-Hosting Implementation

```html
<!-- Phase 1: Use CDN with SW caching (quick start) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Permanent+Marker&display=swap" rel="stylesheet">

<!-- Phase 5 (Optional): Switch to self-hosted -->
<!-- Download woff2 files to /assets/fonts/ -->
<!-- <link rel="stylesheet" href="assets/fonts/fonts.css"> -->
```

### Service Worker Font Caching

```javascript
// Add to sw.js - cache Google Fonts for offline
const FONT_CACHE = 'snap-fonts-v1';
const FONT_URLS = [
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Permanent+Marker&display=swap',
  // Google Fonts CSS will reference woff2 files which SW will also cache
];

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('fonts.googleapis.com') ||
      event.request.url.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.open(FONT_CACHE).then((cache) => {
        return cache.match(event.request).then((response) => {
          return response || fetch(event.request).then((fetchResponse) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  }
});
```

### Graceful Degradation

If fonts fail to load (rare offline-first-install scenario):
```css
/* System fallbacks ensure app remains usable */
--font-ui: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-hero: 'Permanent Marker', 'Impact', 'Arial Black', cursive;
--font-mono: 'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace;
```

---

## Tailwind Config Update

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        // MCU Foundation
        'mcu-blue': '#00aaff',
        'mcu-red': '#ff4444',
        'mcu-gold': '#C9A227',
        'stark-dark': '#0a0c0e',
        'stark-surface': '#121216',

        // Spider-Verse Accents
        'spider-pink': '#ff00ff',
        'spider-cyan': '#00ffff',
        'spider-yellow': '#fef08a',

        // Keep existing series colors
        'series-1': '#6B7280',
        'series-2': '#22C55E',
        'series-3': '#8B5CF6',
        'series-4': '#EAB308',
        'series-5': '#EF4444',
        'spotlight': '#F97316',

        // Legacy (deprecate gradually)
        'marvel-red': '#ED1D24',
        'marvel-blue': '#006EC7',
        'marvel-gold': '#FFC107',
      },
      fontFamily: {
        'display': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'SF Mono', 'monospace'],
        'hero': ['Permanent Marker', 'cursive'],
        'hand': ['Caveat', 'cursive'],
        // Legacy
        'comic': ['Impact', 'Arial Black', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 0 20px rgba(0, 170, 255, 0.1)',
        'glow-blue': '0 0 15px rgba(0, 170, 255, 0.4), inset 0 0 5px rgba(0, 170, 255, 0.2)',
        'glow-red': '0 0 15px rgba(255, 68, 68, 0.4), inset 0 0 5px rgba(255, 68, 68, 0.2)',
        'sketch': '6px 6px 0 #111',
        // Legacy
        'comic': '4px 4px 0px #1A1A1A',
      },
      backdropBlur: {
        'glass': '12px',
        'glass-mobile': '6px',
      }
    }
  }
}
```

---

## Implementation Phases (REVISED per Gemini/ChatGPT Review)

> **Timeline revised from 8 days to 14 days** based on AI review consensus.
> Single-file architecture adds 30-40% overhead. Split into two releases.

---

### v3.0.0 - MCU Base (Days 1-10)

#### Phase 1: Foundation (Days 1-3)
**Goal**: Establish new design system without breaking existing functionality

- [ ] Create feature branch `feature/hybrid-ui-redesign`
- [ ] Add new CSS custom properties to `<style>` block
- [ ] Add new Tailwind config extensions
- [ ] Add Google Fonts link (Inter + Permanent Marker only - reduced from 4)
- [ ] Update `sw.js` to cache Google Fonts URLs
- [ ] Create `.mcu-glass` utility class (namespaced to avoid conflicts)
- [ ] Create `.mcu-glow-blue` and `.mcu-glow-red` utility classes
- [ ] Create `.mcu-hud-grid` background utility
- [ ] Add `will-change: transform` to glass panels for GPU acceleration
- [ ] Implement mobile blur toggle: `--glass-blur: 12px` → `0px` on mobile
- [ ] Test that existing functionality still works

#### Phase 2: Core Components (Days 4-5)
**Goal**: Migrate primary navigation and layout components

- [ ] Update `NavBar` component to MCU style
- [ ] Update `Header` component to glass panel
- [ ] Update `Dashboard` stats cards
- [ ] Update quick match buttons
- [ ] Update Settings page layout
- [ ] Verify all 14 tabs still render correctly

#### Phase 3a: Primitive Components FIRST (Days 6-7) - ChatGPT 5.2 Recommendation
**Goal**: Migrate high-reuse primitives before tabs to avoid styling 14 times

> **Why primitive-first?** If you migrate tabs first, you'll re-style buttons/inputs/cards
> 14 different times. Do primitives once, then tabs inherit.

- [ ] **Buttons** - Primary, secondary, danger, ghost variants
- [ ] **Inputs** - Text, search, select, toggle
- [ ] **Cards/Panels** - `mcu-glass` standard panel component
- [ ] **Badges** - Series badges, stat badges, status indicators
- [ ] **Modal Shell** - Glass overlay with close button
- [ ] **Toast Component** - For victory/defeat notifications
- [ ] **Stat Display** - Number + label + trend indicator

#### Phase 3b: Tab Migration (Days 8-9)
**Goal**: Apply primitives to all 14 tabs (~3-4 tabs/day with primitives done)

**Priority Order** (most-used first):
- [ ] Dashboard tab - Player OS home (highest traffic)
- [ ] Collection tab - card grid (most components)
- [ ] Settings tab - includes perf mode toggle
- [ ] Oracle tab - prediction display
- [ ] AI Chat tab - message bubbles
- [ ] Calculator tab - probability display
- [ ] Planner tab - season timeline
- [ ] Deck Manager tab
- [ ] Battle Pass tab
- [ ] Missions tab
- [ ] Economy tab
- [ ] Armor tracker tab (Hall of Armor with God Split effects)
- [ ] Simulator tab
- [ ] Board view tab

#### Phase 4: QA & Polish (Day 10)
**Goal**: Stabilize MCU base before Spider-Verse

- [ ] Mobile performance testing (backdrop-filter)
- [ ] Accessibility audit (contrast ratios, focus states)
- [ ] PWA offline testing (fonts cached)
- [ ] Cross-browser testing
- [ ] Touch target verification (44x44px minimum)
- [ ] Bundle size verification

---

### v3.1.0 - Spider-Verse Accents (Days 11-14)

#### Phase 5: Spider-Verse Animations (Days 11-12)
**Goal**: Add high-energy moments with careful trigger logic

- [ ] Victory splash overlay (TRANSIENT - 2 second duration)
- [ ] Defeat splash overlay (TRANSIENT - 2 second duration)
- [ ] Snap button animation enhancement
- [ ] Win streak indicator (PERSISTENT but SUBTLE - sketch border only, no glitch)
- [ ] Match log hover rotations (1-2°)

#### Phase 6: Accessibility & Final Polish (Days 13-14)
**Goal**: Ensure Spider-Verse effects are safe and optional

- [ ] Implement `prefers-reduced-motion` media query check
- [ ] Add "Reduce Motion" toggle in Settings
- [ ] Verify chromatic glitch doesn't trigger on persistent states
- [ ] Final performance pass
- [ ] User acceptance testing

---

## Files to Modify

| File | Changes |
|------|---------|
| `index.html` | All component updates, new CSS, new Tailwind config |
| `manifest.json` | Update theme_color to `#0a0c0e` |
| `sw.js` | Cache new font files |

---

## Testing Checklist

### Functionality (Must Pass)
- [ ] All 14 tabs navigate correctly
- [ ] Collection tracking works
- [ ] Match logging works
- [ ] AI chat works (all providers)
- [ ] Calculator works
- [ ] PWA installs correctly
- [ ] Offline mode works
- [ ] Data persists in localStorage

### Visual (Must Pass)
- [ ] MCU glass panels render correctly
- [ ] Glow effects visible but not overwhelming
- [ ] Typography hierarchy clear
- [ ] Spider-Verse accents trigger appropriately
- [ ] Series colors distinguishable
- [ ] Dark mode looks premium

### Performance (Must Pass)
- [ ] First Contentful Paint < 2s
- [ ] No jank on mobile scroll
- [ ] Backdrop-filter doesn't cause lag
- [ ] Animations respect reduced-motion

### Accessibility (Must Pass)
- [ ] WCAG AA contrast ratios
- [ ] Focus indicators visible
- [ ] Screen reader navigation works
- [ ] Touch targets 44px minimum

---

## Rollback Plan

If critical issues arise:
1. Git revert to `main` branch
2. v2.5.0 remains stable and deployed
3. Address issues on feature branch
4. Re-attempt merge after fixes

---

## Questions for Review (Gemini/ChatGPT)

1. **Performance**: Is `backdrop-filter: blur(12px)` too heavy for low-end mobile devices? Should we detect device capability and reduce to 6px or disable entirely?

2. **Font Loading**: Should we self-host fonts or use Google Fonts CDN? Trade-off between offline capability and initial load time.

3. **Spider-Verse Trigger Threshold**: When should chromatic glitch effects activate? Only victories, or also on 4+ cube wins, win streaks, etc.?

4. **Legacy Cleanup**: Should we remove old Marvel Comic classes (`.panel-border`, `.halftone`, `.shadow-comic`) in this release, or keep for gradual migration?

5. **Color Accessibility**: The `#00aaff` (MCU blue) on `#0a0c0e` background has ~5.8:1 contrast ratio. Should we lighten the blue for better accessibility?

6. **Animation Budget**: How many simultaneous animations are acceptable before performance degrades? Should we queue/throttle Spider-Verse effects?

---

## Reference Materials

- **Design Source Files**: `docs/stitch_designs/stitch_snapapoulous_prime_dashboard/`
  - `stark_tech_match_dashboard/` - Primary MCU base
  - `avengers_tactical_hud_dashboard/` - Alternative MCU base
  - `spider-verse_glitch_dashboard/` - Spider-Verse accents
  - `spider-verse_victory_splash/` - Victory overlay reference

- **Design System Doc**: `docs/ui-ux-designer-personas.md`

- **Council Analysis**: 4-AI review completed January 23, 2026
  - NVIDIA Qwen, DeepSeek, MiniMax, Kimi
  - Consensus: Moderate migration complexity, 2-3 days core work
  - Key concerns: backdrop-filter performance, font loading, accessibility

---

## AI Review Summary (January 23, 2026)

### Reviewers
- **Gemini 3 Pro Thinking** (with Snapapoulous v2.0 Persona)
- **ChatGPT 5.2** (detailed technical review)
- **Gemini 3 Pro** (via MKG)
- **ChatGPT** (via MKG OpenAI backend)
- **MKG Council** (NVIDIA Qwen, DeepSeek, MiniMax, Kimi)

### Consensus Decisions (FINAL)

| Topic | Decision | Source | Rationale |
|-------|----------|--------|-----------|
| **Timeline** | Extended to 14 days | Gemini 3 Pro (MKG) | Single-file adds 30-40% overhead |
| **Release Strategy** | Split: v3.0 (MCU) + v3.1 (Spider-Verse) | Gemini 3 Pro (MKG) | Protects stability |
| **Fonts** | Inter + Permanent Marker only | Gemini 3 Pro Thinking | Reduce from 4 to 2 for performance |
| **Font Hosting** | Self-host for offline-first | Gemini 3 Pro Thinking | CDN introduces point of failure |
| **Backdrop-filter** | CSS variable toggle (`data-perf`) | ChatGPT 5.2 | 12px → 0px + solid bg on low-power |
| **Spider-Verse Triggers** | Cube Equity based | Gemini 3 Pro Thinking | 8-cube = max, 1-cube = minimal |
| **Overlay Intensity** | Full splash only on 4+ cubes | ChatGPT 5.2 | Prevents UI fatigue |
| **CSS Namespacing** | Prefix with `mcu-` | All reviewers | Avoid legacy conflicts |
| **Legacy Classes** | FULL PURGE in v3.0 | Gemini 3 Pro Thinking | "Mixed styles = bubble gum" |
| **Semantic Tokens** | Add `--ui-*` layer | ChatGPT 5.2 | Reduces decision fatigue |
| **Accessibility** | Complete reduced-motion handling | ChatGPT 5.2 | Kill ALL animations, not just specific |
| **Migration Order** | Primitive-first, then tabs | ChatGPT 5.2 | Avoid re-styling 14 times |
| **Hybrid Guardrails** | 80/20 MCU/Spider ratio | ChatGPT 5.2 | Prevent theming drift |
| **Hall of Armor** | God Split holographic effects | Gemini 3 Pro Thinking | Premium feel for Inked/Gold variants |
| **Text Glow** | Neon outer glow for accessibility | Gemini 3 Pro Thinking | Maintains aesthetic + contrast |

### Key Risks Identified

1. **CSS Specificity Hell** - Single file means generic classes will conflict
2. **DOM Bloat** - 14 tabs in one DOM requires careful mount/unmount strategy
3. **Touch Targets** - MCU thin-line aesthetic risks sub-44px buttons
4. **Thermal Throttling** - Users run alongside Marvel Snap (GPU-heavy)

### Gemini 3 Pro Recommended CSS Architecture

```css
:root {
    /* MCU Base (Default) */
    --bg-panel: rgba(18, 18, 22, 0.7);
    --border-color: rgba(0, 170, 255, 0.3);
    --glow-strength: 0px 0px 15px rgba(0, 170, 255, 0.4);
    --backdrop: blur(12px);
}

/* Low-power mode override */
@media (max-width: 768px), (prefers-reduced-motion: reduce) {
    :root {
        --backdrop: none;
        --glow-strength: none;
    }
}

/* Namespaced utility */
.mcu-glass {
    background: var(--bg-panel);
    backdrop-filter: var(--backdrop);
    -webkit-backdrop-filter: var(--backdrop);
    border: 1px solid var(--border-color);
    box-shadow: var(--glow-strength);
    border-radius: 12px;
    will-change: transform;
}
```

---

*Document created: January 23, 2026*
*Reviewed by: Gemini 3 Pro Thinking, ChatGPT 5.2, Gemini 3 Pro (MKG), ChatGPT (MKG), MKG Council*
*Author: Claude Code*
*Status: **APPROVED - AWAITING USER REVIEW** - Comprehensive AI consensus achieved*

---

## Snapapoulous v2.0 Persona Verdict

> *"Hero, the suit is being upgraded. We're moving from paper and ink to arc-reactors and multi-dimensional glitches. Let's initialize the Stark-Tech overlay. This is how a strategist views the multiverse."*

**PROCEED.**
