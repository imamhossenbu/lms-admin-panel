"use client";

import React from "react";
import { BarChart3 } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import type { WizardStepProps } from "../../wizardTypes";
import { WizardLayout } from "../../shell/WizardLayout";
import { AssignmentPreviewCard } from "../../preview/AssignmentPreviewCard";
import { TipsCard } from "../../shell/TipsCard";
import { TotalPointsField } from "./TotalPointsField";
import { GradingMethodField } from "./GradingMethodField";
import { PassingScoreField } from "./PassingScoreField";
import { GradeDisplayField } from "./GradeDisplayField";
import { AiGradingBox } from "./AiGradingBox";
import { ManualOverrideBox } from "./ManualOverrideBox";
import { GradingSummaryCard } from "./GradingSummaryCard";

const TIPS = [
  "Choose an appropriate total points based on assignment complexity.",
  "Set a realistic passing score (e.g. 70-80%).",
  "Use AI grading to save time, but always review important submissions.",
  "Clear grading criteria helps students understand expectations.",
  "You can further define detailed criteria in the next step (Rubric).",
];

/** Wizard step 4 — Grading & Points. */
export function GradingStep({ context, footer }: WizardStepProps) {
  return (
    <WizardLayout
      main={
        <IconSectionCard
          icon={<BarChart3 className="h-5 w-5" />}
          title="Grading & Points"
          description="Set the total points and grading method for this assignment."
          bodyClassName="mt-5 space-y-6"
        >
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <TotalPointsField />
            <div className="min-w-0 lg:col-span-2">
              <GradingMethodField />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
            <div className="min-w-0 lg:col-span-2">
              <PassingScoreField />
            </div>
            <div className="min-w-0 lg:col-span-3">
              <GradeDisplayField />
            </div>
          </div>
          <div className="space-y-4">
            <AiGradingBox />
            <ManualOverrideBox />
          </div>
          {footer}
        </IconSectionCard>
      }
      side={
        <>
          <AssignmentPreviewCard context={context} badge="live" />
          <GradingSummaryCard />
          <TipsCard title="Tips for Grading & Points" tips={TIPS} />
        </>
      }
    />
  );
}

export default GradingStep;
