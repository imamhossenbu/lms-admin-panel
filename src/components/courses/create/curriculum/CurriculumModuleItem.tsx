"use client";

import React from "react";
import { AnimatePresence, motion, Reorder, useDragControls } from "framer-motion";
import { ChevronDown, Pencil, Plus, Copy, Trash2, ArrowUp, ArrowDown, CheckCircle2 } from "lucide-react";
import { RowMoreMenu } from "@/components/ui/RowMoreMenu";
import { cn } from "@/lib/cn";
import { formatMinutes, moduleMinutes, type AiOutlineLesson, type AiOutlineModule } from "../aiOutline";
import { OutlineDragHandle } from "../outline/OutlineDragHandle";
import { CurriculumLessonRow } from "./CurriculumLessonRow";

interface CurriculumModuleItemProps {
  module: AiOutlineModule;
  index: number;
  total: number;
  isExpanded: boolean;
  isActive: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onMove: (direction: -1 | 1) => void;
  onAddLesson: () => void;
  onEditLesson: (lesson: AiOutlineLesson) => void;
  onDuplicateLesson: (lesson: AiOutlineLesson) => void;
  onDeleteLesson: (lesson: AiOutlineLesson) => void;
  onMoveLesson: (lesson: AiOutlineLesson, direction: -1 | 1) => void;
  onReorderLessons: (lessons: AiOutlineLesson[]) => void;
}

const MENU_ICON = "w-3.5 h-3.5 text-primary-400";

/** Draggable, collapsible module with its lessons. */
export function CurriculumModuleItem(props: CurriculumModuleItemProps) {
  const { module, index, total, isExpanded, isActive } = props;
  const controls = useDragControls();
  const lessonCount = module.lessons.length;

  return (
    <Reorder.Item
      value={module}
      dragListener={false}
      dragControls={controls}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      whileDrag={{ scale: 1.01, boxShadow: "0 12px 32px rgba(15,23,42,0.14)" }}
      className={cn(
        "list-none rounded-xl border bg-white overflow-hidden",
        isActive ? "border-brand-orange" : "border-dash"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 px-3 py-3 transition-colors",
          isExpanded ? "bg-brand-orange-light" : "bg-white hover:bg-slate-50"
        )}
      >
        <OutlineDragHandle controls={controls} label={`Reorder ${module.title}`} />
        <span className="w-9 h-9 rounded-full bg-brand-orange-light text-brand-orange body-medium font-bold flex items-center justify-center shrink-0 ring-1 ring-brand-orange/20">
          {index + 1}
        </span>
        <button type="button" onClick={props.onToggle} className="flex-1 min-w-0 flex items-center gap-2 text-left cursor-pointer">
          <span className="body-medium font-semibold text-primary-500 truncate">{module.title}</span>
        </button>
        <button
          type="button"
          onClick={props.onEdit}
          aria-label={`Edit ${module.title}`}
          className="w-7 h-7 rounded-md flex items-center justify-center text-primary-400 hover:text-brand-orange hover:bg-white transition-colors cursor-pointer shrink-0"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <span className="hidden sm:block body-sm-regular text-primary-400 whitespace-nowrap shrink-0">
          {lessonCount} {lessonCount === 1 ? "Lesson" : "Lessons"} · {formatMinutes(moduleMinutes(module))}
        </span>
        <motion.button
          type="button"
          onClick={props.onToggle}
          aria-label={isExpanded ? `Collapse ${module.title}` : `Expand ${module.title}`}
          aria-expanded={isExpanded}
          animate={{ rotate: isExpanded ? 180 : 0 }}
          className="w-8 h-8 rounded-md flex items-center justify-center text-primary-500 hover:bg-white transition-colors cursor-pointer shrink-0"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.button>
        <RowMoreMenu
          size="sm"
          label={`More actions for ${module.title}`}
          items={[
            { key: "edit", label: "Edit Module", icon: <Pencil className={MENU_ICON} />, onClick: props.onEdit },
            { key: "lesson", label: "Add Lesson", icon: <Plus className={MENU_ICON} />, onClick: props.onAddLesson },
            { key: "duplicate", label: "Duplicate Module", icon: <Copy className={MENU_ICON} />, onClick: props.onDuplicate },
            { key: "up", label: "Move Up", icon: <ArrowUp className={MENU_ICON} />, disabled: index === 0, separatorBefore: true, onClick: () => props.onMove(-1) },
            { key: "down", label: "Move Down", icon: <ArrowDown className={MENU_ICON} />, disabled: index === total - 1, onClick: () => props.onMove(1) },
            { key: "delete", label: "Delete Module", icon: <Trash2 className="w-3.5 h-3.5" />, danger: true, separatorBefore: true, onClick: props.onDelete },
          ]}
        />
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {(module.description || module.objectives?.length) && (
                <div className="pt-3 space-y-2">
                  {module.description && <p className="body-sm-regular text-primary-400">{module.description}</p>}
                  {!!module.objectives?.length && (
                    <ul className="flex flex-wrap gap-x-4 gap-y-1">
                      {module.objectives.map((objective) => (
                        <li key={objective} className="inline-flex items-center gap-1.5 body-xsm-regular text-primary-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green shrink-0" />
                          {objective}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {lessonCount > 0 ? (
                <Reorder.Group
                  axis="y"
                  values={module.lessons}
                  onReorder={props.onReorderLessons}
                  className="rounded-lg border border-dash divide-y divide-dash overflow-hidden"
                >
                  <AnimatePresence initial={false}>
                    {module.lessons.map((lesson, li) => (
                      <CurriculumLessonRow
                        key={lesson.id}
                        lesson={lesson}
                        isFirst={li === 0}
                        isLast={li === lessonCount - 1}
                        onEdit={() => props.onEditLesson(lesson)}
                        onDuplicate={() => props.onDuplicateLesson(lesson)}
                        onDelete={() => props.onDeleteLesson(lesson)}
                        onMove={(direction) => props.onMoveLesson(lesson, direction)}
                      />
                    ))}
                  </AnimatePresence>
                </Reorder.Group>
              ) : (
                <p className="rounded-lg border border-dashed border-dash py-5 text-center body-sm-regular text-primary-300">
                  No lessons yet. Add the first lesson to this module.
                </p>
              )}

              <motion.button
                type="button"
                whileTap={{ scale: 0.99 }}
                onClick={props.onAddLesson}
                className="w-full h-11 rounded-lg bg-brand-orange-light border border-brand-orange/20 body-sm-medium text-brand-orange hover:bg-brand-orange hover:text-white inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Lesson
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Reorder.Item>
  );
}

export default CurriculumModuleItem;
