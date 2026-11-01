import React from "react";
import { ClipboardList } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { ToneBadge } from "@/components/ui/ToneBadge";
import {
  QUESTION_KIND_LABEL,
  QUESTION_KIND_TONE,
  QuestionKindIcon,
} from "@/components/quizzes/wizard/steps/questions/questionKinds";
import type { questionSummary } from "./questionsTabStats";

export interface QuestionSummaryCardProps {
  summary: ReturnType<typeof questionSummary>;
}

/** Right column: question count by type, total marks, average points. */
export function QuestionSummaryCard({ summary }: QuestionSummaryCardProps) {
  return (
    <IconSectionCard icon={<ClipboardList className="h-5 w-5" />} tone="orange" title="Question Summary" bodyClassName="mt-4">
      <ul className="divide-y divide-dash">
        {summary.byKind.map(({ kind, count }) => (
          <li key={kind} className="flex items-center gap-2.5 py-2.5">
            <span className="text-primary-300">
              <QuestionKindIcon kind={kind} />
            </span>
            <span className="min-w-0 flex-1 truncate body-sm-regular text-primary-400">{QUESTION_KIND_LABEL[kind]}</span>
            <ToneBadge tone={count ? QUESTION_KIND_TONE[kind] : "gray"} size="sm" variant="pill">
              {count}
            </ToneBadge>
          </li>
        ))}
      </ul>
      <dl className="mt-3 grid grid-cols-3 gap-2 rounded-xl border border-dash bg-gray-bg p-3 text-center">
        {[
          { label: "Questions", value: summary.count },
          { label: "Total Marks", value: summary.totalMarks },
          { label: "Avg Points", value: summary.avgPoints },
        ].map((s) => (
          <div key={s.label} className="min-w-0">
            <dd className="body-l-medium font-semibold! text-primary-500 tabular-nums">{s.value}</dd>
            <dt className="mt-0.5 truncate body-2xsm-regular text-primary-300">{s.label}</dt>
          </div>
        ))}
      </dl>
    </IconSectionCard>
  );
}

export default QuestionSummaryCard;
