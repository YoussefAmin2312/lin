import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Prepends Vite's base URL to asset paths so they work on GitHub Pages
const BASE = import.meta.env.BASE_URL; // "/lin/" in prod, "/" in dev
export function asset(path: string): string {
  // path starts with "/" like "/halo.jpg" → join with base
  if (path.startsWith("/")) {
    return `${BASE}${path.slice(1)}`;
  }
  return `${BASE}${path}`;
}
