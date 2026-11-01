import React from "react";
import { cn } from "@/lib/cn";

/** Coloured legend dot + label (token bg class, e.g. "bg-green" or "bg-blue/30"). */
export function LegendDot({ colorClass, label }: { colorClass: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap body-xsm-regular text-primary-400">
      <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", colorClass)} />
      {label}
    </span>
  );
}

export default LegendDot;
