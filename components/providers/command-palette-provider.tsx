"use client";

import type { JSX } from "react";

import { createContext, useContext, useEffect, useState } from "react";

import { CommandPalette } from "@/components/command-palette";



interface CommandPaletteContextType {
  isOpen: boolean;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleCommandPalette: () => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextType | undefined>(undefined);

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

  const openCommandPalette = () => setIsOpen(true);
  const closeCommandPalette = () => setIsOpen(false);
  const toggleCommandPalette = () => setIsOpen(prev => !prev);

  // Global keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to open command palette
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        openCommandPalette();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const value = {
    isOpen,
    openCommandPalette,
    closeCommandPalette,
    toggleCommandPalette,
  };

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
      <CommandPalette isOpen={isOpen} onClose={closeCommandPalette} />
    </CommandPaletteContext.Provider>
  );
}

/**
 * @description
 * Hook to use the command palette context
 *
 * @returns The command palette context
 */
export function useCommandPalette(): CommandPaletteContextType {
  const context = useContext(CommandPaletteContext);

  if (context === undefined) {
    throw new Error("useCommandPalette must be used within a CommandPaletteProvider");
  }

  return context;
}
