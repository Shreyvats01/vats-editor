import CodeBlockLowlight, {
  type CodeBlockLowlightOptions,
} from "@tiptap/extension-code-block-lowlight";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { common, createLowlight } from "lowlight";
import { CodeBlockView } from "../components/code-block-view";
import { type CodeFormatterFn, defaultFormatCode } from "../utils/code-formatter";

export interface CodeLanguage {
  label: string;
  value: string;
  aliases?: string[];
}

export interface CodeTheme {
  label: string;
  value: string;
}

export const DEFAULT_LANGUAGES: CodeLanguage[] = [
  { label: "Plain Text", value: "plaintext" },
  { label: "TypeScript", value: "typescript", aliases: ["ts", "tsx"] },
  { label: "JavaScript", value: "javascript", aliases: ["js", "jsx"] },
  { label: "Python", value: "python", aliases: ["py"] },
  { label: "HTML", value: "html", aliases: ["xml", "svg"] },
  { label: "CSS", value: "css", aliases: ["scss", "less"] },
  { label: "JSON", value: "json" },
  { label: "SQL", value: "sql" },
  { label: "Bash / Shell", value: "bash", aliases: ["sh", "zsh"] },
  { label: "Rust", value: "rust", aliases: ["rs"] },
  { label: "Go", value: "go", aliases: ["golang"] },
  { label: "C", value: "c" },
  { label: "C++", value: "cpp" },
  { label: "C#", value: "csharp", aliases: ["cs"] },
  { label: "Java", value: "java" },
  { label: "PHP", value: "php" },
  { label: "Ruby", value: "ruby", aliases: ["rb"] },
  { label: "Swift", value: "swift" },
  { label: "Kotlin", value: "kotlin", aliases: ["kt"] },
  { label: "Dart", value: "dart" },
  { label: "Markdown", value: "markdown", aliases: ["md"] },
  { label: "YAML", value: "yaml", aliases: ["yml"] },
];

export const THEME_PRESETS: CodeTheme[] = [
  { label: "Default (Adaptive)", value: "default" },
  { label: "Tokyo Night", value: "tokyo-night" },
  { label: "One Dark", value: "one-dark" },
  { label: "Dracula", value: "dracula" },
  { label: "GitHub Dark", value: "github-dark" },
  { label: "GitHub Light", value: "github-light" },
  { label: "Catppuccin", value: "catppuccin" },
];

export interface CodeBlockOptions extends CodeBlockLowlightOptions {
  languages?: CodeLanguage[];
  themes?: CodeTheme[];
  enableCopy?: boolean;
  enableFormat?: boolean;
  enableLineNumbers?: boolean;
  enableThemeSelector?: boolean;
  formatCode?: CodeFormatterFn;
}

/**
 * Enhanced CodeBlock extension for Vats Editor.
 * Includes built-in adaptive light/dark styling, interactive NodeView,
 * tab indentation handling, and pluggable code formatting.
 */
export const CodeBlock = CodeBlockLowlight.extend<CodeBlockOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      tabSize: 2,
      enableTabIndentation: false,
      languageClassPrefix: "language-",
      exitOnTripleEnter: true,
      exitOnArrowDown: true,
      defaultLanguage: null,
      lowlight: createLowlight(common),
      languages: DEFAULT_LANGUAGES,
      themes: THEME_PRESETS,
      enableCopy: true,
      enableFormat: true,
      enableLineNumbers: true,
      enableThemeSelector: true,
      formatCode: defaultFormatCode,
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      language: {
        default: null,
        parseHTML: (element) => {
          const match = element.firstElementChild?.className.match(/language-(\S+)/);
          return match ? match[1] : element.getAttribute("data-language") || null;
        },
        renderHTML: (attributes) => {
          if (!attributes.language) return {};
          return {
            "data-language": attributes.language,
          };
        },
      },
      theme: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-theme") || null,
        renderHTML: (attributes) => {
          if (!attributes.theme) return {};
          return {
            "data-theme": attributes.theme,
          };
        },
      },
      showLineNumbers: {
        default: false,
        parseHTML: (element) => element.getAttribute("data-line-numbers") === "true",
        renderHTML: (attributes) => {
          if (!attributes.showLineNumbers) return {};
          return {
            "data-line-numbers": "true",
          };
        },
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      Tab: ({ editor }) => {
        if (!editor.isActive(this.name)) {
          return false;
        }

        const { state, view } = editor;
        const { selection } = state;
        const { from, to, empty } = selection;

        if (empty) {
          // Insert 2 spaces at cursor position
          view.dispatch(state.tr.insertText("  ", from, to));
          return true;
        }

        // Multi-line indentation
        const $from = state.doc.resolve(from);
        const $to = state.doc.resolve(to);
        const startPos = $from.start();
        const endPos = $to.end();
        const text = state.doc.textBetween(startPos, endPos, "\n");
        const lines = text.split("\n");
        const indentedText = lines.map((line) => `  ${line}`).join("\n");

        view.dispatch(state.tr.insertText(indentedText, startPos, endPos));
        return true;
      },
      "Shift-Tab": ({ editor }) => {
        if (!editor.isActive(this.name)) {
          return false;
        }

        const { state, view } = editor;
        const { selection } = state;
        const $from = state.doc.resolve(selection.from);
        const $to = state.doc.resolve(selection.to);
        const startPos = $from.start();
        const endPos = $to.end();
        const text = state.doc.textBetween(startPos, endPos, "\n");
        const lines = text.split("\n");

        const dedentedText = lines
          .map((line) => {
            if (line.startsWith("  ")) return line.slice(2);
            if (line.startsWith(" ")) return line.slice(1);
            if (line.startsWith("\t")) return line.slice(1);
            return line;
          })
          .join("\n");

        view.dispatch(state.tr.insertText(dedentedText, startPos, endPos));
        return true;
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockView, { attrs: this.options.HTMLAttributes });
  },
});
