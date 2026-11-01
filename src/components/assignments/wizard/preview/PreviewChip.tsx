import React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export interface PreviewChipProps {
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

/** Light-blue info chip in the assignment preview (type, difficulty, time, points). */
export function PreviewChip({ icon: Icon, children, className }: PreviewChipProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-blue/20 bg-blue-14 px-2.5 py-1.5 body-xsm-medium text-primary-400",
        className
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0 text-blue" />
      {children}
    </span>
  );
}

export default PreviewChip;
