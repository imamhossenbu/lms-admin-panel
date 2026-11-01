import { z } from "zod";

/** Create / Edit Assignment page, Rubric tab, Instructions editor and the Grade Submission modal. */

export const RUBRIC_DESCRIPTION_MAX = 500;


export const assignmentAttachmentSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  url: z.string().min(1),
  size: z.number().int().min(0),
  format: z.string(),
});

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
    description: z.string().trim().max(200, "200 characters or less"),
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
