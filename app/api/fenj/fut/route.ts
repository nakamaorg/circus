import type { NextRequest } from "next/server";

import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { NextResponse } from "next/server";



import { AWS_TABLES, dynamodb } from "@/lib/config/aws.config";
import { auth } from "@/lib/helpers/auth.helper";
import { getAPIConfig } from "@/lib/helpers/parameter-store.helper";
import { getFenjClubLogoUrl, getFenjPlayerImageUrl } from "@/lib/helpers/s3.helper";



// Simple in-memory cache for FUT cards
interface CacheEntry {
  imageUrl: string;
  timestamp: number;
  expiresAt: number;
}

interface FenjPlayer {
  id: string;
  user_id: string;
  country: string;
  defending: number;
  dribbling: number;
  fut_card: string;
  pace: number;
  passing: number;
  physical: number;
  shooting: number;
}

const futCardCache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

// Clean up expired cache entries
function cleanupCache(): void {
  const now = Date.now();

  for (const [key, entry] of futCardCache.entries()) {
    if (entry.expiresAt < now) {
      futCardCache.delete(key);
    }
  }
}

// Generate cache key based on user and fenj player ID
function generateCacheKey(userId: string, fenjPlayerId: string): string {
  return `${userId}:${fenjPlayerId}`;
}



