"use client";

import type { JSX } from "react";

import { ArrowDown, ArrowUp, Calendar, Clock, Filter, MapPin, Search, Trophy, Users } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { usePageReady } from "@/lib/hooks/use-page-ready";



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

type TabType = "fields" | "matches";

function FieldCard({ field }: { field: Field }): JSX.Element {
  const handleLocationClick = () => {
    window.open(field.location, "_blank");
  };

  return (
    <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200">
      {/* Map Thumbnail */}
      <div className="h-48 border-b-4 border-black overflow-hidden relative cursor-pointer bg-gray-100 flex items-center justify-center" onClick={handleLocationClick}>
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-lg font-black text-gray-600">Map Preview</p>
        </div>
      </div>

      {/* Field Info */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-black text-black uppercase tracking-wide">{field.name}</h3>
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

function MatchesTable({ matches, fields }: { matches: MatchWithField[]; fields: Field[] }): JSX.Element {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedField, setSelectedField] = useState<string>("all");
  const [sortConfig, setSortConfig] = useState<{
    key: "timestamp" | "field_name" | "message";
    direction: "asc" | "desc";
  }>({
    key: "timestamp",
    direction: "desc",
  });

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
          <div className="relative">
            <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
            <select
              value={selectedField}
              onChange={e => setSelectedField(e.target.value)}
              className="pl-10 pr-8 py-2 text-black bg-white border-2 border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-1px] focus:translate-y-[-1px] transition-all duration-200 outline-none min-w-[150px] cursor-pointer"
            >
              <option value="all">All Fields</option>
              {fields.map(field => (
                <option key={field.id} value={field.id}>
                  {field.name}
                </option>
              ))}
            </select>
          </div>
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

  const [fields, setFields] = useState<Field[]>([]);
  const [matches, setMatches] = useState<MatchWithField[]>([]);
  const [isLoadingFields, setIsLoadingFields] = useState(true);
  const [isLoadingMatches, setIsLoadingMatches] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("matches");

  // Fetch fields data
  useEffect(() => {
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

    fetchFields();
  }, []);

  // Fetch matches data
  useEffect(() => {
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

    fetchMatches();
  }, []);

  const upcomingMatch = matches
    .filter(match => match.timestamp > Date.now() / 1000)
    .sort((a, b) => a.timestamp - b.timestamp)[0] || null;

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
                            <MatchesTable matches={matches} fields={fields} />
                          </>
                        )}
                  </div>
                )}

                {/* Fields Tab */}
                {activeTab === "fields" && (
                  <div>
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
                              <FieldCard key={field.id} field={field} />
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
              </div>
            )}
      </div>
    </div>
  );
}
