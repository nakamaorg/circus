"use client";

import type { Session } from "next-auth";
import type { JSX, ReactNode } from "react";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { Sidebar } from "@/components/sidebar";



type TDashboardLayoutProps = {
  children: ReactNode;
  session: Session;
};

/**
 * @description
 * Main dashboard layout component with sidebar and header
 *
 * @param props - The component props
 * @param props.children - The main content to render
 * @param props.session - The user session
 * @returns The dashboard layout component
 */
export function DashboardLayout({ children, session }: TDashboardLayoutProps): JSX.Element {
  // Initialize sidebar state based on screen size
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Set initial sidebar state based on screen size (only once on mount)
    const isDesktop = window.innerWidth >= 1024; // lg breakpoint

    setSidebarOpen(isDesktop);
  }, []);

  // Handle ESC key to close sidebar on mobile
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && sidebarOpen && window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [sidebarOpen]);

  const toggleSidebar = (): void => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLinkClick = (): void => {
    // Close sidebar on mobile screens when a link is clicked
    if (window.innerWidth < 1024) { // Below lg breakpoint
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-100 to-cyan-100">
      <div className="flex h-screen">
        {/* Sidebar - Mobile */}
        <div className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          fixed inset-y-0 left-0 z-50 lg:hidden
          transition-transform duration-300 ease-in-out
        `}
        >
          <Sidebar isOpen={sidebarOpen} onLinkClick={handleLinkClick} />
        </div>

        {/* Close Button for Mobile - Fixed to window */}
        {sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="animate__animated animate__bounceIn fixed top-4 right-4 w-12 h-12 bg-red-500 hover:bg-red-600 text-white font-black border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition-all duration-100 z-[60] flex items-center justify-center lg:hidden group/tooltip"
            aria-label="Close sidebar"
          >
            <X className="w-6 h-6" />
            {/* Tooltip */}
            <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-2 px-2 py-1 bg-black text-white text-xs rounded border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap z-[9999] pointer-events-none">
              Close sidebar (Esc)
              {/* Tooltip arrow */}
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-t-4 border-b-4 border-transparent border-l-black"></div>
            </div>
          </button>
        )}

        {/* Sidebar - Desktop */}
        <div className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          hidden lg:block lg:fixed lg:inset-y-0 lg:left-0 lg:z-50
          transition-transform duration-300 ease-in-out
        `}
        >
          <Sidebar isOpen={sidebarOpen} onLinkClick={handleLinkClick} />
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 backdrop-blur-sm lg:hidden">
            {/* NeoBrutalism themed backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={toggleSidebar} />

            {/* NeoBrutalism pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="w-full h-full bg-black"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 20px,
                    rgba(255,255,255,0.1) 20px,
                    rgba(255,255,255,0.1) 40px
                  )`,
                }}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${sidebarOpen ? "lg:ml-64" : "lg:ml-0"}`}>
          <DashboardHeader session={session} onMenuToggle={toggleSidebar} sidebarOpen={sidebarOpen} />
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
