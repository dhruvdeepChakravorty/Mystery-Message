import { z } from "zod";

export const messageSchema = z.object({
  content: z.string().max(50, "Message Must be less than 50 words"),
});
