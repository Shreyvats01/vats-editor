"use client";

import { defaultEditorContent } from "@/lib/content";
import {
  EditorBubble,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  type EditorInstance,
  EditorRoot,
  ImageResizer,
  type JSONContent,
  getAllContent,
  handleCommandNavigation,
  handleImageDrop,
  handleImagePaste,
} from "@vats-editor/core";
import hljs from "highlight.js";
import { useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { defaultExtensions } from "./extensions";
import { uploadFn } from "./image-upload";
import { ColorSelector } from "./selectors/color-selector";
import { LinkSelector } from "./selectors/link-selector";
import { MathSelector } from "./selectors/math-selector";
import { NodeSelector } from "./selectors/node-selector";
import { TextButtons } from "./selectors/text-buttons";
import { slashCommand, suggestionItems } from "./slash-command";
import { Separator } from "./ui/separator";

const extensions = [...defaultExtensions, slashCommand];

export interface EditorUpdatePayload {
  editor: EditorInstance;
  json: JSONContent;
  jsonString: string;
  markdown: string;
  html: string;
  words: number;
  chars: number;
}

interface TailwindAdvancedEditorProps {
  initialContent?: JSONContent;
  editable?: boolean;
  className?: string;
  onEditorUpdate?: (payload: EditorUpdatePayload) => void;
  onSaveStatusChange?: (status: "Saved" | "Saving" | "Unsaved") => void;
}

export const TailwindAdvancedEditor: React.FC<TailwindAdvancedEditorProps> = ({
  initialContent,
  editable = true,
  className,
  onEditorUpdate,
  onSaveStatusChange,
}) => {
  const [content, setContent] = useState<JSONContent | null>(null);
  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);

  // Apply Codeblock Highlighting on the HTML from editor.getHTML()
  const highlightCodeblocks = useCallback((htmlContent: string) => {
    if (typeof window === "undefined") return htmlContent;
    try {
      const doc = new DOMParser().parseFromString(htmlContent, "text/html");
      doc.querySelectorAll("pre code").forEach((el) => {
        hljs.highlightElement(el as HTMLElement);
      });
      return new XMLSerializer().serializeToString(doc);
    } catch {
      return htmlContent;
    }
  }, []);

  const debouncedUpdates = useDebouncedCallback(async (editor: EditorInstance) => {
    const json = editor.getJSON();
    const words = editor.storage.characterCount?.words?.() || 0;
    const chars = editor.storage.characterCount?.characters?.() || 0;
    const rawHtml = editor.getHTML();
    const highlightedHtml = highlightCodeblocks(rawHtml);
    const markdown = getAllContent(editor);
    const jsonString = JSON.stringify(json, null, 2);

    if (typeof window !== "undefined") {
      window.localStorage.setItem("html-content", highlightedHtml);
      window.localStorage.setItem("vats-content", JSON.stringify(json));
      window.localStorage.setItem("markdown", markdown);
    }

    onEditorUpdate?.({
      editor,
      json,
      jsonString,
      markdown,
      html: highlightedHtml,
      words,
      chars,
    });

    onSaveStatusChange?.("Saved");
  }, 400);

  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
    } else {
      const saved =
        typeof window !== "undefined"
          ? window.localStorage.getItem("vats-content") || window.localStorage.getItem("novel-content")
          : null;
      if (saved) {
        try {
          setContent(JSON.parse(saved));
        } catch {
          setContent(defaultEditorContent);
        }
      } else {
        setContent(defaultEditorContent);
      }
    }
  }, [initialContent]);

  if (!content) return null;

  return (
    <div className={`relative w-full ${className || ""}`}>
      <EditorRoot>
        <EditorContent
          initialContent={content}
          extensions={extensions}
          className="relative min-h-[500px] w-full rounded-xl border border-border/70 bg-card/80 backdrop-blur-md p-6 sm:p-10 shadow-sm transition-all focus-within:shadow-md"
          editorProps={{
            editable: () => editable,
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) => handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class:
                "prose prose-lg dark:prose-invert prose-headings:font-semibold focus:outline-none max-w-full min-h-[400px]",
            },
          }}
          onUpdate={({ editor }) => {
            onSaveStatusChange?.("Saving");
            debouncedUpdates(editor);
          }}
          slotAfter={<ImageResizer />}
        >
          {/* Notion-style Slash Command Palette */}
          {editable && (
            <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-lg border border-border/80 bg-background/95 backdrop-blur-md px-1 py-1.5 shadow-xl transition-all">
              <EditorCommandEmpty className="px-3 py-2 text-xs text-muted-foreground">
                No matching commands
              </EditorCommandEmpty>
              <EditorCommandList>
                {suggestionItems.map((item) => (
                  <EditorCommandItem
                    value={item.title}
                    onCommand={(val) => item.command(val)}
                    className="flex w-full items-center space-x-2.5 rounded-md px-2 py-1.5 text-left text-xs hover:bg-accent aria-selected:bg-accent cursor-pointer transition-colors"
                    key={item.title}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-md border border-border/60 bg-muted/50 text-foreground">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-[11px] text-muted-foreground">{item.description}</p>
                    </div>
                  </EditorCommandItem>
                ))}
              </EditorCommandList>
            </EditorCommand>
          )}

          {/* Floating Bubble Menu on selection */}
          {editable && (
            <EditorBubble className="flex w-fit max-w-[90vw] overflow-hidden rounded-lg border border-border/80 bg-background/95 backdrop-blur-md shadow-2xl p-0.5 animate-in fade-in zoom-in-95 duration-100">
              <NodeSelector open={openNode} onOpenChange={setOpenNode} />
              <Separator orientation="vertical" className="h-6 mx-0.5" />
              <LinkSelector open={openLink} onOpenChange={setOpenLink} />
              <Separator orientation="vertical" className="h-6 mx-0.5" />
              <MathSelector />
              <Separator orientation="vertical" className="h-6 mx-0.5" />
              <TextButtons />
              <Separator orientation="vertical" className="h-6 mx-0.5" />
              <ColorSelector open={openColor} onOpenChange={setOpenColor} />
            </EditorBubble>
          )}
        </EditorContent>
      </EditorRoot>
    </div>
  );
};

export default TailwindAdvancedEditor;
