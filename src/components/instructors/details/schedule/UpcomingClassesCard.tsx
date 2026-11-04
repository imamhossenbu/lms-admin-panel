"use client";

import React, { useState } from "react";
import { CalendarX2 } from "lucide-react";
import { ScheduleEvent } from "./scheduleData";
import { UpcomingClassItem } from "./UpcomingClassItem";

const COLLAPSED_COUNT = 6;

interface UpcomingClassesCardProps {
  events: ScheduleEvent[];
  instructorEmail: string;
  onViewOnCalendar: (event: ScheduleEvent) => void;
  isLoading?: boolean;
}

export function UpcomingClassesCard({ events, instructorEmail, onViewOnCalendar, isLoading = false }: UpcomingClassesCardProps) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? events : events.slice(0, COLLAPSED_COUNT);

  return (
    <div className="rounded-xl border border-dash bg-white">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-dash">
        <h3 className="title-medium text-primary-500">Upcoming Classes ({events.length})</h3>
        {events.length > COLLAPSED_COUNT && (
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            className="body-sm-medium text-blue hover:underline cursor-pointer"
          >
            {showAll ? "Show Less" : "View All"}
          </button>
        )}
      </div>

      {isLoading ? (
        <ul className="divide-y divide-dash p-5 animate-pulse" aria-busy="true">
          {Array.from({ length: 4 }, (_, i) => (
            <li key={i} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
              <div className="w-16 h-16 rounded-xl bg-slate-100 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 rounded bg-slate-100" />
                <div className="h-3.5 w-48 rounded bg-slate-200" />
                <div className="h-3 w-32 rounded bg-slate-100" />
              </div>
              <div className="h-5 w-16 rounded-full bg-slate-100" />
            </li>
          ))}
        </ul>
      ) : visible.length > 0 ? (
        <ul className="divide-y divide-dash p-5">
          {visible.map((event) => (
            <UpcomingClassItem
              key={event.id}
              event={event}
              instructorEmail={instructorEmail}
              onViewOnCalendar={onViewOnCalendar}
            />
          ))}
        </ul>
      ) : (
        <div className="p-10 flex flex-col items-center text-center gap-2">
          <CalendarX2 className="w-8 h-8 text-primary-300" />
          <p className="body-sm-regular text-primary-300">No upcoming live classes or assignment deadlines.</p>
        </div>
      )}
    </div>
  );
}

export default UpcomingClassesCard;
