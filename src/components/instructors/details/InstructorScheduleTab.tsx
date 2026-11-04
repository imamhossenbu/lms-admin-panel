"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { instructorsApi } from "@/lib/api/instructors";
import { apiErrorMessage } from "@/lib/apiError";
import { toScheduleView } from "@/lib/instructors/instructorView";
import { AppSelect } from "@/components/ui/AppSelect";
import { useUrlParams } from "@/lib/useUrlParams";
import { DetailCard } from "@/components/ui/DetailCard";
import { InstructorCourseRow } from "./instructorDetailsData";
import {
  CalendarView,
  ScheduleEvent,
  fromDateKey,
  getRangeLabel,
  shiftAnchor,
  toDateKey,
} from "./schedule/scheduleData";
import { UpcomingClassesCard } from "./schedule/UpcomingClassesCard";
import { ScheduleCalendar } from "./schedule/ScheduleCalendar";

const VIEWS: CalendarView[] = ["month", "week", "day"];

interface InstructorScheduleTabProps {
  instructorId: string;
  instructorEmail: string;
  courses: InstructorCourseRow[];
}

const NavButton = ({ onClick, label, children }: { onClick: () => void; label: string; children: React.ReactNode }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className="w-10 h-11 rounded-lg border border-dash bg-white text-primary-500 hover:bg-slate-50 flex items-center justify-center transition-colors cursor-pointer"
  >
    {children}
  </button>
);

export function InstructorScheduleTab({ instructorId, instructorEmail, courses }: InstructorScheduleTabProps) {
  const { get, set } = useUrlParams();
  const [today] = useState(() => new Date());

  const viewParam = get("view") as CalendarView;
  const view: CalendarView = VIEWS.includes(viewParam) ? viewParam : "month";
  const anchor = fromDateKey(get("date")) ?? today;
  const course = get("course", "All");

  // Live classes + assignment deadlines for the visible month (± one week so week views at the edges fill).
  const monthKey = `${anchor.getFullYear()}-${anchor.getMonth()}`;
  const [loaded, setLoaded] = useState<{ key: string; events: ScheduleEvent[] } | null>(null);
  useEffect(() => {
    let alive = true;
    const [y, m] = monthKey.split("-").map(Number);
    const from = new Date(y, m, 1 - 7).toISOString();
    const to = new Date(y, m + 1, 1 + 7).toISOString();
    instructorsApi
      .schedule(instructorId, { from, to })
      .then((rows) => alive && setLoaded({ key: monthKey, events: rows.map((e) => toScheduleView(e, courses)) }))
      .catch((err) => {
        if (!alive) return;
        setLoaded({ key: monthKey, events: [] });
        toast.error("Couldn't load the schedule", { id: "instructor-schedule", description: apiErrorMessage(err) });
      });
    return () => {
      alive = false;
    };
  }, [instructorId, monthKey, courses]);

  const events = useMemo(() => (loaded?.events ?? []).filter((e) => course === "All" || e.course.id === course), [loaded, course]);
  const isLoading = loaded?.key !== monthKey;

  const upcoming = events.filter((e) => new Date(e.end) >= today);

  const goTo = (date: Date, nextView: CalendarView = view) =>
    set({ date: toDateKey(date) === toDateKey(today) ? null : toDateKey(date), view: nextView === "month" ? null : nextView });

  return (
    <DetailCard
      title="Schedule"
      description="View and manage this instructor's upcoming and past classes."
      action={
        <div className="flex flex-wrap items-center gap-2.5">
          <AppSelect
            value={course}
            onValueChange={(value) => set({ course: value })}
            options={[{ value: "All", label: "All Courses" }, ...courses.map((c) => ({ value: c.id, label: c.title }))]}
            className="w-56"
            triggerClassName="w-full h-11 bg-white"
          />
          <div className="flex items-center gap-2">
            <NavButton label="Previous" onClick={() => goTo(shiftAnchor(anchor, view, -1))}>
              <ChevronLeft className="w-4 h-4" />
            </NavButton>
            <span className="body-sm-medium text-primary-500 min-w-32 text-center whitespace-nowrap">
              {view === "month" ? getRangeLabel(anchor, "month") : getRangeLabel(anchor, view)}
            </span>
            <NavButton label="Next" onClick={() => goTo(shiftAnchor(anchor, view, 1))}>
              <ChevronRight className="w-4 h-4" />
            </NavButton>
          </div>
          <button
            type="button"
            onClick={() => goTo(today)}
            className="h-11 px-5 rounded-lg border border-dash bg-white body-sm-medium text-blue hover:bg-blue-14 transition-colors cursor-pointer"
          >
            Today
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 2xl:grid-cols-12 gap-5 items-start">
        <div className="2xl:col-span-5">
          <UpcomingClassesCard
            events={upcoming}
            instructorEmail={instructorEmail}
            onViewOnCalendar={(event) => goTo(new Date(event.start), "day")}
            isLoading={isLoading}
          />
        </div>
        <div className="2xl:col-span-7">
          <ScheduleCalendar
            view={view}
            anchor={anchor}
            today={today}
            events={events}
            onViewChange={(next) => goTo(anchor, next)}
            onOpenDay={(date) => goTo(date, "day")}
          />
        </div>
      </div>
    </DetailCard>
  );
}

export default InstructorScheduleTab;
