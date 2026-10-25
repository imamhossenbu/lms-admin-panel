import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface TrendStatCardProps {
  icon: React.ReactNode;
  /** Token classes for the icon tile, e.g. "bg-brand-orange-light text-brand-orange". */
  iconClassName: string;
  value: React.ReactNode;
  label: string;
  trend?: { direction: "up" | "down"; value: string };
  className?: string;
}

/** Compact KPI card: tinted icon tile, big value + label, and a trend pill on the right. */
export function TrendStatCard({ icon, iconClassName, value, label, trend, className }: TrendStatCardProps) {
  const isUp = trend?.direction === "up";
  return (
    <div className={cn("bg-white rounded-xl border border-dash shadow-2xs p-4 flex items-center gap-3.5", className)}>
      <span className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 [&>svg]:w-6 [&>svg]:h-6", iconClassName)}>
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="heading-h5 font-bold text-primary-500 leading-tight truncate">{value}</p>
        <p className="body-sm-regular text-primary-400 truncate">{label}</p>
      </div>
      {trend && (
        <span
          className={cn(
            "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 body-xsm-medium whitespace-nowrap shrink-0 self-end",
            isUp ? "bg-green-bg text-green" : "bg-red-14 text-red"
          )}
        >
          {isUp ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          {trend.value}
        </span>
      )}
    </div>
  );
}

export default TrendStatCard;
