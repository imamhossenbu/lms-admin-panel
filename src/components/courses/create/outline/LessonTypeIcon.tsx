import React from "react";
import { ClipboardList, Code2, FileText, HelpCircle, PlayCircle, Radio, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import type { AiLessonType } from "../aiOutline";

export interface LessonTypeStyle {
  icon: LucideIcon;
  /** Tile background + icon color (globals.css tokens). */
  tileClassName: string;
  /** Plural label used in summaries ("Video Lessons", "Quizzes"...). */
  pluralLabel: string;
}

/** Reusable visual map for outline / curriculum lesson types. */
export const LESSON_TYPE_STYLE: Record<AiLessonType, LessonTypeStyle> = {
  VIDEO: { icon: PlayCircle, tileClassName: "bg-blue-14 text-blue", pluralLabel: "Video Lessons" },
  TEXT: { icon: FileText, tileClassName: "bg-blue-14 text-blue", pluralLabel: "Text Lessons" },
  CODING: { icon: Code2, tileClassName: "bg-blue-14 text-blue", pluralLabel: "Coding Lessons" },
  QUIZ: { icon: HelpCircle, tileClassName: "bg-purple-14 text-purple", pluralLabel: "Quizzes" },
  ASSIGNMENT: { icon: ClipboardList, tileClassName: "bg-yellow-bg text-yellow", pluralLabel: "Assignments" },
  LIVE: { icon: Radio, tileClassName: "bg-green-bg text-green", pluralLabel: "Live Classes" },
};

export interface LessonTypeIconProps {
  type: AiLessonType;
  size?: "sm" | "md";
  className?: string;
}

export function LessonTypeIcon({ type, size = "md", className }: LessonTypeIconProps) {
  const { icon: Icon, tileClassName } = LESSON_TYPE_STYLE[type];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-lg",
        size === "sm" ? "h-7 w-7" : "h-8 w-8",
        tileClassName,
        className
      )}
      aria-hidden="true"
    >
      <Icon className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />
    </span>
  );
}

export default LessonTypeIcon;
