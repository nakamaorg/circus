import type { TEvent } from "@/lib/types/event.type";
import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

import { dynamodb } from "@/lib/config/aws.config";
import { eventSchema } from "@/lib/schemas/event.schema";



/**
 * @description
 * Fetches all events from the DynamoDB table
 *
 * @returns A promise that resolves to an array of events
 */
export async function getEvents(): Promise<TEvent[]> {
  try {
    const command = new ScanCommand({
      TableName: "nakamaorg-events",
    });

    const { Items } = await dynamodb.send(command);

    if (!Items) {
      return [];
    }

    const events = Items.map((item) => {
      const unmarshalled = unmarshall(item);

      // Handle DynamoDB StringSet for keywords
      if (unmarshalled.keywords && typeof unmarshalled.keywords === "object" && !Array.isArray(unmarshalled.keywords)) {
        unmarshalled.keywords = Array.from(unmarshalled.keywords);
      }

      return unmarshalled;
    });

    return events.map(event => eventSchema.parse(event));
  }
  catch {
    throw new Error("Failed to fetch events.");
  }
}
