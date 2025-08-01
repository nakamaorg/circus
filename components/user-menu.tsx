"use client";

import type { Session } from "next-auth";
import type { JSX } from "react";

import { LogOut } from "lucide-react";
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
  const user = session.user;
  const displayName = user?.name ?? "Anonymous";
  const avatarUrl = user?.image;
  const initials = displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const handleLogout = (): void => {
    startTransition(() => {
      handleSignOut();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="group">
          <button className="flex items-center space-x-3 bg-cyan-300 hover:bg-cyan-400 p-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-100 font-black text-black uppercase tracking-wide">
            <Avatar className="h-8 w-8 border-2 border-black">
              <AvatarImage src={avatarUrl || undefined} alt={displayName} />
              <AvatarFallback className="bg-yellow-300 text-black font-black">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="font-black text-sm hidden md:block">{displayName}</span>
          </button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-0 mt-2 z-50"
      >
        <div className="px-4 py-3 bg-pink-300 border-b-2 border-black">
          <p className="text-base font-black text-black uppercase">{displayName}</p>
          <p className="text-sm font-bold text-black/70">{user?.email ?? "No email"}</p>
        </div>
        <div className="p-2">
          <button
            onClick={handleLogout}
            disabled={isPending}
            className="w-full bg-red-400 hover:bg-red-500 text-red-900 hover:text-red-950 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-100 flex items-center px-4 py-3 text-sm font-black rounded-none cursor-pointer uppercase tracking-wide disabled:opacity-50"
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span>{isPending ? "Signing out..." : "Sign out"}</span>
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
