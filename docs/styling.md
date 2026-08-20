# Styling and Theming

Vats Editor relies on a modular styling architecture combining Tailwind CSS, the `@tailwindcss/typography` plugin, and dedicated ProseMirror stylesheet rules. This structure allows full visual customization across light and dark modes.

---

## Tailwind CSS Configuration

Install `@tailwindcss/typography` and `tailwindcss-animate`:

```bash
pnpm add -D @tailwindcss/typography tailwindcss-animate
```

Update your `tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;

export default config;
```

---

## Global CSS Variables

Define theme tokens in `globals.css` using HSL color variables:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;

    /* Highlight color palette */
    --novel-highlight-default: #ffffff;
    --novel-highlight-purple: #f6f3f8;
    --novel-highlight-red: #fdebeb;
    --novel-highlight-yellow: #fbf4a2;
    --novel-highlight-blue: #c1ecf9;
    --novel-highlight-green: #acf79f;
    --novel-highlight-orange: #faebdd;
    --novel-highlight-pink: #faf1f5;
    --novel-highlight-gray: #f1f1ef;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;

    /* Dark mode highlight palette */
    --novel-highlight-default: #000000;
    --novel-highlight-purple: #3f2c4b;
    --novel-highlight-red: #5c1a1a;
    --novel-highlight-yellow: #5c4b1a;
    --novel-highlight-blue: #1a3d5c;
    --novel-highlight-green: #1a5c20;
    --novel-highlight-orange: #5c3a1a;
    --novel-highlight-pink: #5c1a3a;
    --novel-highlight-gray: #3a3a3a;
  }
}
```

---

## ProseMirror Stylesheet (`prosemirror.css`)

Tiptap renders DOM nodes inside a `.ProseMirror` container. Create a dedicated stylesheet (for example, `styles/prosemirror.css`) and import it alongside your global styles.

### 1. Base Container & Placeholders

```css
.ProseMirror {
  padding: 1.5rem;
  min-height: 200px;
}

.ProseMirror .is-editor-empty:first-child::before,
.ProseMirror .is-empty::before {
  content: attr(data-placeholder);
  float: left;
  color: hsl(var(--muted-foreground));
  pointer-events: none;
  height: 0;
}
```

### 2. Images & Upload Indicators

```css
.ProseMirror img {
  border-radius: 0.5rem;
  transition: filter 0.15s ease-in-out;
}

.ProseMirror img:hover {
  cursor: pointer;
  filter: brightness(92%);
}

.ProseMirror img.ProseMirror-selectednode {
  outline: 3px solid #5abbf7;
  filter: brightness(90%);
}

.img-placeholder {
  position: relative;
}

.img-placeholder::before {
  content: "";
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 36px;
  height: 36px;
  margin-top: -18px;
  margin-left: -18px;
  border-radius: 50%;
  border: 3px solid rgba(150, 150, 150, 0.2);
  border-top-color: hsl(var(--primary));
  animation: spinning 0.6s linear infinite;
}

@keyframes spinning {
  to {
    transform: rotate(360deg);
  }
}
```

### 3. Interactive Task Lists

```css
ul[data-type="taskList"] {
  list-style: none;
  padding: 0;
}

