import type { TEnv } from "../types/env.type";
import { env as ev } from "node:process";
import { envSchema } from "../schemas/env.schema";

import "server-only";



export const env: TEnv = {
  AUTH_SECRET: ev.AUTH_SECRET!,
  AUTH_DISCORD_ID: ev.AUTH_DISCORD_ID!,
  AUTH_DISCORD_SECRET: ev.AUTH_DISCORD_SECRET!,
} as const;

envSchema.parse(env);
