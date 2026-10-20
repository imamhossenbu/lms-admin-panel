"use client";

import React, { useState } from "react";
import { CourseModuleItem } from "@/lib/types";
import { ToneBadge } from "@/components/ui/ToneBadge";
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
} from "lucide-react";
import { toast } from "sonner";

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
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    "mod-1": true,
    "mod-2": true,
  });

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  const getLessonIcon = (type: string) => {
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="body-medium text-primary-500 font-semibold">
            Course Content & Modular Structure
          </h3>
          <p className="body-xsm-regular subtext-500 mt-0.5">
            {displayModules.length} Modules • {totalLessons} Lessons • {formattedHours} Total Length
          </p>
        </div>
        <SecondaryButton
          size="sm"
          icon={<Plus className="w-3.5 h-3.5" />}
          onClick={() =>
            toast.info("Add Module", {
              description: "Use the Curriculum Builder to add or edit modules.",
            })
          }
        >
          Add Module
        </SecondaryButton>
      </div>

      {/* Accordion List of Modules */}
      <div className="space-y-3">
        {displayModules.map((module, mIdx) => {
          const isExpanded = !!expandedModules[module.id];
          return (
            <div
              key={module.id}
              className="rounded-[10px] border border-[#EDEDED] bg-white overflow-hidden shadow-2xs"
            >
              {/* Module Header Bar */}
              <button
                type="button"
                onClick={() => toggleModule(module.id)}
                className="w-full px-4 py-3 bg-[#F8F9FA] hover:bg-[#F3F4F6] transition-colors flex items-center justify-between text-left cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-[#EBF4FC] text-[#1C4D8D] font-bold text-xs flex items-center justify-center shrink-0">
                    {mIdx + 1}
                  </span>
                  <div>
                    <span className="body-sm-medium text-primary-500 font-bold block">
                      {module.title}
                    </span>
                    <span className="body-xsm-regular subtext-500">
                      {module.lessons.length} lectures • {Math.round(module.durationMinutes || 45)} mins
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-primary-300" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-primary-300" />
                  )}
                </div>
              </button>

              {/* Lesson Items inside Module */}
              {isExpanded && (
                <div className="divide-y divide-[#EDEDED] px-4 py-1">
                  {module.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="py-2.5 flex items-center justify-between gap-3 text-left hover:bg-gray-50/50 px-2 rounded-md transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                          {getLessonIcon(lesson.type || "VIDEO")}
                        </div>
                        <div className="min-w-0">
                          <span className="body-sm-regular text-primary-500 block truncate">
                            {lesson.title}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        {lesson.isPreview && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Eye className="w-3 h-3" />
                            <span>Preview</span>
                          </span>
                        )}

                        <span className="body-xsm-regular subtext-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{lesson.durationMinutes}m</span>
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
                          {lesson.type}
                        </ToneBadge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
