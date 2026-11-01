import { z } from "zod";

/** Create / Edit Assignment page, Rubric tab, Instructions editor and the Grade Submission modal. */

export const ASSIGNMENT_TITLE_MAX = 100;
export const ASSIGNMENT_DESCRIPTION_MAX = 2000;
export const RUBRIC_DESCRIPTION_MAX = 500;

const plain = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a due date");
const timeString = z.string().regex(/^\d{2}:\d{2}$/, "Pick a due time");

export const assignmentAttachmentSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  url: z.string().min(1),
  size: z.number().int().min(0),
  format: z.string(),
});

// ---------------------------------------------------------------- Create / Edit form
export const assignmentFormSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(ASSIGNMENT_TITLE_MAX, `Title must be ${ASSIGNMENT_TITLE_MAX} characters or less`),
  descriptionHtml: z
    .string()
    .refine((h) => plain(h).length >= 10, "Description must be at least 10 characters")
    .refine((h) => plain(h).length <= ASSIGNMENT_DESCRIPTION_MAX, `Description must be ${ASSIGNMENT_DESCRIPTION_MAX} characters or less`),
  moduleId: z.string().min(1, "Select a module"),
  lessonId: z.string(),
  type: z.enum(["FILE_UPLOAD", "TEXT"]),
  dueDate: dateString,
  dueTime: timeString,
  totalPoints: z.number({ error: "Enter the total points" }).int("Whole numbers only").min(1, "At least 1 point").max(1000, "1000 points or less"),
  attempts: z.enum(["UNLIMITED", "1", "2", "3", "5"]),
  lateSubmission: z.enum(["ALLOW", "ALLOW_WITH_PENALTY", "DISALLOW"]),
  gradingType: z.enum(["POINTS", "PASS_FAIL", "NOT_GRADED"]),
  showRubric: z.boolean(),
  peerReview: z.boolean(),
  status: z.enum(["PUBLISHED", "DRAFT"]),
  attachments: z.array(assignmentAttachmentSchema).max(10, "Add up to 10 attachments"),
});
export type AssignmentFormValues = z.infer<typeof assignmentFormSchema>;

// ---------------------------------------------------------------- Instructions editor
export const assignmentInstructionsSchema = z.object({
  overview: z.string().trim().min(10, "Overview must be at least 10 characters").max(2000, "Overview must be 2000 characters or less"),
  objectives: z.array(z.object({ value: z.string().trim().min(3, "Too short").max(200, "200 characters or less") })).max(10, "Up to 10 objectives"),
  tasks: z.array(z.object({ value: z.string().trim().min(3, "Too short").max(200, "200 characters or less") })).min(1, "Add at least one task").max(15, "Up to 15 tasks"),
  requirements: z.array(z.object({ value: z.string().trim().min(3, "Too short").max(200, "200 characters or less") })).max(10, "Up to 10 requirements"),
  allowedFileTypes: z.array(z.string().regex(/^\.[a-z0-9]+$/, "Use a file extension like .pdf")).max(20, "Up to 20 file types"),
  maxFileSizeMb: z.number({ error: "Enter a size" }).int("Whole MB only").min(1, "At least 1 MB").max(500, "500 MB or less"),
  gradingNotes: z.array(z.object({ value: z.string().trim().min(3, "Too short").max(200, "200 characters or less") })).max(10, "Up to 10 notes"),
});
export type AssignmentInstructionsFormValues = z.infer<typeof assignmentInstructionsSchema>;

// ---------------------------------------------------------------- Rubric
export const rubricLevelSchema = z.object({
  id: z.string(),
  tone: z.enum(["EXCELLENT", "GOOD", "NEEDS_IMPROVEMENT"]),
  label: z.string().trim().min(2, "Level name is required").max(40, "40 characters or less"),
  points: z.number({ error: "Enter points" }).int("Whole numbers only").min(0, "Can't be negative").max(1000, "Too many points"),
  description: z.string().trim().min(3, "Describe this level").max(200, "200 characters or less"),
});

export const rubricCriterionSchema = z
  .object({
    id: z.string(),
    title: z.string().trim().min(2, "Criterion name is required").max(80, "80 characters or less"),
    points: z.number({ error: "Enter points" }).int("Whole numbers only").min(1, "At least 1 point").max(1000, "Too many points"),
    levels: z.array(rubricLevelSchema).min(2, "Add at least 2 levels").max(5, "Up to 5 levels"),
  })
  .superRefine((c, ctx) => {
    const top = Math.max(...c.levels.map((l) => l.points));
    if (top !== c.points) ctx.addIssue({ code: "custom", path: ["points"], message: `Highest level (${top} pts) must equal the criterion points` });
  });

export const rubricSchema = z
  .object({
    enabled: z.boolean(),
    title: z.string().trim().min(3, "Rubric title must be at least 3 characters").max(100, "100 characters or less"),
    totalPoints: z.number({ error: "Enter total points" }).int("Whole numbers only").min(1, "At least 1 point").max(1000, "1000 points or less"),
    description: z.string().trim().max(RUBRIC_DESCRIPTION_MAX, `${RUBRIC_DESCRIPTION_MAX} characters or less`),
    visibleToStudents: z.boolean(),
    criteria: z.array(rubricCriterionSchema).max(12, "Up to 12 criteria"),
  })
  .superRefine((r, ctx) => {
    if (!r.enabled) return;
    if (r.criteria.length === 0) ctx.addIssue({ code: "custom", path: ["criteria"], message: "Add at least one criterion" });
    const sum = r.criteria.reduce((s, c) => s + c.points, 0);
    if (r.criteria.length && sum !== r.totalPoints)
      ctx.addIssue({ code: "custom", path: ["totalPoints"], message: `Criteria add up to ${sum} pts — they must equal the total (${r.totalPoints})` });
  });
export type RubricFormValues = z.infer<typeof rubricSchema>;

// ---------------------------------------------------------------- Grade submission (modal)
export const gradeSubmissionSchema = (totalPoints: number) =>
  z.object({
    score: z.number({ error: "Enter a score" }).min(0, "Score can't be negative").max(totalPoints, `Score can't exceed ${totalPoints}`),
    feedback: z.string().trim().max(1000, "Feedback must be 1000 characters or less"),
  });
export type GradeSubmissionValues = z.infer<ReturnType<typeof gradeSubmissionSchema>>;
