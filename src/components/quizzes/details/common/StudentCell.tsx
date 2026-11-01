import React from "react";
import type { QuizStudent } from "@/types/quiz";
import { Avatar } from "@/components/ui/Avatar";

export interface StudentCellProps {
  student: QuizStudent;
  /** Hide the email line (compact tables). */
  compact?: boolean;
}

/** Initials avatar + name (+ email) used by every attempts table. */
export function StudentCell({ student, compact }: StudentCellProps) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar name={student.name} size={compact ? 28 : 36} className="bg-blue-14" />
      <div className="min-w-0">
        <p className="body-sm-medium text-primary-500 whitespace-nowrap">{student.name}</p>
        {!compact && <p className="body-xsm-regular text-primary-300 whitespace-nowrap">{student.email}</p>}
      </div>
    </div>
  );
}

export default StudentCell;
