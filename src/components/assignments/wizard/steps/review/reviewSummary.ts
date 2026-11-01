import type { LessonEditorContext } from "@/types/lessonEditor";
import type { AssignmentWizardValues, WizardStep } from "@/validations/assignmentWizardSchema";
import { lateSubmissionSummary } from "@/lib/assignmentWizardMapping";
import { GRADING_TYPE_LABEL } from "@/components/assignments/details/assignmentFormat";
import { WIZARD_TYPE_LABEL, formatDateAt, passingScoreLabel, plainText, wizardModuleLabel } from "../../wizardFormat";
import { instructionsOutline } from "./instructionsOutline";

export interface ReviewSection {
  step: Exclude<WizardStep, "review">;
  title: string;
  subtitle: string;
  rows: [label: string, value: string][];
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

const attemptsText = (v: AssignmentWizardValues) =>
  v.attemptsMode === "UNLIMITED" ? "Unlimited" : v.attemptsMode === "SINGLE" ? "Single attempt" : plural(v.maxAttempts, "attempt");

const availabilityText = (v: AssignmentWizardValues) => {
  if (v.availability === "TIME_LIMIT") return `Time limit (${v.timeLimitMinutes} min)`;
  if (v.availability === "WINDOW") return `Custom window (${formatDateAt(v.windowStartDate, v.windowStartTime)} – ${formatDateAt(v.windowEndDate, v.windowEndTime)})`;
  return "Until due date";
};

const penaltyText = (v: AssignmentWizardValues) =>
  v.lateSubmission === "ALLOW_WITH_PENALTY" ? `${v.latePenalty}${v.latePenaltyUnit === "PERCENT" ? "%" : " pts"}` : "None";

/** The six "Review & Create" rows, computed from the current form values. */
export function buildReviewSections(v: AssignmentWizardValues, context: LessonEditorContext): ReviewSection[] {
  const outline = instructionsOutline(v.instructionsHtml);
  const typeRows: [string, string][] =
    v.type === "FILE_UPLOAD"
      ? [
          ["File Types", v.allowedFileTypes.join(", ") || "None selected"],
          ["Max File Size", `${v.maxFileSizeMb} MB`],
          ["Max Files", plural(v.maxFiles, "file")],
        ]
      : [["Submission", WIZARD_TYPE_LABEL[v.type]]];

  return [
    {
      step: "basic",
      title: "Basic Information",
      subtitle: "Title, description and assignment type",
      rows: [
        ["Title", v.title.trim() || "—"],
        ["Course", context.course.title],
        ["Module", wizardModuleLabel(context, v.moduleId) || "—"],
        ["Type", WIZARD_TYPE_LABEL[v.type]],
      ],
    },
    {
      step: "instructions",
      title: "Instructions",
      subtitle: "Assignment instructions and guidelines",
      rows: [
        ["Instructions", plainText(v.instructionsHtml) ? "Provided" : "Missing"],
        ["Requirements", plural(outline.requirements.length, "item")],
        ["Submission Guidelines", plural(outline.guidelines.length, "item")],
        ["Attachments", v.attachments.length ? plural(v.attachments.length, "file") : "None"],
      ],
    },
    {
      step: "submission",
      title: "Submission Settings",
      subtitle: "File types, attempts and late submission",
      rows: [...typeRows, ["Late Submission", lateSubmissionSummary(v)], ["Attempts", attemptsText(v)]],
    },
    {
      step: "grading",
      title: "Grading & Points",
      subtitle: "Total points and grading method",
      rows: [
        ["Total Points", String(v.totalPoints)],
        ["Grading Method", GRADING_TYPE_LABEL[v.gradingType]],
        ["Passing Score", passingScoreLabel(v.passingScore, v.totalPoints)],
        ["Grade Display", v.gradeDisplay === "EXACT" ? "Show Exact Score" : "Show Grade Only"],
        ["AI Grading", v.aiGradingEnabled ? "Enabled" : "Disabled"],
      ],
    },
    {
      step: "rubric",
      title: "Rubric",
      subtitle: "Grading rubric and criteria",
      rows: [
        ["Rubric", v.rubricTitle.trim() || "—"],
        ["Criteria", plural(v.criteria.length, "item")],
        ["Total Points", String(v.criteria.reduce((s, c) => s + (Number(c.points) || 0), 0))],
      ],
    },
    {
      step: "schedule",
      title: "Schedule & Availability",
      subtitle: "Release date, due date and availability",
      rows: [
        ["Release Date", formatDateAt(v.releaseDate, v.releaseTime)],
        ["Due Date", formatDateAt(v.dueDate, v.dueTime)],
        ["Availability", availabilityText(v)],
        ["Late Penalty", penaltyText(v)],
        ["Calendar Visibility", v.showInCalendar ? "Enabled" : "Disabled"],
      ],
    },
  ];
}
