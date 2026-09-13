# Adaptive Emergency Triage Agent

Deterministic synthetic emergency-triage simulation built with React, TypeScript, Vite, and Vitest.

> This project is for software research and demonstration only. It is not a medical device and must not be used to diagnose, treat, or triage real patients.

## What Problem It Solves

Medical Agent demonstrates how an adaptive interview can collect patient information, update a structured patient state, calculate synthetic risk, detect contradictory answers, and route a case to an appropriate simulated outcome.

The project is designed for developers who want to explore:

- Rule-based decision engines with transparent scoring
- Adaptive question selection from incomplete state
- Contradiction detection and resolution
- Auditability of agent decisions
- A React interface for inspecting the complete decision loop

## Architecture

```text
React UI
	App.tsx
		Scenario selection
		Interview panel
		Patient state and risk dashboards
		Contradiction and audit panels
					|
					v
Triage orchestrator
	triageAgent.ts
					|
					+--> questionSelector.ts       Selects the next question
					+--> contradictionDetector.ts  Detects conflicting answers
					+--> riskEngine.ts              Calculates score and risk level
					+--> routing.ts                 Maps risk to a route
					+--> auditLog.ts                Records state transitions
					|
					v
Structured PatientState
```

Important boundaries:

- `src/components/` contains the presentation layer.
- `src/engine/` contains deterministic application logic.
- `src/types/` contains shared TypeScript contracts.
- `src/tests/` contains unit and scenario tests for the engine.

## Features

- Synthetic patient scenarios for low, moderate, high, critical, and contradictory cases
- Adaptive interview flow driven by missing information and question priority
- Synthetic risk scoring from vitals, symptoms, consciousness, bleeding, and age
- Risk levels: `LOW`, `MODERATE`, `HIGH`, and `CRITICAL`
- Routing decisions: self-care, routine clinic, urgent clinic, emergency, or human review
- Contradiction detection for qualitative changes and vital-sign changes beyond tolerance
- Contradiction resolution by keeping the previous or current answer
- Risk recalculation after every state update
- Audit trail for session start, answers, state changes, risk changes, and routing changes
- Responsive dashboard UI built with Tailwind CSS and Lucide icons

## Technology Stack

- React 18 and React DOM
- TypeScript with strict compiler settings
- Vite for development and production builds
- Tailwind CSS for styling
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
docs/           Architecture, agent loop, risk engine, and roadmap
.github/        CI, issue templates, and pull request template
```

## Screenshots

Add product screenshots to `docs/screenshots/` and link them here as the interface evolves. Suggested captures:

| View | Description |
| --- | --- |
| Scenario selection | Choose a synthetic patient profile or start a custom session. |
| Interview dashboard | Answer the next adaptive question and inspect current risk. |
| Agent trace | Review questions, state updates, contradictions, and routing decisions. |

Example Markdown for a committed screenshot:

```md
![Interview dashboard](docs/screenshots/interview-dashboard.png)
```

## How to Run

### Prerequisites

- Node.js 18 or newer
- npm

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Vite will print the local URL, normally `http://localhost:5173`.

### Other commands

```bash
npm run build       # Create a production build
npm run preview     # Preview the production build locally
npm run typecheck   # Run TypeScript checks
npm run lint        # Run ESLint
```

## How the Agent Works

The decision loop is deterministic and runs locally:

1. A scenario or custom session creates an initial `PatientState`.
2. The question selector finds high-priority fields that are still missing.
3. The user submits an answer, which is parsed into a typed value and display value.
4. The contradiction detector compares the answer with the previous field value.
5. The state is updated and the risk engine recalculates the synthetic score.
6. The routing policy maps the risk level and interview state to a routing decision.
7. Each important transition is written to the audit log.
8. The agent continues until required information is collected or a high-risk condition ends the interview early.

Risk scoring is intentionally transparent. Rules and weights live in `src/engine/rules.ts`; orchestration lives in `src/engine/triageAgent.ts`. There is no LLM call in the decision path.

## Testing

Run the complete test suite with:

```bash
npm test
```

The tests cover:

- Contradiction detection and value formatting
- Adaptive question selection
- Risk scoring and risk classification
- Routing policy
- Scenario outcomes
- Risk recalculation after updates
- Contradiction resolution
- Audit trail creation

The current suite contains 54 tests across five test files.

## Roadmap

The project backlog is documented in [docs/roadmap.md](docs/roadmap.md). It includes improvements to adaptive questioning, contradiction coverage, synthetic scenarios, risk configuration, auditability, mobile UI, API documentation, and contributor workflow.

## Development Documentation

- [Architecture](docs/architecture.md)
- [Agent loop](docs/agent-loop.md)
- [Risk engine](docs/risk-engine.md)
- [Contributing](CONTRIBUTING.md)
- [Security policy](SECURITY.md)
- [Code of conduct](CODE_OF_CONDUCT.md)

## Safety Disclaimer

This application uses fictional data and synthetic rules for engineering demonstration. Its output is not clinically validated, should not be relied on for medical decisions, and does not replace a qualified healthcare professional or emergency services. Do not enter real patient information into this project.

## Contribution Instructions

1. Create a feature branch from the default branch.
2. Keep changes focused and preserve the separation between UI and deterministic engine logic.
3. Add or update tests for behavior changes, especially risk and routing rules.
4. Run the checks before opening a pull request:

	 ```bash
	 npm test
	 npm run typecheck
	 npm run lint
	 npm run build
	 ```

5. Describe the behavior change, test coverage, and any safety implications in the pull request.

Do not commit real patient data, credentials, or claims that the synthetic rules are clinically accurate.
