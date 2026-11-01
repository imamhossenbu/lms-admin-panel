"use client";

import React from "react";
import { CardActionButton } from "@/components/ui/CardActionButton";
import type { LiveEnrollment } from "@/types/liveClass";
import { LiveAvatarStack } from "../qa/LiveInitialsAvatar";
import { LiveTabCard } from "../qa/LiveTabCard";

/** "Participants Activity": avatar stack of attended students (+N) and "View All" → Students tab. */
export function ParticipantsCard({ enrollments, onViewAll }: { enrollments: LiveEnrollment[]; onViewAll: () => void }) {
  const attended = enrollments.filter((e) => e.status === "ATTENDED").sort((a, b) => a.joinTime.localeCompare(b.joinTime));
  return (
    <LiveTabCard variant="side" title="Participants Activity" action={<CardActionButton onClick={onViewAll}>View All</CardActionButton>}>
      {attended.length ? (
        <>
          <LiveAvatarStack names={attended.map((e) => e.student.name)} total={attended.length} max={7} size="md" />
          <p className="mt-3 body-xsm-regular text-primary-300">
            {attended.length} of {enrollments.length} enrolled student{enrollments.length === 1 ? "" : "s"} joined this class.
          </p>
        </>
      ) : (
        <p className="rounded-xl border border-dashed border-dash px-4 py-6 text-center body-sm-regular text-primary-300">No students have joined yet.</p>
      )}
    </LiveTabCard>
  );
}

export default ParticipantsCard;
