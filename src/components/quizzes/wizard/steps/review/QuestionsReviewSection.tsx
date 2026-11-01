"use client";

import React from "react";
import { ListChecks } from "lucide-react";
import { DataTable, type ColumnDef } from "@/components/ui/Datatable";
import { ToneBadge } from "@/components/ui/ToneBadge";
import type { QuizQuestionValues } from "@/validations/quizWizardSchema";
import { QUIZ_KIND_VIEW, quizPlainText } from "../../quizWizardFormat";
import { ReviewSection } from "./ReviewSection";

interface Row {
  id: string;
  index: number;
  text: string;
  kind: QuizQuestionValues["kind"];
  points: number;
}

export interface QuestionsReviewSectionProps {
  questions: QuizQuestionValues[];
  hasIssues: boolean;
  onEdit: () => void;
}

/** Compact table of every question: #, text, type badge, points. */
export function QuestionsReviewSection({ questions, hasIssues, onEdit }: QuestionsReviewSectionProps) {
  const rows: Row[] = questions.map((q, i) => ({ id: q.id, index: i + 1, text: quizPlainText(q.questionHtml), kind: q.kind, points: q.points }));
  const columns: ColumnDef<Row>[] = [
    { key: "index", header: "#", width: "48px", align: "center", render: (r) => <span className="body-sm-regular text-primary-400">{r.index}</span> },
    {
      key: "question",
      header: "Question",
      render: (r) => (
        <p className="truncate body-sm-regular text-primary-500" title={r.text}>
          {r.text || <span className="text-red">Question text missing</span>}
        </p>
      ),
    },
    {
      key: "type",
      header: "Type",
      width: "150px",
      render: (r) => (
        <ToneBadge tone={QUIZ_KIND_VIEW[r.kind].tone} size="sm">
          {QUIZ_KIND_VIEW[r.kind].label}
        </ToneBadge>
      ),
    },
    { key: "points", header: "Points", width: "80px", align: "center", render: (r) => <span className="body-sm-medium text-primary-500 tabular-nums">{r.points}</span> },
  ];

  return (
    <ReviewSection icon={<ListChecks className="h-5 w-5" />} title={`Questions (${questions.length})`} hasIssues={hasIssues} onEdit={onEdit}>
      <DataTable
        columns={columns}
        data={rows}
        rowKey={(r) => r.id}
        verticalBorders
        tableClassName="table-fixed"
        headerClassName="bg-slate-50 border-b border-dash"
        thClassName="px-3 py-2.5 body-xsm-medium text-primary-400 font-semibold! normal-case whitespace-nowrap"
        cellClassName="px-3 py-2.5"
        emptyMessage={<p className="py-6 text-center body-sm-regular text-red">No questions added yet. Add at least one question.</p>}
      />
    </ReviewSection>
  );
}

export default QuestionsReviewSection;
