"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createQuiz, updateQuiz } from "@/lib/quizStorage";
import { wizardToQuiz } from "@/lib/quizWizardMapping";
import { useUrlParams } from "@/lib/useUrlParams";
import type { QuizItem } from "@/types/quiz";
import {
  QUIZ_STEP_FIELDS,
  QUIZ_STEP_LABEL,
  QUIZ_WIZARD_STEPS,
  quizStepOfField,
  quizWizardSchema,
  type QuizWizardStep,
  type QuizWizardValues,
} from "@/validations/quizWizardSchema";
import type { QuizPublishChoice } from "./QuizWizardContext";
import { clearQuizWizardDraft, isQuizStep, snapshotQuizValues, writeQuizWizardDraft, type QuizWizardDraft } from "./quizWizardDraft";

type Values = QuizWizardValues;
type Step = QuizWizardStep;
type Issue = { path: PropertyKey[]; message: string };

export interface UseQuizWizardOptions {
  mode: "create" | "edit";
  existing?: QuizItem;
  /** Values without any draft (defaults / the saved quiz) — baseline for "unsaved changes". */
  baseValues: Values;
  draft: QuizWizardDraft | null;
  draftKey: string;
}

const errorText = (e: unknown, fallback: string) => (e instanceof Error && e.message ? e.message : fallback);
const addStep = (list: Step[], step: Step) => (list.includes(step) ? list : [...list, step]);
const EDIT_COMPLETED = QUIZ_WIZARD_STEPS.filter((s) => s !== "review");
const stepParam = (step: Step) => (step === "basic" ? null : step);

/**
 * Index of the first uncompleted step, counting only the CONTIGUOUS completed prefix. "review" is never
 * completed, so it becomes the frontier once the 3 editing steps are done.
 * Create mode: a step is reachable iff its index <= frontier.
 */
export const quizFrontierIndex = (completed: readonly Step[]) => {
  const index = QUIZ_WIZARD_STEPS.findIndex((s) => s === "review" || !completed.includes(s));
  return index === -1 ? QUIZ_WIZARD_STEPS.length - 1 : index;
};

