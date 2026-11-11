"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, ClipboardCheck, MessageCircleQuestion, Radio, Star, Users, Video } from "lucide-react";
import { teacherApi } from "@/lib/api/teacher";
import { usePagedList } from "@/lib/usePagedList";
import { useAppSelector } from "@/store/hooks";
import { PageHeader } from "@/components/ui/PageHeader";
import { TrendStatCard } from "@/components/ui/TrendStatCard";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { Avatar } from "@/components/ui/Avatar";
import { LoadErrorCard } from "@/components/ui/LoadErrorCard";
import { PageFade } from "../shared/PageFade";
import { PanelSkeleton } from "../shared/PanelSkeleton";
import { ago, fmtDateTime } from "../shared/format";

/** Teacher home: four stats, upcoming live classes, latest submissions, open questions. */
export function TeacherDashboardView() {
  const name = useAppSelector((s) => s.auth.user?.name ?? "");
  const d = usePagedList(() => teacherApi.dashboard(), "dash");
  if (d.error && !d.data) return <LoadErrorCard title="Couldn't load your dashboard" message={d.error} onRetry={d.reload} />;
  if (!d.data) return <PanelSkeleton stats={4} />;
  const s = d.data.stats;

  return (
    <PageFade>
      <PageHeader title={`Welcome back, ${name.split(" ")[0] || "Teacher"}`} description="Your courses, students and what needs your attention today." />
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <TrendStatCard icon={<BookOpen />} iconClassName="bg-blue-14 text-blue" label="My courses" value={`${s.courses}`} />
        <TrendStatCard icon={<Users />} iconClassName="bg-green-bg text-green" label="Students" value={s.students.toLocaleString("en-US")} />
        <TrendStatCard icon={<ClipboardCheck />} iconClassName="bg-brand-orange-light text-brand-orange" label="To grade" value={`${s.pendingSubmissions}`} />
        <TrendStatCard icon={<Star />} iconClassName="bg-yellow-bg text-yellow" label={`Rating (${s.reviews} reviews)`} value={s.rating ? s.rating.toFixed(1) : "—"} />
      </div>

      {s.openQuestions > 0 && (
        <Link href="/teach/questions" className="flex items-center gap-3 rounded-xl border border-blue bg-blue-14 p-4 body-sm-medium text-blue">
          <MessageCircleQuestion className="h-5 w-5" />
          {s.openQuestions} student question{s.openQuestions === 1 ? "" : "s"} waiting for your answer
          <ArrowRight className="ml-auto h-4 w-4" />
        </Link>
      )}

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="dashboard-card shadow-2xs p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="body-l-medium font-semibold text-primary-500">Upcoming live classes</h2>
            <Link href="/teach/live" className="body-sm-medium text-brand-orange hover:underline">
              See all
            </Link>
          </div>
          {d.data.upcomingLive.length ? (
            <ul className="space-y-3">
              {d.data.upcomingLive.map((l) => (
                <li key={l.id} className="flex items-center gap-3 rounded-lg border border-dash p-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange-light text-brand-orange">
                    <Radio className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate body-sm-medium text-primary-500">{l.title}</span>
                    <span className="block truncate body-xsm-regular text-primary-300">
                      {fmtDateTime(l.startTime)} · {l.course.title}
                    </span>
                  </span>
                  {l.status === "LIVE" ? (
                    <a href={l.meetingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-orange px-3 body-sm-medium text-white">
                      <Video className="h-4 w-4" />
                      Start
                    </a>
                  ) : (
                    <ToneBadge tone="orange" size="sm">
                      Upcoming
                    </ToneBadge>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-lg border border-dashed border-dash p-5 text-center body-sm-regular text-primary-300">No live classes scheduled.</p>
          )}
        </section>

        <section className="dashboard-card shadow-2xs p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="body-l-medium font-semibold text-primary-500">Latest submissions</h2>
            <Link href="/teach/grading" className="body-sm-medium text-brand-orange hover:underline">
              Open grading
            </Link>
          </div>
          {d.data.recentSubmissions.length ? (
            <ul className="divide-y divide-dash">
              {d.data.recentSubmissions.map((r) => (
                <li key={r.id} className="flex items-center gap-3 py-3">
                  <Avatar name={r.student.name} src={r.student.avatar} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate body-sm-medium text-primary-500">
                      {r.student.name} · {r.assignment}
                    </span>
                    <span className="block truncate body-xsm-regular text-primary-300">
                      {r.course} · {ago(r.submittedAt)}
                    </span>
                  </span>
                  <ToneBadge tone={r.status === "GRADED" ? "green" : "orange"} size="sm" dot>
                    {r.status === "GRADED" ? "Graded" : "To grade"}
                  </ToneBadge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-lg border border-dashed border-dash p-5 text-center body-sm-regular text-primary-300">No submissions yet.</p>
          )}
        </section>
      </div>
    </PageFade>
  );
}

export default TeacherDashboardView;
