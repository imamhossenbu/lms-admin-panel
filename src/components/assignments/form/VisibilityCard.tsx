"use client";

import React from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { Eye } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { ChoiceCardGroup } from "@/components/ui/ChoiceCardGroup";
import type { AssignmentFormValues } from "@/validations/assignmentSchema";
import { VISIBILITY_OPTIONS } from "./assignmentFormConfig";

/** Published / Draft cards. */
export function VisibilityCard({ form }: { form: UseFormReturn<AssignmentFormValues> }) {
  return (
    <IconSectionCard icon={<Eye className="h-5 w-5" />} title="Visibility" description="Control who can see and access this assignment.">
      <Controller
        control={form.control}
        name="status"
        render={({ field }) => (
          <ChoiceCardGroup name="assignment-visibility" aria-label="Visibility" columns={2} value={field.value} onChange={field.onChange} options={VISIBILITY_OPTIONS} />
        )}
      />
    </IconSectionCard>
  );
}

export default VisibilityCard;
