"use client";

import React, { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { motion } from "framer-motion";
import { Eye, ListChecks, Users } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { AppSelect } from "@/components/ui/AppSelect";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { CertificateRender } from "@/components/certificates/shared/CertificateRender";
import { TemplateStatusBadge } from "@/components/certificates/shared/TemplateStatusBadge";
import type { TemplateFormValues } from "@/validations/certificateSchema";
import { cn } from "@/lib/cn";
import { previewData, previewTemplate, rulesSummary, SAMPLE_LEARNERS } from "./designerUtils";

export interface TemplatePreviewCardProps {
  /** Session-only local signature previews by signer id. */
  signaturePreviews: Record<string, string>;
}

/** Sticky live preview (scale "md") fed by the form, a sample-learner picker and the rules in plain language. */
export function TemplatePreviewCard({ signaturePreviews }: TemplatePreviewCardProps) {
  const { control } = useFormContext<TemplateFormValues>();
  const values = useWatch({ control }) as Partial<TemplateFormValues>;
  const [learnerId, setLearnerId] = useState(SAMPLE_LEARNERS[0].id);
  const learner = SAMPLE_LEARNERS.find((l) => l.id === learnerId) ?? SAMPLE_LEARNERS[0];
  const template = previewTemplate(values, signaturePreviews);
  const portrait = template.orientation === "PORTRAIT";
  const status = values.status ?? "DRAFT";
  const courseCount = values.courseIds?.length ?? 0;

  return (
    <IconSectionCard
      icon={<Eye className="h-5 w-5" />}
      title="Live Preview"
      description="Updates as you edit. Sample data only."
      tone="green"
      action={
<TemplateStatusBadge status={status} size="md" />
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 body-sm-medium text-primary-400">
            <Users className="h-4 w-4 text-primary-300" /> Preview with
          </span>
          <AppSelect
            size="sm"
            value={learnerId}
            onValueChange={setLearnerId}
            options={SAMPLE_LEARNERS.map((l) => ({ value: l.id, label: l.name }))}
            triggerClassName="min-w-44"
          />
        </div>

        <motion.div layout transition={{ duration: 0.25, ease: "easeOut" }} className="rounded-xl border border-dash bg-gray-bg p-3">
          <div className={cn("mx-auto", portrait ? "max-w-64" : "w-full")}>
            <CertificateRender template={template} data={previewData(learner, values)} scale="md" />
          </div>
        </motion.div>

        <div className="rounded-xl border border-dash bg-white p-3.5">
          <p className="flex items-center gap-2 body-sm-medium font-semibold! text-primary-500">
            <ListChecks className="h-4 w-4 text-brand-orange" /> Issue rules
          </p>
          <p className="mt-1.5 body-xsm-regular text-primary-400">{rulesSummary(values.rules)}</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <ToneBadge tone={courseCount ? "blue" : "gray"} size="sm">
              {courseCount ? `${courseCount} course${courseCount === 1 ? "" : "s"}` : "No courses yet"}
            </ToneBadge>
            <ToneBadge tone="purple" size="sm">
              {`${values.signers?.length ?? 0} signer${values.signers?.length === 1 ? "" : "s"}`}
            </ToneBadge>
            <ToneBadge tone={values.rules?.autoIssue ? "green" : "gray"} size="sm">
              {values.rules?.autoIssue ? "Auto-issue" : "Manual issue"}
            </ToneBadge>
          </div>
        </div>
      </div>
    </IconSectionCard>
  );
}

export default TemplatePreviewCard;
