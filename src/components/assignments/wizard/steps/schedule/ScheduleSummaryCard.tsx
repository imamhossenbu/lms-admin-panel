"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { AlarmClock, CalendarCheck, CalendarDays, CalendarClock, Clock } from "lucide-react";
import { WizardSideCard } from "../../shell/WizardSideCard";
import { lateSubmissionSummary } from "@/lib/assignmentWizardMapping";
import type { AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import { SummaryRow } from "../submission/kit/SummaryRow";
import { availabilityLabel, formatDateTime12 } from "./scheduleFormat";

/** Live "Schedule Summary" sidebar card. */
export function ScheduleSummaryCard() {
  const { control } = useFormContext<AssignmentWizardValues>();
  const [releaseDate, releaseTime, dueDate, dueTime, availability, timeLimitMinutes, windowStartDate, windowEndDate, lateSubmission, latePenalty, latePenaltyUnit, showInCalendar] =
    useWatch({
      control,
      name: ["releaseDate", "releaseTime", "dueDate", "dueTime", "availability", "timeLimitMinutes", "windowStartDate", "windowEndDate", "lateSubmission", "latePenalty", "latePenaltyUnit", "showInCalendar"],
    });

  return (
    <WizardSideCard icon={<CalendarDays className="h-5 w-5" />} title="Schedule Summary">
      <SummaryRow icon={<CalendarDays className="h-4 w-4" />} label="Release Date">
        {formatDateTime12(releaseDate, releaseTime)}
      </SummaryRow>
      <SummaryRow icon={<CalendarClock className="h-4 w-4" />} label="Due Date">
        {formatDateTime12(dueDate, dueTime)}
      </SummaryRow>
      <SummaryRow icon={<Clock className="h-4 w-4" />} label="Availability">
        {availabilityLabel({ availability, timeLimitMinutes, windowStartDate, windowEndDate })}
      </SummaryRow>
      <SummaryRow icon={<AlarmClock className="h-4 w-4" />} label="Late Submission">
        {lateSubmissionSummary({ lateSubmission, latePenalty, latePenaltyUnit })}
      </SummaryRow>
      <SummaryRow icon={<CalendarCheck className="h-4 w-4" />} label="Calendar Visibility">
        {showInCalendar ? "Enabled" : "Hidden"}
      </SummaryRow>
    </WizardSideCard>
  );
}

export default ScheduleSummaryCard;
