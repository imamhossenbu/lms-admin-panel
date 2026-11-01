"use client";

import React from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";
import { toast } from "sonner";
import { AppSelect } from "@/components/ui/AppSelect";
import { PrimaryButton } from "@/components/ui/primary-button";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { answerLiveQuestion } from "@/lib/liveClassStorage";
import { formatClock } from "@/lib/liveClassStats";
import { liveAnswerSchema, type LiveAnswerValues } from "@/validations/liveClassSchema";
import type { LiveQuestion } from "@/types/liveClass";
import { LiveTabCard } from "./LiveTabCard";
import { LiveInitialsAvatar } from "./LiveInitialsAvatar";
import { errorText, shortDate } from "./liveTabFormat";

export interface QuestionDetailsPanelProps {
  question: LiveQuestion;
  /** Class date "YYYY-MM-DD" (the question was asked during the session). */
  classDate: string;
  onClose: () => void;
}

const STATUS_OPTIONS = [
  { value: "ANSWERED", label: "Answered" },
  { value: "PENDING", label: "Pending" },
];

/** Right "Question Details" panel: student, question, rich-text answer + status → answerLiveQuestion. */
export function QuestionDetailsPanel({ question, classDate, onClose }: QuestionDetailsPanelProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<LiveAnswerValues>({
    resolver: zodResolver(liveAnswerSchema),
    defaultValues: { answerHtml: question.answerHtml, status: question.status },
  });
  const status = useWatch({ control, name: "status" });

  const onSubmit = async (values: LiveAnswerValues) => {
    const toastId = toast.loading("Updating answer...", { description: question.question });
    try {
      await answerLiveQuestion(question.id, values.answerHtml, values.status);
      reset(values);
      toast.success(values.status === "ANSWERED" ? "Answer saved" : "Marked as pending", {
        id: toastId,
        description: values.status === "ANSWERED" ? `${question.student.name} can now see the instructor's answer.` : "The question is back in the pending list.",
      });
    } catch (e) {
      toast.error("Couldn't update the answer", { id: toastId, description: errorText(e) });
    }
  };

  return (
    <LiveTabCard
      variant="side"
      title="Question Details"
      action={
        <button
          type="button"
          onClick={onClose}
          aria-label="Close question details"
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-dash text-primary-300 transition-colors hover:bg-slate-50 hover:text-primary-500"
        >
          <X className="h-4 w-4" />
        </button>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="flex items-start gap-3">
          <LiveInitialsAvatar name={question.student.name} size="md" />
          <div className="min-w-0 flex-1">
            <p className="truncate body-sm-medium font-semibold! text-primary-500">{question.student.name}</p>
            <p className="truncate body-xsm-regular text-primary-300">{question.student.email}</p>
          </div>
          <p className="shrink-0 whitespace-nowrap body-xsm-regular text-primary-300">
            {shortDate(classDate)}, {formatClock(question.askedAt)}
          </p>
        </div>

        <div>
          <p className="mb-1.5 body-sm-medium text-primary-500">Question</p>
          <p className="rounded-lg border border-dash bg-gray-bg px-3.5 py-2.5 body-sm-regular text-primary-400">{question.question}</p>
        </div>

        <div>
          <p className="mb-1.5 body-sm-medium text-primary-500">Instructor Answer</p>
          <Controller
            control={control}
            name="answerHtml"
            render={({ field }) => (
              <RichTextEditor value={field.value} onChange={field.onChange} placeholder="Write the answer (code blocks supported)..." minHeight="160px" />
            )}
          />
          {errors.answerHtml && <p className="mt-1.5 body-xsm-regular text-red">{errors.answerHtml.message}</p>}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="min-w-0 sm:w-40">
            <p className="mb-1.5 body-sm-medium text-primary-500">Status</p>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <AppSelect
                  value={field.value}
                  onValueChange={(v) => field.onChange(v as LiveAnswerValues["status"])}
                  options={STATUS_OPTIONS}
                  fullWidth
                  triggerClassName={status === "ANSWERED" ? "text-green" : "text-brand-orange"}
                />
              )}
            />
            {errors.status && <p className="mt-1.5 body-xsm-regular text-red">{errors.status.message}</p>}
          </div>
          <PrimaryButton type="submit" leftIcon={<Save />} isLoading={isSubmitting} disabled={isSubmitting || !isDirty} className="sm:flex-1">
            {isSubmitting ? "Updating..." : "Update Answer"}
          </PrimaryButton>
        </div>
      </form>
    </LiveTabCard>
  );
}

export default QuestionDetailsPanel;
