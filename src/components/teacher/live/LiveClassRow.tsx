"use client";

import React from "react";
import { motion } from "framer-motion";
import { Ban, Pencil, PlayCircle, Radio, Users, Video } from "lucide-react";
import type { TeacherLive } from "@/types/teacher";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { fmtDateTime } from "../shared/format";

/** One live class: when, course, status; Start / Edit / Cancel while upcoming, recording + attendance after. */
export function LiveClassRow({ l, mine, onEdit, onCancel, onRecording }: { l: TeacherLive; mine: boolean; onEdit: () => void; onCancel: () => void; onRecording: () => void }) {
  const ghost = "inline-flex h-9 items-center gap-1.5 rounded-lg border border-dash bg-white px-3 body-sm-medium text-primary-500 hover:border-primary-300";
  return (
    <motion.div layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.2 }} className="dashboard-card shadow-2xs flex flex-wrap items-center gap-4 p-4">
      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-orange-light text-brand-orange">
        <Radio className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate body-medium font-semibold text-primary-500">{l.title}</p>
        <p className="truncate body-xsm-regular text-primary-300">
          {fmtDateTime(l.startTime)} · {l.course.title}
        </p>
      </div>
      {l.status === "ENDED" && (
        <span className="inline-flex items-center gap-1.5 body-xsm-medium text-primary-400">
          <Users className="h-3.5 w-3.5" />
          {l.attendees} attended
        </span>
      )}
      <ToneBadge tone={l.status === "LIVE" ? "red" : l.status === "UPCOMING" ? "orange" : "gray"} size="sm" dot>
        {l.status === "LIVE" ? "Live now" : l.status === "UPCOMING" ? "Upcoming" : "Ended"}
      </ToneBadge>
      {l.status === "UPCOMING" && mine && (
        <>
          <motion.button type="button" whileTap={{ scale: 0.95 }} onClick={onEdit} className={ghost} aria-label={`Edit ${l.title}`}>
            <Pencil className="h-4 w-4" />
            Edit
          </motion.button>
          <motion.button type="button" whileTap={{ scale: 0.95 }} onClick={onCancel} className={`${ghost} hover:border-red hover:text-red`} aria-label={`Cancel ${l.title}`}>
            <Ban className="h-4 w-4" />
            Cancel
          </motion.button>
        </>
      )}
      {l.status !== "ENDED" ? (
        <a href={l.meetingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-orange px-3 body-sm-medium text-white hover:bg-brand-orange-hover">
          <Video className="h-4 w-4" />
          Start
        </a>
      ) : (
        <>
          {l.recordingUrl && (
            <a href={l.recordingUrl} target="_blank" rel="noopener noreferrer" className={ghost}>
              <PlayCircle className="h-4 w-4" />
              Recording
            </a>
          )}
          {mine && (
            <motion.button type="button" whileTap={{ scale: 0.95 }} onClick={onRecording} className={ghost}>
              <Pencil className="h-4 w-4" />
              {l.recordingUrl ? "Change recording" : "Add recording"}
            </motion.button>
          )}
        </>
      )}
    </motion.div>
  );
}

export default LiveClassRow;
