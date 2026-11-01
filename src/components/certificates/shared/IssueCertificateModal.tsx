"use client";

import React, { useEffect, useId, useMemo } from "react";
import Link from "next/link";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AlertTriangle, Award, Eye } from "lucide-react";
import type { IssuedCertificate } from "@/types/certificate";
import { issueCertificateSchema, type IssueCertificateValues } from "@/validations/certificateSchema";
import { CERT_LEARNERS, issueCertificate } from "@/lib/certificateStorage";
import { activeTemplateFor, formatCertDate } from "@/lib/certificateStats";
import { COURSE_OPTIONS, getCourseContext } from "@/data/mockCourseCatalog";
import { toKey } from "@/components/ui/date-range/dateRangeUtils";
import { ModalShell } from "@/components/ui/ModalShell";
import { AppSelect } from "@/components/ui/AppSelect";
import { InputField } from "@/components/ui/InputField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { SettingToggleRow } from "@/components/ui/SettingToggleRow";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { CertificateRender } from "./CertificateRender";
import { LearnerPicker } from "./LearnerPicker";
import { useCertificateSnapshot } from "./useCertificateSnapshot";

export interface IssueCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCourseId?: string;
  defaultRecipientId?: string;
  /** Prefill from the eligible queue (quiz score). */
  defaultGrade?: number | null;
  /** Prefill "YYYY-MM-DD" (defaults to today). */
  defaultCompletedAt?: string;
  /** Called after a successful issue. */
  onIssued?: (certificate: IssuedCertificate) => void;
}

const formSchema = issueCertificateSchema.superRefine((v, ctx) => {
  if (v.completedAt > toKey(new Date())) ctx.addIssue({ code: "custom", path: ["completedAt"], message: "Completion date can't be in the future" });
});

const Label = ({ htmlFor, children, required }: { htmlFor?: string; children: React.ReactNode; required?: boolean }) => (
  <label htmlFor={htmlFor} className="mb-2 block body-sm-medium text-primary-500">
    {children}
    {required && <span className="ml-0.5 text-red">*</span>}
  </label>
);

const FieldError = ({ message }: { message?: string }) => (message ? <p className="mt-1.5 body-xsm-regular text-red">{message}</p> : null);

