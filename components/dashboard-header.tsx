"use client";

import type { Session } from "next-auth";
import type { JSX } from "react";

import { Command, Menu } from "lucide-react";
import { usePathname } from "next/navigation";

import { Breadcrumb } from "@/components/breadcrumb";
import { useCommandPalette } from "@/components/providers/command-palette-provider";
import { Button } from "@/components/ui";
import { UserMenu } from "@/components/user-menu";
import { MENU_ITEMS } from "@/lib/consts/menu.const";



type TDashboardHeaderProps = {
  session: Session;
  onMenuToggle: () => void;
  sidebarOpen?: boolean;
};

/**
 * @description
 * Dashboard header component with menu toggle, breadcrumb, and user menu
 *
 * @param props - The component props
 * @param props.session - The user session
 * @param props.onMenuToggle - Menu toggle handler
 * @returns The dashboard header component
 */
export function DashboardHeader({ session, onMenuToggle }: TDashboardHeaderProps): JSX.Element {
  const pathname = usePathname();
  const { openCommandPalette, isAuthenticated } = useCommandPalette();

  // Generate breadcrumb items based on current path
  const getBreadcrumbItems = () => {
    const currentMenuItem = MENU_ITEMS.find(item => item.link === pathname);

    if (currentMenuItem && pathname !== "/") {
      return [{ label: currentMenuItem.label.toUpperCase() }];
    }

    return [{ label: "HOME" }];
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <header className="bg-white border-b-2 border-black shadow-[0px_2px_0px_0px_rgba(0,0,0,1)] relative z-20">
      <div className="flex items-center gap-4 px-6 py-4">
        {/* Menu Toggle */}
        <Button
          variant="outline"
          onClick={onMenuToggle}
          className="relative w-10 h-10 p-0 bg-pink-300 hover:bg-pink-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-100 font-black group/tooltip"
        >
          <Menu className="h-5 w-5 transition-transform duration-300 rotate-0" />
          {/* Tooltip */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-black text-white text-xs rounded border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap z-[9999] pointer-events-none">
            Toggle Menu
            {/* Tooltip arrow */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-black"></div>
          </div>
        </Button>

        {/* Breadcrumb */}
        <div className="flex-shrink-0">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Command Palette Button - Only show when authenticated */}
        {isAuthenticated && (
          <Button
            variant="outline"
            onClick={openCommandPalette}
            className="relative w-10 h-10 p-0 bg-cyan-300 hover:bg-cyan-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition-all duration-100 font-black group/tooltip"
          >
            <Command className="h-5 w-5" />
            {/* Tooltip */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-black text-white text-xs rounded border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap z-[9999] pointer-events-none">
              Open Command Palette (Ctrl+K)
              {/* Tooltip arrow */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-black"></div>
            </div>
          </Button>
        )}

        {/* User Menu */}
        <div>
          <UserMenu session={session} />
        </div>
      </div>
    </header>
  );
}
