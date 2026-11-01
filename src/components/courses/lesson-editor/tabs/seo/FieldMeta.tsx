import React from "react";
import { cn } from "@/lib/cn";

export interface FieldMetaProps {
  hint?: string;
  count?: number;
  max?: number;
  className?: string;
}

/** Helper text under an input with an optional "x/max" counter on the right. */
export function FieldMeta({ hint, count, max, className }: FieldMetaProps) {
  return (
    <div className={cn("mt-1.5 flex items-start justify-between gap-3", className)}>
      <p className="body-xsm-regular text-primary-300">{hint}</p>
      {max !== undefined && count !== undefined && (
        <span className={cn("shrink-0 whitespace-nowrap body-xsm-regular", count > max ? "text-red" : "text-primary-300")}>
          {count}/{max}
        </span>
      )}
    </div>
  );
}

export default FieldMeta;
