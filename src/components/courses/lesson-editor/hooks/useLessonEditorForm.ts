"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  LESSON_EDITOR_SECTION_TAB,
  LESSON_EDITOR_TABS,
  lessonEditorSchema,
  type LessonEditorTab,
  type LessonEditorValues,
} from "@/validations/lessonEditorSchema";
import type { LessonEditorContext } from "@/types/lessonEditor";
import { getLessonEditorContext, getLessonEditorValues, saveLessonEditorValues } from "@/lib/lessonEditorStorage";
import { LESSON_EDITOR_TAB_LABEL } from "../lessonEditorTabsConfig";

/** Tabs whose section currently has validation errors, in tab-bar order. */
export const tabsWithErrors = (errors: FieldErrors<LessonEditorValues>): LessonEditorTab[] =>
  LESSON_EDITOR_TABS.filter((tab) =>
    (Object.keys(errors) as (keyof LessonEditorValues)[]).some((section) => LESSON_EDITOR_SECTION_TAB[section] === tab)
  );

interface UseLessonEditorFormOptions {
  courseId: string;
  lessonId: string;
  /** Called with the first tab that has errors when "Update Lesson" fails validation. */
  onInvalidTab: (tab: LessonEditorTab) => void;
}

/**
 * The single react-hook-form instance of the Edit Lesson page: loads reference data + saved
 * values (client-only, from localStorage), validates the WHOLE schema on save and resets the
 * form to the saved values so it becomes clean.
 */
export function useLessonEditorForm({ courseId, lessonId, onInvalidTab }: UseLessonEditorFormOptions) {
  const form = useForm<LessonEditorValues>({ resolver: zodResolver(lessonEditorSchema), mode: "onTouched" });
  const { reset } = form;
  const [context, setContext] = useState<LessonEditorContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // localStorage is only available in the browser, so load after mount.
    const timer = window.setTimeout(() => {
      setContext(getLessonEditorContext(courseId));
      reset(getLessonEditorValues(courseId, lessonId));
      setIsLoading(false);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [courseId, lessonId, reset]);

  const save = useCallback(async (values: LessonEditorValues) => {
    const toastId = toast.loading("Updating lesson...", { description: "Saving all lesson settings." });
    try {
      await saveLessonEditorValues(courseId, lessonId, values);
      reset(values);
      toast.success("Lesson updated", { id: toastId, description: `"${values.content.title}" has been saved.` });
    } catch (error) {
      const message = error instanceof Error && error.message ? error.message : "Something went wrong. Please try again.";
      toast.error("Couldn't update lesson", { id: toastId, description: message });
    }
  }, [courseId, lessonId, reset]);

  const onInvalid = useCallback(
    (errors: FieldErrors<LessonEditorValues>) => {
      const tabs = tabsWithErrors(errors);
      if (tabs[0]) onInvalidTab(tabs[0]);
      toast.error("Please fix the highlighted fields", {
        description: tabs.length
          ? `Check the ${tabs.map((t) => LESSON_EDITOR_TAB_LABEL[t]).join(", ")} tab${tabs.length > 1 ? "s" : ""}.`
          : "Some lesson details are invalid.",
      });
    },
    [onInvalidTab]
  );

  const submit = form.handleSubmit(save, onInvalid);

  return { form, context, isLoading, submit };
}
