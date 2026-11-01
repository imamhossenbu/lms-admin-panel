import { z } from "zod";

/**
 * Create / Edit Assignment WIZARD (7 steps). ONE react-hook-form instance typed as
 * `AssignmentWizardValues`; each step validates only its own fields (WIZARD_STEP_FIELDS) on
 * "Save & Continue", and the Review step validates everything before Create/Save.
 * Convert to/from AssignmentItem with src/lib/assignmentWizardMapping.ts.
 */

export const WIZARD_STEPS = ["basic", "instructions", "submission", "grading", "rubric", "schedule", "review"] as const;
export type WizardStep = (typeof WIZARD_STEPS)[number];

export const WIZARD_STEP_LABEL: Record<WizardStep, string> = {
  basic: "Basic Information",
  instructions: "Instructions",
  submission: "Submission Settings",
  grading: "Grading & Points",
  rubric: "Rubric",
  schedule: "Schedule",
  review: "Review",
};

export const WIZARD_TITLE_MAX = 200;
export const WIZARD_SHORT_DESCRIPTION_MAX = 500;
export const WIZARD_INSTRUCTIONS_MAX = 5000;
export const WIZARD_AI_CRITERIA_MAX = 500;
export const WIZARD_RUBRIC_TITLE_MAX = 100;
export const WIZARD_RUBRIC_DESCRIPTION_MAX = 300;

const plainLength = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim().length;
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date");
const optionalDate = z.string().refine((v) => v === "" || /^\d{4}-\d{2}-\d{2}$/.test(v), "Pick a valid date");
const time = z.string().regex(/^\d{2}:\d{2}$/, "Pick a time");
const optionalTime = z.string().refine((v) => v === "" || /^\d{2}:\d{2}$/.test(v), "Pick a valid time");
const at = (d: string, t: string) => (d ? Date.parse(`${d}T${t || "00:00"}`) : NaN);

export const wizardAttachmentSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  url: z.string().min(1),
  size: z.number().int().min(0),
  format: z.string(),
});

export const wizardCriterionSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(2, "Criterion name is required").max(80, "80 characters or less"),
  description: z.string().trim().min(3, "Describe what this criterion checks").max(200, "200 characters or less"),
  points: z.number({ error: "Enter points" }).int("Whole numbers only").min(1, "At least 1 point").max(1000, "Too many points"),
});
export type WizardCriterion = z.infer<typeof wizardCriterionSchema>;

