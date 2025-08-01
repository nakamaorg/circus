"use client";

import { useEffect } from "react";



/**
 * @description
 * Hook that signals when a page component has mounted and is ready
 * Dispatches a custom 'pageReady' event that the navigation provider listens for
 * This ensures the navigation loader disappears only when the page is actually ready
 */
export function usePageReady(): void {
  useEffect(() => {
    const event = new CustomEvent("pageReady");

    window.dispatchEvent(event);
  }, []);
}
