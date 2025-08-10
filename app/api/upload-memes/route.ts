import type { NextRequest } from "next/server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

import { AWS_BUCKETS, s3 } from "@/lib/config/aws.config";
import { auth } from "@/lib/helpers/auth.helper";
import { isMemer } from "@/lib/helpers/permission.helper";



interface UploadResult {
  success: boolean;
  filename: string;
  key: string;
  error?: string;
}

/**
 * @description
 * API route to upload meme files (images/videos) to S3
 * POST /api/upload-memes
 *
 * @param request - The Next.js request object with FormData
 * @returns Promise<NextResponse> - JSON response with upload results
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

    // Check if user has Memer permission
    if (!isMemer(userData)) {
      return NextResponse.json({ error: "Insufficient permissions. Memer role required." }, { status: 403 });
    }

    // Parse form data
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // Validate file count (max 10 files)
    if (files.length > 10) {
      return NextResponse.json({ error: "Maximum 10 files allowed per upload" }, { status: 400 });
    }

    const results: UploadResult[] = [];
    const maxFileSize = 4 * 1024 * 1024; // 4MB in bytes

    // Process each file
    for (const file of files) {
      try {
        // Validate file size
        if (file.size > maxFileSize) {
          results.push({
            success: false,
            filename: file.name,
            key: "",
            error: "File size exceeds 4MB limit",
          });
          continue;
        }

        // Validate file type
        const fileExtension = file.name.toLowerCase().split(".").pop() || "";
        const videoExts = ["mp4", "webm", "mov", "avi", "mkv"];
        const imageExts = ["jpg", "jpeg", "png", "gif", "webp"];

        let isVideo = false;

        if (videoExts.includes(fileExtension)) {
          isVideo = true;
        }
        else if (!imageExts.includes(fileExtension)) {
          results.push({
            success: false,
            filename: file.name,
            key: "",
            error: "Unsupported file type. Only images (jpg, jpeg, png, gif, webp) and videos (mp4, webm, mov, avi, mkv) are allowed.",
          });
          continue;
        }

        // Generate unique filename
        const timestamp = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const uniqueId = Math.random().toString(36).substring(2, 10); // Generate 8 char random string
        const safeFilename = file.name.replace(/[^a-z0-9.-]/gi, "_").toLowerCase();
        const newFilename = `${timestamp}-${uniqueId}-${safeFilename}`;

        // Determine S3 key based on file type
        const s3Key = isVideo
          ? `assets/videos/lore/${newFilename}`
          : `assets/images/lore/${newFilename}`;

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        // Upload to S3
        const uploadCommand = new PutObjectCommand({
          Bucket: AWS_BUCKETS.NAKAMAORG,
          Key: s3Key,
          Body: buffer,
          ContentType: file.type || (isVideo ? "video/mp4" : "image/jpeg"),
          Metadata: {
            originalName: file.name,
            uploadedBy: session.user.discordId,
            uploadedAt: new Date().toISOString(),
          },
        });

        await s3.send(uploadCommand);

        results.push({
          success: true,
          filename: file.name,
          key: s3Key,
        });
      }
      catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        results.push({
          success: false,
          filename: file.name,
          key: "",
          error: "Upload failed due to server error",
        });
      }
    }

    // Return results
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.length - successCount;

    return NextResponse.json({
      success: successCount > 0,
      results,
      summary: {
        total: results.length,
        successful: successCount,
        failed: failureCount,
      },
    });
  }
  catch (error) {
    console.error("Error in upload-memes API:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
