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
