"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm, useWatch, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Undo2 } from "lucide-react";
import type { Broadcast } from "@/types/notification";
import { broadcastFormSchema, type BroadcastFormValues } from "@/validations/notificationSchema";
import { saveBroadcast } from "@/lib/notificationStorage";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ComposeHeader } from "./ComposeHeader";
import { AudienceCard } from "./AudienceCard";
import { MessageCard } from "./MessageCard";
import { ChannelsCard } from "./ChannelsCard";
import { DeliveryCard } from "./DeliveryCard";
import { BroadcastPreviewCard } from "./BroadcastPreviewCard";
import { SendSummaryCard } from "./SendSummaryCard";
import { ComposeTipsCard } from "./ComposeTipsCard";
import { ComposeActionsBar } from "./ComposeActionsBar";
import { ConfirmSendModal } from "./ConfirmSendModal";
import type { ComposeBusy } from "./ComposeActionButtons";
import {
  COMPOSE_DEFAULTS,
  COMPOSE_FORM_ID,
  clearDraft,
  draftIssues,
  draftKey,
  draftPayload,
  errorText,
  readDraft,
  snapshotValues,
  toFormValues,
  writeDraft,
  type ComposeMode,
} from "./composeUtils";

export interface BroadcastComposeFormProps {
  mode: ComposeMode;
  /** Broadcast being edited (DRAFT / SCHEDULED). */
  original?: Broadcast;
  /** Compose only: preselect "Specific courses" with this course (?course=). */
  initialCourseId?: string;
}

/** Field order used to scroll to the first invalid field. */
const FIELD_ORDER: (keyof BroadcastFormValues)[] = ["courseIds", "title", "messageHtml", "ctaLabel", "ctaUrl", "channels", "scheduledAt"];
const FIELD_DOM_ID: Partial<Record<keyof BroadcastFormValues, string>> = {
  courseIds: "broadcast-courses",
  title: "broadcast-title",
  messageHtml: "broadcast-message",
  ctaLabel: "broadcast-cta-label",
  ctaUrl: "broadcast-cta-url",
  channels: "broadcast-channels",
  scheduledAt: "broadcast-scheduled-at",
};

const focusField = (field?: keyof BroadcastFormValues) => {
  const el = field && FIELD_DOM_ID[field] ? document.getElementById(FIELD_DOM_ID[field]!) : null;
  el?.scrollIntoView({ behavior: "smooth", block: "center" });
  if (el instanceof HTMLInputElement) el.focus({ preventScroll: true });
};

