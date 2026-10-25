import { z } from "zod";
import { LESSON_TYPES } from "@/components/courses/create/aiOutline";

/** Module add / edit form in the AI Generated Outline review modal. */
export const outlineModuleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Module title must be at least 3 characters")
    .max(120, "Module title must be 120 characters or less"),
  description: z.string().trim().max(300, "Description must be 300 characters or less"),
});

export type OutlineModuleInput = z.infer<typeof outlineModuleSchema>;

/** Lesson add / edit form in the AI Generated Outline review modal. */
export const outlineLessonSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Lesson title must be at least 3 characters")
    .max(150, "Lesson title must be 150 characters or less"),
  type: z.enum(LESSON_TYPES, { error: "Select a lesson type" }),
  durationMinutes: z
    .number({ error: "Enter the duration in minutes" })
    .int("Duration must be a whole number of minutes")
    .min(1, "Duration must be at least 1 minute")
    .max(600, "Duration must be 600 minutes or less"),
  summary: z.string().trim().max(500, "Summary must be 500 characters or less"),
});

export type OutlineLessonInput = z.infer<typeof outlineLessonSchema>;
