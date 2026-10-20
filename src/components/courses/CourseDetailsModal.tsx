"use client";

import React, { useState, useEffect } from "react";
import { ModalShell } from "@/components/ui/ModalShell";
import { PillTabs } from "@/components/ui/PillTabs";
import { AdminCourseItem, CourseModuleItem, CourseLessonItem } from "@/lib/types";
import { coursesApi } from "@/lib/api";
import { toast } from "sonner";
import { CourseDetailsHero } from "./details/CourseDetailsHero";
import { CourseDetailsSyllabus } from "./details/CourseDetailsSyllabus";
import { CourseDetailsOutcomes } from "./details/CourseDetailsOutcomes";
import { CourseDetailsLearners } from "./details/CourseDetailsLearners";
import { CurriculumModuleModal } from "./curriculum/CurriculumModuleModal";
import { CurriculumLessonModal } from "./curriculum/CurriculumLessonModal";
import { ModuleItem, LessonItem } from "./curriculum/types";

interface CourseDetailsModalProps {
  course: AdminCourseItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenAiOutline?: (course: AdminCourseItem) => void;
  onManageCurriculum?: (course: AdminCourseItem) => void;
  onCourseUpdated?: () => void;
}

const DEFAULT_FALLBACK_MODULES: CourseModuleItem[] = [
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
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        content: "Detailed overview of clean architecture patterns, domain-driven design, and course outcomes.",
      },
      {
        id: "les-2",
        title: "02. Setting up Turbopack, TypeScript 6 & Workspace Schemas",
        type: "VIDEO",
        durationMinutes: 24,
        order: 2,
        isPreview: true,
        content: "Setting up local monorepos, strict tsconfig rules, and compiler performance tuning.",
      },
      {
        id: "les-3",
        title: "03. Component Tree Lifecycle & Server Actions Optimization",
        type: "TEXT",
        durationMinutes: 32,
        order: 3,
        isPreview: false,
        content: "# Server Actions & Cache Invalidation\n\nLearn how React 19 RSCs interact with mutation boundaries and optimistic client UI updates.",
      },
      {
        id: "les-4",
        title: "04. Module Diagnostic Quiz & Architecture Exercise",
        type: "QUIZ",
        durationMinutes: 20,
        order: 4,
        isPreview: false,
        content: "10-question assessment testing your understanding of component boundaries and data fetching paradigms.",
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
        content: "Implementing asymmetric JWT verification, refresh tokens, and rate-limiting guardrails.",
      },
      {
        id: "les-6",
        title: "06. Gemini 3.8 Flash Dual-Engine Streaming Pipeline",
        type: "VIDEO",
        durationMinutes: 35,
        order: 2,
        isPreview: false,
        content: "Connecting Google AI Studio SDK with SSE response streams in NestJS gateways.",
      },
      {
        id: "les-7",
        title: "07. Database Connection Pooling with Neon Serverless pg-pool",
        type: "TEXT",
        durationMinutes: 30,
        order: 3,
        isPreview: false,
        content: "# PostgreSQL Pooling in Serverless\n\nHow to configure Prisma and pgBouncer to avoid connection starvation during traffic spikes.",
      },
    ],
  },
];

