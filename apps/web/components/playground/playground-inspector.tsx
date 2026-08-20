"use client";

import type React from "react";
import { useState } from "react";
import { Check, Code2, Copy, FileCode, FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/tailwind/ui/button";
import { Card } from "@/components/tailwind/ui/card";
import { ScrollArea } from "@/components/tailwind/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/tailwind/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/tailwind/ui/tooltip";

interface PlaygroundInspectorProps {
  markdown: string;
  json: string;
  html: string;
}

type TabType = "markdown" | "json" | "html";

export const PlaygroundInspector: React.FC<PlaygroundInspectorProps> = ({
  markdown,
  json,
  html,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("markdown");
  const [copied, setCopied] = useState(false);

  const getActiveContent = () => {
    switch (activeTab) {
      case "markdown":
        return markdown;
      case "json":
        return json;
      case "html":
        return html;
    }
  };

  const handleCopy = async () => {
    const content = getActiveContent();
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success(`Copied ${activeTab.toUpperCase()} to clipboard!`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy content");
    }
  };

  return (
    <Card className="flex flex-col h-full rounded-xl border border-border/70 bg-card/60 backdrop-blur-md overflow-hidden shadow-xs">
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as TabType)}
        className="flex flex-col h-full"
      >
        {/* Header & Shadcn TabsList */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border/60 bg-muted/40 shrink-0">
          <TabsList className="h-8 p-0.5 bg-muted/50 border border-border/60">
            <TabsTrigger value="markdown" className="h-7 px-2.5 text-xs gap-1.5">
              <FileText className="h-3.5 w-3.5 text-blue-500" />
              <span>Markdown</span>
            </TabsTrigger>
            <TabsTrigger value="json" className="h-7 px-2.5 text-xs gap-1.5">
              <Code2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>JSON AST</span>
            </TabsTrigger>
            <TabsTrigger value="html" className="h-7 px-2.5 text-xs gap-1.5">
              <FileCode className="h-3.5 w-3.5 text-purple-500" />
              <span>HTML</span>
            </TabsTrigger>
          </TabsList>

          {/* Copy Button with Tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-7 px-2 text-xs font-medium text-muted-foreground hover:text-foreground gap-1 rounded-md"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Copy {activeTab.toUpperCase()} to clipboard</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Code Viewer Tab Contents with ScrollArea */}
        <TabsContent value="markdown" className="flex-1 mt-0 p-0 overflow-hidden">
          <ScrollArea className="h-full p-4 font-mono text-[12px] leading-relaxed text-foreground bg-background/50 selection:bg-primary/20">
            <pre className="whitespace-pre-wrap break-all select-text font-mono">
              <code>{markdown || "// Empty markdown output"}</code>
            </pre>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="json" className="flex-1 mt-0 p-0 overflow-hidden">
          <ScrollArea className="h-full p-4 font-mono text-[12px] leading-relaxed text-foreground bg-background/50 selection:bg-primary/20">
            <pre className="whitespace-pre-wrap break-all select-text font-mono">
              <code>{json || "{}"}</code>
            </pre>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="html" className="flex-1 mt-0 p-0 overflow-hidden">
          <ScrollArea className="h-full p-4 font-mono text-[12px] leading-relaxed text-foreground bg-background/50 selection:bg-primary/20">
            <pre className="whitespace-pre-wrap break-all select-text font-mono">
              <code>{html || "<!-- Empty HTML output -->"}</code>
            </pre>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
