# Snapapoulous Prime — pickup / handoff contracts

<!-- Continuity verbs. Memory-as-folder: survives session end, app switch, LLM switch.
     Points INTO existing memory (Serena, docs/project_notes/, git) — does not become a new store. -->

## pickup  (read-only continuity brief — change nothing unless told "proceed")
Report, tersely:
- What we're doing (the active goal)
- What changed recently (`docs/project_notes/decisions.md` + `bugs.md` + `issues.md`, `git log --oneline -10`, `git status`)
- Open decisions / waiting-on / blocked
- Best next move

Source recent state from, in order: Serena memory for this project → `docs/project_notes/`
(`decisions.md`, `bugs.md`, `issues.md`, `key_facts.md`) → git. Do NOT bulk-read root docs
(`MULTI_PERSONA_APP_REVIEW.md`) or the whole `index.html`. Do NOT explain obvious project purpose.

## handoff  (write the durable brief, then verify from disk)
1. Write/refresh the most-local memory (Serena memory + the relevant `docs/project_notes/` file —
   `decisions.md` for choices made, `bugs.md`/`issues.md` for open work, `key_facts.md` for durable facts).
2. Read it back FROM DISK and verify it covers: current state · recently completed ·
   in-progress · open decisions · unresolved trade-offs · blockers · best next move.
3. Do not rely on in-context memory — confirm the file is right.