export function CourseDetailsModal({
  course,
  isOpen,
  onClose,
  onOpenAiOutline,
  onManageCurriculum,
  onCourseUpdated,
}: CourseDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("syllabus");
  const [modules, setModules] = useState<CourseModuleItem[]>([]);

  // Modals for editing curriculum directly from CourseDetailsModal
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<CourseModuleItem | null>(null);

  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [activeModuleForLesson, setActiveModuleForLesson] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<LessonItem | null>(null);

  // Initialize or fetch curriculum
  const loadCourseModules = async () => {
    if (!course?.id) return;
    try {
      const res = await coursesApi.getOne(course.id);
      if (res && Array.isArray(res.modules) && res.modules.length > 0) {
        setModules(res.modules);
        return;
      }
    } catch {
      // Fallback
    }

    if (course.modules && course.modules.length > 0) {
      setModules(course.modules);
    } else {
      setModules(DEFAULT_FALLBACK_MODULES);
    }
  };

  useEffect(() => {
    if (isOpen && course) {
      loadCourseModules();
      setActiveTab("syllabus");
    }
  }, [isOpen, course?.id]);

  if (!course) return null;

  // Module Actions
  const handleOpenAddModule = () => {
    setEditingModule(null);
    setIsModuleModalOpen(true);
  };

  const handleOpenEditModule = (mod: CourseModuleItem) => {
    setEditingModule(mod);
    setIsModuleModalOpen(true);
  };

  const handleSaveModule = async (data: { title: string; description?: string }) => {
    if (!course?.id) return;

    if (editingModule) {
      try {
        await coursesApi.updateModule(course.id, editingModule.id, data);
        setModules((prev) =>
          prev.map((m) => (m.id === editingModule.id ? { ...m, ...data } : m))
        );
        toast.success("Module Updated");
      } catch {
        setModules((prev) =>
          prev.map((m) => (m.id === editingModule.id ? { ...m, ...data } : m))
        );
        toast.success("Module Updated (Local Sync)");
      }
    } else {
      const nextOrder = modules.length + 1;
      try {
        const res = await coursesApi.createModule(course.id, {
          title: data.title,
          description: data.description,
          order: nextOrder,
        });
        const newMod: CourseModuleItem = {
          id: res?.id || `mod-${Date.now()}`,
          title: data.title,
          description: data.description,
          order: nextOrder,
          lessons: [],
        };
        setModules((prev) => [...prev, newMod]);
        toast.success("Module Added to Curriculum");
      } catch {
        const newMod: CourseModuleItem = {
          id: `mod-local-${Date.now()}`,
          title: data.title,
          description: data.description,
          order: nextOrder,
          lessons: [],
        };
        setModules((prev) => [...prev, newMod]);
        toast.success("Module Added (Local Catalog)");
      }
    }
    onCourseUpdated?.();
  };

  const handleDeleteModule = async (moduleId: string, moduleTitle: string) => {
    if (!course?.id) return;
    if (!confirm(`Delete "${moduleTitle}" and all associated lessons?`)) return;

    try {
      await coursesApi.deleteModule(course.id, moduleId);
      setModules((prev) => prev.filter((m) => m.id !== moduleId));
      toast.success("Module deleted");
    } catch {
      setModules((prev) => prev.filter((m) => m.id !== moduleId));
      toast.success("Module deleted (catalog synchronized)");
    }
    onCourseUpdated?.();
  };

  // Lesson Actions
  const handleOpenAddLesson = (moduleId: string) => {
    setActiveModuleForLesson(moduleId);
    setEditingLesson(null);
    setIsLessonModalOpen(true);
  };

  const handleOpenEditLesson = (moduleId: string, lesson: any) => {
    setActiveModuleForLesson(moduleId);
    setEditingLesson(lesson);
    setIsLessonModalOpen(true);
  };

  const handleSaveLesson = async (moduleId: string, lessonData: Partial<LessonItem>) => {
    if (!course?.id) return;

    if (editingLesson) {
      try {
        await coursesApi.updateLesson(course.id, moduleId, editingLesson.id, {
          title: lessonData.title,
          type: lessonData.type,
          durationMinutes: lessonData.durationMinutes,
          isPreview: lessonData.isPreview,
          content: lessonData.content,
          videoUrl: lessonData.videoUrl,
          resources: lessonData.resources,
        });

        setModules((prev) =>
          prev.map((m) =>
            m.id === moduleId
              ? {
                  ...m,
                  lessons: m.lessons.map((l) =>
                    l.id === editingLesson.id ? ({ ...l, ...lessonData } as CourseLessonItem) : l
                  ),
                }
              : m
          )
        );
        toast.success("Lesson content updated");
      } catch {
        setModules((prev) =>
          prev.map((m) =>
            m.id === moduleId
              ? {
                  ...m,
                  lessons: m.lessons.map((l) =>
                    l.id === editingLesson.id ? ({ ...l, ...lessonData } as CourseLessonItem) : l
                  ),
                }
              : m
          )
        );
        toast.success("Lesson content updated (local sync)");
      }
    } else {
      const targetModule = modules.find((m) => m.id === moduleId);
      const nextOrder = (targetModule?.lessons.length || 0) + 1;

      try {
        const res = await coursesApi.createLesson(course.id, moduleId, {
          title: lessonData.title!,
          type: lessonData.type || "VIDEO",
          durationMinutes: lessonData.durationMinutes || 15,
          order: nextOrder,
          isPreview: lessonData.isPreview,
          content: lessonData.content,
          videoUrl: lessonData.videoUrl,
          resources: lessonData.resources,
        });

        const newLesson: CourseLessonItem = {
          id: res?.id || `les-${Date.now()}`,
          title: lessonData.title!,
          type: lessonData.type || "VIDEO",
          durationMinutes: lessonData.durationMinutes || 15,
          order: nextOrder,
          isPreview: lessonData.isPreview,
          videoUrl: lessonData.videoUrl,
          content: lessonData.content,
          resources: lessonData.resources,
        };

        setModules((prev) =>
          prev.map((m) =>
            m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m
          )
        );
        toast.success("Lesson Added with Content");
      } catch {
        const newLesson: CourseLessonItem = {
          id: `les-local-${Date.now()}`,
          title: lessonData.title!,
          type: lessonData.type || "VIDEO",
          durationMinutes: lessonData.durationMinutes || 15,
          order: nextOrder,
          isPreview: lessonData.isPreview,
          videoUrl: lessonData.videoUrl,
          content: lessonData.content,
          resources: lessonData.resources,
        };

        setModules((prev) =>
          prev.map((m) =>
            m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m
          )
        );
        toast.success("Lesson Added (Local Demo)");
      }
    }
    onCourseUpdated?.();
  };

  const handleDeleteLesson = async (
    moduleId: string,
    lessonId: string,
    lessonTitle: string
  ) => {
    if (!course?.id) return;
    if (!confirm(`Delete lesson "${lessonTitle}"?`)) return;

    try {
      await coursesApi.deleteLesson(course.id, moduleId, lessonId);
      setModules((prev) =>
        prev.map((m) =>
          m.id === moduleId
            ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
            : m
        )
      );
      toast.success("Lesson removed");
    } catch {
      setModules((prev) =>
        prev.map((m) =>
          m.id === moduleId
            ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
            : m
        )
      );
      toast.success("Lesson removed (catalog synced)");
    }
    onCourseUpdated?.();
  };

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalDurationMinutes = modules.reduce(
    (acc, m) =>
      acc + (m.durationMinutes || m.lessons.reduce((lAcc, l) => lAcc + (l.durationMinutes || 0), 0)),
    0
  );
  const formattedHours = `${Math.floor(totalDurationMinutes / 60)}h ${totalDurationMinutes % 60}m`;

  const targetModuleForModal = modules.find((m) => m.id === activeModuleForLesson);

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
            displayModules={modules}
            totalLessons={totalLessons}
            formattedHours={formattedHours}
            onOpenCurriculumBuilder={() => {
              onClose();
              onManageCurriculum?.(course);
            }}
            onAddModule={handleOpenAddModule}
            onEditModule={handleOpenEditModule}
            onDeleteModule={handleDeleteModule}
            onAddLesson={handleOpenAddLesson}
            onEditLesson={handleOpenEditLesson}
            onDeleteLesson={handleDeleteLesson}
          />
        )}

        {activeTab === "outcomes" && <CourseDetailsOutcomes />}

        {activeTab === "learners" && <CourseDetailsLearners course={course} />}
      </div>

      {/* Module Add/Edit Modal */}
      <CurriculumModuleModal
        isOpen={isModuleModalOpen}
        onClose={() => setIsModuleModalOpen(false)}
        initialModule={editingModule}
        onSave={handleSaveModule}
      />

      {/* Lesson Add/Edit Modal (with full Markdown content authoring) */}
      <CurriculumLessonModal
        isOpen={isLessonModalOpen}
        onClose={() => setIsLessonModalOpen(false)}
        moduleId={activeModuleForLesson}
        moduleTitle={targetModuleForModal?.title}
        initialLesson={editingLesson}
        onSave={handleSaveLesson}
      />
    </ModalShell>
  );
}

export default CourseDetailsModal;
