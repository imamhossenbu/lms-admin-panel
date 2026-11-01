import React from "react";
import type { AssignmentStudent } from "@/types/assignment";
import { StudentInitialsAvatar } from "./StudentInitialsAvatar";

/** Initials avatar + name + email. */
export function StudentCell({ student }: { student: AssignmentStudent }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <StudentInitialsAvatar name={student.name} />
      <div className="min-w-0">
        <p className="truncate body-sm-medium text-primary-500">{student.name}</p>
        <p className="truncate body-xsm-regular text-primary-300">{student.email}</p>
      </div>
    </div>
  );
}

export default StudentCell;
