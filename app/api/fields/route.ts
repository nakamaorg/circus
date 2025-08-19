import type { NextRequest } from "next/server";

import { DynamoDBClient, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { NextResponse } from "next/server";

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

/**
 * @description
 * API route to create a new field in DynamoDB
 *
 * @param request - The Next.js request object
 * @returns Response with field creation result
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
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

    if (!isFenjer(userData)) {
      return NextResponse.json({ error: "Insufficient permissions. Fenjer role required." }, { status: 403 });
    }

    const body = await request.json();
    const { name, location } = body;

    // Validation
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Field name is required" }, { status: 400 });
    }

    if (!location || typeof location !== "string" || !location.trim()) {
      return NextResponse.json({ error: "Field location is required" }, { status: 400 });
    }

    // Validate location is a URL
    try {
      const url = new URL(location.trim());

      if (!url.protocol) {
        throw new Error("Invalid URL");
      }
    }
    catch {
      return NextResponse.json({ error: "Location must be a valid URL" }, { status: 400 });
    }

    // Generate a unique ID for the field
    const fieldId = crypto.randomUUID();

    // Create the field in DynamoDB
    const putCommand = new PutItemCommand({
      TableName: "nakamaorg-fields",
      Item: {
        id: { S: fieldId },
        name: { S: name.trim() },
        location: { S: location.trim() },
      },
    });

    await dynamoClient.send(putCommand);

    return NextResponse.json({
      id: fieldId,
      name: name.trim(),
      location: location.trim(),
    });
  }
  catch (error) {
    console.error("Error creating field:", error);

    return NextResponse.json(
      { error: "Failed to create field" },
      { status: 500 },
    );
  }
}
