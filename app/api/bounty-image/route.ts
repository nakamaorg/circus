import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getBountyImageUrl } from "@/lib/helpers/s3.helper";



/**
 * @description
 * API route to get bounty image URL from S3
 * GET /api/bounty-image?userId=<discord_id>
 *
 * @param request - The Next.js request object
 * @returns Promise<NextResponse> - JSON response with image URL or error
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId parameter" },
        { status: 400 },
      );
    }

    const imageUrl = await getBountyImageUrl(userId);

    return NextResponse.json({
      imageUrl,
      success: true,
    });
  }
  catch {
    return NextResponse.json(
      { error: "Failed to fetch bounty image", success: false },
      { status: 500 },
    );
  }
}
