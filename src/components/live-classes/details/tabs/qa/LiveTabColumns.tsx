import React from "react";
import { cn } from "@/lib/cn";

export interface LiveTabColumnsProps {
  main: React.ReactNode;
  side: React.ReactNode;
  /** Keeps the right column in view while the main column scrolls (xl+). */
  stickySide?: boolean;
}

/** Two-column tab body: main card(s) (8/12) + right column cards (4/12), stacked below xl. */
export function LiveTabColumns({ main, side, stickySide }: LiveTabColumnsProps) {
  return (
    <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">
      <div className="min-w-0 space-y-5 xl:col-span-8">{main}</div>
      <aside className={cn("min-w-0 space-y-5 xl:col-span-4", stickySide && "xl:sticky xl:top-4")}>{side}</aside>
    </div>
  );
}

export default LiveTabColumns;
