import type { z } from "zod";
import type { envSchema } from "../schemas/env.schema";



export type TEnv = z.infer<typeof envSchema>;
