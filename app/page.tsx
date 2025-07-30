"use client";

import type { JSX } from "react";
import Image from "next/image";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DiscordLoginButton } from "../components/discord-login-button";



/**
 * @description
 * Main login page for the Circus application.
 * Features a NeoBrutalism design with Discord-only authentication.
 *
 * @returns {JSX.Element} The login page component.
 */
export default function LoginPage(): JSX.Element {
  const [isExploding, setIsExploding] = useState(false);
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleLogoClick = (): void => {
    setIsExploding(true);

    // Create confetti particles
    const newConfetti = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 50,
    }));

    setConfetti(newConfetti);

    // Reset after animation
    setTimeout(() => {
      setIsExploding(false);
      setConfetti([]);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header Section */}
        <div className="text-center mb-12 animate__animated animate__fadeInDown relative">
          <div className="flex items-center justify-center mb-4 relative">
            <div className="relative">
              <Image
                src="/logo.png"
                alt="Circus Logo"
                width={80}
                height={80}
                className={`transform -rotate-2 cursor-pointer rounded-xl border-2 border-black transition-transform duration-200 ${
                  isExploding ? "explode" : ""
                }`}
                onClick={handleLogoClick}
              />
              {/* Confetti particles */}
              {confetti.map(particle => (
                <div
                  key={particle.id}
                  className="confetti"
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                  }}
                />
              ))}
            </div>
            <h1 className="text-6xl font-black text-foreground transform rotate-2 ml-4 cursor-default">
              CIRCUS
            </h1>
          </div>
          <p className="text-2xl font-bold text-foreground transform rotate-1 cursor-default">
            Where all the clowns belong!
          </p>
        </div>

        {/* Login Card */}
        <Card variant="secondary" className="p-8 transform rotate-1 animate__animated animate__fadeInUp">
          <CardHeader className="text-center mb-8">
            <CardTitle className="text-3xl font-black text-foreground mb-2 transform -rotate-1 cursor-default">
              WELCOME BACK!
            </CardTitle>
            <p className="text-lg font-bold text-foreground cursor-default">
              Ready to join the show?
            </p>
          </CardHeader>

          <CardContent>
            {/* Discord Login */}
            <div className="space-y-6">
              <DiscordLoginButton />

              <div className="text-center">
                <p className="text-sm font-bold text-foreground cursor-default">
                  Discord authentication required
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 animate__animated animate__fadeIn animate__delay-1s">
          <p className="text-sm font-bold text-foreground transform -rotate-1 cursor-default">
            NakamaOrg Circus © 2025
          </p>
        </div>
      </div>
    </div>
  );
}
