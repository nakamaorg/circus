import { z } from "zod";



export const envSchema = z.object({
  NEXTAUTH_URL: z.string().min(1, "Environment variable NEXTAUTH_URL is required"),
  NEXTAUTH_SECRET: z.string().min(1, "Environment variable NEXTAUTH_SECRET is required"),
  DISCORD_CLIENT_ID: z.string().min(1, "Environment variable DISCORD_CLIENT_ID is required"),
  DISCORD_CLIENT_SECRET: z.string().min(1, "Environment variable DISCORD_CLIENT_SECRET is required"),
}).strict();
