"use client";

import {
  PlaygroundHeader,
  type ViewMode,
} from "@/components/playground/playground-header";
import { PlaygroundInspector } from "@/components/playground/playground-inspector";
import { PlaygroundToolbar } from "@/components/playground/playground-toolbar";
import TailwindAdvancedEditor, {
  type EditorUpdatePayload,
} from "@/components/tailwind/advanced-editor";
import { defaultEditorContent } from "@/lib/content";
import type { JSONContent } from "@vats-editor/core";
import { useState } from "react";
import { toast } from "sonner";

export default function PlaygroundPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("editor");
  const [editorKey, setEditorKey] = useState<number>(0);
  const [currentContent, setCurrentContent] = useState<JSONContent>(defaultEditorContent);

  // Live document metrics & serialized content
  const [wordsCount, setWordsCount] = useState<number>(0);
  const [charsCount, setCharsCount] = useState<number>(0);
  const [markdownContent, setMarkdownContent] = useState<string>("");
  const [jsonContent, setJsonContent] = useState<string>(
    JSON.stringify(defaultEditorContent, null, 2),
  );
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [saveStatus, setSaveStatus] = useState<"Saved" | "Saving" | "Unsaved">("Saved");

  const handleResetContent = () => {
    setCurrentContent(defaultEditorContent);
    setJsonContent(JSON.stringify(defaultEditorContent, null, 2));
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("vats-content");
      window.localStorage.removeItem("novel-content");
    }
    setEditorKey((prev) => prev + 1);
    toast.info("Reset canvas to master showcase document");
  };

  const handleEditorUpdate = (payload: EditorUpdatePayload) => {
    setWordsCount(payload.words);
    setCharsCount(payload.chars);
    setMarkdownContent(payload.markdown);
    setJsonContent(payload.jsonString);
    setHtmlContent(payload.html);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/20 selection:text-foreground antialiased">
      {/* Top Navigation Bar */}
      <PlaygroundHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Main Canvas Section */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 flex flex-col gap-4">
        {/* Floating Toolbar & Metrics */}
        <PlaygroundToolbar
          wordsCount={wordsCount}
          charsCount={charsCount}
          saveStatus={saveStatus}
          markdownContent={markdownContent}
          jsonContent={jsonContent}
          htmlContent={htmlContent}
          onResetContent={handleResetContent}
          isReadOnly={viewMode === "readonly"}
        />

        {/* Dynamic View Layouts */}
        {viewMode === "split" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 items-start">
            <div className="w-full">
              <TailwindAdvancedEditor
                key={`editor-${editorKey}`}
                initialContent={currentContent}
                editable={true}
                onEditorUpdate={handleEditorUpdate}
                onSaveStatusChange={setSaveStatus}
              />
            </div>
            <div className="w-full h-[calc(100vh-180px)] sticky top-20">
              <PlaygroundInspector
                markdown={markdownContent}
                json={jsonContent}
                html={htmlContent}
              />
            </div>
          </div>
        ) : (
          <div className="w-full max-w-4xl mx-auto flex-1">
            <TailwindAdvancedEditor
              key={`editor-${editorKey}`}
              initialContent={currentContent}
              editable={viewMode !== "readonly"}
              onEditorUpdate={handleEditorUpdate}
              onSaveStatusChange={setSaveStatus}
            />
          </div>
        )}
      </main>
    </div>
  );
}
