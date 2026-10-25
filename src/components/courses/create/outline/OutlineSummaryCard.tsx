import React from "react";
import { Clock, FileText, Folder, Layers, ListVideo } from "lucide-react";
import { LESSON_TYPES, LESSON_TYPE_LABEL, formatMinutes, type OutlineStats } from "../aiOutline";

export interface OutlineSummaryCardProps {
  stats: OutlineStats;
  durationWeeks: number;
}

interface SummaryRowProps {
  icon: React.ReactNode;
  children: React.ReactNode;
}

function SummaryRow({ icon, children }: SummaryRowProps) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0 text-primary-300">{icon}</span>
      <div className="min-w-0 body-sm-regular text-primary-500">{children}</div>
    </li>
  );
}

/** "Outline Summary" card: modules, lessons, duration and content types. */
export function OutlineSummaryCard({ stats, durationWeeks }: OutlineSummaryCardProps) {
  const usedTypes = LESSON_TYPES.filter((type) => stats.byType[type] > 0);
  const typesHeading = usedTypes.length > 1 ? "Mixed Content Types" : "Content Type";

  return (
    <section className="rounded-xl border border-dash bg-white p-4">
      <div className="mb-3 flex items-center gap-2.5">
        <FileText className="h-5 w-5 text-primary-500" />
        <h3 className="title-medium text-primary-500">Outline Summary</h3>
      </div>
      <ul className="flex flex-col gap-3">
        <SummaryRow icon={<Folder className="h-4 w-4" />}>
          <span className="text-blue">
            {stats.moduleCount} {stats.moduleCount === 1 ? "Module" : "Modules"}
          </span>
        </SummaryRow>
        <SummaryRow icon={<ListVideo className="h-4 w-4" />}>
          <span className="text-blue">
            {stats.lessonCount} {stats.lessonCount === 1 ? "Lesson" : "Lessons"}
          </span>
        </SummaryRow>
        <SummaryRow icon={<Clock className="h-4 w-4" />}>
          <span className="text-blue">
            ~ {durationWeeks} {durationWeeks === 1 ? "week" : "weeks"}
          </span>{" "}
          <span className="text-primary-300">(Total Duration: {formatMinutes(stats.totalMinutes)})</span>
        </SummaryRow>
        <SummaryRow icon={<Layers className="h-4 w-4" />}>
          <p>{typesHeading}</p>
          <p className="mt-0.5 body-xsm-regular text-primary-300">
            {usedTypes.length ? usedTypes.map((type) => LESSON_TYPE_LABEL[type]).join(", ") : "No lessons yet"}
          </p>
        </SummaryRow>
      </ul>
    </section>
  );
}

export default OutlineSummaryCard;
