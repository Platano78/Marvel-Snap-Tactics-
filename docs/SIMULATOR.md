# Deck Simulator Guide

The Deck Simulator is a comprehensive probability analysis tool for Marvel Snap. Test your deck's consistency, find optimal combos, and understand your draw odds before you queue up.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Simulation Modes](#simulation-modes)
  - [Opening Hand Test](#opening-hand-test)
  - [Draw by Turn](#draw-by-turn)
  - [Curve Analysis](#curve-analysis)
  - [Combo Finder](#combo-finder)
  - [Interactive Play-Through](#interactive-play-through)
  - [All Results](#all-results)
- [Advanced Rules](#advanced-rules)
- [Technical Details](#technical-details)
- [Tips & Strategies](#tips--strategies)

---

## Quick Start

1. **Create a Deck** - Go to the Decks tab and create a 12-card deck
2. **Open Simulator** - Navigate to the Sim tab (🎲)
3. **Select Your Deck** - Choose from the dropdown
4. **Pick a Mode** - Start with "Opening Hand" or "Curve Analysis"
5. **Run Simulation** - Click the run button (10K runs is a good default)

---

## Simulation Modes

### Opening Hand Test

**What it shows:** The probability of each card appearing in your starting hand.

**Marvel Snap Rules:**
- You draw 3 cards at the start of each game
- Each card has a 25% chance (3/12) of being in your opening hand

**Use this to:**
- Verify your key 1-drops appear often enough
- Check if you're likely to start with your engine pieces
- Compare different deck configurations

**Example Output:**
```
Card            | In Opening Hand
─────────────────────────────────
Sunspot         | 25.2%
Nova            | 24.8%
Carnage         | 25.1%
Bucky Barnes    | 24.9%
...
```

**Sample Hands:** The simulator also shows 5 example opening hands so you can see realistic starting scenarios.

---

### Draw by Turn

**What it shows:** The probability of having drawn each card by the end of each turn.

**Marvel Snap Draw Schedule:**
| Turn | Cards Drawn | Total Cards Seen |
|------|-------------|------------------|
| Start | 3 | 3 |
| 1 | +1 | 4 |
| 2 | +1 | 5 |
| 3 | +1 | 6 |
| 4 | +1 | 7 |
| 5 | +1 | 8 |
| 6 | +1 | 9 |

**Use this to:**
- Know when you'll likely have your win condition
- Plan which turns you need specific cards
- Understand why certain combos are more reliable than others

**Reading the Table:**
- Green (70%+): Very likely to have this card
- Yellow (40-69%): Moderate chance
- Gray (<40%): Unlikely to have drawn yet

---

### Curve Analysis

**What it shows:** How often your deck can play on curve and when it bricks.

**Definitions:**
- **On-Curve:** You have at least one card with cost ≤ current turn's energy
- **Brick:** You have NO playable cards for that turn

**Metrics Provided:**
- **On-Curve Rate:** % of games where you have something to play
- **Brick Rate:** % of games where you're stuck passing
- **Avg Playable Energy:** The average highest cost you can play each turn

**Example Output:**
```
Turn | Playable | Brick | Avg Energy
──────────────────────────────────────
  1  | 72.3%    | 27.7% | 0.8
  2  | 85.1%    | 14.9% | 1.6
  3  | 91.2%    |  8.8% | 2.4
  4  | 94.5%    |  5.5% | 3.2
  5  | 96.8%    |  3.2% | 4.1
  6  | 98.2%    |  1.8% | 4.9
```

**What good numbers look like:**
- Turn 1: 60-75% on-curve is normal (most decks don't run many 1-drops)
- Turn 2-3: 80%+ is healthy
- Turn 4-6: 90%+ means your deck flows well

**Warning Signs:**
- Turn 1 brick >40%: Consider more 1-drops
- Turn 3 brick >15%: Your curve might be too top-heavy
- Avg energy consistently lower than turn number: Missing key curve points

---

### Combo Finder

**What it shows:** The probability of having ALL selected cards by each turn.

**How to Use:**
1. Click cards to select them as "combo pieces"
2. Selected cards highlight in gold
3. Run simulation to see odds by turn

**Example: Nova + Killmonger Combo**
```
Combo: Nova + Killmonger

By Turn | Probability
─────────────────────
   3    | 18.2%
   4    | 31.5%
   5    | 47.8%
   6    | 62.1%
```

**Interpretation:**
- 2-card combos: ~30% by T4, ~50% by T5, ~62% by T6
- 3-card combos: Much lower (~15% by T6)
- 4+ card combos: Very unreliable (<5%)

**Pro Tip:** If a combo is below 40% by turn 6, consider adding redundancy (cards that do similar things) or accepting it won't always come together.

---

### Interactive Play-Through

**What it shows:** A step-by-step simulation of drawing through your deck.

**Controls:**
- **New Game:** Shuffle and deal a new opening hand
- **Draw Next:** Advance one turn and draw a card
- **Undo:** Go back one step
- **Auto-Play:** Automatically draw to turn 6

**Features:**
- Cards drawn this turn are highlighted with gold borders
- Shows remaining deck size
- Tracks all cards in hand with cost/power

**Use this to:**
- Practice reading your draws
- Understand how your deck unfolds over a game
- Test specific scenarios with seeded RNG

---

### All Results

**What it shows:** Combined view of all simulation data in one place.

Displays:
- Opening hand probabilities
- Draw-by-turn table
- Curve analysis
- Combo results (if cards selected)

Use this for a comprehensive deck analysis in one run.

---

## Advanced Rules

The Advanced Rules panel lets you simulate non-standard scenarios. When any advanced rule is modified, exact math is disabled (only Monte Carlo runs).

### Available Options

| Option | Default | Description |
|--------|---------|-------------|
| **Starting Hand Size** | 3 | Number of cards in opening hand |
| **Extra Draws/Turn** | 0 | Additional cards drawn each turn |
| **Thinning/Turn** | 0 | Cards removed from deck each turn |
| **Junk Inserts/Turn** | 0 | Unplayable cards added to deck each turn |
| **Hand Size Limit** | 0 (unlimited) | Max hand size (excess discarded randomly) |

### Use Cases

**Thinning Simulation:**
- Set Thinning/Turn to 1 to simulate cards like Deadpool or Wolverine leaving your deck
- Useful for Destroy decks that thin naturally

**Extra Draws:**
- Set to 1 to simulate having Mantis or similar draw effects
- Test how much more consistent your deck becomes with draw power

**Junk Inserts:**
- Simulate opponents filling your deck with Rocks or other junk
- Test deck resilience against disruption

---

## Technical Details

### Simulation Engines

**1. Exact Math Engine**
- Uses hypergeometric distribution
- Instant, precise results
- Only works with baseline rules (12 cards, 3-card hand, 1 draw/turn)

**2. Monte Carlo Engine**
- Shuffles and simulates thousands of games
- Handles all advanced rules
- Uses Web Worker for 5K+ runs (no UI freeze)
- Supports up to 200K runs

### Seeded RNG

Enable "Use seed for reproducibility" to get identical results every run. This uses the Mulberry32 algorithm:

- Same seed + same deck = same results
- Useful for comparing deck variants fairly
- Share seeds with friends to compare notes

### Performance

| Run Count | Engine | Approximate Time |
|-----------|--------|------------------|
| <5,000 | Main Thread | <1 second |
| 5,000-50,000 | Web Worker | 1-5 seconds |
| 50,000-200,000 | Web Worker | 5-20 seconds |

The progress bar shows completion %. You can cancel anytime.

---

## Tips & Strategies

### Building Consistent Decks

1. **Run Curve Analysis first** - If you brick turn 1-2 more than 30%, add early plays
2. **Check key cards in Draw by Turn** - Your win condition should be 70%+ by turn 5
3. **Test combos realistically** - 3+ card combos rarely come together; build in redundancy

### Interpreting Results

- **Small differences don't matter** - 25% vs 26% is noise; focus on 10%+ gaps
- **Context matters** - A 60% brick rate on turn 1 is fine if you don't need to play turn 1
- **Sample size** - 10K runs is usually enough; 50K+ for precise combo odds

### Comparing Decks

1. Save multiple deck variants
2. Run same simulation settings on each
3. Compare curve analysis and key card draw rates
4. The deck with better turn 4-5 consistency often performs better

### When to Use Each Mode

| Scenario | Best Mode |
|----------|-----------|
| "Is my curve good?" | Curve Analysis |
| "Will I draw Sera by turn 5?" | Draw by Turn |
| "How often do I start with Sunspot?" | Opening Hand |
| "Can I reliably combo these 2 cards?" | Combo Finder |
| "What does a typical game look like?" | Interactive Play-Through |

---

## FAQ

**Q: Why are exact and Monte Carlo results slightly different?**
A: Monte Carlo uses random sampling, so there's small variance. With 50K+ runs, they should be within 0.5% of exact values.

**Q: Can I simulate specific matchups?**
A: Not currently. The simulator focuses on your deck's internal consistency, not opponent interaction.

**Q: Why can't I run exact math with advanced rules?**
A: Hypergeometric formulas assume standard draw rules. Thinning, extra draws, etc. require simulation.

**Q: What's a good brick rate?**
A: Aim for <10% on turns 2-6. Turn 1 can be higher (20-30%) if your deck doesn't need early plays.

---

*Part of [Snapapoulous Prime](../README.md) - Your AI-Powered Marvel Snap Companion*
