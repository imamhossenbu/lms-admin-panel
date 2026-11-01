"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { BrainCircuit, Eye, Gauge, ListChecks, Target, Trophy, UserCog } from "lucide-react";
import { WizardSideCard } from "../../shell/WizardSideCard";
import { ToneBadge } from "@/components/ui/ToneBadge";
import type { AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import { SummaryRow } from "../submission/kit/SummaryRow";
import { GRADE_DISPLAY_LABEL, GRADING_METHOD_LABEL, passingScoreLabel } from "./gradingLabels";

/** Live key/value summary of the grading settings. */
export function GradingSummaryCard() {
  const { control } = useFormContext<AssignmentWizardValues>();
  const [total, method, passing, display, ai, override] = useWatch({
    control,
    name: ["totalPoints", "gradingType", "passingScore", "gradeDisplay", "aiGradingEnabled", "manualOverride"],
  });

  return (
    <WizardSideCard icon={<Target className="h-5 w-5" />} title="Grading Summary">
      <SummaryRow icon={<Trophy className="h-4 w-4" />} label="Total Points">
        {Number.isFinite(total) ? total : "—"}
      </SummaryRow>
      <SummaryRow icon={<ListChecks className="h-4 w-4" />} label="Grading Method">
        {GRADING_METHOD_LABEL[method]}
      </SummaryRow>
      <SummaryRow icon={<Gauge className="h-4 w-4" />} label="Passing Score">
        {passingScoreLabel(passing, total)}
      </SummaryRow>
      <SummaryRow icon={<Eye className="h-4 w-4" />} label="Grade Display">
        {GRADE_DISPLAY_LABEL[display]}
      </SummaryRow>
      <SummaryRow icon={<BrainCircuit className="h-4 w-4" />} label="AI Assisted Grading">
        <ToneBadge tone={ai ? "green" : "gray"} size="sm">
          {ai ? "Enabled" : "Disabled"}
        </ToneBadge>
      </SummaryRow>
      <SummaryRow icon={<UserCog className="h-4 w-4" />} label="Manual Override">
        <ToneBadge tone={override ? "green" : "gray"} size="sm">
          {override ? "Allowed" : "Not allowed"}
        </ToneBadge>
      </SummaryRow>
    </WizardSideCard>
  );
}

export default GradingSummaryCard;
