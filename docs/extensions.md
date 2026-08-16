# Extension System

Vats Editor exports pre-configured Tiptap extensions, custom ProseMirror nodes, plugins, and utility helpers. These modules handle rich text formatting, media embeds, image uploads, LaTeX formulas, and syntax highlighting.

All extensions are exported from `"vats"`.

```tsx
import {
  StarterKit,
  Placeholder,
  TiptapLink,
  TiptapUnderline,
  UpdatedImage,
  UploadImagesPlugin,
  createImageUpload,
  handleImageDrop,
  handleImagePaste,
  Mathematics,
  Twitter,
  Youtube,
  CustomKeymap,
  GlobalDragHandle,
  CodeBlockLowlight,
  Command,
  renderItems,
  createSuggestionItems,
  handleCommandNavigation,
  type SuggestionItem,
  type TwitterOptions,
  type MathematicsOptions,
} from "vats";
```

---

## StarterKit

`StarterKit` bundles essential text formatting nodes and marks, including bold, italic, strike, blockquotes, lists, headings, and history (undo/redo).

### Example Configuration

```tsx
import { StarterKit } from "vats";

export const customStarterKit = StarterKit.configure({
  bulletList: {
    HTMLAttributes: {
      class: "list-disc list-outside ml-4",
    },
  },
  orderedList: {
    HTMLAttributes: {
      class: "list-decimal list-outside ml-4",
    },
  },
  blockquote: {
    HTMLAttributes: {
      class: "border-l-4 border-neutral-400 pl-4 italic",
    },
  },
  codeBlock: false, // Disabled when using CodeBlockLowlight
  horizontalRule: false,
});
```

---

## Placeholder

The `Placeholder` extension displays ghost text when the editor or a specific block is empty.

In Vats Editor, `Placeholder` is pre-configured to display dynamic prompts based on the block type. For instance, headings display "Heading 1", "Heading 2", etc., while paragraphs display "Press '/' for commands".

### Example Configuration

```tsx
import { Placeholder } from "vats";

export const customPlaceholder = Placeholder.configure({
  placeholder: ({ node }) => {
    if (node.type.name === "heading") {
      return `Heading ${node.attrs.level}`;
    }
    return "Press '/' for commands, or type to write...";
  },
  includeChildren: true,
});
```

---

## TiptapLink & TiptapUnderline

`TiptapLink` handles hyperlinks, parsing URLs and auto-linking when typed or pasted.

`TiptapUnderline` adds underline mark support (`Ctrl+U` / `Cmd+U`).

### Example Configuration

```tsx
import { TiptapLink, TiptapUnderline } from "vats";

export const linkExtension = TiptapLink.configure({
  openOnClick: false,
  HTMLAttributes: {
    class: "text-blue-600 underline underline-offset-2 hover:text-blue-800 cursor-pointer",
  },
});
```

---

## UpdatedImage & UploadImagesPlugin

Vats Editor provides an enhanced image node (`UpdatedImage`) coupled with a ProseMirror upload plugin (`UploadImagesPlugin`).

### Key Capabilities

- **Attribute Persistence**: Preserves `width` and `height` as node attributes, parsing values from CSS style properties or HTML attributes.
- **Upload Placeholders**: Inserts an animated loading widget (`.img-placeholder`) with temporary base64 preview while the file uploads to your storage provider.
- **Drop and Paste Handling**: Utility handlers parse image files from clipboard and drag-and-drop events.

### Implementation Example

```tsx
import {
  UpdatedImage,
  UploadImagesPlugin,
  createImageUpload,
  handleImageDrop,
  handleImagePaste,
} from "vats";

// Define the upload function targeting your server API or cloud bucket
const uploadFn = createImageUpload({
  validateFn: (file) => {
    if (!file.type.startsWith("image/")) {
      alert("Only image files are supported.");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit.");
      return false;
    }
    return true;
  },
  onUpload: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const { url } = await response.json();
    return url;
  },
});

export const imageExtension = UpdatedImage.extend({
  addProseMirrorPlugins() {
    return [
      UploadImagesPlugin({
        imageClass: "opacity-40 rounded-lg border border-neutral-300",
      }),
    ];
  },
}).configure({
  allowBase64: true,
  HTMLAttributes: {
    class: "rounded-lg border border-neutral-200",
  },
});
```

Attach paste and drop handlers via `editorProps`:

