"use client";

import { Check, ChevronDown, } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/tailwind/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/tailwind/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/tailwind/ui/popover";
import { DEFAULT_LANGUAGES, } from "@vats-editor/core";

export interface CodeLanguageSelectorProps {
  currentLanguage: string | null;
  onSelectLanguage: (language: string | null) => void;
  disabled?: boolean;
}

export const CodeLanguageSelector: React.FC<CodeLanguageSelectorProps> = ({
  currentLanguage,
  onSelectLanguage,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);

  const selectedLang =
    DEFAULT_LANGUAGES.find(
      (l) => l.value === currentLanguage || l.aliases?.includes(currentLanguage || ""),
    ) || DEFAULT_LANGUAGES[0];

  const handleSelect = (langValue: string) => {
    const lang = langValue === "plaintext" ? null : langValue;
    onSelectLanguage(lang);
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
          aria-label="Select programming language"
        >
          <span>{selectedLang?.label || "Plain Text"}</span>
          <ChevronDown className="h-3 w-3 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-52 p-0 shadow-lg">
        <Command>
          <CommandInput placeholder="Search language..." className="h-8 text-xs" />
          <CommandList className="max-h-56">
            <CommandEmpty className="py-2 text-center text-xs text-muted-foreground">
              No language found.
            </CommandEmpty>
            <CommandGroup>
              {DEFAULT_LANGUAGES.map((lang) => {
                const isSelected =
                  (currentLanguage === null && lang.value === "plaintext") ||
                  currentLanguage === lang.value ||
                  lang.aliases?.includes(currentLanguage || "");

                return (
                  <CommandItem
                    key={lang.value}
                    value={lang.label}
                    onSelect={() => handleSelect(lang.value)}
                    className="flex items-center justify-between px-2 py-1.5 text-xs cursor-pointer"
                  >
                    <span>{lang.label}</span>
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
