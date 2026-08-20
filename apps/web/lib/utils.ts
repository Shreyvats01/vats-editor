import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculates estimated reading time in minutes from word count.
 */
export function calculateReadingTime(words: number): string {
  if (!words || words <= 0) return "< 1 min read";
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

/**
 * Downloads a string payload as a client-side file.
 */
export function downloadFile(content: string, filename: string, mimeType = "text/plain") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
