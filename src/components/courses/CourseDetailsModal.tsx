"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ModalShell } from "@/components/ui/ModalShell";
import { PillTabs } from "@/components/ui/PillTabs";
import { AdminCourseItem, CourseModuleItem } from "@/lib/types";
import { coursesApi } from "@/lib/api";
import { CourseDetailsHero } from "./details/CourseDetailsHero";
import { CourseDetailsSyllabus } from "./details/CourseDetailsSyllabus";
import { CourseDetailsOutcomes } from "./details/CourseDetailsOutcomes";
import { CourseDetailsLearners } from "./details/CourseDetailsLearners";

interface CourseDetailsModalProps {
  course: AdminCourseItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenAiOutline?: (course: AdminCourseItem) => void;
  onManageCurriculum?: (course: AdminCourseItem) => void;
  onCourseUpdated?: () => void;
}

export function CourseDetailsModal({
  course,
  isOpen,
  onClose,
}: CourseDetailsModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("syllabus");
  const [modules, setModules] = useState<CourseModuleItem[]>([]);

  // Initialize or fetch curriculum from real backend
  const loadCourseModules = async () => {
    if (!course?.id) return;
    try {
      const res = await coursesApi.getOne(course.id);
      if (res && Array.isArray(res.modules)) {
        setModules(res.modules);
        return;
      }
    } catch {
      // Fallback
    }

    if (course.modules && Array.isArray(course.modules)) {
      setModules(course.modules);
    } else {
      setModules([]);
    }
  };

  useEffect(() => {
    if (isOpen && course) {
      loadCourseModules();
      setActiveTab("syllabus");
    }
  }, [isOpen, course?.id]);

  if (!course) return null;

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
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={course.title}
      subtitle={`Course ID: ${course.id} • Category: ${course.category?.name || "General"}`}
      maxWidth="2xl"
    >
      <div className="space-y-6 text-left">
        {/* Hero Course Banner & Key Metadata */}
        <CourseDetailsHero
          course={course}
          formattedHours={formattedHours}
          onClose={onClose}
          onEditCourse={(c) => {
            onClose();
            router.push(`/courses/${c.id}/edit`);
          }}
        />

        {/* Navigation Tabs */}
        <PillTabs
          activeId={activeTab}
          onChange={setActiveTab}
          tabs={[
            { id: "syllabus", label: `Curriculum & Syllabus (${totalLessons} Lessons)` },
            { id: "outcomes", label: "Learning Outcomes & Prerequisites" },
            { id: "learners", label: `Enrolled Students (${course.totalStudents})` },
          ]}
        />

        {/* Tab Content */}
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
    </ModalShell>
  );
}

export default CourseDetailsModal;
