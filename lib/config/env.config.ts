import type { TEnv } from "../types/env.type";
import { env as ev } from "node:process";
import { envSchema } from "../schemas/env.schema";

import "server-only";



export const env: TEnv = {
  NEXTAUTH_URL: ev.NEXTAUTH_URL!,
  NEXTAUTH_SECRET: ev.NEXTAUTH_SECRET!,
  DISCORD_CLIENT_ID: ev.DISCORD_CLIENT_ID!,
  DISCORD_CLIENT_SECRET: ev.DISCORD_CLIENT_SECRET!,
} as const;

envSchema.parse(env);
