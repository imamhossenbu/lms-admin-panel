import { QUIZ_WIZARD_STEPS, type QuizWizardStep, type QuizWizardValues } from "@/validations/quizWizardSchema";
import type { QuizPublishChoice } from "./QuizWizardContext";

/**
 * sessionStorage draft of the quiz wizard (values + completed steps + last step + publish choice) so a
 * reload or reopening /quizzes/create resumes at the exact step with the same data.
 * One key for "create" and one per edited quiz id.
 */

export interface QuizWizardDraft {
  values: QuizWizardValues;
  completed: QuizWizardStep[];
  /** Step the user was on when the draft was last written — the wizard resumes there. */
  lastStep: QuizWizardStep;
  publishChoice?: QuizPublishChoice;
}

const PREFIX = "edupro_quiz_wizard_v1";

export const quizWizardDraftKey = (mode: "create" | "edit", quizId?: string) =>
  mode === "create" ? `${PREFIX}::create` : `${PREFIX}::edit::${quizId ?? ""}`;

export const isQuizStep = (s: unknown): s is QuizWizardStep => typeof s === "string" && (QUIZ_WIZARD_STEPS as readonly string[]).includes(s);
const isChoice = (s: unknown): s is QuizPublishChoice => s === "PUBLISHED" || s === "DRAFT" || s === "ARCHIVED";

export function readQuizWizardDraft(key: string): QuizWizardDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<QuizWizardDraft>;
    if (!parsed?.values || typeof parsed.values !== "object") return null;
    return {
      values: parsed.values,
      completed: Array.isArray(parsed.completed) ? parsed.completed.filter(isQuizStep) : [],
      lastStep: isQuizStep(parsed.lastStep) ? parsed.lastStep : "basic",
      publishChoice: isChoice(parsed.publishChoice) ? parsed.publishChoice : undefined,
    };
  } catch {
    return null;
  }
}

export function writeQuizWizardDraft(key: string, draft: QuizWizardDraft) {
  try {
    sessionStorage.setItem(key, JSON.stringify(draft));
  } catch {
    // Storage full / disabled — the wizard still works, it just won't survive a reload.
  }
}

export function clearQuizWizardDraft(key: string) {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // ignore
  }
}

/** Normalise editor output so an untouched form isn't reported as "changed" ("<p></p>" ≈ ""). */
export const snapshotQuizValues = (values: QuizWizardValues) =>
  JSON.stringify(values, (_k, v) => (typeof v === "string" && /^(<p>\s*<\/p>)+$/.test(v) ? "" : v));
