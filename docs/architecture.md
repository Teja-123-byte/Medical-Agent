# Architecture

Medical Agent is a client-side React application backed by a deterministic TypeScript engine. The UI presents state and decisions; it does not independently calculate medical risk.

## Decision Flow

```text
Patient Input
    |
    v
Patient State
    |
    v
Adaptive Agent
    |
    v
Question Selection
    |
    v
Answer Processing
    |
    v
State Update
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

## Boundaries

- `src/components/` renders the interface and user interactions.
- `src/engine/triageAgent.ts` orchestrates the state transition loop.
- `src/engine/questionSelector.ts` chooses high-value unanswered questions.
- `src/engine/contradictionDetector.ts` compares new answers with known state.
- `src/engine/riskEngine.ts` calculates synthetic risk contributions.
- `src/engine/routing.ts` maps risk and interview context to a route.
- `src/engine/auditLog.ts` records important transitions.
- `src/types/index.ts` defines shared state and result contracts.

The agent may select questions and coordinate the workflow, but it must not directly determine medical risk. Synthetic risk scoring remains the responsibility of the deterministic risk engine.
