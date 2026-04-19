# Feature 015 — Project Link Bootstrap

## 1. Feature Summary

### Feature ID
`015-project-link-bootstrap`

### Title
Project Link Bootstrap

### Goal
Enable briefing-viewer to display projects using async-dev's project-link mechanism, allowing managed external projects to be viewed correctly.

### Why this matters
async-dev Feature 055 introduced project-link for Mode B (managed_external) governance:
- Product artifacts live in product repo
- Orchestration artifacts live in async-dev repo
- Briefing-viewer needs to read from both sources correctly

This feature ensures briefing-viewer respects the artifact routing boundaries.

---

## 2. Scope

### In scope
- Read project-link.yaml for managed projects
- Route artifact loading based on ownership mode
- Display product repo artifacts correctly
- Display async-dev orchestration artifacts correctly
- Handle missing product repo gracefully

### Out of scope
- Create or modify project-link.yaml (async-dev responsibility)
- Multi-project portfolio management
- Remote repo fetching (assume local paths)

---

## 3. Success Criteria

This feature is successful when:
1. managed_external projects load artifacts from correct repos
2. product repo artifacts display correctly (product brief, feature specs)
3. async-dev artifacts display correctly (runstate, execution results)
4. missing product repo shows graceful error message
5. ownership boundary is clear in UI

---

## 4. Implementation

### 4.1 Project Link Loader
- Load project-link.yaml from async-dev projects directory
- Parse ownership_mode, product_repo path, orchestrator_repo path
- Return routing configuration

### 4.2 Artifact Router Integration
- Use async-dev Feature 055's artifact_router for routing
- Route artifacts to correct repo based on artifact_type
- Product artifacts: product brief, feature specs, dogfood reports
- Orchestration artifacts: runstate, execution packs, decision requests

### 4.3 UI Changes
- Show ownership mode indicator in project header
- Display product repo link if available
- Handle errors when product repo missing

---

## 5. Artifact Routing Rules

| Artifact Type | Mode A (self_hosted) | Mode B (managed_external) |
|---------------|----------------------|---------------------------|
| Product Brief | async-dev | product repo |
| Feature Spec | async-dev | product repo |
| RunState | async-dev | async-dev |
| Execution Pack | async-dev | async-dev |
| Decision Request | async-dev | async-dev |
| Dogfood Report | async-dev | product repo |

---

## 6. Deliverables

- project-link loader integration in lib/loader.ts
- Ownership mode indicator in UI
- Error handling for missing product repo
- Documentation of routing behavior

---

## 7. Acceptance Criteria

- [ ] managed_external projects load from product repo
- [ ] self_hosted projects load from async-dev only
- [ ] ownership mode shown in UI
- [ ] missing product repo shows error message
- [ ] routing respects Feature 055 artifact_router

---

## 8. Dependencies

- async-dev Feature 055 (project-link-loader, artifact-router)
- project-link.yaml exists for target project

---

## Status
**Phase**: 4 - Productization
**Priority**: P2
**Depends On**: async-dev Feature 055