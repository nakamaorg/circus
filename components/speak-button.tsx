"use client";

import type { JSX } from "react";

import { Volume2 } from "lucide-react";
import { useState } from "react";



type TSpeakButtonProps = {
  text: string;
  size?: "sm" | "md" | "lg";
  variant?: "pink" | "cyan" | "yellow" | "green";
  className?: string;
  label?: string;
};

/**
 * @description
 * Reusable client component for reading text aloud using speech synthesis
 * Supports multiple sizes, colors, and customization options
 *
 * @param props - The component props
 * @param props.text - The text to read aloud
 * @param props.size - Button size variant (sm, md, lg)
 * @param props.variant - Color variant (pink, cyan, yellow, green)
 * @param props.className - Additional CSS classes
 * @param props.label - Custom label for accessibility
 * @returns The read text button component
 */
export function SpeakButton({
  text,
  size = "lg",
  variant = "pink",
  className = "",
  label = "Read Text Aloud",
}: TSpeakButtonProps): JSX.Element {
  const [isReading, setIsReading] = useState(false);

  // Size variants
  const sizeClasses = {
    sm: "w-8 h-8 p-0",
    md: "w-10 h-10 p-0",
    lg: "w-12 h-12 p-0",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  // Color variants
  const colorClasses = {
    pink: "bg-pink-400 hover:bg-pink-500",
    cyan: "bg-cyan-400 hover:bg-cyan-500",
    yellow: "bg-yellow-400 hover:bg-yellow-500",
    green: "bg-green-400 hover:bg-green-500",
  };

  const handleRead = (): void => {
    if (!text) {
      return;
    }

    if (isReading) {
      // Stop reading
      speechSynthesis.cancel();
      setIsReading(false);
    }
    else {
      // Start reading
      const utterance = new SpeechSynthesisUtterance(text);

      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      utterance.onstart = () => setIsReading(true);
      utterance.onend = () => setIsReading(false);
      utterance.onerror = () => setIsReading(false);

      speechSynthesis.speak(utterance);
    }
  };

  return (
    <button
      onClick={handleRead}
      className={`${colorClasses[variant]} border-2 border-black ${sizeClasses[size]} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition-all duration-100 transform rotate-1 hover:rotate-0 rounded-[5px] flex items-center justify-center ${isReading ? "animate-pulse bg-pink-600" : ""} ${className}`}
      title={isReading ? "Stop Reading" : label}
    >
      <Volume2 className={`${iconSizes[size]} ${isReading ? "animate-bounce" : ""}`} />
    </button>
  );
}
