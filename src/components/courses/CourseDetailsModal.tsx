"use client";

import React, { useState } from "react";
import { ModalShell } from "@/components/ui/ModalShell";
import { PillTabs } from "@/components/ui/PillTabs";
import SecondaryButton from "@/components/ui/secondary-button";
import { AdminCourseItem, CourseModuleItem } from "@/lib/types";
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
}

export function CourseDetailsModal({
  course,
  isOpen,
  onClose,
  onOpenAiOutline,
  onManageCurriculum,
}: CourseDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("syllabus");

  if (!course) return null;

  // High-fidelity fallback curriculum if course modules not yet seeded from backend
  const displayModules: CourseModuleItem[] =
    course.modules && course.modules.length > 0
      ? course.modules
      : [
          {
            id: "mod-1",
            title: "Module 1: Foundations & Architecture Design",
            description: "Core architectural paradigms, environment setup, and framework fundamentals.",
            order: 1,
            durationMinutes: 145,
            lessons: [
              {
                id: "les-1",
                title: "01. Introduction to Enterprise Architecture & Course Roadmap",
                type: "VIDEO",
                durationMinutes: 18,
                order: 1,
                isPreview: true,
                videoUrl: "https://youtube.com/watch?v=demo1",
              },
              {
                id: "les-2",
                title: "02. Setting up Turbopack, TypeScript 6 & Workspace Schemas",
                type: "VIDEO",
                durationMinutes: 24,
                order: 2,
                isPreview: true,
              },
              {
                id: "les-3",
                title: "03. Component Tree Lifecycle & Server Actions Optimization",
                type: "VIDEO",
                durationMinutes: 32,
                order: 3,
                isPreview: false,
              },
              {
                id: "les-4",
                title: "04. Module Diagnostic Quiz & Architecture Exercise",
                type: "QUIZ",
                durationMinutes: 20,
                order: 4,
                isPreview: false,
              },
            ],
          },
          {
            id: "mod-2",
            title: "Module 2: Advanced Telemetry, State & AI Orchestration",
            description: "Production telemetry pipelines, sub-second inference, and PostgreSQL pooling.",
            order: 2,
            durationMinutes: 210,
            lessons: [
              {
                id: "les-5",
                title: "05. Microservices Authentication with Zero-Trust Tokens",
                type: "VIDEO",
                durationMinutes: 28,
                order: 1,
                isPreview: false,
              },
              {
                id: "les-6",
                title: "06. Gemini 3.8 Flash Dual-Engine Streaming Pipeline",
                type: "VIDEO",
                durationMinutes: 35,
                order: 2,
                isPreview: false,
              },
              {
                id: "les-7",
                title: "07. Database Connection Pooling with Neon Serverless pg-pool",
                type: "VIDEO",
                durationMinutes: 30,
                order: 3,
                isPreview: false,
              },
            ],
          },
        ];

  const totalLessons = displayModules.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalDurationMinutes = displayModules.reduce(
    (acc, m) =>
      acc + (m.durationMinutes || m.lessons.reduce((lAcc, l) => lAcc + l.durationMinutes, 0)),
    0
  );
  const formattedHours = `${Math.floor(totalDurationMinutes / 60)}h ${totalDurationMinutes % 60}m`;

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={course.title}
      subtitle={`Curriculum ID: ${course.id} • Category: ${course.category?.name || "General"}`}
      maxWidth="2xl"
    >
      <div className="space-y-6 text-left">
        {/* Hero Course Banner & Key Metadata */}
        <CourseDetailsHero
          course={course}
          formattedHours={formattedHours}
          onClose={onClose}
          onOpenAiOutline={onOpenAiOutline}
          onManageCurriculum={onManageCurriculum}
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
            displayModules={displayModules}
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
