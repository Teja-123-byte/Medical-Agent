# Agent Loop

The agent runs a local, deterministic loop over a `PatientState` object.

1. Initialize state from a scenario or an empty custom session.
2. Calculate the initial synthetic risk and missing information.
3. Select the highest-priority unanswered question.
4. Parse the submitted value into a typed answer.
5. Compare the answer with the previous state to detect contradictions.
6. Update the patient state and append the answer.
7. Recalculate risk and confidence.
8. Reassess the routing decision.
9. Write audit events for the transition.
10. Continue until required information is available or early termination is triggered.

## State Invariants

- Risk is recalculated after each accepted answer.
- Unresolved contradictions are retained until explicitly resolved.
- Routing is pending while an incomplete state has unknown risk.
- High-risk unresolved contradictions can route to human review.
- No external model or remote service is required for the decision path.

The implementation is in `src/engine/triageAgent.ts`; tests for the loop live in `src/tests/scenarios.test.ts` and `src/tests/questionSelection.test.ts`.
