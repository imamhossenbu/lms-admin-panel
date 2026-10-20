"use client";

import React, { useState } from "react";
import { CourseModuleItem } from "@/lib/types";
import { ToneBadge } from "@/components/ui/ToneBadge";
import {
  ChevronDown,
  ChevronUp,
  PlayCircle,
  FileText,
  HelpCircle,
  Clock,
  Eye,
  ExternalLink,
  BookOpen,
} from "lucide-react";

interface CourseDetailsSyllabusProps {
  displayModules: CourseModuleItem[];
  totalLessons: number;
  formattedHours: string;
}

export function CourseDetailsSyllabus({
  displayModules,
  totalLessons,
  formattedHours,
}: CourseDetailsSyllabusProps) {
  // Expand first module by default
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    if (displayModules && displayModules.length > 0) {
      initial[displayModules[0].id] = true;
    }
    return initial;
  });

  const [selectedLessonContent, setSelectedLessonContent] = useState<string | null>(null);

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
            {displayModules.length} Modules • {totalLessons} Lessons • {formattedHours} Total Duration
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="body-xsm-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            Read-Only Syllabus Overview
          </span>
        </div>
      </div>

      {/* Accordion List of Modules */}
      <div className="space-y-3">
        {displayModules.length === 0 ? (
          <div className="py-12 text-center rounded-[10px] border border-dashed border-[#EDEDED] bg-white space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
              <BookOpen className="w-5 h-5" />
            </div>
            <p className="body-sm-medium text-primary-500 font-semibold">
              No modules published in this curriculum yet
            </p>
            <p className="body-xsm-regular subtext-500 max-w-sm mx-auto">
              Switch to Course Edit Studio to author chapters, lesson notes, video streams, or generate syllabus via AI.
            </p>
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
                        {(module.lessons || []).length} lectures • {Math.round(module.durationMinutes || 0)} mins
                        {module.description && ` • ${module.description}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      aria-label="Toggle module accordion"
                      className="p-1 rounded text-primary-400 hover:text-primary-500 cursor-pointer"
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
                    {(module.lessons || []).length === 0 ? (
                      <div className="py-4 text-center text-primary-400 body-xsm-regular">
                        <span>No lessons added to this module yet.</span>
                      </div>
                    ) : (
                      module.lessons.map((lesson, lIdx) => (
                        <div
                          key={lesson.id}
                          className="py-2.5 flex flex-col gap-2 text-left hover:bg-slate-50/60 px-2 rounded-md transition-colors"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-600 font-medium text-xs">
                                {mIdx + 1}.{lIdx + 1}
                              </div>
                              <div className="flex items-center gap-2 min-w-0">
                                {getLessonIcon(lesson.type)}
                                <span className="body-sm-regular text-primary-500 font-medium truncate">
                                  {lesson.title}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {lesson.isPreview && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <Eye className="w-3 h-3" />
                                  <span>Free Preview</span>
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

                              {lesson.videoUrl && (
                                <a
                                  href={lesson.videoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] text-[#1C4D8D] font-medium hover:underline ml-1"
                                  title="Open lecture stream in new tab"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  <span>Stream</span>
                                </a>
                              )}

                              {lesson.content && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedLessonContent(
                                      selectedLessonContent === lesson.id ? null : lesson.id
                                    )
                                  }
                                  className="text-[11px] text-slate-500 hover:text-slate-900 border border-slate-200 px-2 py-0.5 rounded cursor-pointer transition-colors"
                                >
                                  {selectedLessonContent === lesson.id ? "Hide Notes" : "View Notes"}
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Expandable Content Preview */}
                          {selectedLessonContent === lesson.id && lesson.content && (
                            <div className="mt-1 p-3 rounded bg-slate-50 border border-slate-200 body-xsm-regular text-slate-700 whitespace-pre-wrap max-h-48 overflow-y-auto">
                              {lesson.content}
                            </div>
                          )}
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
