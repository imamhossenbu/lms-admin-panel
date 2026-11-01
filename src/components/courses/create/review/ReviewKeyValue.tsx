import React from "react";
import { cn } from "@/lib/cn";

export interface ReviewKeyValueItem {
  label: string;
  value: React.ReactNode;
}

export interface ReviewKeyValueProps {
  items: ReviewKeyValueItem[];
  className?: string;
}

/** Label / value list (fixed label column) used inside review sections. */
export function ReviewKeyValue({ items, className }: ReviewKeyValueProps) {
  return (
    <dl className={cn("space-y-2.5", className)}>
      {items.map((item) => (
        <div key={item.label} className="grid grid-cols-5 gap-3">
          <dt className="col-span-2 body-sm-regular text-primary-300">{item.label}</dt>
          <dd className="col-span-3 body-sm-medium text-primary-500 min-w-0 break-words">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default ReviewKeyValue;
