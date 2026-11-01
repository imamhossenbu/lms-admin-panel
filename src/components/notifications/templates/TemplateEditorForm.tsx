"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Undo2 } from "lucide-react";
import type { NotificationTemplateItem } from "@/types/notification";
import { templateEditorSchema, type TemplateEditorValues } from "@/validations/notificationSchema";
import { sendTestNotification, updateTemplateItem } from "@/lib/notificationStorage";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { TemplateEditorHeader } from "./TemplateEditorHeader";
import { TemplateDetailsCard } from "./TemplateDetailsCard";
import { TemplateMessageCard } from "./TemplateMessageCard";
import { TemplateEditorActionsBar } from "./TemplateEditorActionsBar";
import { TemplatePreviewCard } from "./TemplatePreviewCard";
import { TEMPLATE_FORM_ID, errorText } from "./templateUtils";

const EXIT_HREF = "/notifications?tab=templates";
const FIELD_ORDER: (keyof TemplateEditorValues)[] = ["name", "channels", "subject", "body"];
const FIELD_DOM_ID: Partial<Record<keyof TemplateEditorValues, string>> = { name: "template-name", subject: "template-subject", body: "template-body" };

const toValues = (t: NotificationTemplateItem): TemplateEditorValues => ({ name: t.name, subject: t.subject, body: t.body, channels: [...t.channels], enabled: t.locked ? true : t.enabled });

/** Automated template editor: details, message (placeholder chips), live preview, send test, save. */
export function TemplateEditorForm({ template }: { template: NotificationTemplateItem }) {
  const router = useRouter();
  const schema = useMemo(() => templateEditorSchema(template.trigger), [template.trigger]);
  const form = useForm<TemplateEditorValues>({ resolver: zodResolver(schema), defaultValues: toValues(template), mode: "onTouched" });
  const { handleSubmit, formState, trigger: validate } = form;
  const isDirty = formState.isDirty;

  const [confirmLeave, setConfirmLeave] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [saved, setSaved] = useState(false);

  // Warn before closing / reloading the tab with unsaved edits.
  useEffect(() => {
    if (!isDirty || saved) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty, saved]);

  const onSubmit = async (v: TemplateEditorValues) => {
    const toastId = toast.loading("Saving template...", { description: v.name });
    try {
      const next = await updateTemplateItem(template.id, { ...v, name: v.name.trim(), subject: v.subject.trim(), body: v.body.trim() });
      setSaved(true);
      toast.success("Template saved", { id: toastId, description: `"${next.name}" was updated.` });
      router.push(EXIT_HREF);
    } catch (err) {
      toast.error("Couldn't save the template", { id: toastId, description: errorText(err) });
    }
  };

  const onInvalid = (errors: FieldErrors<TemplateEditorValues>) => {
    const first = FIELD_ORDER.find((f) => errors[f]);
    toast.error("Please fix the highlighted fields", { description: (first && errors[first]?.message) || "Some fields need attention." });
    const id = first ? FIELD_DOM_ID[first] : undefined;
    const el = id ? document.getElementById(id) : null;
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) el.focus({ preventScroll: true });
  };

  const sendTest = async () => {
    if (!(await validate(["subject", "body", "channels"]))) {
      toast.error("Fix the message before sending a test", { description: "The subject, body and channels must be valid." });
      return;
    }
    setSendingTest(true);
    const toastId = toast.loading("Sending test...", { description: template.name });
    try {
      const to = await sendTestNotification();
      toast.success(`Test sent to ${to}`, { id: toastId, description: "Check your inbox to see how it looks." });
    } catch (err) {
      toast.error("Couldn't send the test", { id: toastId, description: errorText(err) });
    } finally {
      setSendingTest(false);
    }
  };

  const cancel = () => (isDirty ? setConfirmLeave(true) : router.push(EXIT_HREF));

  return (
    <FormProvider {...form}>
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-5 pb-8 text-left">
        <TemplateEditorHeader template={template} isSubmitting={formState.isSubmitting} isSendingTest={sendingTest} onSendTest={() => void sendTest()} />

        <form id={TEMPLATE_FORM_ID} noValidate onSubmit={handleSubmit(onSubmit, onInvalid)} className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">
          <div className="min-w-0 space-y-5 xl:col-span-7">
            <TemplateDetailsCard template={template} />
            <TemplateMessageCard trigger={template.trigger} />
            <TemplateEditorActionsBar isSubmitting={formState.isSubmitting} isDirty={isDirty} onCancel={cancel} />
          </div>
          <div className="min-w-0 xl:col-span-5 xl:self-stretch">
            <TemplatePreviewCard trigger={template.trigger} />
          </div>
        </form>
      </motion.div>

      <ConfirmModal
        isOpen={confirmLeave}
        title="Discard unsaved changes?"
        subtitle="Your edits to this template haven't been saved."
        message="If you leave now, the changes you made on this page will be lost."
        confirmLabel="Discard Changes"
        pendingLabel="Leaving..."
        confirmIcon={<Undo2 className="h-4 w-4" />}
        onClose={() => setConfirmLeave(false)}
        onConfirm={async () => {
          setSaved(true);
          router.push(EXIT_HREF);
        }}
      />
    </FormProvider>
  );
}

export default TemplateEditorForm;
