# Feature 010 — Risk/Blocker Briefing

## Status
`pending`

## Objective
Enhance risk and blocker display with severity, status, and resolution path.

---

## Scope

### In Scope
- Severity indicators
- Resolution suggestions
- Blocker vs risk distinction
- Historical blockers view

### Out of Scope
- Risk prediction
- Auto-resolution

---

## Deliverables

| Deliverable | Path | Description |
|-------------|------|-------------|
| BlockerAlert improvements | `src/components/BlockerAlert.tsx` | Enhanced display |
| RiskLevelBadge | `src/components/RiskLevelBadge.tsx` | Severity indicator |

---

## Acceptance Criteria

- [ ] Shows severity level visually
- [ ] Shows resolution suggestion
- [ ] Distinguishes blockers from risks
- [ ] Shows blocker age/duration

---

## Dependencies

- Feature 006 (Executive Brief Surface)