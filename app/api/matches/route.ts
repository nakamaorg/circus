import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { NextResponse } from "next/server";

import { env } from "@/lib/config/env.config";



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
