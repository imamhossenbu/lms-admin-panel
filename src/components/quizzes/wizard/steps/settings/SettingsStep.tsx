"use client";

import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Rocket, Settings } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { ProTipCard } from "@/components/ui/ProTipCard";
import { quizTotalMarks, type QuizWizardValues } from "@/validations/quizWizardSchema";
import type { QuizStepProps } from "../../quizWizardTypes";
import { QuizStepLayout } from "../../shell/QuizStepLayout";
import { QuizBulletList, QuizInfoCard } from "../../shell/QuizInfoCard";
import { QuizSummaryCard } from "../../summary/QuizSummaryCard";
import { GeneralSettingsCard } from "./GeneralSettingsCard";
import { AttemptsCard } from "./AttemptsCard";
import { AvailabilityCard } from "./AvailabilityCard";
import { AccessControlCard } from "./AccessControlCard";

const TIPS = [
  "Set a reasonable time limit for better assessment.",
  "Use multiple attempts for practice quizzes.",
  "Enable explanations to help students learn.",
  "Set availability dates if needed.",
  "Use randomization to prevent cheating.",
  "Configure passing marks based on difficulty.",
];

/** Step 3 — Quiz Settings. */
export function SettingsStep({ mode, courses, footer }: QuizStepProps) {
  const { getValues, getFieldState, setValue } = useFormContext<QuizWizardValues>();

  // New quiz: suggest a 60% pass mark once questions exist (only while the default "1" is untouched).
  useEffect(() => {
    if (mode !== "create") return;
    const total = quizTotalMarks(getValues("questions") ?? []);
    if (total > 1 && getValues("passingMarks") === 1 && !getFieldState("passingMarks").isDirty) {
      setValue("passingMarks", Math.max(1, Math.ceil(total * 0.6)), { shouldDirty: true });
    }
  }, [mode, getValues, getFieldState, setValue]);

  return (
    <QuizStepLayout
      main={
        <IconSectionCard
          icon={<Settings className="h-5 w-5" />}
          title="Quiz Settings"
          description="Configure scoring, time limits, attempts and other advanced settings."
        >
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
            <div className="space-y-4 lg:col-span-3">
              <GeneralSettingsCard />
              <AvailabilityCard />
            </div>
            <div className="lg:col-span-2">
              <AttemptsCard />
            </div>
            <div className="lg:col-span-5">
              <AccessControlCard />
            </div>
          </div>
        </IconSectionCard>
      }
      side={
        <>
          <QuizSummaryCard courses={courses} />
          <ProTipCard title="Tips for Quiz Settings">
            <QuizBulletList items={TIPS} />
          </ProTipCard>
          <QuizInfoCard icon={<Rocket className="h-5 w-5" />} title="Ready to Publish?">
            Review all settings carefully before publishing. You can always edit them later.
          </QuizInfoCard>
        </>
      }
      footer={footer}
    />
  );
}

export default SettingsStep;
