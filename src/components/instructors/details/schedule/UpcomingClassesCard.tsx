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
  onToggleCancel: (event: ScheduleEvent) => void;
}

export function UpcomingClassesCard({ events, instructorEmail, onViewOnCalendar, onToggleCancel }: UpcomingClassesCardProps) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? events : events.slice(0, COLLAPSED_COUNT);

  return (
    <div className="rounded-xl border border-dash bg-white">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-dash">
        <h3 className="title-medium font-bold text-primary-500">Upcoming Classes ({events.length})</h3>
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

      {visible.length > 0 ? (
        <ul className="divide-y divide-dash p-5">
          {visible.map((event) => (
            <UpcomingClassItem
              key={event.id}
              event={event}
              instructorEmail={instructorEmail}
              onViewOnCalendar={onViewOnCalendar}
              onToggleCancel={onToggleCancel}
            />
          ))}
        </ul>
      ) : (
        <div className="p-10 flex flex-col items-center text-center gap-2">
          <CalendarX2 className="w-8 h-8 text-primary-300" />
          <p className="body-sm-regular text-primary-300">No upcoming classes for the selected course.</p>
        </div>
      )}
    </div>
  );
}

export default UpcomingClassesCard;
