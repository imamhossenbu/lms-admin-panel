"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { motion } from "framer-motion";
import { HardDriveUpload } from "lucide-react";
import type { LearningSettings } from "@/validations/platformSettingsSchema";
import { cn } from "@/lib/cn";
import { SettingsCard } from "../../shared/SettingsCard";
import { SettingsRow } from "../../shared/SettingsRow";
import { UnitNumberInput } from "./UnitNumberInput";
import { UPLOAD_PRESETS } from "./learningUtils";

/** Max upload size (MB) with 25 / 50 / 100 / 500 preset chips. */
export function UploadsCard() {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<LearningSettings>();
  const size = useWatch({ control, name: "maxUploadMb" });

  return (
    <SettingsCard icon={<HardDriveUpload className="h-5 w-5" />} title="Uploads" description="Limits for assignment files, resources and attachments." tone="red">
      <SettingsRow label="Max upload size" description="Per file. Videos are handled separately by your media provider." htmlFor="learning-max-upload" required>
        <div className="flex flex-col gap-3 @md:flex-row @md:items-start">
          <UnitNumberInput id="learning-max-upload" name="maxUploadMb" unit="MB" min={1} max={2048} placeholder="50" error={errors.maxUploadMb?.message} className="@md:w-36 @md:shrink-0" />
          <div role="group" aria-label="Upload size presets" className="flex flex-wrap items-center gap-2 @md:min-h-10">
            {UPLOAD_PRESETS.map((mb) => {
              const active = size === mb;
              return (
                <motion.button
                  key={mb}
                  type="button"
                  whileTap={{ scale: 0.94 }}
                  aria-pressed={active}
                  onClick={() => setValue("maxUploadMb", mb, { shouldDirty: true, shouldValidate: true })}
                  className={cn(
                    "inline-flex h-8 shrink-0 items-center whitespace-nowrap rounded-full border px-3.5 body-xsm-medium transition-colors",
                    active ? "border-brand-orange bg-brand-orange-light text-brand-orange" : "border-dash bg-white text-primary-400 hover:border-slate-300 hover:text-primary-500"
                  )}
                >
                  {mb} MB
                </motion.button>
              );
            })}
          </div>
        </div>
      </SettingsRow>
    </SettingsCard>
  );
}

export default UploadsCard;
