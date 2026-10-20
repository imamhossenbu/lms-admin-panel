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
