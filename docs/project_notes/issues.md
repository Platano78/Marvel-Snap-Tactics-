# Work Log / Issues Tracker

Track completed work with ticket/PR references for audit trail and context.

## Format

```markdown
### YYYY-MM-DD - TICKET-ID: Brief Description
- **Status**: Completed | In Progress | Blocked
- **Description**: 1-2 line summary of work done
- **URL**: Link to ticket/PR
- **Notes**: Any important context or follow-up items
```

---

## Entries

### 2026-07-19 - Deck Simulator Rebuild Arc Closed
- **Status**: Completed
- **Description**: Recovered and rebuilt the Deck Simulator (originally added `f84ce2a`, deleted `a8a2875`) as a Cosmic Purple-canon secondary tab: S1 shipped the engine/worker/routing/Curve mode, S2 shipped the remaining five modes (Opening Hand, Draw by Turn, Combo Finder, Interactive Play-Through, All Results), S3 closed the arc with percentage-display rounding consistency (BUG-012), full run/seed/Advanced-Rules settings persistence, a canon compliance pass, and doc/AGENTS.md updates.
- **URL**: commits `096b2ff` (plan) → `82819dd` (S1) → `2777395` (S2) → this slice (S3)
- **Notes**: Also logged as BUG-011 and BUG-012 in bugs.md. `docs/SIMULATOR.md` STATUS header updated to point at ADR-006 and the live tab.

### 2026-07-19 - EOS Audit + Cosmic Purple Sweep + Feature Restores
- **Status**: Completed
- **Description**: Full EOS audit (24-row master table, 6 sonnet finders + 6 haiku adversarial verifiers + orchestrator re-probes, all rows CONFIRMED or RESTRUCTURED), followed by a 7-sweep Cosmic Purple design-language commit across every tab, 5 feature restores (Analytics, Missions, Mastery, Battle Pass, Hall of Armor), and a 14-item audit-fix slice (data, AI providers, stat-math consolidation, dead-code removal). MKG Bridge ruled out of product scope (personal dev infra, never a feature). `data/learning/learning-state.json` deleted (MKG router telemetry, doesn't belong in the repo).
- **URL**: commits `d77c7d9`..`1dca663` (audit table `d77c7d9`; offline-first fix `553e2e4`; MKG-out-of-scope ruling `5a0575b`; dashboard slice `172da7f`; learning-state deletion `30633c1`; Sweep 1-7 `7e25b0d`..`3992df5`; audit-fix slice `1dca663`)
- **Notes**: Also logged as ADR-005 (Cosmic Purple supersedes ADR-004) and ADR-006 (feature-restore ruling) in decisions.md, and BUG-004 through BUG-010 in bugs.md. Economy HQ stays dead (March 1 ruling honored). Deck Simulator rebuild approved as its own arc, not part of this pass.

### 2025-01-22 - PR #26: Fix AI Stats Access and Collection Tracking
- **Status**: Completed
- **Description**: Fixed AI stats access errors and collection tracking issues that were breaking the AI advisor
- **URL**: https://github.com/Platano78/Marvel-Snap-Tactics/pull/26
- **Notes**: Merged to main. Also logged as BUG-001 in bugs.md

### 2025-01-XX - PR #25: Deck Simulator Design
- **Status**: Completed
- **Description**: Added comprehensive Deck Simulator feature for testing deck strategies
- **URL**: https://github.com/Platano78/Marvel-Snap-Tactics/pull/25
- **Notes**: Documentation in docs/SIMULATOR.md

### 2025-01-XX - PR #25 (continued): Calculator as 7th Tab
- **Status**: Completed
- **Description**: Added Calculator as 7th tab in navigation, updated documentation
- **URL**: https://github.com/Platano78/Marvel-Snap-Tactics/pull/25
- **Notes**: Part of Deck Simulator feature set

---

## Weekly Summary Template

For sprint retrospectives or status updates:

```markdown
## Week of YYYY-MM-DD

### Completed
- PR #XX: Description
- PR #YY: Description

### In Progress
- Feature: Description (X% complete)

### Blocked
- Feature: Blocked by [reason]

### Key Decisions Made
- See ADR-XXX: [Decision summary]

### Bugs Resolved
- BUG-XXX: [Brief description]
```

---

## Tips

- **Log as you complete** - Don't wait until end of week
- **Link to PRs/issues** - Makes it easy to find full context
- **Note blockers** - Helps identify patterns in what slows work down
- **Cross-reference** - Link to related bugs.md or decisions.md entries
- **Archive old entries** - Move entries older than 3 months to an archive file
- **Use for standup prep** - Quick scan shows what you did yesterday
