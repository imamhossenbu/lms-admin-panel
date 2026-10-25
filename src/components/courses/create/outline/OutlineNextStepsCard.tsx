import React from "react";
import { CheckCircle2 } from "lucide-react";

const NEXT_STEPS = [
  "Add this outline to your course and edit as needed",
  "Customize lesson content, resources and settings",
  "Set pricing and access options",
  "Review and publish your course",
];

/** "What's Next?" checklist. */
export function OutlineNextStepsCard() {
  return (
    <section className="rounded-xl border border-dash bg-white p-4">
      <h3 className="mb-3 title-medium text-primary-500">What&apos;s Next?</h3>
      <ul className="flex flex-col gap-2.5">
        {NEXT_STEPS.map((step) => (
          <li key={step} className="flex items-start gap-2.5">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green" />
            <span className="body-sm-regular text-primary-400">{step}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default OutlineNextStepsCard;
