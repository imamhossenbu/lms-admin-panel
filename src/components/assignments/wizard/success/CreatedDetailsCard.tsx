"use client";

import React from "react";
import { BookOpen, CalendarClock, CalendarDays, Clock4, FileText, FolderOpen, RotateCcw, Target, Trophy, type LucideIcon } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";
import type { AssignmentItem } from "@/types/assignment";
import { lateSubmissionSummary } from "@/lib/assignmentWizardMapping";
import { attemptsLabel } from "@/components/assignments/details/assignmentFormat";
import { WizardSideCard } from "../shell/WizardSideCard";
import { WIZARD_TYPE_LABEL, formatDateAt, passingScoreLabel, plainText } from "../wizardFormat";

export interface CreatedDetailsCardProps {
  assignment: AssignmentItem;
  courseTitle: string;
  moduleLabel: string;
}

/** Right-column "Assignment Details": status, title, meta, description and key settings. */
export function CreatedDetailsCard({ assignment: a, courseTitle, moduleLabel }: CreatedDetailsCardProps) {
  const published = a.status === "PUBLISHED";
  const rows: [LucideIcon, string, string][] = [
    [FileText, "Assignment Type", WIZARD_TYPE_LABEL[a.type]],
    [Trophy, "Total Points", String(a.totalPoints)],
    [Target, "Passing Score", passingScoreLabel(a.passingScore, a.totalPoints)],
    [CalendarDays, "Release Date", formatDateAt(a.releaseDate, a.releaseTime)],
    [CalendarClock, "Due Date", formatDateAt(a.dueDate, a.dueTime)],
    [Clock4, "Late Submission", lateSubmissionSummary(a)],
    [RotateCcw, "Attempts", a.attempts === "UNLIMITED" ? "Unlimited" : attemptsLabel(a.attempts)],
  ];

  return (
    <WizardSideCard
      icon={<FileText className="h-5 w-5" />}
      title="Assignment Details"
      action={
        <ToneBadge tone={published ? "green" : "gray"} dot>
          {published ? "Published" : "Draft"}
        </ToneBadge>
      }
    >
      <div className="rounded-xl border border-dash p-4">
        <h4 className="heading-h6 font-bold! text-primary-500 break-words">{a.title}</h4>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 body-xsm-regular text-primary-300">
          <span className="inline-flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            {courseTitle}
          </span>
          {moduleLabel && (
            <>
              <span aria-hidden>•</span>
              <span className="inline-flex items-center gap-1">
                <FolderOpen className="h-3.5 w-3.5" />
                {moduleLabel}
              </span>
            </>
          )}
        </p>
        <p className="mt-3 line-clamp-4 body-xsm-regular text-primary-400">{plainText(a.descriptionHtml)}</p>
        <dl className="mt-4 divide-y divide-dash border-t border-dash">
          {rows.map(([Icon, label, value]) => (
            <div key={label} className="flex items-center gap-2.5 py-2.5">
              <Icon className="h-4 w-4 shrink-0 text-primary-300" />
              <dt className="flex-1 body-xsm-regular text-primary-300">{label}</dt>
              <dd className="text-right body-xsm-medium text-primary-500">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </WizardSideCard>
  );
}

export default CreatedDetailsCard;
