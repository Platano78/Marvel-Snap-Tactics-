# Bugs Log

Track recurring bugs with solutions and prevention strategies.

## Format

```markdown
### YYYY-MM-DD - BUG-XXX: Brief Description
- **Issue**: What went wrong
- **Root Cause**: Why it happened
- **Solution**: How it was fixed
- **Prevention**: How to avoid it in the future
```

---

## Entries

### 2026-01-23 - BUG-002: Collection Import Shows 181/332 Cards as Owned
- **Issue**: Importing CollectionState.json showed only 181 cards owned when player actually has 332+
- **Root Cause**: Game stores `CardDefId` (e.g., "AntMan") but UI matched by `card.name` (e.g., "Ant Man") - 201 cards have mismatched names
- **Solution**: Added defId→name lookup in `parseCollection()` - converts CardDefId to display name using card database mapping
- **Prevention**: Always check if game data uses internal IDs vs display names; card-data.json includes both `name` and `defId` fields

### 2026-01-23 - BUG-003: Series Display Shows 6-10 Instead of 1-5
- **Issue**: Collection shows Series 6, 7, 8 which confuses players expecting Pool 1-5
- **Root Cause**: Untapped.gg card database uses internal series numbering (1-10) vs player-facing pools (1-5)
- **Solution**: Added `getSeriesDisplayName()` mapping and `poolStats` aggregation to show P1-P5 + Spotlight
- **Prevention**: When using third-party data sources, verify their taxonomy matches in-game terminology

### 2025-01-22 - BUG-001: AI Stats Access via getOwnedCards()
- **Issue**: AI advisor crashing when trying to access collection stats for context building
- **Root Cause**: `getOwnedCards()` returned array of names but AI context builder expected object with metadata
- **Solution**: Fixed in PR #26 - Updated stats access to use proper collection tracking methods
- **Prevention**: Add TypeScript interfaces for collection data structures; test AI context building with empty/partial collections

---

## Tips

- Focus on **recurring** bugs that waste time when re-encountered
- Include enough detail that someone (or an AI) can apply the fix without deep investigation
- The **Prevention** field is the most valuable - it turns bugs into lessons
- Keep entries concise (3-5 lines max)
- Archive bugs older than 6 months if no longer relevant
