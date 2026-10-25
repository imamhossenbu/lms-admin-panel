"use client";

import React from "react";
import { cn } from "@/lib/cn";
import { ScheduleEvent, WEEKDAYS, isSameDay, startOfWeek, toDateKey } from "./scheduleData";
import { CalendarEventChip } from "./CalendarEventChip";

interface CalendarWeekViewProps {
  anchor: Date;
  today: Date;
  eventsByDay: Map<string, ScheduleEvent[]>;
  onOpenDay: (date: Date) => void;
}

export function CalendarWeekView({ anchor, today, eventsByDay, onOpenDay }: CalendarWeekViewProps) {
  const start = startOfWeek(anchor);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });

  return (
    <div className="grid grid-cols-7 divide-x divide-dash">
      {days.map((date, idx) => {
        const isToday = isSameDay(date, today);
        const events = eventsByDay.get(toDateKey(date)) ?? [];
        return (
          <div key={toDateKey(date)} className={cn("min-h-80 flex flex-col", isToday && "bg-blue-14")}>
            <button
              type="button"
              onClick={() => onOpenDay(date)}
              className="py-2.5 border-b border-dash bg-slate-50 text-center cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <span className="block body-xsm-medium text-primary-400">{WEEKDAYS[idx]}</span>
              <span
                className={cn(
                  "inline-flex items-center justify-center w-7 h-7 mt-0.5 rounded-full body-sm-medium",
                  isToday ? "bg-blue text-white" : "text-primary-500"
                )}
              >
                {date.getDate()}
              </span>
            </button>
            <div className="p-1.5 space-y-1">
              {events.map((event) => (
                <CalendarEventChip key={event.id} event={event} onClick={() => onOpenDay(date)} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CalendarWeekView;
