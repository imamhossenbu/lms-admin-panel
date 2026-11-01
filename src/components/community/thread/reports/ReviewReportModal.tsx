"use client";

import React, { useEffect, useId } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeOff, Gavel, ShieldOff, XCircle } from "lucide-react";
import { toast } from "sonner";
import type { CommunityThread, ThreadReply, ThreadReport } from "@/types/community";
import { resolveReport } from "@/lib/communityStorage";
import { ChoiceCardGroup, type ChoiceOption } from "@/components/ui/ChoiceCardGroup";
import { ModalShell } from "@/components/ui/ModalShell";
import { PrimaryButton } from "@/components/ui/primary-button";
import { RichTextContent } from "@/components/ui/RichTextContent";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { reportResolutionSchema, type ReportResolutionValues } from "@/validations/communitySchema";
import { AuthorLine } from "../discussion/AuthorLine";
import { REPORT_REASON_META, REPORT_STATUS_META, errorText, exactDate, plural, shortDate } from "../threadFormat";

export interface ReviewReportModalProps {
  report: ThreadReport | null;
  thread: CommunityThread;
  replies: ThreadReply[];
  /** Every report of the thread (to count other open reports on the same target). */
  reports: ThreadReport[];
  onClose: () => void;
}

type Action = ReportResolutionValues["action"];

const SUCCESS: Record<Action, [string, string]> = {
  DISMISS: ["Report dismissed", "The content stays visible and the report is closed."],
  REMOVE_CONTENT: ["Content removed", "The reported content was taken down and the report is closed."],
  HIDE_THREAD: ["Discussion hidden", "The discussion is hidden from students and locked."],
};

