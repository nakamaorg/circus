"use client";

import type { JSX } from "react";
import type { TEvent } from "@/lib/types/event.type";

import { Calendar, Clock } from "lucide-react";

import { useEffect, useRef, useState } from "react";

import { EventModal } from "@/components/event-modal";
import { EventThumbnail } from "@/components/event-thumbnail";
import { Card, CardContent } from "@/components/ui/card";



type TTimelineItemProps = {
  event: TEvent;
  index: number;
  isLeft: boolean;
};

/**
 * @description
 * Individual timeline item with scroll animation
 *
 * @param props - The component props
 * @param props.event - The event data
 * @param props.index - The index for color cycling
 * @param props.isLeft - Whether the item should be on the left side
 * @returns The timeline item component
 */
export function TimelineItem({ event, index, isLeft }: TTimelineItemProps): JSX.Element {
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      },
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => {
      if (itemRef.current) {
        observer.unobserve(itemRef.current);
      }
    };
  }, []);

  const colorClasses = {
    0: "bg-pink-400 border-pink-600",
    1: "bg-cyan-400 border-cyan-600",
    2: "bg-yellow-400 border-yellow-600",
    3: "bg-green-400 border-green-600",
  };

  const colorClass = colorClasses[index % 4 as keyof typeof colorClasses];

  return (
    <div
      ref={itemRef}
      className={`
        relative flex items-center w-full mb-8 sm:mb-12
        ${isLeft ? "justify-start sm:justify-start" : "justify-start sm:justify-end"}
      `}
    >
      {/* Timeline connector line to center */}
      <div
        className={`
          absolute top-1/2 transform -translate-y-1/2 h-0.5 bg-black transition-all duration-1000 ease-out
          ${isVisible ? "w-20 sm:w-40 md:w-60 lg:w-80" : "w-0"}
          ${isLeft ? "right-1/2 mr-0 sm:right-1/2 sm:mr-0" : "left-1/2 ml-0 sm:left-1/2 sm:ml-0"}
          sm:${isLeft ? "right-1/2 mr-0" : "left-1/2 ml-0"}
        `}
      />

      {/* Timeline dot */}
      <div
        className={`
          absolute top-1/2 transform -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 sm:border-4 border-black
          transition-all duration-700 ease-out z-10
          ${isVisible ? "scale-100 rotate-0" : "scale-0 rotate-180"}
          ${isLeft ? "right-1/2 translate-x-1/2 sm:right-1/2 sm:translate-x-1/2" : "left-1/2 -translate-x-1/2 sm:left-1/2 sm:-translate-x-1/2"}
          ${colorClass} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
        `}
      >
        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-black absolute top-0.5 left-0.5 sm:top-1 sm:left-1" />
      </div>

      {/* Event Card */}
      <Card
        className={`
          relative w-full max-w-xs sm:w-64 sm:max-w-sm md:w-72 lg:w-80 ${colorClass}
          border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
          transform transition-all duration-300 ease-out overflow-hidden z-20
          hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] 
          hover:scale-105 hover:rotate-1 hover:border-4
          cursor-pointer mx-4 sm:mx-0 group
          ${isVisible
      ? "translate-x-0 translate-y-0 rotate-0 opacity-100"
      : `${isLeft ? "-translate-x-8 sm:-translate-x-16" : "translate-x-8 sm:translate-x-16"} translate-y-4 sm:translate-y-8 ${isLeft ? "rotate-3 sm:rotate-6" : "-rotate-3 sm:-rotate-6"} opacity-0`
    }
          ${isLeft ? "sm:mr-1" : "sm:ml-1"}
        `}
        onClick={() => setShowModal(true)}
        style={{
          transitionDelay: isVisible ? "0.2s" : "0s",
        }}
      >
        {/* Thumbnail */}
        <div className="relative z-30">
          <EventThumbnail
            eventId={event.id}
            title={event.title}
            colorIndex={index}
          />
        </div>

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
            <div className="flex items-center gap-1 bg-white/80 px-2 py-1 border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
              <Clock className="h-3 w-3" />
              <span>
                {new Date(event.timestamp * 1000).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Keywords */}
          {event.keywords && event.keywords.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              {event.keywords.slice(0, 3).map((keyword, keywordIndex) => (
                <span
                  key={keywordIndex}
                  className="bg-white/90 text-black px-1.5 py-0.5 text-xs font-bold border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wide"
                >
                  {keyword}
                </span>
              ))}
              {event.keywords.length > 3 && (
                <span
                  className="text-xs font-bold text-black/70 cursor-help relative group/tooltip"
                  title={event.keywords.slice(3).join(", ")}
                >
                  +
                  {event.keywords.length - 3}
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
                    {event.keywords.slice(3).join(", ")}
                    {/* Tooltip arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
                  </div>
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Event Modal */}
      <EventModal
        event={event}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
