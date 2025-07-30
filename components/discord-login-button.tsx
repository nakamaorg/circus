"use client";

import type { JSX } from "react";

import { Button } from "@/components/ui/button";
import { DiscordIcon } from "@/components/ui/discord-icon";



/**
 * @description
 * Discord login button component with NeoBrutalism styling.
 * Handles Discord OAuth authentication flow.
 *
 * @returns {JSX.Element} The Discord login button component.
 */
export function DiscordLoginButton(): JSX.Element {
  const handleDiscordLogin = (): void => {
    // For now, we'll just add a comment. In a real app, this would redirect to Discord OAuth
    // window.location.href = "https://discord.com/api/oauth2/authorize?...";
  };

  return (
    <Button
      onClick={handleDiscordLogin}
      className="w-full bg-[hsl(235,86%,65%)] hover:bg-[hsl(235,86%,60%)] text-white font-black text-xl py-6 px-6 border-2 border-black shadow-shadow transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-2 active:translate-y-2 active:shadow-none transition-all duration-150 cursor-pointer"
      size="lg"
      aria-label="Sign in with Discord"
    >
      <DiscordIcon className="h-6 w-6" />
      <span>LOGIN WITH DISCORD</span>
    </Button>
  );
}
