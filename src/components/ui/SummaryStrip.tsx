import React from "react";
import { cn } from "@/lib/cn";

export interface SummaryStripItem {
  key: string;
  label: string;
  /** Optional icon before the value block (e.g. calendar). */
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface SummaryStripProps {
  /** Large leading visual (document icon, gateway logo...). */
  leading?: React.ReactNode;
  items: SummaryStripItem[];
  className?: string;
}

/** Horizontal key-facts card with vertical dividers, used at the top of details pages. */
export function SummaryStrip({ leading, items, className }: SummaryStripProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-dash shadow-2xs p-5 flex flex-col lg:flex-row lg:items-center gap-5",
        className
      )}
    >
      {leading && <div className="shrink-0">{leading}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-1 lg:items-stretch gap-5 lg:gap-0 min-w-0">
        {items.map((item, idx) => (
          <div
            key={item.key}
            className={cn("flex items-start gap-3 min-w-0 lg:flex-1 lg:px-6", idx === 0 ? "lg:pl-0" : "lg:border-l lg:border-dash")}
          >
            {item.icon && <span className="text-primary-300 shrink-0 mt-6 [&>svg]:w-5 [&>svg]:h-5">{item.icon}</span>}
            <div className="min-w-0">
              <p className="body-sm-regular text-primary-400 mb-1.5">{item.label}</p>
              {item.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SummaryStrip;