/** Manual issue: course (needs an active template) → learner → grade/date/email/note, with a live certificate preview. */
export function IssueCertificateModal({ isOpen, onClose, defaultCourseId, defaultRecipientId, defaultGrade = null, defaultCompletedAt, onIssued }: IssueCertificateModalProps) {
  const formId = useId();
  const snapshot = useCertificateSnapshot(isOpen);
  const today = toKey(new Date());

  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<IssueCertificateValues>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: { courseId: "", recipientId: "", grade: null, completedAt: today, sendEmail: true, note: "" },
  });

  useEffect(() => {
    if (isOpen)
      reset({
        courseId: defaultCourseId ?? "",
        recipientId: defaultRecipientId ?? "",
        grade: defaultGrade,
        completedAt: defaultCompletedAt ?? toKey(new Date()),
        sendEmail: true,
        note: "",
      });
  }, [isOpen, defaultCourseId, defaultRecipientId, defaultGrade, defaultCompletedAt, reset]);

  const [courseId, recipientId, grade, completedAt] = useWatch({ control, name: ["courseId", "recipientId", "grade", "completedAt"] });
  const template = snapshot && courseId ? activeTemplateFor(snapshot.templates, courseId) : undefined;
  const noTemplate = !!courseId && !!snapshot && !template;
  const learner = CERT_LEARNERS.find((l) => l.id === recipientId);

  /** Learners who already hold a valid certificate for the chosen course. */
  const blocked = useMemo(() => {
    const map = new Map<string, string>();
    snapshot?.certificates.forEach((c) => {
      if (c.courseId === courseId && c.status === "VALID") map.set(c.recipient.id, "Has certificate");
    });
    return map;
  }, [snapshot, courseId]);

  const close = () => {
    if (!isSubmitting) onClose();
  };

  const submit = async (values: IssueCertificateValues) => {
    if (template?.showGrade && values.grade === null) {
      setError("grade", { message: "Enter the final grade shown on this certificate" });
      return;
    }
    const toastId = toast.loading("Issuing certificate...", { description: learner ? `For ${learner.name}` : undefined });
    try {
      const cert = await issueCertificate({ ...values, grade: template?.showGrade ? values.grade : null });
      toast.success("Certificate issued", {
        id: toastId,
        description: `${cert.code} for ${cert.recipient.name}${values.sendEmail ? " — emailed to the learner" : ""}.`,
      });
      onIssued?.(cert);
      onClose();
    } catch (err) {
      toast.error("Couldn't issue the certificate", { id: toastId, description: err instanceof Error ? err.message : "Please try again." });
    }
  };

  const courseTitle = courseId ? getCourseContext(courseId).course.title : "Course Title";
  const previewDate = /^\d{4}-\d{2}-\d{2}$/.test(completedAt ?? "") ? formatCertDate(`${completedAt}T12:00`) : formatCertDate(new Date().toISOString());

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={close}
      title="Issue Certificate"
      subtitle="Manually issue a certificate to a learner who completed a course."
      maxWidth="xl"
      footer={
        <>
          <SecondaryButton type="button" onClick={close} disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit" form={formId} isLoading={isSubmitting} disabled={isSubmitting || noTemplate} leftIcon={<Award className="h-4 w-4" />}>
            {isSubmitting ? "Issuing..." : "Issue Certificate"}
          </PrimaryButton>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-6 text-left md:grid-cols-5">
        <form id={formId} onSubmit={handleSubmit(submit)} noValidate className="space-y-4 md:col-span-3">
          <div>
            <Label required>Course</Label>
            <Controller
              control={control}
              name="courseId"
              render={({ field }) => (
                <AppSelect
                  value={field.value}
                  onValueChange={(v) => {
                    field.onChange(v);
                    field.onBlur();
                  }}
                  options={COURSE_OPTIONS}
                  placeholder="Select a course"
                  className="w-full"
                  triggerClassName={`w-full h-10 bg-white ${errors.courseId ? "border-red" : ""}`}
                />
              )}
            />
            <FieldError message={errors.courseId?.message} />
            {noTemplate && (
              <div className="mt-2 flex items-start gap-2.5 rounded-lg border border-yellow bg-yellow-bg p-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow" />
                <div className="body-xsm-regular text-primary-400">
                  <p className="body-sm-medium font-semibold! text-primary-500">No active certificate template</p>
                  This course isn&apos;t assigned to an active template yet.{" "}
                  <Link href="/certificates?tab=templates" className="font-semibold! text-brand-orange hover:underline">
                    Assign a template
                  </Link>{" "}
                  first, then issue the certificate.
                </div>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor={`${formId}-learner`} required>
              Learner
            </Label>
            <Controller
              control={control}
              name="recipientId"
              render={({ field }) => (
                <LearnerPicker id={`${formId}-learner`} learners={CERT_LEARNERS} value={field.value} onChange={field.onChange} blocked={blocked} error={errors.recipientId?.message} />
              )}
            />
            <FieldError message={errors.recipientId?.message} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {template?.showGrade && (
              <Controller
                control={control}
                name="grade"
                render={({ field }) => (
                  <InputField
                    id={`${formId}-grade`}
                    label={<span className="body-sm-medium text-primary-500">Final Grade (%)</span>}
                    required
                    type="number"
                    min={0}
                    max={100}
                    placeholder="e.g. 92"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                    onBlur={field.onBlur}
                    error={errors.grade?.message}
                  />
                )}
              />
            )}
            <InputField
              id={`${formId}-date`}
              label={<span className="body-sm-medium text-primary-500">Completion Date</span>}
              required
              type="date"
              max={today}
              error={errors.completedAt?.message}
              {...register("completedAt")}
            />
          </div>

          <Controller
            control={control}
            name="sendEmail"
            render={({ field }) => (
              <SettingToggleRow
                title="Email the certificate to the learner"
                description={learner ? `Sends a download link to ${learner.email}.` : "Sends a download link to the learner's email."}
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <div>
            <Label htmlFor={`${formId}-note`}>Internal Note</Label>
            <TextAreaField id={`${formId}-note`} rows={2} placeholder="Optional — why this certificate was issued manually" error={errors.note?.message} {...register("note")} />
          </div>
        </form>

        <aside className="md:col-span-2">
          <div className="space-y-2.5 md:sticky md:top-0">
            <p className="flex items-center gap-1.5 body-sm-medium text-primary-500">
              <Eye className="h-3.5 w-3.5 text-primary-300" /> Live Preview
            </p>
            {template ? (
              <>
                <div className="rounded-xl border border-dash bg-gray-bg p-3">
                  <CertificateRender
                    scale="sm"
                    template={template}
                    data={{
                      studentName: learner?.name ?? "Learner Name",
                      courseTitle,
                      completionDate: previewDate,
                      grade: template.showGrade ? grade : null,
                      instructorName: template.signers[0]?.name ?? "Instructor",
                      certificateId: "EDU-PREVIEW-00000",
                    }}
                  />
                </div>
                <p className="body-xsm-regular text-primary-300">
                  Template: <span className="body-xsm-medium text-primary-500">{template.name}</span>
                  {template.rules.validityMonths ? ` · Expires after ${template.rules.validityMonths} months` : " · Never expires"}
                </p>
              </>
            ) : (
              <div className="flex aspect-10/7 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-dash bg-gray-bg p-4 text-center">
                <Award className="h-7 w-7 text-primary-300" />
                <p className="body-sm-medium text-primary-500">{noTemplate ? "No template for this course" : "Select a course"}</p>
                <p className="body-xsm-regular text-primary-300">The certificate preview appears here.</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </ModalShell>
  );
}

export default IssueCertificateModal;
