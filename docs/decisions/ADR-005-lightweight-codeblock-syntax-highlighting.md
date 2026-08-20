# ADR-005: Lightweight CodeBlock Syntax Highlighting and Package Consolidation

## Status
Accepted

## Date
2026-08-20

## Context
Vats Editor previously introduced a separate package (@vats-editor/style) to host modular stylesheets and syntax themes for code block nodes. However, maintaining a distinct package for purely static CSS introduced package fragmentation, increased maintenance overhead, and created additional installation steps for consumers.

Furthermore, @tiptap/extension-code-block-lowlight emits standard hljs-* CSS class tokens backed by lowlight and highlight.js. The JavaScript ecosystem already provides established, lightweight theme stylesheets within highlight.js (each weighing approximately 1 KB).

The goals for code block styling are:
1. Eliminate the overhead of an extra workspace package.
2. Provide out-of-the-box adaptive syntax coloring for light and dark modes.
3. Grant consumers complete flexibility to change themes via standard highlight.js stylesheets or customize CSS variables directly in their application styles.

## Decision
We chose to remove @vats-editor/style entirely and adopt a lightweight, standard syntax styling architecture:
1. Consolidate default adaptive code block CSS custom properties directly into prosemirror.css using --hljs-* and --vats-code-* variables.
2. Support any standard highlight.js/styles/*.css stylesheet (such as atom-one-dark.css, tokyo-night-dark.css, github-dark.css), allowing consumers to swap visual themes with a single import.
3. Allow granular syntax highlighting customization via CSS variables or custom NodeView extensions.

## Alternatives Considered

### Alternative 1: Bundling All Syntax Themes in @vats-editor/core
- Pros: Everything available from a single package.
- Cons: Unused CSS themes would inflate package size and bundle overhead for consumers who only need one theme.
- Reason for Rejection: Violates the headless philosophy of minimal runtime footprint and tree-shaking.

### Alternative 2: Maintaining @vats-editor/style as a Separate Package
- Pros: Isolated repository package dedicated to styling.
- Cons: Overhead of versioning, publishing, and synchronizing a dedicated package for simple CSS rules that duplicate standard highlight.js stylesheets.
- Reason for Rejection: Added friction and maintenance complexity with no architectural advantage over standard highlight.js stylesheets.

## Consequences
- Positive impact: Simplified repository package graph (single core package @vats-editor/core), zero extra package dependencies for end users, and instant compatibility with over 100 community highlight.js stylesheets.
- Negative impact & trade-offs: Applications previously importing from @vats-editor/style need to update their stylesheet imports to highlight.js/styles/*.css or use CSS variables.
- Follow-up work: Ensure all documentation, examples, and wiki references demonstrate standard highlight.js and CSS variable usage.
