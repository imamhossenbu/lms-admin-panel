"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm, useWatch, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Undo2 } from "lucide-react";
import type { CertificateTemplate } from "@/types/certificate";
import { templateFormSchema, type TemplateFormValues } from "@/validations/certificateSchema";
import { createTemplate, getCertificatesSnapshot, updateTemplate } from "@/lib/certificateStorage";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { TemplateDesignerHeader, TEMPLATE_FORM_ID } from "./TemplateDesignerHeader";
import { TemplateDetailsCard } from "./TemplateDetailsCard";
import { DesignCard } from "./DesignCard";
import { ContentCard } from "./ContentCard";
import { SignaturesCard } from "./SignaturesCard";
import { CoursesRulesCard } from "./CoursesRulesCard";
import { TemplatePreviewCard } from "./TemplatePreviewCard";
import { TemplateDesignerActionsBar } from "./TemplateDesignerActionsBar";
import {
  DESIGNER_DEFAULTS,
  bodyTextIssue,
  clearDraft,
  draftKey,
  readDraft,
  snapshotValues,
  toFormValues,
  toSaveValues,
  writeDraft,
  type DesignerMode,
} from "./designerUtils";

export interface TemplateDesignerFormProps {
  mode: DesignerMode;
  /** The template being edited (edit mode). */
  original?: CertificateTemplate;
}

const LIST_HREF = "/certificates?tab=templates";
const errorText = (err: unknown) => (err instanceof Error && err.message ? err.message : "Something went wrong. Please try again.");

/** DOM ids in page order, used to scroll to the first invalid field. */
const ERROR_TARGETS: { test: (e: FieldErrors<TemplateFormValues>) => unknown; id: (e: FieldErrors<TemplateFormValues>) => string }[] = [
  { test: (e) => e.name, id: () => "cert-name" },
  { test: (e) => e.heading, id: () => "cert-heading" },
  { test: (e) => e.bodyText, id: () => "cert-body" },
  {
    test: (e) => e.signers,
    id: (e) => {
      const i = Array.isArray(e.signers) ? e.signers.findIndex(Boolean) : -1;
      return i >= 0 ? `cert-signer-${i}-${e.signers?.[i]?.name ? "name" : "title"}` : "cert-signer-0-name";
    },
  },
  { test: (e) => e.courseIds, id: () => "cert-courses" },
  { test: (e) => e.rules?.minCompletion, id: () => "cert-rule-completion" },
  { test: (e) => e.rules?.minQuizScore, id: () => "cert-rule-quiz-score" },
  { test: (e) => e.rules?.validityMonths, id: () => "cert-rule-months" },
];

function firstMessage(errors: FieldErrors<TemplateFormValues>): string | undefined {
  const walk = (node: unknown): string | undefined => {
    if (!node || typeof node !== "object") return undefined;
    const msg = (node as { message?: unknown }).message;
    if (typeof msg === "string" && msg) return msg;
    for (const [k, value] of Object.entries(node as Record<string, unknown>)) {
      if (k === "ref") continue;
      const found = walk(value);
      if (found) return found;
    }
    return undefined;
  };
  return walk(errors);
}

