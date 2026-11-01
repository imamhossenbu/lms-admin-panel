"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { CourseBasicInfoInput } from "@/validations/courseSchema";
import { EMPTY_COURSE_PUBLISH, type CoursePublishInput } from "@/validations/coursePublishSchema";
import type { AiOutline } from "../aiOutline";
import { isCourseStepNumber, type CourseStepNumber } from "../steps/stepTypes";

const CREATE_KEY = "edupro_create_course_draft";
/** Edit mode keeps one draft per course. */
export const editDraftKey = (courseId: string) => `edupro_edit_course_draft_${courseId}`;

export interface StoredDraft {
  values: CourseBasicInfoInput;
  curriculum: AiOutline | null;
  publish?: CoursePublishInput;
  /** Steps whose own "Continue" action succeeded (older drafts don't have it). */
  completed?: CourseStepNumber[];
  /** Step the user was on when they left (older drafts don't have it). */
  lastStep?: CourseStepNumber;
}

const readDraft = (key: string): StoredDraft | null => {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredDraft;
    return parsed && typeof parsed === "object" && parsed.values ? parsed : null;
  } catch {
    return null;
  }
};

const sanitizeCompleted = (value: unknown): CourseStepNumber[] =>
  Array.isArray(value) ? Array.from(new Set(value.filter(isCourseStepNumber))).sort((a, b) => a - b) : [];

export const clearCreateCourseDraft = (key: string = CREATE_KEY) => {
  try {
    sessionStorage.removeItem(key);
  } catch {}
};

export interface DraftOptions {
  /** sessionStorage key (defaults to the create-course key). */
  storageKey?: string;
  /** Edit mode: server data applied when there is no stored draft. */
  initial?: StoredDraft | null;
  /** The step currently shown — persisted as `lastStep` so the wizard can resume there. */
  currentStep?: CourseStepNumber;
}

/**
 * Keeps the in-progress course (basic info + curriculum + pricing/settings + step progress) in
 * sessionStorage so a reload or a later visit restores it. Returns `isRestored` once the stored draft
 * (if any) has been applied, the completed steps, and the step the user left off on (`resumeStep`).
 */
export function useCreateCourseDraft(
  form: UseFormReturn<CourseBasicInfoInput>,
  publishForm: UseFormReturn<CoursePublishInput>,
  curriculum: AiOutline | null,
  setCurriculum: (outline: AiOutline | null) => void,
  enabled: boolean,
  { storageKey = CREATE_KEY, initial = null, currentStep = 1 }: DraftOptions = {}
) {
  const [isRestored, setIsRestored] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<CourseStepNumber[]>([]);
  /** Step the stored draft was left on — read once, at restore time. */
  const [resumeStep, setResumeStep] = useState<CourseStepNumber | null>(null);
  const restoredRef = useRef(false);
  /** Set once the draft is cleared (saved / discarded) so pending writes can't bring it back. */
  const clearedRef = useRef(false);

  // Restore once the page is ready (after categories load so selects can show the value).
  useEffect(() => {
    if (!enabled || restoredRef.current) return;
    restoredRef.current = true;
    const draft = readDraft(storageKey) ?? initial;
    if (draft) {
      form.reset(draft.values, { keepDefaultValues: true });
      if (draft.curriculum) setCurriculum(draft.curriculum);
      if (draft.publish) {
        publishForm.reset(
          { ...EMPTY_COURSE_PUBLISH, ...draft.publish, features: { ...EMPTY_COURSE_PUBLISH.features, ...draft.publish.features } },
          { keepDefaultValues: true }
        );
      }
      // sessionStorage is read once here (an external system), so the progress is seeded from the effect.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCompletedSteps(sanitizeCompleted(draft.completed));
      setResumeStep(isCourseStepNumber(draft.lastStep) ? draft.lastStep : null);
    }
    setIsRestored(true);
  }, [enabled, form, publishForm, setCurriculum, storageKey, initial]);

  // Persist on every change (form values + curriculum + pricing/settings + progress).
  useEffect(() => {
    if (!isRestored) return;
    const persist = () => {
      if (clearedRef.current) return;
      try {
        const draft: StoredDraft = {
          values: form.getValues(),
          curriculum,
          publish: publishForm.getValues(),
          completed: completedSteps,
          lastStep: currentStep,
        };
        sessionStorage.setItem(storageKey, JSON.stringify(draft));
      } catch {}
    };
    persist();
    const a = form.watch(persist);
    const b = publishForm.watch(persist);
    return () => {
      a.unsubscribe();
      b.unsubscribe();
    };
  }, [isRestored, form, publishForm, curriculum, storageKey, completedSteps, currentStep]);

  /** Records that a step's own "Continue" action succeeded. */
  const markStepCompleted = useCallback((step: CourseStepNumber) => {
    setCompletedSteps((prev) => (prev.includes(step) ? prev : sanitizeCompleted([...prev, step])));
  }, []);

  /** Drops the draft and its progress (after saving/publishing or discarding) and stops persisting. */
  const clearDraft = useCallback(() => {
    clearedRef.current = true;
    clearCreateCourseDraft(storageKey);
  }, [storageKey]);

  return { isRestored, completedSteps, markStepCompleted, resumeStep, clearDraft };
}
