import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { auth } from "@/lib/helpers/auth.helper";
import { getAPIConfig } from "@/lib/helpers/parameter-store.helper";



/**
 * @description
 * API route to get game information from third-wheel API
 *
 * @param request - The NextRequest object containing game IDs in the body
 * @returns A response with the game information
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.discordId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ error: "Invalid game IDs provided" }, { status: 400 });
    }

    // Call third-wheel API
    const apiConfig = await getAPIConfig();
    const apiUrl = `${apiConfig.url}/api/v1/info`;
    const headers = {
      "Authorization": apiConfig.secret,
      "ngrok-skip-browser-warning": "true",
      "Content-Type": "application/json",
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ ids }),
    });

    if (!response.ok) {
      throw new Error(`Third-wheel API returned ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  }
  catch (error) {
    console.error("Failed to fetch game info:", error);

    return NextResponse.json({ error: "Failed to fetch game information" }, { status: 500 });
  }
}
