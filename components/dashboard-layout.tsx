"use client";

import type { Session } from "next-auth";
import type { JSX, ReactNode } from "react";

import { useState } from "react";
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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = (): void => {
    setSidebarOpen(!sidebarOpen);
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
          <Sidebar />
        </div>

        {/* Sidebar - Desktop */}
        <div className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          hidden lg:block lg:fixed lg:inset-y-0 lg:left-0 lg:z-50
          transition-transform duration-300 ease-in-out
        `}
        >
          <Sidebar />
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={toggleSidebar}
          />
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
