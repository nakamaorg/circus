"use client";

import { useQuery } from "@tanstack/react-query";



interface UseGameEndorsementsOptions {
  type?: "my" | "game" | "global";
  gameId?: number;
}

/**
 * @description
 * Hook to fetch game endorsements leaderboard
 * Supports different types of endorsements data
 *
 * @param options - Configuration options for the endorsements query
 * @returns Query result containing endorsements data
 */
export function useGameEndorsements(options: UseGameEndorsementsOptions = {}) {
  const { type = "my", gameId } = options;

  return useQuery({
    queryKey: ["game-endorsements", type, gameId],
    queryFn: async (): Promise<Record<string, number>> => {
      const searchParams = new URLSearchParams();

      searchParams.set("type", type);

      if (type === "game" && gameId) {
        searchParams.set("game_id", gameId.toString());
      }

      const response = await fetch(`/api/games/endorsements?${searchParams.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch game endorsements");
      }

      const data = await response.json();

      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: type !== "game" || (type === "game" && gameId !== undefined),
  });
}
