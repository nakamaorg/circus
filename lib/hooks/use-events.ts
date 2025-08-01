import type { TEvent } from "@/lib/types/event.type";
import { useQuery } from "@tanstack/react-query";



/**
 * @description
 * Fetches events from the API
 *
 * @returns A promise that resolves to an array of events
 */
async function fetchEvents(): Promise<TEvent[]> {
  const response = await fetch("/api/events");

  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  return response.json();
}

/**
 * @description
 * A custom hook to fetch events using React Query
 *
 * @returns The result of the useQuery hook
 */
export function useEvents() {
  return useQuery<TEvent[], Error>({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });
}
