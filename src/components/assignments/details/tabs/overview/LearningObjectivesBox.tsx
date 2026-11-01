import React from "react";
import { Target } from "lucide-react";

/** Tinted "Learning Objectives" box inside the description card. */
export function LearningObjectivesBox({ objectives }: { objectives: string[] }) {
  return (
    <div className="rounded-xl border border-dash bg-gray-bg p-4">
      <h4 className="flex items-center gap-2 body-sm-medium font-semibold! text-primary-500">
        <Target className="h-4.5 w-4.5 text-blue" />
        Learning Objectives
      </h4>
      <ul className="mt-2.5 list-disc space-y-1.5 pl-9 body-sm-regular text-primary-400">
        {objectives.map((o, i) => (
          <li key={i}>{o}</li>
        ))}
      </ul>
    </div>
  );
}

export default LearningObjectivesBox;
