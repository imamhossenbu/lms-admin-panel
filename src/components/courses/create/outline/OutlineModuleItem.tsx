"use client";

import React from "react";
import { AnimatePresence, Reorder, motion, useDragControls } from "framer-motion";
import { ChevronDown, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatMinutes, moduleMinutes, type AiOutlineLesson, type AiOutlineModule } from "../aiOutline";
import { OutlineAddLessonButton } from "./OutlineAddLessonButton";
import { OutlineDragHandle } from "./OutlineDragHandle";
import { OutlineIconButton } from "./OutlineIconButton";
import { OutlineLessonRow } from "./OutlineLessonRow";

export interface OutlineModuleItemProps {
  module: AiOutlineModule;
  index: number;
  isExpanded: boolean;
  isEditMode: boolean;
  /** Highlights the module when it fails "Add to Curriculum" validation. */
  hasIssue?: boolean;
  disabled?: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddLesson: () => void;
  onEditLesson: (lesson: AiOutlineLesson) => void;
  onDeleteLesson: (lesson: AiOutlineLesson) => void;
  onReorderLessons: (lessons: AiOutlineLesson[]) => void;
}

/** Draggable accordion row for a module with its lesson list. */
export function OutlineModuleItem({
  module,
  index,
  isExpanded,
  isEditMode,
  hasIssue,
  disabled,
  onToggle,
  onEdit,
  onDelete,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
  onReorderLessons,
}: OutlineModuleItemProps) {
  const controls = useDragControls();
  const lessonCount = module.lessons.length;
  const bodyId = `outline-module-body-${module.id}`;

  return (
    <Reorder.Item
      value={module}
      dragListener={false}
      dragControls={controls}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15 } }}
      whileDrag={{ scale: 1.01, boxShadow: "0 12px 32px rgba(15, 23, 42, 0.14)" }}
      className={cn(
        "overflow-hidden rounded-xl border bg-white",
        hasIssue ? "border-red ring-1 ring-red/30" : "border-dash"
      )}
    >
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-controls={bodyId}
        onClick={onToggle}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onToggle();
          }
        }}
        className="flex cursor-pointer items-center gap-3 px-3 py-3 transition-colors hover:bg-slate-50"
      >
        <OutlineDragHandle controls={controls} label={`Reorder ${module.title}`} disabled={disabled} />
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-orange-light body-medium font-semibold text-brand-orange">
          {index + 1}
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate title-medium text-primary-500">{module.title}</p>
          {isEditMode && module.description && (
            <p className="mt-0.5 truncate body-xsm-regular text-primary-300">{module.description}</p>
          )}
          {hasIssue && <p className="mt-0.5 body-xsm-regular text-red">Add at least one lesson to this module.</p>}
        </div>

        <span className="hidden shrink-0 whitespace-nowrap body-xsm-regular text-primary-300 sm:inline">
          {lessonCount} {lessonCount === 1 ? "Lesson" : "Lessons"} · {formatMinutes(moduleMinutes(module))}
        </span>

        <div className="flex shrink-0 items-center gap-0.5">
          <OutlineIconButton label="Edit module" icon={<Pencil className="h-4 w-4" />} onClick={onEdit} disabled={disabled} />
          <OutlineIconButton
            label="Delete module"
            tone="danger"
            icon={<Trash2 className="h-4 w-4" />}
            onClick={onDelete}
            disabled={disabled}
          />
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="inline-flex h-8 w-8 items-center justify-center text-primary-400"
            aria-hidden="true"
          >
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id={bodyId}
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-dash px-3 pb-3 pt-1">
              {lessonCount > 0 ? (
                <Reorder.Group
                  axis="y"
                  values={module.lessons}
                  onReorder={onReorderLessons}
                  className="ml-4 border-l border-dash pl-3"
                >
                  <AnimatePresence initial={false}>
                    {module.lessons.map((lesson) => (
                      <OutlineLessonRow
                        key={lesson.id}
                        lesson={lesson}
                        isEditMode={isEditMode}
                        disabled={disabled}
                        onEdit={() => onEditLesson(lesson)}
                        onDelete={() => onDeleteLesson(lesson)}
                      />
                    ))}
                  </AnimatePresence>
                </Reorder.Group>
              ) : (
                <p className="py-4 text-center body-sm-regular text-primary-300">
                  No lessons yet. Add the first lesson to this module.
                </p>
              )}
              <OutlineAddLessonButton onClick={onAddLesson} disabled={disabled} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Reorder.Item>
  );
}

export default OutlineModuleItem;
