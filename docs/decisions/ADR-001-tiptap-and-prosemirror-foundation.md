# ADR-001: Tiptap 3 and ProseMirror Foundation

## Status
Accepted

## Date
2026-08-16

## Context
Vats Editor requires a headless, extensible rich text editor engine capable of powering a Notion-style editing experience. Key requirements include:

1. Support for block-level slash command menus and floating bubble toolbars.
2. Reliable markdown serialization and deserialization.
3. Custom block rendering for complex nodes including mathematical equations via KaTeX, embedded tweets, code blocks with syntax highlighting, and resizable images.
4. Drag-and-drop block reorganization via global drag handles.
5. Headless architecture so that UI components, styles, and design tokens remain fully decoupled and customizable through Tailwind CSS and Radix UI.

Building directly on browser `contenteditable` APIs leads to cross-browser inconsistencies, unstable selection states, and unpredictable DOM mutations. The project required a structured document model with an established plugin architecture.

## Decision
We chose Tiptap 3 on top of ProseMirror as the core rich text editing foundation for Vats Editor, styled using Tailwind CSS and Radix UI primitives.

ProseMirror provides an immutable document model where all document modifications occur through explicit, atomic transactions. This guarantees document integrity, precise position indexing, and undo/redo history management.

Tiptap 3 wraps ProseMirror with a modern React API (`@tiptap/react`). It gives us:
1. Headless component primitives (`EditorRoot`, `EditorContent`, `EditorBubble`, `EditorCommand`) that let consumers bring their own Tailwind CSS styles.
2. An extension system to define custom nodes, marks, and ProseMirror plugins with minimal boilerplate.
3. First-party markdown support (`@tiptap/markdown`) that serializes structured documents directly to clean markdown strings.
4. Active community support and compatibility with standard ProseMirror plugins.

## Alternatives Considered

### Slate.js
Slate offers a React-first document model with customizable JSON schemas. However, past major version migrations introduced breaking schema changes. Slate also lacks built-in markdown serializers and prebuilt extensions for math, tables, and drag handles, which would have required significant custom development.

### Lexical
Lexical is a performant editor framework maintained by Meta. While promising, its ecosystem for headless community extensions (specifically KaTeX math nodes and floating slash command menus) was less mature during project inception. Its plugin architecture also required more boilerplate compared to Tiptap extensions.

### BlockNote
BlockNote is built on ProseMirror and provides an out-of-the-box Notion-style interface. However, BlockNote comes with opinionated UI components that make headless styling and deep design system integration difficult. We needed full control over every rendered DOM element and Tailwind class.

### Draft.js
Draft.js is deprecated by Meta. It lacks modern nested block support and does not support headless component patterns.

## Consequences

### Positive
- Strict document integrity through ProseMirror transactions, preventing invalid HTML states.
- Complete visual control over UI toolbars, floating menus, and suggestion popups using Tailwind CSS and Radix UI.
- Native markdown import and export via `@tiptap/markdown`.
- Access to the broader ProseMirror ecosystem, including custom decoration sets, keymaps, and input rules.

### Negative
- ProseMirror architecture (transactions, positions, schemas, decorations, and node views) carries a steep learning curve.
- Bridging ProseMirror state changes with React component lifecycles requires careful state isolation to prevent unnecessary re-renders.
