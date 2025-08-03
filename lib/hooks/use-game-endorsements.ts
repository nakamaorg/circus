"use client";

import { useQuery } from "@tanstack/react-query";



/**
 * @description
 * Hook to fetch game endorsements leaderboard for the current user
 *
 * @returns Query result containing endorsements data
 */
export function useGameEndorsements() {
  return useQuery({
    queryKey: ["game-endorsements"],
    queryFn: async (): Promise<Record<string, number>> => {
      const response = await fetch("/api/games/endorsements");

      if (!response.ok) {
        throw new Error("Failed to fetch game endorsements");
      }

      const data = await response.json();

      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
