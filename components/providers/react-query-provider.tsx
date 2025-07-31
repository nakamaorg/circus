"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";



const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

type TReactQueryProviderProps = {
  children: React.ReactNode;
};

/**
 * @description
 * React Query provider component
 *
 * @param root0 - The component props
 * @param root0.children - The child components
 * @returns The ReactQueryProvider component
 */
export function ReactQueryProvider({ children }: TReactQueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
