import React from "react";
import { cn } from "@/lib/cn";

export interface SummaryRowProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  /** Muted value ("Not set", "Not added yet"). */
  muted?: boolean;
}

/** One "icon · label · value" line of the Quiz Summary card. */
export function SummaryRow({ icon, label, children, muted }: SummaryRowProps) {
  return (
    <div className="flex items-center gap-3 border-b border-dash py-2.5 last:border-b-0">
      <span className="flex h-4 w-4 shrink-0 items-center justify-center text-primary-300">{icon}</span>
      <span className="w-28 shrink-0 body-sm-regular text-primary-300">{label}</span>
      <span className={cn("min-w-0 flex-1 truncate body-sm-medium", muted ? "text-primary-300" : "text-primary-500")}>{children}</span>
    </div>
  );
}

export default SummaryRow;
