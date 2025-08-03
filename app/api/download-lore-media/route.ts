import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";



/**
 * @description
 * API endpoint to proxy lore media downloads to avoid CORS issues
 *
 * @param request - The Next.js request object
 * @returns Response with the media data or an error
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const mediaUrl = searchParams.get("url");

    if (!mediaUrl) {
      return NextResponse.json({ error: "Media URL is required" }, { status: 400 });
    }

    // Fetch the media from the S3 URL
    const response = await fetch(mediaUrl);

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch media" }, { status: response.status });
    }

    // Get the media data as an array buffer
    const mediaBuffer = await response.arrayBuffer();

    // Determine content type from original response or fallback to generic
    const contentType = response.headers.get("Content-Type") || "application/octet-stream";

    // Create a response with the media data
    return new NextResponse(mediaBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": "attachment; filename=lore_media",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }
  catch (error) {
    console.error("Error downloading lore media:", error);

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
