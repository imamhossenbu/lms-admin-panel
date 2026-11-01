"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { ListChecks } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { FieldError, FieldLabel } from "@/components/courses/create/basic/FieldLabel";
import type { CertificateTemplate } from "@/types/certificate";
import type { TemplateFormValues } from "@/validations/certificateSchema";
import { CourseChipSelect } from "./CourseChipSelect";
import { IssueRulesFields } from "./IssueRulesFields";

export interface CoursesRulesCardProps {
  templates: CertificateTemplate[];
  selfId?: string;
}

/** Which courses use this template, and when a certificate is issued. */
export function CoursesRulesCard({ templates, selfId }: CoursesRulesCardProps) {
  const { control, trigger, formState } = useFormContext<TemplateFormValues>();
  const status = useWatch({ control, name: "status" });
  const courseIds = useWatch({ control, name: "courseIds" }) ?? [];
  // Mirrors the schema's cross-field rule so it shows even while other fields are invalid.
  const localError = formState.isSubmitted && status === "ACTIVE" && courseIds.length === 0 ? "Assign at least one course to activate this template" : undefined;
  const coursesError = formState.errors.courseIds?.message ?? localError;

  return (
    <IconSectionCard icon={<ListChecks className="h-5 w-5" />} title="Courses & Issue Rules" description="Pick the courses and the requirements a learner must meet." tone="yellow">
      <div className="space-y-5">
        <div id="cert-courses">
          <FieldLabel label="Courses" optional={status !== "ACTIVE"} required={status === "ACTIVE"} />
          <Controller
            control={control}
            name="courseIds"
            render={({ field }) => (
              <CourseChipSelect
                value={field.value}
                onChange={(ids) => {
                  field.onChange(ids);
                  if (formState.isSubmitted) void trigger("courseIds");
                }}
                templates={templates}
                selfId={selfId}
                willBeActive={status === "ACTIVE"}
                hasError={!!coursesError}
              />
            )}
          />
          <FieldError message={coursesError} />
          {!coursesError && <p className="mt-1.5 body-xsm-regular text-primary-300">A course can use only one active template at a time.</p>}
        </div>

        <div className="border-t border-dash pt-5">
          <IssueRulesFields />
        </div>
      </div>
    </IconSectionCard>
  );
}

export default CoursesRulesCard;
