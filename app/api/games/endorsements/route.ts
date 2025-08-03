import type { NextRequest } from "next/server";

import { InvokeCommand } from "@aws-sdk/client-lambda";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";

import { AWS_TABLES, docClient, lambda } from "@/lib/config/aws.config";
import { auth } from "@/lib/helpers/auth.helper";



interface LambdaResponse {
  body: Record<string, number>;
  statusCode: number;
}

interface LambdaPayload {
  discord_id?: string | number;
  game_id?: number;
}

/**
 * @description
 * API route to get game endorsements leaderboard
 * Supports different types via query parameters:
 * - type=my: Get user's game endorsements (default)
 * - type=game: Get endorsements aggregated across all games by game
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

    let functionName: string;
    let payload: LambdaPayload = {};

    switch (type) {
      case "my": {
        functionName = "nakamaorg-core-game-get-gamer-leaderboard";
        payload = { discord_id: discordId };
        break;
      }

      case "game": {
        // For "game" type, we need to fetch all games and aggregate endorsements by game
        try {
          // First, fetch all games from database directly
          const dbCommand = new ScanCommand({
            TableName: AWS_TABLES.GAMES,
          });

          const dbResult = await docClient.send(dbCommand);

          if (!dbResult.Items) {
            return NextResponse.json({});
          }

          // Extract game IDs from the items
          const gameIds: number[] = dbResult.Items.map(item => item.id || item.game_id).filter(Boolean);

          // Aggregate endorsements by game
          const gameEndorsements: Record<string, number> = {};

          for (const gameId of gameIds) {
            try {
              const gameCommand = new InvokeCommand({
                FunctionName: "nakamaorg-core-game-get-game-leaderboard",
                Payload: new TextEncoder().encode(JSON.stringify({ game_id: gameId })),
              });

              const gameResponse = await lambda.send(gameCommand);
              const gamePayload = gameResponse.Payload;

              if (gamePayload) {
                const gameResult = JSON.parse(new TextDecoder().decode(gamePayload)) as LambdaResponse;

                if (gameResult.statusCode === 200) {
                  // Sum up all endorsements for this game
                  const totalEndorsements = Object.values(gameResult.body).reduce((sum, count) => sum + count, 0);

                  if (totalEndorsements > 0) {
                    gameEndorsements[gameId.toString()] = totalEndorsements;
                  }
                }
              }
            }
            catch (gameError) {
              console.error(`Failed to get endorsements for game ${gameId}:`, gameError);
              // Continue with other games even if one fails
            }
          }

          return NextResponse.json(gameEndorsements);
        }
        catch (error) {
          console.error("Failed to aggregate game endorsements:", error);

          return NextResponse.json({ error: "Failed to aggregate endorsements" }, { status: 500 });
        }
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
