"use client";

import { useQuery } from "@tanstack/react-query";



interface UseGameEndorsementsOptions {
  type?: "game" | "global" | "my";
  gameId?: number;
}

export interface EndorsementData {
  game_id: number;
  endorsements: number;
}

export interface UserEndorsementData {
  discord_id: string;
  endorsements: number;
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
  const { type = "game", gameId } = options;

  return useQuery({
    queryKey: ["game-endorsements", type, gameId],
    queryFn: async (): Promise<EndorsementData[] | UserEndorsementData[]> => {
      const searchParams = new URLSearchParams();

      searchParams.set("type", type);

      if (type === "game" && gameId) {
        searchParams.set("game_id", gameId.toString());
      }

      const response = await fetch(`/api/games/endorsements?${searchParams.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch game endorsements");
      }

      const data: Record<string, number> = await response.json();

      // Transform the data based on type
      if (type === "global") {
        // For global type, keys are discord_ids
        return Object.entries(data).map(([discord_id, endorsements]) => ({
          discord_id,
          endorsements,
        }));
      }

      // For "game" and "my" types, keys are game_ids
      return Object.entries(data).map(([game_id, endorsements]) => ({
        game_id: Number.parseInt(game_id, 10),
        endorsements,
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: true,
  });
}
