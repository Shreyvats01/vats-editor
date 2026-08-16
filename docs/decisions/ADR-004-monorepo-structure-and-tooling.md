# ADR-004: Monorepo Structure and Tooling

## Status
Accepted

## Date
2026-08-16

## Context
Vats Editor comprises two distinct deployment targets within a single repository:

1. A core headless npm package (`vats` under `packages/headless`) distributed to consumers through npm.
2. A full-featured demonstration web application (`vats-next-app` under `apps/web`) built on Next.js 15 App Router.
3. Shared configuration packages (such as `packages/tsconfig`).

The project required a tooling and monorepo setup that meets these criteria:

- Strict dependency isolation to prevent phantom dependencies where a package references an unlisted module hoisted from another workspace.
- Fast, cached builds across both local development and continuous integration pipelines.
- Dual module format distribution (CommonJS and ECMAScript Modules) along with TypeScript declaration files (`.d.ts`) for the published package.
- Fast linting and formatting across all packages without configuration drift.
- Automated semantic versioning and changelog tracking for npm releases.

## Decision
We established a monorepo architecture combining pnpm workspaces, Turborepo, tsup, Biome, and Changesets.

### 1. Package Management: pnpm Workspaces
We chose `pnpm` (`pnpm@9.5.0`) with `pnpm-workspace.yaml`. `pnpm` uses content-addressable storage with symlinks. This saves disk space, speeds up installation, and prevents phantom dependencies by refusing to resolve packages not explicitly listed in a package's own `package.json`.

### 2. Build Pipeline: Turborepo
We configured Turborepo (`turbo@^2.3.3`) to orchestrate tasks across workspaces. `turbo.json` defines task dependency graphs (`topo`, `build`, `typecheck`, `lint`, `format`) and caches build artifacts (`dist/**`, `.next/**`). Rebuilding unchanged packages returns instantaneous cached results.

### 3. Library Bundling: tsup
For `packages/headless`, we chose `tsup` powered by `esbuild`. The configuration (`tsup.config.ts`) produces:
- Dual bundles: `dist/index.cjs` (CommonJS) and `dist/index.js` (ESM).
- Complete TypeScript declarations: `dist/index.d.ts`.
- Automatic `'use client'` banner injection for React Server Components compatibility in Next.js.
- Externalized peer dependencies (`react`, `react-dom`).

### 4. Linting and Formatting: Biome
We adopted Biome (`@biomejs/biome@^1.9.4`) to handle linting, import sorting, and code formatting across the repository. A single `biome.json` in the root governs rules for all packages, replacing separate ESLint and Prettier configurations.

### 5. Release Management: Changesets
We integrated `@changesets/cli` to handle version bumps and changelogs. Contributors run `pnpm changeset` to document changes in markdown files. During releases, `pnpm version:packages` applies semantic version increments and updates `CHANGELOG.md` files deterministically.

## Alternatives Considered

### Yarn Workspaces with Lerna
Yarn with Lerna was considered due to historical popularity. However, Lerna has had multiple maintenance transitions and slower task scheduling compared to Turborepo. Yarn Berry with Plug'n'Play (PnP) also introduces compatibility friction with certain native dependencies and build tools.

### Rollup or Webpack for Library Bundling
Custom Rollup or Webpack configurations offer deep customization, but require extensive plugin chains to generate dual CJS/ESM bundles, manage source maps, and emit TypeScript declarations. `tsup` provides this functionality out of the box with faster build speeds via `esbuild`.

### ESLint and Prettier
The standard ESLint and Prettier combination was evaluated. It was passed over in favor of Biome due to execution speed and simplicity. Biome processes formatting, linting, and import sorting in a single binary pass, cutting CI linting times from tens of seconds to sub-second runs.

## Consequences

### Positive
- Sub-second linting and formatting across the monorepo via Biome.
- Instantaneous incremental builds through Turborepo task caching.
- Package consumers can import `vats` in both CommonJS and ESM environments without module resolution failures.
- Reliable release workflow with automated changelog generation via Changesets.
- Strict dependency boundaries enforced by `pnpm`.

### Negative
- Monorepo contributors must have `pnpm` installed and avoid running `npm` or `yarn`.
- Biome does not support all specialized ESLint third-party rules, requiring the team to stick to supported linter rules.
