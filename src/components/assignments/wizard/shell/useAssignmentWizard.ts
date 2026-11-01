"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createAssignment, updateAssignment } from "@/lib/assignmentStorage";
import { wizardToAssignment } from "@/lib/assignmentWizardMapping";
import { useUrlParams } from "@/lib/useUrlParams";
import type { AssignmentItem } from "@/types/assignment";
import {
  WIZARD_STEPS,
  WIZARD_STEP_FIELDS,
  WIZARD_STEP_LABEL,
  assignmentWizardSchema,
  stepOfField,
  type AssignmentWizardValues,
  type WizardStep,
} from "@/validations/assignmentWizardSchema";
import { clearWizardDraft, snapshotValues, writeWizardDraft, type WizardDraft } from "./wizardDraft";

type Values = AssignmentWizardValues;
type Issue = { path: PropertyKey[]; message: string };

export interface UseAssignmentWizardOptions {
  mode: "create" | "edit";
  assignmentId?: string;
  existing?: AssignmentItem;
  /** Values without any draft (defaults / the saved assignment) — baseline for "unsaved changes". */
  baseValues: Values;
  draft: WizardDraft | null;
  draftKey: string;
}

const isStep = (s: string): s is WizardStep => (WIZARD_STEPS as readonly string[]).includes(s);
const errorText = (e: unknown, fallback: string) => (e instanceof Error && e.message ? e.message : fallback);
const addStep = (list: WizardStep[], step: WizardStep) => (list.includes(step) ? list : [...list, step]);
const EDIT_COMPLETED = WIZARD_STEPS.filter((s) => s !== "review");
const stepParam = (step: WizardStep) => (step === "basic" ? null : step);

/**
 * Index of the first step that is not completed, counting only the CONTIGUOUS completed prefix in
 * WIZARD_STEPS order. "review" is never completed, so it becomes the frontier once all 6 steps are done.
 * Create mode: a step is reachable iff its index <= frontier (done steps + the next unfinished one).
 */
export const wizardFrontierIndex = (completed: readonly WizardStep[]) => {
  const index = WIZARD_STEPS.findIndex((s) => s === "review" || !completed.includes(s));
  return index === -1 ? WIZARD_STEPS.length - 1 : index;
};

