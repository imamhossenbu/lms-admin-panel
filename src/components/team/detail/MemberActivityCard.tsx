"use client";

import React from "react";
import Link from "next/link";
import { History } from "lucide-react";
import type { TeamEvent } from "@/types/team";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { ActivityTimeline } from "../activity/ActivityTimeline";

const MAX = 8;

/** This member's recent events (as target or actor) + link to the full, pre-filtered Activity tab. */
export function MemberActivityCard({ events, searchName, linkableIds }: { events: TeamEvent[]; searchName: string; linkableIds: Set<string> }) {
  return (
    <IconSectionCard
      icon={<History className="h-5 w-5" />}
      tone="blue"
      title="Activity"
      description="Invitations, role changes and security events."
      action={
        events.length > MAX ? (
          <Link href={`/users?tab=activity&q=${encodeURIComponent(searchName)}`} className="body-sm-medium text-brand-orange hover:underline">
            View all {events.length}
          </Link>
        ) : undefined
      }
    >
      {events.length ? (
        <ActivityTimeline events={events.slice(0, MAX)} linkableIds={linkableIds} compact />
      ) : (
        <p className="rounded-lg border border-dashed border-dash bg-gray-bg px-4 py-5 text-center body-sm-regular text-primary-300">No activity recorded yet.</p>
      )}
    </IconSectionCard>
  );
}

export default MemberActivityCard;
