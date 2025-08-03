"use client";

import type { JSX } from "react";

import { Crown, Gamepad2, Trophy } from "lucide-react";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGames } from "@/lib/hooks/use-games";
import { usePageReady } from "@/lib/hooks/use-page-ready";



type TabType = "endorsements" | "games";

/**
 * @description
 * Gaming page with endorsements leaderboard and tracked games
 *
 * @returns {JSX.Element} The gaming page component.
 */
export default function GamingPage(): JSX.Element {
  usePageReady();
  const [activeTab, setActiveTab] = useState<TabType>("endorsements");
  const { data: games, isLoading, error } = useGames();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-black text-black uppercase tracking-wider transform -rotate-2 bg-green-400 inline-block px-8 py-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          Gaming Hub
        </h1>
        <p className="text-2xl font-bold text-black bg-white inline-block px-6 py-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
          Track games and view endorsements leaderboard
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-flex">
          <button
            onClick={() => setActiveTab("endorsements")}
            className={`px-8 py-4 font-black text-lg uppercase tracking-wide transition-all duration-200 ${
              activeTab === "endorsements"
                ? "bg-blue-400 text-black"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Trophy className="h-5 w-5 mr-2 inline" />
            Game Endorsements
          </button>
          <div className="w-0.5 bg-black"></div>
          <button
            onClick={() => setActiveTab("games")}
            className={`px-8 py-4 font-black text-lg uppercase tracking-wide transition-all duration-200 ${
              activeTab === "games"
                ? "bg-purple-400 text-black"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Gamepad2 className="h-5 w-5 mr-2 inline" />
            Tracked Games
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "endorsements" && (
        <div className="space-y-6">
          <Card className="bg-blue-300 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="border-b-2 border-black bg-blue-400">
              <CardTitle className="text-2xl font-black text-black uppercase tracking-wide flex items-center gap-3">
                <Crown className="h-6 w-6 text-yellow-600" />
                Game Endorsements Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-600" />
                <p className="text-xl font-bold text-black">
                  Leaderboard coming soon!
                </p>
                <p className="text-base font-semibold text-gray-700 mt-2">
                  Track game endorsements and compete with other players
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "games" && (
        <div className="space-y-6">
          <Card className="bg-purple-300 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="border-b-2 border-black bg-purple-400">
              <CardTitle className="text-2xl font-black text-black uppercase tracking-wide flex items-center gap-3">
                <Gamepad2 className="h-6 w-6" />
                Tracked Games
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {isLoading && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-black border-t-transparent mx-auto mb-4"></div>
                  <p className="text-xl font-bold text-black">
                    Loading games...
                  </p>
                </div>
              )}

              {error && (
                <div className="text-center py-12">
                  <div className="text-red-600 mb-4">
                    <Gamepad2 className="h-16 w-16 mx-auto" />
                  </div>
                  <p className="text-xl font-bold text-black">
                    Failed to load games
                  </p>
                  <p className="text-base font-semibold text-gray-700 mt-2">
                    {error instanceof Error ? error.message : "Unknown error occurred"}
                  </p>
                </div>
              )}

              {!isLoading && !error && games && games.length === 0 && (
                <div className="text-center py-12">
                  <Gamepad2 className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                  <p className="text-xl font-bold text-black">
                    No games tracked yet
                  </p>
                  <p className="text-base font-semibold text-gray-700 mt-2">
                    Start tracking games to see them here
                  </p>
                </div>
              )}

              {!isLoading && !error && games && games.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {games.map(game => (
                    <Card
                      key={game.id}
                      className="bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
                    >
                      <CardHeader className="pb-3">
                        {game.cover_url && (
                          <div className="w-full h-32 mb-3 overflow-hidden border-2 border-black">
                            <img
                              src={`https:${game.cover_url}`}
                              alt={game.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <CardTitle className="text-lg font-black text-black uppercase">
                          {game.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <div className="text-xs font-bold text-gray-500">
                            Release Date:
                            {" "}
                            {new Date(game.first_release_date * 1000).getFullYear()}
                          </div>
                          <div className="text-xs font-bold text-gray-500">
                            Game ID:
                            {" "}
                            {game.id}
                          </div>
                          {game.url && (
                            <a
                              href={game.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block text-xs font-bold text-blue-600 hover:text-blue-800 underline"
                            >
                              View on IGDB
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
