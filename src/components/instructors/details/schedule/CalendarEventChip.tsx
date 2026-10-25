"use client";

import React from "react";
import { EVENT_TYPE_META, ScheduleEvent, formatTime } from "./scheduleData";

interface CalendarEventChipProps {
  event: ScheduleEvent;
  onClick?: (event: ScheduleEvent) => void;
}

/** Dot + short title + time, used inside month and week calendar cells. */
export function CalendarEventChip({ event, onClick }: CalendarEventChipProps) {
  const isCancelled = event.status === "Cancelled";
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(event);
      }}
      title={`${event.title} · ${formatTime(event.start)}`}
      className="w-full text-left rounded-md px-1 py-0.5 hover:bg-slate-50 transition-colors cursor-pointer"
    >
      <span className="flex items-center gap-1.5 min-w-0">
        <span className={`w-2 h-2 rounded-full shrink-0 ${EVENT_TYPE_META[event.type].dot}`} />
        <span className={`body-2xsm-regular text-primary-500 truncate ${isCancelled ? "line-through text-primary-300" : ""}`}>
          {event.shortTitle}
        </span>
      </span>
      <span className="block body-2xsm-regular text-primary-300 pl-3.5">{formatTime(event.start)}</span>
    </button>
  );
}

export default CalendarEventChip;
