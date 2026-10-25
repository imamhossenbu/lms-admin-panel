"use client";

import React from "react";
import { AnimatePresence, Reorder, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import type { AiOutlineLesson, AiOutlineModule } from "../aiOutline";
import { OutlineAddModuleButton } from "./OutlineAddModuleButton";
import { OutlineEmptyState } from "./OutlineEmptyState";
import { OutlineModuleItem } from "./OutlineModuleItem";
import { OutlineModuleListSkeleton } from "./OutlineModuleListSkeleton";

export interface OutlineModuleListProps {
  modules: AiOutlineModule[];
  isExpanded: (moduleId: string) => boolean;
  isEditMode: boolean;
  isRegenerating?: boolean;
  invalidModuleIds: Set<string>;
  onToggle: (moduleId: string) => void;
  onReorderModules: (modules: AiOutlineModule[]) => void;
  onAddModule: () => void;
  onEditModule: (module: AiOutlineModule) => void;
  onDeleteModule: (module: AiOutlineModule) => void;
  onAddLesson: (module: AiOutlineModule) => void;
  onEditLesson: (module: AiOutlineModule, lesson: AiOutlineLesson) => void;
  onDeleteLesson: (module: AiOutlineModule, lesson: AiOutlineLesson) => void;
  onReorderLessons: (moduleId: string, lessons: AiOutlineLesson[]) => void;
}

/** Reorderable module accordion with regenerate overlay and empty state. */
export function OutlineModuleList({
  modules,
  isExpanded,
  isEditMode,
  isRegenerating,
  invalidModuleIds,
  onToggle,
  onReorderModules,
  onAddModule,
  onEditModule,
  onDeleteModule,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
  onReorderLessons,
}: OutlineModuleListProps) {
  if (isRegenerating && modules.length === 0) return <OutlineModuleListSkeleton />;

  if (modules.length === 0) return <OutlineEmptyState onAddModule={onAddModule} disabled={isRegenerating} />;

  return (
    <div className="relative" aria-busy={isRegenerating}>
      <Reorder.Group axis="y" values={modules} onReorder={onReorderModules} className="flex flex-col gap-3">
        <AnimatePresence initial={false}>
          {modules.map((module, index) => (
            <OutlineModuleItem
              key={module.id}
              module={module}
              index={index}
              isExpanded={isExpanded(module.id)}
              isEditMode={isEditMode}
              hasIssue={invalidModuleIds.has(module.id)}
              disabled={isRegenerating}
              onToggle={() => onToggle(module.id)}
              onEdit={() => onEditModule(module)}
              onDelete={() => onDeleteModule(module)}
              onAddLesson={() => onAddLesson(module)}
              onEditLesson={(lesson) => onEditLesson(module, lesson)}
              onDeleteLesson={(lesson) => onDeleteLesson(module, lesson)}
              onReorderLessons={(lessons) => onReorderLessons(module.id, lessons)}
            />
          ))}
        </AnimatePresence>
      </Reorder.Group>

      <div className="mt-3">
        <OutlineAddModuleButton onClick={onAddModule} disabled={isRegenerating} />
      </div>

      <AnimatePresence>
        {isRegenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex items-start justify-center rounded-xl bg-white/70 pt-16 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 rounded-full border border-dash bg-white px-4 py-2 shadow-lg">
              <Loader2 className="h-4 w-4 animate-spin text-brand-orange" />
              <span className="body-sm-medium text-primary-500">Regenerating outline...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default OutlineModuleList;
