import type { NextRequest } from "next/server";

import { InvokeCommand } from "@aws-sdk/client-lambda";
import { NextResponse } from "next/server";

import { lambda } from "@/lib/config/aws.config";
import { auth } from "@/lib/helpers/auth.helper";



interface LambdaResponse {
  body: Record<string, number>;
  statusCode: number;
}

interface LambdaPayload {
  discord_id?: string;
  game_id?: number;
}

/**
 * @description
 * API route to get game endorsements leaderboard
 * Supports different types via query parameters:
 * - type=my: Get user's game endorsements (default)
 * - type=game&game_id=X: Get endorsements for specific game
 * - type=global: Get global user endorsements
 *
 * @param request - The NextRequest object
 * @returns A response with endorsements data
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.discordId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Keep discord ID as string to preserve precision for very long numbers
    const discordId = session.user.discordId;

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "my";
    const gameId = searchParams.get("game_id");

    let functionName: string;
    let payload: LambdaPayload = {};

    switch (type) {
      case "my": {
        functionName = "nakamaorg-core-game-get-gamer-leaderboard";
        payload = { discord_id: discordId };
        break;
      }

      case "game": {
        if (!gameId) {
          return NextResponse.json({ error: "game_id is required for type=game" }, { status: 400 });
        }
        const gameIdNum = Number.parseInt(gameId, 10);

        if (Number.isNaN(gameIdNum)) {
          return NextResponse.json({ error: "Invalid game_id" }, { status: 400 });
        }
        functionName = "nakamaorg-core-game-get-game-leaderboard";
        payload = { game_id: gameIdNum };
        break;
      }

      case "global": {
        functionName = "nakamaorg-core-game-get-global-leaderboard";
        payload = {};
        break;
      }

      default: {
        return NextResponse.json({ error: "Invalid type. Must be 'my', 'game', or 'global'" }, { status: 400 });
      }
    }

    try {
      const command = new InvokeCommand({
        FunctionName: functionName,
        Payload: new TextEncoder().encode(JSON.stringify(payload)),
      });

      const response = await lambda.send(command);
      const responsePayload = response.Payload;

      if (!responsePayload) {
        return NextResponse.json({ error: "No response from lambda" }, { status: 500 });
      }

      const result = JSON.parse(new TextDecoder().decode(responsePayload)) as LambdaResponse;

      if (result.statusCode !== 200) {
        return NextResponse.json({ error: "Lambda function failed" }, { status: 500 });
      }

      return NextResponse.json(result.body);
    }
    catch (lambdaError) {
      console.error("Lambda invocation failed:", lambdaError);

      return NextResponse.json({ error: "Failed to get endorsements" }, { status: 500 });
    }
  }
  catch (error) {
    console.error("Failed to get endorsements:", error);

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
