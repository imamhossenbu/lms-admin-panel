"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { CardActionButton } from "@/components/ui/CardActionButton";
import type { LiveActivity } from "@/types/liveClass";
import { ActivityItem, type ActivityItemProps } from "./ActivityItem";

const PAGE = 15;

export interface ActivityTimelineProps {
  items: LiveActivity[];
  classDate: string;
  joined: ActivityItemProps["joined"];
  resourceIds: Set<string>;
  onViewQuestion: (id: string) => void;
  onViewResource: () => void;
}

/** Vertical timeline (first 15 events, then "Show More"). */
export function ActivityTimeline({ items, classDate, joined, resourceIds, onViewQuestion, onViewResource }: ActivityTimelineProps) {
  const [limit, setLimit] = useState(PAGE);
  const shown = items.slice(0, limit);
  const dayOf = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };
  return (
    <div>
      <ol>
        {shown.map((a, i) => (
          <ActivityItem
            key={a.id}
            item={a}
            index={i}
            last={i === shown.length - 1}
            showDate={dayOf(a.at) !== classDate}
            joined={joined}
            onViewQuestion={onViewQuestion}
            onViewResource={a.refId && resourceIds.has(a.refId) ? onViewResource : undefined}
          />
        ))}
      </ol>
      {items.length > limit && (
        <div className="mt-3 flex justify-center">
          <CardActionButton icon={<ChevronDown className="h-4 w-4" />} onClick={() => setLimit((l) => l + PAGE)}>
            Show More ({items.length - limit})
          </CardActionButton>
        </div>
      )}
    </div>
  );
}

export default ActivityTimeline;
