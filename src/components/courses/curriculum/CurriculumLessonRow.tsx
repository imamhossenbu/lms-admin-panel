"use client";

import React from "react";
import { PlayCircle, FileText, HelpCircle, Clock, Eye, Edit3, Trash2 } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { LessonItem } from "./types";

interface CurriculumLessonRowProps {
  lesson: LessonItem;
  moduleId: string;
  onEdit: (moduleId: string, lesson: LessonItem) => void;
  onDelete: (moduleId: string, lessonId: string, lessonTitle: string) => void;
}

export function CurriculumLessonRow({
  lesson,
  moduleId,
  onEdit,
  onDelete,
}: CurriculumLessonRowProps) {
  const getLessonIcon = (type: string) => {
    switch (type) {
      case "VIDEO":
        return <PlayCircle className="w-3.5 h-3.5 text-[#1C4D8D]" />;
      case "QUIZ":
        return <HelpCircle className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-amber-600" />;
    }
  };

  return (
    <div className="p-2.5 rounded-[8px] bg-white border border-[#EDEDED] flex items-center justify-between gap-3 hover:border-gray-300 transition-colors group">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-6 h-6 rounded-md bg-[#F8F9FA] flex items-center justify-center shrink-0">
          {getLessonIcon(lesson.type)}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="body-sm-medium text-primary-500 truncate block">
              {lesson.title}
            </span>
            {lesson.isPreview && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                <Eye className="w-2.5 h-2.5" />
                <span>Free Preview</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
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

        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onEdit(moduleId, lesson)}
            className="p-1 rounded text-primary-400 hover:text-[#1C4D8D] hover:bg-blue-50 transition-colors cursor-pointer"
            title="Edit Lesson"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(moduleId, lesson.id, lesson.title)}
            className="p-1 rounded text-primary-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Delete Lesson"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
