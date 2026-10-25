import { z } from "zod";

export const instructorFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(60, "Name cannot exceed 60 characters"),
  email: z.string().trim().email("Please provide a valid email address"),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || /^\+?[\d\s-]{8,20}$/.test(v), {
      message: "Please provide a valid phone number",
    }),
  status: z.enum(["Active", "Inactive"]),
});

export type InstructorFormInput = z.infer<typeof instructorFormSchema>;

export const instructorMessageSchema = z.object({
  subject: z
    .string()
    .trim()
    .min(3, "Subject must be at least 3 characters")
    .max(120, "Subject cannot exceed 120 characters"),
  body: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message cannot exceed 2000 characters"),
});

export type InstructorMessageInput = z.infer<typeof instructorMessageSchema>;

export const NOTE_TYPES = [
  "General",
  "Performance",
  "Content Update",
  "Onboarding",
  "Meeting",
  "Issue",
  "Payment",
] as const;

export const NOTE_PRIORITIES = ["Low", "Medium", "High"] as const;

export const instructorNoteSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title cannot exceed 100 characters"),
    content: z.string().refine((html) => html.replace(/<[^>]*>/g, "").trim().length >= 10, {
      message: "Note content must be at least 10 characters",
    }),
    type: z.enum(NOTE_TYPES, { message: "Please select a note type" }),
    priority: z.enum(NOTE_PRIORITIES, { message: "Please select a priority" }),
    hasReminder: z.boolean(),
    reminderDate: z.string().optional(),
    tags: z.array(z.string().trim().min(1).max(30)).max(10, "You can add up to 10 tags"),
  })
  .refine((data) => !data.hasReminder || !!data.reminderDate, {
    message: "Please pick a reminder date",
    path: ["reminderDate"],
  });

export type InstructorNoteInput = z.infer<typeof instructorNoteSchema>;
