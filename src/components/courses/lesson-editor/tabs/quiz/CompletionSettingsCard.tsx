"use client";

import React from "react";
import { BadgeCheck } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { ControlledToggleRow } from "../../shared/ControlledToggleRow";

/** Right "Completion Settings": quiz required for completion + show in lesson navigation. */
export function CompletionSettingsCard({ disabled }: { disabled?: boolean }) {
  return (
    <IconSectionCard icon={<BadgeCheck className="h-5 w-5" />} title="Completion Settings" description="How the quiz affects lesson completion." bodyClassName="space-y-5">
      <ControlledToggleRow
        name="quiz.requireToComplete"
        title="Require quiz to complete lesson"
        description="Students must pass this quiz to mark the lesson as complete."
        disabled={disabled}
      />
      <ControlledToggleRow
        name="quiz.showInNavigation"
        title="Show quiz in lesson navigation"
        description="Display quiz in the lesson sidebar."
        disabled={disabled}
      />
    </IconSectionCard>
  );
}

export default CompletionSettingsCard;
