"use client";

import React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { motion } from "framer-motion";
import { Target } from "lucide-react";
import type { LearningSettings } from "@/validations/platformSettingsSchema";
import { SettingToggleRow } from "@/components/ui/SettingToggleRow";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { FieldError } from "@/components/courses/create/basic/FieldLabel";
import { SettingsCard } from "../../shared/SettingsCard";
import { SettingsBlockRow } from "../../shared/SettingsRow";

const MIN = 50;
const MAX = 100;

/** Completion threshold (50–100% slider) + sequential lessons. */
export function ProgressCard() {
  const { control } = useFormContext<LearningSettings>();
  const threshold = useWatch({ control, name: "completionThreshold" });
  const value = typeof threshold === "number" && Number.isFinite(threshold) ? threshold : MIN;

  return (
    <SettingsCard icon={<Target className="h-5 w-5" />} title="Progress & completion" description="When a course counts as finished." tone="green">
      <SettingsBlockRow>
        <Controller
          control={control}
          name="completionThreshold"
          render={({ field, fieldState }) => (
            <div>
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="learning-threshold" className="body-sm-medium font-semibold! text-primary-500">
                  Completion threshold
                </label>
                <motion.span key={value} initial={{ scale: 0.9, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.15 }}>
                  <ToneBadge tone="orange" variant="pill" size="lg">
                    {value}%
                  </ToneBadge>
                </motion.span>
              </div>

              <input
                id="learning-threshold"
                type="range"
                min={MIN}
                max={MAX}
                step={1}
                value={value}
                onChange={(e) => field.onChange(Number(e.target.value))}
                onBlur={field.onBlur}
                aria-valuetext={`${value}%`}
                className="mt-4 h-2 w-full cursor-pointer accent-brand-orange"
              />
              <div className="mt-2 flex justify-between body-2xsm-regular text-primary-300">
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
              <p className="mt-2 body-xsm-regular text-primary-300">
                A course counts as completed at <span className="body-xsm-medium text-primary-500">{value}%</span> of its lessons — certificates and the completion
                badge unlock then.
              </p>
              <FieldError message={fieldState.error?.message} />
            </div>
          )}
        />
      </SettingsBlockRow>

      <SettingsBlockRow>
        <Controller
          control={control}
          name="sequentialLessons"
          render={({ field }) => (
            <SettingToggleRow
              id="learning-sequential"
              title="Sequential lessons"
              description="Students must finish each lesson before the next one unlocks."
              checked={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </SettingsBlockRow>
    </SettingsCard>
  );
}

export default ProgressCard;
