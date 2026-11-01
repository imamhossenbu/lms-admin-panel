"use client";

import React from "react";
import { Reorder, useDragControls } from "framer-motion";
import { ArrowDown, ArrowUp, GripVertical } from "lucide-react";
import type { LessonEditorResource } from "@/validations/lessonEditorSchema";
import { EditorIconButton } from "../quiz/EditorIconButton";
import { ResourceIcon } from "./ResourceIcon";
import { resourceTypeLabel } from "./resourceDisplay";

interface RowProps {
  resource: LessonEditorResource;
  index: number;
  total: number;
  onMove: (from: number, to: number) => void;
}

function ReorderRow({ resource, index, total, onMove }: RowProps) {
  const controls = useDragControls();
  return (
    <Reorder.Item
      as="li"
      value={resource}
      dragListener={false}
      dragControls={controls}
      layout
      whileDrag={{ scale: 1.01 }}
      className="flex items-center gap-3 rounded-xl border border-dash bg-white px-3 py-2.5"
    >
      <button
        type="button"
        aria-label={`Drag ${resource.title}. Use the arrow keys to move.`}
        onPointerDown={(e) => controls.start(e)}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp" && index > 0) {
            e.preventDefault();
            onMove(index, index - 1);
          } else if (e.key === "ArrowDown" && index < total - 1) {
            e.preventDefault();
            onMove(index, index + 1);
          }
        }}
        className="flex h-8 w-6 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-primary-300 hover:bg-gray-bg active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/40"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="w-6 shrink-0 text-center body-sm-regular text-primary-400 tabular-nums">{index + 1}</span>
      <ResourceIcon resource={resource} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate body-sm-medium text-primary-500">{resource.title}</p>
        <p className="body-xsm-regular text-primary-300">{resourceTypeLabel(resource)}</p>
      </div>
      <EditorIconButton label="Move up" tone="neutral" icon={<ArrowUp className="h-4 w-4" />} disabled={index === 0} onClick={() => onMove(index, index - 1)} />
      <EditorIconButton label="Move down" tone="neutral" icon={<ArrowDown className="h-4 w-4" />} disabled={index === total - 1} onClick={() => onMove(index, index + 1)} />
    </Reorder.Item>
  );
}

export interface ResourceReorderListProps {
  items: LessonEditorResource[];
  onReorder: (next: LessonEditorResource[]) => void;
}

/** Reorder mode for "Added Resources": drag handles + up/down buttons. */
export function ResourceReorderList({ items, onReorder }: ResourceReorderListProps) {
  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onReorder(next);
  };

  return (
    <Reorder.Group as="ol" axis="y" values={items} onReorder={onReorder} className="space-y-2.5">
      {items.map((resource, index) => (
        <ReorderRow key={resource.id} resource={resource} index={index} total={items.length} onMove={move} />
      ))}
    </Reorder.Group>
  );
}

export default ResourceReorderList;
