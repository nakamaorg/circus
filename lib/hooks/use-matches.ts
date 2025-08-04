"use client";

import { useQuery } from "@tanstack/react-query";



interface Match {
  id: string;
  timestamp: number;
  field_id: string;
  message: string;
  field_name?: string;
}

interface MatchesResponse {
  matches: Match[];
}

/**
 * @description
 * Fetches matches from the API
 *
 * @returns A promise that resolves to matches data
 */
async function fetchMatches(): Promise<Match[]> {
  const response = await fetch("/api/matches");

  if (!response.ok) {
    throw new Error("Failed to fetch matches");
  }

  const data: MatchesResponse = await response.json();

  return data.matches;
}

/**
 * @description
 * A custom hook to fetch matches using React Query
 *
 * @returns The result of the useQuery hook
 */
export function useMatches() {
  return useQuery<Match[], Error>({
    queryKey: ["matches"],
    queryFn: fetchMatches,
  });
}
