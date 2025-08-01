import type { TNullable } from "@eoussama/core";

import { GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AWS_BUCKETS, s3 } from "../config/aws.config";



/**
 * @description
 * Generate a presigned URL for a bounty image in S3
 *
 * @param userId - The user ID to get the bounty image for
 * @returns Promise<TNullable<string>> - The presigned URL or null if error/not found
 */
export async function getBountyImageUrl(userId: string): Promise<TNullable<string>> {
  try {
    const key = `assets/images/bounties/${userId}.png`;
    const exists = await bountyImageExists(userId);

    if (!exists) {
      return null;
    }

    const command = new GetObjectCommand({
      Bucket: AWS_BUCKETS.NAKAMAORG,
      Key: key,
    });

    // Generate presigned URL that expires in 1 hour
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

    return url;
  }
  catch {
    return null;
  }
}

/**
 * @description
 * Check if a bounty image exists for a user
 *
 * @param userId - The user ID to check for
 * @returns Promise<boolean> - Whether the bounty image exists
 */
export async function bountyImageExists(userId: string): Promise<boolean> {
  try {
    const key = `assets/images/bounties/${userId}.png`;

    const command = new HeadObjectCommand({
      Bucket: AWS_BUCKETS.NAKAMAORG,
      Key: key,
    });

    await s3.send(command);

    return true;
  }
  catch {
    return false;
  }
}
