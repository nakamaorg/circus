"use client";

import type { JSX } from "react";

import confetti from "canvas-confetti";
import Image from "next/image";
import { useState } from "react";
import packageJson from "@/package.json";



type TCircusLogoProps = {
  variant?: "sidebar" | "login";
  showTitle?: boolean;
};

/**
 * @description
 * Interactive Circus logo component with confetti animation.
 * Triggers colorful confetti animation when clicked.
 *
 * @param props - The component props
 * @param props.variant - The variant of the logo ("sidebar" or "login")
 * @param props.showTitle - Whether to show the title text
 * @returns {JSX.Element} The interactive logo component.
 */
export function CircusLogo({ variant = "sidebar", showTitle = true }: TCircusLogoProps): JSX.Element {
  const [isExploding, setIsExploding] = useState(false);

  const handleLogoClick = (): void => {
    setIsExploding(true);

    confetti({
      particleCount: 150,
      spread: 60,
      origin: { y: 0.3 },
      colors: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7", "#fd79a8", "#fdcb6e", "#6c5ce7", "#a29bfe"],
    });

    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 160,
        origin: { y: 0.3 },
        colors: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7", "#fd79a8", "#fdcb6e", "#6c5ce7", "#a29bfe"],
      });
    }, 250);

    setTimeout(() => {
      setIsExploding(false);
    }, 1000);
  };

  // Variant-specific styling
  const logoSize = variant === "login" ? { width: 80, height: 80 } : { width: 60, height: 60 };
  const containerClasses = variant === "login"
    ? "flex flex-col items-center justify-center space-y-4 relative"
    : "flex flex-col items-center justify-center space-y-3 relative";
  const titleClasses = variant === "login"
    ? "text-4xl font-black text-foreground transform rotate-1 cursor-default text-center"
    : "text-3xl font-black text-foreground transform rotate-1 cursor-default text-center";

  return (
    <div className={containerClasses}>
      <div className="relative">
        <Image
          width={logoSize.width}
          height={logoSize.height}
          src="/logo.png"
          alt="Circus Logo"
          className={`transform -rotate-2 cursor-pointer rounded-xl border-2 border-black transition-transform duration-200 hover:scale-105 ${
            isExploding ? "explode" : ""
          }`}
          onClick={handleLogoClick}
        />
      </div>
      {showTitle && (
        <h1 className={titleClasses}>
          {packageJson.name.toUpperCase()}
        </h1>
      )}
    </div>
  );
}
