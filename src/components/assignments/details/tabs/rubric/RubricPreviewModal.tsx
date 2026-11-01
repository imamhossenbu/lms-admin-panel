"use client";

import React from "react";
import { ModalShell } from "@/components/ui/ModalShell";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { SecondaryButton } from "@/components/ui/secondary-button";
import type { RubricCriterion, RubricLevelTone } from "@/types/assignment";
import type { RubricFormValues } from "@/validations/assignmentSchema";
import { LEVEL_STYLE, LEVEL_TONE_ORDER } from "./rubricUtils";

const TONE_HEADER: Record<RubricLevelTone, string> = { EXCELLENT: "Excellent", GOOD: "Good", NEEDS_IMPROVEMENT: "Needs Improvement" };

export interface RubricPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  rubric: RubricFormValues;
}

/** How the rubric looks to a student: criteria × performance-level grid. */
export function RubricPreviewModal({ isOpen, onClose, rubric }: RubricPreviewModalProps) {
  const columns: ColumnDef<RubricCriterion>[] = [
    {
      key: "criterion",
      header: "Criterion",
      width: "22%",
      render: (c) => (
        <div>
          <p className="body-sm-medium font-semibold! text-primary-500">{c.title}</p>
          {c.description && <p className="mt-0.5 body-xsm-regular text-primary-400">{c.description}</p>}
          <p className="body-xsm-regular text-primary-300">{c.points} points</p>
        </div>
      ),
    },
    ...LEVEL_TONE_ORDER.map<ColumnDef<RubricCriterion>>((tone) => ({
      key: tone,
      header: TONE_HEADER[tone],
      render: (c) => {
        const level = c.levels.find((l) => l.tone === tone);
        if (!level) return <span className="body-xsm-regular text-primary-300">—</span>;
        return (
          <div className="space-y-1.5">
            <ToneBadge tone={LEVEL_STYLE[tone].badge} size="sm">
              {level.label} ({level.points} pts)
            </ToneBadge>
            <p className="body-xsm-regular text-primary-400">{level.description}</p>
          </div>
        );
      },
    })),
  ];

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Rubric Preview (Student View)"
      subtitle="This is how students see the rubric when they open the assignment."
      maxWidth="xl"
      footer={<SecondaryButton onClick={onClose}>Close</SecondaryButton>}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="body-l-medium font-semibold! text-primary-500">{rubric.title || "Untitled Rubric"}</h3>
            {rubric.description && <p className="mt-1 body-sm-regular text-primary-400">{rubric.description}</p>}
          </div>
          <ToneBadge tone="blue">Total {rubric.totalPoints} Points</ToneBadge>
        </div>
        {!rubric.visibleToStudents && (
          <p className="rounded-xl bg-yellow-bg p-3 body-xsm-regular text-primary-400">
            This rubric is currently hidden from students. Turn on Student Visibility to show it.
          </p>
        )}
        <DataTable columns={columns} data={rubric.criteria} minWidth="min-w-180" emptyMessage="This rubric has no criteria yet." />
      </div>
    </ModalShell>
  );
}

export default RubricPreviewModal;
