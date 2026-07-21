# IA / Navigation Refactor — 2026-07-21

**Created**: 2026-07-21 (crew session). Provenance: owner UX observations → orchestrator structural
recon → ui-ux-pro-max heuristics + ui-ux-accessibility-specialist live-audit → **source-verified
triage** (2 of the specialist's 3 HIGH findings were rejected as false — see "Rejected" below) →
owner rulings (two AskUserQuestion rounds, all recorded here — do not re-litigate).
**Standing law**: single `index.html` / CDN-only / no build; design canon binds; every slice =
sonnet implement → adversarial verify → orchestrator gates/diff → commit by orchestrator only;
**SW CACHE_NAME bump on every index.html-deploying commit** (currently `snapapoulous-stitch-v24` →
next **v28** — currently v27 after S1(v25)/S2(v26)/S3(v27); increment per slice).

## Owner rulings (LOCKED)
1. **Home**: default tab → `dashboard` (was `ai`); Dashboard added to bottom nav as "Home". No new
   welcome screen. Target nav (5): **Home(dashboard) · Cards(collection) · Decks · Advisor(ai) · More(settings)**.
2. **Cards**: merge Database (`CardDatabase`) into the Cards tab (`Collection`) — fold in ability-text
   search; drop the `database` route + nav slot. Also REMOVE the hardcoded "Series 3 Progress" bar
   (index.html:6938-6954 + `series3Stats` ~6900) — redundant with the Series Completion Cost card.
3. **Decks**: `DeckComparison` becomes a mode INSIDE the Decks tab; drop the `compare` route + nav slot.
4. **Stats homes** (give each a clear role; move, don't delete):
   - **Dashboard** = at-a-glance snapshot + quick-match. Missions (daily/weekly) MOVE here.
   - **Profile** = full career identity. The **Career Dossier** (Lifetime Stats + Snap Rate/
     Intimidation Index/Retreat Rate + methodology) and the **Time Stone "Since Last Sync"** card
     MOVE here from Analytics.
   - **Analytics** = card performance + matchup table ONLY. REMOVE from it: the Dossier/Lifetime
     Stats, Time Stone, missions, and the mastery summary + "Open Mastery Forge" link (the Mastery
     tab already covers mastery; the Cosmetics tab covers cosmetics).
5. **Quick fixes** (all four, owner-selected):
   - Dead "Back" button in Match History (index.html:~5568) — a `<div aria-label="Back">` with no
     handler/role. Remove the affordance (Match History is top-level, no back target).
   - "Creators" More-Features tile (index.html:~11507) dispatches `setActiveTab('decks')` and lands
     at the Decks top — make it reach the Creator Decks content (anchor/scroll or a real view mode).
   - Mobile empty-state CTA: Analytics/Cosmetics/Mastery empty states say "Link Game Folder" (a
     desktop-only File System Access path). Point mobile users to Export Full Vault (desktop) →
     Import (mobile) instead — that path DOES carry the data (`VAULT_SYNCED_KEYS`, 4333).
   - Header consistency: unify the three header treatments (shared `Header` ~4831 vs Dashboard hero
     vs Match History's bespoke top bar) so peer tabs feel like one app.
6. **Oracle**: fold in — Advisor tab gains an **Ask / Meta** mode toggle; "Meta" hosts Oracle's
   Spotlight-schedule + tier-list content; drop the standalone `oracle` route. (Orchestrator ruling
   on the fold target; adjustable at spec time.)

## Rejected findings (source-verified FALSE — do NOT act on)
- "Analytics/Cosmetics/Mastery are permanent dead-ends on mobile (gated behind showDirectoryPicker)":
  FALSE. They gate on DATA PRESENCE, not the API; Export Full Vault → Import carries the data to
  mobile (`VAULT_SYNCED_KEYS` includes snap_mastery/snap_collection_enhanced/snap_profile_stats/
  snap_rank/snap_missions). Real residual = the mislabeled CTA only (ruling 5c).
- "Advisor shows no config signal until Send": FALSE. A prominent "AI not configured yet! →
  Configure AI Provider" card renders above the chat when `!isConfigured()` (index.html:6370-6378).

## Slices (sequential — one implementing agent per repo)
- **S1 — Nav shell + Home** — SHIPPED `3cdcd82`: primaryTabs → 5 (ruling 1); default `dashboard`; indicator math for 5
  tabs (index.html ~4788/4801/4803). Verify demoted tabs (History/Database/Compare/etc.) stay
  reachable via the More-Features grid. Routes for database/compare STAY alive this slice (removed in
  S2/S3). Gate: nav renders 5, opens on Dashboard, indicator tracks, More reaches everything.
- **S2 — Cards merge + Series 3 bar removal** — SHIPPED `1fed28c` (pure removal — Collection already searched ability text; also added Database tile to More in S1 to avoid stranding). (ruling 2): fold ability search into Collection; remove
  `database` route from switch + whitelist + CardDatabase/DatabaseCardTile (if unused elsewhere) +
  the "Database" More/nav ref; delete the Series 3 bar. Gate: ability search works in Cards; no
  `database` refs remain; Series 3 bar gone; owned/all/pool/energy filters intact.
- **S3 — Compare into Decks** — SHIPPED `2180e26` (added `cardDataVersion` to Decks; Compare = new `view` mode gated >=2 decks). (ruling 3): Compare mode inside Decks (pass cardDataVersion to Decks if
  needed); remove `compare` route + DeckComparison standalone wiring + nav ref. Gate: Compare mode
  renders inside Decks; no `compare` route refs remain.
- **S4 — Stats homes** (ruling 4): move Dossier + Time Stone cards Analytics→Profile; move missions
  Analytics→Dashboard; strip mastery/cosmetics summary from Analytics. Preserve hook order (BUG-018)
  in every touched component. Gate: each stat appears in exactly one home; Analytics = perf+matchup
  only; no duplicate renders; empty states intact.
- **S5 — Quick fixes bundle** (ruling 5): the 4 fixes PLUS this stray-prose loose-end from S2: Collection's no-cards empty state (~index.html:7155) still says "browse the Card Database" — relabel to "browse Cards" (Cards IS the browser now). Gate: back affordance gone/replaced; Creators
  reaches creator content; mobile CTA relabeled + wired to vault import; headers unified.
- **S6 — Oracle fold-in** (ruling 6): Advisor Ask/Meta modes; drop `oracle` route. Gate: Advisor Meta
  mode shows spotlight/tier; no `oracle` route refs; Advisor chat unaffected.

**Sequencing note**: S1 first (nav shell, safe). S2/S3 remove routes S1 demoted. S4 is the
design-heaviest (touches CardPerformanceView + UserProfile + Dashboard) — spec carefully, preserve
hook order. S5/S6 independent, any order after. Consider a fresh session for S4+ if orchestrator
context is heavy (crew rotation guidance).
