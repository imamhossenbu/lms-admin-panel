"use client";

import React from "react";
import { Send } from "lucide-react";

const DEFAULT_STEPS = [
  "A secure password will be generated automatically.",
  "The instructor will receive an email with login details.",
  "The instructor will be assigned to the selected courses.",
  "You can manage this instructor anytime from the instructor list.",
];

interface InstructorNextStepsCardProps {
  steps?: string[];
}

export function InstructorNextStepsCard({ steps = DEFAULT_STEPS }: InstructorNextStepsCardProps) {
  return (
    <div className="bg-blue-14 rounded-xl border border-blue/20 p-6 space-y-4 text-left">
      <div className="flex items-center gap-3">
        <Send className="w-5 h-5 text-blue shrink-0" />
        <h2 className="title-medium font-bold text-primary-500">What happens next?</h2>
      </div>

      <ol className="space-y-3.5">
        {steps.map((text, idx) => (
          <li key={text} className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-white text-primary-500 body-xsm-medium font-bold flex items-center justify-center shrink-0 border border-dash">
              {idx + 1}
            </span>
            <p className="body-sm-regular text-primary-400 leading-snug pt-0.5">{text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default InstructorNextStepsCard;