ul[data-type="taskList"] li {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

ul[data-type="taskList"] li > label {
  user-select: none;
  cursor: pointer;
}

ul[data-type="taskList"] li > label input[type="checkbox"] {
  appearance: none;
  background-color: hsl(var(--background));
  margin: 0;
  width: 1.15em;
  height: 1.15em;
  position: relative;
  top: 4px;
  border: 2px solid hsl(var(--border));
  border-radius: 4px;
  display: grid;
  place-content: center;
}

ul[data-type="taskList"] li > label input[type="checkbox"]:hover {
  background-color: hsl(var(--accent));
}

ul[data-type="taskList"] li > label input[type="checkbox"]::before {
  content: "";
  width: 0.65em;
  height: 0.65em;
  transform: scale(0);
  transition: 120ms transform ease-in-out;
  box-shadow: inset 1em 1em hsl(var(--primary));
  transform-origin: center;
  clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
}

ul[data-type="taskList"] li > label input[type="checkbox"]:checked::before {
  transform: scale(1);
}

ul[data-type="taskList"] li[data-checked="true"] > div > p {
  color: hsl(var(--muted-foreground));
  text-decoration: line-through;
}
```

### 4. Block Drag Handles

```css
.drag-handle {
  position: fixed;
  opacity: 1;
  transition: opacity 0.2s ease-in;
  border-radius: 0.25rem;
  width: 1.2rem;
  height: 1.5rem;
  z-index: 50;
  cursor: grab;
  background-size: calc(0.5em + 0.375rem) calc(0.5em + 0.375rem);
  background-repeat: no-repeat;
  background-position: center;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10' style='fill: rgba(0, 0, 0, 0.5)'%3E%3Cpath d='M3,2 C2.44771525,2 2,1.55228475 2,1 C2,0.44771525 2.44771525,0 3,0 C3.55228475,0 4,0.44771525 4,1 C4,1.55228475 3.55228475,2 3,2 Z M3,6 C2.44771525,6 2,5.55228475 2,5 C2,4.44771525 2.44771525,4 3,4 C3.55228475,4 4,4.44771525 4,5 C4,5.55228475 3.55228475,6 3,6 Z M3,10 C2.44771525,10 2,9.55228475 2,9 C2,8.44771525 2.44771525,8 3,8 C3.55228475,8 4,8.44771525 4,9 C4,9.55228475 3.55228475,10 3,10 Z M7,2 C6.44771525,2 6,1.55228475 6,1 C6,0.44771525 6.44771525,0 7,0 C7.55228475,0 8,0.44771525 8,1 C8,1.55228475 7.55228475,2 7,2 Z M7,6 C6.44771525,6 6,5.55228475 6,5 C6,4.44771525 6.44771525,4 7,4 C7.55228475,4 8,4.44771525 8,5 C8,5.55228475 7.55228475,6 7,6 Z M7,10 C6.44771525,10 6,9.55228475 6,9 C6,8.44771525 6.44771525,8 7,8 C7.55228475,8 8,8.44771525 8,9 C8,9.55228475 7.55228475,10 7,10 Z'%3E%3C/path%3E%3C/svg%3E");
}

.dark .drag-handle {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10' style='fill: rgba(255, 255, 255, 0.5)'%3E%3Cpath d='M3,2 C2.44771525,2 2,1.55228475 2,1 C2,0.44771525 2.44771525,0 3,0 C3.55228475,0 4,0.44771525 4,1 C4,1.55228475 3.55228475,2 3,2 Z M3,6 C2.44771525,6 2,5.55228475 2,5 C2,4.44771525 2.44771525,4 3,4 C3.55228475,4 4,4.44771525 4,5 C4,5.55228475 3.55228475,6 3,6 Z M3,10 C2.44771525,10 2,9.55228475 2,9 C2,8.44771525 2.44771525,8 3,8 C3.55228475,8 4,8.44771525 4,9 C4,9.55228475 3.55228475,10 3,10 Z M7,2 C6.44771525,2 6,1.55228475 6,1 C6,0.44771525 6.44771525,0 7,0 C7.55228475,0 8,0.44771525 8,1 C8,1.55228475 7.55228475,2 7,2 Z M7,6 C6.44771525,6 6,5.55228475 6,5 C6,4.44771525 6.44771525,4 7,4 C7.55228475,4 8,4.44771525 8,5 C8,5.55228475 7.55228475,6 7,6 Z M7,10 C6.44771525,10 6,9.55228475 6,9 C6,8.44771525 6.44771525,8 7,8 C7.55228475,8 8,8.44771525 8,9 C8,9.55228475 7.55228475,10 7,10 Z'%3E%3C/path%3E%3C/svg%3E");
}
```

### 5. Media Embeds

```css
div[data-youtube-video] > iframe {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 0.5rem;
  border: 1px solid hsl(var(--border));
}
```

### 6. Code Block Themes & Syntax Highlighting

Vats Editor code blocks support lightweight `highlight.js` theme stylesheets as well as customizable CSS variables.

#### Option 1: Import a Lightweight Theme Stylesheet

Import any standard `highlight.js` theme in your root layout or global CSS:

```ts
// Atom One Dark
import "highlight.js/styles/atom-one-dark.css";

// Tokyo Night Dark
import "highlight.js/styles/tokyo-night-dark.css";

// GitHub Dark
import "highlight.js/styles/github-dark.css";
```

#### Option 2: Customize CSS Token Variables

You can customize syntax highlighting tokens with CSS variables:

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

---

## Applying Typography Utility Classes

Pass Tailwind Typography classes to `editorProps.attributes.class` on `EditorContent`:

```tsx
<EditorContent
  editorProps={{
    attributes: {
      class: "prose prose-lg dark:prose-invert max-w-none focus:outline-none",
    },
  }}
/>
```
