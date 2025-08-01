"use client";

import type { JSX } from "react";

import { Loader2 } from "lucide-react";

import { useNavigation } from "@/components/providers/navigation-provider";



/**
 * @description
 * Navigation loader component that shows a loading bar during page transitions
 * Uses navigation context to track loading state
 *
 * @returns The navigation loader component
 */
export function NavigationLoader(): JSX.Element {
  const { isNavigating } = useNavigation();

  if (!isNavigating) {
    return <></>;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-2 bg-gray-200 border-b-2 border-black">
      <div className="h-full bg-gradient-to-r from-pink-500 via-cyan-500 to-yellow-500 animate-pulse shadow-[0px_2px_4px_0px_rgba(0,0,0,0.3)]">
        <div className="h-full bg-gradient-to-r from-pink-400 to-cyan-400 animate-bounce" />
      </div>

      {/* NeoBrutalism loading message */}
      <div className="fixed top-6 right-4 z-[9999]">
        <div className="bg-yellow-400 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-4 py-2 transform rotate-1 animate-bounce">
          <p className="text-sm font-black text-black uppercase tracking-wide flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading...
          </p>
        </div>
      </div>
    </div>
  );
}
