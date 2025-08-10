/**
 * Permission Manager for handling user permissions using bitmasks
 *
 * This module provides a comprehensive permission system using bit operations.
 * Each permission is represented by a specific bit in a decimal number.
 *
 * Permission Values:
 * - Dictator: 1 (binary: 00001)
 * - Memer: 2 (binary: 00010)
 * - Fenjer: 4 (binary: 00100)
 * - Historian: 8 (binary: 01000)
 * - Gamer: 16 (binary: 10000)
 *
 * @example
 * ```typescript
 * import { isDictator, isMemer, createPermissionManager, PERMISSIONS, combinePermissions } from './permission.helper';
 *
 * const user = {
 *   id: "123",
 *   name: "John",
 *   autobiography: "Test",
 *   wanted: false,
 *   permissions: combinePermissions(PERMISSIONS.DICTATOR, PERMISSIONS.MEMER), // 3
 *   discord: { id: "discord123", name: "John#1234", avatar: null }
 * };
 *
 * // Using helper functions
 * isDictator(user); // true
 * isMemer(user); // true
 * isFenjer(user); // false
 *
 * // Using PermissionManager class
 * const manager = createPermissionManager(user);
 * manager.getUserPermissions(); // ["DICTATOR", "MEMER"]
 * manager.hasPermission(PERMISSIONS.DICTATOR); // true
 * manager.hasAnyPermission([PERMISSIONS.FENJER, PERMISSIONS.HISTORIAN]); // false
 * ```
 */

import type { TUser } from "../types/user.type";



// Permission bit masks (decimal values)
export const PERMISSIONS = {
  DICTATOR: 1, // 00001
  MEMER: 2, // 00010
  FENJER: 4, // 00100
  HISTORIAN: 8, // 01000
  GAMER: 16, // 10000
} as const;

// Type for permission names
export type PermissionName = keyof typeof PERMISSIONS;

/**
 * Permission Manager class for handling user permissions
 */
export class PermissionManager {
  private permissions: number;

  /**
   * Create a new PermissionManager instance
   *
   * @param user - The user object containing permissions
   */
  constructor(user: TUser) {
    this.permissions = user.permissions || 0;
  }

  /**
   * Check if user has a specific permission
   *
   * @param permission - The permission to check
   * @returns boolean indicating if user has the permission
   */
  hasPermission(permission: number): boolean {
    return (this.permissions & permission) === permission;
  }

  /**
   * Check if user has any of the specified permissions
   *
   * @param permissions - Array of permissions to check
   * @returns boolean indicating if user has any of the permissions
   */
  hasAnyPermission(permissions: number[]): boolean {
    return permissions.some(permission => this.hasPermission(permission));
  }

  /**
   * Check if user has all of the specified permissions
   *
   * @param permissions - Array of permissions to check
   * @returns boolean indicating if user has all permissions
   */
  hasAllPermissions(permissions: number[]): boolean {
    return permissions.every(permission => this.hasPermission(permission));
  }

  /**
   * Get all permissions the user has
   *
   * @returns Array of permission names
   */
  getUserPermissions(): PermissionName[] {
    const userPermissions: PermissionName[] = [];

    Object.entries(PERMISSIONS).forEach(([name, value]) => {
      if (this.hasPermission(value)) {
        userPermissions.push(name as PermissionName);
      }
    });

    return userPermissions;
  }

  /**
   * Get the raw permissions number
   *
   * @returns The permissions bitmask value
   */
  getRawPermissions(): number {
    return this.permissions;
  }
}

// Helper functions for specific permission checks
/**
 * Check if user has Dictator permission
 *
 * @param user - The user to check
 * @returns boolean indicating if user is a Dictator
 */
export function isDictator(user: TUser): boolean {
  const manager = new PermissionManager(user);

  return manager.hasPermission(PERMISSIONS.DICTATOR);
}

/**
 * Check if user has Memer permission
 *
 * @param user - The user to check
 * @returns boolean indicating if user is a Memer
 */
export function isMemer(user: TUser): boolean {
  const manager = new PermissionManager(user);

  return manager.hasPermission(PERMISSIONS.MEMER);
}

/**
 * Check if user has Fenjer permission
 *
 * @param user - The user to check
 * @returns boolean indicating if user is a Fenjer
 */
export function isFenjer(user: TUser): boolean {
  const manager = new PermissionManager(user);

  return manager.hasPermission(PERMISSIONS.FENJER);
}

/**
 * Check if user has Historian permission
 *
 * @param user - The user to check
 * @returns boolean indicating if user is a Historian
 */
export function isHistorian(user: TUser): boolean {
  const manager = new PermissionManager(user);

  return manager.hasPermission(PERMISSIONS.HISTORIAN);
}

/**
 * Check if user has Gamer permission
 *
 * @param user - The user to check
 * @returns boolean indicating if user is a Gamer
 */
export function isGamer(user: TUser): boolean {
  const manager = new PermissionManager(user);

  return manager.hasPermission(PERMISSIONS.GAMER);
}

/**
 * Convenience function to create a permission manager instance
 *
 * @param user - The user to create a manager for
 * @returns PermissionManager instance
 */
export function createPermissionManager(user: TUser): PermissionManager {
  return new PermissionManager(user);
}

/**
 * Utility function to combine multiple permissions
 *
 * @param permissions - The permissions to combine
 * @returns Combined permission bitmask
 */
export function combinePermissions(...permissions: number[]): number {
  return permissions.reduce((combined, permission) => combined | permission, 0);
}

/**
 * Utility function to check if a permission value has specific permission
 *
 * @param permissionValue - The permission value to check
 * @param permission - The permission to check for
 * @returns boolean indicating if permission is present
 */
export function checkPermission(permissionValue: number, permission: number): boolean {
  return (permissionValue & permission) === permission;
}
