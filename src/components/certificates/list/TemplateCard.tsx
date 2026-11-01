"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, BookOpen, Hand, Pencil, Zap } from "lucide-react";
import type { CertificateTemplate, IssuedCertificate } from "@/types/certificate";
import { formatCertDate } from "@/lib/certificateStats";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { PrimaryButton } from "@/components/ui/primary-button";
import { CertificateRender } from "../shared/CertificateRender";
import { TemplateStatusBadge } from "../shared/TemplateStatusBadge";
import { courseTitleOf, rulesSummary } from "./certificateListUtils";
import { TemplateRowMenu, type TemplateHandlers } from "./TemplateRowMenu";

export interface TemplateCardProps {
  template: CertificateTemplate;
  issued: number;
  /** Latest certificate issued with this template (fills the preview with real data). */
  sample: IssuedCertificate | null;
  handlers: TemplateHandlers;
  index: number;
}

/** Template card: live sm preview, name + status, courses, issued count, issue-rules summary, Edit + ⋮. */
export function TemplateCard({ template, issued, sample, handlers, index }: TemplateCardProps) {
  const portrait = template.orientation === "PORTRAIT";
  const courseTitle = sample ? courseTitleOf(sample.courseId) : template.courseIds[0] ? courseTitleOf(template.courseIds[0]) : "Course Title";
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25, ease: "easeOut", delay: Math.min(index, 8) * 0.04 }}
      className="@container dashboard-card shadow-2xs flex flex-col overflow-hidden transition-shadow hover:shadow-md"
    >
      <button
        type="button"
        onClick={() => handlers.onEdit(template)}
        aria-label={`Edit ${template.name}`}
        className="flex aspect-10/7 cursor-pointer items-center justify-center border-b border-dash bg-gray-bg p-4"
      >
        <CertificateRender
          scale="sm"
          template={template}
          className={portrait ? "h-full w-auto" : undefined}
          data={{
            studentName: sample?.recipient.name ?? "Learner Name",
            courseTitle,
            completionDate: formatCertDate(sample?.completedAt ?? template.updatedAt),
            grade: template.showGrade ? (sample?.grade ?? 92) : null,
            instructorName: template.signers[0]?.name ?? "Instructor",
            certificateId: sample?.code ?? `EDU-${template.id.slice(-4).toUpperCase()}-SAMPLE`,
          }}
        />
      </button>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate title-sm text-primary-500" title={template.name}>
              {template.name}
            </h3>
            <p className="truncate body-xsm-regular text-primary-300">
              {template.layout.charAt(0) + template.layout.slice(1).toLowerCase()} · {portrait ? "Portrait" : "Landscape"} · {template.signers.length} signer{template.signers.length === 1 ? "" : "s"}
            </p>
          </div>
          <TemplateStatusBadge status={template.status} />
        </div>

        <div className="space-y-1.5">
          <p className="flex items-center gap-1.5 body-xsm-medium text-primary-400">
            <BookOpen className="h-3.5 w-3.5 text-primary-300" />
            {template.courseIds.length ? `Used by ${template.courseIds.length} course${template.courseIds.length === 1 ? "" : "s"}` : "Not assigned to a course"}
          </p>
          {template.courseIds.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {template.courseIds.map((id) => (
                <ToneBadge key={id} tone="gray" size="sm" className="max-w-full">
                  <span className="truncate">{courseTitleOf(id)}</span>
                </ToneBadge>
              ))}
            </div>
          )}
        </div>

        <div className="mt-auto flex flex-col gap-1.5 rounded-lg bg-gray-bg px-3 py-2">
          <p className="flex items-center gap-1.5 body-xsm-regular text-primary-400">
            <Award className="h-3.5 w-3.5 text-brand-orange" />
            <span className="body-xsm-medium font-semibold! text-primary-500 tabular-nums">{issued.toLocaleString()}</span> issued
          </p>
          <p className="flex min-w-0 items-center gap-1.5 body-xsm-regular text-primary-400" title={rulesSummary(template)}>
            {template.rules.autoIssue ? <Zap className="h-3.5 w-3.5 shrink-0 text-blue" /> : <Hand className="h-3.5 w-3.5 shrink-0 text-primary-300" />}
            <span className="truncate">{rulesSummary(template)}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <PrimaryButton size="sm" className="flex-1" leftIcon={<Pencil className="h-3.5 w-3.5" />} onClick={() => handlers.onEdit(template)}>
            Edit
          </PrimaryButton>
          <TemplateRowMenu template={template} handlers={handlers} />
        </div>
      </div>
    </motion.article>
  );
}

export default TemplateCard;
