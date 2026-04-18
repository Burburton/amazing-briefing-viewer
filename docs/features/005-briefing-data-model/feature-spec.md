# Feature 005 — Briefing Data Model

## Status
`pending`

## Objective
Define TypeScript data model for briefing surfaces.

---

## Scope

### In Scope
- BriefingSummary type
- StateSnapshot type
- Risk type
- Blocker type
- Recommendation type
- EvidenceReference type
- Mapping functions from artifacts to briefing types

### Out of Scope
- Database persistence
- API serialization
- Validation schemas

---

## Deliverables

| Deliverable | Path | Description |
|-------------|------|-------------|
| Briefing types | `src/types/briefing.ts` | Core types |
| Mapping functions | `src/lib/mappers.ts` | Artifact → Briefing |

---

## Acceptance Criteria

- [ ] BriefingSummary type defined
- [ ] StateSnapshot type defined
- [ ] Risk/Blocker types defined
- [ ] Recommendation type defined
- [ ] EvidenceReference type defined
- [ ] Mapper functions compile without errors

---

## Dependencies

- Feature 004 (Single-Project Loader)