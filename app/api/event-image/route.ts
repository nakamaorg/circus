import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getEventThumbnailUrl } from "@/lib/helpers/s3.helper";



/**
 * @description
 * API route to get event thumbnail URL from S3
 * GET /api/event-image?eventId=<event_id>
 *
 * @param request - The Next.js request object
 * @returns Promise<NextResponse> - JSON response with image URL or error
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json(
        { error: "Missing eventId parameter" },
        { status: 400 },
      );
    }

    const imageUrl = await getEventThumbnailUrl(eventId);

    return NextResponse.json({
      imageUrl,
      success: true,
    });
  }
  catch {
    return NextResponse.json(
      { error: "Failed to fetch event image", success: false },
      { status: 500 },
    );
  }
}
