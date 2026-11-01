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

/** All wizard state + navigation + validation + persistence. One react-hook-form for every step. */
export function useAssignmentWizard({ mode, assignmentId, existing, baseValues, draft, draftKey }: UseAssignmentWizardOptions) {
  const router = useRouter();
  const url = useUrlParams();
  const rawStep = url.get("step");
  const step: WizardStep = isStep(rawStep) ? rawStep : "basic";

  const form = useForm<Values>({
    resolver: zodResolver(assignmentWizardSchema),
    mode: "onTouched",
    defaultValues: draft?.values ?? baseValues,
  });

  const [completed, setCompleted] = useState<WizardStep[]>(() => draft?.completed ?? (mode === "edit" ? [...EDIT_COMPLETED] : []));
  const [visitedState, setVisited] = useState<WizardStep[]>(() => draft?.visited ?? []);
  // The current step always counts as visited (covers ?step= deep links and browser history).
  const visited = useMemo(() => addStep(visitedState, step), [visitedState, step]);
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [leaveTarget, setLeaveTarget] = useState<string | null>(null);

  const baseline = useMemo(() => snapshotValues(baseValues), [baseValues]);
  const finishedRef = useRef(false);
  const stepsRef = useRef({ completed, visited });

  const persist = useCallback(() => {
    if (finishedRef.current) return;
    const values = form.getValues();
    // Nothing changed yet → no draft (so a stale copy never shadows newer saved data).
    if (snapshotValues(values) === baseline) clearWizardDraft(draftKey);
    else writeWizardDraft(draftKey, { values, ...stepsRef.current });
  }, [draftKey, form, baseline]);

  // Keep the draft in sessionStorage on every change (values + step progress).
  useEffect(() => {
    stepsRef.current = { completed, visited };
    persist();
  }, [completed, visited, persist]);

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
      setVisited((prev) => addStep(prev, next));
      url.set({ step: next === "basic" ? null : next });
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [url]
  );

  const isClickable = useCallback(
    (target: WizardStep) => {
      if (mode === "edit") return true;
      if (completed.includes(target) || visited.includes(target)) return true;
      const lastDone = Math.max(-1, ...completed.map((s) => WIZARD_STEPS.indexOf(s)));
      return WIZARD_STEPS.indexOf(target) <= lastDone + 1;
    },
    [mode, completed, visited]
  );

  const goToStep = useCallback(
    (target: WizardStep) => {
      if (target === step || blockIfUploading()) return;
      showStep(target);
    },
    [step, blockIfUploading, showStep]
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
  }, [step, submit, blockIfUploading, validateStep, showStep]);

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
    isClickable,
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
