import React from "react";

interface InfoRowProps {
  label: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

/** Label/value row used by the overview information cards. */
export function InfoRow({ label, children, action }: InfoRowProps) {
  return (
    <div className="flex items-start gap-4 py-2.5 first:pt-0 last:pb-0">
      <span className="body-sm-regular text-primary-300 w-36 shrink-0">{label}</span>
      <div className="body-sm-regular text-primary-500 flex-1 min-w-0">{children}</div>
      {action && <div className="shrink-0 -my-1">{action}</div>}
    </div>
  );
}

export default InfoRow;
