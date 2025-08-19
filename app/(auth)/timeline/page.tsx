"use client";

import type { JSX } from "react";

import { ChevronUp, Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { EventAddModal } from "@/components/event-add-modal";
import { TimelineItem } from "@/components/timeline-item";
import { Button } from "@/components/ui/button";
import { isHistorian } from "@/lib/helpers/permission.helper";
import { useEvents } from "@/lib/hooks/use-events";
import { usePageReady } from "@/lib/hooks/use-page-ready";
import { useUser } from "@/lib/hooks/use-user";



/**
 * @description
 * A page that displays a timeline of events with NeoBrutalism design
 *
 * @returns The timeline page
 */
export default function TimelinePage(): JSX.Element {
  usePageReady();
  const { user } = useUser();
  const { data: events, isLoading, error, refetch } = useEvents();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  // Handle scroll to show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 200; // Reduced threshold

      setShowBackToTop(scrolled);
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Handle successful event creation
  const handleEventSuccess = () => {
    refetch(); // Refetch events to show the new event
  };

  // Sort events from newest to oldest by timestamp
  const sortedEvents = events?.slice().sort((a, b) => b.timestamp - a.timestamp);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-yellow-400 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-8 py-4 transform rotate-2">
          <p className="text-xl font-black text-black uppercase tracking-wider">Loading Timeline...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-red-400 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-8 py-4 transform -rotate-2">
          <p className="text-xl font-black text-black uppercase tracking-wider">
            Error:
            {" "}
            {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 mb-16 px-4">
        <h1 className="text-4xl sm:text-6xl font-black text-black uppercase tracking-wider transform rotate-2 bg-purple-400 inline-block px-6 sm:px-8 py-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          Timeline
        </h1>
        <p className="text-lg sm:text-xl font-bold text-black bg-white inline-block px-4 sm:px-6 py-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
          Journey through events in chronological order
        </p>

        {/* Add Event Button for Historians */}
        {user && isHistorian(user) && (
          <div className="mt-6">
            <Button
              onClick={() => setIsEventModalOpen(true)}
              className="bg-green-400 hover:bg-green-500 text-black font-black px-6 py-3 text-lg uppercase tracking-wider border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Event
            </Button>
          </div>
        )}
      </div>

      {/* Timeline Content */}
      {sortedEvents && sortedEvents.length > 0
        ? (
            <div className="relative max-w-6xl mx-auto px-2 sm:px-4">
              {/* Central timeline line with solid color */}
              <div className="absolute left-4 sm:left-1/2 transform sm:-translate-x-1/2 w-1 sm:w-2 bg-black h-full shadow-lg"></div>

              {/* Decorative top circle */}
              <div className="absolute left-4 sm:left-1/2 transform -translate-x-1/2 sm:-translate-x-1/2 -translate-y-4 sm:-translate-y-6 w-8 h-8 sm:w-10 sm:h-10 bg-purple-400 border-2 sm:border-4 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-20">
                <div className="w-full h-full bg-white rounded-full animate-ping opacity-30"></div>
              </div>

              {/* Timeline Items */}
              <div className="space-y-0 pt-8 sm:pt-12">
                {sortedEvents.map((event, index) => (
                  <TimelineItem
                    key={event.id}
                    event={event}
                    index={index}
                    isLeft={index % 2 === 0}
                  />
                ))}
              </div>

              {/* Decorative bottom circle */}
              <div className="absolute left-4 sm:left-1/2 transform -translate-x-1/2 sm:-translate-x-1/2 bottom-0 translate-y-4 sm:translate-y-6 w-8 h-8 sm:w-10 sm:h-10 bg-cyan-400 border-2 sm:border-4 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-20">
                <div className="w-full h-full bg-white rounded-full animate-ping opacity-30"></div>
              </div>
            </div>
          )
        : (
            <div className="text-center space-y-4">
              <div className="bg-gray-300 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-8 py-6 transform rotate-1 inline-block">
                <p className="text-2xl font-black text-black uppercase tracking-wider">
                  No Events Found
                </p>
                <p className="text-base font-bold text-black mt-2">
                  Timeline is empty at the moment
                </p>
              </div>
            </div>
          )}

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 w-12 h-12 sm:w-14 sm:h-14 bg-purple-400 border-2 sm:border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 z-50 flex items-center justify-center animate-pulse"
          aria-label="Back to top"
        >
          <ChevronUp className="w-5 h-5 sm:w-7 sm:h-7 text-black font-bold" />
        </button>
      )}

      {/* Event Add Modal */}
      <EventAddModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSuccess={handleEventSuccess}
      />
    </div>
  );
}
