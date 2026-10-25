"use client";

import React from "react";
import { CalendarSearch, Mail, XCircle, RotateCcw } from "lucide-react";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { DropdownActionItem } from "@/components/ui/AppDropdownMenu";
import { RowMoreMenu } from "@/components/ui/RowMoreMenu";
import { ScheduleEvent, formatTime } from "./scheduleData";

interface UpcomingClassItemProps {
  event: ScheduleEvent;
  onViewOnCalendar: (event: ScheduleEvent) => void;
  onToggleCancel: (event: ScheduleEvent) => void;
  instructorEmail: string;
}

const STATUS_TONE = { Upcoming: "blue", Completed: "green", Cancelled: "red" } as const;

export function UpcomingClassItem({ event, onViewOnCalendar, onToggleCancel, instructorEmail }: UpcomingClassItemProps) {
  const start = new Date(event.start);
  const isCancelled = event.status === "Cancelled";

  const actions: DropdownActionItem[] = [
    {
      key: "calendar",
      label: "View on Calendar",
      icon: <CalendarSearch className="w-3.5 h-3.5 text-primary-400" />,
      onClick: () => onViewOnCalendar(event),
    },
    {
      key: "remind",
      label: "Email Instructor",
      icon: <Mail className="w-3.5 h-3.5 text-primary-400" />,
      onClick: () => {
        window.location.href = `mailto:${instructorEmail}?subject=${encodeURIComponent(event.title)}`;
      },
    },
    isCancelled
      ? {
          key: "restore",
          label: "Restore Class",
          icon: <RotateCcw className="w-3.5 h-3.5 text-primary-400" />,
          separatorBefore: true,
          onClick: () => onToggleCancel(event),
        }
      : {
          key: "cancel",
          label: "Cancel Class",
          icon: <XCircle className="w-3.5 h-3.5" />,
          danger: true,
          separatorBefore: true,
          onClick: () => onToggleCancel(event),
        },
  ];

  return (
    <li className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
      <div className="w-16 h-16 rounded-xl bg-blue-14 text-blue flex flex-col items-center justify-center shrink-0">
        <span className="body-xsm-medium uppercase">
          {start.toLocaleDateString("en-US", { month: "short" })}
        </span>
        <span className="heading-h5 font-bold leading-none mt-0.5">
          {String(start.getDate()).padStart(2, "0")}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="body-xsm-regular text-primary-300">
          {formatTime(event.start)} - {formatTime(event.end)}
        </p>
        <p className={`body-sm-medium font-semibold text-primary-500 truncate ${isCancelled ? "line-through" : ""}`}>
          {event.title}
        </p>
        <p className="body-xsm-regular text-primary-300 truncate">{event.course.title}</p>
      </div>

      <ToneBadge tone={STATUS_TONE[event.status]}>{event.status}</ToneBadge>
      <RowMoreMenu items={actions} />
    </li>
  );
}

export default UpcomingClassItem;
