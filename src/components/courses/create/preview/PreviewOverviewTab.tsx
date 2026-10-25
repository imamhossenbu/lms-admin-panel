import React from "react";
import { Award, BookOpen, Clock, LockOpen } from "lucide-react";
import { formatMinutes, outlineStats } from "../aiOutline";
import type { CoursePreviewData } from "./previewTypes";

/** "About This Course" with the short description and quick stat chips. */
export function PreviewOverviewTab({ data }: { data: CoursePreviewData }) {
  const stats = data.outline ? outlineStats(data.outline) : null;
  const chips = [
    { icon: BookOpen, label: `${stats?.lessonCount ?? 0} Lessons` },
    { icon: Clock, label: stats?.totalMinutes ? formatMinutes(stats.totalMinutes) : "0 Hours" },
    { icon: Award, label: "Certificate" },
    { icon: LockOpen, label: "Lifetime Access" },
  ];

  return (
    <div className="rounded-xl border border-dash p-4 text-left">
      <h4 className="body-md-medium font-semibold text-primary-500">About This Course</h4>
      <p className="body-sm-regular text-primary-300 mt-2 break-words">
        {data.shortDescription || "Your short description will appear here as you type."}
      </p>
      <div className="mt-4 pt-4 border-t border-dash flex flex-wrap gap-x-4 gap-y-2.5">
        {chips.map(({ icon: Icon, label }) => (
          <span key={label} className="inline-flex items-center gap-1.5 body-xsm-medium text-primary-400 whitespace-nowrap">
            <Icon className="w-4 h-4 text-brand-orange" />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default PreviewOverviewTab;
