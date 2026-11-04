"use client";

import React from "react";
import { Clock, BookOpen, CheckCircle, FileText, Bookmark } from "lucide-react";
import { StudentActivityTimelineItem } from "@/types/studentDetails";

interface RecentActivityTimelineCardProps {
  activities: StudentActivityTimelineItem[];
  onViewAll?: () => void;
}

export function RecentActivityTimelineCard({
  activities,
  onViewAll,
}: RecentActivityTimelineCardProps) {
  const getIconAndColor = (type: StudentActivityTimelineItem["type"]) => {
    switch (type) {
      case "lesson":
        return {
          icon: <BookOpen className="w-3.5 h-3.5 text-green" />,
          dotBg: "bg-green",
          iconBg: "bg-green-bg",
        };
      case "quiz":
        return {
          icon: <CheckCircle className="w-3.5 h-3.5 text-blue" />,
          dotBg: "bg-blue",
          iconBg: "bg-blue-14",
        };
      case "assignment":
        return {
          icon: <FileText className="w-3.5 h-3.5 text-brand-orange" />,
          dotBg: "bg-brand-orange",
          iconBg: "bg-brand-orange-light",
        };
      case "enroll":
      default:
        return {
          icon: <Bookmark className="w-3.5 h-3.5 text-purple" />,
          dotBg: "bg-purple",
          iconBg: "bg-purple-14",
        };
    }
  };

  return (
    <div className="bg-white rounded-xl border border-dash p-6 space-y-4 shadow-2xs text-left">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-14 text-blue flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <h2 className="title-medium text-primary-500">
            Recent Activity
          </h2>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dash bg-white text-primary-500 hover:bg-slate-50 body-xsm-medium transition-colors shadow-2xs cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Connected Timeline */}
      <div className="relative pl-6 space-y-6 pt-2">
        {/* Continuous vertical timeline connector line */}
        <div className="absolute left-2.25 top-3 bottom-3 w-0.5 bg-slate-200" />

        {activities.map((act) => {
          const config = getIconAndColor(act.type);
          return (
            <div key={act.id} className="relative flex items-start gap-3">
              {/* Timeline Indicator Dot */}
              <div
                className={`absolute -left-4.75 top-1.5 w-2.5 h-2.5 rounded-full ${config.dotBg} ring-4 ring-white`}
              />

              {/* Icon Container */}
              <div
                className={`w-7 h-7 rounded-lg ${config.iconBg} flex items-center justify-center shrink-0 mt-0.5`}
              >
                {config.icon}
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <h4 className="body-sm-medium text-primary-500">
                    {act.title}
                  </h4>
                  <span className="body-2xsm-regular text-primary-300 shrink-0">
                    {act.timestamp}
                  </span>
                </div>
                <p className="body-xsm-regular text-primary-400 mt-0.5 truncate">
                  {act.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
