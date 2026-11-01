import React from "react";
import type { AssignmentRubric, RubricLevelTone } from "@/types/assignment";
import { ToneBadge, type Tone } from "@/components/ui/ToneBadge";

const LEVEL_TONE: Record<RubricLevelTone, Tone> = { EXCELLENT: "green", GOOD: "blue", NEEDS_IMPROVEMENT: "orange" };

/** Read-only rubric as students see it: each criterion with its levels. */
export function PreviewRubric({ rubric }: { rubric: AssignmentRubric }) {
  return (
    <div className="space-y-3">
      {rubric.description && <p className="body-sm-regular text-primary-400">{rubric.description}</p>}
      {rubric.criteria.map((c) => (
        <div key={c.id} className="rounded-xl border border-dash">
          <div className="flex items-center justify-between gap-3 border-b border-dash bg-gray-bg px-4 py-2.5">
            <span className="body-sm-medium font-semibold! text-primary-500">{c.title}</span>
            <ToneBadge tone="navy" size="sm">
              {c.points} pts
            </ToneBadge>
          </div>
          <ul className="divide-y divide-dash">
            {c.levels.map((l) => (
              <li key={l.id} className="flex items-start gap-3 px-4 py-2.5">
                <ToneBadge tone={LEVEL_TONE[l.tone]} size="sm">
                  {l.label} · {l.points}
                </ToneBadge>
                <span className="body-sm-regular text-primary-400">{l.description}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default PreviewRubric;
