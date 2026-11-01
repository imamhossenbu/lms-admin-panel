"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Clock } from "lucide-react";
import { AppSelect } from "@/components/ui/AppSelect";
import { InputField } from "@/components/ui/InputField";
import type { LessonEditorValues } from "@/validations/lessonEditorSchema";
import { DRIP_UNIT_OPTIONS } from "./dripOptions";

const COPY = {
  AFTER_ENROLLMENT: "Set when this lesson will be available after student enrollment.",
  SPECIFIC_DATE: "Pick the exact date and time this lesson unlocks for every student.",
  MANUAL: "This lesson stays locked until you release it manually from the curriculum.",
} as const;

/** "Release Timing" box: duration (After Enrollment) or date + time (Specific Date). */
export function ReleaseTimingBox() {
  const { control, register, formState } = useFormContext<LessonEditorValues>();
  const releaseType = useWatch({ control, name: "drip.releaseType" });
  const errors = formState.errors.drip;
  const visible = releaseType !== "IMMEDIATE";

  return (
    <AnimatePresence initial={false} mode="wait">
      {visible && (
        <motion.div
          key={releaseType}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="rounded-xl border border-dash p-4"
        >
          <p className="body-sm-medium font-semibold! text-primary-500">Release Timing</p>
          <p className="mt-0.5 body-xsm-regular text-primary-300">{COPY[releaseType as keyof typeof COPY]}</p>

          {releaseType === "AFTER_ENROLLMENT" && (
            <div className="mt-3.5 flex flex-col gap-3 sm:flex-row sm:items-start">
              <InputField
                type="number"
                min={1}
                max={365}
                aria-label="Release after"
                containerClassName="sm:max-w-60"
                error={errors?.releaseValue?.message}
                {...register("drip.releaseValue", { valueAsNumber: true })}
              />
              <Controller
                control={control}
                name="drip.releaseUnit"
                render={({ field }) => (
                  <AppSelect value={field.value} onValueChange={field.onChange} options={DRIP_UNIT_OPTIONS} className="w-full sm:w-48" fullWidth />
                )}
              />
              <span className="body-sm-regular text-primary-300 sm:pt-2.5">after enrollment</span>
            </div>
          )}

          {releaseType === "SPECIFIC_DATE" && (
            <div className="mt-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <InputField
                id="drip-release-date"
                type="date"
                label="Release Date"
                leftElement={<CalendarDays className="h-4 w-4" />}
                error={errors?.releaseDate?.message}
                {...register("drip.releaseDate")}
              />
              <InputField
                id="drip-release-time"
                type="time"
                label="Release Time"
                leftElement={<Clock className="h-4 w-4" />}
                error={errors?.releaseTime?.message}
                {...register("drip.releaseTime")}
              />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ReleaseTimingBox;
