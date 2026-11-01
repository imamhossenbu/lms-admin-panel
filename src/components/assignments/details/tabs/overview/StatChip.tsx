import React from "react";
import { cn } from "@/lib/cn";

export type StatChipTone = "green" | "orange" | "red" | "blue";

const TONE: Record<StatChipTone, string> = {
  green: "bg-green text-white",
  orange: "bg-brand-orange text-white",
  red: "bg-red text-white",
  blue: "bg-blue-14 text-blue",
};

export interface StatChipProps {
  icon: React.ReactNode;
  tone: StatChipTone;
  value: number;
  label: string;
}

/** Compact bordered "icon + count + label" chip above the submissions chart. */
export function StatChip({ icon, tone, value, label }: StatChipProps) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-dash p-2.5">
      <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", TONE[tone])}>{icon}</span>
      <div className="min-w-0">
        <p className="body-medium font-bold! text-primary-500">{value}</p>
        <p className="body-xsm-regular text-primary-300 whitespace-nowrap">{label}</p>
      </div>
    </div>
  );
}

export default StatChip;
