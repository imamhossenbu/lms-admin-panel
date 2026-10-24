"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { CoursesSkeleton } from "@/components/courses/CoursesSkeleton";
import Link from "next/link";
import {
  ArrowLeft,
  Edit3,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  Loader2,
  AlertCircle,
  FileText,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import PrimaryButton from "@/components/ui/primary-button";
import SecondaryButton from "@/components/ui/secondary-button";
import { PillTabs } from "@/components/ui/PillTabs";
import { CourseDetailsHero } from "@/components/courses/details/CourseDetailsHero";
import { CourseDetailsSyllabus } from "@/components/courses/details/CourseDetailsSyllabus";
import { CourseDetailsOutcomes } from "@/components/courses/details/CourseDetailsOutcomes";
import { CourseDetailsLearners } from "@/components/courses/details/CourseDetailsLearners";
import { AdminCourseItem, CourseModuleItem } from "@/lib/types";
import { coursesApi } from "@/lib/api";

function CourseDetailsContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const courseId = params?.id as string;

  const urlTab = searchParams.get("tab") as "syllabus" | "outcomes" | "learners";
  const [activeTab, setActiveTab] = useState<"syllabus" | "outcomes" | "learners">(
    urlTab && ["syllabus", "outcomes", "learners"].includes(urlTab) ? urlTab : "syllabus"
  );
  const [course, setCourse] = useState<AdminCourseItem | null>(null);
  const [modules, setModules] = useState<CourseModuleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (urlTab && ["syllabus", "outcomes", "learners"].includes(urlTab)) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

  const handleTabChange = (newTab: string) => {
    const valid = newTab as "syllabus" | "outcomes" | "learners";
    setActiveTab(valid);
    const p = new URLSearchParams(window.location.search);
    p.set("tab", valid);
    router.replace(`?${p.toString()}`, { scroll: false });
  };

  const fetchCourseData = async () => {
    if (!courseId) return;
    setIsLoading(true);
    try {
      const data = await coursesApi.getOne(courseId);
      if (data) {
        setCourse(data);
        if (Array.isArray(data.modules)) {
          setModules(data.modules);
        } else {
          setModules([]);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch course details from backend:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="p-20 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#1C4D8D] mx-auto" />
        <p className="body-sm-medium text-primary-400">Loading Course Overview & Syllabus...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="title-sm text-primary-500 font-bold">Course Not Found</h3>
          <p className="body-sm-regular subtext-500 mt-1">
            The requested course could not be located in the catalog or may have been deleted.
          </p>
        </div>
        <PrimaryButton onClick={() => router.push("/courses")} icon={<ArrowLeft className="w-4 h-4" />}>
          Back to Courses Catalog
        </PrimaryButton>
      </div>
    );
  }

  const totalLessons = modules.reduce(
    (acc, m) => acc + (m.lessons ? m.lessons.length : 0),
    0
  );
  const totalMinutes = modules.reduce(
    (acc, m) => acc + (m.durationMinutes || 0),
    0
  );
  const formattedHours = `${Math.round(totalMinutes / 60) || 12}h ${totalMinutes % 60}m`;

  return (
    <div className="space-y-6 text-left max-w-6xl mx-auto">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#EDEDED]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-primary-400">
            <Link href="/courses" className="hover:text-[#1C4D8D] transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Courses Catalog</span>
            </Link>
            <span>/</span>
            <span className="text-[#1C4D8D] font-semibold truncate max-w-xs">{course.title}</span>
            <span>/</span>
            <span>Overview & Syllabus</span>
          </div>
          <h1 className="title-md text-primary-500 font-bold tracking-tight">
            {course.title}
          </h1>
        </div>

        {/* Action Button: Exclusively Route to Dedicated Edit Studio */}
        <div className="flex items-center gap-2.5 shrink-0">
          <SecondaryButton
            onClick={() => router.push("/courses")}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Back
          </SecondaryButton>
          <PrimaryButton
            onClick={() => router.push(`/courses/${course.id}/edit`)}
            icon={<Edit3 className="w-4 h-4" />}
          >
            Edit Course & Studio
          </PrimaryButton>
        </div>
      </div>

      {/* Hero Overview */}
      <CourseDetailsHero
        course={course}
        formattedHours={formattedHours}
        onEditCourse={() => router.push(`/courses/${course.id}/edit`)}
      />

      {/* Tabs */}
      <PillTabs
        activeId={activeTab}
        onChange={handleTabChange}
        tabs={[
          { id: "syllabus", label: `Curriculum & Syllabus (${totalLessons} Lessons)` },
          { id: "outcomes", label: "Learning Outcomes & Prerequisites" },
          { id: "learners", label: `Enrolled Students (${course.totalStudents.toLocaleString()})` },
        ]}
      />

      {/* Tab Panels */}
      {activeTab === "syllabus" && (
        <CourseDetailsSyllabus
          displayModules={modules}
          totalLessons={totalLessons}
          formattedHours={formattedHours}
        />
      )}

      {activeTab === "outcomes" && <CourseDetailsOutcomes />}

      {activeTab === "learners" && <CourseDetailsLearners course={course} />}
    </div>
  );
}

export default function CourseDetailsPage() {
  return (
    <Suspense fallback={<CoursesSkeleton />}>
      <CourseDetailsContent />
    </Suspense>
  );
}
