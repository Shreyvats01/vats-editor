# Vats Editor

<p align="center">
  <strong>An open-source Notion-style WYSIWYG editor built with Tiptap 3 and Tailwind CSS.</strong>
</p>

<p align="center">
  <a href="https://github.com/Shreyvats01/vats-editor/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/Shreyvats01/vats-editor?label=license&color=blue" alt="License" />
  </a>
  <a href="https://github.com/Shreyvats01/vats-editor">
    <img src="https://img.shields.io/github/stars/Shreyvats01/vats-editor?style=social" alt="GitHub Repo stars" />
  </a>
</p>

<p align="center">
  <a href="#introduction"><strong>Introduction</strong></a> ·
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#quickstart"><strong>Quickstart</strong></a> ·
  <a href="#installation"><strong>Installation</strong></a> ·
  <a href="#architecture"><strong>Architecture</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#contributing"><strong>Contributing</strong></a> ·
  <a href="#license"><strong>License</strong></a>
</p>

<br/>

## Introduction

**Vats Editor** is a modern, headless, Notion-style WYSIWYG rich text editor framework. It couples the power and extensibility of [Tiptap 3](https://tiptap.dev/) / [ProseMirror](https://prosemirror.net/) with [Tailwind CSS](https://tailwindcss.com/) and [Radix UI](https://www.radix-ui.com/).

---

## Features

- **Slash Command Menu**: Rich, typeahead suggestion command palette powered by `cmdk`.
- **Bubble Formatting Toolbar**: Floating formatting menu with text styling, headings, lists, color pickers, and link selectors.
- **Image Uploads & Resizing**: Drag-and-drop / paste image uploads with live placeholders and interactive resizing.
- **Math & LaTeX Support**: Render mathematical symbols and equations with KaTeX (`$E=mc^2$`).
- **Rich Embeds**: Native support for Twitter/X and YouTube embeds.
- **Multi-Editor Isolation**: Fully scoped Jotai stores preventing state collisions across multiple editors on a single page.
- **Markdown Serialization**: Seamless export and import between ProseMirror JSON, HTML, and Markdown.
- **Syntax Highlighting**: Code blocks with lowlight / highlight.js support.

---

## Installation

Install the core headless package:

```bash
# Using pnpm
pnpm add @vats-editor/core

# Using npm
npm install @vats-editor/core

# Using yarn
yarn add @vats-editor/core
```

---

## Quickstart

```tsx
import {
  EditorRoot,
  EditorContent,
  EditorCommand,
  EditorCommandList,
  EditorCommandItem,
  EditorCommandEmpty,
  EditorBubble,
  StarterKit,
  Placeholder,
  TiptapLink,
  UpdatedImage,
  createSuggestionItems,
  renderItems,
  Command,
} from "@vats-editor/core";

const defaultExtensions = [
  StarterKit,
  Placeholder.configure({ placeholder: "Type '/' for commands..." }),
  TiptapLink,
  UpdatedImage,
];

export default function Editor() {
  return (
    <EditorRoot>
      <EditorContent
        extensions={defaultExtensions}
        className="min-h-[400px] w-full rounded-lg border p-6"
      >
        <EditorCommand className="z-50 rounded-md border bg-background p-2 shadow-md">
          <EditorCommandEmpty>No results</EditorCommandEmpty>
          <EditorCommandList>
            <EditorCommandItem
              onCommand={({ editor, range }) => {
                editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run();
              }}
            >
              Heading 1
            </EditorCommandItem>
          </EditorCommandList>
        </EditorCommand>

        <EditorBubble className="flex rounded-md border bg-background shadow-lg">
          {/* Bubble toolbar buttons */}
        </EditorBubble>
      </EditorContent>
    </EditorRoot>
  );
}
```

---

## Setting Up Locally

Clone the repository and install dependencies:

```bash
git clone https://github.com/Shreyvats01/vats-editor.git
cd vats-editor

# Install workspace dependencies
pnpm install

# Run the development server
pnpm dev
```

### Environment Variables (Optional)

For image uploads via Vercel Blob:
- `BLOB_READ_WRITE_TOKEN`: Your Vercel Blob read/write token.

---

## Monorepo Architecture

```text
vats-editor/
├── packages/
│   ├── headless/      # Core npm package ('vats')
│   └── tsconfig/      # Shared TypeScript configuration
├── apps/
│   └── web/           # Next.js 15 demonstration web app
├── .gemini/
│   └── skills/        # Local AI agent skills (Git Playbook, Workflows)
└── GEMINI.md          # Monorepo development & Git commit guidelines
```

---

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Editor Core**: [Tiptap 3](https://tiptap.dev/) & [ProseMirror](https://prosemirror.net/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Radix UI](https://www.radix-ui.com/)
- **State Management**: [Jotai](https://jotai.org/) & [Tunnel-rat](https://github.com/pmndrs/tunnel-rat)
- **Tooling**: [Turborepo](https://turbo.build/), [pnpm](https://pnpm.io/), [Biome](https://biomejs.dev/), [tsup](https://tsup.egoist.dev/)

---

## Contributing

1. Fork and clone the repository.
2. Create a feature branch: `git checkout -b feat/your-feature`.
3. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org/): `git commit -m 'feat(editor): add new extension'`.
4. Ensure `pnpm typecheck` and `pnpm lint` pass with zero errors.
5. Push to your branch and submit a Pull Request.

---

## License

Licensed under the [Apache-2.0 License](https://github.com/Shreyvats01/vats-editor/blob/main/LICENSE).
