import type { JSX } from "react";

import { CircusLogo } from "@/components/circus-logo";
import { DiscordLoginButton } from "@/components/discord-login-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signIn } from "@/lib/helpers/auth.helper";



/**
 * @description
 * Main login page for the Circus application.
 * Features a NeoBrutalism design with Discord-only authentication.
 *
 * @returns {JSX.Element} The login page component.
 */
export default function LoginPage(): JSX.Element {
  const handleDiscordSignIn = async (): Promise<void> => {
    "use server";

    await signIn("discord");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-md">
        {/* Logo/Header Section */}
        <div className="text-center mb-12 animate__animated animate__fadeInUp animate__faster relative">
          <CircusLogo />
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
              <DiscordLoginButton signIn={handleDiscordSignIn} />

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
