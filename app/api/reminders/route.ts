import type { NextRequest } from "next/server";

import { InvokeCommand } from "@aws-sdk/client-lambda";
import { NextResponse } from "next/server";

import { lambda } from "@/lib/config/aws.config";
import { auth } from "@/lib/helpers/auth.helper";



/**
 * @description
 * API route to fetch user reminders from nakamaorg-core-reminder-get-user-reminders lambda
 *
 * @param _request - The Next.js request object (not used)
 * @returns User reminders data
 */
export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth();

    if (!session?.user?.discordId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Call the Lambda function
    const command = new InvokeCommand({
      FunctionName: "nakamaorg-core-reminder-get-user-reminders",
      Payload: JSON.stringify({
        user_id: session.user.discordId,
      }),
    });

    const response = await lambda.send(command);

    if (!response.Payload) {
      return NextResponse.json({ error: "No response from lambda" }, { status: 500 });
    }

    const result = JSON.parse(new TextDecoder().decode(response.Payload));

    return NextResponse.json(result);
  }
  catch (error) {
    console.error("Error fetching reminders:", error);

    return NextResponse.json(
      { error: "Failed to fetch reminders" },
      { status: 500 },
    );
  }
}
