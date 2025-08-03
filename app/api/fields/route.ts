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
 * API route to fetch all fields from DynamoDB
 *
 * @returns Response with fields data
 */
export async function GET() {
  try {
    const command = new ScanCommand({
      TableName: "nakamaorg-fields",
    });

    const result = await dynamoClient.send(command);

    const fields = result.Items?.map(item => ({
      id: item.id?.S || "",
      name: item.name?.S || "",
      location: item.location?.S || "",
    })) || [];

    return NextResponse.json({ fields });
  }
  catch (error) {
    console.error("Error fetching fields:", error);

    return NextResponse.json(
      { error: "Failed to fetch fields" },
      { status: 500 },
    );
  }
}
