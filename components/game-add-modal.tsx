import type { JSX } from "react";

import { Check, Gamepad2, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";



interface GameAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGameAdded: () => void;
}

/**
 * @description
 * Modal component for adding new games to the database
 * Allows users with Gamer permissions to add IGDB game IDs
 *
 * @param props - The component props
 * @param props.isOpen - Whether the modal is open
 * @param props.onClose - Callback to close the modal
 * @param props.onGameAdded - Callback when a game is successfully added
 * @returns The game add modal component
 */
export function GameAddModal({ isOpen, onClose, onGameAdded }: GameAddModalProps): JSX.Element | null {
  const [gameId, setGameId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setGameId("");
      setError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!gameId.trim()) {
      setError("Please enter a game ID");

      return;
    }

    const parsedGameId = Number.parseInt(gameId.trim(), 10);

    if (Number.isNaN(parsedGameId) || parsedGameId <= 0) {
      setError("Please enter a valid positive game ID");

      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameId: parsedGameId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add game");
      }

      setSuccess(true);
      onGameAdded();

      // Auto-close after success
      setTimeout(() => {
        onClose();
      }, 2000);
    }
    catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
    finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="animate__animated animate__jackInTheBox animate__fast fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm">
      {/* NeoBrutalism themed backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* NeoBrutalism pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full bg-black"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 20px,
              rgba(255,255,255,0.1) 20px,
              rgba(255,255,255,0.1) 40px
            )`,
          }}
        />
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="animate__animated animate__bounceIn animate__delay-1s fixed top-4 right-4 w-12 h-12 bg-red-500 hover:bg-red-600 text-white font-black border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition-all duration-100 z-[60] flex items-center justify-center group/tooltip"
        aria-label="Close game add modal"
      >
        <X className="h-6 w-6" />
        {/* Tooltip */}
        <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-2 px-2 py-1 bg-black text-white text-xs rounded border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap z-[100] pointer-events-none">
          Close (Esc)
          {/* Tooltip arrow */}
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-t-4 border-b-4 border-transparent border-l-black"></div>
        </div>
      </button>

      {/* Modal Content */}
      <div className="animate__animated animate__zoomIn animate__fast relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Gamepad2 className="w-8 h-8 text-purple-600" />
          <div>
            <h2 className="text-2xl font-black text-black uppercase tracking-wide">Add Game</h2>
            <p className="text-sm font-bold text-gray-600">Add a new game to the database</p>
          </div>
        </div>

        {success
          ? (
              <div className="text-center py-8">
                <div className="animate__animated animate__bounceIn bg-green-100 border-4 border-green-600 rounded-lg p-6">
                  <Check className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-black text-green-800 mb-2">Game Added!</h3>
                  <p className="text-green-700 font-bold">
                    Game ID
                    {" "}
                    {gameId}
                    {" "}
                    has been successfully added to the database.
                  </p>
                </div>
              </div>
            )
          : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="gameId" className="block text-sm font-black text-black uppercase tracking-wide mb-2">
                    IGDB Game ID
                  </label>
                  <input
                    id="gameId"
                    type="number"
                    min="1"
                    value={gameId}
                    onChange={e => setGameId(e.target.value)}
                    placeholder="Enter IGDB game ID (e.g., 104967)"
                    className="w-full px-4 py-3 text-black bg-white border-4 border-black font-bold placeholder-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all duration-200 outline-none"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-600 mt-2 font-semibold">
                    You can find IGDB game IDs by searching on
                    {" "}
                    <a
                      href="https://www.igdb.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      igdb.com
                    </a>
                  </p>
                </div>

                {error && (
                  <div className="animate__animated animate__shakeX bg-red-100 border-4 border-red-600 p-4">
                    <p className="text-red-800 font-bold text-sm">{error}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-black border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-100"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-black border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Adding...
                          </div>
                        )
                      : (
                          <>
                            <Gamepad2 className="w-4 h-4 mr-2" />
                            Add Game
                          </>
                        )}
                  </Button>
                </div>
              </form>
            )}
      </div>
    </div>
  );
}
