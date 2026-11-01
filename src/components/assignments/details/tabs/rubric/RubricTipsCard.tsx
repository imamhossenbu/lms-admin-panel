import React from "react";
import { ProTipCard } from "@/components/ui/ProTipCard";

const TIPS = [
  "Use clear and specific criteria",
  "Define performance levels with examples",
  "Keep the language simple and student-friendly",
  "Make sure total points match the assignment",
];

/** "Tips for a Good Rubric" hint box. */
export function RubricTipsCard() {
  return (
    <ProTipCard title="Tips for a Good Rubric">
      <ul className="list-disc space-y-1.5 pl-4">
        {TIPS.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </ProTipCard>
  );
}

export default RubricTipsCard;
