# Styling and Themes

Vats Editor is designed with a headless philosophy: all visual styling is controlled via Tailwind CSS classes and CSS custom properties. This guide outlines how to configure Tailwind CSS, style ProseMirror internal elements, and manage light/dark themes.

---

## 1. Tailwind CSS Configuration

Vats Editor leverages `@tailwindcss/typography` for typographic styling.

### Installation

```bash
pnpm add -D @tailwindcss/typography
```

### Tailwind Config

Add the typography plugin to your `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/vats/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        border: "hsl(var(--border))",
      },
    },
  },
  plugins: [typography],
};

export default config;
```

---

## 2. Editor Container Classes

Pass Tailwind classes to `EditorContent` using `editorProps.attributes.class`:

```tsx
<EditorContent
  editorProps={{
    attributes: {
      class:
        "prose prose-lg dark:prose-invert prose-headings:font-semibold focus:outline-none max-w-full min-h-[400px]",
    },
  }}
/>
```

### Key Typography Modifiers

- `prose`: Enables default typography spacing, headings, and lists.
- `prose-lg`: Increases base font size for longform writing.
- `dark:prose-invert`: Inverts font and border colors for dark mode.
- `prose-headings:font-semibold`: Sets weight on headings.
- `focus:outline-none`: Removes browser default focus outlines.

---

## 3. ProseMirror CSS Classes

Certain interactive features render specific ProseMirror classes that you can style in your global CSS (`globals.css`):

```css
/* Placeholder styling for empty nodes */
.ProseMirror p.is-editor-empty:first-child::before,
.ProseMirror p.is-empty::before {
  content: attr(data-placeholder);
  float: left;
  color: hsl(var(--muted-foreground));
  pointer-events: none;
  height: 0;
}

/* Focused editor state */
.ProseMirror:focus {
  outline: none;
}

/* Drag handle styling */
.drag-handle {
  position: absolute;
  cursor: grab;
  color: hsl(var(--muted-foreground));
  border-radius: 4px;
  transition: opacity 0.15s ease-in-out;
}

.drag-handle:hover {
  background-color: hsl(var(--accent));
}

/* KaTeX math formula container */
.tiptap-mathematics-render {
  display: inline-block;
  padding: 0 4px;
  border-radius: 4px;
  cursor: pointer;
}

.tiptap-mathematics-render:hover {
  background-color: hsl(var(--accent));
}
```

---

## 4. Theme Tokens (CSS Variables)

Define theme variables in your global stylesheet to support light and dark modes:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
  }

  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    --border: 240 3.7% 15.9%;
  }
}
```

---

## 5. Floating UI Styling

### Bubble Menu

Style `EditorBubble` using utility classes:

```tsx
<EditorBubble
  className="flex items-center gap-1 overflow-hidden rounded-lg border border-border bg-background p-1 shadow-lg animate-in fade-in zoom-in-95 duration-100"
>
  <button className="rounded px-2 py-1 text-xs font-medium hover:bg-accent">
    Bold
  </button>
</EditorBubble>
```

### Slash Command Palette

The slash command menu uses `cmdk` internally. You can target `aria-selected` and data attributes:

```tsx
<EditorCommand className="z-50 max-h-80 overflow-y-auto rounded-lg border border-border bg-background p-1 shadow-xl">
  <EditorCommandEmpty className="p-2 text-xs text-muted-foreground">
    No matching commands
  </EditorCommandEmpty>
  <EditorCommandList>
    <EditorCommandItem
      value="heading"
      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-accent aria-selected:bg-accent cursor-pointer"
    >
      <span>Heading</span>
    </EditorCommandItem>
  </EditorCommandList>
</EditorCommand>
```

---

## 6. Code Block Themes & Syntax Highlighting

Vats Editor code blocks support syntax highlighting via `lowlight` and standard `highlight.js` stylesheets, as well as custom CSS variables.

### Option 1: Import a Lightweight Theme Stylesheet

Import any lightweight `highlight.js` theme in your application:

```ts
// Atom One Dark (~1 KB)
import "highlight.js/styles/atom-one-dark.css";

// Tokyo Night Dark (~1 KB)
import "highlight.js/styles/tokyo-night-dark.css";

// GitHub Dark (~1 KB)
import "highlight.js/styles/github-dark.css";
```

### Option 2: Custom CSS Variable Overrides

Customize syntax tokens in your global CSS (`globals.css`):

```css
:root {
  --vats-code-bg: hsl(var(--muted) / 0.35);
  --vats-code-border: hsl(var(--border));
  --vats-code-text: hsl(var(--foreground));
  --hljs-keyword: #2563eb;
  --hljs-string: #16a34a;
  --hljs-number: #d97706;
  --hljs-comment: #6b7280;
}

.dark {
  --vats-code-bg: hsl(var(--muted) / 0.25);
  --vats-code-border: hsl(var(--border));
  --vats-code-text: hsl(var(--foreground));
  --hljs-keyword: #60a5fa;
  --hljs-string: #4ade80;
  --hljs-number: #fbbf24;
  --hljs-comment: #71717a;
}
```
