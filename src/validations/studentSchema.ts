import { z } from "zod";

/** Same rules as the Students API (CreateStudentDto / UpdateStudentDto). */
const PHONE_RE = /^$|^\+?[0-9 ()-]{7,20}$/;

const studentFields = {
  name: z.string().trim().min(2, "Full name must be at least 2 characters").max(60, "Name cannot exceed 60 characters"),
  email: z.string().trim().toLowerCase().email("Please provide a valid email address").max(254, "Email is too long"),
  phone: z.string().trim().regex(PHONE_RE, "Enter a valid phone number").optional(),
  status: z.enum(["Active", "Inactive", "Suspended"]),
};

export const createStudentSchema = z.object({
  ...studentFields,
  enrolledCourseIds: z.array(z.string()).max(50, "Enroll in at most 50 courses at once"),
});
export type CreateStudentInput = z.infer<typeof createStudentSchema>;

/** Profile fields edited on the details page and the edit page. */
export const studentInfoSchema = z.object(studentFields);
export type StudentInfoInput = z.infer<typeof studentInfoSchema>;

export const STUDENT_NOTE_CATEGORIES = ["good_progress", "needs_improvement", "student_support", "counseling_call", "payment_issue", "general"] as const;

export const studentNoteSchema = z.object({
  category: z.enum(STUDENT_NOTE_CATEGORIES, { message: "Choose a note category" }),
  content: z.string().trim().min(2, "Write a note first").max(2000, "Notes are limited to 2,000 characters"),
});
export type StudentNoteInput = z.infer<typeof studentNoteSchema>;
