import React from "react";

export interface SummaryRowProps {
  /** Sized icon, e.g. <Trophy className="h-4 w-4" />. */
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}

/** "icon label ........ value" line of a sidebar summary card. */
export function SummaryRow({ icon, label, children }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-dash py-2.5 last:border-b-0">
      <span className="flex min-w-0 items-center gap-2.5 body-sm-regular text-primary-400">
        <span className="shrink-0 text-primary-300">{icon}</span>
        <span className="truncate">{label}</span>
      </span>
      <span className="flex shrink-0 items-center gap-2 text-right body-sm-medium font-semibold! text-primary-500">{children}</span>
    </div>
  );
}

export default SummaryRow;
