"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Globe } from "lucide-react";
import { EditorSectionCard } from "@/components/courses/lesson-editor/shared/EditorSectionCard";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import type { LessonEditorOption } from "@/types/lessonEditor";
import { fieldErrorMessage } from "./fieldError";
import { MultiSelectChips } from "./MultiSelectChips";
import { SettingToggleRow } from "../../shared/SettingToggleRow";

/** "Geographic Restriction (Optional)": toggle + countries. */
export function GeoRestrictionCard({ countries }: { countries: LessonEditorOption[] }) {
  const { control, formState } = useFormContext<LessonEditorValues>();
  const enabled = useWatch({ control, name: "access.geoRestriction.enabled" });
  const countriesError = fieldErrorMessage(formState.errors.access?.geoRestriction?.countries);

  return (
    <EditorSectionCard icon={<Globe className="h-5 w-5" />} title="Geographic Restriction (Optional)" description="Restrict access based on student location.">
      <Controller
        control={control}
        name="access.geoRestriction.enabled"
        render={({ field }) => (
          <SettingToggleRow
            id="access-geo-restriction"
            checked={field.value}
            onChange={field.onChange}
            title="Enable geographic restriction"
            description="Only allow access from selected countries."
          />
        )}
      />
      <div className="mt-4">
        <Controller
          control={control}
          name="access.geoRestriction.countries"
          render={({ field }) => (
            <MultiSelectChips
              aria-label="Allowed countries"
              options={countries}
              value={field.value}
              onChange={field.onChange}
              placeholder="Select countries..."
              searchable
              disabled={!enabled}
              error={enabled ? countriesError : undefined}
            />
          )}
        />
      </div>
    </EditorSectionCard>
  );
}

export default GeoRestrictionCard;
