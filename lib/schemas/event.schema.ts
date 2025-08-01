import { z } from "zod";



export const EventSchema = z.object({
  id: z.string(),
  timestamp: z.number(),
  description: z.string(),
  keywords: z.array(z.string()),
  title: z.string(),
});
