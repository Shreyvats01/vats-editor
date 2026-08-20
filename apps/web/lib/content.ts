import type { JSONContent } from "@vats-editor/core";

export const defaultEditorContent: JSONContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "Vats Editor: Notion-Style WYSIWYG Framework" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "link",
              attrs: {
                href: "https://github.com/Shreyvats01/vats-editor",
                target: "_blank",
              },
            },
          ],
          text: "Vats Editor",
        },
        {
          type: "text",
          text: " is an open-source, modular rich-text editor framework built with ",
        },
        {
          type: "text",
          marks: [
            {
              type: "link",
              attrs: {
                href: "https://tiptap.dev/",
                target: "_blank",
              },
            },
          ],
          text: "Tiptap 3",
        },
        { type: "text", text: ", " },
        {
          type: "text",
          marks: [
            {
              type: "link",
              attrs: {
                href: "https://tailwindcss.com/",
                target: "_blank",
              },
            },
          ],
          text: "Tailwind CSS",
        },
        { type: "text", text: ", and " },
        {
          type: "text",
          marks: [
            {
              type: "link",
              attrs: {
                href: "https://ui.shadcn.com/",
                target: "_blank",
              },
            },
          ],
          text: "shadcn/ui",
        },
        { type: "text", text: ". Test all interactive components, node types, math formulas, and code blocks directly in this playground." },
      ],
    },
    {
      type: "blockquote",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              marks: [{ type: "bold" }],
              text: "Pro Tip: ",
            },
            {
              type: "text",
              text: "Type ",
            },
            {
              type: "text",
              marks: [{ type: "code" }],
              text: "/",
            },
            {
              type: "text",
              text: " anywhere on an empty line to trigger the Notion-style command palette, or highlight any text to reveal the floating bubble formatting menu.",
            },
          ],
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "1. Rich Text Formatting & Marks" }],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", text: "Every paragraph supports comprehensive inline marks: " },
        { type: "text", marks: [{ type: "bold" }], text: "Bold" },
        { type: "text", text: ", " },
        { type: "text", marks: [{ type: "italic" }], text: "Italic" },
        { type: "text", text: ", " },
        { type: "text", marks: [{ type: "underline" }], text: "Underline" },
        { type: "text", text: ", " },
        { type: "text", marks: [{ type: "strike" }], text: "Strikethrough" },
        { type: "text", text: ", inline " },
        { type: "text", marks: [{ type: "code" }], text: "const editor = useEditor()" },
        { type: "text", text: ", custom " },
        {
          type: "text",
          marks: [{ type: "textStyle", attrs: { color: "#2563EB" } }],
          text: "Text Colors",
        },
        { type: "text", text: ", and background highlights like " },
        {
          type: "text",
          marks: [{ type: "highlight", attrs: { color: "var(--novel-highlight-yellow)" } }],
          text: "Yellow Accent",
        },
        { type: "text", text: ", " },
        {
          type: "text",
          marks: [{ type: "highlight", attrs: { color: "var(--novel-highlight-purple)" } }],
          text: "Purple Tone",
        },
        { type: "text", text: ", and " },
        {
          type: "text",
          marks: [{ type: "highlight", attrs: { color: "var(--novel-highlight-green)" } }],
          text: "Emerald Glow",
        },
        { type: "text", text: "." },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "2. Interactive Task Checklists" }],
    },
    {
      type: "taskList",
      content: [
        {
          type: "taskItem",
          attrs: { checked: true },
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Multi-editor isolation with scoped Jotai stores per EditorRoot",
                },
              ],
            },
          ],
        },
        {
          type: "taskItem",
          attrs: { checked: true },
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Notion-style code block with language switching, copy, and syntax coloring",
                },
              ],
            },
          ],
        },
        {
          type: "taskItem",
          attrs: { checked: true },
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Native KaTeX mathematics formula editing and inline LaTeX rendering",
                },
              ],
            },
          ],
        },
        {
          type: "taskItem",
          attrs: { checked: false },
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Toggle Split Inspector mode to view real-time Markdown, JSON AST, and HTML",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "3. Notion-Style Code Blocks & Formatting" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Hover over the code block to select languages, format code structures, or copy code with 1-click.",
        },
      ],
    },
    {
      type: "codeBlock",
      attrs: { language: "typescript" },
      content: [
        {
          type: "text",
          text: 'import { EditorRoot, EditorContent, useEditor } from "@vats-editor/core";\nimport "highlight.js/styles/atom-one-dark.css";\nimport "katex/dist/katex.min.css";\n\nexport function DocumentEditor() {\n  const { editor } = useEditor();\n\n  return (\n    <EditorRoot>\n      <EditorContent\n        className="min-h-[400px] border rounded-lg p-6 bg-background"\n        onUpdate={({ editor }) => console.log(editor.getJSON())}\n      />\n    </EditorRoot>\n  );\n}',
        },
      ],
    },
    {
      type: "codeBlock",
      attrs: { language: "python" },
      content: [
        {
          type: "text",
          text: 'def serialize_document(editor_json: dict) -> str:\n    """Serializes ProseMirror JSON node tree into markdown."""\n    nodes = editor_json.get("content", [])\n    return "\\n\\n".join(node.get("text", "") for node in nodes if "text" in node)',
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "4. KaTeX Mathematical Equations" }],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", text: "Click any formula below to open the interactive LaTeX formula editor in the bubble menu." },
      ],
    },
    {
      type: "orderedList",
      attrs: { tight: true, start: 1 },
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                { type: "text", text: "Einstein Mass-Energy equivalence: " },
                {
                  type: "math",
                  attrs: {
                    latex: "E = mc^2",
                  },
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                { type: "text", text: "Time-Dependent Schrödinger Wave Equation: " },
                {
                  type: "math",
                  attrs: {
                    latex: "i\\hbar \\frac{\\partial}{\\partial t} \\Psi(\\mathbf{r},t) = \\hat{H}\\Psi(\\mathbf{r},t)",
                  },
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                { type: "text", text: "Fourier Transform formulation: " },
                {
                  type: "math",
                  attrs: {
                    latex: "\\hat{f} (\\xi)=\\int_{-\\infty}^{\\infty}f(x)e^{-2\\pi ix\\xi}dx",
                  },
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                { type: "text", text: "2x2 Linear Transformation Matrix: " },
                {
                  type: "math",
                  attrs: {
                    latex: "A=\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}, \\quad \\det(A) = ad - bc",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "5. Hierarchical Lists & Indentation" }],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "First-level bullet point item" }],
            },
            {
              type: "bulletList",
              content: [
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [{ type: "text", text: "Nested sub-bullet item (indent with Tab key)" }],
                    },
                  ],
                },
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [{ type: "text", text: "Second nested sub-bullet item (outdent with Shift-Tab)" }],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Second top-level item with seamless keyboard navigation" }],
            },
          ],
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "6. Interactive Images & Media Embeds" }],
    },
    {
      type: "image",
      attrs: {
        src: "https://public.blob.vercel-storage.com/pJrjXbdONOnAeZAZ/banner-2wQk82qTwyVgvlhTW21GIkWgqPGD2C.png",
        alt: "Vats Editor Banner",
        title: "Vats Editor Banner",
        width: null,
        height: null,
      },
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Social media embeds can be added via the slash menu: ",
        },
      ],
    },
    {
      type: "twitter",
      attrs: {
        src: "https://x.com/elonmusk/status/1800759252224729577",
      },
    },
    { type: "horizontalRule" },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "Ready to Integrate?" }],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", text: "Install the package and start building your custom editor in minutes:" },
      ],
    },
    {
      type: "codeBlock",
      attrs: { language: "bash" },
      content: [{ type: "text", text: "pnpm add @vats-editor/core" }],
    },
  ],
};
