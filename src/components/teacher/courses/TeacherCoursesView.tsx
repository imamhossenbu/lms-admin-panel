"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, ClipboardCheck, GraduationCap, Star, Users } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { LoadErrorCard } from "@/components/ui/LoadErrorCard";
import { PageFade } from "../shared/PageFade";
import { EmptyRow } from "../shared/EmptyRow";
import { useTeacherCourses } from "../shared/useTeacherCourses";

/** The courses this teacher teaches, as cards with students, lessons, rating and work to grade. */
export function TeacherCoursesView() {
  const { courses, error } = useTeacherCourses();
  if (error && !courses) return <LoadErrorCard title="Couldn't load your courses" message={error} onRetry={() => window.location.reload()} />;
  if (!courses)
    return (
      <div className="grid animate-pulse gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-dash bg-white">
            <span className="block aspect-video bg-slate-100" />
            <div className="space-y-2 p-5">
              <span className="block h-5 w-3/4 rounded bg-slate-200" />
              <span className="block h-4 w-1/2 rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    );

  return (
    <PageFade>
      <PageHeader title="My Courses" description="Courses you teach. Ask an admin to change a course's content or price." />
      {courses.length === 0 ? (
        <div className="dashboard-card">
          <EmptyRow icon={<GraduationCap className="h-6 w-6" />} title="No courses yet" text="When an admin assigns you as the instructor of a course, it appears here." />
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} whileHover={{ y: -3 }}>
              <Link href={`/teach/courses/${c.id}`} className="group block overflow-hidden rounded-xl border border-dash bg-white shadow-2xs transition-shadow hover:shadow-md">
                <div className="relative aspect-video bg-slate-100">
                  {c.thumbnail ? <Image src={c.thumbnail} alt={c.title} fill sizes="400px" className="object-cover" /> : <span className="absolute inset-0 flex items-center justify-center text-brand-orange"><BookOpen className="h-8 w-8" /></span>}
                  <ToneBadge tone={c.status === "PUBLISHED" ? "green" : "gray"} size="sm" className="absolute left-3 top-3">
                    {c.status === "PUBLISHED" ? "Published" : c.status.charAt(0) + c.status.slice(1).toLowerCase()}
                  </ToneBadge>
                </div>
                <div className="p-5">
                  <p className="body-xsm-medium text-primary-300">{c.category?.name ?? "Course"}</p>
                  <h3 className="mt-1 line-clamp-2 body-l-medium font-semibold text-primary-500 group-hover:text-brand-orange">{c.title}</h3>
                  <div className="mt-4 grid grid-cols-3 gap-2 border-t border-dash pt-4 body-xsm-medium text-primary-400">
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-blue" />
                      {c.students}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-purple" />
                      {c.lessons} lessons
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Star className="h-3.5 w-3.5 text-yellow" />
                      {c.rating ? c.rating.toFixed(1) : "—"}
                    </span>
                  </div>
                  {c.pendingSubmissions > 0 && (
                    <p className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-brand-orange-light px-2 py-1 body-xsm-medium text-brand-orange">
                      <ClipboardCheck className="h-3.5 w-3.5" />
                      {c.pendingSubmissions} to grade
                    </p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </PageFade>
  );
}

export default TeacherCoursesView;
