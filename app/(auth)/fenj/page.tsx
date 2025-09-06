"use client";

import type { JSX } from "react";
import type { TUser } from "@/lib/types/user.type";

import { ArrowDown, ArrowUp, Calendar, ChevronDown, Clock, Filter, MapPin, Plus, Search, Trophy, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Tilt from "react-parallax-tilt";

import { FenjAddModal } from "@/components/fenj-add-modal";
import { FieldAddModal } from "@/components/field-add-modal";
import { Button } from "@/components/ui/button";
import { isFenjer } from "@/lib/helpers/permission.helper";
import { usePageReady } from "@/lib/hooks/use-page-ready";
import { useUser } from "@/lib/hooks/use-user";



interface Field {
  id: string;
  name: string;
  location: string;
}

interface Match {
  id: string;
  timestamp: number;
  field_id: string;
  message: string;
}

interface MatchWithField extends Match {
  field_name?: string;
}

type TabType = "fields" | "matches" | "fut";

function FieldCard({ field, matchCount }: { field: Field; matchCount: number }): JSX.Element {
  const handleLocationClick = () => {
    window.open(field.location, "_blank");
  };

  return (
    <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200">
      {/* Field Info */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <MapPin className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-black text-black uppercase tracking-wide">{field.name}</h3>
        </div>

        {/* Match Count */}
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-purple-600" />
          <span className="text-lg font-bold text-gray-700">
            {matchCount}
            {" "}
            match
            {matchCount !== 1 ? "es" : ""}
            {" "}
            played
          </span>
        </div>

        <Button
          onClick={handleLocationClick}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-100 flex items-center gap-2"
        >
          <MapPin className="w-4 h-4" />
          View Location
        </Button>
      </div>
    </div>
  );
}

function UpcomingMatch({ match }: { match: MatchWithField | null }): JSX.Element {
  if (!match) {
    return (
      <div className="bg-gray-100 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-2xl font-black text-gray-600 mb-2">No Upcoming Matches</h3>
        <p className="text-lg font-bold text-gray-500">Check back later for scheduled games</p>
      </div>
    );
  }

  const matchDate = new Date(match.timestamp * 1000);
  const now = new Date();
  const isToday = matchDate.toDateString() === now.toDateString();
  const isTomorrow = matchDate.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();

  let dateDisplay = matchDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (isToday) {
    dateDisplay = "Today";
  }
  else if (isTomorrow) {
    dateDisplay = "Tomorrow";
  }

  const timeDisplay = matchDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-yellow-300 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
      <div className="bg-yellow-400 border-b-4 border-black p-4">
        <div className="flex items-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-700" />
          <h3 className="text-3xl font-black text-black uppercase tracking-wider">Next Match</h3>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-black" />
          <span className="text-xl font-black text-black">{dateDisplay}</span>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="w-6 h-6 text-black" />
          <span className="text-xl font-black text-black">{timeDisplay}</span>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="w-6 h-6 text-black" />
          <span className="text-lg font-bold text-black">{match.field_name || "Unknown Field"}</span>
        </div>
        {match.message && (
          <div className="bg-white border-2 border-black p-3 mt-4">
            <p className="text-lg font-bold text-black">{match.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MatchesTable({
  matches,
  fields,
  user,
  showAddModal: _showAddModal,
  setShowAddModal,
}: {
  matches: MatchWithField[];
  fields: Field[];
  user: TUser | null;
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
}): JSX.Element {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedField, setSelectedField] = useState<string>("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: "timestamp" | "field_name" | "message";
    direction: "asc" | "desc";
  }>({
    key: "timestamp",
    direction: "desc",
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Helper function to get field location by field_id
  const getFieldLocation = (fieldId: string): string | null => {
    const field = fields.find(f => f.id === fieldId);

    return field?.location || null;
  };

  const handleFieldClick = (fieldId: string) => {
    const location = getFieldLocation(fieldId);

    if (location) {
      window.open(location, "_blank");
    }
  };

  const handleSort = (key: "timestamp" | "field_name" | "message") => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIcon = (columnKey: "timestamp" | "field_name" | "message") => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUp className="w-4 h-4 text-gray-400" />;
    }

    return sortConfig.direction === "asc"
      ? <ArrowUp className="w-4 h-4 text-white" />
      : <ArrowDown className="w-4 h-4 text-white" />;
  };

  const handleFieldSelect = (fieldId: string) => {
    setSelectedField(fieldId);
    setIsDropdownOpen(false);
  };

  const getSelectedFieldName = () => {
    if (selectedField === "all") {
      return "All Fields";
    }
    const field = fields.find(f => f.id === selectedField);

    return field?.name || "All Fields";
  };

  // Filter and sort matches
  const filteredAndSortedMatches = [...matches]
    .filter((match) => {
      // Search filter
      const matchesSearch = searchTerm === ""
        || (match.field_name?.toLowerCase().includes(searchTerm.toLowerCase()))
        || (match.message?.toLowerCase().includes(searchTerm.toLowerCase()));

      // Field filter
      const matchesField = selectedField === "all" || match.field_id === selectedField;

      return matchesSearch && matchesField;
    })
    .sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortConfig.key) {
        case "timestamp":
          aValue = a.timestamp;
          bValue = b.timestamp;
          break;

        case "field_name":
          aValue = a.field_name || "";
          bValue = b.field_name || "";
          break;

        case "message":
          aValue = a.message || "";
          bValue = b.message || "";
          break;

        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }

      return 0;
    });

  return (
    <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="bg-purple-400 border-b-4 border-black p-4">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-6 h-6 text-purple-700" />
          <h3 className="text-2xl font-black text-black uppercase tracking-wider">All Matches</h3>
          <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-black">
            {filteredAndSortedMatches.length}
          </span>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
            <input
              type="text"
              placeholder="Search matches or fields..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-black bg-white border-2 border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-1px] focus:translate-y-[-1px] transition-all duration-200 outline-none placeholder-gray-500"
            />
          </div>

          {/* Field Filter */}
          <div className="relative" ref={dropdownRef}>
            <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="pl-10 pr-8 py-2 text-black bg-white border-2 border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-1px] focus:translate-y-[-1px] transition-all duration-200 outline-none min-w-[150px] cursor-pointer flex items-center justify-between"
            >
              <span className="truncate">{getSelectedFieldName()}</span>
              <ChevronDown className={`w-4 h-4 ml-2 flex-shrink-0 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Custom Dropdown */}
            {isDropdownOpen && (
              <div className="animate__animated animate__bounceIn animate__faster absolute top-full left-0 right-0 mt-1 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50">
                <div
                  onClick={() => handleFieldSelect("all")}
                  className={`px-4 py-2 font-bold text-black cursor-pointer border-b border-gray-200 hover:bg-purple-100 transition-colors ${
                    selectedField === "all" ? "bg-purple-200" : ""
                  }`}
                >
                  All Fields
                </div>
                {fields.map(field => (
                  <div
                    key={field.id}
                    onClick={() => handleFieldSelect(field.id)}
                    className={`px-4 py-2 font-bold text-black cursor-pointer border-b border-gray-200 last:border-b-0 hover:bg-purple-100 transition-colors ${
                      selectedField === field.id ? "bg-purple-200" : ""
                    }`}
                  >
                    {field.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Match Button - Only show for Fenjers */}
          {user && isFenjer(user) && (
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-green-500 hover:bg-green-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition-all duration-100"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Match
            </Button>
          )}
        </div>
      </div>

      {filteredAndSortedMatches.length === 0
        ? (
            <div className="p-8 text-center">
              {matches.length === 0
                ? (
                    <>
                      <p className="text-xl font-black text-gray-600">No matches found</p>
                      <p className="text-sm font-bold text-gray-500 mt-2">Matches will appear here when scheduled</p>
                    </>
                  )
                : (
                    <>
                      <p className="text-xl font-black text-gray-600">No matches match your filters</p>
                      <p className="text-sm font-bold text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
                    </>
                  )}
            </div>
          )
        : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-black text-white">
                    <th
                      className="px-4 py-3 text-left font-black uppercase tracking-wide cursor-pointer hover:bg-gray-800 transition-colors"
                      onClick={() => handleSort("timestamp")}
                    >
                      <div className="flex items-center gap-2">
                        Date & Time
                        {getSortIcon("timestamp")}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left font-black uppercase tracking-wide cursor-pointer hover:bg-gray-800 transition-colors"
                      onClick={() => handleSort("field_name")}
                    >
                      <div className="flex items-center gap-2">
                        Field
                        {getSortIcon("field_name")}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left font-black uppercase tracking-wide cursor-pointer hover:bg-gray-800 transition-colors"
                      onClick={() => handleSort("message")}
                    >
                      <div className="flex items-center gap-2">
                        Message
                        {getSortIcon("message")}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedMatches.map((match, index) => (
                    <tr
                      key={match.id}
                      className={`border-t-2 border-black ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-yellow-100 transition-colors`}
                    >
                      <td className="px-4 py-3 font-bold text-black">
                        {new Date(match.timestamp * 1000).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        {getFieldLocation(match.field_id)
                          ? (
                              <button
                                onClick={() => handleFieldClick(match.field_id)}
                                className="font-black text-purple-700 hover:text-purple-900 underline decoration-2 underline-offset-2 hover:decoration-purple-900 transition-colors"
                              >
                                {match.field_name || "Unknown Field"}
                              </button>
                            )
                          : (
                              <span className="font-black text-purple-700">
                                {match.field_name || "Unknown Field"}
                              </span>
                            )}
                      </td>
                      <td className="px-4 py-3 font-bold text-black">
                        {match.message || "No message"}
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
 * Fenj page showing football fields and matches
 *
 * @returns The fenj page component
 */
export default function FenjPage(): JSX.Element {
  usePageReady();

  const { user } = useUser();
  const [fields, setFields] = useState<Field[]>([]);
  const [matches, setMatches] = useState<MatchWithField[]>([]);
  const [isLoadingFields, setIsLoadingFields] = useState(true);
  const [isLoadingMatches, setIsLoadingMatches] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("matches");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFieldAddModal, setShowFieldAddModal] = useState(false);

  // FUT card state
  const [futCardUrl, setFutCardUrl] = useState<string | null>(null);
  const [isLoadingFutCard, setIsLoadingFutCard] = useState(false);
  const [futError, setFutError] = useState<string | null>(null);
  const [lastGeneratedTime, setLastGeneratedTime] = useState<number>(0);
  const [currentCardType, setCurrentCardType] = useState<string>("common_gold");
  const [selectedCardType, setSelectedCardType] = useState<string>("common_gold");
  const [isCardTypeDropdownOpen, setIsCardTypeDropdownOpen] = useState(false);
  const [isUpdatingCardType, setIsUpdatingCardType] = useState(false);
  const cardTypeDropdownRef = useRef<HTMLDivElement>(null);

  // Card types from FUT card generator
  const cardTypes = [
    { code: "common_bronze", name: "Common Bronze" },
    { code: "common_silver", name: "Common Silver" },
    { code: "common_gold", name: "Common Gold" },
    { code: "rare_bronze", name: "Rare Bronze" },
    { code: "rare_silver", name: "Rare Silver" },
    { code: "rare_gold", name: "Rare Gold" },
    { code: "if_bronze", name: "IF Bronze" },
    { code: "if_silver", name: "IF Silver" },
    { code: "if_gold", name: "IF Gold" },
    { code: "fc_bronze", name: "FC Bronze" },
    { code: "fc_silver", name: "FC Silver" },
    { code: "fc_gold", name: "FC Gold" },
    { code: "motm", name: "MOTM" },
    { code: "pl_potm", name: "PL POTM" },
    { code: "bl_potm", name: "BL POTM" },
    { code: "futties", name: "Futties" },
    { code: "futtiesw", name: "FuttiesW" },
    { code: "toty", name: "TOTY" },
    { code: "toty_n", name: "TOTY Nominees" },
    { code: "el", name: "Europa League" },
    { code: "el_motm", name: "EL MOTM" },
    { code: "el_live", name: "EL Live" },
    { code: "el_sbc", name: "EL SBC" },
    { code: "el_tott", name: "EL TOTT" },
    { code: "common_ucl", name: "Common UCL" },
    { code: "rare_ucl", name: "Rare UCL" },
    { code: "ucl_motm", name: "UCL MOTM" },
    { code: "ucl_live", name: "UCL Live" },
    { code: "ucl_sbc", name: "UCL SBC" },
    { code: "ucl_tott", name: "UCL TOTT" },
    { code: "fsr", name: "FUT Swap Rewards" },
    { code: "fs", name: "Future Stars" },
    { code: "fsn", name: "Future Stars Nominees" },
    { code: "pp", name: "Pro Player" },
    { code: "cb", name: "Carniball" },
    { code: "rb", name: "Record Breaker" },
    { code: "hero", name: "Hero" },
    { code: "aw", name: "Award Winner" },
    { code: "fb", name: "Flashback" },
    { code: "headliners", name: "Headliners" },
    { code: "cc", name: "Concept" },
    { code: "sbc", name: "SBC" },
    { code: "sbcp", name: "SBC Premium" },
    { code: "legend", name: "Legend" },
    { code: "fs1", name: "FUT Swap 1" },
    { code: "fs2", name: "FUT Swap 2" },
    { code: "fs3", name: "FUT Swap 3" },
    { code: "fs4", name: "FUT Swap 4" },
    { code: "fs5", name: "FUT Swap 5" },
    { code: "fs6", name: "FUT Swap 6" },
    { code: "fs7", name: "FUT Swap 7" },
    { code: "fs8", name: "FUT Swap 8" },
    { code: "fs9", name: "FUT Swap 9" },
    { code: "fs10", name: "FUT Swap 10" },
    { code: "fs11", name: "FUT Swap 11" },
    { code: "otw", name: "Ones to Watch" },
    { code: "st_patricks", name: "St. Patrick's" },
  ];

  // Close card type dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardTypeDropdownRef.current && !cardTypeDropdownRef.current.contains(event.target as Node)) {
        setIsCardTypeDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch fields data
  const fetchFields = async () => {
    try {
      setIsLoadingFields(true);
      const response = await fetch("/api/fields");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch fields");
      }

      setFields(data.fields || []);
    }
    catch (err) {
      console.error("Error fetching fields:", err);
      setError(err instanceof Error ? err.message : "Failed to load fields");
    }
    finally {
      setIsLoadingFields(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  // Fetch matches data
  const fetchMatches = async () => {
    try {
      setIsLoadingMatches(true);
      const response = await fetch("/api/matches");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch matches");
      }

      setMatches(data.matches || []);
    }
    catch (err) {
      console.error("Error fetching matches:", err);
      setError(err instanceof Error ? err.message : "Failed to load matches");
    }
    finally {
      setIsLoadingMatches(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const upcomingMatch = matches
    .filter(match => match.timestamp > Date.now() / 1000)
    .sort((a, b) => a.timestamp - b.timestamp)[0] || null;

  // Helper function to get match count for a field
  const getMatchCountForField = (fieldId: string): number => {
    return matches.filter(match => match.field_id === fieldId).length;
  };

  // Generate FUT card from real FENJ data
  const generateFutCard = async (cardType?: string) => {
    try {
      // Rate limiting: prevent requests more than once every 10 seconds
      const now = Date.now();
      const timeSinceLastGeneration = now - lastGeneratedTime;
      const minInterval = 10 * 1000; // 10 seconds

      if (timeSinceLastGeneration < minInterval && futCardUrl && !cardType) {
        setFutError(`Please wait ${Math.ceil((minInterval - timeSinceLastGeneration) / 1000)} more seconds before generating a new card.`);

        return;
      }

      setIsLoadingFutCard(true);
      setFutError(null);

      // Check localStorage cache first (with 5 minute TTL) - but only if no specific cardType requested
      const cacheKey = `fut_card_${user?.id}_${cardType || currentCardType}`;
      const cachedData = localStorage.getItem(cacheKey);

      if (cachedData && !cardType) {
        try {
          const { imageUrl, timestamp, cardType: cachedCardType } = JSON.parse(cachedData);
          const cacheAge = now - timestamp;
          const cacheMaxAge = 5 * 60 * 1000; // 5 minutes

          if (cacheAge < cacheMaxAge && imageUrl) {
            setFutCardUrl(imageUrl);
            setCurrentCardType(cachedCardType || "common_gold");
            setSelectedCardType(cachedCardType || "common_gold");
            setLastGeneratedTime(timestamp);

            return;
          }
          else {
            // Remove expired cache
            localStorage.removeItem(cacheKey);
          }
        }
        catch {
          // Invalid cache data, remove it
          localStorage.removeItem(cacheKey);
        }
      }

      // Call API with optional cardType in body
      const requestBody = cardType ? { cardType } : {};
      const response = await fetch("/api/fenj/fut", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate FUT card");
      }

      setFutCardUrl(data.imageUrl);
      setCurrentCardType(data.cardType || "common_gold");
      setSelectedCardType(data.cardType || "common_gold");
      setLastGeneratedTime(now);

      // Cache the result in localStorage
      try {
        const newCacheKey = `fut_card_${user?.id}_${data.cardType || "common_gold"}`;

        localStorage.setItem(newCacheKey, JSON.stringify({
          imageUrl: data.imageUrl,
          cardType: data.cardType,
          timestamp: now,
        }));
      }
      catch {
        // Storage quota exceeded or disabled, continue without caching
      }
    }
    catch (err) {
      console.error("Error generating FUT card:", err);
      setFutError(err instanceof Error ? err.message : "Failed to generate FUT card");
    }
    finally {
      setIsLoadingFutCard(false);
    }
  };

  // Update card type and regenerate
  const updateCardType = async () => {
    if (selectedCardType === currentCardType || isUpdatingCardType) {
      return;
    }

    setIsUpdatingCardType(true);

    try {
      // Clear existing cache for current card type
      Object.keys(localStorage)
        .filter(key => key.startsWith(`fut_card_${user?.id}_`))
        .forEach(key => localStorage.removeItem(key));

      // Generate with new card type
      await generateFutCard(selectedCardType);
      setIsCardTypeDropdownOpen(false);
    }
    catch (err) {
      console.error("Error updating card type:", err);
      setFutError(err instanceof Error ? err.message : "Failed to update card type");
    }
    finally {
      setIsUpdatingCardType(false);
    }
  };

  // Auto-generate FUT card when FUT tab is selected
  useEffect(() => {
    if (activeTab === "fut" && !futCardUrl && !isLoadingFutCard && user?.id) {
      // Try to load from most recent cache first
      const cacheKeys = Object.keys(localStorage).filter(key => key.startsWith(`fut_card_${user.id}_`));
      let mostRecentCache = null;
      let mostRecentTime = 0;

      for (const key of cacheKeys) {
        try {
          const cached = JSON.parse(localStorage.getItem(key) || "{}");

          if (cached.timestamp > mostRecentTime) {
            mostRecentTime = cached.timestamp;
            mostRecentCache = cached;
          }
        }
        catch {
          // Invalid cache entry, remove it
          localStorage.removeItem(key);
        }
      }

      if (mostRecentCache) {
        const cacheAge = Date.now() - mostRecentCache.timestamp;
        const cacheMaxAge = 5 * 60 * 1000; // 5 minutes

        if (cacheAge < cacheMaxAge && mostRecentCache.imageUrl) {
          setFutCardUrl(mostRecentCache.imageUrl);
          setCurrentCardType(mostRecentCache.cardType || "common_gold");
          setSelectedCardType(mostRecentCache.cardType || "common_gold");
          setLastGeneratedTime(mostRecentCache.timestamp);

          return;
        }
        else {
          // Remove expired caches
          cacheKeys.forEach(key => localStorage.removeItem(key));
        }
      }

      // No valid cache, generate new card
      generateFutCard();
    }
  }, [activeTab, futCardUrl, isLoadingFutCard, user?.id]);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-16 px-4">
          <h1 className="text-4xl sm:text-6xl font-black text-black uppercase tracking-wider transform rotate-2 bg-green-400 inline-block px-6 sm:px-8 py-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Fenj
          </h1>
          <p className="text-lg sm:text-xl font-bold text-black bg-white inline-block px-4 sm:px-6 py-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
            Football Fields & Matches
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-flex">
            <button
              onClick={() => setActiveTab("matches")}
              className={`px-8 py-4 font-black text-lg uppercase tracking-wide transition-all duration-200 ${
                activeTab === "matches"
                  ? "bg-purple-400 text-black"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              Matches
            </button>
            <div className="w-0.5 bg-black"></div>
            <button
              onClick={() => setActiveTab("fields")}
              className={`px-8 py-4 font-black text-lg uppercase tracking-wide transition-all duration-200 ${
                activeTab === "fields"
                  ? "bg-green-400 text-black"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              Fields
            </button>
            <div className="w-0.5 bg-black"></div>
            <button
              onClick={() => setActiveTab("fut")}
              className={`px-8 py-4 font-black text-lg uppercase tracking-wide transition-all duration-200 ${
                activeTab === "fut"
                  ? "bg-yellow-400 text-black"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              FUT
            </button>
          </div>
        </div>

        {/* Content */}
        {error
          ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8">
                  <p className="text-2xl font-black text-red-600 mb-4">Failed to load data</p>
                  <p className="text-lg font-bold text-gray-700 mb-6">{error}</p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-100"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )
          : (
              <div className="space-y-8">
                {/* Matches Tab */}
                {activeTab === "matches" && (
                  <div className="space-y-8">
                    {isLoadingMatches
                      ? (
                          <div className="flex items-center justify-center min-h-[400px]">
                            <div className="text-center bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8">
                              <div className="animate-spin w-16 h-16 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
                              <p className="text-2xl font-black text-black">Loading matches...</p>
                            </div>
                          </div>
                        )
                      : (
                          <>
                            {/* Upcoming Match Section */}
                            <UpcomingMatch match={upcomingMatch} />

                            {/* All Matches Table */}
                            <MatchesTable
                              matches={matches}
                              fields={fields}
                              user={user || null}
                              showAddModal={showAddModal}
                              setShowAddModal={setShowAddModal}
                            />
                          </>
                        )}
                  </div>
                )}

                {/* Fields Tab */}
                {activeTab === "fields" && (
                  <div>
                    {/* Add Field Button - Only show for Fenjers */}
                    {user && isFenjer(user) && (
                      <div className="mb-6 flex justify-end">
                        <Button
                          onClick={() => setShowFieldAddModal(true)}
                          className="bg-purple-500 hover:bg-purple-600 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition-all duration-100"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Field
                        </Button>
                      </div>
                    )}

                    {isLoadingFields
                      ? (
                          <div className="flex items-center justify-center min-h-[400px]">
                            <div className="text-center bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8">
                              <div className="animate-spin w-16 h-16 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
                              <p className="text-2xl font-black text-black">Loading fields...</p>
                            </div>
                          </div>
                        )
                      : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {fields.map(field => (
                              <FieldCard
                                key={field.id}
                                field={field}
                                matchCount={getMatchCountForField(field.id)}
                              />
                            ))}
                            {fields.length === 0 && (
                              <div className="col-span-full text-center bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8">
                                <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-2xl font-black text-gray-600">No fields available</p>
                                <p className="text-lg font-bold text-gray-500 mt-2">Fields will appear here when added</p>
                              </div>
                            )}
                          </div>
                        )}
                  </div>
                )}

                {/* FUT Tab */}
                {activeTab === "fut" && (
                  <div className="flex flex-col items-center space-y-8">
                    <div className="text-center space-y-4">
                      <h2 className="text-3xl font-black text-black uppercase tracking-wider">
                        Your FUT Card
                      </h2>
                      <p className="text-lg font-bold text-gray-700">
                        Generate your FIFA Ultimate Team card based on your FENJ stats
                      </p>
                    </div>

                    {/* Card Type Selector */}
                    <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <label className="text-lg font-black text-black uppercase tracking-wider">
                          Card Type:
                        </label>

                        <div className="relative" ref={cardTypeDropdownRef}>
                          <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
                          <button
                            onClick={() => setIsCardTypeDropdownOpen(!isCardTypeDropdownOpen)}
                            className="pl-10 pr-8 py-2 text-black bg-white border-2 border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-1px] focus:translate-y-[-1px] transition-all duration-200 outline-none min-w-[200px] cursor-pointer flex items-center justify-between"
                          >
                            <span className="truncate">
                              {cardTypes.find(type => type.code === selectedCardType)?.name || "Common Gold"}
                            </span>
                            <ChevronDown className={`w-4 h-4 ml-2 flex-shrink-0 transition-transform duration-200 ${isCardTypeDropdownOpen ? "rotate-180" : ""}`} />
                          </button>

                          {/* Custom Dropdown */}
                          {isCardTypeDropdownOpen && (
                            <div className="animate__animated animate__bounceIn animate__faster absolute top-full left-0 right-0 mt-1 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 max-h-64 overflow-y-auto">
                              {cardTypes.map(type => (
                                <div
                                  key={type.code}
                                  onClick={() => {
                                    setSelectedCardType(type.code);
                                    setIsCardTypeDropdownOpen(false);
                                  }}
                                  className={`px-4 py-2 font-bold text-black cursor-pointer border-b border-gray-200 last:border-b-0 hover:bg-purple-100 transition-colors ${
                                    selectedCardType === type.code ? "bg-purple-200" : ""
                                  }`}
                                >
                                  {type.name}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Confirm Button */}
                        {selectedCardType !== currentCardType && (
                          <Button
                            onClick={updateCardType}
                            disabled={isUpdatingCardType}
                            className="bg-green-500 hover:bg-green-600 text-white font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-100 px-6 py-3"
                          >
                            {isUpdatingCardType ? "Updating..." : "Confirm"}
                          </Button>
                        )}
                      </div>
                    </div>

                    {futError
                      ? (
                          <div className="text-center bg-red-100 border-4 border-red-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8">
                            <p className="text-xl font-black text-red-600 mb-4">Failed to generate FUT card</p>
                            <p className="text-base font-bold text-red-500 mb-6">{futError}</p>
                            <Button
                              onClick={() => generateFutCard()}
                              className="bg-blue-500 hover:bg-blue-600 text-white font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-100"
                            >
                              Try Again
                            </Button>
                          </div>
                        )
                      : isLoadingFutCard
                        ? (
                            <div className="text-center bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8">
                              <div className="animate-spin w-16 h-16 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
                              <p className="text-2xl font-black text-black">Generating FUT card...</p>
                              <p className="text-base font-bold text-gray-600 mt-2">This may take a few seconds</p>
                            </div>
                          )
                        : futCardUrl
                          ? (
                              <div className="flex flex-col items-center">
                                {/* FUT Card with Tilt Effect */}
                                <Tilt
                                  tiltMaxAngleX={15}
                                  tiltMaxAngleY={15}
                                  perspective={1000}
                                  scale={1.05}
                                  transitionSpeed={1500}
                                  gyroscope={true}
                                  glareEnable={true}
                                  glareMaxOpacity={0.45}
                                >
                                  <img
                                    alt="Your FUT Card"
                                    className="w-full h-auto object-contain max-w-md"
                                    src={futCardUrl}
                                  />
                                </Tilt>
                              </div>
                            )
                          : (
                              <div className="text-center bg-gray-100 border-4 border-gray-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8">
                                <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-2xl font-black text-gray-600">No FUT card generated yet</p>
                                <p className="text-base font-bold text-gray-500 mt-2 mb-6">Click the button below to generate your card</p>
                                <Button
                                  onClick={() => generateFutCard()}
                                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 px-8 py-3 text-lg uppercase tracking-wider"
                                >
                                  <Trophy className="w-5 h-5 mr-2" />
                                  Generate FUT Card
                                </Button>
                              </div>
                            )}
                  </div>
                )}
              </div>
            )}
      </div>

      {/* Add Match Modal */}
      <FenjAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        fields={fields}
        onSuccess={() => {
          fetchMatches();
        }}
      />

      {/* Add Field Modal */}
      <FieldAddModal
        isOpen={showFieldAddModal}
        onClose={() => setShowFieldAddModal(false)}
        onSuccess={() => {
          fetchFields();
        }}
      />
    </div>
  );
}
