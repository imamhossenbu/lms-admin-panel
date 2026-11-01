import React from "react";
import { TrendingDown } from "lucide-react";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { cn } from "@/lib/cn";
import { CorrectRatePill } from "./CorrectRatePill";
import type { QuestionPerf } from "./questionsTabStats";

export interface HardestQuestionsCardProps {
  items: QuestionPerf[];
}

const BAR: Record<string, string> = { green: "bg-green", yellow: "bg-yellow", red: "bg-red" };

/** Right column: the 3 questions with the lowest correct rate. */
export function HardestQuestionsCard({ items }: HardestQuestionsCardProps) {
  return (
    <IconSectionCard
      icon={<TrendingDown className="h-5 w-5" />}
      tone="red"
      title="Hardest Questions"
      description="Lowest correct rate across attempts."
      bodyClassName="mt-4"
    >
      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-dash px-3 py-4 text-center body-xsm-regular text-primary-300">
          No attempts yet — this fills in once students take the quiz.
        </p>
      ) : (
        <ol className="space-y-3">
          {items.map((q) => {
            const tone = q.correctPct >= 80 ? "green" : q.correctPct >= 60 ? "yellow" : "red";
            return (
              <li key={q.questionId} className="rounded-lg border border-dash p-3">
                <div className="flex items-start gap-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-bg body-xsm-medium text-primary-500">
                    {q.index}
                  </span>
                  <p className="min-w-0 flex-1 line-clamp-2 body-xsm-medium text-primary-500">{q.text || "Untitled question"}</p>
                  <CorrectRatePill pct={q.correctPct} answered={q.answered} />
                </div>
                <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-gray-bg">
                  <div className={cn("h-full rounded-full", BAR[tone])} style={{ width: `${q.correctPct}%` }} />
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </IconSectionCard>
  );
}

export default HardestQuestionsCard;
