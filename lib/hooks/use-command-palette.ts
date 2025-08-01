import { useState } from "react";



/**
 * @description
 * Hook to manage command palette state globally
 *
 * @returns Command palette state and methods
 */
export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  const openCommandPalette = () => setIsOpen(true);
  const closeCommandPalette = () => setIsOpen(false);
  const toggleCommandPalette = () => setIsOpen(prev => !prev);

  return {
    isOpen,
    openCommandPalette,
    closeCommandPalette,
    toggleCommandPalette,
  };
}
