"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Paperclip } from "lucide-react";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import { Collapse } from "../access/Collapse";
import { fieldErrorMessage } from "../access/fieldError";
import { SettingToggleRow } from "@/components/ui/SettingToggleRow";
import type { LessonOption } from "../access/lessonOptions";
import { PrerequisiteLessonList } from "./PrerequisiteLessonList";
import { SubSectionHeader } from "./SubSectionHeader";

/** "Dependencies (Optional)": require completion of selected lessons. */
export function DependenciesSection({ lessonOptions }: { lessonOptions: LessonOption[] }) {
  const { control, formState } = useFormContext<LessonEditorValues>();
  const enabled = useWatch({ control, name: "drip.dependencies.enabled" });
  const error = fieldErrorMessage(formState.errors.drip?.dependencies?.lessonIds);

  return (
    <div className="rounded-xl border border-dash p-4">
      <SubSectionHeader
        icon={<Paperclip className="h-4 w-4" />}
        title="Dependencies (Optional)"
        description="Require students to complete specific lessons before accessing this lesson."
      />
      <Controller
        control={control}
        name="drip.dependencies.enabled"
        render={({ field }) => (
          <SettingToggleRow
            id="drip-dependencies"
            className="mt-4"
            checked={field.value}
            onChange={field.onChange}
            title="Require previous lesson completion"
            description="Students must complete the selected lesson(s) before this lesson becomes available."
          />
        )}
      />
      <Collapse show={enabled} className="pt-4">
        <Controller
          control={control}
          name="drip.dependencies.lessonIds"
          render={({ field }) => <PrerequisiteLessonList options={lessonOptions} value={field.value} onChange={field.onChange} error={error} />}
        />
      </Collapse>
    </div>
  );
}

export default DependenciesSection;