/** All wizard state + navigation + validation + persistence. One react-hook-form for every step. */
export function useAssignmentWizard({ mode, assignmentId, existing, baseValues, draft, draftKey }: UseAssignmentWizardOptions) {
  const router = useRouter();
  const url = useUrlParams();
  const rawStep = url.get("step");

  const form = useForm<Values>({
    resolver: zodResolver(assignmentWizardSchema),
    mode: "onTouched",
    defaultValues: draft?.values ?? baseValues,
  });

  const [completed, setCompleted] = useState<WizardStep[]>(() => draft?.completed ?? (mode === "edit" ? [...EDIT_COMPLETED] : []));
  // Opening without ?step while a draft exists resumes where the user left off (one-shot: cleared on any navigation).
  const [resumeStep, setResumeStep] = useState<WizardStep | null>(() =>
    !rawStep && draft && draft.lastStep !== "basic" ? draft.lastStep : null
  );

  const frontierStep = WIZARD_STEPS[wizardFrontierIndex(completed)];
  /** Edit: every step. Create: completed steps + the first unfinished one (never skip ahead). */
  const isReachable = useCallback(
    (target: WizardStep) => mode === "edit" || WIZARD_STEPS.indexOf(target) <= WIZARD_STEPS.indexOf(frontierStep),
    [mode, frontierStep]
  );

  const requested = isStep(rawStep) ? rawStep : null;
  const wanted: WizardStep = requested ?? resumeStep ?? "basic";
  // An unreachable deep link / stale resume target renders the frontier step straight away (URL follows below).
  const step: WizardStep = isReachable(wanted) ? wanted : frontierStep;
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [leaveTarget, setLeaveTarget] = useState<string | null>(null);

  const baseline = useMemo(() => snapshotValues(baseValues), [baseValues]);
  const finishedRef = useRef(false);
  const stepsRef = useRef<Pick<WizardDraft, "completed" | "lastStep">>({ completed, lastStep: step });
  const redirectedRef = useRef<string | null>(null);

  // Keep ?step= in sync with the step actually shown (resume target, or the frontier for an unreachable link).
  useEffect(() => {
    if (rawStep === (stepParam(step) ?? "")) return;
    if (requested && requested !== step && redirectedRef.current !== rawStep) {
      redirectedRef.current = rawStep;
      toast.info("Finish the previous steps first", {
        description: `Complete ${WIZARD_STEP_LABEL[step]} before moving on to ${WIZARD_STEP_LABEL[requested]}.`,
      });
    }
    url.set({ step: stepParam(step) });
  }, [rawStep, requested, step, url]);

  const persist = useCallback(() => {
    if (finishedRef.current) return;
    const values = form.getValues();
    // Nothing changed yet → no draft (so a stale copy never shadows newer saved data).
    if (snapshotValues(values) === baseline) clearWizardDraft(draftKey);
    else writeWizardDraft(draftKey, { values, ...stepsRef.current });
  }, [draftKey, form, baseline]);

  // Keep the draft in sessionStorage on every change (values + completed steps + current step).
  useEffect(() => {
    stepsRef.current = { completed, lastStep: step };
    persist();
  }, [completed, step, persist]);

  useEffect(() => {
    return form.subscribe({ formState: { values: true }, callback: () => persist() });
  }, [form, persist]);

  const blockIfUploading = useCallback(() => {
    if (!uploading) return false;
    toast.warning("Upload in progress", { description: "Please wait for your files to finish uploading." });
    return true;
  }, [uploading]);

  const showStep = useCallback(
    (next: WizardStep) => {
      setResumeStep(null);
      url.set({ step: stepParam(next) });
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [url, setResumeStep]
  );

  const goToStep = useCallback(
    (target: WizardStep) => {
      if (target === step || blockIfUploading()) return;
      if (!isReachable(target)) {
        toast.info("Finish the previous steps first", {
          description: `Use "Save & Continue" on ${WIZARD_STEP_LABEL[frontierStep]} to unlock the next steps.`,
        });
        return;
      }
      showStep(target);
    },
    [step, blockIfUploading, isReachable, frontierStep, showStep]
  );

  const applyIssues = useCallback(
    (issues: Issue[]) => {
      issues.forEach((issue) => {
        const name = issue.path.map(String).join(".") as FieldPath<Values>;
        if (name) form.setError(name, { type: "custom", message: issue.message });
      });
    },
    [form]
  );

  /** Validate one step's fields (incl. cross-field rules that land on those fields). */
  const validateStep = useCallback(
    async (target: Exclude<WizardStep, "review">) => {
      const fields = WIZARD_STEP_FIELDS[target];
      const ok = await form.trigger(fields, { shouldFocus: true });
      const parsed = assignmentWizardSchema.safeParse(form.getValues());
      const extra = parsed.success ? [] : parsed.error.issues.filter((i) => fields.includes(String(i.path[0]) as keyof Values));
      applyIssues(extra);
      return ok && extra.length === 0;
    },
    [form, applyIssues]
  );

  const submit = useCallback(async () => {
    if (blockIfUploading() || busy) return;
    await form.trigger();
    const parsed = assignmentWizardSchema.safeParse(form.getValues());
    if (!parsed.success) {
      applyIssues(parsed.error.issues);
      const target = stepOfField(parsed.error.issues.map((i) => i.path.map(String).join("."))[0] ?? "title");
      toast.error("Some details need attention", {
        description: `Fix the highlighted fields in ${WIZARD_STEP_LABEL[target]} before ${mode === "edit" ? "saving" : "creating"} the assignment.`,
      });
      showStep(target);
      return;
    }

    setBusy(true);
    const values = parsed.data;
    const toastId = toast.loading(mode === "edit" ? "Saving changes..." : "Creating assignment...", { description: values.title });
    try {
      if (mode === "edit" && assignmentId) {
        const updated = await updateAssignment(assignmentId, wizardToAssignment(values, existing));
        finishedRef.current = true;
        clearWizardDraft(draftKey);
        toast.success("Assignment updated", { id: toastId, description: `"${updated.title}" has been saved.` });
        router.push(`/assignments/${updated.id}`);
      } else {
        const created = await createAssignment(wizardToAssignment(values), "PUBLISHED");
        finishedRef.current = true;
        clearWizardDraft(draftKey);
        toast.success("Assignment created", { id: toastId, description: `"${created.title}" is now published for students.` });
        router.push(`/assignments/${created.id}/created`);
      }
    } catch (e) {
      finishedRef.current = false;
      setBusy(false);
      toast.error(mode === "edit" ? "Couldn't save changes" : "Couldn't create assignment", {
        id: toastId,
        description: errorText(e, "Something went wrong. Please try again."),
      });
    }
  }, [blockIfUploading, busy, form, applyIssues, mode, assignmentId, existing, draftKey, router, showStep]);

  const next = useCallback(async () => {
    if (step === "review") return submit();
    if (blockIfUploading()) return;
    const ok = await validateStep(step);
    if (!ok) {
      toast.error("Please fix the highlighted fields", { description: `Some ${WIZARD_STEP_LABEL[step]} details need your attention.` });
      return;
    }
    setCompleted((prev) => addStep(prev, step));
    showStep(WIZARD_STEPS[WIZARD_STEPS.indexOf(step) + 1]);
  }, [step, submit, blockIfUploading, validateStep, showStep, setCompleted]);

  const previous = useCallback(() => {
    const index = WIZARD_STEPS.indexOf(step);
    if (index > 0) goToStep(WIZARD_STEPS[index - 1]);
  }, [step, goToStep]);

  const hasUnsavedChanges = useCallback(() => snapshotValues(form.getValues()) !== baseline, [form, baseline]);

  /** Leave the wizard (Back / Cancel): confirm first when there are unsaved changes. */
  const requestLeave = useCallback(
    (target: string) => {
      if (blockIfUploading()) return;
      if (hasUnsavedChanges()) setLeaveTarget(target);
      else {
        clearWizardDraft(draftKey);
        finishedRef.current = true;
        router.push(target);
      }
    },
    [blockIfUploading, hasUnsavedChanges, draftKey, router]
  );

  const confirmLeave = useCallback(async () => {
    if (!leaveTarget) return;
    finishedRef.current = true;
    clearWizardDraft(draftKey);
    toast.success("Changes discarded", { description: mode === "edit" ? "The assignment was left unchanged." : "Your draft assignment was discarded." });
    router.push(leaveTarget);
  }, [leaveTarget, draftKey, mode, router]);

  return {
    form,
    step,
    completed,
    busy,
    uploading,
    setUploading,
    isReachable,
    goToStep,
    next,
    previous,
    requestLeave,
    leaveOpen: leaveTarget !== null,
    closeLeave: () => setLeaveTarget(null),
    confirmLeave,
  };
}

export default useAssignmentWizard;
