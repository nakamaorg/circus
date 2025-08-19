import type { NextRequest } from "next/server";

import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { InvokeCommand } from "@aws-sdk/client-lambda";
import { NextResponse } from "next/server";

import { lambda } from "@/lib/config/aws.config";
import { env } from "@/lib/config/env.config";
import { auth } from "@/lib/helpers/auth.helper";
import { isFenjer } from "@/lib/helpers/permission.helper";



const dynamoClient = new DynamoDBClient({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * @description
 * API route to fetch all matches from DynamoDB with field names
 *
 * @returns Response with matches data including field names
 */
export async function GET() {
  try {
    // First, get all matches
    const matchesCommand = new ScanCommand({
      TableName: "nakamaorg-matches",
    });

    const matchesResult = await dynamoClient.send(matchesCommand);

    // Then, get all fields to map field names
    const fieldsCommand = new ScanCommand({
      TableName: "nakamaorg-fields",
    });

    const fieldsResult = await dynamoClient.send(fieldsCommand);

    // Create a map of field_id to field_name
    const fieldsMap = new Map<string, string>();

    fieldsResult.Items?.forEach((item) => {
      const id = item.id?.S;
      const name = item.name?.S;

      if (id && name) {
        fieldsMap.set(id, name);
      }
    });

    const matches = matchesResult.Items?.map(item => ({
      id: item.id?.S || "",
      timestamp: Number.parseInt(item.timestamp?.N || "0"),
      field_id: item.field_id?.S || "",
      message: item.message?.S || "",
      field_name: fieldsMap.get(item.field_id?.S || "") || undefined,
    })) || [];

    return NextResponse.json({ matches });
  }
  catch (error) {
    console.error("Error fetching matches:", error);

    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 },
    );
  }
}

/**
 * @description
 * API route to create a new match via nakamaorg-core-match-create-match lambda
 *
 * @param request - The Next.js request object
 * @returns Response with match creation result
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth();

    if (!session?.user?.discordId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has Fenjer permission
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

    if (!isFenjer(userData)) {
      return NextResponse.json({ error: "Insufficient permissions. Fenjer role required." }, { status: 403 });
    }

    const body = await request.json();
    const { message, field_id, timestamp } = body;

    // Validation
    if (!field_id) {
      return NextResponse.json({ error: "Field ID is required" }, { status: 400 });
    }

    if (!timestamp || typeof timestamp !== "number") {
      return NextResponse.json({ error: "Valid timestamp is required" }, { status: 400 });
    }

    // Check if timestamp is in the future
    const currentTime = Math.floor(Date.now() / 1000);

    if (timestamp <= currentTime) {
      return NextResponse.json({ error: "Timestamp must be in the future" }, { status: 400 });
    }

    // Call the Lambda function
    const command = new InvokeCommand({
      FunctionName: "nakamaorg-core-match-create-match",
      Payload: JSON.stringify({
        message: message || null,
        field_id,
        timestamp,
      }),
    });

    const response = await lambda.send(command);

    if (!response.Payload) {
      return NextResponse.json({ error: "No response from lambda" }, { status: 500 });
    }

    const result = JSON.parse(new TextDecoder().decode(response.Payload));

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  }
  catch (error) {
    console.error("Error creating match:", error);

    return NextResponse.json(
      { error: "Failed to create match" },
      { status: 500 },
    );
  }
}
