"use server";

import { redirect } from "next/navigation";
import { signOut } from "@/lib/helpers/auth.helper";



/**
 * @description
 * Server action to handle user sign out
 *
 * @returns Promise that resolves when sign out is complete
 */
export async function handleSignOut(): Promise<never> {
  await signOut();
  redirect("/login");
}
