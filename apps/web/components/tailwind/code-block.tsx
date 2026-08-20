"use client";

import { Check, Copy, Loader2, Sparkles } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/tailwind/ui/button";
import { CodeLanguageSelector } from "./selectors/code-language-selector";
import {
  NodeViewContent,
  type NodeViewProps,
  NodeViewWrapper,
  defaultFormatCode,
} from "@vats-editor/core";

/**
 * Minimalist Notion / Medium / Dev.to style Code Block.
 * Features a seamless surface with zero header clutter and floating hover controls.
 */
export const TailwindCodeBlock: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
  extension,
  editor,
  getPos,
}) => {
  const [copied, setCopied] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Strict cleanup on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
        copyTimerRef.current = null;
      }
    };
  }, []);

  const language = node.attrs.language || null;
  const theme = node.attrs.theme || null;

  const enableCopy = extension.options.enableCopy !== false;
  const enableFormat = extension.options.enableFormat !== false;

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const code = node.textContent;
    if (!code) return;

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Code copied to clipboard");

      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }

      copyTimerRef.current = setTimeout(() => {
        setCopied(false);
        copyTimerRef.current = null;
      }, 2000);
    } catch {
      toast.error("Failed to copy code");
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
          toast.success("Code formatted");
        }
      } else {
        toast.info("Code is already formatted");
      }
    } catch (err) {
      console.error("Code formatting failed:", err);
      toast.error("Failed to format code");
    } finally {
      setIsFormatting(false);
    }
  };

  const handleSelectLanguage = (newLanguage: string | null) => {
    updateAttributes({ language: newLanguage });
  };

  const themeClass = theme ? `theme-${theme}` : "";

  return (
    <NodeViewWrapper
      className={`vats-code-block group relative my-4 rounded-lg border border-stone-200/70 bg-stone-100/80 font-mono text-[13.5px] leading-relaxed dark:border-stone-800/80 dark:bg-[#18181b]/70 not-prose overflow-hidden transition-all ${themeClass}`.trim()}
    >
      {/* Floating Hover Controls (Notion / Medium Style) */}
      <div
        contentEditable={false}
        className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150 rounded-md bg-background/90 dark:bg-stone-900/90 backdrop-blur-md border border-border/60 px-1 py-0.5 shadow-sm select-none"
      >
        <CodeLanguageSelector
          currentLanguage={language}
          onSelectLanguage={handleSelectLanguage}
          disabled={!editor.isEditable}
        />

        {enableFormat && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleFormat}
            disabled={!editor.isEditable || isFormatting}
            title="Format code"
            aria-label="Format code"
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground rounded"
          >
            {isFormatting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
          </Button>
        )}

        {enableCopy && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            title="Copy code"
            aria-label="Copy code"
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground rounded"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
        )}
      </div>

      {/* Code Text Content Area */}
      <pre className="overflow-x-auto p-4 sm:p-5 text-[13.5px] leading-relaxed text-foreground font-mono">
        <NodeViewContent
          // biome-ignore lint/suspicious/noExplicitAny: Polymorphic element prop
          as={"code" as any}
          className={language ? `language-${language}` : undefined}
        />
      </pre>
    </NodeViewWrapper>
  );
};
