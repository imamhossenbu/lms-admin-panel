import React from "react";
import { ProTipCard } from "@/components/ui/ProTipCard";

const TIPS = [
  "Use clear and concise language.",
  "Avoid ambiguous questions.",
  "Make sure only one answer is correct (unless it's Multiple Select).",
  "Use relevant and practical examples.",
  "Add an explanation for better learning.",
];

/** "Tips for Good Questions" hint box. */
export function QuestionTipsCard() {
  return (
    <ProTipCard title="Tips for Good Questions">
      <ul className="mt-1 list-disc space-y-1 pl-4">
        {TIPS.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>
    </ProTipCard>
  );
}

export default QuestionTipsCard;
