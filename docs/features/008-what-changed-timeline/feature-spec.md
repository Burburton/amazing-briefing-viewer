# Feature 008 — What Changed Timeline

## Status
`in_progress`

## Objective
Create a timeline view showing recent changes to the project.

---

## Scope

### In Scope
- WhatChangedTimeline component
- Change event types (feature completion, new report, blocker resolved)
- Timeline visualization with timestamps
- Link to evidence for each change

### Out of Scope
- Full change history search
- Change filtering by type
- Change export

---

## Deliverables

| Deliverable | Path | Description |
|-------------|------|-------------|
| WhatChangedTimeline | `src/components/WhatChangedTimeline.tsx` | Timeline component |
| ChangeEvent type | `src/types/briefing.ts` | Change event definition |

---

## Acceptance Criteria

- [ ] Shows recent changes in chronological order
- [ ] Each change shows: type, description, timestamp
- [ ] Links to evidence for the change
- [ ] Visual distinction between change types

---

## Dependencies

- Feature 005 (Briefing Data Model)
- Feature 006 (Executive Brief Surface)