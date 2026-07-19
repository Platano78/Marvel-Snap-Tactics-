# Deck Simulator Rebuild — Implementation Plan

> Status: ready to execute. Approved as its own arc by ADR-006 (`docs/project_notes/decisions.md`).
> This doc is decision-complete — a fresh session should not need to re-run git archaeology.

## 1. Recovery summary

The Deck Simulator was added in `f84ce2a` ("Add comprehensive Deck Simulator feature", Jan 22 2026,
+1229/-2 lines on `index.html`) and deleted in `a8a2875` ("Trim 6 more tabs...", Mar 1 2026, part of a
2765-line net removal across 6 tabs). It survived three UI redesigns between those commits (MCU Hybrid
`a04e917`, Cosmic Purple `6b89d6e`, Stitch v3.0.0 `418c304`) with its **math and worker logic byte-for-byte
unchanged** — only Tailwind class names shifted per redesign. This was confirmed by diffing the engine
code at `f84ce2a` against the last pre-deletion commit (`3a0c091:index.html:5902-6317`).

A full user-facing spec of the feature already exists at `docs/SIMULATOR.md` (308 lines, written during
the original build) — it documents all 6 modes, the advanced rules panel, and the technical model in
prose. Treat it as ground truth for *behavior*; this plan focuses on *integration into today's codebase*.

**Verified**: all math/RNG snippets below were extracted to standalone `.js` files and validated with
`node --check` (syntax) and executed with `node -e` (behavior) — see §5 gate results.

## 2. Feature inventory (recovered, verbatim where noted)

### 2.1 Six simulation modes
1. **Opening Hand Test** (`mode: 'opening'`) — probability of each card appearing in the 3-card starting hand, plus 5 sample hands.
2. **Draw by Turn** (`mode: 'draw'`) — per-card % chance of having drawn it by end of each turn 1-6, color-coded (green ≥70%, yellow 40-69%, gray <40%).
3. **Curve/Brick Analysis** (`mode: 'curve'`) — per-turn on-curve rate, brick rate, avg playable energy.
4. **Combo Finder** (`mode: 'combo'`) — probability of holding ALL selected combo-piece cards by each turn, needs ≥2 cards selected.
5. **Interactive Play-Through** (`mode: 'play'`) — step-by-step draw simulation: New Game / Draw Next / Undo / Auto-Play, with drawn-this-turn gold highlight.
6. **All Results** (`mode: 'advanced'`) — renders modes 1-4's panels together in one scroll.

### 2.2 Advanced Rules panel (collapsible, `showAdvanced` toggle)
| Option | Default | Range | Effect |
|---|---|---|---|
| Starting Hand Size | 3 | 1-12 | overrides opening hand size |
| Extra Draws/Turn | 0 | 0-5 | additional cards drawn each turn |
| Thinning/Turn | 0 | 0-5 | cards randomly removed from deck each turn |
| Junk Inserts/Turn | 0 | 0-5 | unplayable `{cost:99, isJunk:true}` cards added each turn |
| Hand Size Limit | 0 (unlimited) | 0-20 | excess cards randomly discarded |

Any non-default value sets `isAdvancedModified = true`, which **disables the exact-math comparison** (hypergeometric formulas assume baseline rules) and forces Monte Carlo only. This is a real product rule, not a bug — preserve it.

### 2.3 Engines
- **Exact math engine** (`SimulationEngine`) — closed-form hypergeometric distribution, instant, only valid at baseline rules (12-card deck, 3-card hand, 1 draw/turn).
- **Monte Carlo engine** (`MonteCarloEngine` + Web Worker) — full rule support, seeded Mulberry32 RNG, chunked execution (1000-run chunks via `setTimeout(runChunk, 0)`) so the worker's own event loop yields and posts progress between chunks.
- **Routing rule**: `numRuns >= 5000` → Web Worker (via Blob URL, no build step). `numRuns < 5000` → main thread inside `requestAnimationFrame`.

### 2.4 Other features to preserve
- Deck selector reads from the existing deck system (today: `snap_decks`).
- Run-count presets: 1K / 10K / 50K buttons + free-text custom input (clamped 100-200,000).
- Progress bar with Cancel button (terminates the worker mid-run).
- Seeded RNG toggle + seed input for reproducible results.
- Sample opening hands display (first 5 of up to 10 captured runs).
- `localStorage` persistence: last-selected deck + simulator settings (run count, seed toggle, seed, advanced options).
- Combo card picker: click chips from the selected deck's 12 cards to toggle combo-piece membership.

