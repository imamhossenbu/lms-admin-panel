"use client";

import React from "react";
import { Send } from "lucide-react";

export function StudentNextStepsCard() {
  const steps = [
    "A secure password will be generated automatically.",
    "The student will receive an email with login details.",
    "The student will be enrolled in the selected courses.",
    "You can manage this student anytime from the student list.",
  ];

  return (
    <div className="bg-white rounded-xl border border-dash p-6 space-y-4 shadow-2xs text-left">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-14 text-blue flex items-center justify-center shrink-0">
          <Send className="w-5 h-5" />
        </div>
        <h2 className="title-medium font-bold text-primary-500">
          What happens next?
        </h2>
      </div>

      {/* Steps List */}
      <div className="space-y-3.5 pt-1">
        {steps.map((text, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-blue-14 text-blue font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-blue/30">
              {idx + 1}
            </div>
            <p className="body-sm-regular text-primary-400 leading-snug">
              {text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