```tsx
<EditorContent
  extensions={[imageExtension]}
  editorProps={{
    handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
    handleDrop: (view, event, _slice, moved) =>
      handleImageDrop(view, event, moved, uploadFn),
  }}
/>
```

---

## Mathematics (KaTeX)

The `Mathematics` extension enables mathematical formula editing and rendering powered by KaTeX. Formulas are stored with a `latex` attribute.

### Stylesheet Requirement

KaTeX requires its CSS stylesheet. Import it in your root layout:

```tsx
import "katex/dist/katex.min.css";
```

### Extension Configuration

```tsx
import { Mathematics } from "vats";

export const mathExtension = Mathematics.configure({
  HTMLAttributes: {
    class: "text-neutral-900 dark:text-neutral-100 rounded px-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer",
  },
  katexOptions: {
    throwOnError: false,
  },
});
```

### Commands

- `editor.commands.setLatex({ latex: "E = mc^2" })`: Inserts or updates an inline math node at the current selection.
- `editor.commands.unsetLatex()`: Converts the active math node back into plain text.

---

## Twitter / X Embeds

The `Twitter` extension renders embedded tweets using `react-tweet`.

### Capabilities

- **Automatic URL Detection**: Pasting a tweet URL (`https://twitter.com/user/status/123...` or `https://x.com/user/status/123...`) automatically converts into an embedded tweet node.
- **Manual Command**: Insert programmatically using `editor.commands.setTweet({ src: "https://x.com/..." })`.

### Example Configuration

```tsx
import { Twitter } from "vats";

export const twitterExtension = Twitter.configure({
  addPasteHandler: true,
  inline: false,
  HTMLAttributes: {
    class: "my-4 flex justify-center",
  },
});
```

---

## YouTube Embeds

The `Youtube` extension renders responsive YouTube video players via iframes.

### Example Configuration

```tsx
import { Youtube } from "vats";

export const youtubeExtension = Youtube.configure({
  inline: false,
  HTMLAttributes: {
    class: "rounded-lg overflow-hidden my-4 border border-neutral-200 dark:border-neutral-800",
  },
});
```

---

## CustomKeymap

`CustomKeymap` provides ergonomic key bindings.

For example, pressing `Mod-a` (`Ctrl+A` or `Cmd+A`) first selects text within the current block boundary (such as a paragraph or heading). Pressing `Mod-a` a second time expands the selection to the entire document.

```tsx
import { CustomKeymap } from "vats";

export const keymapExtension = CustomKeymap;
```

---

## GlobalDragHandle

`GlobalDragHandle` adds a draggable handle beside content blocks for reordering paragraphs, headings, and lists.

```tsx
import { GlobalDragHandle } from "vats";

export const dragHandleExtension = GlobalDragHandle.configure({
  dragHandleWidth: 20,
  scrollTreshold: 100,
});
```

---

## CodeBlockLowlight

`CodeBlockLowlight` integrates syntax highlighting for code blocks using `lowlight` and highlight.js language grammars.

### Example Configuration

```tsx
import { CodeBlockLowlight } from "vats";
import { common, createLowlight } from "lowlight";

const lowlight = createLowlight(common);

export const codeBlockExtension = CodeBlockLowlight.configure({
  lowlight,
  HTMLAttributes: {
    class: "rounded-md bg-neutral-900 p-4 font-mono text-sm text-neutral-100",
  },
});
```

---

## Slash Command Setup

The slash command feature pairs the `Command` extension with helper functions:

- `renderItems`: Factory configuring the Tippy popup for the slash menu.
- `createSuggestionItems`: Type-safe helper for building suggestion item lists.
- `handleCommandNavigation`: Intercepts `ArrowUp`, `ArrowDown`, and `Enter` key events on the editor view to drive menu navigation.

### Complete Setup Example

```tsx
import {
  Command,
  renderItems,
  createSuggestionItems,
  type SuggestionItem,
} from "vats";

export const suggestionItems = createSuggestionItems([
  {
    title: "Heading 1",
    description: "Large section heading",
    icon: <span>H1</span>,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 1 })
        .run();
    },
  },
  {
    title: "Code Block",
    description: "Code snippet with syntax highlighting",
    icon: <span>{`</>`}</span>,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleCodeBlock()
        .run();
    },
  },
]);

export const slashCommandExtension = Command.configure({
  suggestion: {
    items: () => suggestionItems,
    render: renderItems,
  },
});
```
