import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm";

import { env } from "../config/env.config";



let ssmClient: SSMClient | null = null;

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
 * Get API configuration from Parameter Store
 *
 * @returns Object containing API URL and secret
 */
export async function getAPIConfig(): Promise<{ url: string; secret: string }> {
  const [url, secret] = await Promise.all([
    getParameter(env.PARAM_API_URL),
    getParameter(env.PARAM_API_SECRET),
  ]);

  return { url, secret };
}
