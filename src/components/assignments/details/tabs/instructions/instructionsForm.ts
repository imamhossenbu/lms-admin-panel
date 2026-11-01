import type { AssignmentInstructions } from "@/types/assignment";
import type { AssignmentInstructionsFormValues } from "@/validations/assignmentSchema";

const wrap = (list: string[]) => list.map((value) => ({ value }));
const unwrap = (list: { value: string }[]) => list.map((i) => i.value.trim()).filter(Boolean);

export const toInstructionsForm = (i: AssignmentInstructions): AssignmentInstructionsFormValues => ({
  overview: i.overview,
  objectives: wrap(i.objectives),
  tasks: wrap(i.tasks),
  requirements: wrap(i.requirements),
  allowedFileTypes: [...i.allowedFileTypes],
  maxFileSizeMb: i.maxFileSizeMb,
  gradingNotes: wrap(i.gradingNotes),
});

export const fromInstructionsForm = (v: AssignmentInstructionsFormValues): AssignmentInstructions => ({
  overview: v.overview.trim(),
  objectives: unwrap(v.objectives),
  tasks: unwrap(v.tasks),
  requirements: unwrap(v.requirements),
  allowedFileTypes: v.allowedFileTypes,
  maxFileSizeMb: v.maxFileSizeMb,
  gradingNotes: unwrap(v.gradingNotes),
});

/** "PDF", "pdf", ".PDF" → ".pdf". */
export const normalizeExtension = (raw: string) => {
  const t = raw.trim().toLowerCase().replace(/^\*?\.?/, "");
  return t ? `.${t}` : "";
};

export type InstructionListName = "objectives" | "tasks" | "requirements" | "gradingNotes";

export const errorText = (e: unknown, fallback = "Something went wrong. Please try again.") =>
  e instanceof Error && e.message ? e.message : fallback;
