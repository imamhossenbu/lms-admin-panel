"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { ClipboardCheck } from "lucide-react";
import type { LearningSettings } from "@/validations/platformSettingsSchema";
import { SettingsCard } from "../../shared/SettingsCard";
import { SettingsRow } from "../../shared/SettingsRow";
import { UnitNumberInput } from "./UnitNumberInput";

const isNum = (n: unknown): n is number => typeof n === "number" && Number.isFinite(n);

/** Default passing score and late submission penalty (both %). */
export function AssessmentsCard() {
  const {
    control,
    formState: { errors },
  } = useFormContext<LearningSettings>();
  const [pass, penalty] = useWatch({ control, name: ["defaultPassingScore", "lateSubmissionPenalty"] });

  return (
    <SettingsCard icon={<ClipboardCheck className="h-5 w-5" />} title="Assessments" description="Defaults for new quizzes and assignments — instructors can override them." tone="purple">
      <SettingsRow label="Default passing score" description="Minimum score to pass a quiz or assignment." htmlFor="learning-passing-score" required>
        <UnitNumberInput id="learning-passing-score" name="defaultPassingScore" unit="%" min={0} max={100} placeholder="70" error={errors.defaultPassingScore?.message} />
        {!errors.defaultPassingScore && isNum(pass) && (
          <p className="mt-1.5 body-xsm-regular text-primary-300">
            A score of {pass}/100 or higher passes.
          </p>
        )}
      </SettingsRow>

      <SettingsRow label="Late submission penalty" description="Deducted from assignments submitted after the due date." htmlFor="learning-late-penalty" required>
        <UnitNumberInput id="learning-late-penalty" name="lateSubmissionPenalty" unit="%" min={0} max={100} placeholder="10" error={errors.lateSubmissionPenalty?.message} />
        {!errors.lateSubmissionPenalty && isNum(penalty) && (
          <p className="mt-1.5 body-xsm-regular text-primary-300">
            {penalty === 0 ? "Late work is graded normally." : `A late 80/100 becomes ${Math.max(0, Math.round(80 * (1 - penalty / 100)))}/100.`}
          </p>
        )}
      </SettingsRow>
    </SettingsCard>
  );
}

export default AssessmentsCard;
