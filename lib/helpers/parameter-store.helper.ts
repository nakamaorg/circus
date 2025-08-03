import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm";

import { env } from "../config/env.config";



let ssmClient: SSMClient | null = null;

// Cache for API configuration
let apiConfigCache: { url: string; secret: string } | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Get SSM client instance (singleton)
 *
 * @returns The SSM client instance
 */
function getSSMClient(): SSMClient {
  if (!ssmClient) {
    ssmClient = new SSMClient({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  return ssmClient;
}

/**
 * Retrieve a parameter value from Parameter Store
 *
 * @param parameterName - The name/path of the parameter
 * @param withDecryption - Whether to decrypt SecureString parameters
 * @returns The parameter value
 */
export async function getParameter(
  parameterName: string,
  withDecryption: boolean = true,
): Promise<string> {
  const client = getSSMClient();

  const command = new GetParameterCommand({
    Name: parameterName,
    WithDecryption: withDecryption,
  });

  const response = await client.send(command);

  if (!response.Parameter?.Value) {
    throw new Error(`Parameter ${parameterName} not found or has no value`);
  }

  return response.Parameter.Value;
}

/**
 * Get API configuration from Parameter Store with caching
 *
 * @returns Object containing API URL and secret
 */
export async function getAPIConfig(): Promise<{ url: string; secret: string }> {
  const now = Date.now();

  // Return cached config if it's still valid
  if (apiConfigCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return apiConfigCache;
  }

  try {
    const [url, secret] = await Promise.all([
      getParameter(env.PARAM_API_URL),
      getParameter(env.PARAM_API_SECRET),
    ]);

    // Update cache
    apiConfigCache = { url, secret };
    cacheTimestamp = now;

    return apiConfigCache;
  }
  catch (error) {
    console.error("Failed to fetch API config from Parameter Store:", error);
    throw new Error("Failed to retrieve API configuration from Parameter Store");
  }
}
