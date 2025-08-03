import { useQuery } from "@tanstack/react-query";



interface User {
  discord_id: string;
  username: string;
}

/**
 * Hook to fetch all users for global endorsements lookup
 *
 * @returns Query result with users data
 */
export function useUsers() {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("/api/users");

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}
