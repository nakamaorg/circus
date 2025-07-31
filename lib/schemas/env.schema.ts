import { z } from "zod";



export const envSchema = z.object({
  AUTH_SECRET: z.string().min(1, "Environment variable AUTH_SECRET is required"),
  AUTH_DISCORD_ID: z.string().min(1, "Environment variable AUTH_DISCORD_ID is required"),
  AUTH_DISCORD_SECRET: z.string().min(1, "Environment variable AUTH_DISCORD_SECRET is required"),
}).strict();
