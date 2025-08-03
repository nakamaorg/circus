import type { NextRequest } from "next/server";
import type { TUser } from "@/lib/types/user.type";

import { NumberValue, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";
import { AWS_TABLES, docClient } from "@/lib/config/aws.config";
import { auth } from "@/lib/helpers/auth.helper";
import { getUserDisplayName } from "@/lib/helpers/user.helper";



interface LWRecord {
  taker_id: string;
  giver_id: string;
  timestamp: number;
}

interface UserMap {
  [userId: string]: string; // userId -> display name
}

interface ReputationData {
  received: {
    ls: LWRecord[];
    ws: LWRecord[];
  };
  given: {
    ls: LWRecord[];
    ws: LWRecord[];
  };
  summary: {
    received_ls: number;
    received_ws: number;
    given_ls: number;
    given_ws: number;
  };
  users: UserMap;
}

/**
 * GET handler for fetching user reputation data (Ls and Ws)
 *
 * @param _request - The NextRequest object (not used)
 * @returns Promise resolving to NextResponse with reputation data
 */
export async function GET(_request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.discordId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First, get the user ID from the users table
    const userCommand = new ScanCommand({
      TableName: AWS_TABLES.USERS,
      FilterExpression: "discord_id = :discordId",
      ExpressionAttributeValues: {
        ":discordId": NumberValue.from(session.user.discordId),
      },
    });

    const userResult = await docClient.send(userCommand);

    if (!userResult.Items || userResult.Items.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = userResult.Items[0].id as string;

    // Fetch L history
    const lHistoryCommand = new ScanCommand({
      TableName: AWS_TABLES.L_HISTORY,
    });

    const lHistoryResult = await docClient.send(lHistoryCommand);
    const lHistory = (lHistoryResult.Items || []) as LWRecord[];

    // Fetch W history
    const wHistoryCommand = new ScanCommand({
      TableName: AWS_TABLES.W_HISTORY,
    });

    const wHistoryResult = await docClient.send(wHistoryCommand);
    const wHistory = (wHistoryResult.Items || []) as LWRecord[];

    // Filter and organize data correctly
    const receivedLs = lHistory.filter(record => record.taker_id === userId);
    const receivedWs = wHistory.filter(record => record.taker_id === userId);

    // Fixed: "given" should show records where current user is the giver
    const givenLs = lHistory.filter(record => record.giver_id === userId);
    const givenWs = wHistory.filter(record => record.giver_id === userId);

    // Collect all unique user IDs that we need to fetch names for
    const allRecords = [...receivedLs, ...receivedWs, ...givenLs, ...givenWs];
    const uniqueUserIds = new Set<string>();

    allRecords.forEach((record) => {
      uniqueUserIds.add(record.taker_id);
      uniqueUserIds.add(record.giver_id);
    });

    // Fetch all users data
    const allUsersCommand = new ScanCommand({
      TableName: AWS_TABLES.USERS,
    });

    const allUsersResult = await docClient.send(allUsersCommand);
    const allUsers = (allUsersResult.Items || []);

    // Build user map (userId -> display name)
    const userMap: UserMap = {};

    allUsers.forEach((user) => {
      const dbUser = user as Record<string, unknown>;
      const userObj: TUser = {
        id: dbUser.id as string,
        name: dbUser.username as string,
        autobiography: dbUser.autobiography as string,
        wanted: dbUser.wanted as boolean,
        discord: {
          id: String(dbUser.discord_id),
          name: "", // We don't have Discord name in DB
          avatar: null,
        },
      };

      userMap[userObj.id] = getUserDisplayName(userObj);
    });

    const reputationData: ReputationData = {
      received: {
        ls: receivedLs,
        ws: receivedWs,
      },
      given: {
        ls: givenLs,
        ws: givenWs,
      },
      summary: {
        received_ls: receivedLs.length,
        received_ws: receivedWs.length,
        given_ls: givenLs.length,
        given_ws: givenWs.length,
      },
      users: userMap,
    };

    return NextResponse.json(reputationData);
  }
  catch (error) {
    console.error("Error fetching reputation data:", error);

    return NextResponse.json(
      { error: "Failed to fetch reputation data" },
      { status: 500 },
    );
  }
}
