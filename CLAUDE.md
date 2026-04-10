# CLAUDE.md

This file provides guidance for AI assistants (Claude and others) working with this repository.

## Repository Status

This repository is currently **empty** — no application code, dependencies, or configuration files have been committed yet. This CLAUDE.md serves as the foundational document and should be updated as the project grows.

- **Remote:** `zhangjenny75-creator/Testapps`
- **Default development branch:** `claude/add-claude-documentation-0uvqe`

---

## Git Workflow

### Branching
- All development happens on feature branches; never commit directly to `main`/`master`
- Branch naming convention: `<type>/<short-description>` (e.g., `feat/user-auth`, `fix/login-bug`, `claude/add-feature-xyz`)
- Keep branches focused on a single concern

### Committing
- Write clear, imperative commit messages: `Add user authentication`, `Fix null pointer in login handler`
- Commit logically related changes together; avoid mixing unrelated edits in one commit
- Before committing, verify only intended files are staged

### Pushing
- Push with tracking: `git push -u origin <branch-name>`
- Never force-push to shared/protected branches without explicit approval
- Never skip hooks (`--no-verify`) unless there is an explicit, documented reason

---

## AI Assistant Guidelines

### General Rules
- Read files before editing them — never modify code you haven't read
- Prefer editing existing files over creating new ones
- Do not add features, refactoring, or "improvements" beyond what was explicitly requested
- Do not add comments or docstrings to code that wasn't changed
- Do not introduce speculative abstractions or future-proofing

### Security
- Never introduce command injection, SQL injection, XSS, or other OWASP Top 10 vulnerabilities
- Validate input at system boundaries (user input, external APIs); trust internal code
- Do not commit secrets, credentials, `.env` files, or API keys

### Risky Actions — Always Confirm First
The following require explicit user confirmation before proceeding:
- Deleting files, branches, or dropping database tables
- Force-pushing or hard-resetting git history
- Amending already-published commits
- Pushing to the remote repository
- Creating, closing, or commenting on PRs/Issues
- Modifying CI/CD pipelines or shared infrastructure

### Scope
- Match the scope of changes to what was actually requested
- A bug fix does not require surrounding code cleanup
- A simple feature does not need extra configurability

---

## Development Setup

> **Note:** This section should be updated once the project stack is chosen and initial code is committed.

### Expected Sections to Add
- **Prerequisites** — runtime versions, required tools
- **Installation** — `npm install` / `pip install` / etc.
- **Environment variables** — required `.env` keys and their purpose
- **Running locally** — dev server command and URL
- **Running tests** — test command and framework
- **Building for production** — build command and output location
- **Linting / formatting** — commands and any auto-fix options

---

## Project Structure

> **Note:** Update this section once the codebase is established.

```
Testapps/
├── CLAUDE.md          # This file — AI assistant guidance
├── README.md          # (to be created) Human-facing project overview
└── ...                # Application code to be added
```

---

## Testing

> **Note:** Document the test framework, test file locations, and how to run tests once they exist.

### Conventions (to be defined)
- Where test files live (e.g., co-located `*.test.ts`, or a top-level `tests/` directory)
- How to run the full suite
- How to run a single test file
- Required coverage thresholds

---

## Code Conventions

> **Note:** Define and document conventions here as the codebase evolves.

### Suggested areas to document
- Language and framework versions in use
- File and directory naming rules (kebab-case, PascalCase, etc.)
- Import ordering and grouping
- Error handling patterns
- Logging standards
- API response shapes

---

## Updating This File

This document should be kept current. Update it when:
- The tech stack is chosen and initial code is committed
- New tooling (linters, formatters, test frameworks) is added
- Architectural decisions are made
- New conventions are established that AI assistants should follow
