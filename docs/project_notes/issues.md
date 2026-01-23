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
