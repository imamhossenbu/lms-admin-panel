import React from "react";
import { formatUpdated } from "./quizListUtils";

/** Bold title + one-line description (both truncate). */
export function QuizTitleCell({ title, description }: { title: string; description: string }) {
  return (
    <div className="min-w-0">
      <p className="truncate body-sm-medium font-semibold! text-primary-500" title={title}>
        {title}
      </p>
      {description && (
        <p className="truncate body-xsm-regular text-primary-300" title={description}>
          {description}
        </p>
      )}
    </div>
  );
}

/** Course on top, "Module N: Title" below (one line each). */
export function CourseModuleCell({ course, module }: { course: string; module: string }) {
  return (
    <div className="min-w-0">
      <p className="truncate body-sm-regular text-primary-500" title={course}>
        {course}
      </p>
      <p className="truncate body-xsm-regular text-primary-300" title={module}>
        {module}
      </p>
    </div>
  );
}

/** "Oct 18, 2026" / "10:24 AM". */
export function UpdatedCell({ iso }: { iso: string }) {
  const { date, time } = formatUpdated(iso);
  return (
    <div className="whitespace-nowrap">
      <p className="body-sm-regular text-primary-500">{date}</p>
      <p className="body-xsm-regular text-primary-300">{time}</p>
    </div>
  );
}

/** Total marks on top, "Pass 60%" below. */
export function MarksCell({ total, passPct }: { total: number; passPct: number }) {
  return (
    <div className="whitespace-nowrap">
      <p className="body-sm-medium text-primary-500 tabular-nums">{total}</p>
      <p className="body-xsm-regular text-primary-300 tabular-nums">Pass {passPct}%</p>
    </div>
  );
}

export default QuizTitleCell;
