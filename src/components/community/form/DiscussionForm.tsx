"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm, useWatch, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Undo2 } from "lucide-react";
import type { CommunityThread, ThreadCategory } from "@/types/community";
import { threadFormSchema, type ThreadFormValues } from "@/validations/communitySchema";
import { createThread, updateThread } from "@/lib/communityStorage";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { DiscussionFormHeader, DISCUSSION_FORM_ID } from "./DiscussionFormHeader";
import { DiscussionTypeCard } from "./DiscussionTypeCard";
import { DiscussionDetailsCard } from "./DiscussionDetailsCard";
import { DiscussionFormActionsBar } from "./DiscussionFormActionsBar";
import { VisibilityModerationCard } from "./VisibilityModerationCard";
import { LivePreviewCard } from "./LivePreviewCard";
import { WritingTipsCard } from "./WritingTipsCard";
import {
  THREAD_FORM_DEFAULTS,
  clearThreadDraft,
  normalizeThreadValues,
  readThreadDraft,
  snapshotThreadValues,
  threadDraftKey,
  toThreadFormValues,
  writeThreadDraft,
  type ThreadFormMode,
} from "./threadFormUtils";

export interface DiscussionFormProps {
  mode: ThreadFormMode;
  /** The discussion being edited (edit mode). */
  original?: CommunityThread;
  /** Preselected course for new discussions (from ?course=). */
  initialCourseId?: string;
}

/** Field order used to scroll to the first invalid field. */
const FIELD_ORDER: (keyof ThreadFormValues)[] = ["category", "title", "courseId", "moduleId", "bodyHtml", "tags"];
const FIELD_DOM_ID: Partial<Record<keyof ThreadFormValues, string>> = {
  title: "thread-title",
  courseId: "thread-course",
  moduleId: "thread-module",
  bodyHtml: "thread-body",
  tags: "thread-tags",
};

const errorText = (err: unknown) => (err instanceof Error && err.message ? err.message : "Something went wrong. Please try again.");
const firstMessage = (err: unknown): string => {
  if (!err || typeof err !== "object") return "";
  if ("message" in err && typeof err.message === "string" && err.message) return err.message;
  if (Array.isArray(err)) return err.map(firstMessage).find(Boolean) ?? "";
  return "";
};

