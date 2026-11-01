"use client";

import React from "react";
import { BarChart3, Eye, Info, Layers, ListChecks, Trophy } from "lucide-react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import type { RubricFormValues } from "@/validations/assignmentSchema";
import { criteriaSum } from "./rubricUtils";

function SummaryRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-dash py-3 last:border-b-0">
      <span className="flex items-center gap-2.5 body-sm-regular text-primary-400">
        <span className="text-primary-300">{icon}</span>
        {label}
      </span>
      <span className="body-sm-medium font-semibold! text-primary-500">{children}</span>
    </div>
  );
}

const levelsLabel = (counts: number[]) => {
  if (!counts.length) return "—";
  const min = Math.min(...counts);
  const max = Math.max(...counts);
  return min === max ? `${min} per criterion` : `${min}–${max} per criterion`;
};

/** Live summary of the (unsaved) rubric form + student visibility toggle. */
export function RubricSummaryCard() {
  const { control } = useFormContext<RubricFormValues>();
  const [totalPoints, criteria, visible, enabled] = useWatch({ control, name: ["totalPoints", "criteria", "visibleToStudents", "enabled"] });
  const list = criteria ?? [];
  const sum = criteriaSum(list);
  const mismatch = list.length > 0 && sum !== totalPoints;

  return (
    <IconSectionCard icon={<BarChart3 className="h-5 w-5" />} title="Rubric Summary" bodyClassName="mt-3">
      <SummaryRow icon={<Trophy className="h-4 w-4" />} label="Total Points">
        {Number.isFinite(totalPoints) ? totalPoints : "—"}
      </SummaryRow>
      <SummaryRow icon={<ListChecks className="h-4 w-4" />} label="Criteria">
        {list.length}
        {mismatch && <span className="ml-1.5 body-xsm-regular text-red">({sum} pts)</span>}
      </SummaryRow>
      <SummaryRow icon={<Layers className="h-4 w-4" />} label="Performance Levels">
        {levelsLabel(list.map((c) => c.levels.length))}
      </SummaryRow>
      <div className="flex items-center justify-between gap-3 py-3">
        <span className="flex items-center gap-2.5 body-sm-regular text-primary-400">
          <Eye className="h-4 w-4 text-primary-300" />
          Student Visibility
        </span>
        <div className="flex items-center gap-2.5">
          <ToneBadge tone={visible ? "green" : "gray"} size="sm" dot>
            {visible ? "Visible to students" : "Hidden"}
          </ToneBadge>
          <Controller
            control={control}
            name="visibleToStudents"
            render={({ field }) => (
              <ToggleSwitch tone="orange" checked={field.value} onChange={field.onChange} id="rubric-visibility" />
            )}
          />
        </div>
      </div>
      <div className="mt-1 flex items-start gap-2.5 rounded-xl bg-blue-14 p-3.5">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue" />
        <p className="body-xsm-regular text-primary-400">
          {!enabled
            ? "The rubric is turned off, so submissions are graded with a single score."
            : visible
              ? "Students will see this rubric when viewing the assignment."
              : "Only instructors can see this rubric. Students will just see their score."}
        </p>
      </div>
    </IconSectionCard>
  );
}

export default RubricSummaryCard;
