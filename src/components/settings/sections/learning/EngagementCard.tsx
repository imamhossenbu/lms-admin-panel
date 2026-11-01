"use client";

import React, { useEffect } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { LearningSettings } from "@/validations/platformSettingsSchema";
import { SettingToggleRow } from "@/components/ui/SettingToggleRow";
import { SettingsCard } from "../../shared/SettingsCard";
import { SettingsBlockRow } from "../../shared/SettingsRow";

type ToggleKey = "allowReviews" | "reviewModeration" | "enableCommunity" | "autoIssueCertificates";

const TOGGLES: { name: ToggleKey; title: string; description: string; nested?: boolean }[] = [
  { name: "allowReviews", title: "Allow course reviews", description: "Students can rate and review courses they're enrolled in." },
  { name: "reviewModeration", title: "Moderate reviews before publishing", description: "New reviews wait in the queue until an admin approves them.", nested: true },
  { name: "enableCommunity", title: "Enable community", description: "Open the discussion space where students and instructors post." },
  { name: "autoIssueCertificates", title: "Auto-issue certificates", description: "Send the certificate as soon as a student completes a course." },
];

/** Reviews (+ moderation, disabled while reviews are off), community and certificates. */
export function EngagementCard() {
  const { control, setValue, getValues } = useFormContext<LearningSettings>();
  const allowReviews = useWatch({ control, name: "allowReviews" });

  // Moderation can't stay on when reviews are switched off.
  useEffect(() => {
    if (!allowReviews && getValues("reviewModeration")) setValue("reviewModeration", false, { shouldDirty: true });
  }, [allowReviews, getValues, setValue]);

  return (
    <SettingsCard icon={<Sparkles className="h-5 w-5" />} title="Engagement" description="Reviews, community and rewards." tone="yellow">
      {TOGGLES.map((t) => {
        const disabled = t.name === "reviewModeration" && !allowReviews;
        return (
          <SettingsBlockRow key={t.name} className={t.nested ? "pl-6" : undefined}>
            <Controller
              control={control}
              name={t.name}
              render={({ field }) => (
                <SettingToggleRow id={`learning-${t.name}`} title={t.title} description={t.description} checked={field.value} onChange={field.onChange} disabled={disabled} />
              )}
            />
            <AnimatePresence initial={false}>
              {disabled && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.18 }}
                  className="ml-14 mt-1 overflow-hidden body-xsm-regular text-yellow"
                >
                  Turn on course reviews to use moderation.
                </motion.p>
              )}
            </AnimatePresence>
          </SettingsBlockRow>
        );
      })}
    </SettingsCard>
  );
}

export default EngagementCard;
