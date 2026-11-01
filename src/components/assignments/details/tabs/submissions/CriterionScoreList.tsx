import React from "react";
import type { RubricCriterion } from "@/types/assignment";
import { cn } from "@/lib/cn";

export interface CriterionScoreListProps {
  criteria: RubricCriterion[];
  scores: Record<string, number>;
}

/** Read-only "criterion — awarded / max" bars. */
export function CriterionScoreList({ criteria, scores }: CriterionScoreListProps) {
  return (
    <ul className="space-y-3">
      {criteria.map((c) => {
        const awarded = scores[c.id];
        const pct = typeof awarded === "number" && c.points ? Math.round((awarded / c.points) * 100) : 0;
        return (
          <li key={c.id} className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 body-sm-regular">
              <span className="text-primary-400">{c.title}</span>
              <span className="body-sm-medium text-primary-500">{typeof awarded === "number" ? `${awarded} / ${c.points}` : "-"}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-gray-bg">
              <div className={cn("h-full rounded-full", pct >= 80 ? "bg-green" : pct >= 60 ? "bg-blue" : "bg-brand-orange")} style={{ width: `${pct}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default CriterionScoreList;
