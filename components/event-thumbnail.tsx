"use client";

import type { JSX } from "react";

import { useEffect, useState } from "react";



type TEventThumbnailProps = {
  eventId: string;
  title: string;
  colorIndex: number;
};

/**
 * @description
 * Component for displaying event thumbnails with dynamic URL fetching
 *
 * @param props - The component props
 * @param props.eventId - The event ID to fetch thumbnail for
 * @param props.title - The event title for alt text
 * @param props.colorIndex - The index for color cycling
 * @returns The event thumbnail component
 */
export function EventThumbnail({ eventId, title, colorIndex }: TEventThumbnailProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchImageUrl = async (): Promise<void> => {
      try {
        const response = await fetch(`/api/event-image?eventId=${eventId}`);
        const data = await response.json();

        if (data.success && data.imageUrl) {
          setImageUrl(data.imageUrl);
        }
        else {
          setError(true);
        }
      }
      catch {
        setError(true);
      }
      finally {
        setLoading(false);
      }
    };

    fetchImageUrl();
  }, [eventId]);

  const fallbackSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23f3f4f6'/%3E%3Ctext x='200' y='100' text-anchor='middle' dy='0.3em' font-family='Arial, sans-serif' font-size='14' fill='%23374151'%3ENo Image%3C/text%3E%3C/svg%3E";

  return (
    <div className="relative h-48 border-b-2 border-black overflow-hidden">
      {loading
        ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <div className="text-sm font-bold text-gray-600">Loading...</div>
            </div>
          )
        : (
            <img
              src={error || !imageUrl ? fallbackSvg : imageUrl}
              alt={title}
              className="w-full h-full object-cover"
              onError={() => setError(true)}
            />
          )}

      {/* Color overlay for NeoBrutalism effect */}
      <div
        className={`
          absolute inset-0 opacity-20 mix-blend-multiply
          ${colorIndex % 4 === 0 ? "bg-pink-400" : ""}
          ${colorIndex % 4 === 1 ? "bg-cyan-400" : ""}
          ${colorIndex % 4 === 2 ? "bg-yellow-400" : ""}
          ${colorIndex % 4 === 3 ? "bg-green-400" : ""}
        `}
      />
    </div>
  );
}
