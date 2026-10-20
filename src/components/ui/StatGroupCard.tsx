import React from "react";
import { StatCard, StatItem } from "./StatCard";
import { cn } from "@/lib/cn";

interface StatGroupCardProps {
  stats: StatItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function StatGroupCard({
  stats,
  columns = 4,
  className,
}: StatGroupCardProps) {
  const colClasses = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4 w-full", colClasses[columns], className)}>
      {stats.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
    </div>
  );
}
