# Vats Editor — Agent & Developer Workflow Guide

This document contains development standards, git commit instructions, automated verification gates, and monorepo architectural rules for **Vats Editor**.

---

## 1. Project Context & Architecture

**Vats Editor** is an open-source, Notion-style WYSIWYG rich text editor framework built with Tiptap 3, Tailwind CSS, Radix UI, and Next.js 15.

```text
vats-editor/
├── packages/
│   ├── headless/      # Core npm package ('vats')
│   │   ├── src/components/   # EditorRoot, EditorContent, EditorBubble, EditorCommand
│   │   ├── src/extensions/   # Mathematics, Twitter, UpdatedImage, CustomKeymap
│   │   ├── src/plugins/      # UploadImagesPlugin
│   │   └── src/utils/        # Atoms, store, URL & Markdown helpers
│   └── tsconfig/      # Shared TypeScript configuration
├── apps/
│   └── web/           # Next.js 15 App Router demo ('vats-next-app')
├── .gemini/skills/    # Local git playbook & workflow skills
└── GEMINI.md          # Development & Git commit protocol
```

- **Package Manager**: Use `pnpm` exclusively. Never run `npm`, `yarn`, or `bun` commands to avoid lockfile collisions.

---

## 2. Git Commit Protocol & Standards

### 2.1 Conventional Commits Format

Every commit must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```text
<type>(<scope>): <short imperative description>

- <optional bullet point explaining why>
- <optional bullet point explaining what>
```

#### Commit Types:
- `feat`: A new feature or capability (e.g. `feat(editor): add math expression node and Katex rendering`).
- `fix`: A bug fix (e.g. `fix(upload): eliminate stale transaction race condition in FileReader`).
- `refactor`: Code change that neither fixes a bug nor adds a feature (e.g. `refactor(core): isolate Jotai store per EditorRoot`).
- `perf`: Code change that improves performance (e.g. `perf(bubble): optimize memoization dependencies`).
- `chore`: Tooling, dependencies, configuration, or hygiene (e.g. `chore(repo): configure Biome linting`).
- `docs`: Documentation updates (e.g. `docs(readme): add Vats Editor quickstart guide`).
- `test`: Adding or updating tests (e.g. `test(core): add multi-editor isolation tests`).
- `build`: Changes affecting build system or external dependencies (e.g. `build(tsup): configure dual ESM and CJS bundle`).
- `ci`: CI configuration changes (e.g. `ci(github): add workflow typecheck`).

#### Allowed Scopes:
- `core` / `headless`: The core editor package (`packages/headless`).
- `web`: The Next.js demo application (`apps/web`).
- `extensions`: Tiptap custom nodes/extensions (`twitter`, `math`, `image`, etc.).
- `plugins`: ProseMirror plugins (`upload`, etc.).
- `ui`: UI selector components and toolbars.
- `styles`: CSS / Tailwind styling.
- `release`: Package versioning and publishing.
- `repo`: Monorepo-wide configuration.

---

## 3. Pre-Commit Automated Verification Gate

Before staging or committing any code, you **MUST** run and pass all local verification gates:

```bash
# 1. Typecheck all packages
pnpm typecheck

# 2. Run Biome linting
pnpm lint

# 3. Verify production build
pnpm build
```

> [!CAUTION]
> **Stop Gate**: Never commit or push if `pnpm typecheck` or `pnpm lint` reports any errors. Fix all errors prior to staging.

---

## 4. Security & Hygiene Rules

1. **No Secrets**: Never commit `.env`, `.env.local`, API keys, tokens (e.g. `BLOB_READ_WRITE_TOKEN`), private keys, or credentials.
2. **No Build Artifacts**: Ensure `.gitignore` ignores `dist/`, `.next/`, `node_modules/`, `.turbo/`, and temporary build outputs.
3. **Atomic Commits**: Stage and commit only the files relevant to the specific logical task. Avoid blanket `git add .` when unrelated files or debug files are present.
4. **Scope Discipline**: Do not make unsolicited formatting changes across unrelated files.

---

## 5. Branching & Release Workflow

1. **Trunk-Based Development**: Work on short-lived feature/fix branches (`feat/<feature-name>`, `fix/<bug-name>`) and merge to `main`.
2. **Changesets for Package Releases**:
   ```bash
   # Add a changeset entry describing the change
   pnpm changeset

   # Bump package version and update changelog
   pnpm version:packages

   # Publish updated package
   pnpm publish:packages
   ```

---

## 6. Local Skills

Local git skills are available in `.gemini/skills/`:
- `git-push-playbook`: Pre-push decision rubric and emergency rollback protocols.
- `git-workflow-and-versioning`: Branching models, atomic commit sizing, and SemVer release management.