## 3. Verbatim recovered code

### 3.1 Hypergeometric math engine (`SimulationEngine`)

Source: `f84ce2a:index.html` lines 3343-3413 (unit-verified: `openingHandProbabilities(12,3) === 0.25`,
`hypergeometricAtLeastOne(12,1,3) === 0.25`, both match the closed-form by hand).

```javascript
const SimulationEngine = {
  // Factorial with memoization for performance
  _factorialCache: [1, 1],
  factorial(n) {
    if (n < 0) return 0;
    if (n < this._factorialCache.length) return this._factorialCache[n];
    let result = this._factorialCache[this._factorialCache.length - 1];
    for (let i = this._factorialCache.length; i <= n; i++) {
      result *= i;
      this._factorialCache[i] = result;
    }
    return result;
  },

  // Combination C(n, k) = n! / (k! * (n-k)!)
  combination(n, k) {
    if (k < 0 || k > n) return 0;
    if (k === 0 || k === n) return 1;
    // Optimize for large numbers
    k = Math.min(k, n - k);
    let result = 1;
    for (let i = 0; i < k; i++) {
      result = result * (n - i) / (i + 1);
    }
    return Math.round(result);
  },

  // Hypergeometric probability: P(X >= 1) = 1 - P(X = 0)
  // N = population size (deck), K = success states (copies), n = draws
  hypergeometricAtLeastOne(N, K, n) {
    if (K <= 0 || n <= 0 || N <= 0) return 0;
    if (K >= N || n >= N) return 1;
    // P(X = 0) = C(K,0) * C(N-K, n) / C(N, n)
    const pZero = this.combination(N - K, n) / this.combination(N, n);
    return Math.max(0, Math.min(1, 1 - pZero));
  },

  // Probability of drawing ALL of k specific cards by drawing n cards
  // Uses inclusion-exclusion principle
  hypergeometricAllCards(N, targetCards, n) {
    const k = targetCards.length;
    if (k === 0) return 1;
    if (k > n) return 0;
    if (n >= N) return 1;

    // P(have all k cards in n draws) = C(N-k, n-k) / C(N, n)
    return this.combination(N - k, n - k) / this.combination(N, n);
  },

  // Opening hand probabilities for each card
  openingHandProbabilities(deckSize, handSize) {
    // P(specific card in hand) = 1 - C(deckSize-1, handSize) / C(deckSize, handSize)
    // Simplifies to: handSize / deckSize
    return handSize / deckSize;
  },

  // Probability of having specific card by turn T
  cardByTurnProbability(deckSize, handSize, turn) {
    const cardsSeen = Math.min(deckSize, handSize + turn);
    return cardsSeen / deckSize;
  }
};
```

### 3.2 Seeded RNG — Mulberry32

Source: `f84ce2a:index.html` lines 3415-3425. **Determinism-verified**: two instances created with the
same seed produce an identical output stream (see §5.1).

```javascript
const createSeededRNG = (seed) => {
  let state = seed;
  return () => {
    state |= 0;
    state = state + 0x6D2B79F5 | 0;
    let t = Math.imul(state ^ state >>> 15, 1 | state);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
};
```

### 3.3 Monte Carlo engine (main-thread path, for `numRuns < 5000`)

Source: `f84ce2a:index.html` lines 3427-3605.

