# Roadmap

This backlog is maintained locally so it can be converted into GitHub Issues when repository access is available.

## Backlog

1. **Fix TypeScript compilation errors** - **Status: COMPLETED**. The application typechecks successfully.
2. **Improve adaptive question selection** - **Status: PLANNED**. Add stronger information-gain and urgency prioritization.
3. **Add contradiction detection tests** - **Status: PLANNED**. Expand coverage for duplicate, resolved, and vital-value contradictions.
4. **Add synthetic patient scenarios** - **Status: PLANNED**. Cover more combinations of symptoms, vitals, and missing data.
5. **Improve risk engine configuration** - **Status: PLANNED**. Make synthetic thresholds and weights easier to inspect and modify.
6. **Add agent audit trail** - **Status: PLANNED**. Improve filtering, export, and explanation of state transitions.
7. **Add API documentation** - **Status: PLANNED**. Document exported engine types and functions.
8. **Add GitHub Actions CI** - **Status: COMPLETED**. CI runs typecheck, lint, tests, and build on pushes and pull requests to `main`.
9. **Improve mobile UI** - **Status: PLANNED**. Test and refine interview, state, and trace panels on small screens.
10. **Add contributor documentation** - **Status: COMPLETED**. Contributor, security, conduct, issue, and pull request guidance is present.

## Creating GitHub Issues

With GitHub CLI authenticated, run one command per backlog item:

```bash
gh issue create --repo Teja-123-byte/Medical_agent --title "fix: resolve TypeScript compilation errors" --body "See docs/roadmap.md item 1."
gh issue create --repo Teja-123-byte/Medical_agent --title "feat: improve adaptive question selection" --body "See docs/roadmap.md item 2."
gh issue create --repo Teja-123-byte/Medical_agent --title "test: add contradiction detection tests" --body "See docs/roadmap.md item 3."
gh issue create --repo Teja-123-byte/Medical_agent --title "test: add synthetic patient scenarios" --body "See docs/roadmap.md item 4."
gh issue create --repo Teja-123-byte/Medical_agent --title "feat: improve risk engine configuration" --body "See docs/roadmap.md item 5."
gh issue create --repo Teja-123-byte/Medical_agent --title "feat: add agent audit trail" --body "See docs/roadmap.md item 6."
gh issue create --repo Teja-123-byte/Medical_agent --title "docs: add API documentation" --body "See docs/roadmap.md item 7."
gh issue create --repo Teja-123-byte/Medical_agent --title "ci: add GitHub Actions CI" --body "See docs/roadmap.md item 8."
gh issue create --repo Teja-123-byte/Medical_agent --title "fix: improve mobile UI" --body "See docs/roadmap.md item 9."
gh issue create --repo Teja-123-byte/Medical_agent --title "docs: add contributor documentation" --body "See docs/roadmap.md item 10."
```

Alternatively, open the repository on GitHub, choose **Issues**, select **New issue**, and use the bug or feature template for each item.
