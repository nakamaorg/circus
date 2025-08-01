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
    sm: "w-8 h-8 p-0",
    md: "w-10 h-10 p-0",
    lg: "w-12 h-12 p-0",
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
    await navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`relative ${colorClasses[variant]} border-2 border-black ${sizeClasses[size]} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition-all duration-100 rounded-[5px] flex items-center justify-center group/tooltip ${className}`}
    >
      {isCopied
        ? (
            <Check className={`animate__animated animate__bounceIn ${iconSizes[size]}`} />
          )
        : (
            <Copy className={`animate__animated animate__fadeIn ${iconSizes[size]}`} />
          )}
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap z-[9999] pointer-events-none">
        {isCopied ? "Copied!" : label}
        {/* Tooltip arrow */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
      </div>
    </button>
  );
}
