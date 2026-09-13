# Maintainer Guide

This document records recommended GitHub labels and lightweight repository-maintenance practices. Labels must be created in the GitHub repository settings or with an authenticated GitHub CLI; they are not created by the application.

## Recommended Labels

| Label | Use |
| --- | --- |
| `good first issue` | Small, well-scoped tasks suitable for a new contributor. |
| `help wanted` | Work where maintainer assistance or community input is welcome. |
| `bug` | Reproducible incorrect behavior or broken workflow. |
| `enhancement` | A new capability or meaningful improvement. |
| `documentation` | README, guides, API, or project-documentation changes. |
| `tests` | Test coverage, fixtures, or test infrastructure. |
| `architecture` | Changes to module boundaries or system design. |
| `security` | Security-related work; do not use public issues for vulnerability disclosure. |
| `ci/cd` | GitHub Actions and release/deployment automation. |

## Optional GitHub CLI Setup

From an authenticated environment, create missing labels with:

```bash
gh label create "good first issue" --repo Teja-123-byte/Medical_agent --color 7057ff --description "Good entry point for new contributors"
gh label create "help wanted" --repo Teja-123-byte/Medical_agent --color 008672 --description "Maintainer or community help welcome"
gh label create "bug" --repo Teja-123-byte/Medical_agent --color d73a4a --description "Something is not working"
gh label create "enhancement" --repo Teja-123-byte/Medical_agent --color a2eeef --description "New capability or improvement"
gh label create "documentation" --repo Teja-123-byte/Medical_agent --color 0075ca --description "Documentation changes"
gh label create "tests" --repo Teja-123-byte/Medical_agent --color 5319e7 --description "Test coverage or infrastructure"
gh label create "architecture" --repo Teja-123-byte/Medical_agent --color 1d76db --description "Architecture and design work"
gh label create "security" --repo Teja-123-byte/Medical_agent --color b60205 --description "Security-related work"
gh label create "ci/cd" --repo Teja-123-byte/Medical_agent --color 006b75 --description "Continuous integration and delivery"
```

If a label already exists, GitHub CLI may report that it cannot create a duplicate; that does not indicate a project error.

## Review Expectations

- Keep pull requests focused and linked to an issue when practical.
- Require typecheck, lint, tests, and build validation for code changes.
- Keep synthetic risk rules deterministic and explicitly documented.
- Never accept real patient data, credentials, or secrets into the repository.
- Use [SECURITY.md](../SECURITY.md) for private vulnerability reports.
