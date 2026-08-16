# Getting Started with Vats Editor

Vats Editor provides headless React primitives and pre-configured Tiptap extensions to construct rich text editing experiences. This guide walks through installing the package, managing dependencies, and setting up an editor instance in React and Next.js 15 App Router.

## Installation

Install the core package using your preferred package manager:

```bash
# Using pnpm (recommended)
pnpm add vats

# Using npm
npm install vats

# Using yarn
yarn add vats

# Using bun
bun add vats
```

### Peer and Companion Dependencies

Vats Editor requires React 18 or higher. If your project uses custom icons, KaTeX formulas, or syntax highlighting, add the corresponding helper libraries:

```bash
pnpm add lucide-react katex lowlight clsx tailwind-merge
pnpm add -D @types/katex
```

If you use KaTeX for math expressions, import the KaTeX stylesheet in your application root (for example, `app/layout.tsx` or `src/main.tsx`):

```tsx
import "katex/dist/katex.min.css";
```

## Basic React Integration

The editor uses a compound component architecture. Wrap your editor in `EditorRoot`, then define editor behavior inside `EditorContent`.

Here is a minimal working React component:

```tsx
import React from "react";
import {
  EditorRoot,
  EditorContent,
  StarterKit,
  Placeholder,
  TiptapLink,
  UpdatedImage,
  type JSONContent,
} from "vats";

const defaultExtensions = [
  StarterKit,
  Placeholder.configure({
    placeholder: "Press '/' for commands, or start typing...",
  }),
  TiptapLink.configure({
    HTMLAttributes: {
      class: "text-blue-500 underline cursor-pointer",
    },
  }),
  UpdatedImage,
];

const initialDocument: JSONContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Welcome to Vats Editor.",
        },
      ],
    },
  ],
};

export function SimpleEditor() {
  return (
    <EditorRoot>
      <EditorContent
        initialContent={initialDocument}
        extensions={defaultExtensions}
        className="min-h-[300px] w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm focus:outline-none dark:border-gray-800 dark:bg-gray-950"
        editorProps={{
          attributes: {
            class: "prose dark:prose-invert max-w-none focus:outline-none",
          },
        }}
        onUpdate={({ editor }) => {
          const json = editor.getJSON();
          console.log("Updated document content:", json);
        }}
      />
    </EditorRoot>
  );
}
```

## Next.js 15 App Router Integration

Because Tiptap and ProseMirror require direct browser DOM access, declare the editor component as a client component with the `"use client"` directive.

### Client Editor Component

Create an editor component at `components/editor.tsx`:

```tsx
"use client";

import { useState } from "react";
import {
  EditorRoot,
  EditorContent,
  EditorBubble,
  EditorBubbleItem,
  EditorCommand,
  EditorCommandList,
  EditorCommandItem,
  EditorCommandEmpty,
  StarterKit,
  Placeholder,
  TiptapLink,
  UpdatedImage,
  handleCommandNavigation,
  type EditorInstance,
  type JSONContent,
} from "vats";

const extensions = [
  StarterKit,
  Placeholder.configure({
    placeholder: "Type '/' to trigger the slash menu...",
  }),
  TiptapLink,
  UpdatedImage,
];

interface EditorProps {
  initialContent?: JSONContent;
  onChange?: (content: JSONContent) => void;
}

export default function NovelEditor({ initialContent, onChange }: EditorProps) {
  const [content, setContent] = useState<JSONContent | undefined>(initialContent);

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <EditorRoot>
        <EditorContent
          initialContent={content}
          extensions={extensions}
          className="min-h-[450px] w-full rounded-md border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900"
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            attributes: {
              class: "prose dark:prose-invert focus:outline-none max-w-full",
            },
          }}
          onUpdate={({ editor }: { editor: EditorInstance }) => {
            const updated = editor.getJSON();
            setContent(updated);
            onChange?.(updated);
          }}
        >
          {/* Slash Command Palette */}
          <EditorCommand className="z-50 h-auto max-h-[300px] w-64 overflow-y-auto rounded-md border border-neutral-200 bg-white p-1 shadow-md dark:border-neutral-800 dark:bg-neutral-900">
            <EditorCommandEmpty className="px-3 py-2 text-xs text-neutral-500">
              No matching commands
            </EditorCommandEmpty>
            <EditorCommandList>
              <EditorCommandItem
                value="Heading 1"
                onCommand={({ editor, range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode("heading", { level: 1 })
                    .run();
                }}
                className="flex cursor-pointer items-center rounded px-2 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Heading 1
              </EditorCommandItem>
              <EditorCommandItem
                value="Bullet List"
                onCommand={({ editor, range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .toggleBulletList()
                    .run();
                }}
                className="flex cursor-pointer items-center rounded px-2 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Bullet List
              </EditorCommandItem>
            </EditorCommandList>
          </EditorCommand>

          {/* Floating Bubble Menu */}
          <EditorBubble className="flex items-center gap-1 rounded-md border border-neutral-200 bg-white p-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
            <EditorBubbleItem
              onSelect={(editor) => {
                editor.chain().focus().toggleBold().run();
              }}
              className="rounded px-2 py-1 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Bold
            </EditorBubbleItem>
            <EditorBubbleItem
              onSelect={(editor) => {
                editor.chain().focus().toggleItalic().run();
              }}
              className="rounded px-2 py-1 text-xs italic hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Italic
            </EditorBubbleItem>
          </EditorBubble>
        </EditorContent>
      </EditorRoot>
    </div>
  );
}
```

### Page Route Usage

Consume the client component inside your page route (`app/page.tsx`):

```tsx
import NovelEditor from "@/components/editor";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-neutral-50 dark:bg-neutral-950">
      <h1 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">
        Document Editor
      </h1>
      <NovelEditor />
    </main>
  );
}
```

## Multi-Instance Isolation

In complex applications with split views, sidebars, or modal dialogs, you might render multiple editors simultaneously.

`EditorRoot` creates a scoped Jotai store and tunnel instance for its child tree. Slash command queries, active selection ranges, and event listeners remain isolated within each respective editor root.

```tsx
export function DualEditorView() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <EditorRoot>
        <EditorContent extensions={extensions} className="border p-4 rounded-md" />
      </EditorRoot>

      <EditorRoot>
        <EditorContent extensions={extensions} className="border p-4 rounded-md" />
      </EditorRoot>
    </div>
  );
}
```

Both editors run concurrently on the same page without collisions or shared state leaks.