```javascript
const MonteCarloEngine = {
  // Shuffle array using Fisher-Yates with provided RNG
  shuffle(array, rng) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },

  // Simulate single game and return results
  simulateGame(deck, options, rng) {
    const {
      handSize = 3,
      turnsToSimulate = 6,
      extraDrawsPerTurn = 0,
      thinningPerTurn = 0,
      junkInsertsPerTurn = 0,
      handSizeLimit = Infinity
    } = options;

    let currentDeck = this.shuffle([...deck], rng);
    let hand = currentDeck.splice(0, handSize);
    const drawnCards = [...hand];
    const handByTurn = [{ turn: 0, hand: [...hand], deckSize: currentDeck.length }];

    for (let turn = 1; turn <= turnsToSimulate; turn++) {
      // Apply thinning (remove cards from deck)
      for (let i = 0; i < thinningPerTurn && currentDeck.length > 0; i++) {
        const idx = Math.floor(rng() * currentDeck.length);
        currentDeck.splice(idx, 1);
      }

      // Apply junk inserts
      for (let i = 0; i < junkInsertsPerTurn; i++) {
        currentDeck.push({ name: `Junk_${turn}_${i}`, cost: 99, power: 0, isJunk: true });
      }

      // Draw cards
      const drawCount = 1 + extraDrawsPerTurn;
      for (let i = 0; i < drawCount && currentDeck.length > 0; i++) {
        const card = currentDeck.shift();
        hand.push(card);
        drawnCards.push(card);
      }

      // Apply hand size limit
      while (hand.length > handSizeLimit && hand.length > 0) {
        const idx = Math.floor(rng() * hand.length);
        hand.splice(idx, 1);
      }

      handByTurn.push({ turn, hand: [...hand], deckSize: currentDeck.length });
    }

    return { hand, drawnCards, handByTurn };
  },

  // Run Monte Carlo simulation
  runSimulation(deck, options, numRuns, onProgress, seed = null) {
    const results = {
      openingHands: {},
      cardByTurn: {},
      curveAnalysis: [],
      comboResults: {},
      sampleHands: []
    };

    const comboCards = options.comboCards || [];
    const deckCardNames = deck.map(c => c.name);

    // Initialize tracking
    deckCardNames.forEach(name => {
      results.openingHands[name] = 0;
      results.cardByTurn[name] = Array(7).fill(0);
    });

    for (let turn = 1; turn <= 6; turn++) {
      results.curveAnalysis.push({
        turn,
        onCurvePlays: 0,
        brickCount: 0,
        totalPlayableEnergy: 0
      });
    }

    if (comboCards.length > 0) {
      for (let turn = 1; turn <= 6; turn++) {
        results.comboResults[turn] = 0;
      }
    }

    // Run simulations
    for (let i = 0; i < numRuns; i++) {
      const simRng = seed !== null ? createSeededRNG(seed + i) : () => Math.random();
      const { handByTurn } = this.simulateGame(deck, options, simRng);

      // Opening hand analysis
      const openingHand = handByTurn[0].hand;
      openingHand.forEach(card => {
        if (results.openingHands[card.name] !== undefined) {
          results.openingHands[card.name]++;
        }
      });

      // Store sample hands (first 10 runs)
      if (i < 10) {
        results.sampleHands.push(openingHand.map(c => c.name));
      }

      // Card by turn analysis
      const seenCards = new Set();
      handByTurn.forEach(({ turn, hand }) => {
        hand.forEach(card => {
          if (!seenCards.has(card.name) && results.cardByTurn[card.name]) {
            seenCards.add(card.name);
            for (let t = turn; t <= 6; t++) {
              results.cardByTurn[card.name][t]++;
            }
          }
        });
      });

      // Curve analysis
      handByTurn.slice(1).forEach(({ turn, hand }) => {
        const analysis = results.curveAnalysis[turn - 1];
        const playableCosts = hand.filter(c => !c.isJunk && c.cost <= turn).map(c => c.cost);

        if (playableCosts.length > 0) {
          analysis.onCurvePlays++;
          analysis.totalPlayableEnergy += Math.max(...playableCosts);
        } else {
          analysis.brickCount++;
        }
      });

      // Combo analysis
      if (comboCards.length > 0) {
        handByTurn.slice(1).forEach(({ turn, hand }) => {
          const handNames = new Set(hand.map(c => c.name));
          if (comboCards.every(name => handNames.has(name))) {
            results.comboResults[turn]++;
          }
        });
      }

      // Progress callback
      if (onProgress && i % Math.max(1, Math.floor(numRuns / 100)) === 0) {
        onProgress(i / numRuns);
      }
    }

    // Convert counts to percentages
    Object.keys(results.openingHands).forEach(name => {
      results.openingHands[name] = (results.openingHands[name] / numRuns) * 100;
    });

    Object.keys(results.cardByTurn).forEach(name => {
      results.cardByTurn[name] = results.cardByTurn[name].map(count => (count / numRuns) * 100);
    });

    results.curveAnalysis = results.curveAnalysis.map(a => ({
      ...a,
      onCurveRate: (a.onCurvePlays / numRuns) * 100,
      brickRate: (a.brickCount / numRuns) * 100,
      avgPlayableEnergy: a.totalPlayableEnergy / numRuns
    }));

    if (comboCards.length > 0) {
      Object.keys(results.comboResults).forEach(turn => {
        results.comboResults[turn] = (results.comboResults[turn] / numRuns) * 100;
      });
    }

    return results;
  }
};
```

