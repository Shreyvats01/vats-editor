# Component API Reference

This document provides a comprehensive API reference for all React components, context providers, hooks, and utilities exported by `vats`.

---

## 1. Core Architecture Components

### `EditorRoot`

The top-level container that sets up the Jotai state store and tunnel context for an editor instance. Every editor must be wrapped in an `EditorRoot`.

```tsx
import { EditorRoot, type EditorRootProps } from "vats";
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | Required | Editor child components (`EditorContent`, toolbars, etc.) |
| `store` | `ReturnType<typeof createStore>` | `undefined` | Optional custom Jotai store instance. If omitted, `EditorRoot` creates an isolated store instance automatically. |

#### Example

```tsx
<EditorRoot>
  <EditorContent extensions={extensions} />
</EditorRoot>
```

---

### `EditorContent`

The core rendering container for the Tiptap editor view. It wraps Tiptap's `EditorProvider` and binds the active Jotai store to the editor instance.

```tsx
import { EditorContent, type EditorContentProps } from "vats";
```

#### Props

`EditorContentProps` extends `Omit<EditorProviderProps, "content">` and accepts:

| Prop | Type | Default | Description |
|---|---|---|---|
| `initialContent` | `JSONContent` | `undefined` | Initial document content represented as a ProseMirror JSON tree |
| `extensions` | `AnyExtension[]` | `[]` | Array of configured Tiptap extensions and plugins |
| `className` | `string` | `undefined` | CSS class names applied to the outer wrapper `div` |
| `editorProps` | `EditorProps` | `{}` | ProseMirror editor view properties (DOM event handlers, HTML attributes) |
| `onUpdate` | `(props: { editor: EditorInstance }) => void` | `undefined` | Callback fired whenever document content changes |
| `onCreate` | `(props: { editor: EditorInstance }) => void` | `undefined` | Callback fired when the editor view is initialized |
| `onBeforeCreate` | `(props: { editor: EditorInstance }) => void` | `undefined` | Callback fired immediately prior to editor instantiation |
| `onDestroy` | `() => void` | `undefined` | Callback fired when the editor view is destroyed |
| `editable` | `boolean` | `true` | Controls whether the editor content is editable |
| `autofocus` | `FocusPosition` | `false` | Focus position on initial mount (`"start"`, `"end"`, `"all"`, or boolean) |
| `slotBefore` | `ReactNode` | `undefined` | Node rendered immediately before the editor DOM element |
| `slotAfter` | `ReactNode` | `undefined` | Node rendered immediately after the editor DOM element (e.g., `<ImageResizer />`) |
| `children` | `ReactNode` | `undefined` | Child elements, such as `<EditorBubble>` and `<EditorCommand>` |

#### Example

```tsx
<EditorContent
  initialContent={myDocumentJson}
  extensions={defaultExtensions}
  className="prose-container"
  editorProps={{
    handleDOMEvents: {
      keydown: (_view, event) => handleCommandNavigation(event),
    },
    attributes: {
      class: "prose dark:prose-invert focus:outline-none",
    },
  }}
  onUpdate={({ editor }) => console.log(editor.getJSON())}
  slotAfter={<ImageResizer />}
>
  <EditorBubble>{/* Bubble menu content */}</EditorBubble>
  <EditorCommand>{/* Slash command content */}</EditorCommand>
</EditorContent>
```

---

## 2. Floating Menus and Slash Commands

### `EditorBubble`

A floating bubble menu rendered above selected text. It automatically handles positioning, visibility rules, and node selection checks.

```tsx
import { EditorBubble, type EditorBubbleProps } from "vats";
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | Required | Formatting buttons, selectors, and controls |
| `className` | `string` | `undefined` | CSS class names for the floating menu container |
| `options` | `BubbleMenuOptions` | `undefined` | Tippy.js positioning and animation options |
| `shouldShow` | `(props: { editor: Editor; state: EditorState }) => boolean` | Default function | Custom visibility predicate. By default, hidden if selection is empty, editor is non-editable, or node is an image. |

#### Example

```tsx
<EditorBubble className="flex gap-1 rounded-md border bg-background p-1 shadow-md">
  <button onClick={() => editor.chain().focus().toggleBold().run()}>Bold</button>
  <button onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</button>
</EditorBubble>
```

