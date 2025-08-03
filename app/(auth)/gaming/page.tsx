"use client";

import type { JSX } from "react";

import { Crown, Gamepad2, Search, Trophy } from "lucide-react";
import { useMemo, useState } from "react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const { data: games, isLoading, error } = useGames();

  // Filter games based on search query
  const filteredGames = useMemo(() => {
    if (!games || !searchQuery.trim()) {
      return games || [];
    }

    return games.filter(game =>
      game.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [games, searchQuery]);

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
          {/* Search Input */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-black bg-white text-black font-bold placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
              />
            </div>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-black border-t-transparent mx-auto mb-4"></div>
                <p className="text-2xl font-black text-black">
                  Loading games...
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8">
                <div className="text-red-600 mb-4">
                  <Gamepad2 className="h-16 w-16 mx-auto" />
                </div>
                <p className="text-2xl font-black text-black">
                  Failed to load games
                </p>
                <p className="text-lg font-bold text-gray-700 mt-2">
                  {error instanceof Error ? error.message : "Unknown error occurred"}
                </p>
              </div>
            </div>
          )}

          {!isLoading && !error && games && filteredGames.length === 0 && searchQuery && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8">
                <Search className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                <p className="text-2xl font-black text-black">
                  No games found
                </p>
                <p className="text-lg font-bold text-gray-700 mt-2">
                  Try adjusting your search query
                </p>
              </div>
            </div>
          )}

          {!isLoading && !error && games && games.length === 0 && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8">
                <Gamepad2 className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                <p className="text-2xl font-black text-black">
                  No games tracked yet
                </p>
                <p className="text-lg font-bold text-gray-700 mt-2">
                  Start tracking games to see them here
                </p>
              </div>
            </div>
          )}

          {!isLoading && !error && filteredGames && filteredGames.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredGames.map(game => (
                <div
                  key={game.id}
                  className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200"
                >
                  <div className="p-6">
                    {game.cover_url && (
                      <div className="w-full h-48 mb-4 overflow-hidden border-2 border-black">
                        <img
                          src={`https:${game.cover_url}`}
                          alt={game.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-3 mb-4">
                      <Gamepad2 className="w-6 h-6 text-purple-600" />
                      <h3 className="text-xl font-black text-black uppercase tracking-wide">{game.name}</h3>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="text-sm font-bold text-gray-700">
                        Release Date:
                        {" "}
                        {new Date(game.first_release_date * 1000).getFullYear()}
                      </div>
                      <div className="text-sm font-bold text-gray-700">
                        Game ID:
                        {" "}
                        {game.id}
                      </div>
                    </div>

                    {game.url && (
                      <a
                        href={game.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-100 flex items-center justify-center gap-2 px-4 py-2"
                      >
                        View on IGDB
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
