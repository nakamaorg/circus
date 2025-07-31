/* eslint-disable node/prefer-global/process */

import type { TEnv } from "../types/env.type";
import { envSchema } from "../schemas/env.schema";

import "server-only";



const ev = process.env;

export const env: TEnv = {
  AUTH_SECRET: ev.AUTH_SECRET!,
  AUTH_DISCORD_ID: ev.AUTH_DISCORD_ID!,
  AUTH_DISCORD_SECRET: ev.AUTH_DISCORD_SECRET!,
  AWS_REGION: ev.AWS_REGION!,
  AWS_ACCESS_KEY_ID: ev.AWS_ACCESS_KEY_ID!,
  AWS_SECRET_ACCESS_KEY: ev.AWS_SECRET_ACCESS_KEY!,
} as const;

envSchema.parse(env);
