"use client";

import React, { ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/cn";

export interface StatItem {
  label: string;
  value: string | number | React.ReactNode;
  icon?: ReactNode;
  iconColor?: string;
  accentColor?: string;
  description?: ReactNode;
  trend?: {
    direction: "up" | "down";
    value: string;
    comparisonLabel?: string;
  };
}

export interface StatCardProps extends StatItem {
  className?: string;
  index?: number;
}

export function StatCard({
  label,
  value,
  icon,
  iconColor,
  description,
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between w-full h-33 rounded-xl border border-dash bg-white p-4 transition-all duration-200 shadow-xs hover:shadow-md",
        className
      )}
    >
      {/* Top Section: Icon + Label */}
      <div className="flex items-center gap-2">
        {icon && (
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center text-primary-300 rounded-md bg-gray-bg text-primary-text-500 [&>svg]:w-4 [&>svg]:h-4"
            style={
              iconColor
                ? { backgroundColor: `${iconColor}1A`, color: iconColor }
                : undefined
            }
          >
            {icon}
          </span>
        )}
        <span className="body-sm-regular text-primary-300 truncate">
          {label}
        </span>
      </div>

      {/* Middle Section: Value */}
      <div
        className="h6-medium text-primary-text-500 my-auto min-w-0 truncate"
        title={String(value)}
      >
        {value}
      </div>

      {/* Bottom Section: Description */}
      {description && (
        <span className="body-xsm-regular text-primary-300 !text-left truncate">
          {description}
        </span>
      )}

      {/* Bottom Section: Trend */}
      {trend && (
        <div className="flex items-center gap-1 body-xsm-regular">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 body-xsm-medium",
              trend.direction === "up" ? "text-green" : "text-red"
            )}
          >
            {trend.direction === "up" ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
            {trend.value}
          </span>
          {trend.comparisonLabel && (
            <span className="text-primary-300">
              {trend.comparisonLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default StatCard;
