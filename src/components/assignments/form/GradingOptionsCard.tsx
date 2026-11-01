"use client";

import React from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { BarChart3 } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { ChoiceCardGroup } from "@/components/ui/ChoiceCardGroup";
import { SettingToggleRow } from "@/components/ui/SettingToggleRow";
import { EditorFieldLabel } from "@/components/courses/lesson-editor/fields/FieldLabel";
import type { AssignmentFormValues } from "@/validations/assignmentSchema";
import { GRADING_OPTIONS } from "./assignmentFormConfig";

export interface GradingOptionsCardProps {
  form: UseFormReturn<AssignmentFormValues>;
}

/** Grading Type cards + Show Rubric / Enable Peer Review toggles. */
export function GradingOptionsCard({ form }: GradingOptionsCardProps) {
  const { control } = form;
  return (
    <IconSectionCard icon={<BarChart3 className="h-5 w-5" />} title="Grading Options" description="Set how this assignment will be graded.">
      <div className="space-y-5">
        <div>
          <EditorFieldLabel>Grading Type</EditorFieldLabel>
          <Controller
            control={control}
            name="gradingType"
            render={({ field }) => (
              <ChoiceCardGroup name="grading-type" aria-label="Grading type" columns={3} value={field.value} onChange={field.onChange} options={GRADING_OPTIONS} />
            )}
          />
        </div>
        <div className="space-y-4">
          <Controller
            control={control}
            name="showRubric"
            render={({ field }) => (
              <SettingToggleRow title="Show Rubric" description="Provide a grading rubric for students." checked={field.value} onChange={field.onChange} />
            )}
          />
          <Controller
            control={control}
            name="peerReview"
            render={({ field }) => (
              <SettingToggleRow title="Enable Peer Review" description="Allow students to review each other's work." checked={field.value} onChange={field.onChange} />
            )}
          />
        </div>
      </div>
    </IconSectionCard>
  );
}

export default GradingOptionsCard;
