import React from "react";
import { cn } from "@/lib/cn";
import { LessonTypeIcon } from "@/components/courses/create/outline/LessonTypeIcon";
import type { LessonOption } from "./lessonOptions";

export interface LessonRowProps {
  lesson: LessonOption;
  /** Right-side slot (remove button, badge …). */
  trailing?: React.ReactNode;
  className?: string;
}

/** Lesson type icon + "N. Title" + "Module X: Title". */
export function LessonRow({ lesson, trailing, className }: LessonRowProps) {
  return (
    <div className={cn("flex min-w-0 items-center gap-3", className)}>
      <LessonTypeIcon type={lesson.type} />
      <div className="min-w-0 flex-1 text-left">
        <p className="truncate body-sm-medium text-primary-500">{lesson.label}</p>
        <p className="truncate body-xsm-regular text-primary-300">{lesson.moduleLabel}</p>
      </div>
      {trailing}
    </div>
  );
}

export default LessonRow;