### 3.4 Web Worker (Blob URL, no build step) — for `numRuns >= 5000`

Source: `f84ce2a:index.html` lines 3607-3755. The worker body's simulation logic is a **byte-for-byte
duplicate** of §3.2's `createSeededRNG` and §3.3's `shuffle`/`simulateGame`/`runSimulation` — it has to
be, because a Blob-constructed worker has no module system to `import` from the main thread. **Reuse
§3.2/§3.3's bodies verbatim inside the wrapper below; do not re-derive the simulation logic.** The two
real differences from §3.3 are: (1) results are returned via `self.postMessage`, not a function return,
and (2) execution is chunked — `runChunk()` processes `chunkSize` (default 1000) games, posts a
`{type:'progress', progress}` message, then `setTimeout(runChunk, 0)` to yield the worker's own event
loop before continuing, finishing with `{type:'complete', results}`.

```javascript
// Web Worker code as string for inline Blob worker (verified: node --check passes with `self` stubbed)
const workerCode = `
  ${/* verbatim: createSeededRNG from §3.2, shuffle + simulateGame from §3.3 (same bodies, const-declared) */''}
  self.onmessage = function(e) {
    const { deck, options, numRuns, seed, chunkSize = 1000 } = e.data;
    const results = { openingHands: {}, cardByTurn: {}, curveAnalysis: [], comboResults: {}, sampleHands: [] };
    const comboCards = options.comboCards || [];
    // ... same per-run tracking init, per-game accumulation, and percentage finalization as
    //     MonteCarloEngine.runSimulation (§3.3) — copy that logic in unchanged ...

    let completed = 0;
    const runChunk = () => {
      const chunkEnd = Math.min(completed + chunkSize, numRuns);
      for (let i = completed; i < chunkEnd; i++) {
        const simRng = seed !== null ? createSeededRNG(seed + i) : () => Math.random();
        const { handByTurn } = simulateGame(deck, options, simRng);
        // ... same opening-hand / cardByTurn / curveAnalysis / comboResults accumulation as §3.3 ...
      }
      completed = chunkEnd;
      self.postMessage({ type: 'progress', progress: completed / numRuns });
      if (completed < numRuns) {
        setTimeout(runChunk, 0);
      } else {
        // ... same percentage finalization as §3.3's tail ...
        self.postMessage({ type: 'complete', results });
      }
    };
    runChunk();
  };
`;

// Create Web Worker from Blob
const createSimulationWorker = () => {
  const blob = new Blob([workerCode], { type: 'application/javascript' });
  return new Worker(URL.createObjectURL(blob));
};
```

**No build step required** — this is the load-bearing pattern for a single-`index.html` PWA (ADR-001):
the worker source lives as a plain JS template literal string in the main script, gets wrapped in a
`Blob`, and `URL.createObjectURL(blob)` produces a same-origin URL the `Worker` constructor accepts. No
bundler, no separate `.js` file to serve, no CORS issue. The full un-abridged worker body (all four
functions inlined, no elisions) was extracted to a scratch file and syntax/behavior-verified — see §5.3;
copy it in full at implementation time rather than retyping from this abridged listing.

### 3.5 Old UI component structure (for reference — do NOT copy classes)

