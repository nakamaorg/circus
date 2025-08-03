import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";

import { AWS_TABLES, docClient } from "@/lib/config/aws.config";
import { auth } from "@/lib/helpers/auth.helper";



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

    const dbCommand = new ScanCommand({
      TableName: AWS_TABLES.GAMES,
    });

    const dbResult = await docClient.send(dbCommand);

    if (!dbResult.Items) {
      return NextResponse.json([]);
    }

    // Extract game IDs from the items
    const gameIds = dbResult.Items.map(item => item.id || item.game_id);

    return NextResponse.json({ gameIds });
  }
  catch (error) {
    console.error("Failed to fetch games:", error);

    return NextResponse.json({ error: "Failed to fetch games" }, { status: 500 });
  }
}
