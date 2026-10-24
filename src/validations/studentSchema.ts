import { z } from "zod";

export const createStudentSchema = z.object({
  name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(60, "Name cannot exceed 60 characters"),
  email: z.string().email("Please provide a valid email address"),
  phone: z.string().optional(),
  status: z.enum(["Active", "Inactive", "Suspended"]),
  enrolledCourseIds: z.array(z.string()),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
