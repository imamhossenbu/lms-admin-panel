import React from "react";
import { cn } from "@/lib/cn";

/** Small label above a filter control ("Result", "Attempt", "Date Range"). */
export function FilterField({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <span className="body-xsm-medium text-primary-400">{label}</span>
      {children}
    </div>
  );
}

export default FilterField;
