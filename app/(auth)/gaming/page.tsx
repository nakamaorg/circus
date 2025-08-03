"use client";

import type { JSX } from "react";

import { ArrowDown, ArrowUp, ChevronDown, Crown, Filter, Gamepad2, Search, Trophy } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { useGameEndorsements } from "@/lib/hooks/use-game-endorsements";
import { useGames } from "@/lib/hooks/use-games";
import { usePageReady } from "@/lib/hooks/use-page-ready";
import { useUsers } from "@/lib/hooks/use-users";



type TabType = "endorsements" | "games";

interface EndorsementData {
  game_id: number;
  endorsements: number;
}

interface UserEndorsementData {
  discord_id: string;
  endorsements: number;
}

interface Game {
  id: number;
  name: string;
  cover_url?: string;
  first_release_date?: number;
  rating?: number;
  url?: string;
}

interface User {
  discord_id: string;
  username: string;
}

interface GameLeaderboardItem {
  game_id: number;
  endorsements: number;
  game: Game | undefined;
  name: string;
  key: string;
  rank: number;
}

interface EndorsementsTableProps {
  endorsements: EndorsementData[] | UserEndorsementData[];
  games: Game[];
  users: User[];
  type: "my" | "game" | "global";
}

interface EndorsementTypeFilterProps {
  endorsementType: "my" | "game" | "global";
  selectedGameId?: number;
  onTypeChange: (type: "my" | "game" | "global") => void;
  onGameIdChange: (gameId?: number) => void;
}

