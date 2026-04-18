# Feature 012 — Reply Required Queue

## Status
`pending`

## Objective
Display pending decision requests that require human reply.

---

## Scope

### In Scope
- Pending decisions queue
- Urgency indicator (based on age)
- Quick reply actions (A/B/C/D buttons)
- Reply format guidance

### Out of Scope
- Actual reply submission (use email)
- Webhook polling

---

## Deliverables

| Deliverable | Path |
|-------------|------|
| ReplyQueue component | `src/components/ReplyQueue.tsx` |
| ReplyActionButton | `src/components/ReplyActionButton.tsx` |

---

## Acceptance Criteria

- [ ] Shows pending requests requiring reply
- [ ] Shows request age (time since sent)
- [ ] Highlights urgency (old requests)
- [ ] Shows reply format guidance

---

## Dependencies

- Feature 011 (Decision Email Trace)