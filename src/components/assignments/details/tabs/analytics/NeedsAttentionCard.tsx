"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { needsAttention } from "@/lib/assignmentStats";
import type { AssignmentSubmission } from "@/types/assignment";
import { formatDateTime } from "../../assignmentFormat";
import { CardHeaderButton } from "../../sidebar/CardHeaderButton";
import { StudentCell } from "./StudentCell";

/** "Needs Attention" — pending reviews (oldest first), then late submissions. */
export function NeedsAttentionCard({ submissions, onViewAll }: { submissions: AssignmentSubmission[]; onViewAll: () => void }) {
  const rows = needsAttention(submissions, 4);
  const columns: ColumnDef<AssignmentSubmission>[] = [
    { key: "rank", header: "#", width: "44px", align: "center", render: (_, i) => <span className="body-sm-regular text-primary-400">{i + 1}</span> },
    { key: "student", header: "Student", render: (s) => <StudentCell name={s.student.name} /> },
    {
      key: "issue",
      header: "Issue",
      render: (s) =>
        s.status === "PENDING" ? (
          <ToneBadge tone="orange" size="sm">
            Pending Review
          </ToneBadge>
        ) : (
          <ToneBadge tone="red" size="sm">
            Late
          </ToneBadge>
        ),
    },
    { key: "submitted", header: "Submitted On", render: (s) => <span className="whitespace-nowrap body-xsm-regular text-primary-400">{formatDateTime(s.submittedAt)}</span> },
  ];

  return (
    <IconSectionCard
      icon={<AlertTriangle className="h-5 w-5" />}
      tone="red"
      title="Needs Attention"
      action={<CardHeaderButton onClick={onViewAll}>View All</CardHeaderButton>}
      bodyClassName="mt-4"
    >
      <DataTable columns={columns} data={rows} minWidth="min-w-110" emptyMessage="Nothing needs attention — every submission is graded on time." />
    </IconSectionCard>
  );
}

export default NeedsAttentionCard;
