# Architectural Decision Records (ADRs)

Track architectural and technology decisions with context and rationale.

## Format

```markdown
### ADR-XXX: Decision Title (YYYY-MM-DD)

**Status**: Proposed | Accepted | Deprecated | Superseded by ADR-YYY

**Context:**
- Why the decision was needed
- What problem it solves

**Decision:**
- What was chosen and key implementation details

**Alternatives Considered:**
- Option 1 -> Why rejected
- Option 2 -> Why rejected

**Consequences:**
- Benefits of this choice
- Trade-offs and risks
```

---

## Entries

### ADR-001: Single HTML File PWA Architecture (2025-01-XX)

**Status**: Accepted

**Context:**
- Need mobile-first Marvel Snap companion app
- Must work offline after first load
- No build step required - just open index.html or serve statically
- Target users want installable PWA from browser

**Decision:**
- Single `index.html` with embedded React (via CDN)
- Tailwind CSS via CDN
- Service worker for offline support
- localStorage for all persistence

**Alternatives Considered:**
- Create React App -> Requires build step, more complex deployment
- Next.js -> Server-side features unnecessary, adds complexity
- Vanilla JS -> Less maintainable for complex state management

**Consequences:**
- (+) Zero build step - deploy by copying files
- (+) Works offline after caching
- (+) Easy to host on GitHub Pages
- (-) Larger initial HTML file
- (-) No code splitting (acceptable for app size)

---

### ADR-002: Google OAuth as Primary AI Authentication (2025-01-XX)

**Status**: Accepted

**Context:**
- Need AI integration for Snapapoulous advisor
- Want minimal friction for users
- Most users have Google accounts

**Decision:**
- Google OAuth (Gemini) as primary/default AI path
- API keys (Claude, OpenAI, Groq) as advanced fallback
- Local models (Ollama) for privacy-conscious users

**Alternatives Considered:**
- API keys only -> Higher friction, many users won't set up
- Free tier only -> Limited functionality, rate limits

**Consequences:**
- (+) One-click sign-in for most users
- (+) Free tier is generous for casual use
- (-) Requires Google Cloud Console setup for OAuth
- (-) Some users may not want Google integration

---

### ADR-003: Embedded Static Card Data (2025-01-XX)

**Status**: Accepted

**Context:**
- Need card data for collection tracker
- Card releases are infrequent (monthly)
- Want offline-first experience

**Decision:**
- Embed static card data in JavaScript
- Optional RapidAPI integration for bleeding-edge updates
- Maintainer updates card data on new releases

**Alternatives Considered:**
- RapidAPI required -> Creates friction, breaks offline mode
- Scraping -> Unreliable, terms of service issues

**Consequences:**
- (+) Works offline
- (+) No API key required for basic usage
- (+) Fast load times
- (-) Requires manual updates when new cards release
- (-) Slightly stale data between updates

---

### ADR-004: Marvel Comic Book Design Language (2025-01-XX)

**Status**: Superseded by ADR-005

**Context:**
- App is Marvel Snap companion
- Want distinctive, fun visual identity
- Must feel authentic to Marvel brand