/** New / Edit Discussion form (single page). Unsaved values persist in sessionStorage until saved or discarded. */
export function DiscussionForm({ mode, original, initialCourseId }: DiscussionFormProps) {
  const router = useRouter();
  const key = threadDraftKey(mode, original?.id);
  const baseline = useMemo<ThreadFormValues>(
    () => (original ? toThreadFormValues(original) : { ...THREAD_FORM_DEFAULTS, courseId: initialCourseId ?? "" }),
    [original, initialCourseId]
  );
  const baselineSnap = useMemo(() => snapshotThreadValues(baseline), [baseline]);

  const form = useForm<ThreadFormValues>({
    resolver: zodResolver(threadFormSchema),
    defaultValues: baseline,
    mode: "onTouched",
  });
  const { handleSubmit, reset, control, setValue, getValues, formState } = form;
  const values = useWatch({ control }) as ThreadFormValues;
  const isDirty = snapshotThreadValues({ ...baseline, ...values }) !== baselineSnap;

  const [confirmLeave, setConfirmLeave] = useState(false);
  const [saved, setSaved] = useState(false);
  const restoredRef = useRef(false);
  const autoPinnedRef = useRef(false);

  // Restore the session draft once (after mount, so SSR and the first client render match).
  useEffect(() => {
    const draft = readThreadDraft(key);
    if (draft && snapshotThreadValues(draft) !== baselineSnap) {
      reset(draft, { keepDefaultValues: true });
      toast.info("Unsaved changes restored", {
        description: "We brought back what you were working on.",
        action: {
          label: "Discard",
          onClick: () => {
            clearThreadDraft(key);
            reset(baseline);
          },
        },
      });
    }
    restoredRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Persist unsaved values for this browser session.
  useEffect(() => {
    if (!restoredRef.current || saved) return;
    if (isDirty) writeThreadDraft(key, { ...baseline, ...values });
    else clearThreadDraft(key);
  }, [saved, isDirty, key, values, baseline]);

  // Announcements are pinned by default; undo the automatic pin when switching away again.
  const onTypeChange = (next: ThreadCategory, prev: ThreadCategory) => {
    if (next === "ANNOUNCEMENT" && !getValues("isPinned")) {
      setValue("isPinned", true, { shouldDirty: true });
      autoPinnedRef.current = true;
    } else if (prev === "ANNOUNCEMENT" && autoPinnedRef.current) {
      setValue("isPinned", false, { shouldDirty: true });
      autoPinnedRef.current = false;
    }
  };

  const exitTo = mode === "edit" && original ? `/community/${original.id}` : "/community";

  const onSubmit = async (raw: ThreadFormValues) => {
    const v = normalizeThreadValues(raw);
    const toastId = toast.loading(mode === "create" ? "Publishing discussion..." : "Saving changes...", { description: v.title });
    try {
      const result = mode === "create" || !original ? await createThread(v) : await updateThread(original.id, v);
      setSaved(true);
      clearThreadDraft(key);
      toast.success(mode === "create" ? "Discussion published" : "Changes saved", {
        id: toastId,
        description: mode === "create" ? `"${result.title}" is now live in the community.` : `"${result.title}" was updated.`,
      });
      router.push(`/community/${result.id}`);
    } catch (err) {
      toast.error(mode === "create" ? "Couldn't publish the discussion" : "Couldn't save changes", { id: toastId, description: errorText(err) });
    }
  };

  const onInvalid = (errors: FieldErrors<ThreadFormValues>) => {
    const first = FIELD_ORDER.find((f) => errors[f]);
    toast.error("Please fix the highlighted fields", { description: (first && firstMessage(errors[first])) || "Some fields need attention." });
    const el = first && FIELD_DOM_ID[first] ? document.getElementById(FIELD_DOM_ID[first]!) : null;
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (el instanceof HTMLInputElement) el.focus({ preventScroll: true });
  };

  const leave = () => {
    setSaved(true);
    clearThreadDraft(key);
    router.push(exitTo);
  };

  return (
    <FormProvider {...form}>
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-5 text-left pb-8">
        <DiscussionFormHeader mode={mode} threadId={original?.id} threadTitle={original?.title} isSubmitting={formState.isSubmitting} />

        <form id={DISCUSSION_FORM_ID} noValidate onSubmit={handleSubmit(onSubmit, onInvalid)} className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="space-y-5 xl:col-span-2 min-w-0">
            <DiscussionTypeCard onTypeChange={onTypeChange} />
            <DiscussionDetailsCard excludeThreadId={original?.id} />
            <DiscussionFormActionsBar
              mode={mode}
              isSubmitting={formState.isSubmitting}
              isDirty={isDirty}
              onCancel={() => (isDirty ? setConfirmLeave(true) : router.push(exitTo))}
            />
          </div>
          <div className="space-y-5 min-w-0">
            <VisibilityModerationCard />
            <LivePreviewCard authorName={original?.author.name ?? "Admin"} />
            <WritingTipsCard />
          </div>
        </form>
      </motion.div>

      <ConfirmModal
        isOpen={confirmLeave}
        title="Discard unsaved changes?"
        subtitle={mode === "create" ? "This discussion hasn't been published yet." : "Your edits haven't been saved."}
        message="If you leave now, the changes you made on this page will be lost."
        confirmLabel="Discard Changes"
        pendingLabel="Leaving..."
        confirmIcon={<Undo2 className="w-4 h-4" />}
        onClose={() => setConfirmLeave(false)}
        onConfirm={async () => leave()}
      />
    </FormProvider>
  );
}

export default DiscussionForm;
