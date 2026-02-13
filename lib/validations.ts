import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const exerciseSchema = z.object({
  name: z.string().min(2),
  category: z.enum(["push", "pull", "legs", "upper", "lower", "annet"]),
  notes: z.string().optional(),
});

export const setSchema = z.object({
  weightKg: z.coerce.number().positive(),
  reps: z.coerce.number().int().positive(),
  rir: z.coerce.number().int().min(0).max(5).optional().nullable(),
  note: z.string().optional().nullable(),
});
