import { z } from "zod";

export const createNoteSchema = z.object({
  note: z.string().min(1, { message: "Note Name is required" }),
  description: z.string().min(1, { message: "Description Name is required" }),
});

export type CreateNoteSchema = z.infer<typeof createNoteSchema>;

export const updateNoteSchema = createNoteSchema.extend({
  id: z.string().min(1),
});

export const deleteNoteSchema = z.object({
  id: z.string().min(1),
});
