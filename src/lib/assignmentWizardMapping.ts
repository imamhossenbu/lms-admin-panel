import type { AssignmentItem, RubricCriterion, RubricLevel } from "@/types/assignment";
import {
  DEFAULT_ALLOWED_FILE_TYPES,
  type AssignmentWizardValues,
  type WizardCriterion,
} from "@/validations/assignmentWizardSchema";

/** Single source of truth for AssignmentItem ⇄ wizard form values (create AND edit use it). */

const pad = (n: number) => String(n).padStart(2, "0");
const toDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const plain = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const newId = (p: string) => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

/** Defaults for a brand-new assignment. */
export function emptyWizardValues(courseId: string, moduleId = "", now: Date = new Date()): AssignmentWizardValues {
  const due = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14);
  return {
    title: "",
    shortDescriptionHtml: "",
    courseId,
    moduleId,
    lessonId: "",
    type: "FILE_UPLOAD",
    category: "",
    difficulty: "BEGINNER",
    estimatedTime: 1,
    estimatedUnit: "HOURS",
    instructionsHtml: "",
    attachments: [],
    allowedFileTypes: [...DEFAULT_ALLOWED_FILE_TYPES],
    maxFiles: 1,
    maxFileSizeMb: 50,
    lateSubmission: "ALLOW",
    latePenalty: 10,
    latePenaltyUnit: "PERCENT",
    attemptsMode: "UNLIMITED",
    maxAttempts: 3,
    totalPoints: 32,
    gradingType: "POINTS",
    passingScore: 24,
    gradeDisplay: "EXACT",
    aiGradingEnabled: false,
    aiGradingCriteria: "",
    manualOverride: true,
    rubricTitle: "",
    rubricDescription: "",
    criteria: [],
    releaseDate: toDate(now),
    releaseTime: "09:00",
    dueDate: toDate(due),
    dueTime: "23:59",
    availability: "UNTIL_DUE",
    timeLimitMinutes: 60,
    windowStartDate: "",
    windowStartTime: "",
    windowEndDate: "",
    windowEndTime: "",
    showInCalendar: true,
  };
}

export function assignmentToWizard(a: AssignmentItem): AssignmentWizardValues {
  const attemptsMode = a.attempts === "UNLIMITED" ? "UNLIMITED" : a.attempts === "1" ? "SINGLE" : "LIMITED";
  return {
    title: a.title,
    shortDescriptionHtml: a.descriptionHtml,
    courseId: a.courseId,
    moduleId: a.moduleId,
    lessonId: a.lessonId,
    type: a.type,
    category: a.category,
    difficulty: a.difficulty,
    estimatedTime: a.estimatedTime,
    estimatedUnit: a.estimatedUnit,
    instructionsHtml: a.instructionsHtml,
    attachments: a.attachments.map((x) => ({ ...x })),
    allowedFileTypes: [...a.instructions.allowedFileTypes],
    maxFiles: a.maxFiles,
    maxFileSizeMb: a.instructions.maxFileSizeMb,
    lateSubmission: a.lateSubmission,
    latePenalty: a.latePenalty,
    latePenaltyUnit: a.latePenaltyUnit,
    attemptsMode,
    maxAttempts: attemptsMode === "LIMITED" ? Math.min(10, Math.max(2, Number(a.attempts) || 3)) : 3,
    totalPoints: a.totalPoints,
    gradingType: a.gradingType === "NOT_GRADED" ? "POINTS" : a.gradingType,
    passingScore: a.passingScore,
    gradeDisplay: a.gradeDisplay,
    aiGradingEnabled: a.aiGrading.enabled,
    aiGradingCriteria: a.aiGrading.criteria,
    manualOverride: a.manualOverride,
    rubricTitle: a.rubric.title,
    rubricDescription: a.rubric.description,
    criteria: a.rubric.criteria.map((c) => ({ id: c.id, title: c.title, description: c.description, points: c.points })),
    releaseDate: a.releaseDate,
    releaseTime: a.releaseTime,
    dueDate: a.dueDate,
    dueTime: a.dueTime,
    availability: a.availability,
    timeLimitMinutes: a.timeLimitMinutes,
    windowStartDate: a.windowStartDate,
    windowStartTime: a.windowStartTime,
    windowEndDate: a.windowEndDate,
    windowEndTime: a.windowEndTime,
    showInCalendar: a.showInCalendar,
  };
}

/** Three performance levels from the criterion's max points (Excellent 100%, Good ~62%, Needs Improvement ~25%). */
export function levelsForCriterion(c: Pick<WizardCriterion, "id" | "title" | "points" | "description">): RubricLevel[] {
  const good = Math.max(1, Math.round(c.points * 0.625));
  const low = Math.max(0, Math.round(c.points * 0.25));
  return [
    { id: `${c.id}-ex`, tone: "EXCELLENT", label: "Excellent", points: c.points, description: c.description },
    { id: `${c.id}-gd`, tone: "GOOD", label: "Good", points: Math.min(good, c.points), description: `${c.title} is mostly correct with minor issues.` },
    { id: `${c.id}-ni`, tone: "NEEDS_IMPROVEMENT", label: "Needs Improvement", points: Math.min(low, c.points), description: `${c.title} is missing or has major issues.` },
  ];
}

