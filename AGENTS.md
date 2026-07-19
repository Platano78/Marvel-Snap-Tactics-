# Snapapoulous Prime — AGENTS.md (router / the map)

You are the generic agent. Reading this makes you the **Snapapoulous Prime** agent.
On entry: read this map → route to the area for the task → load ONLY that area's Inputs.

## What this is
Marvel Snap companion + AI tactical assistant PWA. One monolithic `index.html` (~10.5k lines):
React 18 + Babel-standalone + Tailwind, **all via CDN — no build step, no `package.json`**.
Offline-first (`sw.js`, `manifest.json`); data in JSON files. **Sacred: stays a single
`index.html`, CDN-only, mobile-first. Never add a bundler / `node_modules`.** `index.html` is
sectioned by `// ==================== NAME ====================` banners — grep the banner to jump.

## Areas (route by task — load Inputs, skip the rest)

| If the task is about… | Read (Inputs) | Skip |
|---|---|---|
| **AI advisor / personas / prompts** | `index.html` (`SNAPAPOULOUS PERSONA` ~L1994, `AI PROVIDER MANAGER` ~L2217, `CONTEXT ANALYSIS HELPERS` ~L2073); `persona.json` | UI component sections, data JSONs |
| **Match logging / log parsing / stats** | `index.html` (`LOG PARSER` ~L2673, `GAME DATA PARSER` ~L2799, `MATCH TURN ANALYSIS COMPONENT` ~L4642, `SHARED STAT UTILITIES` ~L1928) | persona / AI sections |
| **Card database / card data / card art** | `index.html` (`CARD DATA` ~L1658, `CARD ART URL HELPER` ~L1626, `CARD DATABASE COMPONENT` ~L6011, `CARD DETAIL COMPONENT` ~L5449); `card-data.json` | deck / meta sections |
| **Decks / deck building / comparison** | `index.html` (`DECKS COMPONENT` ~L6221, `DECK COMPARISON COMPONENT` ~L9622) | card-db / meta sections |
| **Meta tier list / oracle / spotlight** | `index.html` (`META TIER LIST` ~L6853, `ORACLE VIEW WRAPPER` ~L7194, `WEEKLY META SNAPSHOT` ~L7196); `data/meta-context.json`, `data/spotlight-schedule.json` | everything else |
| **Storage / collection inference / vault** | `index.html` (`INDEXEDDB HELPER` ~L3347, `COLLECTION INFERRER` ~L3568, `VAULT MANAGER` ~L3599) | UI / AI sections |
| **PWA / offline / install / service worker** | `sw.js`, `manifest.json`, `index.html` (`LOW-END DEVICE DETECTION` ~L1792) | feature component sections |
| **Styles / CSS / accessibility / responsive** | `index.html` `<style>` block (~L108–1358, incl. `ACCESSIBILITY & PERFORMANCE` ~L1240), Tailwind CDN classes | JS logic sections |
| **Analytics tab / card performance** | `index.html` (`CardPerformanceView` ~L8042, rendered ~L10736) | card-db / deck sections |

## Verbs
- `pickup`  → read `_pickup-handoff.md` §pickup, then route to the named area.
- `handoff` → read `_pickup-handoff.md` §handoff.

## Naming conventions (locate, don't grep blindly)
- `index.html` is sectioned by `// ==================== NAME ====================` banners — grep the banner name to jump; **never read the whole ~10.5k-line file.**
- Project memory lives in `docs/project_notes/`: `key_facts.md`, `decisions.md`, `bugs.md`, `issues.md`.
- Root `MULTI_PERSONA_APP_REVIEW.md` (55KB) = archival review, **skip by default**. `README.md` = user-facing install guide.
- `*.Zone.Identifier`, `*.zip` in `docs/`, `Screenshot*.png` = Windows / throwaway junk, ignore.

## Fallback law
Task not on this map → ask which area, or stay here. **Never read the whole `index.html` or
bulk-read root docs.** Honour the single-file / no-build / CDN-only invariant in every change.
Wrong project → `../AGENTS.md` (workspace root).
