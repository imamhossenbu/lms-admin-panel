"use client";

import React, { useMemo } from "react";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import {
  CalendarView,
  EVENT_TYPE_META,
  ScheduleEvent,
  ScheduleEventType,
  getRangeLabel,
  toDateKey,
} from "./scheduleData";
import { CalendarMonthGrid } from "./CalendarMonthGrid";
import { CalendarWeekView } from "./CalendarWeekView";
import { CalendarDayView } from "./CalendarDayView";

interface ScheduleCalendarProps {
  view: CalendarView;
  anchor: Date;
  today: Date;
  events: ScheduleEvent[];
  onViewChange: (view: CalendarView) => void;
  onOpenDay: (date: Date) => void;
}

export function ScheduleCalendar({ view, anchor, today, events, onViewChange, onOpenDay }: ScheduleCalendarProps) {
  const eventsByDay = useMemo(() => {
    const map = new Map<string, ScheduleEvent[]>();
    events.forEach((event) => {
      const key = toDateKey(new Date(event.start));
      map.set(key, [...(map.get(key) ?? []), event]);
    });
    return map;
  }, [events]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-dash bg-white overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-dash">
          <h3 className="title-medium font-bold text-primary-500">{getRangeLabel(anchor, view)}</h3>
          <SegmentedControl<CalendarView>
            value={view}
            onChange={onViewChange}
            options={[
              { value: "month", label: "Month" },
              { value: "week", label: "Week" },
              { value: "day", label: "Day" },
            ]}
          />
        </div>

        <div className="overflow-x-auto">
          <div className={view === "day" ? "" : "min-w-160"}>
            {view === "month" && (
              <CalendarMonthGrid anchor={anchor} today={today} eventsByDay={eventsByDay} onOpenDay={onOpenDay} />
            )}
            {view === "week" && (
              <CalendarWeekView anchor={anchor} today={today} eventsByDay={eventsByDay} onOpenDay={onOpenDay} />
            )}
            {view === "day" && <CalendarDayView events={eventsByDay.get(toDateKey(anchor)) ?? []} />}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-1">
        {(Object.keys(EVENT_TYPE_META) as ScheduleEventType[]).map((type) => (
          <span key={type} className="inline-flex items-center gap-2 body-sm-regular text-primary-400">
            <span className={`w-3 h-3 rounded-full ${EVENT_TYPE_META[type].dot}`} />
            {EVENT_TYPE_META[type].label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default ScheduleCalendar;
