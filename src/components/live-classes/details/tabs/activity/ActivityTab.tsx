"use client";

import React, { Suspense, useMemo } from "react";
import { Activity, Info } from "lucide-react";
import { toast } from "sonner";
import { AppSelect } from "@/components/ui/AppSelect";
import { Skeleton } from "@/components/ui/Skeleton";
import { attendanceStats, formatMinutes, qaStats } from "@/lib/liveClassStats";
import { useUrlParams } from "@/lib/useUrlParams";
import type { LiveActivityKind } from "@/types/liveClass";
import type { LiveTabProps } from "../../liveTabTypes";
import { LiveTabCard } from "../qa/LiveTabCard";
import { LiveTabColumns } from "../qa/LiveTabColumns";
import { TabEmptyState } from "../qa/TabEmptyState";
import { LIVE_QA_FOCUS_KEY } from "../qa/liveTabFormat";
import { ActivitySummaryCard } from "./ActivitySummaryCard";
import { ActivityTimeline } from "./ActivityTimeline";
import { ParticipantsCard } from "./ParticipantsCard";
import { TopQuestionsCard } from "./TopQuestionsCard";
import { ACTIVITY_KINDS, ACTIVITY_META, SCHEDULING_KINDS } from "./activityMeta";
import { exportActivityCsv } from "./activityCsv";

function ActivityTabBody({ bundle, status, onTabChange }: LiveTabProps) {
  const { liveClass, enrollments, questions } = bundle;
  const { get, set } = useUrlParams();
  const future = status === "UPCOMING" || status === "SCHEDULED";

  const all = useMemo(
    () => [...bundle.activity].filter((a) => !future || SCHEDULING_KINDS.includes(a.kind)).sort((a, b) => a.at.localeCompare(b.at)),
    [bundle.activity, future]
  );
  const present = useMemo(() => ACTIVITY_KINDS.filter((k) => all.some((a) => a.kind === k)), [all]);
  const rawKind = get("akind", "All");
  const kind = (present as string[]).includes(rawKind) ? (rawKind as LiveActivityKind) : "All";
  const items = kind === "All" ? all : all.filter((a) => a.kind === kind);

  const qa = qaStats(questions);
  const att = attendanceStats(enrollments);
  const joinedNames = useMemo(
    () => enrollments.filter((e) => e.status === "ATTENDED").sort((a, b) => a.joinTime.localeCompare(b.joinTime)).map((e) => e.student.name),
    [enrollments]
  );
  const resourceIds = useMemo(() => new Set(bundle.resources.map((r) => r.id)), [bundle.resources]);

  const openQuestion = (id: string) => {
    sessionStorage.setItem(LIVE_QA_FOCUS_KEY, id);
    onTabChange("qa");
  };

  const download = () => {
    exportActivityCsv(liveClass.title, items);
    toast.success("Activity log downloaded", { description: `${items.length} event${items.length === 1 ? "" : "s"} exported as CSV.` });
  };

  return (
    <LiveTabColumns
      main={
        <LiveTabCard
          title="Class Activity"
          subtitle="Track important events and interactions during this live class session."
          action={
            all.length > 0 ? (
              <AppSelect
                value={kind}
                onValueChange={(v) => set({ akind: v })}
                options={[{ value: "All", label: "All Activities" }, ...present.map((k) => ({ value: k, label: ACTIVITY_META[k].label }))]}
                triggerClassName="min-w-44"
              />
            ) : undefined
          }
        >
          {future && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-blue/30 bg-blue-14 p-3.5">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue" />
              <p className="body-sm-regular text-primary-400">
                This class hasn&apos;t started yet. Joins, questions, screen shares and shared resources will appear here in real time once it begins.
              </p>
            </div>
          )}
          {items.length === 0 ? (
            <TabEmptyState icon={<Activity className="h-6 w-6" />} title="No activity yet" description="Events for this class will be listed here." />
          ) : (
            <ActivityTimeline
              key={kind}
              items={items}
              classDate={liveClass.date}
              joined={{ names: joinedNames, total: joinedNames.length }}
              resourceIds={resourceIds}
              onViewQuestion={openQuestion}
              onViewResource={() => onTabChange("resources")}
            />
          )}
        </LiveTabCard>
      }
      side={
        <>
          <ActivitySummaryCard
            asked={qa.asked}
            answered={qa.answered}
            answeredPct={qa.answeredPct}
            joined={att.attended}
            avgWatch={formatMinutes(att.avgWatchMinutes)}
            onDownload={download}
            downloadDisabled={items.length === 0}
          />
          {!future && <TopQuestionsCard questions={questions} onOpen={openQuestion} onViewAll={() => onTabChange("qa")} />}
          <ParticipantsCard enrollments={enrollments} onViewAll={() => onTabChange("students")} />
        </>
      }
    />
  );
}

/** Skeleton mirroring the timeline + summary cards. */
export function ActivityTabSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
      <div className="dashboard-card space-y-4 p-5 xl:col-span-8">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3.5 w-80" />
          </div>
          <Skeleton className="h-10 w-44 rounded-lg" />
        </div>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 border-b border-dash pb-3 last:border-b-0">
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-40" />
              <Skeleton className="h-3 w-64" />
            </div>
            <Skeleton className="h-8 w-28 rounded-lg" />
          </div>
        ))}
      </div>
      <div className="space-y-5 xl:col-span-4">
        <div className="dashboard-card space-y-3 p-4.5">
          <Skeleton className="h-4 w-36" />
          <div className="grid grid-cols-2 gap-2.5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-dash p-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-10" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="dashboard-card space-y-3 p-4.5">
          <Skeleton className="h-4 w-32" />
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-7 w-7 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-4/5" />
                <Skeleton className="h-3 w-3/5" />
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Activity tab: filterable class timeline + summary, top questions and participants. */
export function ActivityTab(props: LiveTabProps) {
  return (
    <Suspense fallback={<ActivityTabSkeleton />}>
      <ActivityTabBody {...props} />
    </Suspense>
  );
}

export default ActivityTab;
