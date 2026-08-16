# Vats Editor Documentation

Vats Editor is an open-source, Notion-style WYSIWYG rich text editor framework. It combines Tiptap 3 and ProseMirror with Tailwind CSS, Radix UI primitives, and Next.js 15 support.

This documentation covers installation, component APIs, extension configurations, styling workflows, and migration paths.

## Documentation Structure

| Guide | Description |
| :--- | :--- |
| [Getting Started](./getting-started.md) | Package installation, peer dependencies, Next.js App Router setup, and minimal editor examples. |
| [Component Reference](./components.md) | API specifications for `EditorRoot`, `EditorContent`, `EditorBubble`, `EditorCommand`, and `ImageResizer`. |
| [Extension System](./extensions.md) | Configuration guides for StarterKit, KaTeX math, image uploads, Twitter embeds, and slash commands. |
| [Styling and Theming](./styling.md) | Tailwind CSS setup, ProseMirror class system, typography rules, and dark mode configuration. |
| [Migration Guide](./migration-guide.md) | Step-by-step upgrade instructions from legacy Novel or standard Tiptap installations. |

## Key Capabilities

- **Headless compound components**: Compose editor layouts using modular primitives such as `EditorRoot`, `EditorContent`, `EditorBubble`, and `EditorCommand`.
- **Multi-instance isolation**: Each `EditorRoot` provisions an independent Jotai store and command tunnel. Multiple editors on the same page operate without cross-talk or state contamination.
- **Slash command palette**: Filterable suggestions menu built on `cmdk` with full keyboard navigation.
- **Floating bubble menu**: Context-aware formatting toolbar for inline text styling, links, colors, and node transformations.
- **Image upload pipeline**: Drag-and-drop and paste uploads with animated placeholder widgets and interactive resize handles.
- **Mathematics rendering**: KaTeX-powered LaTeX rendering for mathematical formulas and symbols.
- **Rich media embeds**: Direct embeds for Twitter/X posts and YouTube videos.
- **Format versatility**: Native support for ProseMirror JSON, HTML output, and Markdown serialization via `tiptap-markdown`.
