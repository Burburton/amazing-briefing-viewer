# Artifact Input Contract

## Purpose

Define the artifact types that `amazing-briefing-viewer` will consume from product repo and `amazing-async-dev`.

---

## 1. Artifact Sources

| Source | Location | Ownership |
|--------|----------|-----------|
| Product Repo | `{product_root}/docs/`, `{product_root}/features/` | Product |
| async-dev Repo | `projects/{product_id}/` | Orchestration |

---

## 2. Product Repo Artifacts

### 2.1 Product Brief
- Path: `docs/product-brief.md`
- Purpose: Product scope and constraints
- Fields:
  - `product_id`
  - `product_name`
  - `description`
  - `constraints`

### 2.2 Feature Spec
- Path: `docs/features/{feature_id}/feature-spec.md`
- Purpose: Feature boundaries and acceptance criteria
- Fields:
  - `feature_id`
  - `feature_name`
  - `status`
  - `acceptance_criteria`
  - `dependencies`

### 2.3 Phase Summary
- Path: `docs/phases/{phase_id}-summary.md`
- Purpose: Phase completion summary
- Fields:
  - `phase_id`
  - `phase_name`
  - `status`
  - `completed_features`
  - `next_phase`

### 2.4 Dogfood Report
- Path: `docs/dogfood/{feature_id}-dogfood.md`
- Purpose: Usage testing results
- Fields:
  - `feature_id`
  - `tested_at`
  - `findings`
  - `recommendations`

### 2.5 Friction Log
- Path: `docs/friction/{session_id}-friction.md`
- Purpose: UX friction observations
- Fields:
  - `session_id`
  - `date`
  - `friction_points`
  - `severity`

---

## 3. async-dev Repo Artifacts

### 3.1 RunState
- Path: `projects/{product_id}/runstate.md`
- Purpose: Current execution state
- Fields:
  - `current_phase`
  - `feature_id`
  - `last_action`
  - `blocked_items`
  - `decisions_needed`
  - `next_recommended_action`

### 3.2 ExecutionResult
- Path: `projects/{product_id}/execution-results/{execution_id}.md`
- Purpose: Execution outcome
- Fields:
  - `execution_id`
  - `status`
  - `completed_items`
  - `artifacts_created`
  - `issues_found`

### 3.3 ExecutionPack
- Path: `projects/{product_id}/execution-packs/{execution_id}.md`
- Purpose: Planned task for execution
- Fields:
  - `execution_id`
  - `task_scope`
  - `deliverables`
  - `stop_conditions`

### 3.4 Decision Request
- Path: `projects/{product_id}/.runtime/decision-requests/{request_id}.md`
- Purpose: Pending human decision
- Fields:
  - `decision_request_id`
  - `question`
  - `options`
  - `recommendation`
  - `status`
  - `resolution`

### 3.5 Audit Trail
- Path: `projects/{product_id}/logs/execution-events.db`
- Purpose: Execution event log
- Access: SQLite query

---

## 4. Data Model Mapping

### Briefing Summary
Derived from:
- RunState.current_phase
- RunState.blocked_items
- RunState.decisions_needed
- Latest ExecutionResult

### Current State
Derived from:
- RunState.current_phase
- RunState.last_action
- RunState.updated_at

### Risks/Blockers
Derived from:
- RunState.blocked_items
- ExecutionResult.issues_found
- Friction Log severity

### Recommended Next Step
Derived from:
- RunState.next_recommended_action
- ExecutionPack.task_scope
- Decision Request pending

### Evidence References
Derived from:
- All artifact paths
- ExecutionResult.artifacts_created

---

## 5. Artifact Loading Strategy

### 5.1 Loader Interface
```typescript
interface ArtifactLoader {
  loadProductArtifact(type: string, id: string): Artifact;
  loadOrchestrationArtifact(type: string, id: string): Artifact;
  listArtifacts(source: 'product' | 'orchestration'): Artifact[];
}
```

### 5.2 Loading Order
1. Load RunState (determines current state)
2. Load Product Brief (context)
3. Load Feature Specs for current feature
4. Load ExecutionResults for recent history
5. Load Decision Requests for pending decisions

### 5.3 Graceful Degradation
If artifact missing:
- Show "Not available" instead of error
- Continue with available artifacts
- Log missing artifact for debugging

---

## 6. Non-goals for V1

- Real-time artifact sync (batch loading only)
- Multiple project support
- Remote artifact fetching (local files only)
- Complex artifact search
- Artifact editing (read-only)