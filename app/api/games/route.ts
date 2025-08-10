import type { NextRequest } from "next/server";

import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";

import { AWS_TABLES, docClient } from "@/lib/config/aws.config";
import { auth } from "@/lib/helpers/auth.helper";
import { isGamer } from "@/lib/helpers/permission.helper";



/**
 * @description
 * API route to get all games from DynamoDB
 *
 * @returns A response with the game IDs
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.discordId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const dbCommand = new ScanCommand({
        TableName: AWS_TABLES.GAMES,
      });

      const dbResult = await docClient.send(dbCommand);

      if (!dbResult.Items) {
        return NextResponse.json({ gameIds: [] });
      }

      // Extract game IDs from the items
      const gameIds = dbResult.Items.map(item => item.id || item.game_id);

      return NextResponse.json({ gameIds });
    }
    catch (dbError) {
      console.error("Failed to fetch games from DynamoDB:", dbError);

      return NextResponse.json(
        {
          error: "Failed to fetch games from database",
          details: dbError instanceof Error ? dbError.message : "Unknown database error",
        },
        { status: 503 },
      );
    }
  }
  catch (error) {
    console.error("Failed to fetch games:", error);

    return NextResponse.json({ error: "Failed to fetch games" }, { status: 500 });
  }
}

/**
 * @description
 * API route to add a new game to DynamoDB
 *
 * @param request - The Next.js request object
 * @returns A response indicating success or failure
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.discordId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user data to check permissions
    const userResponse = await fetch(`${request.nextUrl.origin}/api/user`, {
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json({ error: "Failed to get user data" }, { status: 403 });
    }

    const userData = await userResponse.json();

    // Check if user has Gamer permission
    if (!isGamer(userData)) {
      return NextResponse.json({ error: "Insufficient permissions. Gamer role required." }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const { gameId } = body;

    if (!gameId || typeof gameId !== "number") {
      return NextResponse.json({ error: "Valid game ID is required" }, { status: 400 });
    }

    // Check if game already exists
    const existingGame = await docClient.send(new ScanCommand({
      TableName: AWS_TABLES.GAMES,
      FilterExpression: "id = :gameId",
      ExpressionAttributeValues: {
        ":gameId": gameId,
      },
    }));

    if (existingGame.Items && existingGame.Items.length > 0) {
      return NextResponse.json({ error: "Game already exists in the database" }, { status: 409 });
    }

    // Add game to DynamoDB
    await docClient.send(new PutCommand({
      TableName: AWS_TABLES.GAMES,
      Item: {
        id: gameId,
      },
    }));

    return NextResponse.json({
      success: true,
      message: "Game added successfully",
      gameId,
    });
  }
  catch (error) {
    console.error("Failed to add game:", error);

    return NextResponse.json({ error: "Failed to add game" }, { status: 500 });
  }
}