`Simulator({ decks, collection })` panel order, recovered from `f84ce2a` / `3a0c091:index.html:6317-6832`
(reusable as *information architecture*; class vocabulary is retired, see §4.2):
`Header` → Deck Selector (`<select>` + owned/missing chip row) → Mode Selector (6-button grid) → Run
Controls (hidden in Play mode: 1K/10K/50K presets + custom input, seed toggle, Run ↔ progress+Cancel) →
Advanced Rules (collapsible, 5 inputs, "Modified" badge, reset link, warning banner when modified) →
Combo Card Selector (`combo` mode only, chip toggles over the deck's 12 cards) → Results panels
(conditional per mode; `advanced` shows all four) → Play-Through panel (`play` mode only: New Game /
Draw Next / Undo, hand display, drawn-this-turn highlight, remaining-deck counter) → Info panel (shown
pre-results, outside Play mode: static 12/3/1/9 draw-schedule reference).

## 4. Integration plan for the current codebase

### 4.1 Deck source — verified against today's model

Grep'd at HEAD (`949114e`): decks are stored under `localStorage['snap_decks']` as (shape shown for
reference, not extracted source — see `index.html:3395-3401` and `:6209-6215` for the real object literals):
```
{
  id: string,          // crypto.randomUUID() or generateId()
  name: string,
  cards: string[],      // 12 display names (e.g. "Shou-Lao"), NOT CardDefIds
  createdAt: string,    // ISO timestamp
  updatedAt: string,
  imported?: boolean
}
```
This **matches the old model exactly** (`deck.cards` was already an array of display-name strings in
`f84ce2a` — `deckCards = selectedDeck.cards.map(name => uniqueCards.find(c => c.name === name) || ...)`).
**No shape migration needed.**

