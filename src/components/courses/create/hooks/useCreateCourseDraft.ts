"use client";

import { useEffect, useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { CourseBasicInfoInput } from "@/validations/courseSchema";
import { EMPTY_COURSE_PUBLISH, type CoursePublishInput } from "@/validations/coursePublishSchema";
import type { AiOutline } from "../aiOutline";

const CREATE_KEY = "edupro_create_course_draft";
/** Edit mode keeps one draft per course. */
export const editDraftKey = (courseId: string) => `edupro_edit_course_draft_${courseId}`;

export interface StoredDraft {
  values: CourseBasicInfoInput;
  curriculum: AiOutline | null;
  publish?: CoursePublishInput;
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
}

/**
 * Keeps the in-progress course (basic info + curriculum + pricing/settings) in sessionStorage so a
 * reload on any step restores it. Returns `isRestored` once the stored draft (if any) has been applied.
 */
export function useCreateCourseDraft(
  form: UseFormReturn<CourseBasicInfoInput>,
  publishForm: UseFormReturn<CoursePublishInput>,
  curriculum: AiOutline | null,
  setCurriculum: (outline: AiOutline | null) => void,
  enabled: boolean,
  { storageKey = CREATE_KEY, initial = null }: DraftOptions = {}
) {
  const [isRestored, setIsRestored] = useState(false);
  const restoredRef = useRef(false);

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
    }
    setIsRestored(true);
  }, [enabled, form, publishForm, setCurriculum, storageKey, initial]);

  // Persist on every change (form values + curriculum + pricing/settings).
  useEffect(() => {
    if (!isRestored) return;
    const persist = () => {
      try {
        const draft: StoredDraft = { values: form.getValues(), curriculum, publish: publishForm.getValues() };
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
  }, [isRestored, form, publishForm, curriculum, storageKey]);

  return { isRestored };
}
