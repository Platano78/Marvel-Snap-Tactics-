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

**Status**: Accepted

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

## Tips

- **Keep decisions lightweight** - 10-20 lines is usually enough
- **Focus on the "why"** - The context and alternatives matter more than the choice itself
- **Update status** when decisions change - Don't delete, mark as superseded
- **Reference decisions** in code comments: `// See ADR-002 for AI auth choice`
- **Review quarterly** - Some decisions may need revisiting as project evolves
