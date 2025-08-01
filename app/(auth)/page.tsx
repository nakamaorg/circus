"use client";

import type { JSX } from "react";

import { Rocket, Sparkles, Zap } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePageReady } from "@/lib/hooks/use-page-ready";



/**
 * @description
 * Main dashboard page with refined NeoBrutalism design.
 *
 * @returns {JSX.Element} The dashboard page component.
 */
export default function DashboardPage(): JSX.Element {
  usePageReady();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-black text-black uppercase tracking-wider transform -rotate-2 bg-yellow-400 inline-block px-8 py-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          Welcome to the Dashboard!
        </h1>
        <p className="text-2xl font-bold text-black bg-white inline-block px-6 py-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
          You are successfully authenticated with Discord!
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-pink-300 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform rotate-1 hover:rotate-0 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
          <CardHeader className="border-b-2 border-black bg-pink-400">
            <CardTitle className="text-2xl font-black text-black uppercase tracking-wide flex items-center gap-3">
              <Sparkles className="h-6 w-6" />
              WELCOME
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-base font-bold text-black leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-cyan-300 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 hover:rotate-0 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
          <CardHeader className="border-b-2 border-black bg-cyan-400">
            <CardTitle className="text-2xl font-black text-black uppercase tracking-wide flex items-center gap-3">
              <Zap className="h-6 w-6" />
              FEATURES
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-base font-bold text-black leading-relaxed">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
              culpa qui officia deserunt mollit anim.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-yellow-300 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform rotate-2 hover:rotate-0 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
          <CardHeader className="border-b-2 border-black bg-yellow-400">
            <CardTitle className="text-2xl font-black text-black uppercase tracking-wide flex items-center gap-3">
              <Rocket className="h-6 w-6" />
              GET STARTED
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-base font-bold text-black leading-relaxed">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
              doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
              veritatis et quasi architecto beatae.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        <CardHeader className="border-b-2 border-black bg-gradient-to-r from-pink-400 via-yellow-400 to-cyan-400">
          <CardTitle className="text-4xl font-black text-black uppercase tracking-wider text-center">
            About This Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6 relative">
          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 w-6 h-6 bg-pink-400 border-2 border-black rounded-full shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"></div>
          <div className="absolute top-16 right-8 w-4 h-4 bg-cyan-400 border-2 border-black transform rotate-45 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"></div>
          <div className="absolute bottom-8 left-4 w-8 h-3 bg-yellow-400 border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"></div>

          <p className="text-lg font-bold text-black leading-relaxed bg-pink-100 p-4 border-l-2 border-pink-400 transform -rotate-1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p className="text-lg font-bold text-black leading-relaxed bg-cyan-100 p-4 border-l-2 border-cyan-400 transform rotate-1">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <p className="text-lg font-bold text-black leading-relaxed bg-yellow-100 p-4 border-l-2 border-yellow-400">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
            doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
            veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          </p>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="text-center">
        <div className="inline-block bg-gradient-to-r from-pink-400 via-yellow-400 to-cyan-400 p-1 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
          <div className="bg-white px-8 py-4 border-2 border-black">
            <p className="text-2xl font-black text-black uppercase tracking-wider">
              Ready to Join the Show?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
