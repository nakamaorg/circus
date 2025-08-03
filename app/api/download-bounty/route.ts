import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";



/**
 * @description
 * API endpoint to proxy bounty image downloads to avoid CORS issues
 *
 * @param request - The Next.js request object
 * @returns Response with the image data or an error
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const imageUrl = searchParams.get("url");

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    // Fetch the image from the S3 URL
    const response = await fetch(imageUrl);

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch image" }, { status: response.status });
    }

    // Get the image data as an array buffer
    const imageBuffer = await response.arrayBuffer();

    // Create a response with the image data
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "image/jpeg",
        "Content-Disposition": "attachment; filename=bounty_poster.jpg",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }
  catch (error) {
    console.error("Error downloading bounty image:", error);

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
