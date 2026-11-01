import React from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/cn";
import { LOCKED_TEMPLATE_HINT } from "./templateUtils";

/** Lock icon with a hover/focus tooltip "Security emails can't be turned off". */
export function LockedHint({ className, placement = "top" }: { className?: string; placement?: "top" | "bottom" }) {
  return (
    <span tabIndex={0} aria-label={LOCKED_TEMPLATE_HINT} className={cn("group/lock relative inline-flex shrink-0 items-center text-primary-300 focus:outline-none", className)}>
      <Lock className="h-4 w-4" />
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute right-0 z-20 whitespace-nowrap rounded-md bg-primary-500 px-2.5 py-1.5 body-xsm-regular text-white opacity-0 shadow-md transition-opacity duration-150 group-hover/lock:opacity-100 group-focus/lock:opacity-100",
          placement === "top" ? "bottom-full mb-2" : "top-full mt-2"
        )}
      >
        {LOCKED_TEMPLATE_HINT}
      </span>
    </span>
  );
}

export default LockedHint;
