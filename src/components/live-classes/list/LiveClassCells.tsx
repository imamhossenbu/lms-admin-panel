import React from "react";
import { CalendarDays, Users } from "lucide-react";
import type { LiveClassItem, LiveDisplayStatus } from "@/types/liveClass";
import { CourseTile } from "../shared/CourseTile";
import { LIVE_TYPE_LABEL, formatLiveDate } from "../shared/liveClassView";
import { hasStarted, timeRange } from "./liveListUtils";

/** Course tile + title + "Course · Live Class" (Course column merged in to fit ~1280px). */
export function ClassTitleCell({ item, courseTitle }: { item: LiveClassItem; courseTitle: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <CourseTile courseId={item.courseId} />
      <div className="min-w-0">
        <p className="truncate body-sm-medium font-semibold! text-primary-500" title={item.title}>
          {item.title}
        </p>
        <p className="truncate body-xsm-regular text-primary-300" title={`${courseTitle} · ${LIVE_TYPE_LABEL[item.type]}`}>
          {courseTitle} · {LIVE_TYPE_LABEL[item.type]}
        </p>
      </div>
    </div>
  );
}

/** Calendar icon + "Oct 20, 2026" over "10:00 AM - 11:00 AM". */
export function DateTimeCell({ item }: { item: LiveClassItem }) {
  return (
    <div className="flex items-center gap-2">
      <CalendarDays className="w-4 h-4 text-primary-300 shrink-0" />
      <div className="min-w-0">
        <p className="body-sm-regular text-primary-500 whitespace-nowrap">{formatLiveDate(item.date)}</p>
        <p className="body-2xsm-regular text-primary-300 whitespace-nowrap">{timeRange(item)}</p>
      </div>
    </div>
  );
}

/** "120 / 150" once the class has started, "0 / 150" before. */
export function AttendeesCell({ attendees, capacity, status }: { attendees: number; capacity: number; status: LiveDisplayStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap body-sm-regular text-primary-500 tabular-nums">
      <Users className="w-4 h-4 text-primary-300 shrink-0" />
      {hasStarted(status) ? attendees : 0} / {capacity}
    </span>
  );
}
