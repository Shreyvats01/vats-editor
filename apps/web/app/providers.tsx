"use client";

import { TooltipProvider } from "@/components/tailwind/ui/tooltip";
import useLocalStorage from "@/hooks/use-local-storage";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider, useTheme } from "next-themes";
import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  createContext,
} from "react";
import { Toaster } from "sonner";

export const AppContext = createContext<{
  font: string;
  setFont: Dispatch<SetStateAction<string>>;
}>({
  font: "Default",
  setFont: () => {},
});

const ToasterProvider = () => {
  const { theme } = useTheme() as {
    theme: "light" | "dark" | "system";
  };
  return <Toaster theme={theme} />;
};

export default function Providers({ children }: { children: ReactNode }) {
  const [font, setFont] = useLocalStorage<string>("vats__font", "Default");

  return (
    <ThemeProvider attribute="class" enableSystem disableTransitionOnChange defaultTheme="system">
      <TooltipProvider delayDuration={200}>
        <AppContext.Provider
          value={{
            font,
            setFont,
          }}
        >
          <ToasterProvider />
          {children}
          <Analytics />
        </AppContext.Provider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
