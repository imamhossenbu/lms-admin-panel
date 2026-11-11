"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, BarChart3, ListTree } from "lucide-react";
import { teacherApi } from "@/lib/api/teacher";
import { usePagedList } from "@/lib/usePagedList";
import { useUrlParams } from "@/lib/useUrlParams";
import { PageHeader } from "@/components/ui/PageHeader";
import { PillTabs } from "@/components/ui/PillTabs";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { LoadErrorCard } from "@/components/ui/LoadErrorCard";
import { PageFade } from "../shared/PageFade";
import { PanelSkeleton } from "../shared/PanelSkeleton";
import { CurriculumEditor } from "../curriculum/CurriculumEditor";
import { CourseOverviewTab } from "./CourseOverviewTab";

type Tab = "overview" | "curriculum";

/** One of the teacher's courses: Overview (stats, completions, reviews) and Curriculum (edit modules + lessons); ?tab= survives reloads. */
export function TeacherCourseDetailView({ id }: { id: string }) {
  const { get, set } = useUrlParams();
  const tab: Tab = get("tab") === "curriculum" ? "curriculum" : "overview";
  const d = usePagedList(() => teacherApi.course(id), id);
  if (d.error && !d.data) return <LoadErrorCard title="Couldn't load this course" message={d.error} onRetry={d.reload} />;
  if (!d.data) return <PanelSkeleton stats={4} />;
  const c = d.data;
  const lessons = c.modules.reduce((s, m) => s + m.lessons.length, 0);

  return (
    <PageFade>
      <Link href="/teach/courses" className="inline-flex items-center gap-1.5 body-sm-medium text-primary-400 hover:text-primary-500">
        <ArrowLeft className="h-4 w-4" />
        My Courses
      </Link>
      <PageHeader
        title={c.title}
        description={c.shortDescription}
        action={
          <ToneBadge tone={c.status === "PUBLISHED" ? "green" : "gray"} dot>
            {c.status === "PUBLISHED" ? "Published" : c.status.charAt(0) + c.status.slice(1).toLowerCase()}
          </ToneBadge>
        }
      />
      <PillTabs<Tab>
        ariaLabel="Course sections"
        tabs={[
          { id: "overview", label: "Overview", icon: <BarChart3 className="h-4 w-4" /> },
          { id: "curriculum", label: "Curriculum", icon: <ListTree className="h-4 w-4" />, count: lessons },
        ]}
        activeId={tab}
        onChange={(t) => set({ tab: t === "overview" ? null : t })}
      />
      {tab === "overview" ? <CourseOverviewTab c={c} /> : <CurriculumEditor course={c} onChanged={d.reload} />}
    </PageFade>
  );
}

export default TeacherCourseDetailView;
