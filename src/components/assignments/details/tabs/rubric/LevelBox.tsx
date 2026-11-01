import React from "react";
import { AlertCircle, CheckCircle2, CircleCheck } from "lucide-react";
import type { RubricLevel } from "@/types/assignment";
import { cn } from "@/lib/cn";
import { LEVEL_STYLE } from "./rubricUtils";

const ICON = {
  EXCELLENT: CheckCircle2,
  GOOD: CircleCheck,
  NEEDS_IMPROVEMENT: AlertCircle,
} as const;

/** One performance-level box: "Excellent (8 pts)" header + description. */
export function LevelBox({ level, className }: { level: RubricLevel; className?: string }) {
  const style = LEVEL_STYLE[level.tone];
  const Icon = ICON[level.tone];
  return (
    <div className={cn("min-w-0 overflow-hidden rounded-lg border bg-white", style.border, className)}>
      <div className={cn("flex items-center gap-1.5 px-2.5 py-1.5", style.bg)}>
        <Icon className={cn("h-3.5 w-3.5 shrink-0", style.text)} />
        <span className={cn("truncate body-xsm-medium font-semibold!", style.text)}>
          {level.label} ({level.points} pts)
        </span>
      </div>
      <p className="px-2.5 py-2 body-xsm-regular text-primary-400">{level.description || "No description yet."}</p>
    </div>
  );
}

export default LevelBox;
