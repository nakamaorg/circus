"use client";

import type { JSX } from "react";

import { ArrowDown, ArrowUp, Bell, Calendar, ChevronDown, Clock, ExternalLink, Filter, Loader2, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

import { usePageReady } from "@/lib/hooks/use-page-ready";



type Reminder = {
  id: string;
  issued: number;
  user_id: string;
  guild_id: string;
  channel_id: string;
  reminded: boolean;
  timestamp: number;
  message_id: string;
  message_content: string;
};

type FilterType = "all" | "upcoming" | "passed";

interface StatusFilterProps {
  status: FilterType;
  onStatusChange: (status: FilterType) => void;
}

type RemindersResponse = {
  body: Reminder[];
  statusCode: number;
};

interface RemindersTableProps {
  reminders: Reminder[];
  searchTerm: string;
  filterType: FilterType;
}

function StatusFilter({
  status,
  onStatusChange,
}: StatusFilterProps): JSX.Element {
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

  const getStatusName = () => {
    switch (status) {
      case "all":
        return "All Reminders";

      case "upcoming":
        return "Upcoming";

      case "passed":
        return "Passed";

      default:
        return "All Reminders";
    }
  };

  const handleStatusSelect = (newStatus: "all" | "upcoming" | "passed") => {
    onStatusChange(newStatus);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="pl-10 pr-8 py-2 text-black bg-white border-2 border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-1px] focus:translate-y-[-1px] transition-all duration-200 outline-none min-w-[200px] cursor-pointer flex items-center justify-between"
      >
        <span className="truncate">{getStatusName()}</span>
        <ChevronDown className={`w-4 h-4 ml-2 flex-shrink-0 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Custom Dropdown */}
      {isDropdownOpen && (
        <div className="animate__animated animate__bounceIn animate__faster absolute top-full left-0 right-0 mt-1 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50">
          <div
            onClick={() => handleStatusSelect("all")}
            className={`px-4 py-2 font-bold text-black cursor-pointer border-b border-gray-200 hover:bg-purple-100 transition-colors ${
              status === "all" ? "bg-purple-200" : ""
            }`}
          >
            All Reminders
          </div>
          <div
            onClick={() => handleStatusSelect("upcoming")}
            className={`px-4 py-2 font-bold text-black cursor-pointer border-b border-gray-200 hover:bg-purple-100 transition-colors ${
              status === "upcoming" ? "bg-purple-200" : ""
            }`}
          >
            Upcoming
          </div>
          <div
            onClick={() => handleStatusSelect("passed")}
            className={`px-4 py-2 font-bold text-black cursor-pointer border-b border-gray-200 last:border-b-0 hover:bg-purple-100 transition-colors ${
              status === "passed" ? "bg-purple-200" : ""
            }`}
          >
            Passed
          </div>
        </div>
      )}
    </div>
  );
}

function RemindersTable({ reminders, searchTerm, filterType }: RemindersTableProps): JSX.Element {
  const [sortConfig, setSortConfig] = useState<{
    key: "timestamp" | "issued" | "status";
    direction: "asc" | "desc";
  }>({
    key: "timestamp",
    direction: "desc",
  });

  const handleSort = (key: "timestamp" | "issued" | "status") => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIcon = (columnKey: "timestamp" | "issued" | "status") => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUp className="w-4 h-4 text-gray-400" />;
    }

    return sortConfig.direction === "asc"
      ? <ArrowUp className="w-4 h-4 text-white" />
      : <ArrowDown className="w-4 h-4 text-white" />;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const reminderTime = timestamp * 1000;
    const diff = reminderTime - now;
    const absDiff = Math.abs(diff);

    const minutes = Math.floor(absDiff / (1000 * 60));
    const hours = Math.floor(absDiff / (1000 * 60 * 60));
    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));

    if (diff > 0) {
      if (days > 0) {
        return `in ${days} day${days > 1 ? "s" : ""}`;
      }

      if (hours > 0) {
        return `in ${hours} hour${hours > 1 ? "s" : ""}`;
      }

      if (minutes > 0) {
        return `in ${minutes} minute${minutes > 1 ? "s" : ""}`;
      }

      return "very soon";
    }
    else {
      if (days > 0) {
        return `${days} day${days > 1 ? "s" : ""} ago`;
      }

      if (hours > 0) {
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;
      }

      if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
      }

      return "just now";
    }
  };

  const handleReminderClick = (reminder: Reminder) => {
    const discordUrl = `https://discord.com/channels/${reminder.guild_id}/${reminder.channel_id}/${reminder.message_id}`;

    window.open(discordUrl, "_blank");
  };

  // Filter reminders
  const now = Date.now() / 1000;
  const filteredReminders = reminders.filter((reminder) => {
    // Apply status filter
    const isUpcoming = reminder.timestamp >= now;

    if (filterType === "upcoming" && !isUpcoming) {
      return false;
    }

    if (filterType === "passed" && isUpcoming) {
      return false;
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const reminderText = `${formatDate(reminder.timestamp)} ${formatDate(reminder.issued)} ${reminder.reminded ? "sent" : "pending"}`.toLowerCase();

      return reminderText.includes(searchLower);
    }

    return true;
  });

  // Sort reminders
  const sortedReminders = [...filteredReminders].sort((a, b) => {
    switch (sortConfig.key) {
      case "timestamp": {
        return sortConfig.direction === "asc"
          ? a.timestamp - b.timestamp
          : b.timestamp - a.timestamp;
      }

      case "issued": {
        return sortConfig.direction === "asc"
          ? a.issued - b.issued
          : b.issued - a.issued;
      }

      case "status": {
        const aStatus = a.timestamp >= now ? "upcoming" : "passed";
        const bStatus = b.timestamp >= now ? "upcoming" : "passed";

        return sortConfig.direction === "asc"
          ? aStatus.localeCompare(bStatus)
          : bStatus.localeCompare(aStatus);
      }

      default:
        return 0;
    }
  });

  return (
    <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="bg-purple-400 border-b-4 border-black p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-purple-900" />
            <h3 className="text-xl font-black text-black uppercase tracking-wider">
              Reminders
            </h3>
            <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-black">
              {sortedReminders.length}
            </span>
          </div>
        </div>
      </div>

      {sortedReminders.length === 0
        ? (
            <div className="p-8 text-center">
              <p className="text-xl font-black text-gray-600">No reminders found</p>
              <p className="text-sm font-bold text-gray-500 mt-2">
                {searchTerm ? "Try adjusting your search or filter" : "No reminders to display"}
              </p>
            </div>
          )
        : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-black text-white">
                    <th
                      className="px-4 py-3 text-left font-black uppercase tracking-wide cursor-pointer hover:bg-gray-800 transition-colors"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center gap-2">
                        Status
                        {getSortIcon("status")}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left font-black uppercase tracking-wide cursor-pointer hover:bg-gray-800 transition-colors"
                      onClick={() => handleSort("timestamp")}
                    >
                      <div className="flex items-center gap-2">
                        Reminder Time
                        {getSortIcon("timestamp")}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left font-black uppercase tracking-wide cursor-pointer hover:bg-gray-800 transition-colors"
                      onClick={() => handleSort("issued")}
                    >
                      <div className="flex items-center gap-2">
                        Created
                        {getSortIcon("issued")}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center font-black uppercase tracking-wide">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedReminders.map((reminder, index) => {
                    const isUpcoming = reminder.timestamp >= now;

                    return (
                      <tr
                        key={reminder.id}
                        className={`border-t-2 border-black ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-yellow-100 transition-colors`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {isUpcoming
                              ? (
                                  <>
                                    <Clock className="w-4 h-4 text-green-600" />
                                    <span className="text-sm font-black text-green-600 uppercase">
                                      {formatRelativeTime(reminder.timestamp)}
                                    </span>
                                  </>
                                )
                              : (
                                  <>
                                    <Calendar className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm font-black text-gray-600 uppercase">
                                      {formatRelativeTime(reminder.timestamp)}
                                    </span>
                                    {reminder.reminded && (
                                      <span className="text-xs bg-blue-200 border border-black px-1 py-0.5 font-black ml-2">
                                        SENT
                                      </span>
                                    )}
                                  </>
                                )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-bold text-black">
                            {formatDate(reminder.timestamp)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-bold text-gray-600">
                            {formatDate(reminder.issued)}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleReminderClick(reminder)}
                            className="bg-cyan-400 hover:bg-cyan-500 text-cyan-900 hover:text-cyan-950 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-100 px-3 py-1 text-xs font-black uppercase tracking-wide flex items-center gap-1 mx-auto"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Discord
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
    </div>
  );
}

/**
 * @description
 * Reminders page component that displays user's Discord reminders in a datatable
 *
 * @returns The reminders page component
 */
export default function RemindersPage(): JSX.Element {
  usePageReady();

  const { data: session } = useSession();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");

  useEffect(() => {
    const fetchReminders = async () => {
      if (!session?.user?.discordId) {
        setIsLoading(false);

        return;
      }

      try {
        const response = await fetch("/api/reminders");

        const data: RemindersResponse = await response.json();

        if (data.statusCode === 200) {
          setReminders(data.body);
        }
        else {
          console.error("API returned non-200 status:", data.statusCode, data);
          setError("Failed to fetch reminders");
        }
      }
      catch (err) {
        console.error("Error fetching reminders:", err);
        setError("Error fetching reminders");
      }
      finally {
        setIsLoading(false);
      }
    };

    fetchReminders();
  }, [session?.user?.discordId]);

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-xl font-black text-black">Please log in to view your reminders</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-black text-black uppercase tracking-wider transform -rotate-2 bg-orange-300 inline-block px-8 py-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          Reminders
        </h1>
        <p className="text-xl md:text-2xl font-bold text-black bg-white inline-block px-6 py-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
          Your Discord reminder history
        </p>
      </div>

      {isLoading
        ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 bg-white border-2 border-black px-6 py-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-lg font-black">Loading reminders...</span>
              </div>
            </div>
          )
        : error
          ? (
              <div className="flex items-center justify-center py-12">
                <div className="bg-red-300 border-2 border-black px-6 py-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-lg font-black text-red-800">{error}</span>
                </div>
              </div>
            )
          : (
              <>
                {/* Search and Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
                    <input
                      type="text"
                      placeholder="Search reminders..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-black bg-white border-2 border-black font-bold placeholder-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-1px] focus:translate-y-[-1px] transition-all duration-200 outline-none"
                    />
                  </div>

                  <StatusFilter status={filterType} onStatusChange={setFilterType} />
                </div>

                {/* Reminders Table */}
                <RemindersTable reminders={reminders} searchTerm={searchTerm} filterType={filterType} />
              </>
            )}
    </div>
  );
}
