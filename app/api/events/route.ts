import type { NextRequest } from "next/server";

import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

import { AWS_BUCKETS, dynamodb, s3 } from "@/lib/config/aws.config";
import { auth } from "@/lib/helpers/auth.helper";
import { getEvents } from "@/lib/helpers/event.helper";
import { isHistorian } from "@/lib/helpers/permission.helper";



/**
 * @description
 * API route to get all events
 *
 * @returns A response with the events
 */
export async function GET() {
  try {
    const events = await getEvents();

    return NextResponse.json(events);
  }
  catch {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

/**
 * @description
 * API route to create a new event (Historian only)
 *
 * @param request - The Next.js request object with FormData
 * @returns A response with the created event or error
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Check authentication
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

    // Check if user has Historian permission
    if (!isHistorian(userData)) {
      return NextResponse.json({ error: "Insufficient permissions. Historian role required." }, { status: 403 });
    }

    // Parse form data
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const timestamp = formData.get("timestamp") as string;
    const tagsString = formData.get("tags") as string;
    const photo = formData.get("photo") as File;

    // Validate required fields
    if (!title || !description || !timestamp || !photo) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate photo is actually an image
    if (!photo.type.startsWith("image/")) {
      return NextResponse.json({ error: "Photo must be an image file" }, { status: 400 });
    }

    // Validate file size (max 4MB)
    if (photo.size > 4 * 1024 * 1024) {
      return NextResponse.json({ error: "Photo size must be less than 4MB" }, { status: 400 });
    }

    // Parse tags
    let tags: string[] = [];

    try {
      tags = JSON.parse(tagsString);

      if (!Array.isArray(tags)) {
        tags = [];
      }
    }
    catch {
      tags = [];
    }

    // Generate UUID for the event
    const eventId = crypto.randomUUID();

    // Convert photo to PNG format and upload to S3
    const arrayBuffer = await photo.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const s3Key = `assets/images/events/${eventId}.png`;

    try {
      const uploadCommand = new PutObjectCommand({
        Bucket: AWS_BUCKETS.NAKAMAORG,
        Key: s3Key,
        Body: buffer,
        ContentType: "image/png",
        Metadata: {
          originalName: photo.name,
          uploadedBy: session.user.discordId,
          uploadedAt: new Date().toISOString(),
          eventId,
        },
      });

      await s3.send(uploadCommand);
    }
    catch (error) {
      console.error("Error uploading photo to S3:", error);

      return NextResponse.json({ error: "Failed to upload photo" }, { status: 500 });
    }

    // Save event to DynamoDB
    try {
      const putCommand = new PutItemCommand({
        TableName: "nakamaorg-events",
        Item: {
          id: { S: eventId },
          title: { S: title },
          description: { S: description },
          timestamp: { N: timestamp },
          keywords: { SS: tags.length > 0 ? tags : ["general"] },
        },
      });

      await dynamodb.send(putCommand);

      return NextResponse.json({
        success: true,
        event: {
          id: eventId,
          title,
          description,
          timestamp: Number.parseInt(timestamp, 10),
          keywords: tags.length > 0 ? tags : ["general"],
        },
      });
    }
    catch (error) {
      console.error("Error saving event to DynamoDB:", error);

      // Try to clean up uploaded photo if DynamoDB save fails
      // Note: In production, you might want to implement a cleanup mechanism
      return NextResponse.json({ error: "Failed to save event" }, { status: 500 });
    }
  }
  catch (error) {
    console.error("Error creating event:", error);

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
