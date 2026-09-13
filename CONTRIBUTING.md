# Contributing to Medical Agent

Contributions are welcome. Please keep changes focused, tested, and consistent with the separation between the React UI and deterministic triage engine.

## Contribution Workflow

```text
Fork
  ↓
Create branch
  ↓
Make change
  ↓
Run tests
  ↓
Open Pull Request
```

### 1. Fork

Fork the repository to your GitHub account, then clone your fork locally:

```bash
git clone https://github.com/<your-account>/<repository>.git
cd <repository>
npm install
```

### 2. Create Branch

Create a descriptive branch from the default branch:

```bash
git checkout -b feature/short-description
```

Use prefixes such as `feature/`, `fix/`, `docs/`, or `test/` when appropriate.

### 3. Make Changes

Implement the change in the smallest appropriate area:

- Put UI changes in `src/components/`.
- Put decision logic in `src/engine/`.
- Update shared contracts in `src/types/` when necessary.
- Add or update tests in `src/tests/` for behavior changes.
- Do not commit credentials, real patient data, or personal health information.

### 4. Add or Update Tests

Add or update tests for behavior changes, especially risk scoring, routing, adaptive question selection, contradiction handling, patient state updates, and audit behavior.

### 5. Run Tests and Build

Install dependencies if needed, then run the full validation set:

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

Fix failures before opening a pull request. Include relevant test coverage for changes to risk scoring, question selection, contradiction handling, routing, or audit behavior.

### 6. Commit Changes

Use a concise conventional commit message:

```text
feat: add adaptive question selector
fix: resolve contradiction state handling
test: add risk engine scenarios
docs: improve architecture documentation
ci: add GitHub Actions workflow
```

### 7. Push Branch

Push the branch to your fork:

```bash
git add .
git commit -m "Describe the change"
git push -u origin feature/short-description
```

### 8. Open Pull Request

Open a pull request against `main`. The pull request description should explain:

- What changed
- Why the change was needed
- How it was tested
- Any safety, compatibility, or documentation considerations

### 9. Respond to Review

Keep pull requests focused, respond to review feedback, and update validation results when the implementation changes. For security vulnerabilities, follow [SECURITY.md](SECURITY.md) instead of opening a public issue or pull request.
