"use client";

import { Check, ChevronDown, Palette } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/tailwind/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/tailwind/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/tailwind/ui/popover";
import { THEME_PRESETS } from "@vats-editor/core";

export interface CodeThemeSelectorProps {
  currentTheme: string | null;
  onSelectTheme: (theme: string | null) => void;
  disabled?: boolean;
}

export const CodeThemeSelector: React.FC<CodeThemeSelectorProps> = ({
  currentTheme,
  onSelectTheme,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);

  const selectedTheme =
    THEME_PRESETS.find((t) => t.value === currentTheme) || THEME_PRESETS[0];

  const handleSelect = (themeValue: string) => {
    const theme = themeValue === "default" ? null : themeValue;
    onSelectTheme(theme);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={disabled}
          className="h-6 px-2 text-xs font-medium text-muted-foreground hover:text-foreground gap-1 rounded"
          aria-label="Select syntax theme"
        >
          <Palette className="h-3 w-3 opacity-60" />
          <span className="hidden sm:inline">{selectedTheme?.label || "Theme"}</span>
          <ChevronDown className="h-3 w-3 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-48 p-0 shadow-lg">
        <Command>
          <CommandList className="max-h-56">
            <CommandGroup>
              {THEME_PRESETS.map((theme) => {
                const isSelected =
                  (currentTheme === null && theme.value === "default") ||
                  currentTheme === theme.value;

                return (
                  <CommandItem
                    key={theme.value}
                    value={theme.label}
                    onSelect={() => handleSelect(theme.value)}
                    className="flex items-center justify-between px-2 py-1.5 text-xs cursor-pointer"
                  >
                    <span>{theme.label}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
