import { WIZARD_STEPS, type AssignmentWizardValues, type WizardStep } from "@/validations/assignmentWizardSchema";

/**
 * sessionStorage draft of the wizard (values + completed/visited steps) so a reload keeps the
 * exact step and data. One key for "create" and one per edited assignment id.
 */

export interface WizardDraft {
  values: AssignmentWizardValues;
  completed: WizardStep[];
  visited: WizardStep[];
}

const PREFIX = "edupro_assignment_wizard_v1";

export const wizardDraftKey = (mode: "create" | "edit", assignmentId?: string) =>
  mode === "create" ? `${PREFIX}::create` : `${PREFIX}::edit::${assignmentId ?? ""}`;

const isStep = (s: unknown): s is WizardStep => typeof s === "string" && (WIZARD_STEPS as readonly string[]).includes(s);

export function readWizardDraft(key: string): WizardDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<WizardDraft>;
    if (!parsed?.values || typeof parsed.values !== "object") return null;
    return {
      values: parsed.values,
      completed: Array.isArray(parsed.completed) ? parsed.completed.filter(isStep) : [],
      visited: Array.isArray(parsed.visited) ? parsed.visited.filter(isStep) : [],
    };
  } catch {
    return null;
  }
}

export function writeWizardDraft(key: string, draft: WizardDraft) {
  try {
    sessionStorage.setItem(key, JSON.stringify(draft));
  } catch {
    // Storage full / disabled — the wizard still works, it just won't survive a reload.
  }
}

export function clearWizardDraft(key: string) {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // ignore
  }
}

/** Normalise editor output so an untouched form isn't reported as "changed" ("<p></p>" ≈ ""). */
export const snapshotValues = (values: AssignmentWizardValues) =>
  JSON.stringify(values, (_k, v) => (typeof v === "string" && /^(<p>\s*<\/p>)+$/.test(v) ? "" : v));
