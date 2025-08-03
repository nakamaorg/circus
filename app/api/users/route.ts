import type { NextRequest } from "next/server";

import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";

import { AWS_TABLES, docClient } from "@/lib/config/aws.config";
import { auth } from "@/lib/helpers/auth.helper";



interface UserResponse {
  discord_id: string;
  username: string;
}

/**
 * @description
 * API route to get all users for lookup purposes
 * Used for global endorsements to map discord_id to username
 *
 * @param _request - The NextRequest object (not used)
 * @returns A response with users data
 */
export async function GET(_request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.discordId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const command = new ScanCommand({
        TableName: AWS_TABLES.USERS,
        ProjectionExpression: "discord_id, username",
      });

      const result = await docClient.send(command);

      if (!result.Items) {
        return NextResponse.json([]);
      }

      const users: UserResponse[] = result.Items.map(item => ({
        discord_id: item.discord_id?.toString() || "",
        username: item.username || "Unknown User",
      }));

      return NextResponse.json(users);
    }
    catch (dbError) {
      console.error("DynamoDB scan failed:", dbError);

      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
  }
  catch (error) {
    console.error("Failed to get users:", error);

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
