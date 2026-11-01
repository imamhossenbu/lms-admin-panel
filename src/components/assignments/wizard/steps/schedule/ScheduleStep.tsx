"use client";

import React from "react";
import { CalendarDays } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import type { WizardStepProps } from "../../wizardTypes";
import { WizardLayout } from "../../shell/WizardLayout";
import { AssignmentPreviewCard } from "../../preview/AssignmentPreviewCard";
import { TipsCard } from "../../shell/TipsCard";
import { DateTimeField } from "./DateTimeField";
import { AvailabilityOptions } from "./AvailabilityOptions";
import { LateSubmissionBox } from "./LateSubmissionBox";
import { ShowInCalendarBox } from "./ShowInCalendarBox";
import { ScheduleSummaryCard } from "./ScheduleSummaryCard";

const TIPS = [
  "Set a realistic due date based on the assignment complexity.",
  "Give students enough time to complete the work.",
  "Consider allowing late submission with a penalty.",
  "Make the assignment visible in the course calendar.",
  "Communicate the schedule clearly in the instructions.",
];

/** Wizard step 6 — Schedule & Availability. */
export function ScheduleStep({ context, footer }: WizardStepProps) {
  return (
    <WizardLayout
      main={
        <IconSectionCard
          icon={<CalendarDays className="h-5 w-5" />}
          title="Schedule & Availability"
          description="Set the start date, due date and availability for this assignment."
          bodyClassName="mt-5 space-y-6"
        >
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <DateTimeField
              idPrefix="wizard-release"
              label="Release Date"
              required
              dateName="releaseDate"
              timeName="releaseTime"
              helper="When the assignment will be available to students."
            />
            <DateTimeField
              idPrefix="wizard-due"
              label="Due Date"
              required
              dateName="dueDate"
              timeName="dueTime"
              helper="Last date and time for students to submit the assignment."
            />
          </div>
          <AvailabilityOptions />
          <div className="space-y-4">
            <LateSubmissionBox />
            <ShowInCalendarBox />
          </div>
          {footer}
        </IconSectionCard>
      }
      side={
        <>
          <AssignmentPreviewCard context={context} badge="live" />
          <ScheduleSummaryCard />
          <TipsCard title="Tips for Scheduling Assignments" tips={TIPS} />
        </>
      }
    />
  );
}

export default ScheduleStep;
