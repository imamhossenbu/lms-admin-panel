import React from "react";
import { ChartNoAxesColumnIncreasing, Clock, Globe, LayoutGrid, SquareCheckBig } from "lucide-react";
import { formatMinutes } from "../aiOutline";

export interface CourseSummaryStatsProps {
  moduleCount: number;
  lessonCount: number;
  totalMinutes: number;
  levelLabel: string;
  language: string;
  className?: string;
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

/** Icon + label list: modules, lessons, duration, level, language. */
export function CourseSummaryStats({ moduleCount, lessonCount, totalMinutes, levelLabel, language, className }: CourseSummaryStatsProps) {
  const items = [
    { key: "modules", icon: LayoutGrid, label: plural(moduleCount, "Module") },
    { key: "lessons", icon: SquareCheckBig, label: plural(lessonCount, "Lesson") },
    { key: "duration", icon: Clock, label: totalMinutes > 0 ? formatMinutes(totalMinutes) : "No duration yet" },
    { key: "level", icon: ChartNoAxesColumnIncreasing, label: `Level: ${levelLabel || "Not set"}` },
    { key: "language", icon: Globe, label: `Language: ${language || "Not set"}` },
  ];

  return (
    <ul className={className ?? "space-y-3"}>
      {items.map(({ key, icon: Icon, label }) => (
        <li key={key} className="flex items-center gap-3 body-sm-regular text-primary-400">
          <Icon className="w-4.5 h-4.5 text-primary-300 shrink-0" />
          <span className="truncate">{label}</span>
        </li>
      ))}
    </ul>
  );
}

export default CourseSummaryStats;
