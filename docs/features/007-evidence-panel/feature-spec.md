# Feature 007 — Evidence Panel

## Status
`complete`

## Objective
Create drill-down surface linking briefing to underlying artifacts.

---

## Scope

### In Scope
- EvidencePanel component
- Artifact list display
- Artifact path links
- Briefing-to-artifact traceability

### Out of Scope
- Artifact content rendering
- Artifact search
- Artifact editing

---

## Deliverables

| Deliverable | Path | Description |
|-------------|------|-------------|
| EvidencePanel | `src/components/EvidencePanel.tsx` | Evidence display |
| ArtifactLink | `src/components/ArtifactLink.tsx` | Single artifact link |

---

## Acceptance Criteria

- [ ] Shows list of artifact sources
- [ ] Shows artifact paths
- [ ] Clickable to open artifact (file system link)
- [ ] Groups by source type (product vs orchestration)

---

## Dependencies

- Feature 005 (Briefing Data Model)
- Feature 006 (Executive Brief Surface)