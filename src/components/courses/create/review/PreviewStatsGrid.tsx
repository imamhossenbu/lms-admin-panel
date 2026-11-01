import React from "react";
import { ChartNoAxesColumnIncreasing, Clock, Globe, LayoutGrid, SquareCheck, Tag } from "lucide-react";
import { formatMinutes } from "../aiOutline";

export interface PreviewStatsGridProps {
  stats: { modules: number; lessons: number; totalMinutes: number };
  levelLabel: string;
  language: string;
  priceLabel: string;
}

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

/** 3-column icon stats: modules, lessons, duration, level, language, price. */
export function PreviewStatsGrid({ stats, levelLabel, language, priceLabel }: PreviewStatsGridProps) {
  const items = [
    { key: "modules", icon: <LayoutGrid />, label: plural(stats.modules, "Module") },
    { key: "lessons", icon: <SquareCheck />, label: plural(stats.lessons, "Lesson") },
    { key: "duration", icon: <Clock />, label: stats.totalMinutes > 0 ? formatMinutes(stats.totalMinutes) : "0 min" },
    { key: "level", icon: <ChartNoAxesColumnIncreasing />, label: levelLabel || "—" },
    { key: "language", icon: <Globe />, label: language || "—" },
    { key: "price", icon: <Tag />, label: priceLabel },
  ];

  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
      {items.map((item) => (
        <li key={item.key} className="flex items-center gap-2 min-w-0 body-sm-regular text-primary-400">
          <span className="shrink-0 text-primary-300 [&>svg]:w-4.5 [&>svg]:h-4.5">{item.icon}</span>
          <span className="truncate">{item.label}</span>
        </li>
      ))}
    </ul>
  );
}

export default PreviewStatsGrid;
