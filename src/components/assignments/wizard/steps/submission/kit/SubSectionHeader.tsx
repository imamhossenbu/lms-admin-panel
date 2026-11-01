import React from "react";
import { cn } from "@/lib/cn";

export interface SubSectionHeaderProps {
  /** Sized icon, e.g. <Clock className="h-5 w-5" />. Omit for a text-only header. */
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/** Small header inside a step card ("Late Submission", "Submission Attempts", "Rubric Criteria"). */
export function SubSectionHeader({ icon, title, description, action, className }: SubSectionHeaderProps) {
  return (
    <div className={cn("mb-3.5 flex items-start gap-3", className)}>
      {icon && <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-14 text-blue">{icon}</span>}
      <div className="min-w-0 flex-1">
        <h4 className="body-sm-medium font-semibold! text-primary-500">{title}</h4>
        {description && <p className="mt-0.5 body-xsm-regular text-primary-300">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export default SubSectionHeader;
