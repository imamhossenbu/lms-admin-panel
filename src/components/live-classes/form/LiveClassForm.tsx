"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm, useWatch, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Undo2 } from "lucide-react";
import type { LiveClassItem } from "@/types/liveClass";
import { liveClassSchema, startsInFuture, type LiveClassFormValues } from "@/validations/liveClassSchema";
import { createLiveClass, updateLiveClass } from "@/lib/liveClassStorage";
import { liveStatus } from "@/lib/liveClassStats";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { LiveClassFormHeader, LIVE_FORM_ID } from "./LiveClassFormHeader";
import { BasicInfoCard } from "./BasicInfoCard";
import { DateTimeCard } from "./DateTimeCard";
import { MeetingPlatformCard } from "./MeetingPlatformCard";
import { ClassSettingsCard } from "./ClassSettingsCard";
import { ReminderSettingsCard } from "./ReminderSettingsCard";
import { ThumbnailCard } from "./ThumbnailCard";
import { LiveFormActionsBar } from "./LiveFormActionsBar";
import {
  LIVE_FORM_DEFAULTS,
  clearDraft,
  draftKey,
  hasCompleteSchedule,
  readDraft,
  snapshotValues,
  toFields,
  toFormValues,
  writeDraft,
  type LiveFormMode,
} from "./liveFormUtils";

export interface LiveClassFormProps {
  mode: LiveFormMode;
  /** The class being edited (edit mode). */
  original?: LiveClassItem;
}

/** Field order used to focus / scroll to the first invalid field. */
const FIELD_ORDER: (keyof LiveClassFormValues)[] = [
  "title", "courseId", "instructorId", "type", "descriptionHtml", "capacity", "date", "startTime", "endTime", "meetingLink", "meetingId", "passcode", "reminder",
];

const FIELD_DOM_ID: Partial<Record<keyof LiveClassFormValues, string>> = {
  title: "live-title", courseId: "live-course", instructorId: "live-instructor", type: "live-type", capacity: "live-capacity",
  date: "live-date", startTime: "live-startTime", endTime: "live-endTime", meetingLink: "live-link", meetingId: "live-meeting-id",
  passcode: "live-passcode", reminder: "live-reminder",
};

const errorText = (err: unknown) => (err instanceof Error && err.message ? err.message : "Something went wrong. Please try again.");

