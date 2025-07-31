import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";



/**
 * @description
 * Utility function to merge class names conditionally.
 * It combines the functionality of clsx and tailwind-merge to handle class names effectively.
 *
 * @param {...any} inputs The class names to be merged. Can be strings, objects, or arrays.
 * @returns {string} The merged class names.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