/**
 * @description
 * API route to generate FUT card from third-wheel API
 *
 * @param request - The NextRequest object containing FUT card data
 * @returns A response with the FUT card image URL
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.discordId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user data to find the internal user ID
    const userResponse = await fetch(`${request.nextUrl.origin}/api/user`, {
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json({ error: "Failed to get user data" }, { status: 403 });
    }

    const userData = await userResponse.json();
    const userId = userData.id; // Internal user ID, not Discord ID

    // Clean up expired cache entries
    cleanupCache();

    try {
      // Get FENJ player data from DynamoDB using user_id (scan since we don't know the partition key)
      const scanCommand = new ScanCommand({
        TableName: AWS_TABLES.FENJ,
        FilterExpression: "user_id = :userId",
        ExpressionAttributeValues: {
          ":userId": { S: userId },
        },
      });

      const scanResult = await dynamodb.send(scanCommand);

      if (!scanResult.Items || scanResult.Items.length === 0) {
        return NextResponse.json({
          error: "FENJ player not found. You need to be registered in FENJ first.",
        }, { status: 404 });
      }

      // Get the first (and should be only) item
      const playerItem = scanResult.Items[0];

      // Parse the DynamoDB item
      const fenjPlayer: FenjPlayer = {
        id: playerItem.id?.S || "",
        user_id: playerItem.user_id?.S || "",
        country: playerItem.country?.S || "ma",
        defending: Number.parseInt(playerItem.defending?.N || "50", 10),
        dribbling: Number.parseInt(playerItem.dribbling?.N || "50", 10),
        fut_card: playerItem.fut_card?.S || "gold",
        pace: Number.parseInt(playerItem.pace?.N || "50", 10),
        passing: Number.parseInt(playerItem.passing?.N || "50", 10),
        physical: Number.parseInt(playerItem.physical?.N || "50", 10),
        shooting: Number.parseInt(playerItem.shooting?.N || "50", 10),
      };

      // Check cache first
      const cacheKey = generateCacheKey(userId, fenjPlayer.id);
      const cachedEntry = futCardCache.get(cacheKey);

      if (cachedEntry && cachedEntry.expiresAt > Date.now()) {
        return NextResponse.json({ imageUrl: cachedEntry.imageUrl });
      }

      // Get API configuration from Parameter Store (cached)
      const apiConfig = await getAPIConfig();
      const apiUrl = `${apiConfig.url}/api/v1/fenj/fut`;

      // Create FormData for multipart request
      const formData = new FormData();

      formData.append("kind", fenjPlayer.fut_card);
      formData.append("name", userData.discord?.name || "Player");
      formData.append("country", fenjPlayer.country);

      // Add individual stat fields
      formData.append("pace", fenjPlayer.pace.toString());
      formData.append("passing", fenjPlayer.passing.toString());
      formData.append("physical", fenjPlayer.physical.toString());
      formData.append("shooting", fenjPlayer.shooting.toString());
      formData.append("dribbling", fenjPlayer.dribbling.toString());
      formData.append("defending", fenjPlayer.defending.toString());

      // Fetch club logo from S3
      let clubLogoBlob: Blob;

      try {
        const clubLogoUrl = await getFenjClubLogoUrl();

        if (clubLogoUrl) {
          const clubLogoResponse = await fetch(clubLogoUrl);

          if (clubLogoResponse.ok) {
            const clubLogoBuffer = await clubLogoResponse.arrayBuffer();

            clubLogoBlob = new Blob([clubLogoBuffer], { type: "image/png" });
          }
          else {
            throw new Error("Failed to fetch club logo from S3");
          }
        }
        else {
          throw new Error("No club logo URL available");
        }
      }
      catch (logoError) {
        console.error("Failed to fetch club logo from S3:", logoError);
        // Fallback to public logo
        const logoResponse = await fetch(`${request.nextUrl.origin}/logo.png`);
        const logoBuffer = await logoResponse.arrayBuffer();

        clubLogoBlob = new Blob([logoBuffer], { type: "image/png" });
      }

      // Fetch player image from S3
      let playerImageBlob: Blob;

      try {
        const playerImageUrl = await getFenjPlayerImageUrl(String(fenjPlayer.id));

        if (playerImageUrl) {
          const playerImageResponse = await fetch(playerImageUrl);

          if (playerImageResponse.ok) {
            const playerImageBuffer = await playerImageResponse.arrayBuffer();

            playerImageBlob = new Blob([playerImageBuffer], { type: "image/png" });
          }
          else {
            throw new Error("Failed to fetch player image from S3");
          }
        }
        else {
          throw new Error("No player image URL available");
        }
      }
      catch (playerImageError) {
        console.error("Failed to fetch player image from S3:", playerImageError);
        // Create a simple placeholder for player image (transparent PNG)
        const placeholderImageData = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
        const placeholderBuffer = Uint8Array.from(atob(placeholderImageData), c => c.charCodeAt(0));

        playerImageBlob = new Blob([placeholderBuffer], { type: "image/png" });
      }

      formData.append("clubLogo", clubLogoBlob, "logo.png");
      formData.append("playerImage", playerImageBlob, "player.png");

      const headers = {
        "Authorization": apiConfig.secret,
        "ngrok-skip-browser-warning": "true",
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        const responseText = await response.text();

        console.error("Third-wheel API error:", {
          status: response.status,
          statusText: response.statusText,
          response: responseText,
          url: apiUrl,
        });
        throw new Error(`Third-wheel API returned ${response.status}: ${responseText}`);
      }

      // The API returns the image as a file attachment
      // We need to convert it to a blob URL
      const imageBlob = await response.blob();
      const imageArrayBuffer = await imageBlob.arrayBuffer();
      const uint8Array = new Uint8Array(imageArrayBuffer);

      // Convert to base64 efficiently for large images
      let binaryString = "";
      const chunkSize = 0x8000; // 32KB chunks to avoid call stack issues

      for (let i = 0; i < uint8Array.length; i += chunkSize) {
        const chunk = uint8Array.subarray(i, i + chunkSize);

        binaryString += String.fromCharCode(...chunk);
      }
      const imageBase64 = btoa(binaryString);
      const imageUrl = `data:image/png;base64,${imageBase64}`;

      // Cache the result
      const now = Date.now();
      const cacheEntry: CacheEntry = {
        imageUrl,
        timestamp: now,
        expiresAt: now + CACHE_TTL,
      };

      futCardCache.set(cacheKey, cacheEntry);

      return NextResponse.json({ imageUrl });
    }
    catch (apiError) {
      console.error("Failed to generate FUT card from third-wheel API:", apiError);

      // Return error instead of fallback
      return NextResponse.json(
        {
          error: "Failed to generate FUT card from external API",
          details: apiError instanceof Error ? apiError.message : "Unknown error",
        },
        { status: 503 },
      );
    }
  }
  catch (error) {
    console.error("Failed to generate FUT card:", error);

    return NextResponse.json({ error: "Failed to generate FUT card" }, { status: 500 });
  }
}
