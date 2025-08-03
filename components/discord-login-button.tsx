"use client";

import type { JSX } from "react";
import { useState } from "react";
import { Button, DiscordIcon } from "./ui";



type TDiscordLoginButtonProps = {
  signIn: () => Promise<void>;
};

/**
 * @description
 * Discord login button component.
 *
 * @param {TDiscordLoginButtonProps} props - Component props
 * @returns {JSX.Element} The Discord login button component.
 */
export function DiscordLoginButton({ signIn }: TDiscordLoginButtonProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    await signIn();
  };

  return (
    <Button
      size="lg"
      onClick={handleSignIn}
      disabled={isLoading}
      aria-label="Sign in with Discord"
      className="pulse w-full bg-[hsl(235,86%,65%)] hover:bg-[hsl(235,86%,60%)] text-white font-black text-xl py-6 px-6 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all duration-100 transform rotate-1 hover:rotate-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:hover:rotate-1"
    >
      {isLoading
        ? (
            <>
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>LOGGING IN...</span>
            </>
          )
        : (
            <>
              <DiscordIcon className="hidden sm:block h-6 w-6" />
              <span>LOGIN WITH DISCORD</span>
            </>
          )}
    </Button>
  );
}