/** Schedule / Edit Live Class form (single page). Unsaved values persist in sessionStorage until saved or discarded. */
export function LiveClassForm({ mode, original }: LiveClassFormProps) {
  const router = useRouter();
  const key = draftKey(mode, original?.id);
  const baseline = useMemo(() => (original ? toFormValues(original) : LIVE_FORM_DEFAULTS), [original]);
  const baselineSnap = useMemo(() => snapshotValues(baseline), [baseline]);

  // Started / finished classes keep their schedule.
  const originalStatus = original ? liveStatus(original) : null;
  const scheduleLocked = originalStatus === "LIVE" || originalStatus === "COMPLETED";

  const schema = useMemo(
    () =>
      liveClassSchema.superRefine((v, ctx) => {
        if (scheduleLocked || !hasCompleteSchedule(v)) return;
        const rescheduled = !original || v.date !== original.date || v.startTime !== original.startTime;
        if (rescheduled && !startsInFuture(v)) ctx.addIssue({ code: "custom", path: ["date"], message: "Pick a future date and time" });
      }),
    [original, scheduleLocked]
  );

  const form = useForm<LiveClassFormValues>({
    resolver: zodResolver(schema),
    defaultValues: baseline,
    mode: "onTouched",
  });
  const { handleSubmit, reset, control, formState } = form;
  const values = useWatch({ control }) as LiveClassFormValues;
  const isDirty = snapshotValues({ ...baseline, ...values }) !== baselineSnap;

  const [uploading, setUploading] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [saved, setSaved] = useState(false);
  const restoredRef = useRef(false);

  // Restore the session draft once (after mount, so SSR and the first client render match).
  useEffect(() => {
    const draft = readDraft(key);
    if (draft && snapshotValues(draft) !== baselineSnap) {
      const next = scheduleLocked && original ? { ...draft, date: original.date, startTime: original.startTime, endTime: original.endTime } : draft;
      reset(next, { keepDefaultValues: true });
      toast.info("Unsaved changes restored", {
        description: "We brought back what you were working on.",
        action: { label: "Discard", onClick: () => { clearDraft(key); reset(baseline); } },
      });
    }
    restoredRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Persist unsaved values for this browser session.
  useEffect(() => {
    // The restore effect above runs first; its reset() re-renders and this effect re-runs with the restored values.
    if (!restoredRef.current || saved) return;
    if (isDirty) writeDraft(key, { ...baseline, ...values });
    else clearDraft(key);
  }, [saved, isDirty, key, values, baseline]);

  const exitTo = mode === "edit" && original ? `/live-classes/${original.id}` : "/live-classes";

  const onSubmit = async (v: LiveClassFormValues) => {
    if (uploading) {
      toast.error("Upload in progress", { description: "Wait for the thumbnail to finish uploading." });
      return;
    }
    const toastId = toast.loading(mode === "create" ? "Scheduling live class..." : "Saving changes...", { description: v.title.trim() });
    try {
      const fields = toFields(v);
      const saved = mode === "create" || !original ? await createLiveClass(fields) : await updateLiveClass(original.id, fields);
      setSaved(true);
      clearDraft(key);
      toast.success(mode === "create" ? "Live class scheduled" : "Changes saved", {
        id: toastId,
        description: mode === "create" ? `${saved.title} is on the calendar.` : `${saved.title} was updated.`,
      });
      router.push(`/live-classes/${saved.id}`);
    } catch (err) {
      toast.error(mode === "create" ? "Couldn't schedule the class" : "Couldn't save changes", { id: toastId, description: errorText(err) });
    }
  };

  const onInvalid = (errors: FieldErrors<LiveClassFormValues>) => {
    const first = FIELD_ORDER.find((f) => errors[f]);
    toast.error("Please fix the highlighted fields", { description: first ? String(errors[first]?.message ?? "") : "Some fields need attention." });
    const el = first && FIELD_DOM_ID[first] ? document.getElementById(FIELD_DOM_ID[first]!) : null;
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (el instanceof HTMLInputElement) el.focus({ preventScroll: true });
  };

  const leave = () => {
    setSaved(true);
    clearDraft(key);
    router.push(exitTo);
  };

  return (
    <FormProvider {...form}>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="space-y-5 text-left pb-8"
      >
        <LiveClassFormHeader mode={mode} classId={original?.id} classTitle={original?.title} isSubmitting={formState.isSubmitting} disabled={uploading} />

        <form id={LIVE_FORM_ID} noValidate onSubmit={handleSubmit(onSubmit, onInvalid)} className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="space-y-5 xl:col-span-2 min-w-0">
            <BasicInfoCard />
            <DateTimeCard locked={scheduleLocked} />
            <MeetingPlatformCard />
            <LiveFormActionsBar
              mode={mode}
              isSubmitting={formState.isSubmitting}
              disabled={uploading}
              isDirty={isDirty}
              onCancel={() => (isDirty ? setConfirmLeave(true) : router.push(exitTo))}
            />
          </div>
          <div className="space-y-5 min-w-0">
            <ClassSettingsCard />
            <ReminderSettingsCard />
            <ThumbnailCard onUploadingChange={setUploading} />
          </div>
        </form>
      </motion.div>

      <ConfirmModal
        isOpen={confirmLeave}
        title="Discard unsaved changes?"
        subtitle={mode === "create" ? "This live class hasn't been scheduled yet." : "Your edits haven't been saved."}
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

export default LiveClassForm;
