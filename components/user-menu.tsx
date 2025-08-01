"use client";

import type { Session } from "next-auth";
import type { JSX } from "react";

import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";

import { handleSignOut } from "@/app/actions/auth";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui";
import { useUser } from "@/lib/hooks/use-user";



type TUserMenuProps = {
  session: Session;
};

/**
 * @description
 * User menu component with avatar and click dropdown options
 *
 * @param props - The component props
 * @param props.session - The user session
 * @returns The user menu component
 */
export function UserMenu({ session }: TUserMenuProps): JSX.Element {
  const [isPending, startTransition] = useTransition();
  const { user: userData, isLoading } = useUser();
  const user = session.user;
  const displayName = user?.name ?? "Anonymous";
  const avatarUrl = user?.image;
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  // Determine if user is wanted or saint
  const wantedStatus = userData?.wanted ? "Wanted" : "Saint";
  const statusColor = userData?.wanted ? "text-red-600" : "text-green-600";

  const handleLogout = (): void => {
    startTransition(() => {
      handleSignOut();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isLoading}>
        <div className="group">
          <button
            className={`flex items-center space-x-3 h-10 px-4 py-2 bg-cyan-300 hover:bg-cyan-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-100 font-black text-black uppercase tracking-wide rounded-[5px] ${isLoading ? "animate-pulse cursor-not-allowed" : ""}`}
            disabled={isLoading}
          >
            <Avatar className="h-8 w-8 border-2 border-black">
              <AvatarImage src={avatarUrl || undefined} alt={displayName} />
              <AvatarFallback className="bg-yellow-300 text-black font-black">
                {initials}
              </AvatarFallback>
            </Avatar>
            {isLoading
              ? (
                  <div className="hidden md:block">
                    <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                )
              : (
                  <span className="font-black text-sm hidden md:block">{displayName}</span>
                )}
          </button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-0 mt-2 z-50"
      >
        {isLoading
          ? (
              <div className="animate-pulse">
                <div className="px-4 py-3 bg-pink-300 border-b-2 border-black">
                  <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 w-16 bg-gray-300 rounded"></div>
                </div>
                <div className="p-2 space-y-2">
                  <div className="h-10 w-full bg-gray-300 rounded border-2 border-black"></div>
                  <div className="h-10 w-full bg-gray-300 rounded border-2 border-black"></div>
                </div>
              </div>
            )
          : (
              <>
                <div className="px-4 py-3 bg-pink-300 border-b-2 border-black">
                  <p className="text-base font-black text-black uppercase">{displayName}</p>
                  <p className={`text-sm font-bold ${statusColor} uppercase tracking-wide`}>{wantedStatus}</p>
                </div>
                <div className="p-2 space-y-2">
                  <Link
                    href="/profile"
                    className="w-full bg-cyan-400 hover:bg-cyan-500 text-cyan-900 hover:text-cyan-950 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-100 flex items-center px-4 py-3 text-sm font-black rounded-none cursor-pointer uppercase tracking-wide block transform hover:rotate-0 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px]"
                  >
                    <User className="mr-3 h-5 w-5" />
                    <span>View Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={isPending}
                    className="w-full bg-red-400 hover:bg-red-500 text-red-900 hover:text-red-950 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-100 flex items-center px-4 py-3 text-sm font-black rounded-none cursor-pointer uppercase tracking-wide disabled:opacity-50 transform rotate-[1deg] hover:rotate-0 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] disabled:transform-none disabled:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    <span>{isPending ? "Signing out..." : "Sign out"}</span>
                  </button>
                </div>
              </>
            )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