One real change since the old code: HEAD now has a dedicated `cardLookup` `Map` built per-component
(`index.html:6167-6174`) that indexes **both** display name and `defId`, with a `resolveToDisplayName`
helper — this exists because imported decks can contain raw `CardDefId`s that need resolving before
lookup (`a8a2875`'s own commit message: "Deck cards imported as raw CardDefId... resolve to display
names via cardLookup map"). The old Simulator's naive `uniqueCards.find(c => c.name === name)` would
silently show cards as `{name, cost:0, power:0, series:0}` placeholders for any unresolved CardDefId.
**Use the current `cardLookup` pattern, not the old naive `.find()`.** Build it once per Simulator mount:
```javascript
const cardLookup = useMemo(() => {
  const map = new Map();
  uniqueCards.forEach(c => { map.set(c.name, c); if (c.defId) map.set(c.defId, c); });
  return map;
}, [uniqueCards]);
const deckCards = selectedDeck
  ? selectedDeck.cards.map(name => cardLookup.get(name) || { name, cost: 0, power: 0, series: 0 })
  : [];
```

### 4.2 Cosmic Purple canon mapping (per `docs/design-canon.md`)

| Old (comic-book) | New (Cosmic Purple canon) |
|---|---|
| `bg-gray-800 rounded-lg p-4 panel-border` | `stitch-card p-5` (soft `rounded-2xl`+) |
| `bg-marvel-red` (primary action) | `bg-cosmic-purple-text` / `bg-cosmic-purple` pill buttons |
| `bg-marvel-blue`, `bg-marvel-gold` | Purple is the ONE accent family — gold reserved, rare (rule 1) |
| `font-comic` headers | `font-display font-bold tracking-tight`, no script/comic fonts (rule 4) |
| Sharp button corners | `rounded-full` on all interactive controls — mode buttons, run buttons, chips (roundness: ROUND_FULL) |
| Static color bars (curve chart) | Keep semantic red/green ONLY for win/brick states (rule 1) — no decorative color |
| Comic "pop" animations, hard drop shadows | Interaction-only glow via `--ease-snap`; no static glow, no `transition: all` (rules 2, 3) |
| `text-gray-400` labels | `text-xs uppercase tracking-[0.15em] font-semibold` muted labels (rule 4) |
| N/A | Real card art via `getCardArtUrl` in deck-chip rows — no bare text pills (rule 5, "no fake numbers") |

**No fake numbers**: every panel must render only from real `results`/`exactResults` state — no
placeholder percentages, no lorem-ipsum sample hands. Empty state (no deck selected, or deck ≠ 12 cards)
must say so plainly, matching the "art-teaser empty state" pattern used for Analytics/Missions in
`c468f62`.

### 4.3 Tab routing — exact pattern from the Analytics precedent (`c468f62`)

Analytics was restored as a **secondary tab** (not in the 6-slot `NavBar.primaryTabs`, reachable via
Settings → "More Features" grid) rather than displacing a primary tab. Do the same for `simulator` — do
**not** re-add a 7th primary nav slot or displace an existing one (the old code replaced "Calc" with
"Sim"; that trade-off is not being reopened here since Calculator itself is gone too — confirm at
kickoff, see Open Questions).

Four call sites to touch, mirroring Analytics's four:

1. **`TAB_INDEX`** (`index.html:3775`) — append `, simulator:11` (next free index after `analytics:10`).
2. **Title map** (`index.html:~10395`, inside the `document.title` effect) — add `simulator: 'Simulator'`.
3. **URL whitelist** (`index.html:10515`) — add `'simulator'` to the allowed-tab array so
   `?tab=simulator` deep-links work, same as `'analytics'` was added.
4. **Route switch** (`index.html:~10734`, alongside `activeTab === 'analytics'`) — add:
   ```jsx
   {activeTab === 'simulator' && (
     <ErrorBoundary>
       <DeckSimulator decks={decks} collection={collection} cardLookup={cardLookup} />
     </ErrorBoundary>
   )}
   ```
5. **Settings "More Features" tile** (`index.html:~8908-8945`) — add a tile following the exact
   `stitch-list-item` button pattern used for Analytics/Profile/Oracle/Dashboard/Match History:
   ```jsx
   <button
     onClick={() => window.dispatchEvent(new CustomEvent('setActiveTab', { detail: 'simulator' }))}
     className="stitch-list-item p-3 min-h-[44px] flex flex-col items-center"
   >
     <span className="material-symbols-outlined text-2xl mb-1 text-cosmic-purple-text" aria-hidden="true">casino</span>
     <span className="text-white text-sm">Simulator</span>
   </button>
   ```
   (`casino` is the Material Symbols icon nearest the old 🎲 emoji; confirm rendering before commit.)

Rename the component from `Simulator` to `DeckSimulator` — a bare `Simulator` identifier risks
collision/ambiguity given the file already has many single-word component names; the Analytics
precedent used a specific name (`CardPerformanceView`), not a generic one.

### 4.4 What does NOT need to change

- The math (§3.1), RNG (§3.2), Monte Carlo engine (§3.3), and worker (§3.4) are drop-in — verified
  unchanged across three redesigns and independently gate-verified in §5. Copy them in as-is.
- `localStorage` keys `snap_simulator_deck` and `snap_simulator_settings` are new, uncontested keys —
  no collision with anything currently in `docs/project_notes/key_facts.md`.

## 5. Gate verification (already run against the recovered code)

### 5.1 Determinism gate — PASS
Two `createSeededRNG(42)` instances, called 3 times each: identical output streams
(`0.9797282677609473, 0.3067522644996643, 0.484205421525985` both times). Two full
`MonteCarloEngine.runSimulation(deck, opts, 50000, null, 42)` calls with the same seed produced
byte-identical `openingHands` and `curveAnalysis` objects (`JSON.stringify` equality). **Confirms the
same-seed→identical-results property required by the rebuild's determinism gate.**

### 5.2 Math gate — PASS
12-card synthetic deck, 3-card hand, baseline rules, 50,000 Monte Carlo runs vs. exact hypergeometric:
opening-hand probability for a given card — exact `25.00%`, Monte Carlo `25.23%` (0.23 percentage-point
gap, well inside the ≤0.5pp tolerance `docs/SIMULATOR.md`'s own FAQ commits to: *"With 50K+ runs, they
should be within 0.5% of exact values"*).

### 5.3 Syntax gate — PASS
`node --check` on all four extracted snippets (`SimulationEngine`+RNG, `MonteCarloEngine`, worker body
with a stubbed `self`) returned clean on every file — no syntax errors in the recovered code.

## 6. Slice plan

### S1 — Engine + worker + one mode (Curve Analysis)
**Scope**: `SimulationEngine`, `createSeededRNG`, `MonteCarloEngine`, `workerCode`/`createSimulationWorker`
copied in verbatim (§3.1-3.4). New `DeckSimulator` component shell: deck selector (using current
`cardLookup`), mode selector (all 6 buttons present but only `curve` wired), run controls (presets +
custom + seed toggle), Advanced Rules panel, Curve Analysis results panel only. Wire the 5 routing call
sites (§4.3). Cosmic Purple canon styling throughout (§4.2).

**Gates**:
- Determinism: same seed + same deck + same options → byte-identical `curveAnalysis` across two runs (reuse §5.1's methodology, assert in-app).
- Math: baseline rules, 50K runs, on-curve rate for a known-safe synthetic deck within 1pp of hand-computed expectation.
- Deck with ≠12 cards → simulator shows a real (not fake-data) disabled/empty state, run button disabled.
- Worker path (≥5000 runs) and main-thread path (<5000 runs) both produce a `curveAnalysis` array of length 6 with keys `onCurveRate`/`brickRate`/`avgPlayableEnergy`.
- Cancel mid-run terminates the worker (no orphaned worker in DevTools > Application after cancel).
- No new primary nav slot added; reachable only via Settings → More Features (matches §4.3 decision).

### S2 — Remaining five modes
**Scope**: Opening Hand, Draw by Turn, Combo Finder, Interactive Play-Through, All Results. Combo card
picker chip UI. Play-through state machine (New Game / Draw Next / Undo / Auto-Play) — note the old
`autoPlay` used a `setTimeout(r, 500)` polling loop with a stale-closure bug risk (`currentState` computed
outside the setter); reimplement Auto-Play with a `useEffect`-driven interval or a reducer, not the
old closure pattern verbatim.

**Gates**:
- Each mode's results match `docs/SIMULATOR.md`'s worked examples in shape (not exact numbers — those
  are RNG-dependent, but table columns/turn ranges/percentage formatting must match the documented spec).
- Combo Finder requires ≥2 selected cards before enabling Run (matches old behavior).
- Play-Through Undo correctly restores prior hand/deck state through ≥3 undo steps.
- Exact-math comparison line disappears the instant any Advanced Rule is non-default (isAdvancedModified gate, §2.2).
- All Results mode renders all four analysis panels without layout overflow on mobile viewport (375px).

### S3 — Polish, canon compliance, cross-gates
**Scope**: full Cosmic Purple audit against `docs/design-canon.md` rules 1-7 (accent family, glow
discipline, transition naming, typography, real card art in chip rows, density, kill-list class check).
Empty states for zero-deck / non-12-card-deck cases. `localStorage` persistence round-trip test.
Accessibility pass (button `aria-label`s, keyboard nav through mode grid, focus states on inputs).
Update `docs/SIMULATOR.md` if any documented behavior changed during the rebuild (e.g. Auto-Play timing).

**Gates**:
- Zero kill-list classes present (`Bangers`/`Caveat`/`Permanent Marker`, halftone/kirby, comic tilts, hard offset shadows) — grep-verified.
- Every interactive control is `rounded-full`; every panel is `rounded-2xl`+.
- `localStorage['snap_simulator_deck']` and `snap_simulator_settings'` persist across a reload and repopulate the UI correctly.
- Lighthouse/manual a11y pass: all buttons reachable by keyboard, all inputs have associated labels.
- `docs/SIMULATOR.md` accuracy re-verified line-by-line against shipped behavior; corrections committed.

## 7. Open questions (owner decides at kickoff)

1. **Nav placement** — confirmed secondary (Settings → More Features, matching Analytics), not a
   primary `NavBar` slot. If the owner wants it primary instead, that demotes something else — flag
   before S1 lands.
2. **Run-count ceiling** — old code allowed up to 200,000 runs; confirm that's still acceptable
   wall-clock/battery cost on target mobile devices, or lower it.
3. **Auto-Play reimplementation** — old `autoPlay` used a `setTimeout(r, 500)` polling loop with a
   stale-closure risk (`currentState` computed outside the setter); being replaced with a
   `useEffect`-driven interval or reducer, not ported verbatim. Confirm the interaction stays "draw one
   turn every 500ms, no pause control" or whether a pause/speed control is now wanted.
4. **Icon choice** — Material Symbols `casino` proposed for the More Features tile (nearest to the old
   🎲); confirm visually before commit, alternatives: `stadia_controller`, `insights`.

Not actually open, noted for completeness: `Junk_${turn}_${i}` synthetic card names can't collide with
`results.cardByTurn` keys, since junk is injected into the deck array after `deckCardNames` (the key
source) is already computed.