/** Review a report: the reported content, report details and a resolution form (zodResolver(reportResolutionSchema)). */
export function ReviewReportModal({ report, thread, replies, reports, onClose }: ReviewReportModalProps) {
  const formId = useId();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReportResolutionValues>({ resolver: zodResolver(reportResolutionSchema), defaultValues: { action: "DISMISS", note: "" } });

  const reportId = report?.id;
  useEffect(() => {
    if (reportId) reset({ action: "DISMISS", note: "" });
  }, [reportId, reset]);

  if (!report) return null;

  const isOpen = report.status === "OPEN";
  const reply = report.targetType === "REPLY" ? replies.find((r) => r.id === report.targetId) : undefined;
  const sameTarget = reports.filter((r) => r.targetId === report.targetId && r.status === "OPEN" && r.id !== report.id).length;

  const options: ChoiceOption<Action>[] = [
    { value: "DISMISS", title: "Dismiss report", description: "Nothing wrong — keep the content.", icon: <XCircle className="h-5 w-5 text-primary-300" /> },
    {
      value: "REMOVE_CONTENT",
      title: report.targetType === "REPLY" ? "Remove reply" : "Remove content",
      description: report.targetType === "REPLY" ? "Replace it with a moderator notice." : "Hide and lock the discussion.",
      icon: <ShieldOff className="h-5 w-5 text-red" />,
      disabled: report.targetType === "REPLY" && !reply,
    },
    { value: "HIDE_THREAD", title: "Hide discussion", description: "Hide from students and lock it.", icon: <EyeOff className="h-5 w-5 text-yellow" /> },
  ];

  const onSubmit = async (values: ReportResolutionValues) => {
    const toastId = toast.loading("Resolving report...", { description: `${REPORT_REASON_META[report.reason].label} report by ${report.reporter.name}` });
    try {
      await resolveReport(report.id, values.action, values.note);
      const [title, description] = SUCCESS[values.action];
      toast.success(title, { id: toastId, description: values.note ? `${description} Note: ${values.note}` : description });
      onClose();
    } catch (e) {
      toast.error("Couldn't resolve the report", { id: toastId, description: errorText(e) });
    }
  };

  return (
    <ModalShell
      isOpen
      onClose={isSubmitting ? () => {} : onClose}
      title={isOpen ? "Review Report" : "Report Details"}
      subtitle={`Reported ${exactDate(report.createdAt)}`}
      maxWidth="lg"
      footer={
        isOpen ? (
          <>
            <SecondaryButton type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" form={formId} leftIcon={<Gavel />} isLoading={isSubmitting} disabled={isSubmitting}>
              {isSubmitting ? "Resolving..." : "Resolve Report"}
            </PrimaryButton>
          </>
        ) : (
          <SecondaryButton type="button" onClick={onClose}>
            Close
          </SecondaryButton>
        )
      }
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <p className="body-xsm-regular text-primary-300">Reason</p>
            <div className="mt-1">
              <ToneBadge tone={REPORT_REASON_META[report.reason].tone}>{REPORT_REASON_META[report.reason].label}</ToneBadge>
            </div>
          </div>
          <div className="min-w-0">
            <p className="body-xsm-regular text-primary-300">Reporter</p>
            <p className="mt-1 truncate body-sm-medium text-primary-500" title={report.reporter.email}>
              {report.reporter.name}
            </p>
          </div>
          <div>
            <p className="body-xsm-regular text-primary-300">Status</p>
            <div className="mt-1">
              <ToneBadge tone={REPORT_STATUS_META[report.status].tone} dot>
                {REPORT_STATUS_META[report.status].label}
              </ToneBadge>
            </div>
          </div>
        </div>

        {report.note && (
          <div>
            <p className="mb-1.5 body-sm-medium text-primary-500">Reporter&apos;s note</p>
            <p className="rounded-lg border border-dash bg-gray-bg px-3.5 py-2.5 body-sm-regular text-primary-400">{report.note}</p>
          </div>
        )}

        <div>
          <p className="mb-1.5 body-sm-medium text-primary-500">Reported {report.targetType === "THREAD" ? "discussion" : "reply"}</p>
          <div className="space-y-3 rounded-xl border border-dash bg-gray-bg p-4">
            {report.targetType === "THREAD" ? (
              <>
                <AuthorLine member={thread.author} at={thread.createdAt} size={32} />
                <p className="body-md-medium font-semibold! text-primary-500">{thread.title}</p>
                <RichTextContent html={thread.bodyHtml} className="line-clamp-6" />
              </>
            ) : reply ? (
              <>
                <AuthorLine member={reply.author} at={reply.createdAt} size={32} />
                {reply.isRemoved ? (
                  <p className="body-sm-regular italic text-primary-300">This reply was removed by a moderator.</p>
                ) : (
                  <RichTextContent html={reply.bodyHtml} className="line-clamp-6" />
                )}
              </>
            ) : (
              <p className="body-sm-regular italic text-primary-300">This reply no longer exists.</p>
            )}
          </div>
          {isOpen && sameTarget > 0 && (
            <p className="mt-2 body-xsm-regular text-primary-300">
              {plural(sameTarget, "other open report")} on the same content will be resolved together.
            </p>
          )}
        </div>

        {!isOpen && (report.resolutionNote || report.resolvedAt) && (
          <div>
            <p className="mb-1.5 body-sm-medium text-primary-500">Moderator note</p>
            <p className="rounded-lg border border-dash bg-gray-bg px-3.5 py-2.5 body-sm-regular text-primary-400">
              {report.resolutionNote || "No note was added."}
            </p>
            {report.resolvedAt && <p className="mt-1.5 body-xsm-regular text-primary-300">Resolved {shortDate(report.resolvedAt)}</p>}
          </div>
        )}

        {isOpen && (
          <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div>
              <p className="mb-2 body-sm-medium text-primary-500">Action</p>
              <Controller
                control={control}
                name="action"
                render={({ field }) => <ChoiceCardGroup name="report-action" aria-label="Resolution action" value={field.value} onChange={field.onChange} options={options} columns={3} />}
              />
              {errors.action && <p className="mt-1.5 body-xsm-regular text-red">{errors.action.message}</p>}
            </div>
            <div>
              <label htmlFor={`${formId}-note`} className="mb-1.5 block body-sm-medium text-primary-500">
                Moderator note <span className="body-xsm-regular text-primary-300">(optional)</span>
              </label>
              <TextAreaField id={`${formId}-note`} rows={3} placeholder="Why did you take this action?" error={errors.note?.message} {...register("note")} />
            </div>
          </form>
        )}
      </div>
    </ModalShell>
  );
}

export default ReviewReportModal;
