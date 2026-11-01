import { z } from "zod";

export const CERT_PLACEHOLDERS = ["{student_name}", "{course_title}", "{completion_date}", "{grade}", "{instructor_name}", "{certificate_id}"] as const;

/** Template designer (/certificates/templates/new, /certificates/templates/[id]/edit). */
export const templateFormSchema = z
  .object({
    name: z.string().trim().min(3, "Template name must be at least 3 characters").max(80, "80 characters or less"),
    layout: z.enum(["CLASSIC", "MODERN", "MINIMAL"]),
    orientation: z.enum(["LANDSCAPE", "PORTRAIT"]),
    accent: z.enum(["orange", "blue", "green", "purple", "navy"]),
    heading: z.string().trim().min(3, "Heading is required").max(60, "60 characters or less"),
    bodyText: z.string().trim().min(20, "Write at least 20 characters").max(400, "400 characters or less"),
    showLogo: z.boolean(),
    showQr: z.boolean(),
    showGrade: z.boolean(),
    signers: z
      .array(
        z.object({
          id: z.string(),
          name: z.string().trim().min(2, "Signer name is required").max(60, "60 characters or less"),
          title: z.string().trim().min(2, "Signer title is required").max(60, "60 characters or less"),
          signatureUrl: z.string(),
        })
      )
      .min(1, "Add at least one signer")
      .max(3, "Up to 3 signers"),
    courseIds: z.array(z.string()),
    rules: z.object({
      autoIssue: z.boolean(),
      minCompletion: z.number({ error: "Enter a percentage" }).int("Whole numbers only").min(1, "At least 1%").max(100, "100% or less"),
      minQuizScore: z.number().int("Whole numbers only").min(1, "At least 1%").max(100, "100% or less").nullable(),
      requireAssignments: z.boolean(),
      validityMonths: z.number().int("Whole months only").min(1, "At least 1 month").max(120, "Up to 120 months").nullable(),
    }),
    status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]),
  })
  .superRefine((v, ctx) => {
    if (!v.bodyText.includes("{student_name}"))
      ctx.addIssue({ code: "custom", path: ["bodyText"], message: "Include {student_name} so each certificate is personalised" });
    const unknown = (v.bodyText.match(/\{[a-z_]+\}/g) ?? []).filter((p) => !(CERT_PLACEHOLDERS as readonly string[]).includes(p));
    if (unknown.length) ctx.addIssue({ code: "custom", path: ["bodyText"], message: `Unknown placeholder: ${unknown[0]}` });
    if (v.bodyText.includes("{grade}") && !v.showGrade)
      ctx.addIssue({ code: "custom", path: ["bodyText"], message: "Turn on “Show grade” to use {grade}" });
    if (v.status === "ACTIVE" && v.courseIds.length === 0)
      ctx.addIssue({ code: "custom", path: ["courseIds"], message: "Assign at least one course to activate this template" });
  });
export type TemplateFormValues = z.infer<typeof templateFormSchema>;

/** Manual issue modal. */
export const issueCertificateSchema = z.object({
  courseId: z.string().min(1, "Select a course"),
  recipientId: z.string().min(1, "Select a learner"),
  grade: z.number().int("Whole numbers only").min(0, "0 or more").max(100, "100 or less").nullable(),
  completedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick the completion date"),
  sendEmail: z.boolean(),
  note: z.string().trim().max(200, "200 characters or less"),
});
export type IssueCertificateValues = z.infer<typeof issueCertificateSchema>;

/** Revoke modal. */
export const revokeCertificateSchema = z.object({
  reason: z.enum(["ACADEMIC_MISCONDUCT", "ISSUED_IN_ERROR", "REFUND", "OTHER"]),
  details: z.string().trim().max(300, "300 characters or less"),
  notifyLearner: z.boolean(),
}).superRefine((v, ctx) => {
  if (v.reason === "OTHER" && v.details.length < 5) ctx.addIssue({ code: "custom", path: ["details"], message: "Explain why (at least 5 characters)" });
});
export type RevokeCertificateValues = z.infer<typeof revokeCertificateSchema>;