/** All quiz wizard state + navigation + validation + persistence. One react-hook-form for every step. */
export function useQuizWizard({ mode, existing, baseValues, draft, draftKey }: UseQuizWizardOptions) {
  const router = useRouter();
  const url = useUrlParams();
  const rawStep = url.get("step");

  const form = useForm<Values>({
    resolver: zodResolver(quizWizardSchema),
    mode: "onTouched",
    defaultValues: draft?.values ?? baseValues,
  });

  const [completed, setCompleted] = useState<Step[]>(() => draft?.completed ?? (mode === "edit" ? [...EDIT_COMPLETED] : []));
  const [publishChoice, setPublishChoice] = useState<QuizPublishChoice>(
    () => draft?.publishChoice ?? (mode === "edit" && existing ? existing.status : "PUBLISHED")
  );
  // Opening without ?step while a draft exists resumes where the user left off (one-shot: cleared on navigation).
  const [resumeStep, setResumeStep] = useState<Step | null>(() => (!rawStep && draft && draft.lastStep !== "basic" ? draft.lastStep : null));

  const frontierStep = QUIZ_WIZARD_STEPS[quizFrontierIndex(completed)];
  /** Edit: every step. Create: completed steps + the first unfinished one (never skip ahead). */
  const isReachable = useCallback(
    (target: Step) => mode === "edit" || QUIZ_WIZARD_STEPS.indexOf(target) <= QUIZ_WIZARD_STEPS.indexOf(frontierStep),
    [mode, frontierStep]
  );

  const requested = isQuizStep(rawStep) ? rawStep : null;
  const wanted: Step = requested ?? resumeStep ?? "basic";
  // An unreachable deep link / stale resume target renders the frontier step straight away (URL follows below).
  const step: Step = isReachable(wanted) ? wanted : frontierStep;
  const [busy, setBusy] = useState<QuizPublishChoice | null>(null);
  const [leaveTarget, setLeaveTarget] = useState<string | null>(null);

  const baseline = useMemo(() => snapshotQuizValues(baseValues), [baseValues]);
  const finishedRef = useRef(false);
  const stepsRef = useRef<Pick<QuizWizardDraft, "completed" | "lastStep" | "publishChoice">>({ completed, lastStep: step, publishChoice });
  const redirectedRef = useRef<string | null>(null);

  // Keep ?step= in sync with the step actually shown (resume target, or the frontier for an unreachable link).
  useEffect(() => {
    if (rawStep === (stepParam(step) ?? "")) return;
    if (requested && requested !== step && redirectedRef.current !== rawStep) {
      redirectedRef.current = rawStep;
      toast.info("Finish the previous steps first", {
        description: `Complete ${QUIZ_STEP_LABEL[step]} before moving on to ${QUIZ_STEP_LABEL[requested]}.`,
      });
    }
    url.set({ step: stepParam(step) });
  }, [rawStep, requested, step, url]);

  const persist = useCallback(() => {
    if (finishedRef.current) return;
    const values = form.getValues();
    const stepsOnlyDefault = stepsRef.current.completed.length === 0 || mode === "edit";
    // Nothing changed yet → no draft (so a stale copy never shadows newer saved data).
    if (snapshotQuizValues(values) === baseline && stepsOnlyDefault) clearQuizWizardDraft(draftKey);
    else writeQuizWizardDraft(draftKey, { values, ...stepsRef.current });
  }, [draftKey, form, baseline, mode]);

  // Keep the draft in sessionStorage on every change (values + completed steps + current step + choice).
  useEffect(() => {
    stepsRef.current = { completed, lastStep: step, publishChoice };
    persist();
  }, [completed, step, publishChoice, persist]);

  useEffect(() => form.subscribe({ formState: { values: true }, callback: () => persist() }), [form, persist]);

  const showStep = useCallback(
    (next: Step) => {
      setResumeStep(null);
      url.set({ step: stepParam(next) });
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [url, setResumeStep]
  );

  const goToStep = useCallback(
    (target: Step) => {
      if (target === step || busy) return;
      if (!isReachable(target)) {
        toast.info("Finish the previous steps first", {
          description: `Use "Save & Continue" on ${QUIZ_STEP_LABEL[frontierStep]} to unlock the next steps.`,
        });
        return;
      }
      showStep(target);
    },
    [step, busy, isReachable, frontierStep, showStep]
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
    async (target: Exclude<Step, "review">) => {
      const fields = QUIZ_STEP_FIELDS[target];
      const ok = await form.trigger(fields, { shouldFocus: true });
      const parsed = quizWizardSchema.safeParse(form.getValues());
      const extra = parsed.success ? [] : parsed.error.issues.filter((i) => fields.includes(String(i.path[0]) as keyof Values));
      applyIssues(extra);
      return ok && extra.length === 0;
    },
    [form, applyIssues]
  );

  /** Validate everything and save with the given status (create: PUBLISHED / DRAFT, edit: any). */
  const submit = useCallback(
    async (status: QuizPublishChoice) => {
      if (busy) return;
      await form.trigger();
      const parsed = quizWizardSchema.safeParse(form.getValues());
      if (!parsed.success) {
        applyIssues(parsed.error.issues);
        const target = quizStepOfField(parsed.error.issues.map((i) => i.path.map(String).join("."))[0] ?? "title");
        toast.error("Some details need attention", {
          description: `Fix the highlighted fields in ${QUIZ_STEP_LABEL[target]} before ${mode === "edit" ? "saving" : "saving the quiz"}.`,
        });
        if (target !== step) showStep(target);
        return;
      }

      setBusy(status);
      const values = parsed.data;
      const publishing = status === "PUBLISHED";
      const toastId = toast.loading(mode === "edit" ? "Saving changes..." : publishing ? "Publishing quiz..." : "Saving draft...", {
        description: values.title,
      });
      try {
        let saved: QuizItem;
        if (mode === "edit" && existing) {
          saved = await updateQuiz(existing.id, { ...wizardToQuiz(values), status });
          toast.success("Quiz updated", {
            id: toastId,
            description: `"${saved.title}" has been saved${status !== existing.status ? ` and is now ${status === "PUBLISHED" ? "published" : status === "DRAFT" ? "a draft" : "archived"}` : ""}.`,
          });
        } else {
          saved = await createQuiz(wizardToQuiz(values), publishing ? "PUBLISHED" : "DRAFT");
          toast.success(publishing ? "Quiz published" : "Draft saved", {
            id: toastId,
            description: publishing ? `"${saved.title}" is now available to students.` : `"${saved.title}" was saved as a draft. You can publish it later.`,
          });
        }
        finishedRef.current = true;
        clearQuizWizardDraft(draftKey);
        router.push(`/quizzes/${saved.id}`);
      } catch (e) {
        finishedRef.current = false;
        setBusy(null);
        toast.error(mode === "edit" ? "Couldn't save changes" : "Couldn't save quiz", {
          id: toastId,
          description: errorText(e, "Something went wrong. Please try again."),
        });
      }
    },
    [busy, form, applyIssues, mode, step, showStep, existing, draftKey, router]
  );

  const next = useCallback(async () => {
    if (step === "review" || busy) return;
    const ok = await validateStep(step);
    if (!ok) {
      toast.error("Please fix the highlighted fields", { description: `Some ${QUIZ_STEP_LABEL[step]} details need your attention.` });
      return;
    }
    setCompleted((prev) => addStep(prev, step));
    showStep(QUIZ_WIZARD_STEPS[QUIZ_WIZARD_STEPS.indexOf(step) + 1]);
  }, [step, busy, validateStep, showStep, setCompleted]);

  const previous = useCallback(() => {
    const index = QUIZ_WIZARD_STEPS.indexOf(step);
    if (index > 0) goToStep(QUIZ_WIZARD_STEPS[index - 1]);
  }, [step, goToStep]);

  const hasUnsavedChanges = useCallback(() => snapshotQuizValues(form.getValues()) !== baseline, [form, baseline]);

  /** Leave the wizard (Cancel): confirm first when there are unsaved changes. */
  const requestLeave = useCallback(
    (target: string) => {
      if (hasUnsavedChanges()) setLeaveTarget(target);
      else {
        clearQuizWizardDraft(draftKey);
        finishedRef.current = true;
        router.push(target);
      }
    },
    [hasUnsavedChanges, draftKey, router]
  );

  const confirmLeave = useCallback(async () => {
    if (!leaveTarget) return;
    finishedRef.current = true;
    clearQuizWizardDraft(draftKey);
    toast.success("Changes discarded", { description: mode === "edit" ? "The quiz was left unchanged." : "Your draft quiz was discarded." });
    router.push(leaveTarget);
  }, [leaveTarget, draftKey, mode, router]);

  return {
    form,
    step,
    completed,
    busy,
    isReachable,
    goToStep,
    next,
    previous,
    submit,
    publishChoice,
    setPublishChoice,
    requestLeave,
    leaveOpen: leaveTarget !== null,
    closeLeave: () => setLeaveTarget(null),
    confirmLeave,
  };
}

export default useQuizWizard;
