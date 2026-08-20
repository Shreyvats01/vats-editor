"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/tailwind/ui/button";
import { Badge } from "@/components/tailwind/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/tailwind/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/tailwind/ui/tooltip";
import {
  Check,
  Columns,
  Copy,
  Eye,
  Github,
  Monitor,
  Moon,
  PenTool,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { ShortcutsDialog } from "./shortcuts-dialog";

export type ViewMode = "editor" | "split" | "readonly";

interface PlaygroundHeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const PlaygroundHeader: React.FC<PlaygroundHeaderProps> = ({
  viewMode,
  onViewModeChange,
}) => {
  const { theme, setTheme } = useTheme();
  const [copiedInstall, setCopiedInstall] = useState(false);

  const handleCopyInstall = async () => {
    try {
      await navigator.clipboard.writeText("pnpm add @vats-editor/core");
      setCopiedInstall(true);
      toast.success("Install command copied to clipboard!");
      setTimeout(() => setCopiedInstall(false), 2000);
    } catch {
      toast.error("Failed to copy install command");
    }
  };

  const cycleTheme = () => {
    if (theme === "dark") setTheme("light");
    else if (theme === "light") setTheme("system");
    else setTheme("dark");
  };

  const renderThemeIcon = () => {
    if (theme === "dark") return <Moon className="h-3.5 w-3.5" />;
    if (theme === "light") return <Sun className="h-3.5 w-3.5" />;
    return <Monitor className="h-3.5 w-3.5" />;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-6 gap-3">
        {/* Brand & Version Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground font-semibold text-xs shadow-xs">
              V
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm tracking-tight text-foreground">
                Vats Editor
              </span>
              <Badge variant="outline" className="text-[10px] font-medium py-0 px-1.5 h-4 text-muted-foreground border-border/60">
                v1.0.0
              </Badge>
            </div>
          </div>

          {/* Quick Install Pill */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyInstall}
                className="hidden md:flex h-7 px-2.5 items-center gap-1.5 font-mono text-[11px] text-muted-foreground hover:text-foreground border-border/70 bg-muted/40 hover:bg-muted shadow-2xs group cursor-pointer"
              >
                <span className="text-primary font-medium">$</span>
                <span>pnpm add @vats-editor/core</span>
                {copiedInstall ? (
                  <Check className="h-3 w-3 text-emerald-500 shrink-0 ml-0.5" />
                ) : (
                  <Copy className="h-3 w-3 opacity-50 group-hover:opacity-100 shrink-0 ml-0.5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Click to copy installation command</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Center: View Mode Segmented Tabs */}
        <div className="flex items-center">
          <Tabs
            value={viewMode}
            onValueChange={(val) => onViewModeChange(val as ViewMode)}
            className="h-8"
          >
            <TabsList className="h-8 p-0.5 bg-muted/50 border border-border/70">
              <TabsTrigger value="editor" className="h-7 px-2.5 text-xs gap-1.5">
                <PenTool className="h-3 w-3" />
                <span className="hidden sm:inline">Editor</span>
              </TabsTrigger>
              <TabsTrigger value="split" className="h-7 px-2.5 text-xs gap-1.5">
                <Columns className="h-3 w-3" />
                <span className="hidden sm:inline">Split Inspector</span>
              </TabsTrigger>
              <TabsTrigger value="readonly" className="h-7 px-2.5 text-xs gap-1.5">
                <Eye className="h-3 w-3" />
                <span className="hidden sm:inline">Preview</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Right Tools & Links */}
        <div className="flex items-center gap-1.5 shrink-0">
          <ShortcutsDialog />

          {/* Theme Switcher Button with Tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={cycleTheme}
                className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-md"
                aria-label="Toggle visual theme"
              >
                {renderThemeIcon()}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Toggle theme ({theme || "system"})</p>
            </TooltipContent>
          </Tooltip>

          {/* GitHub Star Link with Tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="h-8 px-2.5 text-xs gap-1.5 rounded-md border-border/80 bg-background/60 hover:bg-accent"
              >
                <a
                  href="https://github.com/Shreyvats01/vats-editor"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline font-medium">GitHub</span>
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>View source on GitHub</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </header>
  );
};
