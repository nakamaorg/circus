"use client";

import type { JSX } from "react";

import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

import { CommandPalette } from "@/components/command-palette";



type TCommandPaletteContextType = {
  isOpen: boolean;
  isAuthenticated: boolean;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleCommandPalette: () => void;
};

const CommandPaletteContext = createContext<TCommandPaletteContextType | undefined>(undefined);

/**
 * @description
 * Provider for the command palette state
 *
 * @param props - The provider props
 * @param props.children - The child components
 * @returns The command palette provider component
 */
export function CommandPaletteProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [forceLoggedOut, setForceLoggedOut] = useState(false);
  const { data: session, status } = useSession();

  // More robust authentication check that handles stale session data
  const isAuthenticated = status === "authenticated" && !!session?.user && !forceLoggedOut;

  const openCommandPalette = () => {
    // Only open if user is authenticated
    if (isAuthenticated) {
      setIsOpen(true);
    }
  };

  const closeCommandPalette = () => setIsOpen(false);

  const toggleCommandPalette = () => {
    // Only toggle if user is authenticated
    if (isAuthenticated) {
      setIsOpen(prev => !prev);
    }
  };

  // Force logout state when status changes to unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      setForceLoggedOut(true);
      setIsOpen(false);
    }
    else if (status === "authenticated" && session?.user) {
      // Reset force logout when properly authenticated again
      setForceLoggedOut(false);
    }
  }, [status, session?.user]);

  // Close command palette immediately when authentication state changes
  useEffect(() => {
    // Close the palette whenever status changes away from "authenticated"
    // OR when session becomes null/undefined OR when force logged out
    if (status !== "authenticated" || !session?.user || forceLoggedOut) {
      setIsOpen(false);
    }
  }, [status, session?.user, forceLoggedOut]);

  // Global keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard shortcut if user is authenticated
      if (!isAuthenticated) {
        return;
      }

      // Ctrl+K or Cmd+K to open command palette
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        openCommandPalette();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isAuthenticated]);

  const value = {
    isOpen,
    isAuthenticated,
    openCommandPalette,
    closeCommandPalette,
    toggleCommandPalette,
  };

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
      {/* Only render CommandPalette when authenticated */}
      {isAuthenticated && <CommandPalette isOpen={isOpen} onClose={closeCommandPalette} />}
    </CommandPaletteContext.Provider>
  );
}

/**
 * @description
 * Hook to use the command palette context
 *
 * @returns The command palette context
 */
export function useCommandPalette(): TCommandPaletteContextType {
  const context = useContext(CommandPaletteContext);

  if (context === undefined) {
    throw new Error("useCommandPalette must be used within a CommandPaletteProvider");
  }

  return context;
}
