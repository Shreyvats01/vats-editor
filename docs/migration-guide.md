# Migration Guide

This guide details the steps to migrate from legacy versions of Novel (v0.1.x / v0.2.x) or vanilla Tiptap installations to Vats Editor (`vats`).

---

## Migrating from Legacy Novel

### 1. Update Package Dependencies

Uninstall legacy `novel` and install `vats`:

```bash
# Remove legacy package
pnpm remove novel

# Install Vats Editor
pnpm add vats
```

Update import statements across your codebase:

```diff
- import { Editor } from "novel";
+ import {
+   EditorRoot,
+   EditorContent,
+   EditorBubble,
+   EditorCommand,
+   EditorCommandList,
+   EditorCommandItem,
+ } from "vats";
```

### 2. Multi-Store Isolation & Component Hierarchy

Legacy Novel used a single global Jotai store. When multiple editors were mounted on one page, search queries and cursor ranges conflicted across instances.

Vats Editor solves this by wrapping each editor instance in `EditorRoot`, which provisions an independent store and command tunnel.

#### Legacy Novel Pattern (Monolithic)

```tsx
// Legacy Novel approach
import { Editor } from "novel";

export function OldEditor() {
  return (
    <Editor
      defaultValue={{ type: "doc", content: [] }}
      onUpdate={(editor) => console.log(editor?.getJSON())}
    />
  );
}
```

#### Vats Editor Pattern (Compound Components)

```tsx
// Vats Editor approach
import {
  EditorRoot,
  EditorContent,
  StarterKit,
  Placeholder,
  TiptapLink,
  UpdatedImage,
} from "vats";

const extensions = [
  StarterKit,
  Placeholder,
  TiptapLink,
  UpdatedImage,
];

export function NewEditor() {
  return (
    <EditorRoot>
      <EditorContent
        extensions={extensions}
        initialContent={{ type: "doc", content: [] }}
        onUpdate={({ editor }) => console.log(editor.getJSON())}
      />
    </EditorRoot>
  );
}
```

### 3. Upgrading Slash Commands to `cmdk`

Legacy Novel used hardcoded suggestion arrays. Vats Editor uses composable `cmdk` primitives (`EditorCommand`, `EditorCommandList`, `EditorCommandItem`, `EditorCommandEmpty`).

```diff
- <Editor
-   slashCommands={customSlashCommands}
- />
+ <EditorRoot>
+   <EditorContent extensions={extensions}>
+     <EditorCommand className="z-50 rounded-md border bg-white p-1 shadow-md">
+       <EditorCommandEmpty className="px-2 py-1 text-sm text-gray-500">
+         No results
+       </EditorCommandEmpty>
+       <EditorCommandList>
+         {suggestionItems.map((item) => (
+           <EditorCommandItem
+             key={item.title}
+             value={item.title}
+             onCommand={({ editor, range }) => item.command({ editor, range })}
+             className="flex items-center gap-2 rounded px-2 py-1 text-sm hover:bg-gray-100"
+           >
+             {item.icon}
+             <span>{item.title}</span>
+           </EditorCommandItem>
+         ))}
+       </EditorCommandList>
+     </EditorCommand>
+   </EditorContent>
+ </EditorRoot>
```

### 4. Updating Image Upload Pipelines

Vats Editor splits image handling into two cooperative parts:

- `UpdatedImage`: Extends the Tiptap Image node to track `width` and `height` dimensions.
- `UploadImagesPlugin`: A ProseMirror plugin managing drag-and-drop, clipboard paste, and spinning upload placeholders.

Update your image extension definition:

```tsx
import {
  UpdatedImage,
  UploadImagesPlugin,
  createImageUpload,
  handleImageDrop,
  handleImagePaste,
} from "vats";

const uploadFn = createImageUpload({
  onUpload: async (file: File) => {
    const res = await uploadToStorage(file);
    return res.url;
  },
});

export const imageExtension = UpdatedImage.extend({
  addProseMirrorPlugins() {
    return [
      UploadImagesPlugin({
        imageClass: "opacity-40 rounded-lg",
      }),
    ];
  },
});
```

---

## Migrating from Vanilla Tiptap

If you are migrating a standard Tiptap 2 or Tiptap 3 setup to Vats Editor, you can continue using all your existing extensions while gaining pre-configured UI primitives.

### Comparing Tiptap `useEditor` vs Vats Editor

In standard Tiptap, you manage the `useEditor` hook, toolbar positioning, and custom popups manually:

```tsx
// Vanilla Tiptap
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export function VanillaTiptap() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Hello World</p>",
  });

  return <EditorContent editor={editor} />;
}
```

With Vats Editor, `EditorContent` encapsulates the provider lifecycle, and `EditorBubble` simplifies floating toolbar integration:

```tsx
// Vats Editor
import {
  EditorRoot,
  EditorContent,
  EditorBubble,
  EditorBubbleItem,
  StarterKit,
} from "vats";

export function VatsTiptap() {
  return (
    <EditorRoot>
      <EditorContent
        extensions={[StarterKit]}
        initialContent={{
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Hello World" }],
            },
          ],
        }}
      >
        <EditorBubble className="flex rounded border bg-white p-1 shadow">
          <EditorBubbleItem
            onSelect={(editor) => editor.chain().focus().toggleBold().run()}
          >
            Bold
          </EditorBubbleItem>
        </EditorBubble>
      </EditorContent>
    </EditorRoot>
  );
}
```

### Reusing Custom Tiptap Extensions

Any custom extension built with `@tiptap/core` works out of the box in Vats Editor. Pass your custom extensions directly into the `extensions` array prop of `EditorContent`:

```tsx
import { EditorRoot, EditorContent, StarterKit } from "vats";
import { MyCustomExtension } from "./my-custom-extension";

export function CustomEditor() {
  return (
    <EditorRoot>
      <EditorContent extensions={[StarterKit, MyCustomExtension]} />
    </EditorRoot>
  );
}
```
