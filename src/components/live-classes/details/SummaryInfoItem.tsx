import React from "react";

export interface SummaryInfoItemProps {
  icon: React.ReactNode;
  title: React.ReactNode;
  caption: React.ReactNode;
}

/** Icon + bold line + muted caption, one cell of the summary card's info strip. */
export function SummaryInfoItem({ icon, title, caption }: SummaryInfoItemProps) {
  return (
    <div className="flex min-w-0 items-center gap-3 xl:px-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center text-primary-300">{icon}</span>
      <div className="min-w-0">
        <p className="body-sm-medium font-semibold! text-primary-500 truncate">{title}</p>
        <p className="body-xsm-regular text-primary-300 truncate">{caption}</p>
      </div>
    </div>
  );
}

export default SummaryInfoItem;
