# Feature 013 — Status Report Viewer

## Status
`pending`

## Objective
Display status reports from email channel.

---

## Scope

### In Scope
- Status report list
- Report type badges (milestone, blocker  progress)
- Report summary view
- Link to evidence

### Out of Scope
- Report creation (handled by async-dev)
- Report quality iteration (Phase 2+)

---

## Deliverables

| Deliverable | Path |
|-------------|------|
| StatusReportViewer | `src/components/StatusReportViewer.tsx` |
| ReportSummaryCard | `src/components/ReportSummaryCard.tsx` |

---

## Acceptance Criteria

- [ ] Shows list of status reports
- [ ] Shows report type
- [ ] Shows summary
- [ ] Links to evidence

---

## Dependencies

- Feature 004 (Single-Project Loader)