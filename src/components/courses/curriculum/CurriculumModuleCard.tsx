"use client";

import React from "react";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Edit3,
  Trash2,
  Clock,
  Layers,
  Sparkles,
} from "lucide-react";
import { ModuleItem, LessonItem } from "./types";
import { CurriculumLessonRow } from "./CurriculumLessonRow";

interface CurriculumModuleCardProps {
  module: ModuleItem;
  index: number;
  isExpanded: boolean;
  onToggleExpand: (moduleId: string) => void;
  onEditModule: (module: ModuleItem) => void;
  onDeleteModule: (moduleId: string, moduleTitle: string) => void;
  onAddLesson: (moduleId: string) => void;
  onEditLesson: (moduleId: string, lesson: LessonItem) => void;
  onDeleteLesson: (moduleId: string, lessonId: string, lessonTitle: string) => void;
}

export function CurriculumModuleCard({
  module,
  index,
  isExpanded,
  onToggleExpand,
  onEditModule,
  onDeleteModule,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
}: CurriculumModuleCardProps) {
  const totalModuleMinutes = module.lessons.reduce(
    (acc, l) => acc + (l.durationMinutes || 0),
    0
  );

  return (
    <div className="rounded-[10px] border border-[#EDEDED] bg-white overflow-hidden transition-all shadow-xs">
      {/* Module Header Bar */}
      <div className="p-3.5 bg-[#F8F9FA] flex items-center justify-between gap-3 border-b border-[#EDEDED]/80">
        <div
          onClick={() => onToggleExpand(module.id)}
          className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
        >
          <span className="w-6 h-6 rounded-md bg-[#1C4D8D]/10 text-[#1C4D8D] body-xsm-medium font-bold flex items-center justify-center shrink-0">
            {index + 1}
          </span>

          <div className="min-w-0 flex-1">
            <h4 className="body-sm-medium text-primary-500 font-bold truncate">
              {module.title}
            </h4>
            {module.description && (
              <p className="body-xsm-regular subtext-500 truncate">
                {module.description}
              </p>
            )}
          </div>
        </div>

        {/* Action Controls & Meta */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-2 text-primary-400 body-xsm-regular mr-1">
            <span>{module.lessons.length} lessons</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{totalModuleMinutes}m</span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => onAddLesson(module.id)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] bg-white border border-[#EDEDED] hover:border-[#1C4D8D] text-[#1C4D8D] body-xsm-medium transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="w-3 h-3" />
            <span>Add Lesson</span>
          </button>

          <button
            type="button"
            onClick={() => onEditModule(module)}
            className="p-1.5 rounded-[6px] text-primary-400 hover:text-[#1C4D8D] hover:bg-white transition-colors cursor-pointer"
            title="Edit Module Details"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onDeleteModule(module.id, module.title)}
            className="p-1.5 rounded-[6px] text-primary-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Delete Entire Module"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onToggleExpand(module.id)}
            className="p-1 rounded text-primary-400 hover:text-primary-500 cursor-pointer"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Module Lessons Accordion Body */}
      {isExpanded && (
        <div className="p-3.5 space-y-2 bg-white">
          {module.lessons.length === 0 ? (
            <div className="py-6 px-4 text-center rounded-[8px] border border-dashed border-[#EDEDED] bg-[#F8F9FA]/60">
              <p className="body-sm-regular text-primary-400 mb-2">
                No lessons in this module yet.
              </p>
              <button
                type="button"
                onClick={() => onAddLesson(module.id)}
                className="inline-flex items-center gap-1.5 text-xs text-[#1C4D8D] font-semibold hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create first lesson for this module</span>
              </button>
            </div>
          ) : (
            module.lessons.map((lesson) => (
              <CurriculumLessonRow
                key={lesson.id}
                lesson={lesson}
                moduleId={module.id}
                onEdit={onEditLesson}
                onDelete={onDeleteLesson}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
