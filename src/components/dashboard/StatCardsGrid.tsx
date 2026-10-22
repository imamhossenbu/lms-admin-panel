"use client";

import React from "react";
import { StatMetric } from "@/types/dashboard";
import { StatCard } from "./StatCard";

interface StatCardsGridProps {
  stats: StatMetric[];
}

export function StatCardsGrid({ stats }: StatCardsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {stats.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}
