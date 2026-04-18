# Feature 004 — Single-Project Loader

## Status
`complete`

## Objective
Implement artifact loading from product repo and async-dev repo.

---

## Scope

### In Scope
- Artifact loader interface
- Product repo artifact parsing
- async-dev repo artifact parsing
- RunState parsing
- Feature spec parsing
- Execution result parsing
- Graceful degradation for missing artifacts

### Out of Scope
- Multi-project support
- Remote artifact fetching
- Real-time sync
- Artifact caching

---

## Deliverables

| Deliverable | Path | Description |
|-------------|------|-------------|
| Artifact types | `src/types/artifacts.ts` | TypeScript types |
| Loader interface | `src/lib/loader.ts` | Loader abstraction |
| Product loader | `src/lib/product-loader.ts` | Product repo parsing |
| Orchestration loader | `src/lib/orchestration-loader.ts` | async-dev repo parsing |

---

## Acceptance Criteria

- [ ] Loader reads RunState from async-dev repo
- [ ] Loader reads Product Brief from product repo
- [ ] Loader reads Feature Specs
- [ ] Loader reads Execution Results
- [ ] Missing artifacts handled gracefully
- [ ] Loader returns typed artifacts

---

## Dependencies

- Feature 003 (Project Skeleton)
- Feature 002 (Artifact Input Contract)