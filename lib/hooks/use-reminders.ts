import { useQuery } from "@tanstack/react-query";



interface Reminder {
  id: string;
  title: string;
  content?: string;
  reminder_time: number; // Unix timestamp
  created_at: number;
  user_id: string;
}

interface RemindersResponse {
  statusCode: number;
  reminders: Reminder[];
}

/**
 * @description
 * Custom hook to fetch user reminders.
 *
 * @returns Query result with reminders data
 */
export function useReminders() {
  return useQuery<RemindersResponse>({
    queryKey: ["reminders"],
    queryFn: async () => {
      const response = await fetch("/api/reminders");

      if (!response.ok) {
        throw new Error("Failed to fetch reminders");
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}
