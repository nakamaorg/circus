import type { NextRequest } from "next/server";
import type { TUser } from "@/lib/types/user.type";

import { NumberValue, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";
import { AWS_TABLES, docClient } from "@/lib/config/aws.config";
import { auth } from "@/lib/helpers/auth.helper";



/**
 * GET handler for fetching user data
 *
 * @param _request - The NextRequest object (not used)
 * @returns Promise resolving to NextResponse with user data
 */
export async function GET(_request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.discordId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbCommand = new ScanCommand({
      TableName: AWS_TABLES.USERS,
      FilterExpression: "discord_id = :discordId",
      ExpressionAttributeValues: {
        ":discordId": NumberValue.from(session.user.discordId),
      },
    });

    const dbResult = await docClient.send(dbCommand);

    if (!dbResult.Items || dbResult.Items.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const dbUser = dbResult.Items[0] as Record<string, unknown>;

    const user: TUser = {
      id: dbUser.id as string,
      name: dbUser.username as string,
      autobiography: dbUser.autobiography as string,
      wanted: dbUser.wanted as boolean,
      discord: {
        id: session.user.discordId,
        name: session.user.name || "Unknown",
        avatar: session.user.image || null,
      },
    };

    return NextResponse.json(user);
  }
  catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
