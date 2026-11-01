"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { BarChart3, Clock, Trophy } from "lucide-react";
import type { AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import { WIZARD_DIFFICULTY_LABEL, WIZARD_TYPE_ICON, WIZARD_TYPE_LABEL, estimatedTimeLabel } from "../wizardFormat";
import { PreviewChip } from "./PreviewChip";

/** Type / (points) / difficulty / estimated time chips, read live from the form. */
export function PreviewChips({ showPoints = false }: { showPoints?: boolean }) {
  const { control } = useFormContext<AssignmentWizardValues>();
  const [type, difficulty, estimatedTime, estimatedUnit, totalPoints] = useWatch({
    control,
    name: ["type", "difficulty", "estimatedTime", "estimatedUnit", "totalPoints"],
  });
  const time = estimatedTimeLabel(Number(estimatedTime), estimatedUnit);

  return (
    <div className="flex flex-wrap gap-2">
      {type && <PreviewChip icon={WIZARD_TYPE_ICON[type]}>{WIZARD_TYPE_LABEL[type]}</PreviewChip>}
      {showPoints && Number(totalPoints) > 0 && <PreviewChip icon={Trophy}>{totalPoints} Points</PreviewChip>}
      {difficulty && <PreviewChip icon={BarChart3}>{WIZARD_DIFFICULTY_LABEL[difficulty]}</PreviewChip>}
      {time && <PreviewChip icon={Clock}>{time}</PreviewChip>}
    </div>
  );
}

export default PreviewChips;
