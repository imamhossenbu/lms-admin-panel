"use client";

import React from "react";
import { Lightbulb } from "lucide-react";
import { AiRobotIllustration } from "./AiRobotIllustration";
import { AiProgressSteps, type AiProgressStep } from "./AiProgressSteps";
import { AiInfoNote } from "./AiInfoNote";

export const AI_GENERATION_STEPS: AiProgressStep[] = [
  { title: "Analyzing topic", description: "Understanding your course topic and goals" },
  { title: "Planning modules", description: "Creating module structure" },
  { title: "Generating lessons", description: "Writing lesson titles and descriptions" },
  { title: "Organizing curriculum", description: "Finalizing the complete outline" },
];

export interface AiGenerationProgressProps {
  /** Number of completed steps (0 – AI_GENERATION_STEPS.length). */
  completed: number;
}

/** "Creating your course outline…" state shown while the AI request is in flight. */
export function AiGenerationProgress({ completed }: AiGenerationProgressProps) {
  return (
    <div className="flex flex-col items-center px-2 py-2 text-center sm:px-6" aria-live="polite" aria-busy="true">
      <AiRobotIllustration size="lg" />
      <h3 className="mt-6 heading-h3 font-bold text-primary-500">Creating your course outline...</h3>
      <p className="mt-3 max-w-2xl body-l-medium font-normal text-primary-400">
        Our AI is analyzing your input and generating a complete curriculum with modules, lessons and learning
        activities.
      </p>

      <div className="mt-12 w-full">
        <AiProgressSteps steps={AI_GENERATION_STEPS} completed={completed} />
      </div>

      <AiInfoNote size="md" title="Did you know?" icon={<Lightbulb className="h-7 w-7" />} className="mt-12 w-full text-left">
        You can always edit, add or remove any module or lesson after the outline is generated. The AI gives you a
        starting point, and you have full control to customize it.
      </AiInfoNote>
    </div>
  );
}

export default AiGenerationProgress;
