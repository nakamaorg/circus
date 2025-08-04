"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";



interface LWRecord {
  taker_id: string;
  giver_id: string;
  timestamp: number;
}

interface UserMap {
  [userId: string]: string;
}

interface ReputationData {
  received: {
    ls: LWRecord[];
    ws: LWRecord[];
  };
  given: {
    ls: LWRecord[];
    ws: LWRecord[];
  };
  summary: {
    received_ls: number;
    received_ws: number;
    given_ls: number;
    given_ws: number;
  };
  users: UserMap;
}

/**
 * @description
 * Fetches reputation data from the API
 *
 * @returns A promise that resolves to reputation data
 */
async function fetchReputation(): Promise<ReputationData> {
  const response = await fetch("/api/reputation");

  if (!response.ok) {
    throw new Error("Failed to fetch reputation data");
  }

  return response.json();
}

/**
 * @description
 * A custom hook to fetch reputation data using React Query
 *
 * @returns The result of the useQuery hook
 */
export function useReputation() {
  const { data: session, status } = useSession();

  return useQuery<ReputationData, Error>({
    queryKey: ["reputation"],
    queryFn: fetchReputation,
    enabled: status === "authenticated" && !!session?.user?.discordId,
  });
}
