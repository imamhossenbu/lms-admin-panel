"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ClipboardCheck, ExternalLink, FileText, Paperclip } from "lucide-react";
import { apiErrorMessage } from "@/lib/apiError";
import { teacherApi } from "@/lib/api/teacher";
import type { TeacherSubmission } from "@/types/teacher";
import { ModalShell } from "@/components/ui/ModalShell";
import { InputField } from "@/components/ui/InputField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { PrimaryButton } from "@/components/ui/primary-button";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { fmtDateTime } from "../shared/format";

/** Read the learner's work and give marks (0…max) + feedback. */
export function GradeModal({ sub, onClose, onGraded }: { sub: TeacherSubmission | null; onClose: () => void; onGraded: () => void }) {
  const max = sub?.assignment.marks ?? 100;
  const schema = z.object({
    marks: z.coerce.number({ message: "Enter the marks" }).min(0, "Marks can't be negative").max(max, `Marks can be at most ${max}`),
    feedback: z.string().trim().max(5000, "Feedback is too long"),
  });
  type V = z.infer<typeof schema>;
  const { register, handleSubmit, reset, formState } = useForm<z.input<typeof schema>, unknown, V>({ resolver: zodResolver(schema) });
  useEffect(() => {
    if (sub) reset({ marks: sub.marksObtained ?? "", feedback: sub.feedback ?? "" });
  }, [sub, reset]);

  const onSubmit = async (v: V) => {
    if (!sub) return;
    const id = toast.loading("Saving the grade…");
    try {
      await teacherApi.grade(sub.id, v.marks, v.feedback);
      toast.success("Graded", { id, description: `${sub.user.name} · ${v.marks}/${max} marks` });
      onGraded();
      onClose();
    } catch (e) {
      toast.error("Couldn't save the grade", { id, description: apiErrorMessage(e) });
    }
  };

  const link = sub?.assignment.type === "LINK" ? sub.textAnswer : null;
  return (
    <ModalShell
      isOpen={!!sub}
      onClose={onClose}
      title={sub ? sub.assignment.title : "Grade"}
      subtitle={sub ? `${sub.user.name} · ${sub.assignment.course.title}` : undefined}
      titleIcon={<ClipboardCheck className="h-5 w-5" />}
      maxWidth="lg"
      footer={
        <div className="flex w-full justify-end gap-2">
          <button type="button" onClick={onClose} className="h-10 rounded-lg border border-dash bg-white px-4 body-sm-medium text-primary-500 hover:border-primary-300">
            Cancel
          </button>
          <PrimaryButton type="submit" form="grade-form" isLoading={formState.isSubmitting}>
            Save grade
          </PrimaryButton>
        </div>
      }
    >
      {sub && (
        <form id="grade-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <div className="flex flex-wrap items-center gap-2 body-xsm-regular text-primary-300">
            <span>Submitted {fmtDateTime(sub.submittedAt)} · attempt {sub.attempt}</span>
            {sub.isLate && <ToneBadge tone="red" size="sm">Late</ToneBadge>}
          </div>
          <div className="rounded-lg border border-dash bg-slate-50 p-4">
            <p className="mb-2 body-xsm-medium font-semibold text-primary-400">Learner&apos;s answer</p>
            {sub.fileUrl ? (
              <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 body-sm-medium text-brand-orange hover:underline">
                <Paperclip className="h-4 w-4" />
                {sub.fileName || "Open file"}
              </a>
            ) : link ? (
              <a href={link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 break-all body-sm-medium text-brand-orange hover:underline">
                <ExternalLink className="h-4 w-4 shrink-0" />
                {link}
              </a>
            ) : sub.textAnswer ? (
              <p className="whitespace-pre-line body-sm-regular text-primary-500">{sub.textAnswer}</p>
            ) : (
              <p className="inline-flex items-center gap-2 body-sm-regular text-primary-300">
                <FileText className="h-4 w-4" />
                No answer attached.
              </p>
            )}
          </div>
          <InputField id="grade-marks" type="number" label={`Marks (out of ${max})`} inputMode="decimal" step="0.5" min={0} max={max} error={formState.errors.marks?.message} {...register("marks")} />
          <div>
            <label htmlFor="grade-feedback" className="mb-2 block body-sm-regular text-primary-400">
              Feedback (the learner sees this)
            </label>
            <TextAreaField id="grade-feedback" rows={5} placeholder="What went well, what to improve…" error={formState.errors.feedback?.message} {...register("feedback")} />
          </div>
        </form>
      )}
    </ModalShell>
  );
}

export default GradeModal;
