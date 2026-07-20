READ FIRST:
- docs/plans/adoption-wave-2026-07-20.md — THE work queue. Start at "### EXECUTION LOG" for what
  landed and WHY (owner rulings + the traps), then the remaining triage items below it.
- ~/.claude/docs/solutions/Marvel-Snap-Tactics-20260720-handoff.md — narrative history
  (marathons #2, #3, #4). Serena was down for #3/#4, so this file is the ONLY copy.
- docs/design-canon.md (design law) + AGENTS.md (router — grep section banners, NEVER read the
  whole ~14k-line index.html)
- Auto-memory: chrome-devtools-mcp-shared-browser.md (ONE shared browser across agents — port-guard
  every evaluate_script or serialize) + card-data-series-is-pool-index.md (series = POOL INDEX;
  game "Series 5" files as series:8; check status==='released' before adding cards)

INVOCATION:
/crew Phase 0 tail — P3 (all 4 bundles), then Q1 live re-crawl, then close Phase 0 and start the adoption wave

STATE AS OF 2026-07-20 evening (marathon #4):
Phase 0 P1 + P2 are COMPLETE — 5 commits, all three-track verified:
  3b6f990  P1  a11y criticals (nav tab pattern dropped; 22 contrast controls fixed app-wide)
  44f27da  P2a a11y trio (ribbon SR text, History aria-label, Forge live region)
  0927fdd  P2b AbortController timeout + user cancel across all 7 providers
  4b5b04a  P2c art-slug diacritics, real art fallbacks, race-free Forge deep-link
  c3dc41f  docs Phase 0 execution log
**sw.js CACHE_NAME is at v13. Next index.html-deploying commit MUST bump to v14.**
Working tree is clean — nothing uncommitted.

⚠️ **ALL 6 COMMITS ARE UNPUSHED, DELIBERATELY. Owner ruled 2026-07-20: hold the deploy until the
Q1 live re-crawl passes.** They are NOT forgotten and NOT broken — the crawl (task 2 below) exists
to verify this session's fixes in a real browser, and nothing here has been exercised in an actual
page load. Push only after the crawl is green.

The one genuinely unproven assumption, which the crawl must settle on a REAL device: P2b's whole
cancel-vs-timeout distinction depends on `fetch` rejecting with `signal.reason` so `.name` survives
to the catch site. That is spec-mandated and true in evergreen engines, but WebKit has historically
lagged on exactly that fidelity, and this is a mobile-first PWA. If it does NOT hold on the owner's
phone, a timeout degrades silently into a user-cancel (partial content kept, NO error banner shown)
rather than surfacing "Connection timed out". Test on device: press Stop mid-stream, and point the
`local` provider at a dead endpoint and wait 20s.

NEXT TASK (priority order):

1. P3 polish tail — **OWNER RULED 2026-07-20: implement ALL FOUR bundles, nothing skipped.**
   Do NOT re-ask; the triage question was already put to him and he took everything.
   (a) Real a11y wins: remove `user-scalable=no` from the viewport meta (WCAG 1.4.4, blocks pinch
       zoom); make Forge carousel tiles keyboard-traversable (ArsenalTile already has the correct
       pattern — copy it); fix likely focus loss on forge state transitions; hero card can't show
       its synergy gold ring (the isHero branch excludes it).
   (b) Defensive guards: Dashboard completionPercent lacks a totalCards>0 guard (~4733 pre-shift;
       Profile's ~11539 already has it — inconsistent pair); CardPerformanceView has an unguarded
       Object.entries(performanceData.cards) (~9949).
   (c) Honest-UI: "Import from URL" is a permanent no-op stub styled as functional (~7788) — label
       it "coming soon" or remove; duplicate videoUrl in creator-decks.json (Dormammu vs Scream both
       t_vrJXXJZGM) — find the correct Scream URL or drop it; mid-stream error says "unreachable"
       after content already arrived (~3088).
   (d) Cosmetic tail: season-sweep arc value is visual-only; 9px reasoning chips with title-only
       full text; toggle chips 36px vs the 44px touch-target standard; 16 form fields lack id/name
       (recurring lint); Collection search state persists across view-mode switches.
   NOTE: all line numbers above predate this session's ~500 inserted lines — LOCATE BY CONTENT.

2. Q1 live re-crawl, SERIALIZED (one browser agent at a time — the chrome-devtools MCP is a single
   shared browser with global page selection). Seed from docs/qa/qa-fixtures.js. Cover: click-
   throughs, Quick Match append propagation, console-after-nav, empty states, freshness show/hide,
   Arsenal re-render on snap-data-updated. ALSO re-verify this session's fixes live: nav
   aria-current, Forge deep-link from the Dashboard pill, Stop button mid-stream, a 404 card art
   falling back, and Araña's art actually loading.

3. Close Phase 0 (tick the remaining boxes in the plan), THEN adoption Slices 1-5 in plan order:
   MVP view → Cosmetics recon → Matchup grid → Completion-cost research → Recap recon. Gates and
   owner rulings are already baked into the plan; do not re-litigate them.

4. Background: first meta-refresh routine fires Aug 5 13:00 UTC
   (https://claude.ai/code/routines/trig_01RXr1YBBRFjfNm4ir27Az23) — glance at its first run.

CREW DISCIPLINE — three changes learned the hard way this session, carry them forward:

- **Do NOT use haiku for the adversarial track on semantic work.** It returned "clean, zero
  defects" on P2a and would have on P2b. A sonnet adversary that extracted the real functions into
  Node harnesses and EXECUTED them found two HIGH defects in code that had passed every gate.
  Haiku is fine for mechanical checks (P1's token swap). Use sonnet for anything needing execution
  or reasoning, and REJECT any "clean" verdict submitted without verbatim command output.

- **Verify the SPEC, not just the diff.** Of P2b's four defects, one was a spec error: the ruling
  "no hard total timeout" was faithfully implemented and still imposed exactly that on the buffered
  path, because a non-streaming LLM API generates the whole completion before sending headers — so
  "connect timeout" and "total timeout" are the same number there. Three tracks of diff verification
  cannot catch a wrong spec. Before locking a spec, ask what it assumes that the code doesn't.

- **Demand proof by execution where possible.** The strongest verification all session was
  re-running the implementer's harnesses myself against the final tree, rather than reading pasted
  output. Harnesses should extract the REAL source (indexOf/slice + a guard assertion that throws
  if extraction missed the fix) so they cannot pass against a stub.

Also: agents corrected the orchestrator's own numbers three times (dispatch-site count, the
/v1 branch gap, the callLocal deviation). Prompt them to report out-of-scope findings rather than
silently fixing or ignoring them — it worked.
