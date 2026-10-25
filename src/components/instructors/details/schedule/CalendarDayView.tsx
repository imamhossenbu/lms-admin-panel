"use client";

import React from "react";
import { CalendarX2 } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { CourseThumb } from "../CourseThumb";
import { EVENT_TYPE_META, ScheduleEvent, formatTime } from "./scheduleData";

interface CalendarDayViewProps {
  events: ScheduleEvent[];
}

export function CalendarDayView({ events }: CalendarDayViewProps) {
  if (events.length === 0) {
    return (
      <div className="min-h-80 flex flex-col items-center justify-center gap-2 text-center p-8">
        <CalendarX2 className="w-8 h-8 text-primary-300" />
        <p className="body-sm-regular text-primary-300">No classes scheduled for this day.</p>
      </div>
    );
  }

  return (
    <ul className="min-h-80 divide-y divide-dash">
      {events.map((event) => {
        const meta = EVENT_TYPE_META[event.type];
        return (
          <li key={event.id} className="flex items-center gap-4 px-5 py-4">
            <div className="w-24 shrink-0">
              <p className="body-sm-medium text-primary-500">{formatTime(event.start)}</p>
              <p className="body-xsm-regular text-primary-300">to {formatTime(event.end)}</p>
            </div>
            <span className={`w-1 self-stretch rounded-full ${meta.dot}`} />
            <CourseThumb course={event.course} size="md" />
            <div className="flex-1 min-w-0">
              <p className={`body-sm-medium text-primary-500 truncate ${event.status === "Cancelled" ? "line-through" : ""}`}>
                {event.title}
              </p>
              <p className="body-xsm-regular text-primary-300 truncate">{event.course.title}</p>
            </div>
            <ToneBadge tone="navy" size="sm" dot className={meta.soft}>
              {meta.label}
            </ToneBadge>
          </li>
        );
      })}
    </ul>
  );
}

export default CalendarDayView;