export const assignmentWizardSchema = z
  .object({
    // ---- 1 Basic Information
    title: z.string().trim().min(3, "Title must be at least 3 characters").max(WIZARD_TITLE_MAX, `Title must be ${WIZARD_TITLE_MAX} characters or less`),
    shortDescriptionHtml: z
      .string()
      .refine((h) => plainLength(h) >= 10, "Short description must be at least 10 characters")
      .refine((h) => plainLength(h) <= WIZARD_SHORT_DESCRIPTION_MAX, `Short description must be ${WIZARD_SHORT_DESCRIPTION_MAX} characters or less`),
    courseId: z.string().min(1, "Select a course"),
    moduleId: z.string().min(1, "Select a module"),
    /** Optional lesson link (kept for existing assignments; not shown in the wizard). */
    lessonId: z.string(),
    type: z.enum(["FILE_UPLOAD", "TEXT", "LINK"], { error: "Select an assignment type" }),
    category: z.string(),
    difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
    estimatedTime: z.number({ error: "Enter a number" }).min(0, "Can't be negative").max(1000, "Too long"),
    estimatedUnit: z.enum(["MINUTES", "HOURS"]),

    // ---- 2 Instructions
    instructionsHtml: z
      .string()
      .refine((h) => plainLength(h) >= 20, "Instructions must be at least 20 characters")
      .refine((h) => plainLength(h) <= WIZARD_INSTRUCTIONS_MAX, `Instructions must be ${WIZARD_INSTRUCTIONS_MAX} characters or less`),
    attachments: z.array(wizardAttachmentSchema).max(10, "Add up to 10 attachments"),

    // ---- 3 Submission Settings (type is shared with step 1)
    allowedFileTypes: z.array(z.string().regex(/^\.[a-z0-9]+$/, "Use a file extension like .pdf")).max(20, "Up to 20 file types"),
    maxFiles: z.number({ error: "Select a number" }).int().min(1, "At least 1 file").max(10, "Up to 10 files"),
    maxFileSizeMb: z.number({ error: "Enter a size" }).int().min(1, "At least 1 MB").max(500, "500 MB or less"),
    lateSubmission: z.enum(["ALLOW", "ALLOW_WITH_PENALTY", "DISALLOW"]),
    latePenalty: z.number({ error: "Enter a penalty" }).min(0, "Can't be negative").max(100, "Too large"),
    latePenaltyUnit: z.enum(["PERCENT", "POINTS"]),
    attemptsMode: z.enum(["UNLIMITED", "LIMITED", "SINGLE"]),
    maxAttempts: z.number({ error: "Enter a number" }).int("Whole numbers only").min(2, "At least 2 attempts").max(10, "Up to 10 attempts"),

    // ---- 4 Grading & Points
    totalPoints: z.number({ error: "Enter total points" }).int("Whole numbers only").min(1, "At least 1 point").max(1000, "1000 points or less"),
    gradingType: z.enum(["POINTS", "PASS_FAIL", "LETTER"]),
    /** null = no passing score. */
    passingScore: z.number().int("Whole numbers only").min(0, "Can't be negative").nullable(),
    gradeDisplay: z.enum(["EXACT", "GRADE_ONLY"]),
    aiGradingEnabled: z.boolean(),
    aiGradingCriteria: z.string().trim().max(WIZARD_AI_CRITERIA_MAX, `${WIZARD_AI_CRITERIA_MAX} characters or less`),
    manualOverride: z.boolean(),

    // ---- 5 Rubric
    rubricTitle: z.string().trim().min(3, "Rubric title must be at least 3 characters").max(WIZARD_RUBRIC_TITLE_MAX, `${WIZARD_RUBRIC_TITLE_MAX} characters or less`),
    rubricDescription: z.string().trim().max(WIZARD_RUBRIC_DESCRIPTION_MAX, `${WIZARD_RUBRIC_DESCRIPTION_MAX} characters or less`),
    criteria: z.array(wizardCriterionSchema).min(1, "Add at least one criterion").max(12, "Up to 12 criteria"),

    // ---- 6 Schedule
    releaseDate: date,
    releaseTime: time,
    dueDate: date,
    dueTime: time,
    availability: z.enum(["UNTIL_DUE", "TIME_LIMIT", "WINDOW"]),
    timeLimitMinutes: z.number({ error: "Enter minutes" }).int("Whole minutes only").min(5, "At least 5 minutes").max(10080, "Up to 7 days"),
    windowStartDate: optionalDate,
    windowStartTime: optionalTime,
    windowEndDate: optionalDate,
    windowEndTime: optionalTime,
    showInCalendar: z.boolean(),
  })
  .superRefine((v, ctx) => {
    if (v.type === "FILE_UPLOAD" && v.allowedFileTypes.length === 0)
      ctx.addIssue({ code: "custom", path: ["allowedFileTypes"], message: "Allow at least one file type" });
    if (v.lateSubmission === "ALLOW_WITH_PENALTY") {
      if (v.latePenalty <= 0) ctx.addIssue({ code: "custom", path: ["latePenalty"], message: "Enter a penalty greater than 0" });
      if (v.latePenaltyUnit === "PERCENT" && v.latePenalty > 100) ctx.addIssue({ code: "custom", path: ["latePenalty"], message: "Percentage can't exceed 100" });
      if (v.latePenaltyUnit === "POINTS" && v.latePenalty > v.totalPoints) ctx.addIssue({ code: "custom", path: ["latePenalty"], message: "Penalty can't exceed the total points" });
    }
    if (v.passingScore !== null && v.passingScore > v.totalPoints)
      ctx.addIssue({ code: "custom", path: ["passingScore"], message: `Passing score can't exceed ${v.totalPoints}` });
    if (v.aiGradingEnabled && v.aiGradingCriteria.length < 10)
      ctx.addIssue({ code: "custom", path: ["aiGradingCriteria"], message: "Describe what the AI should evaluate (at least 10 characters)" });
    const sum = v.criteria.reduce((s, c) => s + c.points, 0);
    if (v.criteria.length && sum !== v.totalPoints)
      ctx.addIssue({ code: "custom", path: ["criteria"], message: `Criteria add up to ${sum} points — they must equal the total points (${v.totalPoints})` });
    const release = at(v.releaseDate, v.releaseTime);
    const due = at(v.dueDate, v.dueTime);
    if (!Number.isNaN(release) && !Number.isNaN(due) && due <= release)
      ctx.addIssue({ code: "custom", path: ["dueDate"], message: "Due date must be after the release date" });
    if (v.availability === "WINDOW") {
      const ws = at(v.windowStartDate, v.windowStartTime);
      const we = at(v.windowEndDate, v.windowEndTime);
      if (Number.isNaN(ws)) ctx.addIssue({ code: "custom", path: ["windowStartDate"], message: "Pick the window start" });
      if (Number.isNaN(we)) ctx.addIssue({ code: "custom", path: ["windowEndDate"], message: "Pick the window end" });
      if (!Number.isNaN(ws) && !Number.isNaN(we) && we <= ws) ctx.addIssue({ code: "custom", path: ["windowEndDate"], message: "Window end must be after the start" });
    }
  });

