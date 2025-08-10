import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { auth } from "@/lib/helpers/auth.helper";



/**
 * @description
 * API route to get game endorsements leaderboard for the logged-in user
 *
 * @param _request - The NextRequest object (unused)
 * @returns A response with the user's game endorsements
 */
export async function GET(_request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.discordId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      // Mock data for development - replace with actual lambda call
      const mockEndorsements = {
        121: 5,
        732: 8,
        3277: 3,
        199038: 12,
        1020: 7,
        242408: 15,
      };

      return NextResponse.json(mockEndorsements);
    }
    catch (lambdaError) {
      console.error("Failed to fetch game endorsements from lambda:", lambdaError);

      return NextResponse.json(
        {
          error: "Failed to fetch game endorsements",
          details: lambdaError instanceof Error ? lambdaError.message : "Unknown error",
        },
        { status: 503 },
      );
    }
  }
  catch (error) {
    console.error("Failed to get game endorsements:", error);

    return NextResponse.json({ error: "Failed to get game endorsements" }, { status: 500 });
  }
}
