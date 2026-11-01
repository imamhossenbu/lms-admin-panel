"use client";

import React from "react";
import { motion } from "framer-motion";
import { CalendarClock, CalendarX } from "lucide-react";
import type { LiveClassItem, LiveDisplayStatus } from "@/types/liveClass";
import { formatLiveDate, timeRangeLabel } from "../../liveDetailFormat";

/** Empty state before the class starts (or when it was cancelled). */
export function AttendanceNotStarted({ liveClass, status }: { liveClass: LiveClassItem; status: LiveDisplayStatus }) {
  const cancelled = status === "CANCELLED";
  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="dashboard-card shadow-2xs flex flex-col items-center gap-3 px-6 py-14 text-center"
    >
      <span className={cancelled ? "flex h-14 w-14 items-center justify-center rounded-2xl bg-red-14 text-red" : "flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-14 text-blue"}>
        {cancelled ? <CalendarX className="h-7 w-7" /> : <CalendarClock className="h-7 w-7" />}
      </span>
      <h3 className="heading-h6 text-primary-500">{cancelled ? "This class was cancelled" : "Attendance hasn't started yet"}</h3>
      <p className="max-w-md body-sm-regular text-primary-300">
        {cancelled
          ? "No attendance is recorded for cancelled classes. Restore the class to reopen it."
          : `Attendance will be recorded when the class starts on ${formatLiveDate(liveClass.date)}, ${timeRangeLabel(liveClass)}.`}
      </p>
    </motion.section>
  );
}

export default AttendanceNotStarted;
