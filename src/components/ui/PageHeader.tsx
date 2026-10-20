import React from "react";
import { cn } from "@/lib/cn";

export interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  badge,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 mb-6 border-b border-dash",
        className
      )}
    >
      <div className="flex flex-col gap-1 text-left">
        <div className="flex items-center gap-3">
          <h1 className="h3-semibold text-brand-navy">{title}</h1>
          {badge}
        </div>
        {description && (
          <p className="body-sm-regular text-muted">{description}</p>
        )}
      </div>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  );
}
