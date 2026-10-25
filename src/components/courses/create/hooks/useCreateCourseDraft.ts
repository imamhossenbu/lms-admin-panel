"use client";

import { useEffect, useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { CourseBasicInfoInput } from "@/validations/courseSchema";
import type { AiOutline } from "../aiOutline";

const STORAGE_KEY = "edupro_create_course_draft";

interface StoredDraft {
  values: CourseBasicInfoInput;
  curriculum: AiOutline | null;
}

const readDraft = (): StoredDraft | null => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredDraft;
    return parsed && typeof parsed === "object" && parsed.values ? parsed : null;
  } catch {
    return null;
  }
};

export const clearCreateCourseDraft = () => {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {}
};

/**
 * Keeps the in-progress course (basic info + curriculum) in sessionStorage so a reload on
 * any step restores it. Returns `isRestored` once the stored draft (if any) has been applied.
 */
export function useCreateCourseDraft(
  form: UseFormReturn<CourseBasicInfoInput>,
  curriculum: AiOutline | null,
  setCurriculum: (outline: AiOutline | null) => void,
  enabled: boolean
) {
  const [isRestored, setIsRestored] = useState(false);
  const restoredRef = useRef(false);

  // Restore once the page is ready (after categories load so selects can show the value).
  useEffect(() => {
    if (!enabled || restoredRef.current) return;
    restoredRef.current = true;
    const draft = readDraft();
    if (draft) {
      form.reset(draft.values, { keepDefaultValues: true });
      if (draft.curriculum) setCurriculum(draft.curriculum);
    }
    setIsRestored(true);
  }, [enabled, form, setCurriculum]);

  // Persist on every change (form values + curriculum).
  useEffect(() => {
    if (!isRestored) return;
    const persist = (values: Partial<CourseBasicInfoInput>) => {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ values: { ...form.getValues(), ...values }, curriculum }));
      } catch {}
    };
    persist(form.getValues());
    const subscription = form.watch((values) => persist(values as Partial<CourseBasicInfoInput>));
    return () => subscription.unsubscribe();
  }, [isRestored, form, curriculum]);

  return { isRestored };
}
