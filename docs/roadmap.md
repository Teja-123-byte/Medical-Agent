# Roadmap

This backlog is maintained locally so it can be converted into GitHub Issues when repository access is available.

## Backlog

1. **Fix TypeScript compilation errors** - Keep compiler and editor diagnostics clean across supported environments.
2. **Improve adaptive question selection** - Add stronger information-gain and urgency prioritization.
3. **Add contradiction detection tests** - Expand coverage for duplicate, resolved, and vital-value contradictions.
4. **Add synthetic patient scenarios** - Cover more combinations of symptoms, vitals, and missing data.
5. **Improve risk engine configuration** - Make synthetic thresholds and weights easier to inspect and modify.
6. **Add agent audit trail** - Improve filtering, export, and explanation of state transitions.
7. **Add API documentation** - Document exported engine types and functions.
8. **Add GitHub Actions CI** - Keep typecheck, lint, tests, and builds enforced on pull requests.
9. **Improve mobile UI** - Test and refine interview, state, and trace panels on small screens.
10. **Add contributor documentation** - Expand onboarding, architecture, and review guidance.

## Creating GitHub Issues

With GitHub CLI authenticated, run one command per backlog item:

```bash
gh issue create --repo Teja-123-byte/Medical-Agent --title "fix: resolve TypeScript compilation errors" --body "See docs/roadmap.md item 1."
gh issue create --repo Teja-123-byte/Medical-Agent --title "feat: improve adaptive question selection" --body "See docs/roadmap.md item 2."
gh issue create --repo Teja-123-byte/Medical-Agent --title "test: add contradiction detection tests" --body "See docs/roadmap.md item 3."
gh issue create --repo Teja-123-byte/Medical-Agent --title "test: add synthetic patient scenarios" --body "See docs/roadmap.md item 4."
gh issue create --repo Teja-123-byte/Medical-Agent --title "feat: improve risk engine configuration" --body "See docs/roadmap.md item 5."
gh issue create --repo Teja-123-byte/Medical-Agent --title "feat: add agent audit trail" --body "See docs/roadmap.md item 6."
gh issue create --repo Teja-123-byte/Medical-Agent --title "docs: add API documentation" --body "See docs/roadmap.md item 7."
gh issue create --repo Teja-123-byte/Medical-Agent --title "ci: add GitHub Actions CI" --body "See docs/roadmap.md item 8."
gh issue create --repo Teja-123-byte/Medical-Agent --title "fix: improve mobile UI" --body "See docs/roadmap.md item 9."
gh issue create --repo Teja-123-byte/Medical-Agent --title "docs: add contributor documentation" --body "See docs/roadmap.md item 10."
```

Alternatively, open the repository on GitHub, choose **Issues**, select **New issue**, and use the bug or feature template for each item.
