"use client";

import type { JSX } from "react";

import { Calendar, Clock, Tag } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
            <div className="space-y-6">
              {sortedEvents.map((event, index) => (
                <Card
                  key={event.id}
                  className={`
                    bg-gradient-to-r border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
                    transform transition-all duration-300
                    hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px]
                    ${index % 4 === 0 ? "from-pink-300 to-pink-400 rotate-1" : ""}
                    ${index % 4 === 1 ? "from-cyan-300 to-cyan-400 -rotate-1" : ""}
                    ${index % 4 === 2 ? "from-yellow-300 to-yellow-400 rotate-1" : ""}
                    ${index % 4 === 3 ? "from-green-300 to-green-400 -rotate-1" : ""}
                  `}
                >
                  <CardHeader className="border-b-2 border-black bg-black/10">
                    <CardTitle className="text-2xl font-black text-black uppercase tracking-wide flex items-center gap-3">
                      <Calendar className="h-6 w-6" />
                      {event.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <p className="text-base font-bold text-black leading-relaxed">
                      {event.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm font-bold text-black">
                      <div className="flex items-center gap-2 bg-white px-3 py-1 border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        <Clock className="h-4 w-4" />
                        {new Date(event.timestamp * 1000).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>

                    {event.keywords && event.keywords.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <Tag className="h-4 w-4 text-black" />
                        {event.keywords.map((keyword, keywordIndex) => (
                          <span
                            key={keywordIndex}
                            className="bg-white text-black px-2 py-1 text-xs font-bold border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wide"
                          >
                            {keyword}
                          </span>
                        ))}
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
