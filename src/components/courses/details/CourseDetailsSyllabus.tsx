"use client";

import React, { useState } from "react";
import { CourseModuleItem } from "@/lib/types";
import { ToneBadge } from "@/components/ui/ToneBadge";
import PrimaryButton from "@/components/ui/primary-button";
import SecondaryButton from "@/components/ui/secondary-button";
import {
  ChevronDown,
  ChevronUp,
  PlayCircle,
  FileText,
  HelpCircle,
  Clock,
  Eye,
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
} from "lucide-react";

interface CourseDetailsSyllabusProps {
  displayModules: CourseModuleItem[];
  totalLessons: number;
  formattedHours: string;
  onOpenCurriculumBuilder?: () => void;
  onAddModule?: () => void;
  onEditModule?: (module: CourseModuleItem) => void;
  onDeleteModule?: (moduleId: string, moduleTitle: string) => void;
  onAddLesson?: (moduleId: string) => void;
  onEditLesson?: (moduleId: string, lesson: any) => void;
  onDeleteLesson?: (moduleId: string, lessonId: string, lessonTitle: string) => void;
}

export function CourseDetailsSyllabus({
  displayModules,
  totalLessons,
  formattedHours,
  onOpenCurriculumBuilder,
  onAddModule,
  onEditModule,
  onDeleteModule,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
}: CourseDetailsSyllabusProps) {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    "mod-1": true,
    "mod-2": true,
  });

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  const getLessonIcon = (type?: string) => {
    switch (type) {
      case "VIDEO":
        return <PlayCircle className="w-4 h-4 text-[#1C4D8D]" />;
      case "QUIZ":
        return <HelpCircle className="w-4 h-4 text-purple-600" />;
      default:
        return <FileText className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="space-y-4 text-left">
      {/* Syllabus Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-[10px] bg-[#F8F9FA] border border-[#EDEDED]">
        <div>
          <h3 className="body-medium text-primary-500 font-bold">
            Curriculum & Instructional Syllabus
          </h3>
          <p className="body-xsm-regular subtext-500 mt-0.5">
            {displayModules.length} Modules • {totalLessons} Lessons • {formattedHours} Total Length
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onAddModule && (
            <SecondaryButton
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={onAddModule}
            >
              Add Module
            </SecondaryButton>
          )}

          {onOpenCurriculumBuilder && (
            <PrimaryButton
              size="sm"
              icon={<Edit3 className="w-3.5 h-3.5" />}
              onClick={onOpenCurriculumBuilder}
            >
              Curriculum Builder & Lessons Studio
            </PrimaryButton>
          )}
        </div>
      </div>

      {/* Accordion List of Modules */}
      <div className="space-y-3">
        {displayModules.length === 0 ? (
          <div className="py-10 text-center rounded-[10px] border border-dashed border-[#EDEDED] bg-white">
            <p className="body-sm-medium text-primary-500 font-semibold mb-1">
              No modules in this curriculum yet
            </p>
            <p className="body-xsm-regular subtext-500 mb-3">
              Click below to author your first module or launch the AI syllabus generator.
            </p>
            {onAddModule && (
              <PrimaryButton size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={onAddModule}>
                Create First Module
              </PrimaryButton>
            )}
          </div>
        ) : (
          displayModules.map((module, mIdx) => {
            const isExpanded = !!expandedModules[module.id];
            return (
              <div
                key={module.id}
                className="rounded-[10px] border border-[#EDEDED] bg-white overflow-hidden shadow-2xs group"
              >
                {/* Module Header Bar */}
                <div
                  onClick={() => toggleModule(module.id)}
                  className="w-full px-4 py-3 bg-[#F8F9FA] hover:bg-[#F3F4F6] transition-colors flex items-center justify-between text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-md bg-[#EBF4FC] text-[#1C4D8D] font-bold text-xs flex items-center justify-center shrink-0">
                      {mIdx + 1}
                    </span>
                    <div className="min-w-0">
                      <span className="body-sm-medium text-primary-500 font-bold block truncate">
                        {module.title}
                      </span>
                      <span className="body-xsm-regular subtext-500">
                        {module.lessons.length} lectures • {Math.round(module.durationMinutes || 45)} mins
                        {module.description && ` • ${module.description}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {onAddLesson && (
                      <button
                        type="button"
                        onClick={() => onAddLesson(module.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] bg-white border border-[#EDEDED] hover:border-[#1C4D8D] text-[#1C4D8D] body-xsm-medium transition-colors cursor-pointer shadow-2xs mr-1"
                        title="Add Lesson to this Module"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Lesson</span>
                      </button>
                    )}

                    {onEditModule && (
                      <button
                        type="button"
                        onClick={() => onEditModule(module)}
                        className="p-1.5 rounded-[6px] text-primary-400 hover:text-[#1C4D8D] hover:bg-white transition-colors cursor-pointer"
                        title="Edit Module Details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {onDeleteModule && (
                      <button
                        type="button"
                        onClick={() => onDeleteModule(module.id, module.title)}
                        className="p-1.5 rounded-[6px] text-primary-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Module"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleModule(module.id)}
                      className="p-1 rounded text-primary-400 hover:text-primary-500 cursor-pointer ml-1"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-primary-300" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-primary-300" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Lesson Items inside Module */}
                {isExpanded && (
                  <div className="divide-y divide-[#EDEDED] px-4 py-1">
                    {module.lessons.length === 0 ? (
                      <div className="py-4 text-center text-primary-400 body-xsm-regular">
                        <span>No lessons in this module yet. </span>
                        {onAddLesson && (
                          <button
                            type="button"
                            onClick={() => onAddLesson(module.id)}
                            className="text-[#1C4D8D] font-bold hover:underline cursor-pointer ml-1"
                          >
                            + Add lesson now
                          </button>
                        )}
                      </div>
                    ) : (
                      module.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          onClick={() => onEditLesson?.(module.id, lesson)}
                          className="py-2.5 flex items-center justify-between gap-3 text-left hover:bg-blue-50/40 px-2 rounded-md transition-colors cursor-pointer group/lesson"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-hover/lesson:bg-blue-100 transition-colors">
                              {getLessonIcon(lesson.type)}
                            </div>
                            <div className="min-w-0">
                              <span className="body-sm-regular text-primary-500 font-medium block truncate group-hover/lesson:text-[#1C4D8D] transition-colors">
                                {lesson.title}
                              </span>
                              {lesson.content && (
                                <span className="body-2xsm-regular subtext-500 line-clamp-1">
                                  {lesson.content.substring(0, 70)}...
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                            {lesson.isPreview && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <Eye className="w-3 h-3" />
                                <span>Preview</span>
                              </span>
                            )}

                            <span className="body-xsm-regular subtext-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{lesson.durationMinutes || 15}m</span>
                            </span>

                            <ToneBadge
                              tone={
                                lesson.type === "VIDEO"
                                  ? "blue"
                                  : lesson.type === "QUIZ"
                                  ? "purple"
                                  : "orange"
                              }
                              size="sm"
                            >
                              {lesson.type || "VIDEO"}
                            </ToneBadge>

                            {onEditLesson && (
                              <button
                                type="button"
                                onClick={() => onEditLesson(module.id, lesson)}
                                className="p-1.5 rounded-[6px] text-primary-400 hover:text-[#1C4D8D] hover:bg-white transition-colors cursor-pointer"
                                title="Edit Lesson Content"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {onDeleteLesson && (
                              <button
                                type="button"
                                onClick={() => onDeleteLesson(module.id, lesson.id, lesson.title)}
                                className="p-1.5 rounded-[6px] text-primary-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete Lesson"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default CourseDetailsSyllabus;
