import React from "react";
import { Avatar } from "@/components/ui/Avatar";
import { instructorOf } from "@/lib/liveClassStats";
import { cn } from "@/lib/cn";

export interface InstructorCellProps {
  instructorId: string;
  /** Show the e-mail under the name. */
  showEmail?: boolean;
  size?: number;
  className?: string;
}

/** Avatar initials + instructor name (optionally the e-mail underneath). */
export function InstructorCell({ instructorId, showEmail = false, size = 30, className }: InstructorCellProps) {
  const instructor = instructorOf(instructorId);
  const name = instructor?.name ?? "Unassigned";
  return (
    <span className={cn("flex min-w-0 items-center gap-2", className)}>
      <Avatar name={instructor?.name} size={size} />
      <span className="min-w-0">
        <span className="block truncate body-sm-regular text-primary-500" title={name}>
          {name}
        </span>
        {showEmail && instructor && <span className="block truncate body-xsm-regular text-primary-300">{instructor.email}</span>}
      </span>
    </span>
  );
}

export default InstructorCell;
