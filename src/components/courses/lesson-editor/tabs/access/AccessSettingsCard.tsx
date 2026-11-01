"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Lock } from "lucide-react";
import { ChoiceCardGroup } from "@/components/ui/ChoiceCardGroup";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import { ACCESS_TYPE_OPTIONS, VISIBILITY_OPTIONS } from "./accessOptions";
import { Collapse } from "./Collapse";
import { FieldGroupLabel } from "./FieldGroupLabel";
import { LessonSelect } from "./LessonSelect";
import { RadioOptionList } from "./RadioOptionList";
import type { LessonOption } from "./lessonOptions";

/** "Access Settings": lesson visibility cards + access type radios (+ prerequisite lesson). */
export function AccessSettingsCard({ lessonOptions }: { lessonOptions: LessonOption[] }) {
  const { control, formState } = useFormContext<LessonEditorValues>();
  const accessType = useWatch({ control, name: "access.accessType" });
  const prerequisiteError = formState.errors.access?.prerequisiteLessonId?.message;

  return (
    <IconSectionCard
      icon={<Lock className="h-5 w-5" />}
      title="Access Settings"
      description="Control who can access this lesson and set enrollment restrictions."
    >
      <FieldGroupLabel>Lesson Visibility</FieldGroupLabel>
      <Controller
        control={control}
        name="access.visibility"
        render={({ field }) => (
          <ChoiceCardGroup name="access-visibility" aria-label="Lesson visibility" value={field.value} onChange={field.onChange} options={VISIBILITY_OPTIONS} columns={3} />
        )}
      />

      <FieldGroupLabel className="mt-6">Access Type</FieldGroupLabel>
      <Controller
        control={control}
        name="access.accessType"
        render={({ field }) => (
          <RadioOptionList name="access-type" aria-label="Access type" value={field.value} onChange={field.onChange} options={ACCESS_TYPE_OPTIONS} />
        )}
      />
      <Collapse show={accessType === "SPECIFIC_LESSON"} className="pl-8 pt-3">
        <Controller
          control={control}
          name="access.prerequisiteLessonId"
          render={({ field }) => (
            <LessonSelect id="access-prerequisite" options={lessonOptions} value={field.value} onChange={field.onChange} error={prerequisiteError} />
          )}
        />
      </Collapse>
    </IconSectionCard>
  );
}

export default AccessSettingsCard;
