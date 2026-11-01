"use client";

import React from "react";
import { Trophy } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { topPerformers } from "@/lib/assignmentStats";
import type { AssignmentSubmission } from "@/types/assignment";
import { formatDateTime } from "../../assignmentFormat";
import { CardHeaderButton } from "../../sidebar/CardHeaderButton";
import { StudentCell } from "./StudentCell";

export interface TopPerformersCardProps {
  submissions: AssignmentSubmission[];
  totalPoints: number;
  onViewAll: () => void;
}

/** "Top Performing Students" — highest graded scores. */
export function TopPerformersCard({ submissions, totalPoints, onViewAll }: TopPerformersCardProps) {
  const rows = topPerformers(submissions, 3);
  const columns: ColumnDef<AssignmentSubmission>[] = [
    { key: "rank", header: "#", width: "44px", align: "center", render: (_, i) => <span className="body-sm-regular text-primary-400">{i + 1}</span> },
    { key: "student", header: "Student", render: (s) => <StudentCell name={s.student.name} /> },
    {
      key: "score",
      header: "Score",
      render: (s) => (
        <ToneBadge tone="green" size="sm">
          {s.score} / {totalPoints}
        </ToneBadge>
      ),
    },
    { key: "submitted", header: "Submitted On", render: (s) => <span className="whitespace-nowrap body-xsm-regular text-primary-400">{formatDateTime(s.submittedAt)}</span> },
  ];

  return (
    <IconSectionCard
      icon={<Trophy className="h-5 w-5" />}
      tone="yellow"
      title="Top Performing Students"
      action={<CardHeaderButton onClick={onViewAll}>View All</CardHeaderButton>}
      bodyClassName="mt-4"
    >
      <DataTable columns={columns} data={rows} minWidth="min-w-110" emptyMessage="No graded submissions yet." />
    </IconSectionCard>
  );
}

export default TopPerformersCard;
