"use client";

import React from "react";
import { Clock, Download, MessageSquareText, PencilLine, Users } from "lucide-react";
import { CardActionButton } from "@/components/ui/CardActionButton";
import { cn } from "@/lib/cn";
import { LiveTabCard } from "../qa/LiveTabCard";

export interface ActivitySummaryCardProps {
  asked: number;
  answered: number;
  answeredPct: number;
  joined: number;
  avgWatch: string;
  onDownload: () => void;
  downloadDisabled?: boolean;
}

/** 2×2 "Activity Summary" chips + "Download Log". */
export function ActivitySummaryCard(p: ActivitySummaryCardProps) {
  const chips = [
    { label: "Questions Asked", value: p.asked, icon: MessageSquareText, tone: "bg-purple-14 text-purple" },
    { label: "Questions Answered", value: p.answered, icon: PencilLine, tone: "bg-blue-14 text-blue", extra: `${p.answeredPct}%` },
    { label: "Total Joined", value: p.joined, icon: Users, tone: "bg-green-bg text-green" },
    { label: "Avg. Watch Time", value: p.avgWatch, icon: Clock, tone: "bg-red-14 text-red" },
  ];
  return (
    <LiveTabCard
      variant="side"
      title="Activity Summary"
      action={
        <CardActionButton icon={<Download className="h-4 w-4" />} onClick={p.onDownload} disabled={p.downloadDisabled}>
          Download Log
        </CardActionButton>
      }
    >
      <div className="@container">
        <div className="grid grid-cols-1 gap-2.5 @2xs:grid-cols-2">
          {chips.map((c) => (
            <div key={c.label} className="flex items-center gap-3 rounded-xl border border-dash p-3">
              <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", c.tone)}>
                <c.icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-baseline justify-between gap-1">
                  <span className="heading-h5 font-semibold! text-primary-500">{c.value}</span>
                  {c.extra && <span className="body-xsm-medium text-green">{c.extra}</span>}
                </p>
                <p className="truncate body-xsm-regular text-primary-300">{c.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </LiveTabCard>
  );
}

export default ActivitySummaryCard;