/** Keep hand-edited levels (Rubric tab) when the criterion's max points didn't change. */
function toRubricCriteria(criteria: WizardCriterion[], existing?: RubricCriterion[]): RubricCriterion[] {
  return criteria.map((c) => {
    const id = c.id || newId("crit");
    const prev = existing?.find((e) => e.id === id);
    const keepLevels = prev && prev.points === c.points;
    return { id, title: c.title, description: c.description, points: c.points, levels: keepLevels ? prev.levels : levelsForCriterion({ ...c, id }) };
  });
}

/** Bullet items of an HTML string ("<li>…</li>"). */
const listItems = (html: string) =>
  Array.from(html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi))
    .map((m) => plain(m[1]))
    .filter(Boolean)
    .slice(0, 10);

export type WizardAssignmentFields = Omit<AssignmentItem, "id" | "createdAt" | "updatedAt" | "enrolledCount" | "status">;

/** Wizard values → assignment fields. `existing` (edit mode) keeps data the wizard doesn't own. */
export function wizardToAssignment(v: AssignmentWizardValues, existing?: AssignmentItem): WizardAssignmentFields {
  const attempts = v.attemptsMode === "UNLIMITED" ? "UNLIMITED" : v.attemptsMode === "SINGLE" ? "1" : (String(v.maxAttempts) as `${number}`);
  const criteria = toRubricCriteria(v.criteria, existing?.rubric.criteria);
  const prevInstructions = existing?.instructions;
  return {
    courseId: v.courseId,
    title: v.title.trim(),
    descriptionHtml: v.shortDescriptionHtml,
    moduleId: v.moduleId,
    lessonId: v.lessonId,
    type: v.type,
    dueDate: v.dueDate,
    dueTime: v.dueTime,
    totalPoints: v.totalPoints,
    attempts,
    lateSubmission: v.lateSubmission,
    gradingType: v.gradingType,
    showRubric: criteria.length > 0,
    peerReview: existing?.peerReview ?? false,
    attachments: v.attachments.map((x) => ({ ...x })),
    instructions: {
      overview: prevInstructions?.overview || plain(v.shortDescriptionHtml),
      objectives: prevInstructions?.objectives ?? [],
      tasks: prevInstructions?.tasks ?? [],
      requirements: prevInstructions?.requirements?.length ? prevInstructions.requirements : listItems(v.instructionsHtml),
      allowedFileTypes: [...v.allowedFileTypes],
      maxFileSizeMb: v.maxFileSizeMb,
      gradingNotes: prevInstructions?.gradingNotes?.length ? prevInstructions.gradingNotes : criteria.map((c) => c.title),
    },
    rubric: {
      enabled: criteria.length > 0,
      title: v.rubricTitle.trim(),
      totalPoints: v.totalPoints,
      description: v.rubricDescription.trim(),
      visibleToStudents: existing?.rubric.visibleToStudents ?? true,
      criteria,
    },
    category: v.category,
    difficulty: v.difficulty,
    estimatedTime: v.estimatedTime,
    estimatedUnit: v.estimatedUnit,
    instructionsHtml: v.instructionsHtml,
    maxFiles: v.maxFiles,
    latePenalty: v.lateSubmission === "ALLOW_WITH_PENALTY" ? v.latePenalty : 0,
    latePenaltyUnit: v.latePenaltyUnit,
    passingScore: v.passingScore,
    gradeDisplay: v.gradeDisplay,
    aiGrading: { enabled: v.aiGradingEnabled, criteria: v.aiGradingEnabled ? v.aiGradingCriteria : "" },
    manualOverride: v.manualOverride,
    releaseDate: v.releaseDate,
    releaseTime: v.releaseTime,
    availability: v.availability,
    timeLimitMinutes: v.timeLimitMinutes,
    windowStartDate: v.windowStartDate,
    windowStartTime: v.windowStartTime,
    windowEndDate: v.windowEndDate,
    windowEndTime: v.windowEndTime,
    showInCalendar: v.showInCalendar,
  };
}

/** "Allowed (10% penalty)" / "Not allowed" / "Allowed". */
export function lateSubmissionSummary(a: Pick<AssignmentItem, "lateSubmission" | "latePenalty" | "latePenaltyUnit">) {
  if (a.lateSubmission === "DISALLOW") return "Not allowed";
  if (a.lateSubmission === "ALLOW_WITH_PENALTY") return `Allowed (${a.latePenalty}${a.latePenaltyUnit === "PERCENT" ? "%" : " pts"} penalty)`;
  return "Allowed";
}