---

### `EditorBubbleItem`

A convenience wrapper for items inside the bubble menu.

```tsx
import { EditorBubbleItem } from "vats";
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | Required | Button or content element |
| `asChild` | `boolean` | `false` | If true, merges props onto the immediate child element |
| `onSelect` | `(editor: EditorInstance) => void` | `undefined` | Click handler receiving the active editor instance |

---

### `EditorCommand`

Container for the slash command popup menu. It renders via React Tunnel to position itself at the user's cursor when `/` is typed.

```tsx
import {
  EditorCommand,
  EditorCommandList,
  EditorCommandItem,
  EditorCommandEmpty,
} from "vats";
```

#### Components

- `EditorCommand`: Root command popup container based on `cmdk`.
- `EditorCommandEmpty`: Message shown when no suggestions match the user query.
- `EditorCommandList`: Container list for command suggestion rows.
- `EditorCommandItem`: Individual selectable suggestion item.

#### `EditorCommandItem` Props

| Prop | Type | Description |
|---|---|---|
| `value` | `string` | Unique search key and label for the item |
| `onCommand` | `(props: { editor: EditorInstance; range: Range }) => void` | Action executed when the item is chosen (Enter key or click) |
| `className` | `string` | CSS class names for item styling |
| `children` | `ReactNode` | Item layout (icons, title, description) |

#### Example

```tsx
<EditorCommand className="z-50 max-h-72 overflow-y-auto rounded-md border bg-background p-1 shadow-lg">
  <EditorCommandEmpty className="p-2 text-sm text-muted-foreground">
    No results
  </EditorCommandEmpty>
  <EditorCommandList>
    <EditorCommandItem
      value="Heading 2"
      onCommand={({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run();
      }}
      className="flex items-center gap-2 rounded px-2 py-1 text-sm hover:bg-accent"
    >
      <span className="font-medium">Heading 2</span>
    </EditorCommandItem>
  </EditorCommandList>
</EditorCommand>
```

---

### `ImageResizer`

A React overlay component that renders interactive drag handles on currently selected image nodes. Place this inside `slotAfter` of `EditorContent`.

```tsx
import { ImageResizer } from "vats";

<EditorContent slotAfter={<ImageResizer />} />
```

---

## 3. Hooks and State Context

### `useEditorStore`

Retrieves the isolated Jotai store assigned to the nearest `EditorRoot`.

```tsx
import { useEditorStore } from "vats";

const store = useEditorStore();
```

### `EditorStoreContext`

The React Context object holding the Jotai store reference.

```tsx
import { EditorStoreContext } from "vats";
import { useContext } from "react";

const store = useContext(EditorStoreContext);
```

### `useEditor` / `useCurrentEditor`

Re-exported from `@tiptap/react` to access the active editor instance inside child components.

```tsx
import { useCurrentEditor } from "@tiptap/react";

function CustomButton() {
  const { editor } = useCurrentEditor();
  if (!editor) return null;

  return (
    <button onClick={() => editor.chain().focus().toggleStrike().run()}>
      Strike
    </button>
  );
}
```

---

## 4. Helper Utilities

### Navigation and Event Helpers

- `handleCommandNavigation(event: KeyboardEvent): boolean`: Dispatches synthetic keyboard events (`ArrowUp`, `ArrowDown`, `Enter`) to the command list, preventing default editor cursor movement while navigating slash commands.

### Content Serialization Helpers

- `getAllContent(editor: EditorInstance): string`: Serializes the entire editor document into a clean Markdown string using the registered Markdown extension storage.
- `isValidUrl(url: string): boolean`: Validates whether a string is a well-formed HTTP/HTTPS URL.
- `getUrlFromString(str: string): string | null`: Extracts the first valid URL found within an arbitrary text string.
- `getPrevText(editor: EditorInstance, position: number): string`: Retrieves preceding text content before a specific cursor offset.

### Jotai Atoms

- `queryAtom`: Holds the active slash command search filter string.
- `rangeAtom`: Holds the ProseMirror text range to replace when a slash command is executed.
- `vatsStore` / `novelStore`: Global fallback Jotai store instances.
