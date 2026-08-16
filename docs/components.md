# Component Reference

Vats Editor provides headless React components for structuring rich text editors. These primitives handle state isolation, command tunneling, floating toolbars, slash suggestion menus, and media resize overlays.

All components are imported directly from `"vats"`.

```tsx
import {
  EditorRoot,
  EditorContent,
  EditorStoreContext,
  useEditorStore,
  EditorBubble,
  EditorBubbleItem,
  EditorCommand,
  EditorCommandList,
  EditorCommandItem,
  EditorCommandEmpty,
  ImageResizer,
} from "vats";
```

---

## EditorRoot

`EditorRoot` is the top-level provider component. It instantiates a scoped Jotai store and a tunnel context for slash commands.

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `children` | `ReactNode` | Required | Child elements containing `EditorContent` and toolbar components. |
| `store` | `ReturnType<typeof createStore>` | Optional | Custom Jotai store instance. If omitted, a unique store is created automatically. |

### Example

```tsx
import { EditorRoot, EditorContent } from "vats";

export function EditorWrapper() {
  return (
    <EditorRoot>
      <EditorContent extensions={[]} />
    </EditorRoot>
  );
}
```

---

## EditorStoreContext & useEditorStore

Vats Editor exposes the internal Jotai store context and hook for accessing or manipulating editor-scoped state (such as slash command query strings and replacement ranges).

### API Signature

```tsx
import { createContext } from "react";
import type { createStore } from "jotai";

export const EditorStoreContext: React.Context<ReturnType<typeof createStore> | undefined>;

export const useEditorStore: () => ReturnType<typeof createStore>;
```

### Example

```tsx
import { useEditorStore, queryAtom } from "vats";
import { useAtomValue } from "jotai";

export function CustomSearchDebugger() {
  const store = useEditorStore();
  const query = useAtomValue(queryAtom, { store });

  return <div className="text-xs text-gray-500">Current search query: {query}</div>;
}
```

---

## EditorContent

`EditorContent` wraps Tiptap's `EditorProvider`. It mounts the editor view, registers the editor instance into internal lookup tables for tunnel routing, and accepts all standard Tiptap configuration options.

### Props

`EditorContentProps` extends `Omit<EditorProviderProps, "content">`:

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `initialContent` | `JSONContent` | Optional | Initial document content represented as ProseMirror JSON. |
| `extensions` | `Extension[]` | `[]` | Array of Tiptap extensions and plugins. |
| `editorProps` | `EditorProps` | Optional | ProseMirror editor view configuration props (DOM event handlers, attributes). |
| `className` | `string` | Optional | CSS class applied to the outermost wrapper container element. |
| `children` | `ReactNode` | Optional | Child components rendered inside the editor provider context (such as bubble menus and commands). |
| `slotBefore` | `ReactNode` | Optional | Element rendered before the editor content element inside the provider. |
| `slotAfter` | `ReactNode` | Optional | Element rendered after the editor content element (for example, `ImageResizer`). |
| `onUpdate` | `({ editor, transaction }) => void` | Optional | Callback triggered whenever document content or selection changes. |
| `onCreate` | `({ editor }) => void` | Optional | Callback fired immediately after the editor instance initializes. |

### Example

```tsx
import { EditorContent, type EditorInstance, StarterKit, ImageResizer } from "vats";

export function ContentArea() {
  return (
    <EditorContent
      extensions={[StarterKit]}
      className="border border-neutral-300 rounded p-4"
      editorProps={{
        attributes: {
          class: "prose max-w-none focus:outline-none",
        },
      }}
      slotAfter={<ImageResizer />}
      onUpdate={({ editor }: { editor: EditorInstance }) => {
        console.log("Characters:", editor.storage.characterCount?.characters());
      }}
    />
  );
}
```

---

## EditorBubble & EditorBubbleItem

`EditorBubble` is a floating formatting toolbar that appears when text is selected. It wraps `@tiptap/react/menus` `BubbleMenu`.

`EditorBubbleItem` represents an actionable button inside the bubble menu.

### EditorBubble Props

`EditorBubbleProps` extends `Omit<BubbleMenuProps, "editor">`:

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `children` | `ReactNode` | Required | Content and control buttons rendered inside the bubble toolbar. |
| `shouldShow` | `(props: { editor, state, from, to, ... }) => boolean` | Built-in | Custom visibility predicate. By default, hidden for empty selections, node selections, non-editable editors, or selected images. |
| `options` | `BubbleMenuOptions` | Optional | Positioning and floating menu configuration options. |

