"use client";

import type { JSX } from "react";

import { Zap } from "lucide-react";

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
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-6xl font-black text-foreground transform -rotate-2">
              CIRCUS
            </h1>
            <Zap className="h-12 w-12 ml-2 transform rotate-12" />
          </div>
          <p className="text-2xl font-bold text-foreground transform rotate-1">
            Where all clowns belong!
          </p>
        </div>

        {/* Login Card */}
        <Card variant="secondary" className="p-8 transform rotate-1">
          <CardHeader className="text-center mb-8">
            <CardTitle className="text-3xl font-black text-foreground mb-2 transform -rotate-1">
              WELCOME BACK!
            </CardTitle>
            <p className="text-lg font-bold text-foreground">
              Ready to join the circus?
            </p>
          </CardHeader>

          <CardContent>
            {/* Discord Login */}
            <div className="space-y-6">
              <DiscordLoginButton />

              <div className="text-center">
                <p className="text-sm font-bold text-foreground">
                  We only accept Discord login because we&apos;re cool like that!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm font-bold text-foreground transform -rotate-1">
            © 2025 Circus - The most brutal login experience!
          </p>
        </div>
      </div>
    </div>
  );
}
