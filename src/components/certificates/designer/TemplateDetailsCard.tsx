"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Archive, CheckCircle2, FileText, PencilLine } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { InputField } from "@/components/ui/InputField";
import { ChoiceCardGroup, type ChoiceOption } from "@/components/ui/ChoiceCardGroup";
import { FieldLabel } from "@/components/courses/create/basic/FieldLabel";
import type { TemplateStatus } from "@/types/certificate";
import type { TemplateFormValues } from "@/validations/certificateSchema";
import { TEMPLATE_NAME_MAX } from "./designerUtils";

const STATUS_OPTIONS: ChoiceOption<TemplateStatus>[] = [
  { value: "ACTIVE", title: "Active", description: "Issued for its courses", icon: <CheckCircle2 className="h-5 w-5 text-green" /> },
  { value: "DRAFT", title: "Draft", description: "Not used yet", icon: <PencilLine className="h-5 w-5 text-yellow" /> },
  { value: "ARCHIVED", title: "Archived", description: "Kept for history", icon: <Archive className="h-5 w-5 text-primary-300" /> },
];

/** Template name + status (Active / Draft / Archived). */
export function TemplateDetailsCard() {
  const { register, control, trigger, formState } = useFormContext<TemplateFormValues>();
  const name = useWatch({ control, name: "name" }) ?? "";
  const nameError = formState.errors.name?.message;

  return (
    <IconSectionCard icon={<FileText className="h-5 w-5" />} title="Template Details" description="Name the template and choose whether it is in use." tone="blue">
      <div className="space-y-4">
        <div>
          <FieldLabel htmlFor="cert-name" label="Template Name" required count={name.length} max={TEMPLATE_NAME_MAX} />
          <InputField
            id="cert-name"
            placeholder="e.g. Classic Completion"
            maxLength={TEMPLATE_NAME_MAX + 20}
            aria-invalid={!!nameError}
            error={nameError}
            {...register("name")}
          />
        </div>

        <div id="cert-status">
          <FieldLabel label="Status" required />
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <ChoiceCardGroup
                name="cert-status"
                aria-label="Template status"
                value={field.value}
                onChange={(v) => {
                  field.onChange(v);
                  if (formState.isSubmitted || formState.errors.courseIds) void trigger("courseIds");
                }}
                options={STATUS_OPTIONS}
                columns={3}
              />
            )}
          />
          <p className="mt-1.5 body-xsm-regular text-primary-300">Active templates are used for new certificates.</p>
        </div>
      </div>
    </IconSectionCard>
  );
}

export default TemplateDetailsCard;
