# amazing-briefing-viewer — Product North Star, Governance, and Canonical Loop Roadmap
## Mother Document

- **Project ID:** `amazing-briefing-viewer`
- **Document Type:** Product North Star / Execution Constitution / Canonical Roadmap
- **Intended Consumer:** `amazing-async-dev` / `opencode`
- **Status Intent:** Canonical top-level governing document
- **Role:** This document serves as both:
  1. the product north-star for `amazing-briefing-viewer`
  2. the autonomous execution constitution for low-interruption canonical loop development

---

## 1. Product Identity

`amazing-briefing-viewer` is a product-layer application built on top of the `amazing-async-dev` ecosystem.

It is **not** the execution engine itself.
It is **not** another general orchestration framework.
It is **not** a generic dashboard clone.

It is a dedicated product for helping a human quickly understand:

- what happened in a project
- what state the project is currently in
- what risks or blockers matter now
- what the system recommends doing next
- whether human input is required
- what supporting evidence exists

The product exists to transform scattered project artifacts into a **high-signal, decision-friendly project briefing experience**.

### Core product statement
> `amazing-briefing-viewer` turns product artifacts and orchestration artifacts into concise, navigable, decision-oriented project briefings for fast remote human understanding.

---

## 2. Why This Product Exists

`amazing-async-dev` can produce a growing set of artifacts:
- product briefs
- north-star docs
- feature specs
- completion reports
- dogfood reports
- friction logs
- execution results
- audit trails
- continuation state
- email decision artifacts

But those artifacts are still distributed across files, directories, and repositories.
A human often has to manually reconstruct project status from too many sources.

This product exists to reduce that reconstruction burden.

---

## 3. Product Goals

### 3.1 Primary Goal
Make it easy for a human to understand a project's current state and next recommended action in minimal time.

### 3.2 Secondary Goals
- make project status easier to review remotely
- reduce the need to read raw logs and multiple artifacts
- improve quality of async human decision-making
- provide a clear bridge between product repo artifacts and async-dev orchestration artifacts
- become a real dogfood product for `amazing-async-dev`

---

## 4. Product Surfaces

### 4.1 Executive Brief
The top-level briefing surface showing:
- project identity
- current status
- current phase
- recent important changes
- top risks/blockers
- recommended next step
- whether human decision is needed

### 4.2 What Changed
Compact recent-changes surface.

### 4.3 Current State
Clear explanation of active/paused/blocked/completed.

### 4.4 Recommended Next Step
What should happen next, why, whether autonomous continuation is possible.

### 4.5 Risks / Blockers
Active risks and blockers view.

### 4.6 Evidence / Sources
Drill-down surface linking briefing to underlying artifacts.

---

## 5. Artifact Boundary Model

> Product truth lives with the product repo.  
> Orchestration truth lives with `amazing-async-dev`.

### Product repo artifacts
- north-star documents
- product brief
- feature specs
- phase summaries
- dogfood reports
- friction logs

### async-dev repo artifacts
- execution results
- continuation state
- audit artifacts
- email decision artifacts
- orchestration summaries

---

## 6. V1 Scope

- load one project context
- read from one product repo and one async-dev repo
- derive a usable executive brief
- show recent changes
- show current state
- show recommended next step
- show evidence links

---

## 7. Phase Structure

### Phase 0 — Product Definition
- Product North Star & Constitution
- Artifact Input Contract

### Phase 1 — Briefing Foundation
- Single-Project Loader
- Briefing Data Model
- V1 Executive Brief Surface
- Evidence Panel

### Phase 2 — Decision Quality & Usability
- What Changed Timeline
- Recommendation Quality
- Risk/Blocker Briefing

### Phase 3 — Email Decision Integration
- Decision Email Trace Surface
- Reply Required Queue

---

## 8. Autonomous Execution Constitution

### 8.1 Autonomy Expectation
- derive downstream specs itself
- derive bounded next scopes itself
- continue canonical loop execution by default
- request human input only when escalation condition exists

### 8.2 Human Escalation Conditions
- core product identity would materially change
- two major design directions are both plausible
- architecture would shift substantially
- scope expansion would change project category

### 8.3 Anti-drift Rule
Do not allow the product to drift into:
- generic dashboard
- raw artifact browser
- generic PM tracker

---

## 9. Briefing Quality Requirements

A good briefing answers:
1. What changed?
2. Where are we now?
3. What is risky or blocked?
4. What is recommended next?
5. Do I need to decide something?
6. What evidence supports this?

---

## 10. Recommended Immediate Next Action

Derive the first downstream spec covering:
- artifact input contract
- single-project loader assumptions
- initial briefing data model
- V1 executive brief surface