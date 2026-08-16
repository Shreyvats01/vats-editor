---
name: git-workflow-and-versioning
description: Structures git workflow practices. Use when making any code change. Use when committing, branching, resolving conflicts, or when you need to organize work across multiple parallel streams. Use when cutting a release, choosing a semantic version bump, tagging, writing a changelog, or releasing/publishing packages to npm.
---

# Git Workflow and Versioning

## Overview

Git is your safety net. Treat commits as save points, branches as sandboxes, and history as documentation. Disciplined version control is the mechanism that keeps changes manageable, reviewable, and reversible.

## Core Principles

### Trunk-Based Development (Recommended)

Keep `main` always deployable. Work in short-lived feature branches that merge back within 1-3 days.

```
main ──●──●──●──●──●──●──●──●──●──  (always deployable)
        ╲      ╱  ╲    ╱
         ●──●─╱    ●──╱    ← short-lived feature branches (1-3 days)
```

- **Dev branches are costs.** Every day a branch lives, it accumulates merge risk.
- **Release branches are acceptable.** When you need to stabilize a release while main moves forward.
- **Feature flags > long branches.** Prefer deploying incomplete work behind flags rather than keeping it on a branch for weeks.

### 1. Commit Early, Commit Often

Each successful increment gets its own commit. Don't accumulate large uncommitted changes.

```
Work pattern:
  Implement slice → Test → Verify → Commit → Next slice

Not this:
  Implement everything → Hope it works → Giant commit
```

### 2. Atomic Commits

Each commit does one logical thing:

```
# Good: Each commit is self-contained
git log --oneline
a1b2c3d feat(editor): add math expression node and Katex rendering
d4e5f6g feat(ui): add math popover selector button
h7i8j9k fix(upload): eliminate stale transaction race condition
m1n2o3p test(core): add multi-editor store isolation tests
```

### 3. Descriptive Messages

Commit messages explain the *why*, not just the *what*:

```text
<type>(<scope>): <short description>

<optional body explaining why, not what>
```

**Types:**
- `feat` — New feature
- `fix` — Bug fix
- `refactor` — Code change that neither fixes a bug nor adds a feature
- `test` — Adding or updating tests
- `docs` — Documentation only
- `chore` — Tooling, dependencies, config

### 4. Keep Concerns Separate

Don't combine formatting changes with behavior changes. Don't combine refactors with features.

### 5. Size Your Changes

Target ~100-300 lines per commit. Split changes over ~1000 lines.

## Branching Strategy

### Feature Branches

```
main (always deployable)
  │
  ├── feature/task-creation    ← One feature per branch
  ├── feature/user-settings    ← Parallel work
  └── fix/duplicate-tasks      ← Bug fixes
```

### Branch Naming

```
feature/<short-description>   → feature/math-support
fix/<short-description>       → fix/upload-race-condition
chore/<short-description>     → chore/update-deps
refactor/<short-description>  → refactor/store-context
```

## Release & Versioning

### Semantic Versioning

```
  MAJOR  breaking change — consumers must change their code to upgrade
  MINOR  new functionality, backward-compatible — safe to upgrade
  PATCH  bug fix, backward-compatible — safe to upgrade
```

### Monorepo / Changeset Workflow

```bash
# 1. Create a changeset entry
pnpm changeset

# 2. Version packages
pnpm version:packages

# 3. Publish packages
pnpm publish:packages
```
