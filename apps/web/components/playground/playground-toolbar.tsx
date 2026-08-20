"use client";

import type React from "react";
import { Button } from "@/components/tailwind/ui/button";
import { Badge } from "@/components/tailwind/ui/badge";
import { Separator } from "@/components/tailwind/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/tailwind/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/tailwind/ui/tooltip";
import {
  Check,
  Clock,
  Code,
  Download,
  FileCode,
  FileDown,
  FileText,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { calculateReadingTime, downloadFile } from "@/lib/utils";

interface PlaygroundToolbarProps {
  wordsCount: number;
  charsCount: number;
  saveStatus: "Saved" | "Saving" | "Unsaved";
  markdownContent: string;
  jsonContent: string;
  htmlContent: string;
  onResetContent: () => void;
  isReadOnly?: boolean;
}

export const PlaygroundToolbar: React.FC<PlaygroundToolbarProps> = ({
  wordsCount,
  charsCount,
  saveStatus,
  markdownContent,
  jsonContent,
  htmlContent,
  onResetContent,
  isReadOnly = false,
}) => {
  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch {
      toast.error(`Failed to copy ${label}`);
    }
  };

  const handleDownloadMarkdown = () => {
    downloadFile(markdownContent, "document.md", "text/markdown");
    toast.success("Downloaded document.md");
  };

  const handleDownloadJson = () => {
    downloadFile(jsonContent, "document.json", "application/json");
    toast.success("Downloaded document.json");
  };

  const readingTime = calculateReadingTime(wordsCount);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-lg border border-border/70 bg-card/60 backdrop-blur-md text-xs shadow-2xs transition-all">
      {/* Left: Document Metrics & Reading Time Badges */}
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="font-normal text-xs gap-1 py-0.5">
          <span className="font-semibold text-foreground">{wordsCount}</span>
          <span>{wordsCount === 1 ? "word" : "words"}</span>
        </Badge>
        <Badge variant="outline" className="font-normal text-xs gap-1 py-0.5 border-border/60">
          <span className="font-semibold text-foreground">{charsCount}</span>
          <span>chars</span>
        </Badge>
        <Separator orientation="vertical" className="h-4 hidden sm:block mx-0.5" />
        <div className="hidden sm:flex items-center gap-1 text-muted-foreground text-[11px]">
          <Clock className="h-3 w-3" />
          <span>{readingTime}</span>
        </div>
      </div>

      {/* Right: Auto-save status Badge & Export DropdownMenu / Reset Button */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Save Status Badge */}
        {saveStatus === "Saving" ? (
          <Badge variant="secondary" className="gap-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin text-amber-500" />
            <span>Saving...</span>
          </Badge>
        ) : isReadOnly ? (
          <Badge variant="secondary" className="gap-1.5 py-0.5 text-[11px] font-medium text-blue-600 dark:text-blue-400">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span>Preview mode</span>
          </Badge>
        ) : (
          <Badge variant="secondary" className="gap-1.5 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            <Check className="h-3 w-3 text-emerald-500" />
            <span>Saved locally</span>
          </Badge>
        )}

        {/* Shadcn DropdownMenu for Exporting */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs font-medium gap-1 rounded-md border-border/70 bg-background/80 hover:bg-accent"
            >
              <FileDown className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Export</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 shadow-xl">
            <DropdownMenuLabel className="text-xs">Export Document</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleCopy(markdownContent, "Markdown")}
              className="gap-2 text-xs cursor-pointer"
            >
              <FileText className="h-3.5 w-3.5 text-blue-500" />
              <span>Copy Markdown</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleCopy(jsonContent, "JSON AST")}
              className="gap-2 text-xs cursor-pointer"
            >
              <Code className="h-3.5 w-3.5 text-emerald-500" />
              <span>Copy JSON AST</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleCopy(htmlContent, "HTML")}
              className="gap-2 text-xs cursor-pointer"
            >
              <FileCode className="h-3.5 w-3.5 text-purple-500" />
              <span>Copy HTML</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDownloadMarkdown}
              className="gap-2 text-xs cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-stone-500" />
              <span>Download .md</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDownloadJson}
              className="gap-2 text-xs cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-stone-500" />
              <span>Download .json</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Reset / Restore Button with Tooltip */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetContent}
              className="h-7 px-2 text-xs font-medium text-muted-foreground hover:text-foreground gap-1 rounded-md"
            >
              <RotateCcw className="h-3 w-3" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Reset canvas to master showcase document</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
