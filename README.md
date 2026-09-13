# Medical-Agent — Adaptive Emergency Triage Agent

Medical-Agent is an open-source research simulation for adaptive patient triage. It combines structured patient state, adaptive questioning, deterministic synthetic risk scoring, contradiction handling, routing decisions, and an auditable decision loop in a client-side React application.

> This project uses synthetic patient data and is intended for research, education, and software-engineering experimentation only. It is not a medical diagnostic system and must not be used for real-world clinical decision-making.

## Problem Statement

Triage workflows often need to collect incomplete information, prioritize the next useful question, reassess changing answers, and explain how a decision was reached. Medical-Agent provides a transparent software model for exploring those workflow problems without presenting its synthetic rules as clinical guidance.

## What the Agent Does

The agent coordinates a local decision loop:

1. Initializes a structured `PatientState` from a synthetic scenario or a custom session.
2. Selects the highest-priority unanswered question.
3. Parses the user's answer into a typed value and display value.
4. Detects contradictions against previously recorded state.
5. Updates state and recalculates synthetic risk and confidence.
6. Classifies risk and determines a routing decision.
7. Records important transitions in the audit log.
8. Continues until required information is collected or a high-risk condition ends the interview early.

There is no external LLM call or production backend in the decision path. The agent coordinates the workflow; the deterministic risk engine owns synthetic risk scoring.

## Architecture and Workflow

```text
Patient Input
    |
    v
Patient State
    |
    v
Adaptive Questioning
    |
    v
Answer Processing and State Update
    |
    v
Contradiction Detection
    |
    v
Deterministic Risk Engine
    |
    v
Risk Classification
    |
    v
Routing Policy
    |
    v
Reassessment / Final Decision
```

The main implementation boundaries are:

- `src/components/` renders the React interface.
- `src/engine/triageAgent.ts` orchestrates state transitions.
- `src/engine/questionSelector.ts` selects the next question.
- `src/engine/contradictionDetector.ts` compares new and previous answers.
- `src/engine/riskEngine.ts` calculates risk contributions and classification.
- `src/engine/routing.ts` maps risk and interview context to a route.
- `src/engine/auditLog.ts` records decision-loop events.
- `src/types/index.ts` defines shared state and result contracts.

See the detailed [architecture documentation](docs/architecture.md) and [agent loop documentation](docs/agent-loop.md).

## Key Features

### Adaptive Questioning

The question selector chooses unanswered fields by priority and applies context-sensitive boosts. Symptoms such as chest pain, breathing difficulty, bleeding, or impaired consciousness can prioritize relevant vital signs and observations.

### Deterministic Risk Engine

The risk engine evaluates transparent synthetic rules for oxygen saturation, heart rate, respiratory rate, temperature, blood pressure, consciousness, symptom severity, chest pain, breathing difficulty, bleeding, and age. Rule weights and thresholds are defined in `src/engine/rules.ts`.

### Risk Levels

The general score bands are:

| Score | Level |
| ---: | --- |
| 0-14 | `LOW` |
| 15-39 | `MODERATE` |
| 40-69 | `HIGH` |
| 70+ | `CRITICAL` |

Configured high-signal findings, such as critical oxygen saturation or unresponsive consciousness, also have explicit synthetic classification behavior in the risk engine.

### Routing Decisions

The routing policy converts the risk result and interview context into one of these decisions:

- `SELF_CARE` — monitor a low-risk synthetic case.
- `ROUTINE_CLINIC` — follow up on a moderate-risk case.
- `URGENT_CLINIC` — seek urgent evaluation for a high-risk case.
- `EMERGENCY` — route a critical synthetic case to emergency handling.
- `HUMAN_REVIEW` — escalate unresolved high-risk contradictions or low-confidence high-risk cases.
- `PENDING` — continue assessment while the interview is incomplete.

### Contradiction Handling

The contradiction detector flags changes in qualitative fields and changes in vital signs beyond configured tolerances. Contradictions retain previous and current values, are shown in the interface, can trigger human review, and can be resolved by keeping either the previous or current answer.

### Dashboard Simulations

The main dashboard includes seeded synthetic patient scenarios with their patient names, expected risk levels, and routing decisions. The **New Simulation** action starts a custom questionnaire. When that assessment is complete, choosing **Restart** adds the entered patient details to the dashboard as a reusable simulation.

Saved questionnaire entries are held in client-side React state for the current browser session. They are intentionally not persisted to a database or `localStorage`, so they are cleared when the page is refreshed or the app is restarted.

## Technology Stack

- React 18 and React DOM
- TypeScript with strict compiler settings
- Vite for development and production builds
- Tailwind CSS and Lucide React for the interface
- Vitest for unit and scenario tests
- ESLint for static analysis

## Project Structure

```text
src/
  components/   React presentation components
  engine/       Deterministic triage and decision logic
  tests/        Engine and scenario tests
  types/        Shared TypeScript contracts
  utils/        UI formatting and state helpers
docs/           Architecture, agent loop, risk engine, roadmap, and maintainer guides
.github/        CI, issue templates, and pull request template
```

## Run Locally

### Prerequisites

- Node.js 18 or newer
- npm

### Install and start development

```bash
npm install
npm run dev
```

Vite prints the local development URL, normally `http://localhost:5173`.

### Available commands

```bash
npm test            # Run the Vitest suite
npm run test:watch  # Run Vitest in watch mode
npm run typecheck   # Run TypeScript checks
npm run lint        # Run ESLint
npm run build       # Create a production build
npm run preview     # Preview the production build locally
```

No database or external service is required to run the dashboard simulations locally. Add a persistence layer only if saved patient scenarios need to survive page refreshes or be shared across users and devices.

## Testing

The test suite covers:

- Low-, moderate-, high-, and critical-risk scenarios
- Risk scoring and risk classification
- Routing policy
- Adaptive question selection
- Patient state updates and risk recalculation
- Contradiction detection and resolution
- Audit trail creation

Run the suite with:

```bash
npm test
```

Before opening a pull request, run the complete validation set:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Contributing

Contributions should preserve the separation between the React UI and deterministic engine logic. Fork the repository, create a focused feature branch, make the change, add or update tests, run the validation commands, and open a pull request against `main`.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full workflow, commit examples, review expectations, and pull request checklist.

Additional project policies:

- [Security policy](SECURITY.md)
- [Code of conduct](CODE_OF_CONDUCT.md)
- [Maintainer guide](docs/maintainers.md)
- [Roadmap](docs/roadmap.md)

## Safety Disclaimer

This project uses synthetic patient data and is intended for research, education, and software-engineering experimentation only. It is not a medical diagnostic system and must not be used for real-world clinical decision-making.
