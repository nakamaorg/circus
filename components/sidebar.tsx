"use client";

import type { JSX } from "react";

import { usePathname } from "next/navigation";
import { CircusLogo } from "@/components/circus-logo";
import { NavigationLink } from "@/components/navigation-link";
import { Button } from "@/components/ui";
import { MENU_ITEMS } from "@/lib/consts/menu.const";



type TSidebarProps = {
  isOpen?: boolean;
  onLinkClick?: () => void;
};

/**
 * @description
 * Sidebar navigation component for the dashboard with refined NeoBrutalism design
 *
 * @param props - The component props
 * @param props.isOpen - Whether the sidebar is open/visible
 * @param props.onLinkClick - Callback function called when a navigation link is clicked
 * @returns The sidebar component
 */
export function Sidebar({ isOpen = true, onLinkClick }: TSidebarProps): JSX.Element {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 bg-yellow-300 border-r-2 border-black flex flex-col shadow-[4px_0px_0px_0px_rgba(0,0,0,1)] relative">
      {/* Logo Section */}
      <div className="p-4 border-b-2 border-black bg-white">
        <div className="flex items-center justify-center">
          <CircusLogo />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6">
        <div className="space-y-4">
          {MENU_ITEMS.map((item, index) => {
            const isActive = pathname === item.link;
            const Icon = item.icon;
            const hoverColors = ["hover:bg-pink-300", "hover:bg-cyan-300"];
            const rotations = ["rotate-[-1deg]", "rotate-[1deg]"];

            return (
              <NavigationLink key={item.link} href={item.link} className="block" onClick={onLinkClick}>
                <Button
                  variant="outline"
                  className={`w-full justify-start font-black text-lg px-6 py-4 bg-yellow-200 ${hoverColors[index % 2]} border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-100 transform ${rotations[index % 2]} hover:rotate-0 ${isActive ? "bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" : ""}`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label.toUpperCase()}
                </Button>
              </NavigationLink>
            );
          })}
        </div>
      </nav>

      {/* Version Info */}
      <div className="p-6 border-t-2 border-black bg-cyan-300">
        <div className="text-center bg-white border-2 border-black p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
          <p className="text-sm font-black text-black uppercase tracking-wider">
            Circus v0.0.1
          </p>
          <p className="text-xs font-black text-black mt-2 uppercase">
            NakamaOrg Circus © 2025
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      {isOpen && (
        <>
          <div className="animate__animated animate__bounceInDown absolute top-15 -right-2 w-6 h-18 bg-pink-400 border-3 border-black transform rotate-12 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"></div>
          <div className="animate__animated animate__bounceInLeft animate__faster absolute top-35 -right-0 w-8 h-8 bg-cyan-400 border-3 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"></div>
          <div className="animate__animated animate__bounceInUp animate__fast absolute bottom-32 -right-2 w-7 h-12 bg-yellow-400 border-3 border-black transform -rotate-12 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"></div>
        </>
      )}
    </aside>
  );
}
