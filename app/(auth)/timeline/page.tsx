"use client";

import type { JSX } from "react";

import { Clock } from "lucide-react";

import { EventThumbnail } from "@/components/event-thumbnail";
import { Card, CardContent } from "@/components/ui/card";
import { useEvents } from "@/lib/hooks/use-events";
import { usePageReady } from "@/lib/hooks/use-page-ready";



/**
 * @description
 * A page that displays a timeline of events with NeoBrutalism design
 *
 * @returns The timeline page
 */
export default function TimelinePage(): JSX.Element {
  usePageReady();
  const { data: events, isLoading, error } = useEvents();

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
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-black text-black uppercase tracking-wider transform rotate-2 bg-purple-400 inline-block px-8 py-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          Timeline
        </h1>
        <p className="text-xl font-bold text-black bg-white inline-block px-6 py-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
          A chronological view of all events
        </p>
      </div>

      {/* Timeline Content */}
      {sortedEvents && sortedEvents.length > 0
        ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sortedEvents.map((event, index) => (
                <Card
                  key={event.id}
                  className={`
                    bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
                    transform transition-all duration-300 overflow-hidden
                    hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px]
                    ${index % 4 === 0 ? "rotate-1" : ""}
                    ${index % 4 === 1 ? "-rotate-1" : ""}
                    ${index % 4 === 2 ? "rotate-1" : ""}
                    ${index % 4 === 3 ? "-rotate-1" : ""}
                  `}
                >
                  {/* Thumbnail */}
                  <EventThumbnail
                    eventId={event.id}
                    title={event.title}
                    colorIndex={index}
                  />

                  <CardContent className="p-4 space-y-3">
                    {/* Title */}
                    <h3 className="text-lg font-black text-black uppercase tracking-wide line-clamp-2">
                      {event.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm font-bold text-black leading-relaxed line-clamp-3">
                      {event.description}
                    </p>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-xs font-bold text-black">
                      <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        <Clock className="h-3 w-3" />
                        {new Date(event.timestamp * 1000).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>

                    {/* Keywords */}
                    {event.keywords && event.keywords.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap">
                        {event.keywords.slice(0, 3).map((keyword, keywordIndex) => (
                          <span
                            key={keywordIndex}
                            className={`
                              text-black px-1.5 py-0.5 text-xs font-bold border border-black 
                              shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wide
                              ${index % 4 === 0 ? "bg-pink-200" : ""}
                              ${index % 4 === 1 ? "bg-cyan-200" : ""}
                              ${index % 4 === 2 ? "bg-yellow-200" : ""}
                              ${index % 4 === 3 ? "bg-green-200" : ""}
                            `}
                          >
                            {keyword}
                          </span>
                        ))}
                        {event.keywords.length > 3 && (
                          <span className="text-xs font-bold text-gray-600">
                            +
                            {event.keywords.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
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
    </div>
  );
}
