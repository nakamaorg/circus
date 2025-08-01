"use client";

import type { JSX, ReactNode } from "react";

import { createContext, useContext, useEffect, useState } from "react";



interface NavigationContextType {
  isNavigating: boolean;
  startNavigation: () => void;
  finishNavigation: () => void;
}

const NavigationContext = createContext<NavigationContextType>({
  isNavigating: false,
  startNavigation: () => {},
  finishNavigation: () => {},
});

/**
 * @description
 * Hook to access navigation context
 *
 * @returns The navigation context
 */
export const useNavigation = () => useContext(NavigationContext);

interface NavigationProviderProps {
  children: ReactNode;
}

/**
 * @description
 * Navigation provider that tracks navigation state across the app
 *
 * @param props - The provider props
 * @param props.children - Child components
 * @returns The navigation provider
 */
export function NavigationProvider({ children }: NavigationProviderProps): JSX.Element {
  const [isNavigating, setIsNavigating] = useState(false);

  const startNavigation = () => {
    setIsNavigating(true);
  };

  const finishNavigation = () => {
    setIsNavigating(false);
  };

  // Listen for pageReady event to automatically finish navigation
  useEffect(() => {
    const handlePageReady = () => {
      if (isNavigating) {
        finishNavigation();
      }
    };

    window.addEventListener("pageReady", handlePageReady);

    return () => {
      window.removeEventListener("pageReady", handlePageReady);
    };
  }, [isNavigating]);

  return (
    <NavigationContext.Provider
      value={{ isNavigating, startNavigation, finishNavigation }}
    >
      {children}
    </NavigationContext.Provider>
  );
}
