import { z } from "zod";

export const createCourseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  slug: z.string().min(3, "Slug is required").regex(/^[a-z0-9-]+$/, "Only lowercase, numbers, hyphens"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  categoryId: z.string().min(1, "Category is required"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  price: z.number().min(0, "Price cannot be negative"),
  isFree: z.boolean(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;

// ---------------------------------------------------------------------------
// Create Course page — Step 1 "Basic Information"
// ---------------------------------------------------------------------------

export const COURSE_TITLE_MAX = 100;
export const COURSE_SHORT_DESCRIPTION_MAX = 200;
export const COURSE_DESCRIPTION_MAX = 5000;
export const COURSE_TAGS_MAX = 10;

/** Plain-text length of rich-text HTML (what the counter and limits measure). */
export const richTextLength = (html: string) =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim().length;

export const courseBasicInfoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Course title must be at least 3 characters")
    .max(COURSE_TITLE_MAX, `Course title can be at most ${COURSE_TITLE_MAX} characters`),
  shortDescription: z
    .string()
    .trim()
    .min(20, "Short description must be at least 20 characters")
    .max(COURSE_SHORT_DESCRIPTION_MAX, `Short description can be at most ${COURSE_SHORT_DESCRIPTION_MAX} characters`),
  description: z
    .string()
    .refine((html) => richTextLength(html) >= 50, "Full description must be at least 50 characters")
    .refine((html) => richTextLength(html) <= COURSE_DESCRIPTION_MAX, `Full description can be at most ${COURSE_DESCRIPTION_MAX} characters`),
  thumbnail: z.string().min(1, "Please upload a course thumbnail"),
  promoVideo: z.string(),
  categoryId: z.string().min(1, "Please select a category"),
  subcategory: z.string(),
  language: z.string().min(1, "Please select a language"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"], {
    message: "Please select a level",
  }),
  tags: z.array(z.string().trim().min(1)).max(COURSE_TAGS_MAX, `You can add up to ${COURSE_TAGS_MAX} tags`),
});

export type CourseBasicInfoInput = z.infer<typeof courseBasicInfoSchema>;
