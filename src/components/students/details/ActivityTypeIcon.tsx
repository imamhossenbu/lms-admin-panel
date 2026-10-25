"use client";

import React from "react";
import { Play, FileText, BookOpen, X, User } from "lucide-react";
import { StudentActivityLogItem } from "./mockStudentDetails";

interface ActivityTypeIconProps {
  type: StudentActivityLogItem["activityType"];
}

export function ActivityTypeIcon({ type }: ActivityTypeIconProps) {
  switch (type) {
    case "completed_quiz":
      return (
        <div
          className="w-8 h-8 rounded-full bg-green-bg text-green flex items-center justify-center shrink-0 border border-green/20 shadow-2xs"
          title="Completed Quiz"
        >
          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
        </div>
      );
    case "submitted_assignment":
      return (
        <div
          className="w-8 h-8 rounded-full bg-purple-14 text-purple flex items-center justify-center shrink-0 border border-purple/20 shadow-2xs"
          title="Submitted Assignment"
        >
          <FileText className="w-3.5 h-3.5" />
        </div>
      );
    case "enrolled_course":
      return (
        <div
          className="w-8 h-8 rounded-full bg-blue-14 text-blue flex items-center justify-center shrink-0 border border-blue/20 shadow-2xs"
          title="Enrolled in Course"
        >
          <BookOpen className="w-3.5 h-3.5" />
        </div>
      );
    case "failed_quiz":
      return (
        <div
          className="w-8 h-8 rounded-full bg-red-14 text-red flex items-center justify-center shrink-0 border border-red/20 shadow-2xs"
          title="Failed Quiz"
        >
          <X className="w-3.5 h-3.5 stroke-[2.5]" />
        </div>
      );
    case "account_created":
    default:
      return (
        <div
          className="w-8 h-8 rounded-full bg-slate-100 text-primary-400 flex items-center justify-center shrink-0 border border-dash shadow-2xs"
          title="Account Created"
        >
          <User className="w-3.5 h-3.5" />
        </div>
      );
  }
}
