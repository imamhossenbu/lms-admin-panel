"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Clock, Info } from "lucide-react";
import { ChoiceCardGroup } from "@/components/ui/ChoiceCardGroup";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import { FieldGroupLabel } from "../access/FieldGroupLabel";
import type { LessonOption } from "../access/lessonOptions";
import { BeforeReleaseSection } from "./BeforeReleaseSection";
import { DependenciesSection } from "./DependenciesSection";
import { RELEASE_TYPE_OPTIONS } from "./dripOptions";
import { ReleaseTimingBox } from "./ReleaseTimingBox";

/** Left column: release type, timing, dependencies and before-release behaviour. */
export function DripScheduleCard({ lessonOptions }: { lessonOptions: LessonOption[] }) {
  const { control } = useFormContext<LessonEditorValues>();

  return (
    <IconSectionCard icon={<Clock className="h-5 w-5" />} title="Drip Schedule" description="Set when this lesson will be available to students." bodyClassName="space-y-5">
      <div className="flex items-start gap-2.5 rounded-xl border border-blue/20 bg-blue-14 px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue" />
        <p className="body-sm-regular text-primary-400">
          Drip content helps you release lessons gradually to keep students engaged and improve course completion rates.
        </p>
      </div>

      <div>
        <FieldGroupLabel>Release Type</FieldGroupLabel>
        <Controller
          control={control}
          name="drip.releaseType"
          render={({ field }) => (
            <ChoiceCardGroup name="drip-release-type" aria-label="Release type" value={field.value} onChange={field.onChange} options={RELEASE_TYPE_OPTIONS} columns={4} />
          )}
        />
      </div>

      <ReleaseTimingBox />
      <DependenciesSection lessonOptions={lessonOptions} />
      <BeforeReleaseSection />
    </IconSectionCard>
  );
}

export default DripScheduleCard;
