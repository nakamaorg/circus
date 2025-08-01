"use client";

import type { JSX } from "react";
import type { TEvent } from "@/lib/types/event.type";

import { Calendar, Clock, X } from "lucide-react";
import { useEffect, useState } from "react";

import { EventThumbnail } from "@/components/event-thumbnail";



type TEventModalProps = {
  event: TEvent;
  isOpen: boolean;
  onClose: () => void;
};

/**
 * @description
 * Modal for displaying event details with NeoBrutalism design
 *
 * @param props - The component props
 * @param props.event - The event data
 * @param props.isOpen - Whether the modal is open
 * @param props.onClose - Function to close the modal
 * @returns The event modal component
 */
export function EventModal({ event, isOpen, onClose }: TEventModalProps): JSX.Element | null {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageLoading, setImageLoading] = useState(true);

  // Fetch the event image URL
  useEffect(() => {
    if (isOpen && event.id) {
      setImageLoading(true);
      fetch(`/api/event-image?eventId=${event.id}`)
        .then(response => response.json())
        .then((data) => {
          if (data.imageUrl) {
            setImageUrl(data.imageUrl);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch event image:", error);
        })
        .finally(() => {
          setImageLoading(false);
        });
    }
  }, [isOpen, event.id]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-300">
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
        className="fixed top-4 right-4 w-12 h-12 bg-red-500 hover:bg-red-600 text-white font-black border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 z-[60] flex items-center justify-center"
        aria-label="Close modal"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Modal Content */}
      <div className="relative z-10 max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row animate-in zoom-in-95 duration-300 max-h-[90vh]">
          {/* Left Side - Full Image */}
          <div className="md:w-1/2 relative bg-gray-100 border-r-4 border-black min-h-[300px] md:min-h-[400px] flex-shrink-0">
            {imageLoading
              ? (
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center animate-pulse">
                    <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse" />
                  </div>
                )
              : imageUrl
                ? (
                    <img
                      alt={event.title}
                      className="w-full h-full object-cover"
                      src={imageUrl}
                      onError={() => setImageUrl("")}
                    />
                  )
                : (
                    <div className="flex items-center justify-center h-full">
                      <EventThumbnail
                        eventId={event.id}
                        title={event.title}
                        colorIndex={0}
                      />
                    </div>
                  )}
          </div>

          {/* Right Side - Event Info */}
          <div className="md:w-1/2 p-8 space-y-6 overflow-y-auto flex-1 min-h-0">
            {/* Title */}
            <div>
              <h2 className="text-3xl font-black text-black uppercase tracking-wide mb-2 border-b-4 border-black pb-2">
                {event.title}
              </h2>
            </div>

            {/* Date */}
            <div className="bg-purple-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] p-4 transform rotate-1">
              <div className="flex items-center gap-2 text-black">
                <Calendar className="w-5 h-5" />
                <span className="font-black text-lg">
                  {new Date(event.timestamp * 1000).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-black mt-2">
                <Clock className="w-5 h-5" />
                <span className="font-bold">
                  {new Date(event.timestamp * 1000).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-cyan-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] p-4 transform -rotate-1">
              <h3 className="text-xl font-black text-black uppercase mb-3 border-b-2 border-black pb-1">
                Description
              </h3>
              <p className="text-black font-bold leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Keywords */}
            {event.keywords && event.keywords.length > 0 && (
              <div className="bg-yellow-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] p-4 transform rotate-1">
                <h3 className="text-xl font-black text-black uppercase mb-3 border-b-2 border-black pb-1">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {event.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="bg-white text-black px-3 py-1 text-sm font-bold border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wide hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-100"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
