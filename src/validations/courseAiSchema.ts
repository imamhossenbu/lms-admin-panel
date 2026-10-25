import { z } from "zod";

export const AI_LEVEL_OPTIONS = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
  { value: "ALL_LEVELS", label: "All Levels" },
] as const;

export const AI_LANGUAGE_OPTIONS = ["English", "Bangla", "Hindi", "Urdu", "Arabic", "Spanish", "French", "German"] as const;

export const AI_DURATION_WEEK_OPTIONS = [4, 6, 8, 10, 12] as const;

export const AI_MODULE_COUNT_OPTIONS = [3, 4, 5, 6, 7, 8, 9, 10] as const;

export const courseAiSchema = z.object({
  topic: z
    .string()
    .trim()
    .min(3, "Course topic must be at least 3 characters")
    .max(100, "Course topic must be 100 characters or less"),
  audience: z
    .string()
    .trim()
    .min(5, "Describe your audience in at least 5 characters")
    .max(200, "Target audience must be 200 characters or less"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"], { message: "Select a course level" }),
  language: z.string().trim().min(1, "Language is required"),
  goals: z.string().trim().max(500, "Learning goals must be 500 characters or less").optional(),
  durationWeeks: z
    .number({ message: "Select a course duration" })
    .int()
    .min(1, "Duration must be at least 1 week")
    .max(52, "Duration can be at most 52 weeks"),
  moduleCount: z
    .number({ message: "Select the number of modules" })
    .int()
    .min(3, "At least 3 modules")
    .max(10, "At most 10 modules"),
  lessonsPerModule: z.enum(["2 - 3", "4 - 6", "6 - 8"], { message: "Select lessons per module" }),
});

export type CourseAiFormInput = z.infer<typeof courseAiSchema>;
