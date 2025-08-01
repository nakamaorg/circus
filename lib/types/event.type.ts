import type z from "zod";
import type { eventSchema } from "../schemas/event.schema";



export type TEvent = z.infer<typeof eventSchema>;
