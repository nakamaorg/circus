"use client";

import type { Game, GamesResponse } from "@/lib/types/game.type";

import { useQuery } from "@tanstack/react-query";



/**
 * @description
 * Hook to fetch games from the API
 *
 * @returns Query result containing games data
 */
export function useGames() {
  return useQuery({
    queryKey: ["games"],
    queryFn: async (): Promise<Game[]> => {
      // First, get game IDs from DynamoDB
      const gamesResponse = await fetch("/api/games");

      if (!gamesResponse.ok) {
        throw new Error("Failed to fetch games");
      }

      const gamesData: GamesResponse = await gamesResponse.json();

      if (!gamesData.gameIds || gamesData.gameIds.length === 0) {
        return [];
      }

      // Then, get game info from third-wheel API
      const infoResponse = await fetch("/api/games/info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: gamesData.gameIds }),
      });

      if (!infoResponse.ok) {
        throw new Error("Failed to fetch game info");
      }

      const infoData = await infoResponse.json();

      return infoData.data || infoData.games || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
