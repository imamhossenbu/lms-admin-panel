"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  CourseDetailsSkeleton,
  CourseDetailsTabKey,
} from "@/components/courses/details/CourseDetailsSkeleton";
import {
  ArrowLeft,
  Edit3,
  AlertCircle,
} from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import PrimaryButton from "@/components/ui/primary-button";
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
    return <CourseDetailsSkeleton activeTab={activeTab} />;
  }

  if (!course) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <div className="w-12 h-12 rounded-full bg-red-14 text-red flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="title-sm text-primary-500">Course Not Found</h3>
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-dash">
        <div className="space-y-1">
          <Breadcrumb items={[{ label: "Courses", href: "/courses" }, { label: course.title }]} />
          <h1 className="title-md text-primary-500 tracking-tight">
            {course.title}
          </h1>
        </div>

        {/* Action Button: Exclusively Route to Dedicated Edit Studio */}
        <PrimaryButton
          onClick={() => router.push(`/courses/${course.id}/edit`)}
          icon={<Edit3 className="w-4 h-4" />}
          className="shrink-0"
        >
          Edit Course & Studio
        </PrimaryButton>
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

function CourseDetailsSuspenseFallback() {
  const searchParams = useSearchParams();
  const tab = (searchParams.get("tab") as CourseDetailsTabKey) || "syllabus";
  return <CourseDetailsSkeleton activeTab={tab} />;
}

export default function CourseDetailsPage() {
  return (
    <Suspense fallback={<CourseDetailsSuspenseFallback />}>
      <CourseDetailsContent />
    </Suspense>
  );
}
