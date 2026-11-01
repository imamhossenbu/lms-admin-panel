import { z } from "zod";

/**
 * Create / Edit Quiz WIZARD (4 steps: basic → questions → settings → review). ONE react-hook-form
 * typed as `QuizWizardValues`. Each step validates its own fields (QUIZ_STEP_FIELDS) on
 * "Save & Continue"; Review validates everything before Publish / Save as Draft.
 * Convert to/from QuizItem with src/lib/quizWizardMapping.ts.
 */

export const QUIZ_WIZARD_STEPS = ["basic", "questions", "settings", "review"] as const;
export type QuizWizardStep = (typeof QUIZ_WIZARD_STEPS)[number];
export const QUIZ_STEP_LABEL: Record<QuizWizardStep, string> = {
  basic: "Basic Information",
  questions: "Questions",
  settings: "Settings",
  review: "Review & Publish",
};

export const QUIZ_TITLE_MAX = 120;
export const QUIZ_DESCRIPTION_MAX = 1000;
export const QUIZ_INSTRUCTIONS_MAX = 1000;
export const QUESTION_TEXT_MAX = 500;
export const EXPLANATION_MAX = 500;
export const QUIZ_QUESTIONS_MAX = 100;

const plainLength = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim().length;
const optionalDate = z.string().refine((v) => v === "" || /^\d{4}-\d{2}-\d{2}$/.test(v), "Pick a valid date");

export const quizOptionSchema = z.object({
  id: z.string(),
  text: z.string().trim().min(1, "Option can't be empty").max(200, "200 characters or less"),
});

export const quizQuestionSchema = z
  .object({
    id: z.string(),
    kind: z.enum(["MULTIPLE_CHOICE", "MULTIPLE_SELECT", "TRUE_FALSE", "SHORT_ANSWER"]),
    questionHtml: z
      .string()
      .refine((h) => plainLength(h) >= 3, "Write the question")
      .refine((h) => plainLength(h) <= QUESTION_TEXT_MAX, `Question must be ${QUESTION_TEXT_MAX} characters or less`),
    options: z.array(quizOptionSchema).max(8, "Up to 8 options"),
    correctOptionIds: z.array(z.string()),
    acceptedAnswers: z.array(z.string().trim().min(1).max(200)).max(10, "Up to 10 accepted answers"),
    explanationHtml: z.string().refine((h) => plainLength(h) <= EXPLANATION_MAX, `Explanation must be ${EXPLANATION_MAX} characters or less`),
    points: z.number({ error: "Enter points" }).int("Whole numbers only").min(1, "At least 1 point").max(100, "100 points or less"),
    timeLimitSeconds: z.number().int("Whole seconds only").min(5, "At least 5 seconds").max(3600, "Up to 1 hour").nullable(),
    required: z.boolean(),
    shuffleOptions: z.boolean(),
  })
  .superRefine((q, ctx) => {
    if (q.kind === "SHORT_ANSWER") {
      if (q.acceptedAnswers.length === 0) ctx.addIssue({ code: "custom", path: ["acceptedAnswers"], message: "Add at least one accepted answer" });
      return;
    }
    if (q.options.length < 2) ctx.addIssue({ code: "custom", path: ["options"], message: "Add at least 2 options" });
    const texts = q.options.map((o) => o.text.trim().toLowerCase());
    if (new Set(texts).size !== texts.length) ctx.addIssue({ code: "custom", path: ["options"], message: "Options must be unique" });
    const valid = q.correctOptionIds.filter((id) => q.options.some((o) => o.id === id));
    if (valid.length === 0) ctx.addIssue({ code: "custom", path: ["correctOptionIds"], message: "Mark the correct answer" });
    if ((q.kind === "MULTIPLE_CHOICE" || q.kind === "TRUE_FALSE") && valid.length > 1)
      ctx.addIssue({ code: "custom", path: ["correctOptionIds"], message: "Only one answer can be correct" });
  });
export type QuizQuestionValues = z.infer<typeof quizQuestionSchema>;

export const quizWizardSchema = z
  .object({
    // ---- 1 Basic Information
    title: z.string().trim().min(3, "Quiz title must be at least 3 characters").max(QUIZ_TITLE_MAX, `Title must be ${QUIZ_TITLE_MAX} characters or less`),
    courseId: z.string().min(1, "Select a course"),
    moduleId: z.string().min(1, "Select a module"),
    difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
    descriptionHtml: z
      .string()
      .refine((h) => plainLength(h) >= 10, "Description must be at least 10 characters")
      .refine((h) => plainLength(h) <= QUIZ_DESCRIPTION_MAX, `Description must be ${QUIZ_DESCRIPTION_MAX} characters or less`),
    instructionsHtml: z.string().refine((h) => plainLength(h) <= QUIZ_INSTRUCTIONS_MAX, `Instructions must be ${QUIZ_INSTRUCTIONS_MAX} characters or less`),

    // ---- 2 Questions
    questions: z.array(quizQuestionSchema).min(1, "Add at least one question").max(QUIZ_QUESTIONS_MAX, `Up to ${QUIZ_QUESTIONS_MAX} questions`),

    // ---- 3 Settings (total marks = sum of question points, not an input)
    passingMarks: z.number({ error: "Enter passing marks" }).int("Whole numbers only").min(1, "At least 1 mark"),
    timeLimitMinutes: z.number().int("Whole minutes only").min(1, "At least 1 minute").max(600, "Up to 600 minutes").nullable(),
    maxAttempts: z.string().regex(/^(UNLIMITED|[1-9]|10)$/, "Select the number of attempts"),
    showCorrectAnswers: z.boolean(),
    showExplanation: z.boolean(),
    randomizeQuestions: z.boolean(),
    randomizeOptions: z.boolean(),
    startDate: optionalDate,
    endDate: optionalDate,
    access: z.enum(["ENROLLED", "ALL_STUDENTS", "SPECIFIC_GROUPS"]),
    requirePreviousLessons: z.boolean(),
    showImmediately: z.boolean(),
  })
  .superRefine((v, ctx) => {
    const total = v.questions.reduce((s, q) => s + q.points, 0);
    if (total > 0 && v.passingMarks > total)
      ctx.addIssue({ code: "custom", path: ["passingMarks"], message: `Passing marks can't exceed the total (${total})` });
    if (v.startDate && v.endDate && v.endDate < v.startDate)
      ctx.addIssue({ code: "custom", path: ["endDate"], message: "End date must be after the start date" });
  });
export type QuizWizardValues = z.infer<typeof quizWizardSchema>;

/** Fields each step validates on "Save & Continue". */
export const QUIZ_STEP_FIELDS: Record<Exclude<QuizWizardStep, "review">, (keyof QuizWizardValues)[]> = {
  basic: ["title", "courseId", "moduleId", "difficulty", "descriptionHtml", "instructionsHtml"],
  questions: ["questions"],
  settings: ["passingMarks", "timeLimitMinutes", "maxAttempts", "showCorrectAnswers", "showExplanation", "randomizeQuestions", "randomizeOptions", "startDate", "endDate", "access", "requirePreviousLessons", "showImmediately"],
};

export const quizStepOfField = (field: string): QuizWizardStep =>
  (Object.entries(QUIZ_STEP_FIELDS) as [QuizWizardStep, string[]][]).find(([, f]) => f.includes(field.split(".")[0]))?.[0] ?? "basic";

export const quizTotalMarks = (questions: { points: number }[]) => questions.reduce((s, q) => s + (Number.isFinite(q.points) ? q.points : 0), 0);
