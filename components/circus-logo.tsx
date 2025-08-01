"use client";

import type { JSX } from "react";

import confetti from "canvas-confetti";
import Image from "next/image";
import { useState } from "react";
import packageJson from "@/package.json";



/**
 * @description
 * Interactive Circus logo component with confetti animation.
 * Triggers colorful confetti animation when clicked.
 *
 * @returns {JSX.Element} The interactive logo component.
 */
export function CircusLogo(): JSX.Element {
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

  return (
    <div className="flex flex-col items-center justify-center space-y-3 relative">
      <div className="relative">
        <Image
          width={60}
          height={60}
          src="/logo.png"
          alt="Circus Logo"
          className={`transform -rotate-2 cursor-pointer rounded-xl border-2 border-black transition-transform duration-200 hover:scale-105 ${
            isExploding ? "explode" : ""
          }`}
          onClick={handleLogoClick}
        />
      </div>
      <h1 className="text-3xl font-black text-foreground transform rotate-1 cursor-default text-center">
        {packageJson.name.toUpperCase()}
      </h1>
    </div>
  );
}
