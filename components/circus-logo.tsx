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
    <div className="flex items-center justify-center mb-4 relative">
      <div className="relative">
        <Image
          width={80}
          height={80}
          src="/logo.png"
          alt="Circus Logo"
          className={`transform -rotate-2 cursor-pointer rounded-xl border-2 border-black transition-transform duration-200 hover:scale-105 ${
            isExploding ? "explode" : ""
          }`}
          onClick={handleLogoClick}
        />
      </div>
      <h1 className="text-6xl font-black text-foreground transform rotate-2 ml-4 cursor-default">
        {packageJson.name.toUpperCase()}
      </h1>
    </div>
  );
}
