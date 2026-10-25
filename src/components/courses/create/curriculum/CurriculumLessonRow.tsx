"use client";

import React from "react";
import { Reorder, useDragControls } from "framer-motion";
import { Pencil, Copy, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { RowMoreMenu } from "@/components/ui/RowMoreMenu";
import { LESSON_TYPE_LABEL, type AiOutlineLesson } from "../aiOutline";
import { LessonTypeIcon, LESSON_TYPE_STYLE } from "../outline/LessonTypeIcon";
import { OutlineDragHandle } from "../outline/OutlineDragHandle";
import { OutlineIconButton } from "../outline/OutlineIconButton";

interface CurriculumLessonRowProps {
  lesson: AiOutlineLesson;
  isFirst: boolean;
  isLast: boolean;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onMove: (direction: -1 | 1) => void;
}

/** One draggable lesson: type tile, title, type badge, duration and actions. */
export function CurriculumLessonRow({ lesson, isFirst, isLast, onEdit, onDuplicate, onDelete, onMove }: CurriculumLessonRowProps) {
  const controls = useDragControls();
  const TypeIcon = LESSON_TYPE_STYLE[lesson.type].icon;

  return (
    <Reorder.Item
      value={lesson}
      dragListener={false}
      dragControls={controls}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16 }}
      whileDrag={{ scale: 1.01, boxShadow: "0 8px 24px rgba(15,23,42,0.12)" }}
      className="list-none bg-white"
    >
      <div className="flex items-center gap-3 px-3 py-2.5">
        <OutlineDragHandle controls={controls} label={`Reorder ${lesson.title}`} />
        <LessonTypeIcon type={lesson.type} />
        <p className="flex-1 min-w-0 body-sm-medium text-primary-500 truncate">{lesson.title}</p>
        <ToneBadge tone="gray" size="sm" className="hidden md:inline-flex" icon={<TypeIcon className="w-3 h-3 text-blue" />}>
          {LESSON_TYPE_LABEL[lesson.type]} Lesson
        </ToneBadge>
        <span className="w-16 text-right body-sm-regular text-primary-400 shrink-0">{lesson.durationMinutes} min</span>
        <div className="flex items-center gap-0.5 shrink-0">
          <OutlineIconButton label={`Edit ${lesson.title}`} icon={<Pencil className="w-4 h-4" />} onClick={onEdit} />
          <OutlineIconButton label={`Duplicate ${lesson.title}`} icon={<Copy className="w-4 h-4" />} onClick={onDuplicate} />
          <OutlineIconButton label={`Delete ${lesson.title}`} icon={<Trash2 className="w-4 h-4" />} tone="danger" onClick={onDelete} />
          <RowMoreMenu
            size="sm"
            label={`More actions for ${lesson.title}`}
            items={[
              { key: "up", label: "Move Up", icon: <ArrowUp className="w-3.5 h-3.5 text-primary-400" />, disabled: isFirst, onClick: () => onMove(-1) },
              { key: "down", label: "Move Down", icon: <ArrowDown className="w-3.5 h-3.5 text-primary-400" />, disabled: isLast, onClick: () => onMove(1) },
            ]}
          />
        </div>
      </div>
    </Reorder.Item>
  );
}

export default CurriculumLessonRow;
