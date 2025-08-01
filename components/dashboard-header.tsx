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
  const { openCommandPalette } = useCommandPalette();

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
          className="w-10 h-10 p-0 bg-pink-300 hover:bg-pink-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-100 font-black"
        >
          <Menu className="h-5 w-5 transition-transform duration-300 rotate-0" />
        </Button>

        {/* Breadcrumb */}
        <div className="flex-shrink-0">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Command Palette Button */}
        <Button
          variant="outline"
          onClick={openCommandPalette}
          className="w-10 h-10 p-0 bg-cyan-300 hover:bg-cyan-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition-all duration-100 font-black"
          title="Open Command Palette (Ctrl+K)"
        >
          <Command className="h-5 w-5" />
        </Button>

        {/* User Menu */}
        <div>
          <UserMenu session={session} />
        </div>
      </div>
    </header>
  );
}
