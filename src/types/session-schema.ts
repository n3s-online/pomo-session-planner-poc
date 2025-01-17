import { z } from "zod";

export const sessionFormSchema = z.object({
  title: z.string().min(1, "Title is required").trim(),
  description: z.string().trim().optional(),
});

export type SessionFormData = z.infer<typeof sessionFormSchema>;
