"use client";

import React from "react";
import { cn } from "@/lib/cn";

interface InstructorDetailCardProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Optional icon shown in a soft blue tile before the title (overview cards). */
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

/** White card used by every section on the instructor details page. */
export function InstructorDetailCard({
  title,
  description,
  icon,
  action,
  children,
  className,
  bodyClassName,
}: InstructorDetailCardProps) {
  return (
    <section className={cn("bg-white rounded-xl border border-dash shadow-2xs p-5 text-left", className)}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          {icon && (
            <span className="w-10 h-10 rounded-lg bg-blue-14 text-blue flex items-center justify-center shrink-0 [&>svg]:w-5 [&>svg]:h-5">
              {icon}
            </span>
          )}
          <div className="min-w-0">
            <h2 className={cn("font-bold text-primary-500", icon ? "title-medium" : "heading-h5")}>
              {title}
            </h2>
            {description && (
              <p className="body-sm-regular text-primary-300 mt-0.5">{description}</p>
            )}
          </div>
        </div>
        {action && <div className="flex items-center gap-2.5 shrink-0">{action}</div>}
      </div>
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

export default InstructorDetailCard;