**Decision:**
- Marvel palette: Red (#ED1D24), Blue (#006EC7), Gold (#FFC107), Black (#1A1A1A)
- Comic panel borders, halftone patterns (subtle)
- Bold typography with drop shadows
- Series-specific card border colors

**Alternatives Considered:**
- Cyberpunk aesthetic -> Doesn't fit Marvel brand
- Minimalist/corporate -> Too boring for game companion
- Dark mode only -> Limits accessibility

**Consequences:**
- (+) Distinctive, memorable visual identity
- (+) Feels authentic to Marvel/comic book universe
- (+) Series colors aid quick card identification
- (-) More CSS complexity than plain styling
- (-) May not suit all user preferences

---

### ADR-005: Cosmic Purple Design Language Supersedes Comic Book Direction (2026-07-19)

**Status**: Accepted

**Context:**
- Two parallel Stitch design explorations existed: a Silver Age comic-book direction (ADR-004) and a
  `marvel_snap_mobile` mobile-first "Cosmic Purple" project
- Owner ruled the `marvel_snap_mobile` Stitch project the sole design authority — "what I imagined
  more than anything"
- App had drifted into a mix of both directions with no canon to build against

**Decision:**
- Commit fully to Cosmic Purple; comic-book DNA (Bangers/Caveat fonts, halftone patterns, comic
  tilts, hard offset shadows, panel borders) purged across all 10 tabs in a 7-sweep pass
- Canonical spec recorded at `docs/design-canon.md`: theme colorMode DARK, `--cosmic-purple #ad2bee`,
  Spline Sans typography, `ROUND_FULL` interactive controls
- Authority chain: Stitch project `marvel_snap_mobile` → tracked exports in
  `docs/stitch_designs/marvel_snap_mobile/*.html` → `docs/design-canon.md`

**Alternatives Considered:**
- Silver Age comic-book direction (ADR-004) -> rejected as primary; retained as archive/DNA mine
  (borrowed elements like Victory/defeat splash micro-moments still draw from it)
- Spider-Verse glitch exploration -> rejected as primary; retained as archive/DNA mine

**Consequences:**
- (+) Single coherent visual world instead of two competing directions
- (+) `docs/design-canon.md` gives every future UI change a concrete reference instead of ad-hoc taste calls
- (+) Mobile-first Stitch mockups map directly onto the shipped single-file architecture (ADR-001 unaffected)
- (-) Full purge was a 7-commit sweep across the whole app — large surface area to review in one pass
- (-) Marvel-red skip-link focus color is the only ADR-004 remnant; intentional low-visibility exception

---

### ADR-006: Feature-Restore Ruling — Analytics, Missions, Mastery, Battle Pass, Hall of Armor (2026-07-19)

**Status**: Accepted

**Context:**
- The EOS audit (`docs/plans/eos-audit-2026-07-19.md`) flagged several components as dead code because
  they had zero render sites: `CardPerformanceView` (Analytics), and write-only ghost keys
  `snap_missions`, `snap_mastery`, `snap_battlepass` that were parsed and stored every folder sync but
  never displayed
- Owner reviewed the audit's delete recommendations and made a product call to restore rather than remove

**Decision:**
- RESTORE Analytics tab, wiring the existing `CardPerformanceView` back into the app (supersedes audit
  row 10's delete ruling)
- RESTORE Missions, Mastery, and Battle Pass as visible UI surfaces over the already-parsed live data
  (supersedes audit row 9's "ghost keys" finding)
- BUILD Hall of Armor as a fresh UI surface over parsed cosmetic/variant data
- Economy HQ STAYS DEAD — the March 1 trim ruling is honored; this audit does not reopen it
- Deck Simulator is approved for a full rebuild, scoped as its own arc after the sweep/audit-fix work
  lands (not part of this docs pass)

**Alternatives Considered:**
- Delete `CardPerformanceView` and stop parsing missions/mastery/battlepass data (the audit's literal
  recommendation) -> rejected; the data pipeline already exists and the owner wants the surfaces built
  rather than the plumbing torn out
- Restore Economy HQ alongside the others -> rejected; no new information since the March 1 trim, ruling
  stands

**Consequences:**
- (+) No throwaway work — parsers written during the Deep Data Audit (Feb 28) now have UI consumers
- (+) Clear, recorded boundary: Economy HQ is intentionally dead, not merely neglected
- (-) Analytics/Missions/Mastery/Battle Pass/Hall of Armor each add surface area that must track the
  Cosmic Purple canon (ADR-005) going forward
- (-) Deck Simulator rebuild is explicitly deferred, so its git-history spec must survive until that arc starts

---

## Tips

- **Keep decisions lightweight** - 10-20 lines is usually enough
- **Focus on the "why"** - The context and alternatives matter more than the choice itself
- **Update status** when decisions change - Don't delete, mark as superseded
- **Reference decisions** in code comments: `// See ADR-002 for AI auth choice`
- **Review quarterly** - Some decisions may need revisiting as project evolves
