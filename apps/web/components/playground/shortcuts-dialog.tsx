"use client";

import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/tailwind/ui/dialog";
import { Button } from "@/components/tailwind/ui/button";
import { Keyboard } from "lucide-react";

interface ShortcutItem {
  keys: string[];
  description: string;
}

interface ShortcutCategory {
  title: string;
  items: ShortcutItem[];
}

const SHORTCUT_CATEGORIES: ShortcutCategory[] = [
  {
    title: "Markdown Auto-Formatting",
    items: [
      { keys: ["#", "Space"], description: "Heading 1" },
      { keys: ["##", "Space"], description: "Heading 2" },
      { keys: ["###", "Space"], description: "Heading 3" },
      { keys: ["-", "Space"], description: "Bullet List" },
      { keys: ["1.", "Space"], description: "Numbered List" },
      { keys: ["[]", "Space"], description: "Interactive Task List" },
      { keys: [">", "Space"], description: "Blockquote" },
      { keys: ["```", "Space"], description: "Notion-style Code Block" },
      { keys: ["---"], description: "Horizontal Divider" },
    ],
  },
  {
    title: "Rich Text Editing",
    items: [
      { keys: ["⌘ / Ctrl", "B"], description: "Toggle Bold text" },
      { keys: ["⌘ / Ctrl", "I"], description: "Toggle Italic text" },
      { keys: ["⌘ / Ctrl", "U"], description: "Toggle Underline" },
      { keys: ["⌘ / Ctrl", "E"], description: "Toggle Inline Code" },
      { keys: ["⌘ / Ctrl", "K"], description: "Open Link Selector" },
      { keys: ["Tab"], description: "Indent list item or 2-space code indent" },
      { keys: ["Shift", "Tab"], description: "Outdent list item or code block line" },
    ],
  },
  {
    title: "Slash Commands & Math",
    items: [
      { keys: ["/"], description: "Open Notion-style command palette" },
      { keys: ["$formula$"], description: "Inline KaTeX math formula" },
      { keys: ["$$formula$$"], description: "Block KaTeX math equation" },
      { keys: ["Drag & Drop"], description: "Upload and insert image" },
    ],
  },
];

import { Badge } from "@/components/tailwind/ui/badge";

export const ShortcutsDialog: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1.5 rounded-md"
        >
          <Keyboard className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Shortcuts</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <Keyboard className="h-4 w-4 text-primary" />
            Editor Shortcuts & Syntax Cheatsheet
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Vats Editor supports Markdown triggers, rich-text shortcuts, KaTeX syntax, and Notion-style slash commands.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {SHORTCUT_CATEGORIES.map((category) => (
            <div key={category.title} className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {category.title}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {category.items.map((item) => (
                  <div
                    key={item.description}
                    className="flex items-center justify-between p-2 rounded-md border border-border/50 bg-muted/30 text-xs"
                  >
                    <span className="text-foreground font-medium">{item.description}</span>
                    <div className="flex items-center gap-1">
                      {item.keys.map((k) => (
                        <Badge
                          key={k}
                          variant="outline"
                          className="px-1.5 py-0.5 text-[11px] font-mono font-medium rounded border border-border bg-background shadow-xs text-foreground"
                        >
                          {k}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
