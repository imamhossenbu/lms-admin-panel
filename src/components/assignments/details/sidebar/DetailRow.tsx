import React from "react";
import type { LucideIcon } from "lucide-react";

export interface DetailRowProps {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}

/** One "label → value" line of the Assignment Details card. */
export function DetailRow({ icon: Icon, label, children }: DetailRowProps) {
  return (
    <div className="grid grid-cols-5 items-center gap-3 py-2.5">
      <dt className="col-span-2 flex items-center gap-2.5 body-sm-regular text-primary-300">
        <Icon className="h-4 w-4 shrink-0" />
        <span>{label}</span>
      </dt>
      <dd className="col-span-3 flex min-w-0 flex-wrap items-center gap-2 body-sm-medium text-primary-500">{children}</dd>
    </div>
  );
}

export default DetailRow;
