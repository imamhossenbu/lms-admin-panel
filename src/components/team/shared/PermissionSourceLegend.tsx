import React from "react";
import { cn } from "@/lib/cn";

export interface PermissionSourceLegendProps {
  roleName: string;
  /** Show the "Extra permission" swatch. */
  showExtra?: boolean;
  className?: string;
}

function Swatch({ className }: { className: string }) {
  return <span aria-hidden className={cn("inline-block h-3 w-3 shrink-0 rounded-sm", className)} />;
}

/** Legend for the role + extras matrix: orange = from the role, blue = extra permission. */
export function PermissionSourceLegend({ roleName, showExtra = true, className }: PermissionSourceLegendProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-1.5", className)}>
      <span className="inline-flex items-center gap-1.5 body-xsm-regular text-primary-400">
        <Swatch className="bg-brand-orange" />
        From role ({roleName})
      </span>
      {showExtra && (
        <span className="inline-flex items-center gap-1.5 body-xsm-regular text-primary-400">
          <Swatch className="bg-blue" />
          Extra permission
        </span>
      )}
    </div>
  );
}

export default PermissionSourceLegend;
