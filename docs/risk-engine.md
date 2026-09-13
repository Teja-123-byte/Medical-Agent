# Risk Engine

The risk engine is a transparent, deterministic scoring system for synthetic demonstrations. It is not clinically validated.

## Responsibilities

`src/engine/riskEngine.ts` evaluates the configured rules in `src/engine/rules.ts`, sums positive contributions, classifies the total score, and returns contributing factors and confidence.

Rules currently cover:

- Oxygen saturation
- Heart rate
- Respiratory rate
- Temperature
- Systolic blood pressure
- Consciousness
- Symptom severity
- Chest pain
- Breathing difficulty
- Bleeding
- Age

## Classification

The default score bands are:

| Score | Level |
| ---: | --- |
| 0-14 | LOW |
| 15-39 | MODERATE |
| 40-69 | HIGH |
| 70+ | CRITICAL |

Certain synthetic high-signal findings, such as critical oxygen saturation or unresponsiveness, receive explicit level handling in the engine so the result reflects their configured demonstration policy.

## Changing Rules

When changing weights, thresholds, or overrides:

1. Update `src/engine/rules.ts` or `src/engine/riskEngine.ts`.
2. Add focused unit tests.
3. Update scenario expectations if behavior changes.
4. Run typecheck, lint, tests, and build.
5. Document the change and its safety implications.

Never present these rules as medical guidance.
