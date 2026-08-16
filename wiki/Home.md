# Vats Editor Wiki

Welcome to the **Vats Editor** documentation wiki. Vats Editor is an open-source, Notion-style WYSIWYG rich text editor framework built with Tiptap 3, ProseMirror, Tailwind CSS, Radix UI, and Next.js 15.

This wiki provides comprehensive reference guides for installation, component APIs, built-in extensions, styling conventions, and architectural decisions.

---

## Key Capabilities

- **Slash Commands**: Instant `/` command menu for inserting block types, formatting elements, media embeds, and custom components.
- **Bubble Menu**: Floating formatting toolbar on text selection for inline styling, color highlights, links, and math equations.
- **KaTeX Mathematics**: Native LaTeX formula editing and inline rendering via KaTeX.
- **Image Pipeline**: Drag-and-drop file upload, clipboard paste handling, upload progress indicators, and interactive image resizing.
- **Rich Media Embeds**: Responsive Twitter / X tweet cards and YouTube video embeds.
- **Multi-Editor Isolation**: Scoped Jotai state management per `EditorRoot`, enabling multiple isolated editors on the same page.
- **Markdown Support**: Bidirectional Markdown parsing, serialization, copy-paste translation, and shortcuts.
- **Tailwind CSS First**: Headless architecture fully styled with standard Tailwind utility classes and `@tailwindcss/typography`.

---

## Quick Navigation

| Section | Description |
|---|---|
| [Getting Started](Getting-Started) | Installation guide, peer dependencies, and minimal Next.js 15 setup |
| [Component API Reference](Component-API-Reference) | Detailed API documentation for `EditorRoot`, `EditorContent`, `EditorBubble`, `EditorCommand`, and hooks |
| [Extensions and Plugins](Extensions-and-Plugins) | Guide to all built-in Tiptap extensions, ProseMirror plugins, and custom extension authoring |
| [Styling and Themes](Styling-and-Themes) | Tailwind CSS typography configuration, ProseMirror CSS selectors, and custom theme tokens |
| [Architecture Decisions](Architecture-Decisions) | Architectural decision records summarizing ADR-001 through ADR-004 |

---

## Quick Example

```tsx
"use client";

import {
  EditorRoot,
  EditorContent,
  EditorBubble,
  EditorCommand,
  EditorCommandList,
  EditorCommandItem,
  EditorCommandEmpty,
  StarterKit,
  Placeholder,
  TiptapLink,
  UpdatedImage,
} from "vats";
import { useState } from "react";

const extensions = [
  StarterKit,
  Placeholder.configure({ placeholder: "Type '/' for commands..." }),
  TiptapLink,
  UpdatedImage,
];

export default function SimpleEditor() {
  const [content, setContent] = useState({
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text: "Hello from Vats Editor!" }],
      },
    ],
  });

  return (
    <EditorRoot>
      <EditorContent
        initialContent={content}
        extensions={extensions}
        className="min-h-[300px] w-full rounded-md border p-4"
        editorProps={{
          attributes: {
            class: "prose max-w-none focus:outline-none",
          },
        }}
        onUpdate={({ editor }) => {
          setContent(editor.getJSON());
        }}
      >
        <EditorBubble className="flex rounded-md border bg-background p-1 shadow-md">
          <span className="text-xs text-muted-foreground">Bubble Toolbar</span>
        </EditorBubble>

        <EditorCommand className="rounded-md border bg-background p-2 shadow-md">
          <EditorCommandEmpty>No commands found</EditorCommandEmpty>
          <EditorCommandList>
            <EditorCommandItem
              value="Heading 1"
              onCommand={({ editor, range }) => {
                editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run();
              }}
            >
              Heading 1
            </EditorCommandItem>
          </EditorCommandList>
        </EditorCommand>
      </EditorContent>
    </EditorRoot>
  );
}
```

---

## Monorepo Structure

```text
vats-editor/
├── packages/
│   ├── headless/       # Core npm package ("vats")
│   │   ├── src/components/    # React components
│   │   ├── src/extensions/    # Tiptap extensions
│   │   ├── src/plugins/       # ProseMirror plugins
│   │   └── src/utils/         # State store and helper utilities
│   └── tsconfig/       # Shared TypeScript configuration
├── apps/
│   └── web/            # Next.js 15 App Router demo ("vats-next-app")
├── wiki/               # GitHub Wiki markdown sources
└── scripts/            # Repository automation and deployment scripts
```
