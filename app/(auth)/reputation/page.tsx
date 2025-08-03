"use client";

import type { JSX } from "react";

import { ArrowDown, ArrowUp, MessageSquareWarning, Search, ThumbsDown, ThumbsUp, Trophy, Users } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { usePageReady } from "@/lib/hooks/use-page-ready";



interface LWRecord {
  taker_id: string;
  giver_id: string;
  timestamp: number;
}

interface ReputationData {
  received: {
    ls: LWRecord[];
    ws: LWRecord[];
  };
  given: {
    ls: LWRecord[];
    ws: LWRecord[];
  };
  summary: {
    received_ls: number;
    received_ws: number;
    given_ls: number;
    given_ws: number;
  };
  users: {
    [userId: string]: string; // userId -> display name
  };
}

type SortField = "timestamp" | "giver_id" | "taker_id";
type SortDirection = "asc" | "desc";
type TabType = "received-ls" | "received-ws" | "given-ls" | "given-ws";

interface TableProps {
  title: string;
  data: LWRecord[];
  type: "received" | "given";
  icon: JSX.Element;
  bgColor: string;
  borderColor: string;
  users: { [userId: string]: string };
}

function ReputationTable({ title, data, type, icon, bgColor, borderColor, users }: TableProps): JSX.Element {
  const [sortField, setSortField] = useState<SortField>("timestamp");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    }
    else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    let aVal: string | number;
    let bVal: string | number;

    switch (sortField) {
      case "timestamp":
        aVal = a.timestamp;
        bVal = b.timestamp;
        break;

      case "giver_id":
        aVal = a.giver_id;
        bVal = b.giver_id;
        break;

      case "taker_id":
        aVal = a.taker_id;
        bVal = b.taker_id;
        break;

      default:
        aVal = a.timestamp;
        bVal = b.timestamp;
    }

    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    }

    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();

    if (sortDirection === "asc") {
      return aStr.localeCompare(bStr);
    }

    return bStr.localeCompare(aStr);
  });

  const filteredData = sortedData.filter((record) => {
    const searchLower = searchQuery.toLowerCase();

    return (
      record.giver_id.toLowerCase().includes(searchLower)
      || record.taker_id.toLowerCase().includes(searchLower)
      || new Date(record.timestamp * 1000).toLocaleDateString().includes(searchLower)
    );
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowDown className="w-3 h-3 opacity-50" />;
    }

    return sortDirection === "asc"
      ? <ArrowUp className="w-3 h-3" />
      : <ArrowDown className="w-3 h-3" />;
  };

  return (
    <div className={`${bgColor} border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
      {/* Header */}
      <div className={`${borderColor} border-b-4 border-black p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon}
            <h3 className="text-2xl font-black text-black uppercase tracking-wider">{title}</h3>
            <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-black">
              {data.length}
            </span>
          </div>
          {data.length > 0 && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search records..."
                className="w-64 h-10 pl-10 pr-4 text-sm font-bold text-black bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-1px] focus:translate-y-[-1px] transition-all duration-200 outline-none placeholder-gray-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      {data.length === 0
        ? (
            <div className="p-8 text-center">
              <p className="text-xl font-black text-gray-600">No records found</p>
              <p className="text-sm font-bold text-gray-500 mt-2">
                {type === "received" ? "You haven't received any yet" : "You haven't given any yet"}
              </p>
            </div>
          )
        : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="px-4 py-3 text-left font-black uppercase tracking-wide">
                      <button
                        onClick={() => handleSort("timestamp")}
                        className="flex items-center gap-2 hover:text-yellow-300 transition-colors"
                      >
                        Date
                        <SortIcon field="timestamp" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left font-black uppercase tracking-wide">
                      <button
                        onClick={() => handleSort(type === "received" ? "giver_id" : "taker_id")}
                        className="flex items-center gap-2 hover:text-yellow-300 transition-colors"
                      >
                        {type === "received" ? "From" : "To"}
                        <SortIcon field={type === "received" ? "giver_id" : "taker_id"} />
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((record, index) => {
                    const userId = type === "received" ? record.giver_id : record.taker_id;

                    // Check if it's a self-own (giver_id === taker_id)
                    const isSelfOwn = record.giver_id === record.taker_id;

                    // Determine the self-own message based on the table type
                    let selfOwnMessage = "Self Own";

                    if (isSelfOwn) {
                      if (title.includes("Received Ws")) {
                        selfOwnMessage = "Self Praise";
                      }
                      else {
                        selfOwnMessage = "Self Own";
                      }
                    }

                    const userName = isSelfOwn ? selfOwnMessage : (users[userId] || `User ${userId}`);

                    return (
                      <tr
                        key={`${record.timestamp}-${record.giver_id}-${record.taker_id}`}
                        className={`border-t-2 border-black ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-yellow-100 transition-colors`}
                      >
                        <td className="px-4 py-3 font-bold text-black">
                          {new Date(record.timestamp * 1000).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className={`px-4 py-3 font-black ${isSelfOwn ? "text-orange-600 italic" : "text-purple-700"}`}>
                          {userName}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredData.length === 0 && searchQuery && (
                <div className="p-6 text-center">
                  <p className="text-lg font-black text-gray-600">No matching records found</p>
                  <p className="text-sm font-bold text-gray-500 mt-1">
                    Try adjusting your search query
                  </p>
                </div>
              )}
            </div>
          )}
    </div>
  );
}

/**
 * @description
 * Reputation page showing user's track of received and given Ls and Ws
 *
 * @returns The reputation page component
 */
export default function ReputationPage(): JSX.Element {
  usePageReady();

  const [reputationData, setReputationData] = useState<ReputationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("received-ls");

  // Fetch reputation data
  useEffect(() => {
    const fetchReputationData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/reputation");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch reputation data");
        }

        setReputationData(data);
      }
      catch (err) {
        console.error("Error fetching reputation data:", err);
        setError(err instanceof Error ? err.message : "Failed to load reputation data");
      }
      finally {
        setIsLoading(false);
      }
    };

    fetchReputationData();
  }, []);

  // Handle scroll for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-16 px-4">
          <h1 className="text-4xl sm:text-6xl font-black text-black uppercase tracking-wider transform rotate-2 bg-yellow-400 inline-block px-6 sm:px-8 py-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Reputation
          </h1>
          <p className="text-lg sm:text-xl font-bold text-black bg-white inline-block px-4 sm:px-6 py-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
            {isLoading
              ? "Loading your reputation..."
              : "Track your Ls and Ws • Received and Given"}
          </p>
        </div>

        {isLoading
          ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8">
                  <div className="animate-spin w-16 h-16 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-2xl font-black text-black">Loading reputation...</p>
                </div>
              </div>
            )
          : error
            ? (
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="text-center bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8">
                    <p className="text-2xl font-black text-red-600 mb-4">Failed to load reputation</p>
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
            : reputationData && (
              <div className="space-y-8">
                {/* Summary Section - Now as Interactive Tabs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Received Ls */}
                  <button
                    onClick={() => setActiveTab("received-ls")}
                    className={`bg-red-300 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 p-6 transform -rotate-1 hover:rotate-0 cursor-pointer ${
                      activeTab === "received-ls" ? "scale-110 bg-red-400" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <ThumbsDown className="w-8 h-8 text-red-600" />
                      <h3 className="text-xl font-black text-black uppercase">Received Ls</h3>
                    </div>
                    <p className="text-4xl font-black text-red-700">{reputationData.summary.received_ls}</p>
                  </button>

                  {/* Received Ws */}
                  <button
                    onClick={() => setActiveTab("received-ws")}
                    className={`bg-green-300 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 p-6 transform rotate-1 hover:rotate-0 cursor-pointer ${
                      activeTab === "received-ws" ? "scale-110 bg-green-400" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <ThumbsUp className="w-8 h-8 text-green-600" />
                      <h3 className="text-xl font-black text-black uppercase">Received Ws</h3>
                    </div>
                    <p className="text-4xl font-black text-green-700">{reputationData.summary.received_ws}</p>
                  </button>

                  {/* Given Ls */}
                  <button
                    onClick={() => setActiveTab("given-ls")}
                    className={`bg-orange-300 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 p-6 transform -rotate-1 hover:rotate-0 cursor-pointer ${
                      activeTab === "given-ls" ? "scale-110 bg-orange-400" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <MessageSquareWarning className="w-8 h-8 text-orange-600" />
                      <h3 className="text-xl font-black text-black uppercase">Given Ls</h3>
                    </div>
                    <p className="text-4xl font-black text-orange-700">{reputationData.summary.given_ls}</p>
                  </button>

                  {/* Given Ws */}
                  <button
                    onClick={() => setActiveTab("given-ws")}
                    className={`bg-blue-300 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 p-6 transform rotate-1 hover:rotate-0 cursor-pointer ${
                      activeTab === "given-ws" ? "scale-110 bg-blue-400" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Trophy className="w-8 h-8 text-blue-600" />
                      <h3 className="text-xl font-black text-black uppercase">Given Ws</h3>
                    </div>
                    <p className="text-4xl font-black text-blue-700">{reputationData.summary.given_ws}</p>
                  </button>
                </div>

                {/* Tables */}
                <div className="space-y-8">
                  {/* Active Tab Content */}
                  <div className="min-h-[400px]">
                    {activeTab === "received-ls" && (
                      <ReputationTable
                        title="Received Ls"
                        data={reputationData.received.ls}
                        type="received"
                        icon={<ThumbsDown className="w-6 h-6 text-red-600" />}
                        bgColor="bg-red-200"
                        borderColor="bg-red-400"
                        users={reputationData.users}
                      />
                    )}
                    {activeTab === "received-ws" && (
                      <ReputationTable
                        title="Received Ws"
                        data={reputationData.received.ws}
                        type="received"
                        icon={<ThumbsUp className="w-6 h-6 text-green-600" />}
                        bgColor="bg-green-200"
                        borderColor="bg-green-400"
                        users={reputationData.users}
                      />
                    )}
                    {activeTab === "given-ls" && (
                      <ReputationTable
                        title="Given Ls"
                        data={reputationData.given.ls}
                        type="given"
                        icon={<Users className="w-6 h-6 text-orange-600" />}
                        bgColor="bg-orange-200"
                        borderColor="bg-orange-400"
                        users={reputationData.users}
                      />
                    )}
                    {activeTab === "given-ws" && (
                      <ReputationTable
                        title="Given Ws"
                        data={reputationData.given.ws}
                        type="given"
                        icon={<Trophy className="w-6 h-6 text-blue-600" />}
                        bgColor="bg-blue-200"
                        borderColor="bg-blue-400"
                        users={reputationData.users}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-14 h-14 bg-yellow-400 hover:bg-yellow-500 text-black font-black border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 z-20 flex items-center justify-center animate__animated animate__bounceIn"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
