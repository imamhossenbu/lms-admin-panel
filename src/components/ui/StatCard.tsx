import React, { ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/cn";

export interface StatItem {
  label: string;
  value: string | number | ReactNode;
  icon?: ReactNode;
  description?: ReactNode;
  trend?: {
    direction: "up" | "down";
    value: string;
    comparisonLabel?: string;
  };
}

interface StatCardProps extends Omit<StatItem, "value"> {
  value: ReactNode;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon,
  description,
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "dashboard-card flex flex-col justify-between p-5 transition-all duration-200 hover:shadow-md",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="body-sm-medium text-muted">{label}</span>
        {icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-ice-soft text-brand-primary">
            {icon}
          </span>
        )}
      </div>

      <div className="my-3 text-left">
        <div className="h3-semibold text-brand-navy leading-none">{value}</div>
      </div>

      <div className="flex items-center justify-between pt-1">
        {trend && (
          <div className="flex items-center gap-1.5 body-xsm-medium">
            <span
              className={cn(
                "inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold",
                trend.direction === "up"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-700"
              )}
            >
              {trend.direction === "up" ? (
                <ArrowUpRight className="h-3 w-3 mr-0.5" />
              ) : (
                <ArrowDownRight className="h-3 w-3 mr-0.5" />
              )}
              {trend.value}
            </span>
            {trend.comparisonLabel && (
              <span className="text-muted">{trend.comparisonLabel}</span>
            )}
          </div>
        )}
        {description && !trend && (
          <span className="body-xsm-regular text-muted">{description}</span>
        )}
      </div>
    </div>
  );
}
