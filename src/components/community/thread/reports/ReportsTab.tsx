"use client";

import React, { useMemo } from "react";
import { Flag, ShieldCheck } from "lucide-react";
import type { ThreadReport } from "@/types/community";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { ToneBadge } from "@/components/ui/ToneBadge";
import type { ThreadBundle } from "@/lib/communityStorage";
import type { ThreadTabState } from "../hooks/useThreadTab";
import { ReportsTable } from "./ReportsTable";
import { ReviewReportModal } from "./ReviewReportModal";

export interface ReportsTabProps {
  bundle: ThreadBundle;
  tabState: ThreadTabState;
}

/** Reports tab: every report on the thread or its replies (open first), with a Review modal synced to `?review=`. */
export function ReportsTab({ bundle, tabState }: ReportsTabProps) {
  const { thread, replies, reports } = bundle;

  const rows = useMemo(
    () => [...reports].sort((a, b) => Number(b.status === "OPEN") - Number(a.status === "OPEN") || b.createdAt.localeCompare(a.createdAt)),
    [reports]
  );
  const open = reports.filter((r) => r.status === "OPEN").length;
  const active: ThreadReport | null = reports.find((r) => r.id === tabState.reviewId) ?? null;

  return (
    <>
      <IconSectionCard
        icon={<Flag className="h-5 w-5" />}
        title="Reports"
        description="Content in this discussion flagged by members. Resolving a report resolves every open report on the same content."
        tone="red"
        action={
          <div className="flex flex-wrap items-center gap-1.5">
            <ToneBadge tone={open ? "red" : "green"} dot>
              {open} open
            </ToneBadge>
            <ToneBadge tone="gray">{reports.length - open} resolved</ToneBadge>
          </div>
        }
      >
        {reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-dash px-6 py-10 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-bg text-green">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <p className="mt-3 body-md-medium font-semibold! text-primary-500">No reports</p>
            <p className="mt-1 max-w-sm body-sm-regular text-primary-300">Nobody has flagged this discussion or its replies.</p>
          </div>
        ) : (
          <ReportsTable thread={thread} replies={replies} reports={rows} onReview={(r) => tabState.openReview(r.id)} />
        )}
      </IconSectionCard>

      <ReviewReportModal report={active} thread={thread} replies={replies} reports={reports} onClose={() => tabState.openReview(null)} />
    </>
  );
}

export default ReportsTab;
