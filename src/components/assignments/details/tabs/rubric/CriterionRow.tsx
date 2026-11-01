"use client";

import React from "react";
import { Reorder, useDragControls } from "framer-motion";
import { ArrowDown, ArrowUp, Copy, GripVertical, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { AppDropdownMenu } from "@/components/ui/AppDropdownMenu";
import { EditorIconButton } from "@/components/courses/lesson-editor/tabs/quiz/EditorIconButton";
import type { RubricCriterion } from "@/types/assignment";
import { cn } from "@/lib/cn";
import { LevelBox } from "./LevelBox";
import { sortedLevels } from "./rubricUtils";

export type CriterionField = RubricCriterion & { fieldKey: string };

export interface CriterionRowProps {
  field: CriterionField;
  index: number;
  total: number;
  invalid?: boolean;
  disabled?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMove: (from: number, to: number) => void;
}

/** One draggable rubric criterion: handle, number, title + description, level boxes, edit / delete / more. */
export function CriterionRow({ field, index, total, invalid, disabled, onEdit, onDelete, onDuplicate, onMove }: CriterionRowProps) {
  const controls = useDragControls();

  const onHandleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp" && index > 0) {
      e.preventDefault();
      onMove(index, index - 1);
    } else if (e.key === "ArrowDown" && index < total - 1) {
      e.preventDefault();
      onMove(index, index + 1);
    }
  };

  return (
    <Reorder.Item
      as="li"
      value={field}
      dragListener={false}
      dragControls={controls}
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      whileDrag={{ scale: 1.01 }}
      className={cn(
        "flex flex-col gap-3 rounded-xl border bg-white p-3 xl:flex-row xl:items-center",
        invalid ? "border-red bg-red-14" : "border-dash"
      )}
    >
      <div className="flex min-w-0 items-center gap-3 xl:w-52 xl:shrink-0">
        <button
          type="button"
          disabled={disabled}
          aria-label={`Reorder criterion ${index + 1}. Drag, or use the arrow keys to move.`}
          title="Drag to reorder (or use arrow keys)"
          onPointerDown={(e) => !disabled && controls.start(e)}
          onKeyDown={onHandleKey}
          className="flex h-8 w-6 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-primary-300 hover:bg-gray-bg active:cursor-grabbing disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/40"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-bg body-sm-medium text-primary-400">{index + 1}</span>
        <div className="min-w-0">
          <p className="truncate body-sm-medium font-semibold! text-primary-500" title={field.title}>
            {field.title || "Untitled criterion"}
          </p>
          {field.description && (
            <p className="line-clamp-2 body-xsm-regular text-primary-400" title={field.description}>
              {field.description}
            </p>
          )}
          <p className="body-xsm-regular text-primary-300">{field.points} points</p>
          {invalid && <p className="body-xsm-regular text-red">Has errors — edit to fix.</p>}
        </div>
      </div>

      <div className="grid min-w-0 flex-1 grid-cols-1 gap-2 sm:grid-cols-3">
        {sortedLevels(field.levels).map((level) => (
          <LevelBox key={level.id} level={level} />
        ))}
      </div>

      <div className="flex shrink-0 items-center justify-end gap-2">
        <EditorIconButton label={`Edit criterion ${index + 1}`} icon={<Pencil className="h-4 w-4" />} onClick={onEdit} disabled={disabled} />
        <EditorIconButton label={`Delete criterion ${index + 1}`} tone="red" icon={<Trash2 className="h-4 w-4" />} onClick={onDelete} disabled={disabled} />
        <AppDropdownMenu
          items={[
            { key: "dup", label: "Duplicate", icon: <Copy className="h-4 w-4" />, onClick: onDuplicate },
            { key: "up", label: "Move up", icon: <ArrowUp className="h-4 w-4" />, onClick: () => onMove(index, index - 1), disabled: index === 0 },
            { key: "down", label: "Move down", icon: <ArrowDown className="h-4 w-4" />, onClick: () => onMove(index, index + 1), disabled: index === total - 1 },
          ]}
          trigger={
            <button
              type="button"
              disabled={disabled}
              aria-label={`More actions for criterion ${index + 1}`}
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-dash bg-white text-primary-400 transition-colors hover:bg-gray-bg disabled:cursor-not-allowed disabled:opacity-40"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          }
        />
      </div>
    </Reorder.Item>
  );
}

export default CriterionRow;
