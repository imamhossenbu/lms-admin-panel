"use client";

import React from "react";
import { motion } from "framer-motion";
import { CalendarDays, CheckCircle2, LinkIcon, Users } from "lucide-react";
import type { LiveClassItem, LiveDisplayStatus, LiveEnrollment } from "@/types/liveClass";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { attendanceStats, courseOf } from "@/lib/liveClassStats";
import { htmlToText } from "@/lib/sanitizeHtml";
import { cn } from "@/lib/cn";
import { InstructorCell } from "../shared/InstructorCell";
import { PlatformBadge } from "../shared/PlatformBadge";
import { formatLiveDate, isLinkActive, STATUS_DOT, STATUS_LABEL, STATUS_TEXT, timeRangeLabel } from "./liveDetailFormat";
import { SummaryInfoItem } from "./SummaryInfoItem";
import { LargeCourseTile } from "./common/LargeCourseTile";

export interface LiveClassSummaryCardProps {
  liveClass: LiveClassItem;
  enrollments: LiveEnrollment[];
  status: LiveDisplayStatus;
  now: Date;
}

/** Course tile, title, course, plain description and the info strip (instructor, time, platform, attendees, status). */
export function LiveClassSummaryCard({ liveClass, enrollments, status, now }: LiveClassSummaryCardProps) {
  const course = courseOf(liveClass.courseId);
  const stats = attendanceStats(enrollments);
  const linkActive = isLinkActive(liveClass, status, now);
  const description = htmlToText(liveClass.descriptionHtml);

  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="dashboard-card shadow-2xs p-5 sm:p-6"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <LargeCourseTile courseId={liveClass.courseId} />
        <div className="min-w-0 flex-1 sm:border-l sm:border-dash sm:pl-5">
          <h2 className="heading-h5 font-bold! text-primary-500">{liveClass.title}</h2>
          <p className="mt-1 flex flex-wrap items-center gap-3 body-sm-regular text-primary-300">
            <span>Live Class</span>
            <span aria-hidden className="h-4 w-px bg-slate-200" />
            <span>{course?.title ?? "Unknown course"}</span>
          </p>
          {description && <p className="mt-2 max-w-3xl body-sm-regular text-primary-400 line-clamp-2">{description}</p>}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 border-t border-dash pt-5 sm:grid-cols-2 xl:grid-cols-5 xl:divide-x xl:divide-dash">
        <div className="min-w-0 xl:pr-4">
          <InstructorCell instructorId={liveClass.instructorId} showEmail size={40} />
        </div>
        <SummaryInfoItem icon={<CalendarDays className="h-5 w-5" />} title={formatLiveDate(liveClass.date)} caption={timeRangeLabel(liveClass)} />
        <div className="flex min-w-0 flex-wrap items-center gap-2.5 xl:px-4">
          <PlatformBadge platform={liveClass.platform} />
          {linkActive ? (
            <ToneBadge tone="green" size="sm" icon={<CheckCircle2 className="h-3 w-3" />}>
              Live Link Active
            </ToneBadge>
          ) : (
            <ToneBadge tone="gray" size="sm" icon={<LinkIcon className="h-3 w-3" />}>
              Link expired
            </ToneBadge>
          )}
        </div>
        <SummaryInfoItem
          icon={<Users className="h-5 w-5" />}
          title={
            <>
              {stats.attended} <span className="body-sm-regular text-primary-300">/ {stats.enrolled}</span>
            </>
          }
          caption="Attendees"
        />
        <SummaryInfoItem
          icon={<span className={cn("h-3 w-3 rounded-full", STATUS_DOT[status])} />}
          title={<span className={STATUS_TEXT[status]}>{STATUS_LABEL[status]}</span>}
          caption="Status"
        />
      </div>
    </motion.section>
  );
}

export default LiveClassSummaryCard;