/** Compose / Edit Broadcast (single page). Unsaved values persist in sessionStorage until saved or discarded. */
export function BroadcastComposeForm({ mode, original, initialCourseId = "" }: BroadcastComposeFormProps) {
  const router = useRouter();
  const key = draftKey(mode, original?.id);
  const baseline = useMemo<BroadcastFormValues>(
    () => (original ? toFormValues(original) : initialCourseId ? { ...COMPOSE_DEFAULTS, audience: "COURSE", courseIds: [initialCourseId] } : COMPOSE_DEFAULTS),
    [original, initialCourseId]
  );
  const baselineSnap = useMemo(() => snapshotValues(baseline), [baseline]);

  const form = useForm<BroadcastFormValues>({
    resolver: zodResolver(broadcastFormSchema),
    defaultValues: baseline,
    mode: "onTouched",
  });
  const { handleSubmit, reset, control, getValues, setError, clearErrors } = form;
  const values = useWatch({ control }) as BroadcastFormValues;
  const isDirty = snapshotValues({ ...baseline, ...values }) !== baselineSnap;

  const [busy, setBusy] = useState<ComposeBusy>(null);
  const [pendingSend, setPendingSend] = useState<BroadcastFormValues | null>(null);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [saved, setSaved] = useState(false);
  const restoredRef = useRef(false);

  // Restore the session draft once (after mount, so SSR and the first client render match).
  useEffect(() => {
    const draft = readDraft(key);
    if (draft && snapshotValues(draft) !== baselineSnap) {
      reset(draft, { keepDefaultValues: true });
      toast.info("Unsaved changes restored", {
        description: "We brought back what you were working on.",
        action: {
          label: "Discard",
          onClick: () => {
            clearDraft(key);
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
    if (isDirty) writeDraft(key, { ...baseline, ...values });
    else clearDraft(key);
  }, [saved, isDirty, key, values, baseline]);

  const exitTo = mode === "edit" && original ? `/notifications/broadcasts/${original.id}` : "/notifications?tab=broadcasts";

  const finish = (id: string) => {
    setSaved(true);
    clearDraft(key);
    router.push(`/notifications/broadcasts/${id}`);
  };

  // ---------------------------------------------------------------- send / schedule
  const onValid = (v: BroadcastFormValues) => setPendingSend(v);

  const onInvalid = (errors: FieldErrors<BroadcastFormValues>) => {
    const first = FIELD_ORDER.find((f) => errors[f]);
    toast.error("Please fix the highlighted fields", { description: first ? String(errors[first]?.message ?? "") : "Some fields need attention." });
    focusField(first);
  };

  const send = async (v: BroadcastFormValues) => {
    const scheduled = v.timing === "SCHEDULE";
    setBusy("send");
    const toastId = toast.loading(scheduled ? "Scheduling broadcast..." : "Sending broadcast...", { description: v.title.trim() });
    try {
      const b = await saveBroadcast(v, { id: original?.id });
      toast.success(scheduled ? "Broadcast scheduled" : "Broadcast sent", {
        id: toastId,
        description: scheduled ? `${b.title} will go out automatically.` : `${b.title} is on its way.`,
      });
      setPendingSend(null);
      finish(b.id);
    } catch (err) {
      toast.error(scheduled ? "Couldn't schedule the broadcast" : "Couldn't send the broadcast", { id: toastId, description: errorText(err) });
      throw err;
    } finally {
      setBusy(null);
    }
  };

  // ---------------------------------------------------------------- draft
  const saveDraft = async () => {
    const v = getValues();
    clearErrors();
    const issues = draftIssues(v);
    if (issues.length) {
      issues.forEach((i) => setError(i.field, { type: "draft", message: i.message }));
      toast.error("Add a title and message first", { description: issues[0].message });
      focusField(issues[0].field);
      return;
    }
    setBusy("draft");
    const toastId = toast.loading("Saving draft...", { description: v.title.trim() });
    try {
      const b = await saveBroadcast(draftPayload(v), { id: original?.id, asDraft: true });
      toast.success("Draft saved", { id: toastId, description: `${b.title} is saved in Broadcasts → Drafts.` });
      finish(b.id);
    } catch (err) {
      toast.error("Couldn't save the draft", { id: toastId, description: errorText(err) });
    } finally {
      setBusy(null);
    }
  };

  const leave = () => {
    setSaved(true);
    clearDraft(key);
    router.push(exitTo);
  };

  return (
    <FormProvider {...form}>
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-5 text-left pb-8">
        <ComposeHeader mode={mode} broadcastId={original?.id} broadcastTitle={original?.title} busy={busy} onSaveDraft={saveDraft} />

        <form id={COMPOSE_FORM_ID} noValidate onSubmit={handleSubmit(onValid, onInvalid)} className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          <div className="min-w-0 space-y-5 xl:col-span-7">
            <AudienceCard />
            <MessageCard />
            <ChannelsCard />
            <DeliveryCard />
            <ComposeActionsBar busy={busy} isDirty={isDirty} onSaveDraft={saveDraft} onCancel={() => (isDirty ? setConfirmLeave(true) : router.push(exitTo))} />
          </div>
          <div className="min-w-0 xl:col-span-5">
            <div className="space-y-5 xl:sticky xl:top-6">
              <BroadcastPreviewCard />
              <SendSummaryCard />
              <ComposeTipsCard />
            </div>
          </div>
        </form>
      </motion.div>

      <ConfirmSendModal values={pendingSend} onClose={() => setPendingSend(null)} onConfirm={send} />

      <ConfirmModal
        isOpen={confirmLeave}
        title="Discard unsaved changes?"
        subtitle={mode === "create" ? "This broadcast hasn't been sent or saved yet." : "Your edits haven't been saved."}
        message="If you leave now, the changes you made on this page will be lost."
        confirmLabel="Discard Changes"
        pendingLabel="Leaving..."
        confirmIcon={<Undo2 className="h-4 w-4" />}
        onClose={() => setConfirmLeave(false)}
        onConfirm={async () => leave()}
      />
    </FormProvider>
  );
}

export default BroadcastComposeForm;
