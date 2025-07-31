import type { TNullable, TUnsafe } from "@eoussama/core";
import type { TUser } from "@/lib/types/user.type";



/**
 * @description
 * Checks if a user is wanted
 *
 * @param user - The user object
 * @returns True if user is wanted
 */
export function isUserWanted(user: TUnsafe<TUser>): boolean {
  return user?.wanted ?? false;
}

/**
 * @description
 * Gets the user's display name with fallback
 *
 * @param user - The user object
 * @returns User's display name or fallback
 */
export function getUserDisplayName(user: TUnsafe<TUser>): string {
  return user?.name ?? user?.discord.name ?? "Fraud";
}

/**
 * @description
 * Gets the user's avatar URL with fallback
 *
 * @param user - The user object
 * @param fallbackUrl - Optional fallback avatar URL
 * @returns Avatar URL or fallback
 */
export function getUserAvatarUrl(user: TUnsafe<TUser>, fallbackUrl?: string): TNullable<string> {
  return user?.discord.avatar ?? fallbackUrl ?? null;
}

/**
 * @description
 * Formats user's autobiography with a default value
 *
 * @param user - The user object
 * @returns Formatted autobiography
 */
export function formatUserBiography(user: TUnsafe<TUser>): string {
  const bio = user?.autobiography ?? "Mr. ambiguous";

  return bio;
}
