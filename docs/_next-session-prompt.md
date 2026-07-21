READ FIRST:
- ~/.claude/docs/solutions/Marvel-Snap-Tactics-20260721-ia-handoff.md  (this session's handoff)
  — or Serena memory `session-handoff-20260721-1530.md`
- docs/plans/ia-refactor-2026-07-21.md — DECISION-COMPLETE spec for S4–S6, owner rulings LOCKED
  (do not re-litigate). Also docs/project_notes/bugs.md (BUG-018 hook-order), docs/design-canon.md.

STATE (2026-07-21): S1/S2/S3 SHIPPED + pushed to origin/main (HEAD dae6f6d). sw.js CACHE_NAME = v27 —
next index.html-deploying commit MUST bump to v28. Nav is now Home·Cards·Decks·Advisor·More.

INVOCATION:
/crew Execute the IA-refactor slices S4–S6 from docs/plans/ia-refactor-2026-07-21.md

LANE ROUTING:
Route bulk work to the loaded local model per FLEET-STATE (session-start injection). If local is
empty, use coder :8084. Crew: sonnet implements, live Playwright crawls verify (webapp-testing skill —
chrome-devtools flaky; serve on port 8130 to match the qa-fixtures :8130 guard; navigate via the
in-app setActiveTab CustomEvent, seed via addInitScript to survive the SW self-reload). Orchestrator
commits after three-track (haiku/sonnet adversary + independent gate re-run + diff-read).

NEXT TASK — S4 (do first, HEAVY — 3 components, BUG-018 trap):
Move the Career Dossier (Lifetime Stats + Snap Rate/Intimidation Index/Retreat Rate + methodology)
AND the Time Stone "Since Last Sync" card from Analytics (CardPerformanceView ~10240+) → Profile
(UserProfile ~12286); move missions → Dashboard; strip the mastery-summary + "Open Mastery Forge"
link from Analytics (Mastery/Cosmetics tabs already cover those). Analytics = card performance +
matchup ONLY afterward. **Every hook before every early return in EACH touched component** — grep
`use[A-Z]` vs early `return`. Gate: each stat in exactly one home; no duplicate renders; empty
states intact; live crawl 360/768. Then S5 (quick-fixes bundle + stray "Card Database" prose ~7155)
and S6 (Oracle → Advisor Ask/Meta toggle, drop the oracle route). SW bump per slice (→ v28…).
