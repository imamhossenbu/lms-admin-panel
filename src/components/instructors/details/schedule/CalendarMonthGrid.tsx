"use client";

import React from "react";
import { cn } from "@/lib/cn";
import { ScheduleEvent, WEEKDAYS, getMonthGrid, isSameDay, toDateKey } from "./scheduleData";
import { CalendarEventChip } from "./CalendarEventChip";

interface CalendarMonthGridProps {
  anchor: Date;
  today: Date;
  eventsByDay: Map<string, ScheduleEvent[]>;
  onOpenDay: (date: Date) => void;
}

export function CalendarMonthGrid({ anchor, today, eventsByDay, onOpenDay }: CalendarMonthGridProps) {
  const days = getMonthGrid(anchor);

  return (
    <div>
      <div className="grid grid-cols-7 bg-slate-50 border-b border-dash divide-x divide-dash">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-2.5 text-center body-sm-medium text-primary-400">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 [&>*]:border-r [&>*]:border-b [&>*]:border-dash [&>*:nth-child(7n)]:border-r-0 [&>*:nth-last-child(-n+7)]:border-b-0">
        {days.map((date) => {
          const inMonth = date.getMonth() === anchor.getMonth();
          const isToday = isSameDay(date, today);
          const events = eventsByDay.get(toDateKey(date)) ?? [];

          return (
            <div
              key={toDateKey(date)}
              role="button"
              tabIndex={0}
              onClick={() => onOpenDay(date)}
              onKeyDown={(e) => e.key === "Enter" && onOpenDay(date)}
              className={cn(
                "min-h-24 p-2 text-left transition-colors cursor-pointer hover:bg-slate-50 focus:outline-none focus-visible:bg-slate-50",
                isToday && "bg-blue-14 hover:bg-blue-14"
              )}
            >
              <span
                className={cn(
                  "inline-flex items-center justify-center w-7 h-7 rounded-full body-sm-medium",
                  isToday ? "bg-blue text-white" : inMonth ? "text-primary-500" : "text-primary-300"
                )}
              >
                {date.getDate()}
              </span>

              {events.length > 0 && (
                <div className="mt-1">
                  <CalendarEventChip event={events[0]} onClick={() => onOpenDay(date)} />
                  {events.length > 1 && (
                    <span className="block body-2xsm-regular text-primary-300 pl-4.5">
                      +{events.length - 1} more
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CalendarMonthGrid;
