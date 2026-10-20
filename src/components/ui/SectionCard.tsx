import React from "react";
import { cn } from "@/lib/cn";

export interface SectionCardProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
}: SectionCardProps) {
  return (
    <div className={cn("dashboard-card p-6 flex flex-col gap-4 text-left", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between pb-3 border-b border-dash">
          <div>
            {title && <h3 className="h5-medium text-brand-navy">{title}</h3>}
            {description && (
              <p className="body-xsm-regular text-muted mt-0.5">{description}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
