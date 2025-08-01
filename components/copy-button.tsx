"use client";

import type { JSX } from "react";

import { Check, Copy } from "lucide-react";
import { useState } from "react";



type TCopyButtonProps = {
  textToCopy: string;
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "cyan" | "pink" | "yellow" | "green";
  className?: string;
};

/**
 * @description
 * Reusable client component for copying text with visual feedback
 * Supports multiple sizes, colors, and customization options
 *
 * @param props - The component props
 * @param props.textToCopy - The text to copy to clipboard
 * @param props.label - Optional label for accessibility
 * @param props.size - Button size variant (sm, md, lg)
 * @param props.variant - Color variant (cyan, pink, yellow, green)
 * @param props.className - Additional CSS classes
 * @returns The copy button component
 */
export function CopyButton({
  textToCopy,
  label = "Copy to clipboard",
  size = "md",
  variant = "cyan",
  className = "",
}: TCopyButtonProps): JSX.Element {
  const [isCopied, setIsCopied] = useState(false);

  // Size variants
  const sizeClasses = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-3",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  // Color variants
  const colorClasses = {
    cyan: "bg-cyan-400 hover:bg-cyan-500",
    pink: "bg-pink-400 hover:bg-pink-500",
    yellow: "bg-yellow-400 hover:bg-yellow-500",
    green: "bg-green-400 hover:bg-green-500",
  };

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
    catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`${colorClasses[variant]} border-2 border-black ${sizeClasses[size]} shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-100 ${className}`}
      title={isCopied ? "Copied!" : label}
    >
      {isCopied
        ? (
            <Check className={`animate__animated animate__bounceIn ${iconSizes[size]}`} />
          )
        : (
            <Copy className={`animate__animated animate__fadeIn ${iconSizes[size]}`} />
          )}
    </button>
  );
}
