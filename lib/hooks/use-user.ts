"use client";

import type { TUnsafe } from "@eoussama/core";
import type { TUser } from "@/lib/types/user.type";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";



const USER_QUERY_KEY = ["user"] as const;

/**
 * @description
 * Fetches user data from the API
 *
 * @returns Promise resolving to user data
 */
async function fetchUser(): Promise<TUser> {
  const response = await fetch("/api/user");

  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }

  return response.json();
}

/**
 * @description
 * Hook for managing user state with React Query
 *
 * @returns Object containing user data, loading state, error, and utility functions
 */
export function useUser() {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
    refetch,
    isError,
  } = useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: fetchUser,
    enabled: status === "authenticated" && !!session?.user?.discordId,
  });

  /**
   * @description
   * Invalidates user cache and refetches data
   *
   * @returns Promise that resolves when invalidation is complete
   */
  const invalidateUser = async () => {
    await queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
  };

  /**
   * @description
   * Manually updates user data in the cache
   *
   * @param updatedUser - The updated user data
   */
  const updateUserCache = (updatedUser: Partial<TUser>) => {
    queryClient.setQueryData(USER_QUERY_KEY, (oldData: TUnsafe<TUser>) => {
      if (!oldData) {
        return oldData;
      }

      return { ...oldData, ...updatedUser };
    });
  };

  return {
    user,
    isLoading: status === "loading" || isLoading,
    isError,
    error,
    refetch,
    invalidateUser,
    updateUserCache,
    isAuthenticated: status === "authenticated",
    isUnauthenticated: status === "unauthenticated",
  };
}

/**
 * @description
 * Hook to get user data without reactivity (one-time fetch)
 *
 * @returns User data if available in cache
 */
export function useUserSnapshot() {
  const queryClient = useQueryClient();

  return queryClient.getQueryData<TUser>(USER_QUERY_KEY);
}
