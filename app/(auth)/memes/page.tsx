"use client";

import type { JSX } from "react";

import { ArrowUp, Eye, Play } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { usePageReady } from "@/lib/hooks/use-page-ready";



interface MediaItem {
  key: string;
  url: string;
  type: "image" | "video";
  name: string;
}

interface MediaModalProps {
  item: MediaItem;
  isOpen: boolean;
  onClose: () => void;
}

function MediaModal({ item, isOpen, onClose }: MediaModalProps): JSX.Element | null {
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

  if (!isOpen) {
    return null;
  }

  return (
    <div className="animate__animated animate__fadeIn animate__fast fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Close Button */}
      <button
        onClick={onClose}
        className="animate__animated animate__bounceIn animate__delay-1s fixed top-4 right-4 w-12 h-12 bg-red-500 hover:bg-red-600 text-white font-black border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition-all duration-100 z-[60] flex items-center justify-center group/tooltip"
        aria-label="Close modal"
      >
        ×
        {/* Tooltip */}
        <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-2 px-2 py-1 bg-black text-white text-xs rounded border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap z-[9999] pointer-events-none">
          Close media (Esc)
          {/* Tooltip arrow */}
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-t-4 border-b-4 border-transparent border-l-black"></div>
        </div>
      </button>

      {/* Modal Content */}
      <div className="animate__animated animate__jackInTheBox relative z-10 max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col">
          {/* Media Display */}
          <div className="relative bg-gray-100 flex items-center justify-center min-h-[60vh]">
            {item.type === "video"
              ? (
                  <video
                    src={item.url}
                    className="max-w-full max-h-full object-contain"
                    controls
                    autoPlay
                    loop
                  />
                )
              : (
                  <img
                    src={item.url}
                    alt={item.name}
                    className="max-w-full max-h-full object-contain"
                  />
                )}
          </div>

          {/* Media Info */}
          <div className="p-6 border-t-4 border-black bg-yellow-200">
            <h3 className="text-2xl font-black text-black mb-2">{item.name}</h3>
            <p className="text-lg font-bold text-gray-700">
              Type:
              {" "}
              {item.type.toUpperCase()}
              {" "}
              • Source: Circus Lore Collection
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * @description
 * Memes gallery page with grid layout matching timeline/profile design
 *
 * @returns The memes page component
 */
export default function MemesPage(): JSX.Element {
  usePageReady();

  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  // Fetch media items from S3
  useEffect(() => {
    const fetchMediaItems = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/lore-media");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch media items");
        }

        setMediaItems(data.items || []);
      }
      catch (err) {
        console.error("Error fetching media items:", err);
        setError(err instanceof Error ? err.message : "Failed to load media");
      }
      finally {
        setIsLoading(false);
      }
    };

    fetchMediaItems();
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

  const openMedia = (item: MediaItem) => {
    setSelectedMedia(item);
  };

  const closeMedia = () => {
    setSelectedMedia(null);
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-16 px-4">
          <h1 className="text-4xl sm:text-6xl font-black text-black uppercase tracking-wider transform rotate-2 bg-purple-400 inline-block px-6 sm:px-8 py-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Memes Gallery
          </h1>
          <p className="text-lg sm:text-xl font-bold text-black bg-white inline-block px-4 sm:px-6 py-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
            {isLoading ? "Loading..." : `${mediaItems.length} lore items from the circus collection`}
          </p>
        </div>

        {isLoading
          ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8">
                  <div className="animate-spin w-16 h-16 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-2xl font-black text-black">Loading memes...</p>
                </div>
              </div>
            )
          : error
            ? (
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="text-center bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8">
                    <p className="text-2xl font-black text-red-600 mb-4">Failed to load memes</p>
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
            : mediaItems.length === 0
              ? (
                  <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8">
                      <p className="text-2xl font-black text-gray-700 mb-4">No memes found</p>
                      <p className="text-lg font-bold text-gray-600">The lore collection is empty</p>
                    </div>
                  </div>
                )
              : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {mediaItems.map(item => (
                      <div
                        key={item.key}
                        className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 overflow-hidden group cursor-pointer"
                        onClick={() => openMedia(item)}
                      >
                        {/* Media Preview */}
                        <div className="relative aspect-square bg-gray-100">
                          {item.type === "video"
                            ? (
                                <>
                                  <video
                                    src={item.url}
                                    className="w-full h-full object-cover"
                                    muted
                                    onMouseEnter={e => e.currentTarget.play()}
                                    onMouseLeave={e => e.currentTarget.pause()}
                                  />
                                  <div className="absolute top-2 right-2 w-8 h-8 bg-red-500 border-2 border-black rounded-full flex items-center justify-center">
                                    <Play className="w-4 h-4 text-white" />
                                  </div>
                                </>
                              )
                            : (
                                <img
                                  src={item.url}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              )}

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                            <div className="w-12 h-12 bg-white border-2 border-black rounded-full flex items-center justify-center">
                              <Eye className="w-6 h-6 text-black" />
                            </div>
                          </div>
                        </div>

                        {/* Media Info */}
                        <div className="p-3 border-t-2 border-black bg-yellow-200">
                          <p className="text-sm font-black text-black truncate">{item.name}</p>
                          <p className="text-xs font-bold text-gray-600 uppercase">{item.type}</p>
                        </div>
                      </div>
                    ))}
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

      {/* Media Modal */}
      {selectedMedia && (
        <MediaModal
          item={selectedMedia}
          isOpen={!!selectedMedia}
          onClose={closeMedia}
        />
      )}
    </div>
  );
}
