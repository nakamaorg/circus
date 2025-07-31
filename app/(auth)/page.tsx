import type { JSX } from "react";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/helpers/auth.helper";



/**
 * @description
 * Main dashboard page.
 *
 * @returns {JSX.Element} The dashboard page component.
 */
export default function DashboardPage(): JSX.Element {
  const handleSignOut = async (): Promise<void> => {
    "use server";

    await signOut();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-4xl font-black text-foreground mb-8">
          Welcome to the Dashboard! 🎪
        </h1>

        <p className="text-lg font-bold text-foreground mb-8">
          You are successfully authenticated with Discord!
        </p>

        <form action={handleSignOut}>
          <Button
            type="submit"
            size="lg"
            variant="destructive"
            className="w-full font-black text-xl py-6 px-6 border-2 border-black shadow-shadow active:translate-x-2 active:translate-y-2 active:shadow-none transition-all duration-150"
          >
            SIGN OUT
          </Button>
        </form>
      </div>
    </div>
  );
}
