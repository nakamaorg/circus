"use client";

import type { JSX } from "react";

import { ArrowDown, ArrowUp, Bell, ChevronDown, ExternalLink, Filter, Loader2, Search } from "lucide-react";
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
  onSearchChange: (value: string) => void;
  onFilterChange: (value: FilterType) => void;
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

function RemindersTable({ reminders, searchTerm, filterType, onSearchChange, onFilterChange }: RemindersTableProps): JSX.Element {
  const [sortConfig, setSortConfig] = useState<{
    key: "reminder_date" | "message" | "status";
    direction: "asc" | "desc";
  }>({
    key: "reminder_date",
    direction: "desc",
  });

  const handleSort = (key: "reminder_date" | "message" | "status") => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIcon = (columnKey: "reminder_date" | "message" | "status") => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUp className="w-4 h-4 text-gray-400" />;
    }

    return sortConfig.direction === "asc"
      ? <ArrowUp className="w-4 h-4 text-white" />
      : <ArrowDown className="w-4 h-4 text-white" />;
  };

  // Filter reminders based on status and search
  const now = Date.now() / 1000;
  const filteredReminders = reminders.filter((reminder) => {
    const isPassed = reminder.timestamp < now;

    // Filter by status
    if (filterType === "upcoming" && (isPassed || reminder.reminded)) {
      return false;
    }
    if (filterType === "passed" && (!isPassed && !reminder.reminded)) {
      return false;
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();

      return (
        reminder.message_content.toLowerCase().includes(searchLower)
        || new Date(reminder.timestamp * 1000).toLocaleDateString().includes(searchLower)
      );
    }

    return true;
  });

  // Sort the filtered reminders
  const sortedReminders = [...filteredReminders].sort((a, b) => {
    switch (sortConfig.key) {
      case "reminder_date": {
        return sortConfig.direction === "asc"
          ? a.timestamp - b.timestamp
          : b.timestamp - a.timestamp;
      }

      case "message": {
        return sortConfig.direction === "asc"
          ? a.message_content.localeCompare(b.message_content)
          : b.message_content.localeCompare(a.message_content);
      }

      case "status": {
        const getStatusValue = (reminder: Reminder) => {
          const isPassed = reminder.timestamp < now;

          if (reminder.reminded) {
            return 2; // Completed
          }
          if (isPassed) {
            return 1; // Overdue
          }

          return 0; // Upcoming
        };

        return sortConfig.direction === "asc"
          ? getStatusValue(a) - getStatusValue(b)
          : getStatusValue(b) - getStatusValue(a);
      }

      default:
        return 0;
    }
  });

  const getStatusDisplay = (reminder: Reminder) => {
    const isPassed = reminder.timestamp < now;

    if (reminder.reminded) {
      return { text: "Completed", color: "bg-green-400", textColor: "text-black" };
    }
    if (isPassed) {
      return { text: "Overdue", color: "bg-red-400", textColor: "text-white" };
    }

    return { text: "Upcoming", color: "bg-blue-400", textColor: "text-black" };
  };

  return (
    <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="bg-purple-400 border-b-4 border-black p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-black" />
            <h3 className="text-xl font-black text-black uppercase tracking-wider">
              Reminders
            </h3>
            <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-black">
              {sortedReminders.length}
            </span>
          </div>
          {reminders.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => onSearchChange(e.target.value)}
                  placeholder="Search reminders..."
                  className="w-full sm:w-64 pl-10 pr-4 py-2 text-black bg-white border-2 border-black font-bold placeholder-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-1px] focus:translate-y-[-1px] transition-all duration-200 outline-none"
                />
              </div>
              <StatusFilter status={filterType} onStatusChange={onFilterChange} />
            </div>
          )}
        </div>
      </div>

      {sortedReminders.length === 0
        ? (
            <div className="p-8 text-center">
              <Bell className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-xl font-black text-gray-600">
                {searchTerm ? "No matching reminders found" : "No reminders found"}
              </p>
              <p className="text-sm font-bold text-gray-500 mt-2">
                {searchTerm ? "Try adjusting your search query" : "Your reminders will appear here"}
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
                      onClick={() => handleSort("reminder_date")}
                    >
                      <div className="flex items-center gap-2">
                        Date
                        {getSortIcon("reminder_date")}
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
                    <th
                      className="px-4 py-3 text-left font-black uppercase tracking-wide cursor-pointer hover:bg-gray-800 transition-colors"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center gap-2">
                        Status
                        {getSortIcon("status")}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center font-black uppercase tracking-wide">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedReminders.map((reminder, index) => {
                    const discordUrl = `https://discord.com/channels/${reminder.guild_id}/${reminder.channel_id}/${reminder.message_id}`;
                    const status = getStatusDisplay(reminder);

                    return (
                      <tr
                        key={reminder.id}
                        className={`border-t-2 border-black ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-yellow-100 transition-colors`}
                      >
                        <td className="px-4 py-3">
                          <div className="font-bold text-black">
                            {new Date(reminder.timestamp * 1000).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-black max-w-md truncate">
                            {reminder.message_content}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className={`${status.color} border-2 border-black px-3 py-1 inline-block`}>
                            <div className={`text-sm font-black ${status.textColor}`}>
                              {status.text}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <a
                            href={discordUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 border-2 border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-200"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View
                          </a>
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
              <RemindersTable
                reminders={reminders}
                searchTerm={searchTerm}
                filterType={filterType}
                onSearchChange={setSearchTerm}
                onFilterChange={setFilterType}
              />
            )}
    </div>
  );
}
