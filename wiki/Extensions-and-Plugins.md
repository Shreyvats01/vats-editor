# Extensions and Plugins

Vats Editor ships with a rich set of built-in Tiptap extensions and ProseMirror plugins designed for Notion-style editing. This guide covers all built-in extensions, their configuration options, and instructions for authoring custom extensions.

---

## 1. Built-in Extensions Catalog

### `StarterKit`

Provides essential document structure and inline formatting marks.

```tsx
import { StarterKit } from "@vats-editor/core";

const starterKit = StarterKit.configure({
  bulletList: {
    HTMLAttributes: { class: "list-disc list-outside leading-normal" },
  },
  orderedList: {
    HTMLAttributes: { class: "list-decimal list-outside leading-normal" },
  },
  blockquote: {
    HTMLAttributes: { class: "border-l-4 border-primary pl-4 italic" },
  },
  codeBlock: false, // Disabled if using CodeBlockLowlight instead
  code: {
    HTMLAttributes: {
      class: "rounded bg-muted px-1.5 py-0.5 font-mono text-sm",
      spellcheck: "false",
    },
  },
  dropcursor: {
    color: "#3b82f6",
    width: 2,
  },
});
```

---

### `Placeholder`

Displays dynamic placeholder hints inside empty paragraphs or documents.

```tsx
import { Placeholder } from "@vats-editor/core";

const placeholder = Placeholder.configure({
  placeholder: ({ node }) => {
    if (node.type.name === "heading") {
      return `Heading ${node.attrs.level}`;
    }
    return "Press '/' for commands...";
  },
  includeChildren: true,
});
```

---

### `UpdatedImage` and `UploadImagesPlugin`

`UpdatedImage` handles image rendering with custom width and height attributes. `UploadImagesPlugin` is a ProseMirror plugin that manages drag-and-drop file uploads with inline visual placeholders.

```tsx
import {
  UpdatedImage,
  UploadImagesPlugin,
  type UploadFn,
  handleImageDrop,
  handleImagePaste,
} from "@vats-editor/core";

// Define your custom upload handler
export const uploadFn: UploadFn = async (file, view, pos) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");
  const { url } = await res.json();
  return url;
};

// Configure the extension with the plugin
const updatedImage = UpdatedImage.extend({
  addProseMirrorPlugins() {
    return [
      UploadImagesPlugin({
        imageClass: "opacity-40 rounded-lg border",
      }),
    ];
  },
}).configure({
  allowBase64: true,
  HTMLAttributes: {
    class: "rounded-lg border shadow-sm",
  },
});
```

In your editor props, wire up paste and drop handlers:

```tsx
<EditorContent
  editorProps={{
    handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
    handleDrop: (view, event, _slice, moved) => handleImageDrop(view, event, moved, uploadFn),
  }}
/>
```

---

### `Mathematics`

Enables KaTeX formula editing and live mathematical rendering. It supports both inline equations (`$E = mc^2$`) and block formulas (`$$\int_0^\infty e^{-x^2} dx$$`).

```tsx
import { Mathematics, type MathematicsOptions } from "@vats-editor/core";

const mathematics = Mathematics.configure({
  HTMLAttributes: {
    class: "rounded px-1 text-foreground hover:bg-accent cursor-pointer",
  },
  katexOptions: {
    throwOnError: false,
    displayMode: false,
  },
});
```

---

### `Twitter`

Renders interactive Twitter / X tweet embed cards from pasted tweet URLs.

```tsx
import { Twitter, type TwitterOptions } from "@vats-editor/core";

const twitter = Twitter.configure({
  HTMLAttributes: {
    class: "not-prose my-4",
  },
  inline: false,
});
```

---

### `Youtube`

Embeds responsive YouTube videos directly in the editor.

```tsx
import { Youtube } from "@vats-editor/core";

const youtube = Youtube.configure({
  HTMLAttributes: {
    class: "rounded-lg border overflow-hidden my-4",
  },
  inline: false,
  width: 640,
  height: 480,
});
```

---

### `CodeBlock`

Provides interactive code snippets with syntax highlighting, Notion/Medium-style floating hover controls, `Tab` and `Shift-Tab` multi-line indentation, 1-click copy, and built-in code formatting.

```tsx
import { CodeBlock } from "@vats-editor/core";
import { common, createLowlight } from "lowlight";

const codeBlock = CodeBlock.configure({
  lowlight: createLowlight(common),
  enableCopy: true,
  enableFormat: true,
});
```

---

### `GlobalDragHandle` and `CustomKeymap`

- `GlobalDragHandle`: Adds a floating handle to the left of editor blocks to drag, drop, and reorder content paragraphs.
- `CustomKeymap`: Configures tab indentation in lists, enter key splitting, and keyboard shortcut overrides.

```tsx
import { GlobalDragHandle, CustomKeymap } from "@vats-editor/core";

const extensions = [
  GlobalDragHandle.configure({
    dragHandleWidth: 20,
    scrollTreshold: 100,
  }),
  CustomKeymap,
];
```

---

### `MarkdownExtension`

Provides bidirectional Markdown conversion using `tiptap-markdown`. It handles paste conversion and allows extracting the full document as Markdown with `getAllContent(editor)`.

```tsx
import { MarkdownExtension } from "@vats-editor/core";

const markdown = MarkdownExtension.configure({
  html: true,
  tightLists: true,
  bulletListMarker: "-",
  linkify: false,
  breaks: false,
});
```

---

## 2. Authoring Custom Extensions

You can extend Vats Editor by creating standard Tiptap nodes, marks, or custom slash commands.

### Creating a Custom Node

Here is an example of a callout alert box node:

```tsx
import { Node, mergeAttributes } from "@tiptap/core";

export const CalloutNode = Node.create({
  name: "callout",
  group: "block",
  content: "inline*",
  defining: true,

  addAttributes() {
    return {
      type: {
        default: "info",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="callout"]',
        getAttrs: (element) => ({
          type: (element as HTMLElement).getAttribute("data-callout-type") || "info",
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "callout",
        class: "rounded-md border-l-4 border-blue-500 bg-blue-50/50 p-4 my-4 dark:bg-blue-950/20",
      }),
      0,
    ];
  },
});
```

### Adding Items to Slash Commands

Use `createSuggestionItems` to register custom commands in your command palette:

```tsx
import { createSuggestionItems, type SuggestionItem } from "@vats-editor/core";
import { Info } from "lucide-react";

export const customSuggestionItems = createSuggestionItems([
  {
    title: "Callout",
    description: "Insert an informational callout box.",
    searchTerms: ["callout", "alert", "notice", "info"],
    icon: <Info className="h-4 w-4" />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("callout", { type: "info" })
        .run();
    },
  },
]);
```
