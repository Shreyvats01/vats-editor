# Architecture Decisions

This page summarizes the core Architecture Decision Records (ADRs) governing the technical design of Vats Editor.

---

## Architecture Overview

Vats Editor follows a modular architecture separating core editor headless logic from user-interface presentation:

```text
vats-editor/
├── packages/
│   ├── headless/      # Core headless package ('@vats-editor/core')
│   │   ├── src/components/   # React components (EditorRoot, EditorContent, EditorBubble, EditorCommand)
│   │   ├── src/extensions/   # Tiptap extensions (Mathematics, Twitter, UpdatedImage, CustomKeymap)
│   │   ├── src/plugins/      # ProseMirror plugins (UploadImagesPlugin)
│   │   └── src/utils/        # Jotai atoms, store, URL & Markdown helpers
│   └── tsconfig/      # Shared TypeScript configuration
└── apps/
    └── web/           # Next.js 15 App Router demo application
```

---

## ADR Summaries

### ADR-001: Tiptap 3 and ProseMirror Foundation

- **Status**: Accepted
- **Context**: Choosing a rich text engine capable of handling Notion-style block editing, custom marks, mathematical formulas, and custom extensions.
- **Decision**: Build Vats Editor on top of Tiptap 3 and the ProseMirror document model.
- **Alternatives Considered**:
  - *Slate.js*: Rejected due to frequent breaking changes, lack of built-in schema validation, and smaller ecosystem for specialized extensions.
  - *Lexical*: Rejected due to a smaller library of mature community extensions and more complex state reconciliation.
  - *BlockNote*: Rejected because it enforces a rigid UI shell rather than providing headless composability.
  - *Draft.js*: Deprecated by Facebook and unmaintained.
- **Consequences**: Provides reliable document schema enforcement, battle-tested selection handling, and access to the rich ProseMirror plugin ecosystem.

---

### ADR-002: Isolated Store and Event Architecture

- **Status**: Accepted
- **Context**: Legacy rich text wrappers relied on a single module-level store singleton. When developers rendered multiple editors on the same page, typing in one editor triggered state updates and slash command dropdowns in the other. Additionally, global keydown listeners hijacked arrow keys from outside forms.
- **Decision**: Introduce a per-instance Jotai store provided by `<EditorRoot store={...}>` and accessible via `EditorStoreContext`. Store instances and tunnel references are tracked via `WeakMap` objects keyed to the ProseMirror `Editor` instance. Keyboard events are delegated specifically to the active editor via `handleCommandNavigation`.
- **Alternatives Considered**:
  - *Module-level global store*: Caused cross-editor race conditions and multi-editor state bugs.
  - *Standard React Context without Jotai*: Caused excessive re-renders of the entire editor tree on every keystroke.
- **Consequences**: Multiple independent editors can safely run on the same page. Slash command menus only respond to their parent editor, and keyboard handling remains deterministic.

---

### ADR-003: Unified Image Pipeline

- **Status**: Accepted
- **Context**: Image handling required three distinct features: drag-and-drop upload from filesystem, visual loading indicators during upload, and interactive resizing handles after upload.
- **Decision**: Combine the `UpdatedImage` Tiptap node, `UploadImagesPlugin` ProseMirror decorations, and `<ImageResizer />` into a cohesive pipeline. Asynchronous file uploads render an inline placeholder node before replacing it with the final remote URL.
- **Alternatives Considered**:
  - *Base64 data URLs*: Rejected because large embedded images bloat document JSON and degrade serialization performance.
  - *Modal-only file pickers*: Rejected due to inferior user experience compared to direct drag-and-drop.
- **Consequences**: Clean separation between file upload transport logic and document state. Users receive instant visual feedback while uploading.

---

### ADR-004: Monorepo Structure and Tooling

- **Status**: Accepted
- **Context**: The project needed a build and packaging setup supporting the core npm library (`vats`), shared configurations, and a Next.js 15 demo application.
- **Decision**: Adopt `pnpm` workspaces with Turborepo for task caching, `tsup` for dual ESM/CJS bundling with full TypeScript declaration (`.d.ts`) generation, Biome for linting and formatting, and Changesets for automated SemVer releases.
- **Alternatives Considered**:
  - *Polyrepo*: Rejected because changes across package and demo required multiple pull requests and manual linking.
  - *Webpack / Rollup manual configuration*: Rejected in favor of `tsup` for faster builds and zero-config `.d.ts` generation.
  - *npm / yarn workspaces*: Rejected due to slower dependency resolution and weaker workspace isolation compared to `pnpm`.
- **Consequences**: Fast build cycles with Turborepo caching, strict typecheck gates across all workspaces, and frictionless release automation.
