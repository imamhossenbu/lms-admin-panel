import React from "react";
import type { LiveStudent } from "@/types/liveClass";
import { Avatar } from "@/components/ui/Avatar";

/** Initials avatar + student name. */
export function StudentCell({ student }: { student: LiveStudent }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <Avatar name={student.name} size={32} className="bg-brand-orange-light" />
      <span className="body-sm-medium text-primary-500 whitespace-nowrap">{student.name}</span>
    </div>
  );
}

export default StudentCell;
