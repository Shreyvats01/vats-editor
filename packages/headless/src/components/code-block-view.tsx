import { NodeViewContent, type NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { defaultFormatCode } from "../utils/code-formatter";

export interface CodeBlockViewProps extends NodeViewProps {}

/**
 * Minimalist, memory-safe React NodeView for Vats Editor CodeBlock (Notion / Medium style).
 */
export const CodeBlockView: React.FC<CodeBlockViewProps> = ({
  node,
  updateAttributes,
  extension,
  editor,
  getPos,
}) => {
  const [copied, setCopied] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up timers on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
        copyTimerRef.current = null;
      }
    };
  }, []);

  const language = node.attrs.language || "plaintext";
  const theme = node.attrs.theme || "default";

  const enableCopy = extension.options.enableCopy !== false;
  const enableFormat = extension.options.enableFormat !== false;
  const languages: { label: string; value: string }[] = extension.options.languages || [];

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const code = node.textContent;
    if (!code) return;

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);

      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }

      copyTimerRef.current = setTimeout(() => {
        setCopied(false);
        copyTimerRef.current = null;
      }, 2000);

      // Trigger custom callback if provided
      // biome-ignore lint/suspicious/noExplicitAny: Custom callback
      if (typeof window !== "undefined" && typeof (window as any).vatsOnCodeCopied === "function") {
        // biome-ignore lint/suspicious/noExplicitAny: Custom callback
        (window as any).vatsOnCodeCopied(code, language);
      }
    } catch {
      // Silently catch clipboard denial
    }
  };

  const handleFormat = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!editor.isEditable || isFormatting) return;

    const code = node.textContent;
    if (!code || !code.trim()) return;

    const formatter = extension.options.formatCode || defaultFormatCode;

    try {
      setIsFormatting(true);
      const formatted = await formatter(code, language);

      if (formatted !== code && typeof getPos === "function") {
        const pos = getPos();
        if (typeof pos === "number") {
          const from = pos + 1;
          const to = pos + node.nodeSize - 1;
          editor.commands.insertContentAt({ from, to }, formatted);
        }
      }
    } catch (err) {
      console.error("Vats Editor formatting error:", err);
    } finally {
      setIsFormatting(false);
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value === "plaintext" ? null : e.target.value;
    updateAttributes({ language: newLang });
  };

  const themeClass = theme && theme !== "default" ? `theme-${theme}` : "";

  return (
    <NodeViewWrapper
      className={`vats-code-block not-prose ${themeClass}`.trim()}
      style={{ position: "relative" }}
    >
      {/* Floating Hover Controls */}
      <div
        className="vats-code-block-controls"
        contentEditable={false}
        style={{
          position: "absolute",
          top: "0.5rem",
          right: "0.5rem",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
          userSelect: "none",
        }}
      >
        <select
          value={language}
          onChange={handleLanguageChange}
          disabled={!editor.isEditable}
          aria-label="Select code language"
          className="vats-code-select"
          style={{
            background: "transparent",
            border: "none",
            color: "inherit",
            fontSize: "0.75rem",
            cursor: "pointer",
            outline: "none",
            opacity: 0.8,
          }}
        >
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>

        {enableFormat && (
          <button
            type="button"
            onClick={handleFormat}
            disabled={!editor.isEditable || isFormatting}
            title="Format code"
            aria-label="Format code"
            style={{
              background: "transparent",
              border: "none",
              color: "inherit",
              padding: "2px 6px",
              borderRadius: "4px",
              cursor: editor.isEditable ? "pointer" : "default",
              fontSize: "0.75rem",
              opacity: isFormatting ? 0.5 : 0.8,
            }}
          >
            {isFormatting ? "..." : "Format"}
          </button>
        )}

        {enableCopy && (
          <button
            type="button"
            onClick={handleCopy}
            title="Copy code"
            aria-label="Copy code"
            style={{
              background: "transparent",
              border: "none",
              color: "inherit",
              padding: "2px 6px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.75rem",
              opacity: 0.8,
            }}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>

      <pre style={{ margin: 0, padding: "1rem 1.25rem" }}>
        <NodeViewContent
          // biome-ignore lint/suspicious/noExplicitAny: Polymorphic element prop
          as={"code" as any}
          className={language && language !== "plaintext" ? `language-${language}` : undefined}
        />
      </pre>
    </NodeViewWrapper>
  );
};