### EditorBubbleItem Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `children` | `ReactNode` | Required | Button label, icon, or nested elements. |
| `asChild` | `boolean` | `false` | When true, renders using Radix UI `Slot` to merge props onto the immediate child element. |
| `onSelect` | `(editor: Editor) => void` | Optional | Handler called when the item is clicked, receiving the active editor instance. |

### Example

```tsx
import { EditorBubble, EditorBubbleItem } from "vats";

export function FloatingToolbar() {
  return (
    <EditorBubble className="flex items-center gap-1 rounded border bg-white p-1 shadow-md dark:bg-neutral-900">
      <EditorBubbleItem
        onSelect={(editor) => editor.chain().focus().toggleBold().run()}
        className="px-2 py-1 text-sm font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800"
      >
        B
      </EditorBubbleItem>
      <EditorBubbleItem
        onSelect={(editor) => editor.chain().focus().toggleItalic().run()}
        className="px-2 py-1 text-sm italic hover:bg-neutral-100 dark:hover:bg-neutral-800"
      >
        I
      </EditorBubbleItem>
      <EditorBubbleItem
        onSelect={(editor) => editor.chain().focus().toggleStrike().run()}
        className="px-2 py-1 text-sm line-through hover:bg-neutral-100 dark:hover:bg-neutral-800"
      >
        S
      </EditorBubbleItem>
    </EditorBubble>
  );
}
```

---

## Slash Command Components

The slash command interface uses a tunnel mechanism to port child items declared inside your React tree into a floating Tippy popover mounted at the cursor position.

The suite consists of four coordinated components:

- `EditorCommand`: Outer container for the command palette. It mounts a hidden `cmdk` input synchronized with the user's typed filter query.
- `EditorCommandList`: Container for command items (`cmdk` List).
- `EditorCommandItem`: Individual action item. When selected, it executes an `onCommand` callback with `{ editor, range }`.
- `EditorCommandEmpty`: Fallback state displayed when no items match the typed query (`cmdk` Empty).

### EditorCommand Props

Accepts all props from `cmdk` `Command` component, including `className`, `id`, and style attributes.

### EditorCommandItem Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `string` | Optional | Search query matching term for `cmdk` filtering. |
| `onCommand` | `({ editor, range }: { editor: Editor; range: Range }) => void` | Required | Execution callback. `range` defines the exact text position of the `/` query to be deleted upon command execution. |
| `children` | `ReactNode` | Required | Content rendered inside the command item row. |

### Complete Slash Command Example

```tsx
import {
  EditorCommand,
  EditorCommandList,
  EditorCommandItem,
  EditorCommandEmpty,
} from "vats";

export function SlashMenu() {
  return (
    <EditorCommand className="z-50 h-auto max-h-[320px] w-72 overflow-y-auto rounded-lg border border-neutral-200 bg-white p-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
      <EditorCommandEmpty className="px-3 py-2 text-sm text-neutral-400">
        No results found
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
          className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <span className="font-semibold">H1</span>
          <span>Heading 1</span>
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
          className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <span>•</span>
          <span>Bullet List</span>
        </EditorCommandItem>
      </EditorCommandList>
    </EditorCommand>
  );
}
```

---

## ImageResizer

`ImageResizer` renders interactive drag-to-resize handles on active images using `react-moveable`.

When an image node is selected (`.ProseMirror-selectednode`), the component displays west and east resize handles. Upon dragging and releasing, it parses the new dimensions (supporting pixel numbers, pixel strings, and percentages) and updates the node's `width` and `height` attributes via Tiptap commands.

### Usage

Place `ImageResizer` in the `slotAfter` prop of `EditorContent`:

```tsx
import { EditorContent, ImageResizer, UpdatedImage } from "vats";

export function ResizableEditor() {
  return (
    <EditorContent
      extensions={[UpdatedImage]}
      slotAfter={<ImageResizer />}
    />
  );
}
```

To enable the selection highlight around images that `ImageResizer` targets, include this CSS in your styles:

```css
.ProseMirror img.ProseMirror-selectednode {
  outline: 3px solid #5abbf7;
}
```