/** New / Edit certificate template designer. Unsaved values persist in sessionStorage until saved or discarded. */
export function TemplateDesignerForm({ mode, original }: TemplateDesignerFormProps) {
  const router = useRouter();
  const key = draftKey(mode, original?.id);
  const baseline = useMemo(() => (original ? toFormValues(original) : DESIGNER_DEFAULTS), [original]);
  const baselineSnap = useMemo(() => snapshotValues(baseline), [baseline]);
  const [templates] = useState(() => getCertificatesSnapshot().templates);

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: baseline,
    mode: "onTouched",
  });
  const { handleSubmit, reset, control, formState } = form;
  const values = useWatch({ control }) as TemplateFormValues;
  const isDirty = snapshotValues({ ...baseline, ...values }) !== baselineSnap;

  const [uploads, setUploads] = useState(0);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [saved, setSaved] = useState(false);
  const restoredRef = useRef(false);
  const previewsRef = useRef(previews);
  useEffect(() => {
    previewsRef.current = previews;
  }, [previews]);

  // Revoke local signature previews on unmount.
  useEffect(() => () => Object.values(previewsRef.current).forEach((u) => URL.revokeObjectURL(u)), []);

  const setPreview = useCallback((signerId: string, url: string | null) => {
    setPreviews((prev) => {
      if (prev[signerId] && prev[signerId] !== url) URL.revokeObjectURL(prev[signerId]);
      const next = { ...prev };
      if (url) next[signerId] = url;
      else delete next[signerId];
      return next;
    });
  }, []);
  const onUploadingChange = useCallback((uploading: boolean) => setUploads((n) => Math.max(0, n + (uploading ? 1 : -1))), []);

  // Restore the session draft once (after mount, so SSR and the first client render match).
  useEffect(() => {
    const draft = readDraft(key);
    if (draft && snapshotValues(draft) !== baselineSnap) {
      reset(draft, { keepDefaultValues: true });
      toast.info("Unsaved changes restored", {
        description: "We brought back the template you were working on.",
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

  const onSubmit = async (v: TemplateFormValues) => {
    if (uploads > 0) {
      toast.error("Upload in progress", { description: "Wait for the signature image to finish uploading." });
      return;
    }
    const payload = toSaveValues(v);
    const toastId = toast.loading(mode === "create" ? "Creating template..." : "Saving changes...", { description: payload.name });
    try {
      const result = mode === "create" || !original ? await createTemplate(payload) : await updateTemplate(original.id, payload);
      setSaved(true);
      clearDraft(key);
      toast.success(mode === "create" ? "Template created" : "Changes saved", {
        id: toastId,
        description:
          result.status === "ACTIVE"
            ? `${result.name} is active for ${result.courseIds.length} course${result.courseIds.length === 1 ? "" : "s"}.`
            : `${result.name} was saved as ${result.status === "DRAFT" ? "a draft" : "archived"}.`,
      });
      router.push(LIST_HREF);
    } catch (err) {
      toast.error(mode === "create" ? "Couldn't create the template" : "Couldn't save changes", { id: toastId, description: errorText(err) });
    }
  };

  const onInvalid = (errors: FieldErrors<TemplateFormValues>) => {
    // Cross-field rules (schema superRefine) only run once the basic fields pass, so mirror them here.
    const bodyHint = !errors.bodyText ? bodyTextIssue(form.getValues("bodyText"), form.getValues("showGrade")) : undefined;
    toast.error("Please fix the highlighted fields", { description: firstMessage(errors) ?? bodyHint ?? "Some fields need attention." });
    const target = ERROR_TARGETS.find((t) => t.test(errors));
    const el = target ? document.getElementById(target.id(errors)) : null;
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) el.focus({ preventScroll: true });
  };

  const leave = () => {
    setSaved(true);
    clearDraft(key);
    router.push(LIST_HREF);
  };

  const uploading = uploads > 0;

  return (
    <FormProvider {...form}>
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-5 text-left pb-8">
        <TemplateDesignerHeader mode={mode} templateName={original?.name} isSubmitting={formState.isSubmitting} disabled={uploading} />

        <form id={TEMPLATE_FORM_ID} noValidate onSubmit={handleSubmit(onSubmit, onInvalid)} className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">
          <div className="min-w-0 space-y-5 xl:col-span-7">
            <TemplateDetailsCard />
            <DesignCard />
            <ContentCard />
            <SignaturesCard previews={previews} onPreviewChange={setPreview} onUploadingChange={onUploadingChange} />
            <CoursesRulesCard templates={templates} selfId={original?.id} />
            <TemplateDesignerActionsBar
              mode={mode}
              isSubmitting={formState.isSubmitting}
              disabled={uploading}
              isDirty={isDirty}
              onCancel={() => (isDirty ? setConfirmLeave(true) : router.push(LIST_HREF))}
            />
          </div>
          <div className="min-w-0 space-y-5 xl:sticky xl:top-6 xl:col-span-5">
            <TemplatePreviewCard signaturePreviews={previews} />
          </div>
        </form>
      </motion.div>

      <ConfirmModal
        isOpen={confirmLeave}
        title="Discard unsaved changes?"
        subtitle={mode === "create" ? "This template hasn't been created yet." : "Your edits haven't been saved."}
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

export default TemplateDesignerForm;
