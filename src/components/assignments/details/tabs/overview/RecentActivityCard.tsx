"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import type { AssignmentSubmission } from "@/types/assignment";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { recentActivity, timeAgo } from "@/lib/assignmentStats";
import { StudentInitialsAvatar } from "../submissions/StudentInitialsAvatar";
import { CardHeaderButton } from "../../sidebar/CardHeaderButton";

export interface RecentActivityCardProps {
  submissions: AssignmentSubmission[];
  onViewAll: () => void;
}

/** Latest submissions: initials avatar, "Name submitted an assignment", time ago. */
export function RecentActivityCard({ submissions, onViewAll }: RecentActivityCardProps) {
  const items = recentActivity(submissions, 4);
  return (
    <IconSectionCard
      icon={<Clock className="h-5 w-5" />}
      title="Recent Activity"
      action={<CardHeaderButton onClick={onViewAll}>View All</CardHeaderButton>}
      bodyClassName="mt-3"
    >
      {items.length === 0 ? (
        <p className="py-4 text-center body-sm-regular text-primary-300">No submissions yet.</p>
      ) : (
        <ul className="divide-y divide-dash">
          {items.map((s, i) => (
            <motion.li
              key={s.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.04 }}
              className="flex items-center gap-3 py-3"
            >
              <StudentInitialsAvatar name={s.student.name} />
              <div className="min-w-0">
                <p className="body-sm-regular text-primary-400">
                  <span className="body-sm-medium text-primary-500">{s.student.name}</span> submitted an assignment
                </p>
                <p className="body-xsm-regular text-primary-300">{timeAgo(s.submittedAt)}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </IconSectionCard>
  );
}

export default RecentActivityCard;
