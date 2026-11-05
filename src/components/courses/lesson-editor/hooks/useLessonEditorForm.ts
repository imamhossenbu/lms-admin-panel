"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { fetchLessonEditor, saveLessonEditorValues } from "@/lib/lessonEditorStorage";
import { apiErrorMessage } from "@/lib/apiError";
import { useAppSelector } from "@/store/hooks";
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
 * The single react-hook-form instance of the Edit Lesson page: loads the course curriculum + the lesson from
 * the API (lesson row, editor settings and resources), validates the WHOLE schema on
 * save and resets the form to the saved values so it becomes clean.
 */
export function useLessonEditorForm({ courseId, lessonId, onInvalidTab }: UseLessonEditorFormOptions) {
  const form = useForm<LessonEditorValues>({ resolver: zodResolver(lessonEditorSchema), mode: "onTouched" });
  const { reset } = form;
  const [context, setContext] = useState<LessonEditorContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const userName = useAppSelector((state) => state.auth.user?.name);

  useEffect(() => {
    let alive = true;
    fetchLessonEditor(courseId, lessonId).then(
      ({ context: ctx, values }) => {
        if (!alive) return;
        setContext(ctx);
        reset(values);
        setLoadError(null);
        setIsLoading(false);
      },
      (error) => {
        if (!alive) return;
        setLoadError(apiErrorMessage(error, "We couldn't load this lesson. Please try again."));
        setIsLoading(false);
      }
    );
    return () => {
      alive = false;
    };
  }, [courseId, lessonId, reset, attempt]);

  const retry = useCallback(() => {
    setIsLoading(true);
    setLoadError(null);
    setAttempt((n) => n + 1);
  }, []);

  const save = useCallback(async (values: LessonEditorValues) => {
    const toastId = toast.loading("Updating lesson...", { description: "Saving all lesson settings." });
    try {
      const record = await saveLessonEditorValues(courseId, lessonId, values);
      reset(record.values);
      toast.success("Lesson updated", { id: toastId, description: `"${values.content.title}" has been saved.` });
    } catch (error) {
      toast.error("Couldn't update lesson", { id: toastId, description: apiErrorMessage(error, "Something went wrong. Please try again.") });
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

  // Notes are signed with the signed-in admin's name.
  const liveContext = useMemo(() => (context && userName ? { ...context, currentUser: userName } : context), [context, userName]);

  return { form, context: liveContext, isLoading, loadError, retry, submit };
}
