"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import type { LiveEnrollment } from "@/types/liveClass";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { formatMinutes, topEngaged } from "@/lib/liveClassStats";
import { StudentCell } from "../../common/StudentCell";

/** Top 5 attendees by watch minutes. */
export function TopEngagedCard({ enrollments }: { enrollments: LiveEnrollment[] }) {
  const top = topEngaged(enrollments, 5);
  return (
    <IconSectionCard icon={<Trophy className="h-5 w-5" />} tone="yellow" title="Top Engaged Students" description="By watch duration">
      {top.length === 0 ? (
        <p className="body-sm-regular text-primary-300">No attendees yet.</p>
      ) : (
        <ol className="divide-y divide-dash">
          {top.map((r, i) => (
            <motion.li
              key={r.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.04 }}
              className="flex items-center gap-3 py-2.5"
            >
              <span className="w-5 shrink-0 text-center body-xsm-medium text-primary-300">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <StudentCell student={r.student} />
              </div>
              <span className="body-sm-medium font-semibold! text-primary-500 whitespace-nowrap">{formatMinutes(r.watchMinutes)}</span>
            </motion.li>
          ))}
        </ol>
      )}
    </IconSectionCard>
  );
}

export default TopEngagedCard;
