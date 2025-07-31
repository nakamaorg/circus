"use client";

import type { JSX } from "react";
import { Button, DiscordIcon } from "./ui";



type TDiscordLoginButtonProps = {
  signIn: () => void;
};

/**
 * @description
 * Discord login button component.
 *
 * @param {TDiscordLoginButtonProps} props - Component props
 * @returns {JSX.Element} The Discord login button component.
 */
export function DiscordLoginButton({ signIn }: TDiscordLoginButtonProps): JSX.Element {
  return (
    <Button
      size="lg"
      onClick={signIn}
      aria-label="Sign in with Discord"
      className="w-full bg-[hsl(235,86%,65%)] hover:bg-[hsl(235,86%,60%)] text-white font-black text-xl py-6 px-6 border-2 border-black shadow-shadow active:translate-x-2 active:translate-y-2 active:shadow-none transition-all duration-150 cursor-pointer"
    >
      <DiscordIcon className="h-6 w-6" />
      <span>LOGIN WITH DISCORD</span>
    </Button>
  );
}
