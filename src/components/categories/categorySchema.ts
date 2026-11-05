import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Category name must be at least 2 characters").max(60, "Category name cannot exceed 60 characters"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .max(80, "Slug cannot exceed 80 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and single hyphens"),
  description: z.string().max(300, "Description cannot exceed 300 characters"),
  status: z.enum(["Active", "Inactive"]),
  iconId: z.string().min(1, "Please select an icon"),
  /** "" = top level. */
  parentId: z.string(),
});

export type CategorySchemaValues = z.infer<typeof categorySchema>;
