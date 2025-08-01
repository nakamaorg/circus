import { NextResponse } from "next/server";

import { getEvents } from "@/lib/helpers/event.helper";



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
  catch (error) {
    console.error("Failed to fetch events:", error);

    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
