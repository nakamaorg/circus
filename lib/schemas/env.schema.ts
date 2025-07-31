import { z } from "zod";



export const envSchema = z.object({
  AUTH_SECRET: z.string().min(1, "Environment variable AUTH_SECRET is required"),
  AUTH_DISCORD_ID: z.string().min(1, "Environment variable AUTH_DISCORD_ID is required"),
  AUTH_DISCORD_SECRET: z.string().min(1, "Environment variable AUTH_DISCORD_SECRET is required"),
  AWS_REGION: z.string().min(1, "Environment variable AWS_REGION is required"),
  AWS_ACCESS_KEY_ID: z.string().min(1, "Environment variable AWS_ACCESS_KEY_ID is required"),
  AWS_SECRET_ACCESS_KEY: z.string().min(1, "Environment variable AWS_SECRET_ACCESS_KEY is required"),
}).strict();
