# amazing-briefing-viewer

A product-layer application for helping humans quickly understand project state and next recommended action.

## Purpose

Transform scattered project artifacts into a high-signal, decision-friendly project briefing experience.

## Core Questions

- What changed recently?
- What phase is this project in?
- What is blocked?
- What should happen next?
- Do I need to intervene?
- Where is the supporting evidence?

## Architecture

- **Product truth**: Lives in the product repo
- **Orchestration truth**: Lives in `amazing-async-dev`

This viewer respects the boundary and combines both sources into a unified briefing.

## V1 Scope

Single-project briefing viewer with:
- Executive Brief Surface
- What Changed Timeline
- Current State
- Recommended Next Step
- Evidence Panel

## Tech Stack

- React + TypeScript
- Vite
- TailwindCSS

## Development

```bash
npm install
npm run dev
```

## License

MIT