function EndorsementTypeFilter({
  endorsementType,
  selectedGameId,
  onTypeChange,
  onGameIdChange,
}: EndorsementTypeFilterProps): JSX.Element {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getEndorsementTypeName = () => {
    switch (endorsementType) {
      case "my":
        return "My Endorsements";

      case "game":
        return selectedGameId ? `Game ${selectedGameId} Endorsements` : "Select Game";

      case "global":
        return "Global Endorsements";

      default:
        return "My Endorsements";
    }
  };

  const handleTypeSelect = (type: "my" | "game" | "global") => {
    onTypeChange(type);
    setIsDropdownOpen(false);
    if (type !== "game") {
      onGameIdChange(undefined);
    }
  };

  return (
    <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="bg-blue-400 border-b-4 border-black p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className="w-6 h-6 text-yellow-600" />
            <h3 className="text-2xl font-black text-black uppercase tracking-wider">Game Endorsements Leaderboard</h3>
          </div>

          {/* Endorsement Type Filter */}
          <div className="relative" ref={dropdownRef}>
            <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="pl-10 pr-8 py-2 text-black bg-white border-2 border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-1px] focus:translate-y-[-1px] transition-all duration-200 outline-none min-w-[200px] cursor-pointer flex items-center justify-between"
            >
              <span className="truncate">{getEndorsementTypeName()}</span>
              <ChevronDown className={`w-4 h-4 ml-2 flex-shrink-0 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Custom Dropdown */}
            {isDropdownOpen && (
              <div className="animate__animated animate__bounceIn animate__faster absolute top-full left-0 right-0 mt-1 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50">
                <div
                  onClick={() => handleTypeSelect("my")}
                  className={`px-4 py-2 font-bold text-black cursor-pointer border-b border-gray-200 hover:bg-purple-100 transition-colors ${
                    endorsementType === "my" ? "bg-purple-200" : ""
                  }`}
                >
                  My Endorsements
                </div>
                <div
                  onClick={() => handleTypeSelect("global")}
                  className={`px-4 py-2 font-bold text-black cursor-pointer border-b border-gray-200 hover:bg-purple-100 transition-colors ${
                    endorsementType === "global" ? "bg-purple-200" : ""
                  }`}
                >
                  Global Endorsements
                </div>
                <div
                  onClick={() => handleTypeSelect("game")}
                  className={`px-4 py-2 font-bold text-black cursor-pointer border-b border-gray-200 last:border-b-0 hover:bg-purple-100 transition-colors ${
                    endorsementType === "game" ? "bg-purple-200" : ""
                  }`}
                >
                  Endorsements by Game
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EndorsementsTable({
  endorsements,
  games,
  users,
  type,
}: EndorsementsTableProps): JSX.Element {
  const [sortConfig, setSortConfig] = useState<{
    key: "rank" | "name" | "endorsements";
    direction: "asc" | "desc";
  }>({
    key: "endorsements",
    direction: "desc",
  });

  const handleSort = (key: "rank" | "name" | "endorsements") => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIcon = (columnKey: "rank" | "name" | "endorsements") => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUp className="w-4 h-4 text-gray-400" />;
    }

    return sortConfig.direction === "asc"
      ? <ArrowUp className="w-4 h-4 text-white" />
      : <ArrowDown className="w-4 h-4 text-white" />;
  };

  // Create leaderboard data with game/user info
  const leaderboardData = endorsements.map((endorsement) => {
    if (type === "global") {
      // For global endorsements, we have user data
      const userEndorsement = endorsement as UserEndorsementData;
      const user = users.find(u => u.discord_id === userEndorsement.discord_id);

      return {
        ...userEndorsement,
        user,
        name: user?.username || `User ${userEndorsement.discord_id}`,
        key: userEndorsement.discord_id,
      };
    }
    else {
      // For my/game endorsements, we have game data
      const gameEndorsement = endorsement as EndorsementData;
      const game = games.find(g => g.id === gameEndorsement.game_id);

      return {
        ...gameEndorsement,
        game,
        name: game?.name || `Game ${gameEndorsement.game_id}`,
        key: gameEndorsement.game_id.toString(),
      };
    }
  }).sort((a, b) => {
    switch (sortConfig.key) {
      case "endorsements": {
        return sortConfig.direction === "asc"
          ? a.endorsements - b.endorsements
          : b.endorsements - a.endorsements;
      }

      case "name": {
        return sortConfig.direction === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }

      case "rank": {
        // For rank, we want to sort by endorsements (opposite of endorsements sort)
        return sortConfig.direction === "asc"
          ? b.endorsements - a.endorsements
          : a.endorsements - b.endorsements;
      }

      default:
        return 0;
    }
  });

  // Add rank to sorted data
  const rankedData = leaderboardData.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));

  return (
    <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="bg-blue-400 border-b-4 border-black p-4">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-yellow-600" />
          <h3 className="text-xl font-black text-black uppercase tracking-wider">Results</h3>
          <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-black">
            {rankedData.length}
          </span>
        </div>
      </div>

      {rankedData.length === 0
        ? (
            <div className="p-8 text-center">
              <p className="text-xl font-black text-gray-600">No endorsements found</p>
              <p className="text-sm font-bold text-gray-500 mt-2">Start endorsing games to see them here</p>
            </div>
          )
        : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-black text-white">
                    <th
                      className="px-4 py-3 text-left font-black uppercase tracking-wide cursor-pointer hover:bg-gray-800 transition-colors"
                      onClick={() => handleSort("rank")}
                    >
                      <div className="flex items-center gap-2">
                        Rank
                        {getSortIcon("rank")}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left font-black uppercase tracking-wide cursor-pointer hover:bg-gray-800 transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-2">
                        {type === "global" ? "User" : "Game"}
                        {getSortIcon("name")}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left font-black uppercase tracking-wide cursor-pointer hover:bg-gray-800 transition-colors"
                      onClick={() => handleSort("endorsements")}
                    >
                      <div className="flex items-center gap-2">
                        Endorsements
                        {getSortIcon("endorsements")}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rankedData.map((item, index) => (
                    <tr
                      key={item.key}
                      className={`border-t-2 border-black ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-yellow-100 transition-colors`}
                    >
                      <td className="px-4 py-3">
                        <div
                          className={`w-8 h-8 flex items-center justify-center border-2 border-black font-black text-sm ${
                            item.rank === 1
                              ? "bg-yellow-400"
                              : item.rank === 2
                                ? "bg-gray-300"
                                : item.rank === 3
                                  ? "bg-orange-300"
                                  : "bg-white"
                          }`}
                        >
                          {item.rank}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {type === "global"
                          ? (
                              // For global endorsements, show user info (no avatar)
                              <div className="flex-1 min-w-0">
                                <div className="font-black text-black text-lg truncate">
                                  {item.name}
                                </div>
                              </div>
                            )
                          : (
                              // For game endorsements, show game info with cover
                              <div className="flex items-center gap-4">
                                {(item as GameLeaderboardItem).game?.cover_url
                                  ? (
                                      <div className="w-12 h-12 overflow-hidden border-2 border-black flex-shrink-0">
                                        <img
                                          src={`https:${(item as GameLeaderboardItem).game!.cover_url}`}
                                          alt={(item as GameLeaderboardItem).game!.name}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    )
                                  : (
                                      <div className="w-12 h-12 bg-gray-200 border-2 border-black flex items-center justify-center flex-shrink-0">
                                        <Gamepad2 className="w-6 h-6 text-gray-500" />
                                      </div>
                                    )}
                                <div className="flex-1 min-w-0">
                                  <div className="font-black text-black text-lg truncate">
                                    {item.name}
                                  </div>
                                  {(item as GameLeaderboardItem).game?.first_release_date && (
                                    <div className="text-sm font-bold text-gray-600">
                                      Released:
                                      {" "}
                                      {new Date((item as GameLeaderboardItem).game!.first_release_date! * 1000).getFullYear()}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="bg-purple-400 border-2 border-black px-3 py-1 inline-block">
                          <div className="text-lg font-black text-black">
                            {item.endorsements}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
    </div>
  );
}

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
  const [endorsementType, setEndorsementType] = useState<"my" | "game" | "global">("my");
  const [selectedGameId, setSelectedGameId] = useState<number | undefined>(undefined);

  const { data: games, isLoading, error } = useGames();
  const { data: users } = useUsers();
  const { data: endorsements, isLoading: isLoadingEndorsements, error: endorsementsError } = useGameEndorsements({
    type: endorsementType,
    gameId: selectedGameId,
  });

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
        <h1 className="text-6xl font-black text-black uppercase tracking-wider transform -rotate-2 bg-red-400 inline-block px-8 py-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          Gaming
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
            Endorsements
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
            Games
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "endorsements" && (
        <div className="space-y-6">
          {isLoadingEndorsements && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-black border-t-transparent mx-auto mb-4"></div>
              <p className="text-xl font-bold text-black">
                Loading endorsements...
              </p>
            </div>
          )}

          {endorsementsError && (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">
                <Trophy className="h-16 w-16 mx-auto" />
              </div>
              <p className="text-xl font-bold text-black">
                Failed to load endorsements
              </p>
              <p className="text-base font-semibold text-gray-700 mt-2">
                {endorsementsError instanceof Error ? endorsementsError.message : "Unknown error occurred"}
              </p>
            </div>
          )}

          {!isLoadingEndorsements && !endorsementsError && (
            <>
              {/* Always show the dropdown filter */}
              <div className="mb-6">
                <EndorsementTypeFilter
                  endorsementType={endorsementType}
                  selectedGameId={selectedGameId}
                  onTypeChange={setEndorsementType}
                  onGameIdChange={setSelectedGameId}
                />
              </div>

              {endorsements && Object.keys(endorsements).length > 0
                ? (
                    <EndorsementsTable
                      endorsements={endorsementType === "global"
                        ? Object.entries(endorsements).map(([discord_id, endorsements]) => ({
                            discord_id,
                            endorsements,
                          }))
                        : Object.entries(endorsements).map(([game_id, endorsements]) => ({
                            game_id: Number.parseInt(game_id),
                            endorsements,
                          }))}
                      games={games || []}
                      users={users || []}
                      type={endorsementType}
                    />
                  )
                : (
                    <div className="text-center py-12">
                      <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-600" />
                      <p className="text-xl font-bold text-black">
                        No endorsements yet!
                      </p>
                      <p className="text-base font-semibold text-gray-700 mt-2">
                        Start endorsing games to see them here
                      </p>
                    </div>
                  )}
            </>
          )}
        </div>
      )}

      {activeTab === "games" && (
        <div className="space-y-6">
          {/* Search Input - only show when not loading */}
          {!isLoading && (
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
          )}

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
                    <div className="flex gap-4 mb-4">
                      {game.cover_url && (
                        <div className="w-16 h-16 flex-shrink-0 overflow-hidden border-2 border-black">
                          <img
                            src={`https:${game.cover_url}`}
                            alt={game.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-black text-black uppercase tracking-wide truncate">{game.name}</h3>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs font-bold text-gray-700">
                            Release:
                            {" "}
                            {new Date(game.first_release_date * 1000).getFullYear()}
                          </div>
                          <div className="text-xs font-bold text-gray-700">
                            ID:
                            {" "}
                            {game.id}
                          </div>
                        </div>
                      </div>
                    </div>

                    {game.url && (
                      <a
                        href={game.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-100 flex items-center justify-center gap-2 px-4 py-2 text-sm"
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