export type AssignmentWizardValues = z.infer<typeof assignmentWizardSchema>;

/** Fields each step validates on "Save & Continue" (use with form.trigger). */
export const WIZARD_STEP_FIELDS: Record<Exclude<WizardStep, "review">, (keyof AssignmentWizardValues)[]> = {
  basic: ["title", "shortDescriptionHtml", "courseId", "moduleId", "type", "category", "difficulty", "estimatedTime", "estimatedUnit"],
  instructions: ["instructionsHtml", "attachments"],
  submission: ["type", "allowedFileTypes", "maxFiles", "maxFileSizeMb", "lateSubmission", "latePenalty", "latePenaltyUnit", "attemptsMode", "maxAttempts"],
  grading: ["totalPoints", "gradingType", "passingScore", "gradeDisplay", "aiGradingEnabled", "aiGradingCriteria", "manualOverride"],
  rubric: ["rubricTitle", "rubricDescription", "criteria"],
  schedule: ["releaseDate", "releaseTime", "dueDate", "dueTime", "availability", "timeLimitMinutes", "windowStartDate", "windowStartTime", "windowEndDate", "windowEndTime", "lateSubmission", "latePenalty", "latePenaltyUnit", "showInCalendar"],
};

/** First step that owns a field (for jumping to errors from Review). */
export const stepOfField = (field: string): WizardStep =>
  (Object.entries(WIZARD_STEP_FIELDS) as [WizardStep, string[]][]).find(([, fields]) => fields.includes(field.split(".")[0]))?.[0] ?? "basic";

export const ASSIGNMENT_CATEGORIES = ["Practice", "Project", "Homework", "Lab", "Assessment", "Bonus"] as const;
export const DEFAULT_ALLOWED_FILE_TYPES = [".html", ".htm", ".zip", ".pdf", ".doc", ".docx", ".txt", ".png", ".jpg"];
export const ALL_FILE_TYPE_OPTIONS = [...DEFAULT_ALLOWED_FILE_TYPES, ".css", ".js", ".ppt", ".pptx", ".xlsx", ".csv", ".gif", ".mp4", ".rar"];
