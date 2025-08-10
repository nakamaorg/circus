"use client";

import type { JSX } from "react";

import { Bell, Command, Gamepad2, GanttChartSquare, Home, ImageIcon, LogOut, Search, Trophy, User, Volleyball, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";



interface CommandItem {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  action: () => void;
  category: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * @description
 * NeoBrutalism-styled command palette for quick navigation and actions
 *
 * @param props - The command palette props
 * @param props.isOpen - Whether the command palette is open
 * @param props.onClose - Function to close the command palette
 * @returns The command palette component
 */
export function CommandPalette({ isOpen, onClose }: CommandPaletteProps): JSX.Element {
  const [query, setQuery] = useState("");
  const router = useRouter();

  // Command items
  const commands: CommandItem[] = [
    {
      id: "home",
      title: "Go to Home",
      description: "Navigate to the main page",
      icon: <Home className="w-4 h-4" />,
      action: () => {
        router.push("/");
        onClose();
      },
      category: "Navigation",
    },
    {
      id: "gaming",
      title: "View Gaming",
      description: "Games and endorsements leaderboard",
      icon: <Gamepad2 className="w-4 h-4" />,
      action: () => {
        router.push("/gaming");
        onClose();
      },
      category: "Navigation",
    },
    {
      id: "fenj",
      title: "View Fenj",
      description: "Browse football fields and matches",
      icon: <Volleyball className="w-4 h-4" />,
      action: () => {
        router.push("/fenj");
        onClose();
      },
      category: "Navigation",
    },
    {
      id: "reminders",
      title: "View Reminders",
      description: "Check your Discord reminder history",
      icon: <Bell className="w-4 h-4" />,
      action: () => {
        router.push("/reminders");
        onClose();
      },
      category: "Navigation",
    },
    {
      id: "timeline",
      title: "View Timeline",
      description: "Browse animated timeline of events",
      icon: <GanttChartSquare className="w-4 h-4" />,
      action: () => {
        router.push("/timeline");
        onClose();
      },
      category: "Navigation",
    },
    {
      id: "memes",
      title: "View Memes",
      description: "Browse lore gallery and memes collection",
      icon: <ImageIcon className="w-4 h-4" />,
      action: () => {
        router.push("/memes");
        onClose();
      },
      category: "Navigation",
    },
    {
      id: "reputation",
      title: "View Reputation",
      description: "Track your Ls and Ws - received and given",
      icon: <Trophy className="w-4 h-4" />,
      action: () => {
        router.push("/reputation");
        onClose();
      },
      category: "Navigation",
    },
    {
      id: "profile",
      title: "View Profile",
      description: "Go to your user profile",
      icon: <User className="w-4 h-4" />,
      action: () => {
        router.push("/profile");
        onClose();
      },
      category: "Navigation",
    },
    {
      id: "logout",
      title: "Logout",
      description: "Sign out of your account",
      icon: <LogOut className="w-4 h-4" />,
      action: () => {
        signOut();
        onClose();
      },
      category: "Actions",
    },
  ];

  // Filter commands based on query
  const filteredCommands = commands.filter(
    command =>
      command.title.toLowerCase().includes(query.toLowerCase())
      || command.description.toLowerCase().includes(query.toLowerCase())
      || command.category.toLowerCase().includes(query.toLowerCase()),
  );

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = [];
    }
    acc[command.category].push(command);

    return acc;
  }, {} as Record<string, CommandItem[]>);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to open command palette
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        // Note: Opening is handled by parent component
      }
      // Escape to close
      if (e.key === "Escape") {
        onClose();
        setQuery("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Close when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
      setQuery("");
    }
  };

  if (!isOpen) {
    return <></>;
  }

  return (
    <div
      className="animate__animated animate__fadeIn animate__fast fixed inset-0 z-[100] flex items-start justify-center pt-32 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Command Palette Container */}
      <div className="animate__animated animate__bounceIn relative w-full max-w-2xl mx-4 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-black bg-cyan-400">
          <div className="flex items-center gap-3">
            <Command className="w-6 h-6 text-black" />
            <h2 className="text-xl font-black text-black uppercase">Command Palette</h2>
          </div>
          <button
            onClick={() => {
              onClose();
              setQuery("");
            }}
            className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white font-black border-2 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition-all duration-100 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b-2 border-black bg-yellow-300">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search commands..."
              className="w-full pl-12 pr-4 py-3 text-lg font-bold text-black bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-1px] focus:translate-y-[-1px] transition-all duration-100 outline-none placeholder-gray-500"
              autoFocus
            />
          </div>
        </div>

        {/* Commands List */}
        <div className="max-h-96 overflow-y-auto bg-purple-200">
          {Object.keys(groupedCommands).length === 0
            ? (
                <div className="p-8 text-center">
                  <p className="text-xl font-black text-black">No commands found</p>
                  <p className="text-sm font-bold text-gray-600 mt-2">Try a different search term</p>
                </div>
              )
            : (
                Object.entries(groupedCommands).map(([category, items]) => (
                  <div key={category} className="border-b-2 border-black last:border-b-0">
                    {/* Category Header */}
                    <div className="p-3 bg-pink-300 border-b-2 border-black">
                      <h3 className="text-sm font-black text-black uppercase tracking-wider">{category}</h3>
                    </div>

                    {/* Command Items */}
                    {items.map(command => (
                      <button
                        key={command.id}
                        onClick={command.action}
                        className="w-full p-4 text-left bg-white hover:bg-green-200 border-b border-gray-300 last:border-b-0 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition-all duration-100 flex items-center gap-4"
                      >
                        <div className="w-8 h-8 bg-cyan-300 border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center flex-shrink-0">
                          {command.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-black text-black">{command.title}</h4>
                          <p className="text-sm font-bold text-gray-600">{command.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ))
              )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-200 border-t-2 border-black">
          <p className="text-xs font-bold text-gray-600 text-center">
            Press
            {" "}
            <kbd className="px-2 py-1 bg-white border border-black rounded font-black">Ctrl</kbd>
            {" "}
            +
            {" "}
            <kbd className="px-2 py-1 bg-white border border-black rounded font-black">K</kbd>
            {" "}
            to open •
            {" "}
            <kbd className="px-2 py-1 bg-white border border-black rounded font-black">Esc</kbd>
            {" "}
            to close
          </p>
        </div>
      </div>
    </div>
  );
}
