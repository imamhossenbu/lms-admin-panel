"use client";

import React from "react";
import { Reorder, useDragControls } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { LESSON_TYPE_LABEL, formatMinutes, type AiOutlineLesson } from "../aiOutline";
import { LessonTypeIcon } from "./LessonTypeIcon";
import { OutlineDragHandle } from "./OutlineDragHandle";
import { OutlineIconButton } from "./OutlineIconButton";

export interface OutlineLessonRowProps {
  lesson: AiOutlineLesson;
  isEditMode: boolean;
  disabled?: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

/** Draggable lesson row inside an expanded module. */
export function OutlineLessonRow({ lesson, isEditMode, disabled, onEdit, onDelete }: OutlineLessonRowProps) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={lesson}
      dragListener={false}
      dragControls={controls}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12, transition: { duration: 0.15 } }}
      whileDrag={{ scale: 1.01, boxShadow: "0 8px 24px rgba(15, 23, 42, 0.12)" }}
      className="relative flex items-center gap-3 rounded-lg border-b border-dash bg-white py-2 pl-1 pr-1 last:border-b-0"
    >
      <OutlineDragHandle controls={controls} label={`Reorder ${lesson.title}`} disabled={disabled} />
      <LessonTypeIcon type={lesson.type} />

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <p className="truncate body-sm-medium text-primary-500">{lesson.title}</p>
          {isEditMode && (
            <ToneBadge tone="gray" size="sm">
              {LESSON_TYPE_LABEL[lesson.type]}
            </ToneBadge>
          )}
        </div>
        {isEditMode && lesson.summary && (
          <p className="mt-0.5 truncate body-xsm-regular text-primary-300">{lesson.summary}</p>
        )}
      </div>

      <span className="w-20 shrink-0 whitespace-nowrap text-right body-xsm-regular text-primary-300">
        {formatMinutes(lesson.durationMinutes)}
      </span>
      <div className="flex shrink-0 items-center gap-0.5">
        <OutlineIconButton label="Edit lesson" icon={<Pencil className="h-4 w-4" />} onClick={onEdit} disabled={disabled} />
        <OutlineIconButton
          label="Delete lesson"
          tone="danger"
          icon={<Trash2 className="h-4 w-4" />}
          onClick={onDelete}
          disabled={disabled}
        />
      </div>
    </Reorder.Item>
  );
}

export default OutlineLessonRow;
