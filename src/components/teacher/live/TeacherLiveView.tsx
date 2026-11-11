"use client";

import React from "react";
import { PlayCircle, Radio, Users, Video } from "lucide-react";
import { teacherApi } from "@/lib/api/teacher";
import { usePagedList } from "@/lib/usePagedList";
import { useUrlParams } from "@/lib/useUrlParams";
import { PageHeader } from "@/components/ui/PageHeader";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { LoadErrorCard } from "@/components/ui/LoadErrorCard";
import { PageFade } from "../shared/PageFade";
import { EmptyRow } from "../shared/EmptyRow";
import { fmtDateTime } from "../shared/format";

/** The teacher's live classes — upcoming (start link) or past (recording, attendees). */
export function TeacherLiveView() {
  const { get, set } = useUrlParams();
  const when = get("when") === "past" ? "past" : "upcoming";
  const list = usePagedList(() => teacherApi.live(when), when);
  return (
    <PageFade>
      <PageHeader title="Live Classes" description="Classes you teach. Admins schedule them; you start them from here." action={<SegmentedControl options={[{ value: "upcoming", label: "Upcoming" }, { value: "past", label: "Past" }]} value={when} onChange={(v) => set({ when: v === "upcoming" ? null : v })} />} />
      {list.error && !list.data ? (
        <LoadErrorCard title="Couldn't load live classes" message={list.error} onRetry={list.reload} />
      ) : !list.data ? (
        <div className="animate-pulse space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-4 rounded-xl border border-dash bg-white p-4">
              <span className="h-12 w-12 rounded-lg bg-slate-200" />
              <div className="flex-1 space-y-2">
                <span className="block h-4 w-1/2 rounded bg-slate-200" />
                <span className="block h-3 w-1/3 rounded bg-slate-100" />
              </div>
              <span className="h-9 w-24 rounded-lg bg-slate-100" />
            </div>
          ))}
        </div>
      ) : list.data.length === 0 ? (
        <div className="dashboard-card">
          <EmptyRow icon={<Radio className="h-6 w-6" />} title={when === "upcoming" ? "No upcoming classes" : "No past classes"} text="Live classes for your courses appear here." />
        </div>
      ) : (
        <div className="space-y-3">
          {list.data.map((l) => (
            <div key={l.id} className="dashboard-card shadow-2xs flex flex-wrap items-center gap-4 p-4">
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
              {l.status !== "ENDED" ? (
                <a href={l.meetingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-orange px-3 body-sm-medium text-white hover:bg-brand-orange-hover">
                  <Video className="h-4 w-4" />
                  Start
                </a>
              ) : l.recordingUrl ? (
                <a href={l.recordingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-dash px-3 body-sm-medium text-primary-500 hover:border-primary-300">
                  <PlayCircle className="h-4 w-4" />
                  Recording
                </a>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </PageFade>
  );
}

export default TeacherLiveView;
