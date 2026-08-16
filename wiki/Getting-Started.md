# Getting Started with Vats Editor

This guide covers how to install Vats Editor, configure peer dependencies, and integrate the editor into a React or Next.js 15 application.

---

## 1. Installation

Install the core package `vats` using your preferred package manager.

```bash
# Using pnpm (recommended)
pnpm add @vats-editor/core

# Using npm
npm install @vats-editor/core

# Using yarn
yarn add @vats-editor/core

# Using bun
bun add @vats-editor/core
```

### Peer Dependencies

Vats Editor requires React 18 or React 19, along with Tiptap 3 and Jotai packages:

```bash
pnpm add @tiptap/core @tiptap/react @tiptap/pm @tiptap/starter-kit jotai
```

If you plan to use math equations, syntax highlighting, or icons, install these optional packages:

```bash
pnpm add katex lowlight lucide-react class-variance-authority clsx tailwind-merge
pnpm add -D @types/katex
```

---

## 2. Minimal Setup

Here is a minimal editor setup in a client component.

```tsx
"use client";

import {
  EditorRoot,
  EditorContent,
  StarterKit,
  Placeholder,
} from "@vats-editor/core";
import { useState } from "react";

const extensions = [
  StarterKit,
  Placeholder.configure({
    placeholder: "Start typing your content...",
  }),
];

export default function MinimalEditor() {
  const [content, setContent] = useState({
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text: "Welcome to Vats Editor." }],
      },
    ],
  });

  return (
    <div className="w-full max-w-3xl mx-auto py-8">
      <EditorRoot>
        <EditorContent
          initialContent={content}
          extensions={extensions}
          className="min-h-[250px] border rounded-lg p-4 bg-background shadow-sm"
          editorProps={{
            attributes: {
              class: "prose dark:prose-invert focus:outline-none max-w-none",
            },
          }}
          onUpdate={({ editor }) => {
            setContent(editor.getJSON());
          }}
        />
      </EditorRoot>
    </div>
  );
}
```

---

## 3. Next.js 15 App Router Integration

In Next.js 15 App Router, rich text editors that interact with DOM events must run as client components.

### Step 1: Create the Editor Component

Create a dedicated client component at `components/editor.tsx`:

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
  ImageResizer,
  handleCommandNavigation,
  handleImageDrop,
  handleImagePaste,
  type JSONContent,
  type EditorInstance,
} from "@vats-editor/core";
import { useState, useEffect } from "react";

const extensions = [
  StarterKit,
  Placeholder.configure({ placeholder: "Type '/' for commands..." }),
  TiptapLink.configure({
    HTMLAttributes: {
      class: "text-blue-600 underline cursor-pointer",
    },
  }),
  UpdatedImage.configure({
    allowBase64: true,
    HTMLAttributes: {
      class: "rounded-lg border",
    },
  }),
];

export function EditorWrapper() {
  const [initialContent, setInitialContent] = useState<JSONContent | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("vats-editor-content");
    if (saved) {
      try {
        setInitialContent(JSON.parse(saved));
      } catch {
        setInitialContent(null);
      }
    }
  }, []);

  const handleUpdate = ({ editor }: { editor: EditorInstance }) => {
    const json = editor.getJSON();
    localStorage.setItem("vats-editor-content", JSON.stringify(json));
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto my-8">
      <EditorRoot>
        <EditorContent
          initialContent={initialContent ?? undefined}
          extensions={extensions}
          className="min-h-[400px] border rounded-lg p-6 bg-background shadow-md"
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            attributes: {
              class: "prose dark:prose-invert max-w-none focus:outline-none min-h-[350px]",
            },
          }}
          onUpdate={handleUpdate}
          slotAfter={<ImageResizer />}
        >
          <EditorBubble className="flex items-center gap-1 rounded-md border bg-background px-2 py-1 shadow-lg">
            <span className="text-xs font-medium text-muted-foreground">Formatting Menu</span>
          </EditorBubble>

          <EditorCommand className="z-50 max-h-60 overflow-y-auto rounded-md border bg-background p-1 shadow-lg">
            <EditorCommandEmpty className="p-2 text-sm text-muted-foreground">
              No results found
            </EditorCommandEmpty>
            <EditorCommandList>
              <EditorCommandItem
                value="Heading 1"
                onCommand={({ editor, range }) => {
                  editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run();
                }}
                className="rounded px-2 py-1 text-sm hover:bg-accent cursor-pointer"
              >
                Heading 1
              </EditorCommandItem>
              <EditorCommandItem
                value="Bullet List"
                onCommand={({ editor, range }) => {
                  editor.chain().focus().deleteRange(range).toggleBulletList().run();
                }}
                className="rounded px-2 py-1 text-sm hover:bg-accent cursor-pointer"
              >
                Bullet List
              </EditorCommandItem>
            </EditorCommandList>
          </EditorCommand>
        </EditorContent>
      </EditorRoot>
    </div>
  );
}
```

### Step 2: Use in Next.js Page

In `app/page.tsx`, import and render the client component:

```tsx
import { EditorWrapper } from "@/components/editor";

export default function Page() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Document Editor</h1>
      <EditorWrapper />
    </main>
  );
}
```

---

## 4. Working with Editor State

Vats Editor provides helpers for reading and transforming content:

- **JSON Output**: `editor.getJSON()` returns the structured ProseMirror JSON representation.
- **HTML Output**: `editor.getHTML()` returns serialized HTML.
- **Markdown Output**: `getAllContent(editor)` returns the full document formatted as Markdown.

Example saving to an API:

```tsx
import { getAllContent, type EditorInstance } from "@vats-editor/core";

async function saveDocument(editor: EditorInstance) {
  const payload = {
    json: editor.getJSON(),
    html: editor.getHTML(),
    markdown: getAllContent(editor),
  };

  await fetch("/api/documents/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
```

---

## Next Steps

- Explore the [Component API Reference](Component-API-Reference) for detailed prop definitions.
- Check [Extensions and Plugins](Extensions-and-Plugins) to configure KaTeX math, image uploads, and embeds.
- Customize colors and fonts in [Styling and Themes](Styling-and-Themes).
