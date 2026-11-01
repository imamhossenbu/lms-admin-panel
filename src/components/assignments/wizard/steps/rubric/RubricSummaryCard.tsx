"use client";

import React from "react";
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical, Table2 } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { WizardSideCard } from "../../shell/WizardSideCard";
import type { AssignmentWizardValues } from "@/validations/assignmentWizardSchema";
import type { CriterionField } from "./rubricTypes";

interface SummaryItemProps {
  fieldKey: string;
  index: number;
  count: number;
  title: string;
  points: number;
  onMove: (from: number, to: number) => void;
}

function SummaryItem({ fieldKey, index, count, title, points, onMove }: SummaryItemProps) {
  const controls = useDragControls();
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp" && index > 0) {
      e.preventDefault();
      onMove(index, index - 1);
    } else if (e.key === "ArrowDown" && index < count - 1) {
      e.preventDefault();
      onMove(index, index + 1);
    }
  };
  return (
    <Reorder.Item
      value={fieldKey}
      dragListener={false}
      dragControls={controls}
      whileDrag={{ scale: 1.02 }}
      className="flex items-center gap-2.5 rounded-lg border-b border-dash bg-white py-2.5 last:border-b-0"
    >
      <button
        type="button"
        aria-label={`Reorder ${title || `criterion ${index + 1}`}. Drag, or use the arrow keys.`}
        onPointerDown={(e) => controls.start(e)}
        onKeyDown={onKey}
        className="flex h-7 w-5 shrink-0 cursor-grab touch-none items-center justify-center rounded text-primary-300 hover:bg-gray-bg active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="w-5 shrink-0 body-sm-regular text-primary-300">{index + 1}.</span>
      <span className="min-w-0 flex-1 truncate body-sm-regular text-primary-500">{title || "Untitled criterion"}</span>
      <span className="shrink-0 body-sm-medium font-semibold! text-primary-500 tabular-nums">{Number.isFinite(points) ? points : "—"}</span>
    </Reorder.Item>
  );
}

export interface RubricSummaryCardProps {
  fields: CriterionField[];
  onMove: (from: number, to: number) => void;
}

/** Sidebar "Rubric Summary": total points + drag-reorderable criteria list (reorders the form array). */
export function RubricSummaryCard({ fields, onMove }: RubricSummaryCardProps) {
  const { control } = useFormContext<AssignmentWizardValues>();
  const [criteria, total] = useWatch({ control, name: ["criteria", "totalPoints"] });
  const keys = fields.map((f) => f.fieldKey);

  const onReorder = (next: string[]) => {
    const first = next.findIndex((k, i) => k !== keys[i]);
    if (first < 0) return;
    let last = next.length - 1;
    while (last > first && next[last] === keys[last]) last--;
    // Either the item at `first` moved down to `last`, or the item at `last` moved up to `first`.
    if (next[last] === keys[first]) onMove(first, last);
    else onMove(last, first);
  };

  return (
    <WizardSideCard
      icon={<Table2 className="h-5 w-5" />}
      title="Rubric Summary"
      action={
        <span className="body-xsm-regular text-primary-300">
          Total Points: <span className="body-sm-medium font-semibold! text-primary-500">{Number.isFinite(total) ? total : "—"}</span>
        </span>
      }
    >
      {fields.length === 0 ? (
        <p className="py-3 body-sm-regular text-primary-300">No criteria yet.</p>
      ) : (
        <Reorder.Group axis="y" values={keys} onReorder={onReorder} className="space-y-0">
          {fields.map((f, i) => (
            <SummaryItem
              key={f.fieldKey}
              fieldKey={f.fieldKey}
              index={i}
              count={fields.length}
              title={criteria?.[i]?.title ?? f.title}
              points={criteria?.[i]?.points ?? f.points}
              onMove={onMove}
            />
          ))}
        </Reorder.Group>
      )}
    </WizardSideCard>
  );
}

export default RubricSummaryCard;
