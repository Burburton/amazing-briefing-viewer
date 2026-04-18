# Feature 011 — Decision Email Trace Surface

## Status
`in_progress`

## Objective
Display email decision request history with request/response traceability.

---

## Scope

### In Scope
- Decision request list view
- Individual decision request detail view
- Request → reply → resolution chain display
- Email metadata (message ID  timestamps)
- Status badge for each request

### Out of Scope
- Sending new decision requests (use async-dev CLI)
- Reply parsing (handled by async-dev)
- Webhook configuration

---

## Deliverables

| Deliverable | Path |
|-------------|------|
| DecisionTrace component | `src/components/DecisionTrace.tsx` |
| DecisionRequestCard | `src/components/DecisionRequestCard.tsx` |
| DecisionReplyCard | `src/components/DecisionReplyCard.tsx` |

---

## Acceptance Criteria

- [ ] Shows list of decision requests
- [ ] Shows request details (question, options, recommendation)
- [ ] Shows reply if received
- [ ] Shows resolution status
- [ ] Links to evidence artifacts

---

## Dependencies

- Feature 004 (Single-Project Loader)
- Feature 005 (Briefing Data Model)