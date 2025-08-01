import type { NextRequest } from "next/server";

import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

import { AWS_BUCKETS, s3 } from "@/lib/config/aws.config";
import { getLoreMediaUrl } from "@/lib/helpers/s3.helper";



/**
 * @description
 * API route to fetch lore media items from S3 bucket with presigned URLs
 * Handles both images and videos from assets/images/lore/ and assets/videos/lore/
 *
 * @param _request - The incoming request (unused)
 * @returns Response with media items array
 */
export async function GET(_request: NextRequest) {
  try {
    const bucketName = AWS_BUCKETS.NAKAMAORG;

    if (!bucketName) {
      return NextResponse.json(
        { error: "S3 bucket name not configured" },
        { status: 500 },
      );
    }

    // Define the prefixes for lore content
    const prefixes = ["assets/images/lore/", "assets/videos/lore/"];
    const mediaItems: Array<{
      key: string;
      url: string;
      type: "image" | "video";
      name: string;
    }> = [];

    // Fetch objects from both prefixes
    for (const prefix of prefixes) {
      try {
        const command = new ListObjectsV2Command({
          Bucket: bucketName,
          Prefix: prefix,
        });

        const response = await s3.send(command);

        if (response.Contents) {
          for (const object of response.Contents) {
            if (object.Key && object.Key !== prefix) {
              // Skip directories
              const fileName = object.Key.split("/").pop();

              if (!fileName) {
                continue;
              }

              // Determine file type
              const ext = fileName.toLowerCase().split(".").pop();
              const videoExts = ["mp4", "webm", "mov", "avi", "mkv"];
              const imageExts = ["jpg", "jpeg", "png", "gif", "webp", "svg"];

              let type: "image" | "video" = "image";

              if (videoExts.includes(ext || "")) {
                type = "video";
              }
              else if (!imageExts.includes(ext || "")) {
                continue; // Skip unknown file types
              }

              // Generate presigned URL
              const url = await getLoreMediaUrl(object.Key);

              if (url) {
                mediaItems.push({
                  key: object.Key,
                  url,
                  type,
                  name: fileName,
                });
              }
            }
          }
        }
      }
      catch (error) {
        console.error(`Error fetching objects with prefix ${prefix}:`, error);
        // Continue with other prefixes even if one fails
      }
    }

    // Sort by name for consistent ordering
    mediaItems.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({
      success: true,
      items: mediaItems,
      count: mediaItems.length,
    });
  }
  catch (error) {
    console.error("Error fetching lore media:", error);

    return NextResponse.json(
      { error: "Failed to fetch lore media" },
      { status: 500 },
    );
  }
}
